<script lang="ts">
  import { contractTransact } from "$lib/shared/contract-transact";
  import { toast } from "$lib/store/toast";
  import { ipfsDataKeys } from "$lib/types";
  import type { ContractReceipt } from "ethers";
  import Modal from "../elements/Modal.svelte";
  import TransactionSummaryTable from "../elements/TransactionSummaryTable.svelte";

  export let entries: any;
  export let recordID: string;
  let entrySubmitBtn: HTMLButtonElement;

  let isModalOpen = false;
  let activeStep = 0;
  let addEntryResponse: ContractReceipt | null = null;
  let toggleModalOpen = () => (isModalOpen = !isModalOpen);

  let handleEntriesSubmit = async (event: Event) => {
    activeStep = 1;

    // send ipfsData to IPFS and get the hash
    const formData = new FormData(event.target as HTMLFormElement);
    const response = await fetch((event.target as HTMLFormElement).action, {
      method: "POST",
      body: formData,
    });
    const result = await response.json();
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

    addEntryResponse = await contractTransact("addEntry", [
      recordID,
      recipientAddr,
      ipfsHash,
    ]);

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

<div class="max-w-screen mt-10 overflow-x-scroll">
  <table class="table">
    <thead>
      <tr>
        <th>Recipient</th>
        {#each Object.values(ipfsDataKeys) as key}
          <th>{key}</th>
        {/each}
        <th>acknowledged</th>
      </tr>
    </thead>
    <tbody>
      {#if entries.length}
        {#each entries as entry}
          <tr>
            <td>{entry}</td>
            <td>TODO</td>
          </tr>
        {/each}
      {:else}
        <tr>
          <td
            colspan={Object.values(ipfsDataKeys).length + 2}
            class="text-center h-52 bg-neutral/5"
          >
            No entries found
          </td>
        </tr>
      {/if}
    </tbody>
  </table>
  <button class="btn btn-primary mt-4" on:click={toggleModalOpen}
    >Add Entry</button
  >
</div>

<Modal
  open={isModalOpen}
  on:toggle={toggleModalOpen}
  title={activeStep === 0
    ? "Create New Entry"
    : activeStep === 1
    ? "Processing Transaction"
    : "Transaction Successful"}
  secondaryText={activeStep === 0 ? "Cancel" : undefined}
  primaryText={activeStep === 0
    ? "Cancel"
    : activeStep === 2
    ? "Yay!"
    : undefined}
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
          pattern="0x[a-fA-F0-9]{`{40}`}"
          type="text"
          placeholder="Enter Recipient Address"
          class="input input-bordered"
        />
      </div>
      {#each Object.values(ipfsDataKeys) as key}
        <div class="form-control">
          <label class="label" for="name">{key}</label>
          <input
            required
            name={key}
            type={key === ipfsDataKeys.Package
              ? "number"
              : key === "Email"
              ? "email"
              : "text"}
            placeholder="Enter {key}"
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
