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
  import type { Entry } from "$lib/types";
  import { errorSafeFetch } from "$lib/shared/utils";
  export const ssr = false;

  // GET IPFS DATA ====================================

  const getTableStructure = async (ipfs_structure: string) => {
    const response = await errorSafeFetch(
      `https://${ipfs_structure}.ipfs.w3s.link/data.json`
    );
    const result = await response?.json();
    return result as { name: string; type: string }[];
  };

  const formatEntries = (entries: any) => {
    const filteredEntries = entries.filter((entry: any) => {
      return !!entry[4];
    });
    const formattedEntries = filteredEntries.map((entry: any) => {
      return {
        record_id: entry[0].toString(),
        entry_id: entry[1].toString(),
        recipient: entry[2],
        acknowledged: entry[3],
        ipfsHash: entry[4],
      };
    });

    return formattedEntries as Entry[];
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
        {#await getTableStructure(record.ipfs_structure)}
          <SkeletonEntriesTable />
        {:then tableStructure}
          <EntriesTable
            entries={formatEntries(entries)}
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
