import { defaultEvmStores } from "svelte-ethers-store";
import { web3auth, web3authStore } from "./connect";

export const disconnect = async () => {
  localStorage.removeItem("connected");
  defaultEvmStores.disconnect();
  web3authStore.subscribe((c) => c?.logout())();
  window.location.reload();
};
