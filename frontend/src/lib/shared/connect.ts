import { utils, providers } from "ethers";
import { config } from "$lib/config";
import { defaultEvmStores } from "svelte-ethers-store";

export const web3auth = async () => {
  const { Web3Auth } = await import("@web3auth/web3auth");
  return new Web3Auth({
    clientId: config.web3AuthClientId,
    chainConfig: {
      chainNamespace: "eip155",
      chainId: utils.hexlify(config.chainId),
      rpcTarget: "https://rpc.ankr.com/polygon_mumbai",
    },
  });
};

export const connect = async () => {
  const auth = await web3auth();
  await auth.initModal();
  const web3authProvider = await auth.connect();
  console.log("web3authProvider", web3authProvider);
  if (web3authProvider) {
    defaultEvmStores.setProvider(new providers.Web3Provider(web3authProvider));
  }
  localStorage.setItem("connected", "true");
};
