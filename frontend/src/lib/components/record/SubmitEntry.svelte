<script lang="ts">
  import { contractTransact } from "$lib/shared/contract-transact";
  import { toast } from "$lib/store/toast";
  import type { ContractReceipt } from "ethers";
  import Modal from "../elements/Modal.svelte";
  import TransactionSummaryTable from "../elements/TransactionSummaryTable.svelte";
  import { errorSafeFetch } from "$lib/shared/utils";

  export let tableStructure: { name: string; type: string }[];
  export let recordID: string;
  export let isModalOpen: boolean;
  export let toggleModalOpen: () => void;
  export let prefillEntryFormData: Record<string, string> | null;

  let entrySubmitBtn: HTMLButtonElement;
  let addEntryResponse: ContractReceipt | null = null;
  let activeStep = 0;

  let handleEntriesSubmit = async (event: Event) => {
    activeStep = 1;

    // send ipfsData to IPFS and get the hash
    const formData = new FormData(event.target as HTMLFormElement);
    const response = await errorSafeFetch(
      (event.target as HTMLFormElement).action,
      {
        method: "POST",
        body: formData,
      }
    );
    const result = await response?.json();
    if (result.type !== "success") {
      toggleModalOpen();
      toast({
        message: "Failed to submit entry",
        type: "error",
      });
    }

    // send the hash, recipient to the contract
    const recipientAddr = formData.get("RECIPIENT_ETH_ADDR");
    const ipfsHash = result.data.ipfsHash;

    addEntryResponse = await contractTransact(
      prefillEntryFormData ? "updateEntry" : "addEntry",
      [
        recordID,
        ...(prefillEntryFormData ? [prefillEntryFormData.entry_id] : []),
        recipientAddr,
        ipfsHash,
      ]
    );

    if (addEntryResponse?.status === 0) {
      toggleModalOpen();
      toast({
        message: "Failed to submit entry",
        type: "error",
      });
    } else if (addEntryResponse) {
      activeStep = 2;
    }
  };
</script>

<Modal
  open={isModalOpen}
  on:toggle={toggleModalOpen}
  title={activeStep === 0
    ? prefillEntryFormData
      ? "Update Entry"
      : "Add Entry"
    : activeStep === 1
    ? "Processing Transaction"
    : "Transaction Successful"}
  secondaryText={activeStep === 0 ? "Cancel" : undefined}
  primaryText={activeStep === 0 ? "Add" : activeStep === 2 ? "Yay!" : undefined}
  primaryAction={activeStep === 0
    ? () => entrySubmitBtn.click()
    : activeStep === 2
    ? () => window.location.reload()
    : undefined}
>
  {#if activeStep === 0}
    <form
      method="POST"
      action="?/pinJSON"
      class="grid grid-cols-1 md:grid-cols-2 gap-4"
      on:submit|preventDefault={handleEntriesSubmit}
    >
      <div class="form-control">
        <label class="label" for="name">Recipient</label>
        <input
          required
          name="RECIPIENT_ETH_ADDR"
          value={prefillEntryFormData?.recipient || ""}
          pattern="0x[a-fA-F0-9]{`{40}`}"
          type="text"
          placeholder="Enter Recipient Address"
          class="input input-bordered"
        />
      </div>
      {#each tableStructure as field}
        <div class="form-control">
          <label class="label" for="name">{field.name}</label>
          <input
            required
            name={field.name}
            type={field.type}
            value={prefillEntryFormData?.[field.name] || ""}
            placeholder="Enter {field.name}"
            class="input input-bordered"
          />
        </div>
      {/each}
      <button type="submit" hidden bind:this={entrySubmitBtn} />
    </form>
  {:else if activeStep === 1}
    <div class="flex flex-col items-center justify-center">
      <p class="text-neutral/700 text-center">
        Please wait while we process your transaction. We send the data to IPFS
        and then send the hash to the contract. This may take a few seconds.
      </p>
      <progress class="progress w-56 mt-6" />
    </div>
  {:else if activeStep === 2}
    <TransactionSummaryTable transactionResult={addEntryResponse} />
  {/if}
</Modal>
