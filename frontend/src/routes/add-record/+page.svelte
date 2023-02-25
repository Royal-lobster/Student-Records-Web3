<script lang="ts">
  import { connectionGuard } from "$lib/shared/connection-guard";
  import type { RecordDetails } from "$lib/types";
  import Modal from "$lib/components/elements/Modal.svelte";
  import type { ContractReceipt } from "ethers";
  import { contractTransact } from "$lib/shared/contract-transact";
  import TransactionSummaryTable from "$lib/components/elements/TransactionSummaryTable.svelte";
  import { goto } from "$app/navigation";
  import { getRecordId } from "$lib/shared/utils";
  import Navbar from "$lib/components/layout/Navbar.svelte";
  import { toast } from "$lib/store/toast";
  import CustomFields from "../../components/add-record/CustomFields.svelte";
  import RecordDetailsInput from "../../components/add-record/RecordDetailsInput.svelte";
  import { writable } from "svelte/store";
  import { customFieldsStore } from "$lib/store/customFields";

  $: connectionGuard();

  let loading = false;
  let isModalOpen = false;
  let transactionResult: ContractReceipt | null = null;

  const toggleModalOpen = () => (isModalOpen = !isModalOpen);

  const handleAddRecordSubmit = async (e: Event) => {
    e.preventDefault();
    loading = true;

    const customFields = $customFieldsStore;

    // send custom fields data to ipfs
    const filteredCustomFields = customFields.map((field) => ({
      name: field.name,
      type: field.type,
    }));
    const customFieldsFormData = new FormData();
    customFieldsFormData.append("data", JSON.stringify(filteredCustomFields));

    const response = await fetch((e.target as HTMLFormElement).action, {
      method: "POST",
      body: customFieldsFormData,
    });
    const result = await response.json();

    if (result.type !== "success") {
      toggleModalOpen();
      toast({
        message: "Failed to submit entry",
        type: "error",
      });
    }

    // recover form data
    const formData = new FormData(e.target as HTMLFormElement);
    const payload = Object.fromEntries(formData.entries()) as RecordDetails;

    // send transaction
    transactionResult = await contractTransact("addRecord", [
      payload.name,
      payload.description,
      result.data.ipfsHash,
    ]);

    // reset form
    if (transactionResult) {
      toggleModalOpen();
      (e.target as HTMLFormElement).reset();
    }

    loading = false;
  };
</script>

<Navbar name="Add Record" />

<form
  class="flex flex-col justify-center mb-10 items-center"
  method="POST"
  action="?/pinJSON"
  on:submit={handleAddRecordSubmit}
>
  <div class="w-full max-w-5xl mx-auto">
    <div
      class="flex lg:flex-row justify-between  max-w-md lg:max-w-none flex-col gap-4 mx-auto"
    >
      <RecordDetailsInput />
      <CustomFields />
    </div>
  </div>

  {#if !loading}
    <button class="btn btn-primary mt-10 w-full max-w-md mx-auto"
      >Add Record</button
    >
  {:else}
    <button
      class="btn loading btn-primary mt-4 w-full max-w-lg mx-auto"
      disabled>Transaction Processing</button
    >
  {/if}
</form>

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
