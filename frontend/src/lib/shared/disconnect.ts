import { defaultEvmStores } from "svelte-ethers-store";
import { web3auth } from "./connect";

export const disconnect = async () => {
  localStorage.removeItem("connected");
  defaultEvmStores.disconnect();
  await web3auth.logout();
  window.location.reload();
};
