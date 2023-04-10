<script lang="ts">
  import { contractTransact } from "$lib/shared/contract-transact";
  import { errorSafeFetch, shortenAddress } from "$lib/shared/utils";
  import { toast } from "$lib/store/toast";
  import type { Entry, EntryExpanded as EntryExpanded } from "$lib/types";
  import type { ContractReceipt } from "ethers";
  import { signerAddress } from "svelte-ethers-store";
  import {
    AddCircleLine,
    CheckDoubleFill,
    CloseCircleLine,
    DeleteBin2Line,
    Edit2Line,
    FileCopyLine,
    Loader4Fill,
  } from "svelte-remixicon";
  import Modal from "../elements/Modal.svelte";
  import TransactionSummaryTable from "../elements/TransactionSummaryTable.svelte";
  import SubmitEntry from "./SubmitEntry.svelte";

  export let entries: Entry[];
  export let recordID: string;
  export let recordMaintainer: string;
  export let tableStructure: { name: string; type: string }[];

  // CONVERT ENTRIES TO TABLE DATA =====================
  let data: EntryExpanded[] = [];
  $: (async () => {
    data = await Promise.all(
      entries.map(async (entry) => {
        const { entry_id, recipient, acknowledged, ipfsHash } = entry;
        const ipfsData = await errorSafeFetch(
          `https://${ipfsHash}.ipfs.w3s.link/data.json`
        ).then((res) => {
          return res?.json();
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
  let isDeleteModalOpen = false;
  let deletingEntry = false;
  let deleteResponse: ContractReceipt | null = null;
  let entryToDelete: string | null = null;

  function toggleDeleteModal() {
    isDeleteModalOpen = !isDeleteModalOpen;
  }
  function handleDeleteEntryClick(entry_id: string) {
    entryToDelete = entry_id;
    toggleDeleteModal();
  }

  const handleDeleteEntry = async (entry_id: string) => {
    deletingEntry = true;
    deleteResponse = await contractTransact("deleteEntry", [
      recordID,
      entry_id,
    ]);
    if (deleteResponse?.status === 0) {
      toggleDeleteModal();
      toast({
        message: "Failed to delete entry",
        type: "error",
      });
    } else {
      toast({
        message: "Successfully deleted entry",
        type: "success",
      });
    }

    entries = entries.filter((entry) => entry.entry_id !== entry_id);
    deletingEntry = false;
  };

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

      entries = entries.map((entry) => {
        if (entry.entry_id === entry_id) {
          return {
            ...entry,
            acknowledged: !acknowledged,
          };
        }
        return entry;
      });
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
                  <div class="flex">
                    <button
                      disabled={isAcknowledging}
                      on:click={() =>
                        handleAcknowledgement(
                          entry.entry_id.toString(),
                          entry.acknowledged
                        )}
                      class={`btn flex flex-shrink-0 gap-1 btn-xs ${
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
                  </div>
                {:else}
                  {entry.acknowledged ? "Yes" : "No"}
                {/if}
              </td>
              {#if $signerAddress === recordMaintainer}
                <td>
                  {#if !entry.acknowledged}
                    <div class="btn-group">
                      <button
                        class="btn btn-accent btn-xs"
                        on:click={() => {
                          toggleModalOpenWithEditPrefill(entry);
                        }}
                      >
                        <Edit2Line class="inline-block" size="15" />
                      </button>
                      <button
                        class="btn btn-error btn-xs"
                        on:click={() => {
                          handleDeleteEntryClick(entry.entry_id.toString());
                        }}
                      >
                        <DeleteBin2Line class="inline-block" size="15" />
                      </button>
                    </div>
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

<Modal
  open={isDeleteModalOpen}
  on:toggle={toggleDeleteModal}
  title="Delete Entry"
  primaryText={deleteResponse ? undefined : "Delete"}
  primaryAction={deleteResponse
    ? undefined
    : () => entryToDelete && handleDeleteEntry(entryToDelete)}
  secondaryText={deleteResponse ? "Yay !" : "Cancel"}
  loading={deletingEntry}
  emotion="error"
>
  {#if deleteResponse}
    <p class="mb-5">Record deleted successfully</p>
    <TransactionSummaryTable transactionResult={deleteResponse} />
  {:else}
    <p>Are you sure you want to delete this entry?</p>
  {/if}
</Modal>
