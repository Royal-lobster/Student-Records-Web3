<script lang="ts">
  import { page } from "$app/stores";
  import Navbar from "$lib/components/layout/Navbar.svelte";
  import EntriesTable from "$lib/components/record/EntriesTable.svelte";
  import CreateMultipleEntries from "$lib/components/record/CreateMultipleEntries.svelte";
  import RecordPageHeader from "$lib/components/record/RecordPageHeader.svelte";
  import SkeletonEntriesTable from "$lib/components/skeletons/SkeletonEntriesTable.svelte";
  import SkeletonRecordPageHeader from "$lib/components/skeletons/SkeletonRecordPageHeader.svelte";
  import { contracts } from "svelte-ethers-store";
  import { signerAddress } from "svelte-ethers-store";

  // GET IPFS DATA ====================================

  const getTableStructure = async (ipfs_structure: string) => {
    const response = await fetch(
      `https://${ipfs_structure}.ipfs.w3s.link/data.json`
    );
    const result = await response.json();
    return result as { name: string; type: string }[];
  };
</script>

<Navbar name="Record Details" />

<div class="pb-8">
  {#if $contracts.recordsContract}
    {#await $contracts.recordsContract.getRecord($page.params.id)}
      <SkeletonRecordPageHeader />
    {:then record}
      <RecordPageHeader {record} />
      {#await $contracts.recordsContract.getEntries(record.id)}
        <SkeletonEntriesTable />
      {:then entries}
        {console.log(entries)}
        {#await getTableStructure(record.ipfs_structure)}
          <SkeletonEntriesTable />
        {:then tableStructure}
          <EntriesTable
            {entries}
            recordID={record.id}
            recordMaintainer={record.maintainer}
            {tableStructure}
          />
          {#if record.maintainer === $signerAddress}
            <CreateMultipleEntries
              tableStructure={[
                { name: "recipient", type: "text" },
                ...tableStructure,
              ]}
              recordID={record.id}
            />
          {/if}
        {/await}
      {/await}
    {/await}
  {:else}
    <SkeletonRecordPageHeader />
    <SkeletonEntriesTable />
  {/if}
</div>
