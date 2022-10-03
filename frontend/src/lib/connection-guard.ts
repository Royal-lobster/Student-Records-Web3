import { browser } from '$app/environment';
import { goto } from '$app/navigation';
import { chainId } from 'svelte-ethers-store';
export const connectionGuard = () => {
	if (!browser) return;
	chainId.subscribe((chainId) => {
		if (chainId !== 80001) goto(`/connect?redirect=${window.location.pathname}`);
	});
};
