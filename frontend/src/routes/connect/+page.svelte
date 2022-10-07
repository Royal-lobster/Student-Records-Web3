<script lang="ts">
  import { goto } from "$app/navigation";
  import { config } from "$lib/config";
  //@ts-ignore
  import WalletConnectProvider from "@walletconnect/web3-provider/dist/umd/index.min";
  import { providers } from "ethers";
  import {
    defaultEvmStores,
    connected,
    //@ts-ignore
    chainData,
    signerAddress,
    chainId,
  } from "svelte-ethers-store";

  let redirectPath: string | null = null;
  if (typeof window !== "undefined") {
    const urlParams = new URLSearchParams(window.location.search);
    redirectPath = urlParams.get("redirect");
  }
  let redirectProgress = 0;

  const handleWalletConnectClick = async () => {
    const provider = new WalletConnectProvider({
      rpc: {
        1: "https://rpc-mumbai.matic.today",
      },
    });
    await provider.enable();
    const web3Provider = new providers.Web3Provider(provider);
    defaultEvmStores.setProvider(web3Provider);
  };

  const handleRedirect = async () => {
    for (let i = 0; i < 100; i++) {
      redirectProgress = i;
      await new Promise((resolve) => setTimeout(resolve, 5));
    }
    if (redirectPath) goto(redirectPath);
  };

  $: if ($connected && $chainId === config.chainId) handleRedirect();
</script>

<div class="grid place-content-center min-h-screen">
  <div class=" flex flex-col gap-6 max-w-md">
    {#if $connected}
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
        <button
          class="underline decoration-gray-500/50"
          on:click={() => defaultEvmStores.disconnect()}>disconnect</button
        >
      </div>
    {:else}
      <h1 class="font-extrabold text-5xl">Connect to the Application</h1>
      <p>
        To use this application you need to connect to your ethereum wallet. if
        you don't have one you can install <a
          href="https://metamask.io/download/">Metamask extention</a
        >
      </p>
      <button class="btn gap-2" on:click={() => defaultEvmStores.setProvider()}
        >Metamask</button
      >
      <button class="btn gap-2" on:click={handleWalletConnectClick}
        >Wallet Connect</button
      >
    {/if}

    {#if redirectProgress && redirectPath}
      <div>Redirecting back to {redirectPath}</div>
      <progress
        class="progress w-full progress-accent"
        value={redirectProgress}
        max="100"
      />
    {/if}
  </div>
</div>
