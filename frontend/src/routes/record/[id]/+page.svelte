<script lang="ts">
  import { page } from "$app/stores";
  import Navbar from "$lib/components/layout/Navbar.svelte";
  import EntriesTable from "$lib/components/record/EntriesTable.svelte";
  import RecordPageHeader from "$lib/components/record/RecordPageHeader.svelte";
  import SkeletonEntriesTable from "$lib/components/skeletons/SkeletonEntriesTable.svelte";
  import SkeletonRecordPageHeader from "$lib/components/skeletons/SkeletonRecordPageHeader.svelte";
  import { contracts } from "svelte-ethers-store";
</script>

<Navbar name="Record Details" />

{#if $contracts.recordsContract}
  {#await $contracts.recordsContract.getRecord($page.params.id)}
    <SkeletonRecordPageHeader />
  {:then record}
    <RecordPageHeader {record} />
    {#await $contracts.recordsContract.getEntries(record.id)}
      <SkeletonEntriesTable />
    {:then entries}
      <EntriesTable
        {entries}
        recordID={record.id}
        recordMaintainer={record.maintainer}
      />
    {/await}
  {/await}
{:else}
  <SkeletonRecordPageHeader />
  <SkeletonEntriesTable />
{/if}
