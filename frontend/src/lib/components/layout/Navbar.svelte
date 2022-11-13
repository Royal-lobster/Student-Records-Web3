<script lang="ts">
  import ConnectedUser from "$lib/components/elements/ConnectedUser.svelte";
  export let name = "";
  export let showAddRecord = false;
</script>

<div
  class="flex justify-between flex-wrap items-center w-full mb-16 gap-6 mt-10 border-b-[1px] border-black/10 pb-4"
>
  <div class="flex items-center gap-5">
    <img src="/images/jntugv-logo.svg" alt="logo" width="45px" />
    <h1 class="font-light text-3xl md:text-4xl">{name}</h1>
  </div>
  <div class="flex gap-4  justify-between md:justify-end w-full sm:w-auto">
    <ConnectedUser />
    {#if showAddRecord}
      <a
        href="/add-record"
        class="btn rounded-full gap-2 px-[11px] sm:px-4 fill-slate-100/70"
      >
        <span>New <span class="hidden sm:inline">Record</span></span>
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
    {/if}
  </div>
</div>
