<script>
  import { browser } from "$app/environment";
  import { disconnect } from "$lib/shared/disconnect";
  import { shortenAddress } from "$lib/shared/utils";
  import { toast } from "$lib/store/toast";
  import { signerAddress } from "svelte-ethers-store";
  import {
    Loader4Line,
    LoginBoxLine,
    LogoutCircleRLine,
  } from "svelte-remixicon";

  const handleCopyAddress = () => {
    navigator.clipboard.writeText($signerAddress);
    toast({
      message: "Address copied to clipboard",
      type: "success",
    });
  };
</script>

{#if browser && window.localStorage.getItem("connected") === "true"}
  <div
    class="flex w-[fit-content] flex-shrink-0 items-center gap-2 border rounded-full p-1 pr-4 border-gray-500/50"
  >
    {#if $signerAddress}
      <img
        class="avatar w-10 h-10 bg-current rounded-full"
        src="https://source.boringavatars.com/beam/40/records_{$signerAddress}"
        alt="avatar"
      />
      <div class="pr-4 w-24">
        <div class="text-xs">CONNECTED</div>
        <div
          class="text-xs font-bold cursor-pointer"
          on:keypress={handleCopyAddress}
          on:click={handleCopyAddress}
        >
          {shortenAddress($signerAddress)}
        </div>
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
{:else}
  <button
    class="btn btn-primary rounded-full"
    on:click={() =>
      (window.location.href = `/connect?redirect=${window.location.pathname}`)}
  >
    <LoginBoxLine class="w-6 h-6 mr-2" />
    Connect Wallet
  </button>
{/if}
