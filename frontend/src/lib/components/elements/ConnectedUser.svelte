<script>
  import { disconnect } from "$lib/shared/disconnect";
  import { shortenAddress } from "$lib/shared/utils";
  import { signerAddress } from "svelte-ethers-store";
  import Loader4Line from "svelte-remixicon/lib/icons/Loader4Line.svelte";
  import LogoutCircleRLine from "svelte-remixicon/lib/icons/LogoutCircleRLine.svelte";
</script>

{#if signerAddress}
  <div
    class="flex w-[fit-content] flex-shrink-0 items-center gap-2 border rounded-full p-1 pr-4 border-gray-500/50"
  >
    {#if $signerAddress}
      <img
        class="avatar w-10 h-10"
        src="https://source.boringavatars.com/beam/40/records_{$signerAddress}"
        alt="avatar"
      />
      <div class="pr-4">
        <div class="text-xs">CONNECTED</div>
        <div class="w-24">{shortenAddress($signerAddress)}</div>
      </div>
    {:else}
      <Loader4Line class="w-10 h-10 animate-spin" />
      <div class="text-xs w-24">CONNECTING</div>
    {/if}

    <LogoutCircleRLine
      on:click={disconnect}
      class="w-6 h-6 fill-gray-500/50  hover:fill-red-400 cursor-pointer"
    />
  </div>
{/if}
