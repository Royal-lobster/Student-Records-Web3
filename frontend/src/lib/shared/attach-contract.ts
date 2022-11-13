import { defaultEvmStores, signer, signerAddress } from "svelte-ethers-store";
import { config } from "$lib/config";
import records from "$lib/Records.json";
import { browser } from "$app/environment";
import { constants, ethers } from "ethers";
import { connectionGuard } from "./connection-guard";

export const attachRecordContract = () => {
  if (browser && localStorage.getItem("connected") !== "true") {
    console.log("🚨 [ATTACH CONTRACT]: no wallet connected, using null signer");
    defaultEvmStores.setProvider(
      new ethers.providers.JsonRpcProvider(config.rpcUrl),
      constants.AddressZero
    );
    localStorage.setItem("connected", "false");
  } else {
    connectionGuard();
  }
  console.log("✅ [ATTACH CONTRACT]: wallet connected, using signer");
  defaultEvmStores.attachContract(
    "recordsContract",
    config.contractAddress,
    JSON.stringify(records.abi)
  );
};
