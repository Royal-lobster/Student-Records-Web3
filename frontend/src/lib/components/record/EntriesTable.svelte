<script lang="ts">
  import { contractTransact } from "$lib/shared/contract-transact";
  import { shortenAddress } from "$lib/shared/utils";
  import { toast } from "$lib/store/toast";
  import type { EntriesExpanded as EntryExpanded } from "$lib/types";
  import type { BigNumber, ContractReceipt } from "ethers";
  import { signerAddress } from "svelte-ethers-store";
  import {
    AddCircleLine,
    CheckDoubleFill,
    CloseCircleLine,
    Edit2Line,
    FileCopyLine,
    Loader4Fill,
  } from "svelte-remixicon";
  import Modal from "../elements/Modal.svelte";
  import TransactionSummaryTable from "../elements/TransactionSummaryTable.svelte";
  import SubmitEntry from "./SubmitEntry.svelte";

  export let entries: Array<[BigNumber, BigNumber, string, boolean, string]>;
  export let recordID: string;
  export let recordMaintainer: string;
  export let tableStructure: { name: string; type: string }[];

  // CONVERT ENTRIES TO TABLE DATA =====================
  let data: EntryExpanded[] = [];
  $: (async () => {
    data = await Promise.all(
      entries.map(async (entry) => {
        const [, entry_id, recipient, acknowledged, ipfsHash] = entry;
        const ipfsData = await fetch(
          `https://${ipfsHash}.ipfs.w3s.link/data.json`
        ).then((res) => {
          return res.json();
        });
        return {
          entry_id,
          recipient,
          acknowledged,
          ...ipfsData,
        };
      })
    );
  })();

  // ADD ENTRIES LOGIC =================================
  let prefillEntryFormData: EntryExpanded | null = null;
  let isModalOpen = false;
  let toggleModalOpen = () => {
    isModalOpen = !isModalOpen;
    prefillEntryFormData = null;
  };
  let toggleModalOpenWithEditPrefill = (entryData: EntryExpanded) => {
    isModalOpen = !isModalOpen;
    prefillEntryFormData = entryData;
  };
  let isAckModalOpen: boolean;
  let toggleAckModalOpen: () => void;
  let acknowledgeResponse: ContractReceipt | null = null;
  let isAcknowledging = false;
  let handleAcknowledgement = async (
    entry_id: string,
    acknowledged: boolean
  ) => {
    isAcknowledging = true;
    acknowledgeResponse = await contractTransact(
      acknowledged ? "unAcknowledgeEntry" : "acknowledgeEntry",
      [recordID, entry_id]
    );
    isAcknowledging = false;
    if (acknowledgeResponse?.status === 0) {
      toggleModalOpen();
      toast({
        message: "Failed to submit entry",
        type: "error",
      });
    } else {
      toast({
        message: `Successfully ${
          acknowledged ? "un-acknowledged" : "acknowledged"
        } entry`,
        type: "success",
      });

      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  };

  // COPY TO CLIPBOARD ===============================
  let copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      message: "Copied to clipboard",
      type: "success",
    });
  };
</script>

<div class="overflow-x-scroll">
  <table class="table mt-10 table-compact md:table-normal">
    <thead>
      <tr>
        <th />
        <th>Recipient</th>
        {#each tableStructure as field}
          <th>{field.name}</th>
        {/each}
        <th>Acknowledged</th>
        {#if $signerAddress === recordMaintainer}
          <th />
        {/if}
      </tr>
    </thead>
    <tbody>
      {#if entries.length !== 0}
        {#if data.length !== 0}
          {#each data as entry, i}
            <tr>
              <th>{i + 1}</th>
              <td
                class={$signerAddress === entry.recipient
                  ? "text-primary font-bold cursor-pointer"
                  : "cursor-pointer"}
                on:keypress={() => copyToClipboard(entry.recipient)}
                on:click={() => copyToClipboard(entry.recipient)}
              >
                <FileCopyLine class="inline-block" />
                {shortenAddress(entry.recipient)}
                {#if $signerAddress === entry.recipient}
                  <span class="text-primary font-bold"> (You)</span>
                {/if}
              </td>
              {#each tableStructure as field}
                <td>{entry[field.name]}</td>
              {/each}
              <td>
                {#if $signerAddress === entry.recipient}
                  <button
                    disabled={isAcknowledging}
                    on:click={() =>
                      handleAcknowledgement(
                        entry.entry_id.toString(),
                        entry.acknowledged
                      )}
                    class={`btn flex gap-1 btn-xs ${
                      isAcknowledging ? "btn-disabled" : "btn-primary"
                    } ${entry.acknowledged ? "btn-error" : "btn-primary"}`}
                  >
                    {#if isAcknowledging}
                      <Loader4Fill class="animate-spin" size="15" />
                      <span>Processing</span>
                    {:else if entry.acknowledged}
                      <CloseCircleLine />
                      <span>UnAcknowledge</span>
                    {:else}
                      <CheckDoubleFill />
                      <span>Acknowledge</span>
                    {/if}
                  </button>
                {:else}
                  {entry.acknowledged ? "Yes" : "No"}
                {/if}
              </td>
              {#if $signerAddress === recordMaintainer}
                <td>
                  {#if !entry.acknowledged}
                    <button
                      class="btn btn-ghost btn-xs"
                      on:click={() => {
                        toggleModalOpenWithEditPrefill(entry);
                      }}
                    >
                      <Edit2Line class="inline-block" size="20" />
                    </button>
                  {/if}
                </td>
              {/if}
            </tr>
          {/each}
        {:else}
          <tr>
            <td
              colspan={tableStructure.length + 3 + (recordMaintainer ? 1 : 0)}
              class="text-center h-60 bg-black/5"
            >
              <div class=" flex flex-col justify-center items-center">
                <progress class="progress w-56" />
                <h3 class="mt-4">Fetching onchain data</h3>
              </div>
            </td>
          </tr>
        {/if}
      {:else}
        <tr>
          <td
            colspan={tableStructure.length + 3 + (recordMaintainer ? 1 : 0)}
            class="text-center h-32 bg-black/5"
          >
            No entries yet
          </td>
        </tr>
      {/if}
    </tbody>
  </table>
</div>

{#if $signerAddress === recordMaintainer}
  <button class="btn gap-2 btn-primary mt-4" on:click={toggleModalOpen}>
    <AddCircleLine class="inline-block" size="20" />
    Add Entry</button
  >
{/if}

<SubmitEntry
  {isModalOpen}
  {toggleModalOpen}
  {tableStructure}
  {recordID}
  {prefillEntryFormData}
/>

<Modal
  open={isAckModalOpen}
  on:toggle={toggleAckModalOpen}
  title="Acknowledge Entry"
  primaryText="Yay!"
  primaryAction={toggleModalOpen}
>
  <TransactionSummaryTable transactionResult={acknowledgeResponse} />
</Modal>
