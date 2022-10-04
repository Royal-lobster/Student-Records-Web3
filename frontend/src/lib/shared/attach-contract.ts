import { defaultEvmStores } from "svelte-ethers-store";
import { config } from "$lib/config";
import records from "$lib/Records.json";

const jsonAbi = JSON.stringify(records.abi);

export const attachRecordContract = () => {
  defaultEvmStores.attachContract(
    "recordsContract",
    config.contractAddress,
    jsonAbi
  );
};
