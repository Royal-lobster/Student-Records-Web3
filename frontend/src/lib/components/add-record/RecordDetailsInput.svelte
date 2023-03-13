<script>
  import { goto } from "$app/navigation";
  import { ArrowLeftLine } from "svelte-remixicon";
</script>

<div class=" flex flex-col gap-6 max-w-lg">
  <button
    type="button"
    class="flex items-center gap-2 text-gray-500 hover:opacity-70"
    on:click={() => goto("/dashboard")}
  >
    <ArrowLeftLine />
    Go Back
  </button>
  <h1 class="font-extrabold text-5xl">Add New Record</h1>
  <p>Fill the form below to add a new record and click on add record button.</p>
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
      class="textarea textarea-bordered w-full leading-normal"
      rows="4"
    />
  </div>
</div>
