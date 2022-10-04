import { toast } from "$lib/store/toast";
import type { ContractReceipt } from "ethers";
import { contracts } from "svelte-ethers-store";
import { writable } from "svelte/store";
import { attachRecordContract } from "./attach-contract";

export const contractTransact = async (
  methodName: string,
  args: any[],
  options: any = {}
) => {
  attachRecordContract();
  const contractResponse: Promise<ContractReceipt | null> = new Promise(
    (resolve) => {
      contracts.subscribe(async (c) => {
        try {
          const result = await c.recordsContract[methodName](...args, options);
          resolve((await result.wait()) as ContractReceipt);
        } catch (e) {
          toast({
            message: (e as any).message,
            type: "error",
          });
          resolve(null);
        }
      });
    }
  );

  return await contractResponse;
};
