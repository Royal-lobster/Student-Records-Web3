<script lang="ts">
  import { isCSVResultValid } from "$lib/functions/validateCSVResults";
  import { contractTransact } from "$lib/shared/contract-transact";
  import { toast } from "$lib/store/toast";
  import type { ContractReceipt } from "ethers";
  import { parse } from "papaparse";
  import Modal from "../elements/Modal.svelte";
  import TransactionSummaryTable from "../elements/TransactionSummaryTable.svelte";
  import { errorSafeFetch } from "$lib/shared/utils";

  export let tableStructure: { name: string; type: string }[];
  export let recordID: string;

  let files: FileList;
  let data: Record<string, string>[];
  let activeStep = 0;
  let isModalOpen = false;
  let toggleModalOpen = () => {
    isModalOpen = !isModalOpen;
  };
  let entrySubmitBtn: HTMLButtonElement;

  $: if (files) {
    const file = files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const result = parse<Record<string, string>>(text.trim(), {
        header: true,
      }).data;
      if (isCSVResultValid(result, tableStructure)) {
        data = result;
        toggleModalOpen();
      }
    };
    reader.readAsText(file);
  }

  let addEntryResponse: ContractReceipt | null = null;

  let handleEntriesSubmit = async (event: Event) => {
    activeStep = 1;

    const recipientsAndIpfsHashes = await Promise.all(
      data.map(async (entry) => {
        const formData = new FormData();
        Object.entries(entry).forEach(([key, value]) => {
          if (key !== "recipient") {
            formData.append(key, value);
          }
        });
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
        return [result.data.ipfsHash as any, entry.recipient];
      })
    );

    // send the hash, recipient to the contract
    const recipientAddrs = recipientsAndIpfsHashes.map((entry) => entry[1]);
    const ipfsHashs = recipientsAndIpfsHashes.map((entry) => entry[0]);

    addEntryResponse = await contractTransact("addMultipleEntries", [
      recordID,
      recipientAddrs,
      ipfsHashs,
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

<div
  class="flex flex-col md:flex-row justify-between gap-4 items-center max-w-4xl mt-8 border-t border-black/20 p-4"
>
  <div>
    <h3 class="text-2xl font-bold my-4 text-primary">Upload CSV</h3>
    <p class="text-neutral/700">
      Please upload a CSV file with the following header columns:
    </p>
    <ul class="list-disc list-inside">
      {#each tableStructure as { name }}
        <li>
          {`${name} ${
            name === "recipient" ? "(should contain valid eth addresses)" : ""
          }`}
        </li>
      {/each}
    </ul>
  </div>

  <input
    type="file"
    accept=".csv"
    bind:files
    class="block file-input file-input-bordered"
  />
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
  primaryText={activeStep === 0 ? "Add" : activeStep === 2 ? "Yay!" : undefined}
  primaryAction={activeStep === 0
    ? () => entrySubmitBtn.click()
    : activeStep === 2
    ? () => window.location.reload()
    : undefined}
>
  {#if activeStep === 0}
    <div class="overflow-x-auto">
      <table class="table w-full table-compact">
        <thead>
          <tr>
            <th />
            {#each tableStructure as { name, type }}
              <th class="text-left">{name}</th>
            {/each}
          </tr>
        </thead>
        <tbody>
          {#each data as row, i}
            <tr>
              <td>{i + 1}</td>
              {#each tableStructure as { name, type }}
                <td>{row[name]}</td>
              {/each}
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
    <form
      action="?/pinJSON"
      method="POST"
      on:submit|preventDefault={handleEntriesSubmit}
    >
      <button type="submit" bind:this={entrySubmitBtn} />
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
