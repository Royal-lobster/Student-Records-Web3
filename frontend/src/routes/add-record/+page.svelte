<script lang="ts">
  import { attachRecordContract } from "$lib/shared/attach-contract";
  import { connectionGuard } from "$lib/shared/connection-guard";
  import type { RecordDetails } from "$lib/types";
  import { contracts } from "svelte-ethers-store";
  import { toast } from "$lib/store/toast";
  import Modal from "$lib/components/Modal.svelte";
  import { BigNumber, type ContractReceipt } from "ethers";

  $: connectionGuard();

  let loading = false;
  let transactionResult: any = false;
  let isModalOpen = false;

  const handleAddRecordSubmit = async (e: Event) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const payload = Object.fromEntries(formData.entries()) as RecordDetails;

    attachRecordContract();
    loading = true;

    try {
      const response = await $contracts.recordsContract.addRecord(
        payload.name,
        payload.description
      );
      transactionResult = await response.wait();
      isModalOpen = true;
    } catch (e: any) {
      toast({
        message: e.message,
        type: "error",
      });
    }
    loading = false;
  };
</script>

{#if transactionResult}
  <Modal open={isModalOpen} title="✅ Transaction Succesfull">
    <div class="overflow-x-auto">
      <table class="table w-full table-compact">
        <tbody>
          <tr>
            <th> Transaction Hash:</th>
            <td>{transactionResult?.transactionHash}</td>
          </tr>
          <!-- row 2 -->
          <tr>
            <th>Block Number</th>
            <td>{transactionResult?.blockNumber}</td>
          </tr>
          <!-- row 3 -->
          <tr>
            <th>Record ID</th>
            <td
              >{BigNumber.from(
                transactionResult?.events?.[0].args?.[0]
              ).toString()}</td
            >
          </tr>
          <!-- row 4 -->
          <tr>
            <th>Record Name</th>
            <td>{transactionResult?.events?.[0].args?.[1]}</td>
          </tr>
          <!-- row 5 -->
          <tr>
            <th>Record Description</th>
            <td>{transactionResult?.events?.[0].args?.[2]}</td>
          </tr>

          <!-- row 6 -->
          <tr>
            <th>Record Maintainer</th>
            <td>{transactionResult?.events?.[0].args?.[3]}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="modal-action">
      <label
        on:click={() => {
          isModalOpen = false;
        }}
        for="my-modal-6"
        class="btn">Yay!</label
      >
    </div>
  </Modal>
{/if}
<div class="grid place-content-center min-h-screen">
  <div class=" flex flex-col gap-6 max-w-md">
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
