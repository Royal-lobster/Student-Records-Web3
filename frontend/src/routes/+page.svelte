<script lang="ts">
  import RecordCard from "$lib/components/home/RecordCard.svelte";
  import UserCard from "$lib/components/elements/ConnectedUser.svelte";
  import { attachRecordContract } from "$lib/shared/attach-contract";
  import { connectionGuard } from "$lib/shared/connection-guard";
  import SkeletonRecordCard from "$lib/components/skeletons/SkeletonRecordCard.svelte";
  import { contracts, signerAddress } from "svelte-ethers-store";
  import { onMount } from "svelte";
  import type { RecordDetailsFull } from "$lib/types";
  import autoAnimate from "@formkit/auto-animate";
  const autoMagic = autoAnimate as any;

  import { BigNumber } from "ethers";

  $: connectionGuard();
  attachRecordContract();

  let records: RecordDetailsFull[] = [];
  onMount(async () => {
    records = await $contracts.recordsContract.getRecordsByMaintainer(
      $signerAddress
    );
  });
  $: recordRemoved = (e: CustomEvent) => {
    records = records.filter(
      (record) => BigNumber.from(record.id).toBigInt() !== e.detail
    );
  };
</script>

<div class="my-28 flex flex-col gap-6">
  <div class="flex justify-between flex-wrap items-center w-full mb-16 gap-6">
    <h1 class="font-extrabold text-4xl sm:text-5xl">Your Records</h1>
    <div class="flex gap-4  justify-between md:justify-end w-full sm:w-auto">
      <UserCard />
      <a
        href="/add-record"
        class="btn rounded-full gap-2 px-[11px] sm:px-4 fill-slate-100/70"
      >
        New <span class="hidden sm:inline"> Record</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="24"
          height="24"
          ><path fill="none" d="M0 0h24v24H0z" /><path
            d="M11 11V7h2v4h4v2h-4v4h-2v-4H7v-2h4zm1 11C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16z"
          /></svg
        >
      </a>
    </div>
  </div>

  {#if $signerAddress && records.length >= 0}
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4" use:autoMagic>
      {#each records as record (record.id)}
        <RecordCard {record} on:remove={recordRemoved} />
      {/each}
    </div>
    {#if records.length === 0}
      <div
        class="flex flex-col gap-10 items-center justify-center mt-auto sm:mt-[15vh] xl:mt-auto"
      >
        <img src="/images/empty.svg" alt="Empty" class="w-full md:w-1/2" />
        <h1 class="text-2xl text-center">
          Create new record by pressing "new record" button
        </h1>
      </div>
    {/if}
  {:else}
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {#each Array(10).fill(0) as _, i}
        <SkeletonRecordCard />
      {/each}
    </div>
  {/if}
</div>
