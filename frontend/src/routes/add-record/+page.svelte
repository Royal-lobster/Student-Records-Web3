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

  $: connectionGuard();

  let loading = false;
  let isModalOpen = false;
  let transactionResult: ContractReceipt | null = null;
  let customFields: { id: number; name: string; type: string }[] = [
    {
      id: 0,
      name: "",
      type: "text",
    },
  ];

  const toggleModalOpen = () => (isModalOpen = !isModalOpen);

  const handleAddRecordSubmit = async (e: Event) => {
    e.preventDefault();

    // send custom fields data to ipfs
    const response = await fetch((e.target as HTMLFormElement).action, {
      method: "POST",
      body: JSON.stringify(
        customFields.map((field) => {
          field.name, field.type;
        })
      ),
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
    loading = true;
    transactionResult = await contractTransact("addRecord", [
      payload.name,
      payload.description,
    ]);
    loading = false;

    // reset form
    if (transactionResult) {
      toggleModalOpen();
      (e.target as HTMLFormElement).reset();
    }
  };
</script>

<Navbar name="Add Record" />

<form
  class="flex flex-col justify-center items-center"
  on:submit={handleAddRecordSubmit}
>
  <div
    class="flex flex-col mx-auto gap-4 w-full max-w-5xl lg:flex-row justify-between"
  >
    <RecordDetailsInput />
    <CustomFields {customFields} />
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
