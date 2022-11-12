<script lang="ts">
  import { page } from "$app/stores";
  import Navbar from "$lib/components/layout/Navbar.svelte";
  import { attachRecordContract } from "$lib/shared/attach-contract";
  import { contracts } from "svelte-ethers-store";

  attachRecordContract();
</script>

<Navbar name="Record" />

{#if $contracts.recordsContract}
  {#await $contracts.recordsContract.getRecord($page.params.id)}
    <p>Loading...</p>
  {:then record}
    <h1>{record.name}</h1>
    <p>{record.description}</p>
    <p>{record.maintainer}</p>
  {/await}
{:else}
  <p>Loading...</p>
{/if}
