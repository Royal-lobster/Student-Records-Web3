<script lang="ts">
  import { page } from "$app/stores";
  import Navbar from "$lib/components/layout/Navbar.svelte";
  import RecordPageHeader from "$lib/components/record/RecordPageHeader.svelte";
  import SkeletonRecordPageHeader from "$lib/components/skeletons/SkeletonRecordPageHeader.svelte";
  import { attachRecordContract } from "$lib/shared/attach-contract";
  import { contracts } from "svelte-ethers-store";

  attachRecordContract();
</script>

<Navbar name="Record Details" />

{#if $contracts.recordsContract}
  {#await $contracts.recordsContract.getRecord($page.params.id)}
    <SkeletonRecordPageHeader />
  {:then record}
    <RecordPageHeader {record} />
  {/await}
{:else}
  <SkeletonRecordPageHeader />
{/if}
