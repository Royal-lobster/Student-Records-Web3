import { defaultEvmStores } from "svelte-ethers-store";

export const disconnect = () => {
  localStorage.removeItem("connected");
  defaultEvmStores.disconnect();
  window.location.reload();
};
