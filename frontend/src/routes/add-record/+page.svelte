<script lang="ts">
  import { connectionGuard } from "$lib/shared/connection-guard";
  import type { RecordDetails } from "$lib/types";
  import Modal from "$lib/components/elements/Modal.svelte";
  import type { ContractReceipt } from "ethers";
  import { contractTransact } from "$lib/shared/contract-transact";
  import TransactionSummaryTable from "$lib/components/elements/TransactionSummaryTable.svelte";
  import { goto } from "$app/navigation";
  import { getRecordId } from "$lib/shared/utils";
  import { ArrowLeftLine } from "svelte-remixicon";
  import Navbar from "$lib/components/layout/Navbar.svelte";

  $: connectionGuard();

  let loading = false;
  let isModalOpen = false;
  let transactionResult: ContractReceipt | null = null;
  const toggleModalOpen = () => (isModalOpen = !isModalOpen);

  const handleAddRecordSubmit = async (e: Event) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const payload = Object.fromEntries(formData.entries()) as RecordDetails;

    loading = true;
    transactionResult = await contractTransact("addRecord", [
      payload.name,
      payload.description,
    ]);
    loading = false;

    if (transactionResult) {
      toggleModalOpen();
      (e.target as HTMLFormElement).reset();
    }
  };
</script>

<Navbar name="Add Record" />

<div class="grid place-content-center pb-10">
  <div class=" flex flex-col gap-6 max-w-md">
    <button
      class="flex items-center gap-2 text-gray-500 hover:opacity-70"
      on:click={() => goto("/")}
    >
      <ArrowLeftLine />
      Go Back
    </button>
    <h1 class="font-extrabold text-5xl">Add New Record</h1>
    <p>
      Fill the form below to add a new record and click on add record button.
    </p>
    <form on:submit={handleAddRecordSubmit}>
      <div class="form-control w-full">
        <label class="label" for="name">Name of the Record</label>
        <input
          required
          name="name"
          type="text"
          placeholder="Type here"
          class="input input-bordered w-full"
        />
      </div>
      <div class="form-control w-full">
        <label class="label" for="name">Description of the Record</label>
        <textarea
          required
          name="description"
          placeholder="Type here"
          class="textarea textarea-bordered w-full"
        />
      </div>
      {#if !loading}
        <button class="btn btn-primary mt-4 w-full">Add Record</button>
      {:else}
        <button class="btn loading btn-primary mt-4 w-full" disabled
          >Transaction Processing</button
        >
      {/if}
    </form>
  </div>
</div>

<Modal
  open={isModalOpen}
  on:toggle={toggleModalOpen}
  title="🎊 &nbsp New Record Created"
  secondaryText="Close"
  primaryText="View Record"
  primaryAction={() =>
    goto(transactionResult ? `/record/${getRecordId(transactionResult)}` : "/")}
>
  <TransactionSummaryTable
    {transactionResult}
    additionalData={[
      ["Record ID", transactionResult && getRecordId(transactionResult)],
      ["Record Name", transactionResult?.events?.[0].args?.[1]],
      ["Record Description", transactionResult?.events?.[0].args?.[2]],
    ]}
  />
</Modal>
