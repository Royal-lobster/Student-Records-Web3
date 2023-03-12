<script lang="ts">
  import { browser } from "$app/environment";
  import { goto } from "$app/navigation";
  import { config } from "$lib/config";
  import { connect, web3authModalOpen } from "$lib/shared/connect";
  import { disconnect } from "$lib/shared/disconnect";
  import { constants, ethers } from "ethers";

  import {
    connected,
    //@ts-ignore
    chainData,
    signerAddress,
    chainId,
  } from "svelte-ethers-store";

  let redirectPath: string | null = null;
  if (browser) {
    const urlParams = new URLSearchParams(window.location.search);
    redirectPath = urlParams.get("redirect");
  }

  $: if (
    redirectPath &&
    $connected &&
    $signerAddress !== constants.AddressZero &&
    $chainId === config.chainId
  )
    goto(redirectPath);
</script>

<div class="grid place-content-center min-h-screen">
  <div class=" flex flex-col gap-6 max-w-md">
    {#if $connected && $signerAddress !== constants.AddressZero}
      {#if $chainId !== config.chainId}
        <h1 class="font-extrabold text-5xl">🚨 Wrong Network</h1>
        <p>
          Please connect to the Polygon Mumbai Testnet Network. You are
          currently connected to the {$chainData.name}
          network.
        </p>
      {:else}
        <h1 class="font-extrabold text-5xl">🎉 Connected</h1>
        <p>
          Connection established. You are now connected to {$chainData.name}.
          You can now interact with the record smart contract.
        </p>
      {/if}
      <div class="flex flex-col gap-2 overflow-x-hidden">
        <div
          class="flex items-center gap-2 border rounded-full p-1 pr-4 border-gray-500/50"
        >
          <img
            class="avatar w-8 h-8"
            src="https://source.boringavatars.com/beam/40/records_{$signerAddress}"
            alt="avatar"
          />
          <span class="text-ellipsis overflow-hidden max-w-[70vw] w-full"
            >{$signerAddress}</span
          >
        </div>
        <button class="underline decoration-gray-500/50" on:click={disconnect}
          >disconnect</button
        >
      </div>
    {:else}
      <h1 class="font-extrabold text-5xl">Connect to the Application</h1>
      <p>
        Click on the button below to connect to the application. You can login
        with any of your social media account or with your wallet.
      </p>
      {#if !$web3authModalOpen}
        <button class="btn gap-2" on:click={connect}>Connect</button>
      {:else}
        <button class="btn loading gap-2" disabled on:click={connect}
          >Connect initiating</button
        >
      {/if}
    {/if}
  </div>
</div>
