<script lang="ts">
	import { goto } from '$app/navigation';
	import {
		defaultEvmStores,
		connected,
		//@ts-ignore
		chainData,
		signerAddress,
		chainId
	} from 'svelte-ethers-store';

    const urlParams = new URLSearchParams(window.location.search);
	const redirectPath = urlParams.get('redirect');
    let redirectProgress = 0;

	const handleRedirect = async () => {
		
        const incrementRedirectProgress = async () => {
            for (let i = 0; i < 100; i++) {
                redirectProgress = i;
                await new Promise((resolve) => setTimeout(resolve, 20));
            }
        }
       await incrementRedirectProgress();
		if (redirectPath) goto(redirectPath);
	};

    $: if ($connected && $chainId === 80001) handleRedirect();
</script>

<div class="grid place-content-center min-h-screen">
	<div class=" flex flex-col gap-6 max-w-md">
		{#if $connected}
			{#if $chainId !== 80001}
				<h1 class="font-extrabold text-5xl">🚨 Wrong Network</h1>
				<p>
					Please connect to the Polygon Mumbai Testnet Network. You are currently connected to the {$chainData.name}
					network.
				</p>
			{:else}
				<h1 class="font-extrabold text-5xl">🎉 Connected</h1>
				<p>
					Connection established. You are now connected to {$chainData.name}. You can now interact
					with the record smart contract.
				</p>
			{/if}
			<div class="flex items-center gap-2 border rounded-full p-1 pr-4 border-[#ffffff2a]">
				<img
					class="avatar w-8 h-8"
					src="https://source.boringavatars.com/beam/{$signerAddress}"
					alt="avatar"
				/>
				{$signerAddress}
			</div>
		{:else}
			<h1 class="font-extrabold text-5xl">Connect to the Application</h1>
			<p>
				To use this application you need to connect to your ethereum wallet. if you don't have one
				you can install <a href="https://metamask.io/download/">Metamask extention</a>
			</p>
			<button class="btn" on:click={() => defaultEvmStores.setProvider()}>Connect</button>
		{/if}

        {#if redirectProgress > 0}
                <div>Redirecting back to {redirectPath}</div>
                <progress class="progress w-full progress-accent" value={redirectProgress} max="100"></progress>
        {/if}
	</div>
</div>
