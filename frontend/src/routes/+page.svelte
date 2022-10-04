<script lang="ts">
  import RecordCard from "$lib/components/RecordCard.svelte";
  import UserCard from "$lib/components/UserCard.svelte";
  import { attachRecordContract } from "$lib/shared/attach-contract";
  import { connectionGuard } from "$lib/shared/connection-guard";
  import { contracts, signerAddress } from "svelte-ethers-store";
  $: connectionGuard();
  attachRecordContract();
</script>

<div class="my-28 flex flex-col gap-6">
  <div class="flex justify-between flex-wrap mb-16 gap-6">
    <h1 class="font-extrabold text-5xl">Your Records</h1>
    <UserCard />
  </div>

  {#if $signerAddress}
    {#await $contracts.recordsContract.getRecordsByMaintainer($signerAddress)}
      <p>loading...</p>
    {:then records}
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {#each records as record}
          <RecordCard {record} />
        {/each}
      </div>
    {:catch error}
      <p>{error.message}</p>
    {/await}
  {/if}
</div>
