<script lang="ts">
  import Modal from "../elements/Modal.svelte";

  export let entries: any;
  let addEntryFrom: HTMLFormElement;

  const ipfsDataKeys = ["Name", "Email", "Company", "Designation", "Package"];

  let isModalOpen = false;
  let toggleModalOpen = () => (isModalOpen = !isModalOpen);

  let handleEntriesSubmit = () => {
    const formData = new FormData(addEntryFrom);
    const data = Object.fromEntries(formData);
    const recipientAddr = data["RECIPIENT_ETH_ADDR"];
    const ipfsData = Object.fromEntries(
      Object.entries(data).filter(([key]) => ipfsDataKeys.includes(key))
    );

    //TODO: send ipfsData to IPFS and get the hash

    //TODO: send the hash, recipient to the contract
  };
</script>

<div class="max-w-screen mt-10 overflow-x-scroll">
  <table class="table">
    <thead>
      <tr>
        <th>Recipient</th>
        {#each ipfsDataKeys as key}
          <th>{key}</th>
        {/each}
        <th>acknowledged</th>
      </tr>
    </thead>
    <tbody>
      {#if entries.length}
        {#each entries as entry}
          <tr>
            <td>{entry}</td>
            <td>TODO</td>
          </tr>
        {/each}
      {:else}
        <tr>
          <td
            colspan={ipfsDataKeys.length + 2}
            class="text-center h-52 bg-neutral/5"
          >
            No entries found
          </td>
        </tr>
      {/if}
    </tbody>
  </table>
  <button class="btn btn-primary mt-4" on:click={toggleModalOpen}
    >Add Entry</button
  >
</div>

<Modal
  open={isModalOpen}
  on:toggle={toggleModalOpen}
  title="Create New Entry"
  secondaryText="Cancel"
  primaryText="Add"
  primaryAction={handleEntriesSubmit}
>
  <form class="grid grid-cols-1 md:grid-cols-2 gap-4" bind:this={addEntryFrom}>
    <div class="form-control">
      <label class="label" for="name">Recipient</label>
      <input
        required
        name="RECIPIENT_ETH_ADDR"
        type="text"
        placeholder="Enter Recipient Address"
        class="input input-bordered"
      />
    </div>
    {#each ipfsDataKeys as key}
      <div class="form-control">
        <label class="label" for="name">{key}</label>
        <input
          required
          name={key}
          type="text"
          placeholder="Enter {key}"
          class="input input-bordered"
        />
      </div>
    {/each}
  </form>
</Modal>
