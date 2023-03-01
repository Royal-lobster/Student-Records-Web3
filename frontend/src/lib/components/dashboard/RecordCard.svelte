<script lang="ts">
  import { goto } from "$app/navigation";
  import { contractTransact } from "$lib/shared/contract-transact";
  import { truncate } from "$lib/shared/utils";
  import type { RecordDetailsFull } from "$lib/types";
  import { BigNumber, type ContractReceipt } from "ethers";
  import { createEventDispatcher } from "svelte";
  import Modal from "../elements/Modal.svelte";
  import TransactionSummaryTable from "../elements/TransactionSummaryTable.svelte";

  export let record: RecordDetailsFull;

  const dispatch = createEventDispatcher<{ remove: bigint }>();

  let isDeleteModalOpen = false;
  function toggleDeleteModal() {
    isDeleteModalOpen = !isDeleteModalOpen;
  }

  let deletingRecord = false;
  let deleteResponse: ContractReceipt | null = null;

  const handleDeleteRecord = async () => {
    deletingRecord = true;
    deleteResponse = await contractTransact("deleteRecord", [record.id]);
    deletingRecord = false;
  };
</script>

<div
  class="card border-l-8 border-l-primary rounded-none bg-white/60 flex flex-col p-8"
>
  <div class="flex justify-between gap-4">
    <div class="flex flex-col gap-2">
      <h2 class="font-bold text-2xl">{record.name}</h2>
      <p>{truncate(record.description, 90)}</p>
      <div class="flex gap-2">
        <span class="font-bold">ID:</span>
        <span>{record.id}</span>
      </div>
    </div>
    <div class="flex gap-2 flex-col lg:flex-row">
      <button
        on:click={() => goto(`/record/${record.id}`)}
        class="btn btn-primary btn-square fill-white"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="24"
          height="24"
          ><path fill="none" d="M0 0h24v24H0z" /><path
            d="M12.684 4.029a8 8 0 1 0 7.287 7.287 7.936 7.936 0 0 0-.603-2.44l1.5-1.502A9.933 9.933 0 0 1 22 12c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2a9.982 9.982 0 0 1 4.626 1.132l-1.501 1.5a7.941 7.941 0 0 0-2.44-.603zM20.485 2.1L21.9 3.515l-9.192 9.192-1.412.003-.002-1.417L20.485 2.1z"
          /></svg
        >
      </button>
      <button
        on:click={toggleDeleteModal}
        class="btn btn-error btn-square fill-white"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="24"
          height="24"
          ><path fill="none" d="M0 0h24v24H0z" /><path
            d="M17 6h5v2h-2v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V8H2V6h5V3a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v3zm1 2H6v12h12V8zm-9 3h2v6H9v-6zm4 0h2v6h-2v-6zM9 4v2h6V4H9z"
          /></svg
        >
      </button>
    </div>
  </div>
</div>

<Modal
  open={isDeleteModalOpen}
  on:toggle={toggleDeleteModal}
  title="Delete Record"
  primaryText={deleteResponse ? undefined : "Delete"}
  primaryAction={deleteResponse ? undefined : handleDeleteRecord}
  secondaryText={deleteResponse ? "Yay !" : "Cancel"}
  secondaryAction={() =>
    dispatch("remove", BigNumber.from(record.id).toBigInt())}
  loading={deletingRecord}
  emotion="error"
>
  {#if deleteResponse}
    <p class="mb-5">Record deleted successfully</p>
    <TransactionSummaryTable transactionResult={deleteResponse} />
  {:else}
    <p>
      Are you sure you want to delete record? Deleting record will delete all
      its entries even if the entries are acknolwedged.
    </p>
  {/if}
</Modal>
