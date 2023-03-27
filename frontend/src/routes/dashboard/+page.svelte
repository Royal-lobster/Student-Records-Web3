<script lang="ts">
  import RecordCard from "$lib/components/dashboard/RecordCard.svelte";
  import { connectionGuard } from "$lib/shared/connection-guard";
  import SkeletonRecordCard from "$lib/components/skeletons/SkeletonRecordCard.svelte";
  import { contracts, signerAddress } from "svelte-ethers-store";
  import type { RecordDetailsFull } from "$lib/types";
  import autoAnimate from "@formkit/auto-animate";
  const autoMagic = autoAnimate as any;
  import { BigNumber } from "ethers";
  import Navbar from "$lib/components/layout/Navbar.svelte";

  $: connectionGuard();

  let records: RecordDetailsFull[] | null = [];

  $: {
    let unsubscribe = contracts.subscribe((c) =>
      c.recordsContract
        ?.getRecordsByMaintainer($signerAddress)
        .then((res: RecordDetailsFull[]) => {
          records = res.length ? res : null;
        })
    );
    unsubscribe();
  }

  $: recordRemoved = (e: CustomEvent) => {
    records = records!.filter(
      (record) => BigNumber.from(record.id).toBigInt() !== e.detail
    );
    if (records.length === 0) records = null;
  };
</script>

<Navbar name="Your Records" showAddRecord />
<div class="mb-28 flex flex-col gap-6">
  {#if $signerAddress && records && records.length > 0}
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4" use:autoMagic>
      {#each records as record (record.id)}
        <RecordCard {record} on:remove={recordRemoved} />
      {/each}
    </div>
  {:else if records === null || records.length === 0}
    <div
      class="flex flex-col gap-10 items-center w-[560px] max-w-[90vw] justify-center absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]"
    >
      <img src="/images/empty.svg" alt="Empty" class=" flex-shrink-0" />
      <h1 class="text-2xl text-center">
        Create new record by pressing "new record" button
      </h1>
    </div>
  {:else}
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {#each Array(10).fill(0) as _, i}
        <SkeletonRecordCard />
      {/each}
    </div>
  {/if}
</div>
