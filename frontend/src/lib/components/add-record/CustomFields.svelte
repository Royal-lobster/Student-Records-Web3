<script lang="ts">
  import { customFieldsStore } from "$lib/store/customFields";
  import { DeleteBinLine } from "svelte-remixicon";

  $: customFields = $customFieldsStore;

  function handleAddNewField() {
    const id = customFields[customFields.length - 1]?.id + 1 || 0;
    customFieldsStore.update((fields) => [
      ...fields,
      { id, name: "", type: "text" },
    ]);
  }

  function handleCustomFieldTypeChange(id: number, event: Event) {
    const type = (event.target as HTMLSelectElement).value;
    customFieldsStore.update((fields) =>
      fields.map((field) => (field.id === id ? { ...field, type } : field))
    );
  }

  function handleCustomFieldNameChange(id: number, event: Event) {
    const name = (event.target as HTMLInputElement).value;
    customFieldsStore.update((fields) =>
      fields.map((field) => (field.id === id ? { ...field, name } : field))
    );
  }

  function handleCustomFieldDelete(id: number) {
    customFieldsStore.update((fields) =>
      fields.filter((field) => field.id !== id)
    );
  }
</script>

<div class="max-w-lg w-full">
  <h1 class="text-3xl mt-12 mb-4">Add Fields</h1>
  <div
    class="max-h-[295px] border border-[#bdbcbc] shadow-md p-4 pt-2 pb-6 rounded-md overflow-y-auto"
  >
    {#if customFields.length === 0}
      <div
        class="text-center text-gray-500 h-full w-full -mb-4 p-4 grid place-items-center"
      >
        <h2 class="text-xl">No fields added yet.</h2>
        <p>Click on add field button to create new field.</p>
      </div>
    {/if}
    {#each customFields as customField}
      <div class="flex mt-2 items-center children:flex-col gap-4">
        <div
          class="hidden lg:flex my-auto border border-primary rounded-full w-6 h-6"
        >
          <span class="text-center text-primary"
            >{customFields.indexOf(customField) + 1}</span
          >
        </div>
        <div class="flex-grow flex">
          <label class="mb-1" for={`name-${customField.id}`}>Column Name</label>
          <input
            name={`name-${customField.id}`}
            value={customField.name}
            required
            on:change={(e) => handleCustomFieldNameChange(customField.id, e)}
            class="input input-sm input-bordered w-full"
            placeholder="Enter Column Name"
          />
        </div>
        <div class="flex-grow flex">
          <label class="mb-1" for={`type-${customField.id}`}>Type</label>
          <select
            required
            name={`type-${customField.id}`}
            class="input input-sm input-bordered w-full"
            value={customField.type}
            on:change={(e) => handleCustomFieldTypeChange(customField.id, e)}
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
          class="rounded-md bg-error p-2 text-white"><DeleteBinLine /></button
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
