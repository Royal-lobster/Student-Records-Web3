import { browser } from "$app/environment";
import { goto } from "$app/navigation";
import { chainId } from "svelte-ethers-store";
import { config } from "$lib/config";
import { connect } from "./connect";

export const connectionGuard = () => {
  if (!browser) return;

  if (localStorage.getItem("connected") === "true") {
    connect();
    return;
  }

  chainId.subscribe((chainId) => {
    if (chainId !== config.chainId)
      goto(`/connect?redirect=${window.location.pathname}`);
  });
};
