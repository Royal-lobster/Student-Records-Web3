<script lang="ts">
  import { page } from "$app/stores";
  import { shortenAddress } from "$lib/shared/utils";
  import type { RecordDetailsFull } from "$lib/types";
  import { contracts } from "svelte-ethers-store";
  export let record: RecordDetailsFull;
</script>

<div class="flex flex-wrap gap-5 justify-between">
  <div class="max-w-xl">
    <h1 class="text-4xl font-bold text-primary mb-5">{record.name}</h1>
    <p class="text-gray-500 mb-2">{record.description}</p>
  </div>
  <div>
    <table class="table table-compact divide-y-[1px] divide-gray-300">
      <tr>
        <td class="text-gray-500">Record ID</td>
        <td>{record.id}</td>
      </tr>
      <tr>
        <td class="text-gray-500">Maintainer</td>
        <td>{shortenAddress(record.maintainer)}</td>
      </tr>
      <tr>
        <td class="text-gray-500">Table Structure</td>
        <td>
          <a href={`https://${record.ipfs_structure}.ipfs.w3s.link/data.json`}
            >{shortenAddress(record.ipfs_structure)}</a
          ></td
        >
      </tr>
      <tr>
        <td class="text-gray-500">Entry Count</td>
        {#await $contracts.recordsContract.getEntryCount($page.params.id)}
          <td>Loading...</td>
        {:then count}
          <td>{count}</td>
        {/await}
      </tr>
    </table>
  </div>
</div>
