<script lang="ts">
  import { connectionGuard } from "$lib/shared/connection-guard";
  import type { RecordDetails } from "$lib/types";
  import Modal from "$lib/components/elements/Modal.svelte";
  import type { ContractReceipt } from "ethers";
  import { contractTransact } from "$lib/shared/contract-transact";
  import TransactionSummaryTable from "$lib/components/elements/TransactionSummaryTable.svelte";
  import { goto } from "$app/navigation";
  import { getRecordId } from "$lib/shared/utils";
  import { ArrowLeftLine, DeleteBinLine } from "svelte-remixicon";
  import Navbar from "$lib/components/layout/Navbar.svelte";
  import { toast } from "$lib/store/toast";

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

  // CUSTOM FIELD HANDLERS ======================

  const handleAddNewField = () => {
    const id = customFields[customFields.length - 1]?.id + 1 || 0;
    customFields = [...customFields, { id, name: "", type: "text" }];
  };

  const handleCustomFieldTypeChange = (id: number, event: Event) => {
    const type = (event.target as HTMLSelectElement).value;
    customFields = customFields.map((field) =>
      field.id === id ? { ...field, type } : field
    );
  };

  const handleCustomFieldNameChange = (id: number, event: Event) => {
    const name = (event.target as HTMLInputElement).value;
    customFields = customFields.map((field) =>
      field.id === id ? { ...field, name } : field
    );
  };

  const handleCustomFieldDelete = (id: number) => {
    customFields = customFields.filter((field) => field.id !== id);
  };

  // FORM SUBMIT HANDLER ======================

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
  <div class="flex w-full justify-between">
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
          Fill the form below to add a new record and click on add record
          button.
        </p>
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
      </div>
    </div>

    <!-- CUSTOM FIELDS -->
    <div class="w-1/2">
      <h1 class="text-3xl mt-12 mb-4">Add Fields</h1>
      <div
        class="max-h-[270px] border border-[#bdbcbc] shadow-md p-4 pt-2 pb-6 rounded-md overflow-y-auto"
      >
        {#if customFields.length === 0}
          <div
            class="text-center text-gray-500 h-full -mb-4 p-4 grid place-items-center"
          >
            <h2 class="text-xl">No fields added yet.</h2>
            <p>Click on add field button to create new field.</p>
          </div>
        {/if}
        {#each customFields as customField}
          <div
            class="flex mt-2 items-center children:flex children:flex-col gap-4"
          >
            <div class="my-auto border border-primary rounded-full w-6 h-6">
              <span class="text-center text-primary"
                >{customFields.indexOf(customField) + 1}</span
              >
            </div>
            <div class="flex-grow">
              <label class="mb-1" for={`name-${customField.id}`}
                >Column Name</label
              >
              <input
                name={`name-${customField.id}`}
                value={customField.name}
                on:change={(e) =>
                  handleCustomFieldNameChange(customField.id, e)}
                class="input input-sm input-bordered w-full"
                placeholder="Enter Column Name"
              />
            </div>
            <div class="flex-grow">
              <label class="mb-1" for={`type-${customField.id}`}>Type</label>
              <select
                name={`type-${customField.id}`}
                class="input input-sm input-bordered w-full"
                value={customField.type}
                on:change={(e) =>
                  handleCustomFieldTypeChange(customField.id, e)}
              >
                <option value="text">Text</option>
                <option value="email">Email</option>
                <option value="number">Number</option>
                <option value="tel">Phone Number</option>
                <option value="date">Date</option>
              </select>
            </div>
            <button
              type="button"
              on:click={() => handleCustomFieldDelete(customField.id)}
              class="rounded-md bg-error p-2 text-white"
              ><DeleteBinLine /></button
            >
          </div>
        {/each}
      </div>
      <div>
        <button
          type="button"
          on:click={handleAddNewField}
          class="btn btn-primary btn-sm mt-4">+ Add field</button
        >
      </div>
    </div>
  </div>

  {#if !loading}
    <button class="btn btn-primary mt-4 w-full max-w-lg mx-auto"
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
