import { toast } from "$lib/store/toast";
import type { ContractReceipt } from "ethers";
import { contracts } from "svelte-ethers-store";

export const contractTransact = async (
  methodName: string,
  args: any[],
  options: any = {}
) => {
  const contractResponse: Promise<ContractReceipt | null> = new Promise(
    (resolve) => {
      const unsubscribe = contracts.subscribe(async (c) => {
        try {
          const result = await c.recordsContract[methodName](...args, options);
          resolve((await result.wait()) as ContractReceipt);
        } catch (e) {
          toast({
            message: (e as any).message,
            type: "error",
          });
          console.error({ type: "ERROR IN CONTRACT TRANSACT", message: e });
          resolve(null);
        }
      });
      unsubscribe();
    }
  );

  return await contractResponse;
};
