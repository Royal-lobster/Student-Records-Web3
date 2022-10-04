<script lang="ts">
  import { attachRecordContract } from "$lib/shared/attach-contract";
  import { connectionGuard } from "$lib/shared/connection-guard";
  import type { RecordDetails } from "$lib/types";
  import { contracts } from "svelte-ethers-store";
  import { toast } from "$lib/store/toast";

  $: connectionGuard();

  const handleAddRecordSubmit = async (e: Event) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const payload = Object.fromEntries(formData.entries()) as RecordDetails;

    attachRecordContract();

    try {
      const response = await $contracts.recordsContract.addRecord(
        payload.name,
        payload.description
      );
      const data = await response.wait();
    } catch (e: any) {
      toast({
        message: e.message,
        type: "error",
      });
    }
  };
</script>

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
      <button class="btn btn-primary mt-4 w-full">Add Record</button>
    </form>
  </div>
</div>
