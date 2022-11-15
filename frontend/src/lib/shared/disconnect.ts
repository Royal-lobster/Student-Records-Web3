import { defaultEvmStores } from "svelte-ethers-store";
import { web3authStore } from "./connect";

export const disconnect = async () => {
  localStorage.clear();
  defaultEvmStores.disconnect();
  web3authStore.subscribe((c) => c?.logout())();
  window.location.reload();
};
