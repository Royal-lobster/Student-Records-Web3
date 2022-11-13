import { defaultEvmStores, signer, signerAddress } from "svelte-ethers-store";
import { config } from "$lib/config";
import records from "$lib/Records.json";
import { browser } from "$app/environment";
import { ethers } from "ethers";
import { connectionGuard } from "./connection-guard";

export const attachRecordContract = () => {
  if (browser && !localStorage.getItem("connected")) {
    console.log("🚨 [ATTACH CONTRACT]: no wallet connected, using null signer");
    defaultEvmStores.setProvider(
      new ethers.providers.JsonRpcProvider(config.rpcUrl),
      "0x0000000000000000000000000000000000000000"
    );
  } else {
    connectionGuard();
  }
  console.log("✅ [ATTACH CONTRACT]: wallet connected, using signer");
  defaultEvmStores.attachContract(
    "recordsContract",
    config.contractAddress,
    JSON.stringify(records.abi),
    !(browser && !localStorage.getItem("connected"))
  );
};
