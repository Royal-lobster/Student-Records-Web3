import { Web3Auth } from "@web3auth/web3auth";
import { CHAIN_NAMESPACES } from "@web3auth/base";
import { utils, providers } from "ethers";
import { config } from "$lib/config";
import { defaultEvmStores } from "svelte-ethers-store";

export const web3auth = new Web3Auth({
  clientId: config.web3AuthClientId,
  chainConfig: {
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    chainId: utils.hexlify(config.chainId),
    rpcTarget: "https://rpc.ankr.com/polygon_mumbai",
  },
});

export const connect = async () => {
  await web3auth.initModal();
  const web3authProvider = await web3auth.connect();
  console.log("web3authProvider", web3authProvider);
  if (web3authProvider) {
    defaultEvmStores.setProvider(new providers.Web3Provider(web3authProvider));
  }
  localStorage.setItem("connected", "true");
};
