import { utils, providers } from "ethers";
import { config } from "$lib/config";
import { defaultEvmStores } from "svelte-ethers-store";
import { writable } from "svelte/store";
import type { Web3Auth } from "@web3auth/web3auth";

export const web3auth = async () => {
  const { Web3Auth } = await import("@web3auth/web3auth");
  return new Web3Auth({
    uiConfig: {
      appLogo: "/images/jntugv-logo.svg",
    },
    clientId: config.web3AuthClientId,
    chainConfig: {
      chainNamespace: "eip155",
      chainId: utils.hexlify(config.chainId),
      rpcTarget: config.rpcUrl,
    },
  });
};

export const web3authStore = writable<Web3Auth | null>(null);
export const web3authModalOpen = writable(false);

export const connect = async () => {
  const auth = await web3auth();

  web3authStore.set(auth);
  web3authModalOpen.set(true);
  await auth.initModal();
  web3authModalOpen.set(false);

  const web3authProvider = await auth.connect();
  if (web3authProvider)
    defaultEvmStores.setProvider(new providers.Web3Provider(web3authProvider));

  localStorage.setItem("connected", "true");
};
