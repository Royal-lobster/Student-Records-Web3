<script>
  import { shortenAddress } from "$lib/shared/shorten-address";
  import { defaultEvmStores, signerAddress } from "svelte-ethers-store";
</script>

{#if signerAddress}
  <div
    class="flex w-[fit-content] items-center gap-2 border rounded-full p-1 pr-4 border-gray-500/50"
  >
    <img
      class="avatar w-10 h-10"
      src="https://source.boringavatars.com/beam/{$signerAddress}"
      alt="avatar"
    />
    <div class="pr-4">
      <div class="text-xs">CONNECTED</div>
      {shortenAddress($signerAddress)}
    </div>
    <span
      on:click={defaultEvmStores.disconnect}
      class=" fill-gray-500/50 hover:fill-red-400 cursor-pointer"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="24"
        height="24"
        ><path fill="none" d="M0 0h24v24H0z" /><path
          d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2a9.985 9.985 0 0 1 8 4h-2.71a8 8 0 1 0 .001 12h2.71A9.985 9.985 0 0 1 12 22zm7-6v-3h-8v-2h8V8l5 4-5 4z"
        /></svg
      >
    </span>
  </div>
{/if}
