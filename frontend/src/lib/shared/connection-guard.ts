import { browser } from "$app/environment";
import { goto } from "$app/navigation";
import { chainId, defaultEvmStores } from "svelte-ethers-store";
import { config } from "$lib/config";

export const connectionGuard = () => {
  if (!browser) return;

  if (localStorage.getItem("connected") === "metamask") {
    defaultEvmStores.setProvider();
    return;
  }

  chainId.subscribe((chainId) => {
    if (chainId !== config.chainId)
      goto(`/connect?redirect=${window.location.pathname}`);
  });
};
