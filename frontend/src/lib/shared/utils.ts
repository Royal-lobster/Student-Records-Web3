import { BigNumber, type ContractReceipt } from "ethers";

export const shortenAddress = (address: string) => {
  if (address)
    return (
      address.substring(0, 6) + "..." + address.substring(address.length - 4)
    );
};

export const getRecordId = (reciept: ContractReceipt) => {
  return BigNumber.from(
    reciept.events && reciept.events[0].args && reciept.events[0].args[0]
  ).toBigInt();
};

export const truncate = (str: string, n: number) => {
  return str.length > n ? str.substring(0, n - 1) + "..." : str;
};
