import { BigNumber, type ContractReceipt } from "ethers";

export const shortenAddress = (address: string) => {
	if (address)
		return `${address.substring(0, 6)}...${address.substring(
			address.length - 4,
		)}`;
};

export const getRecordId = (reciept: ContractReceipt) => {
	return BigNumber.from(reciept.events?.[0].args?.[0]).toBigInt();
};

export const truncate = (str: string, n: number) => {
	return str.length > n ? `${str.substring(0, n - 1)}...` : str;
};

export const errorSafeFetch = async (
	url: string,
	options?: Parameters<typeof fetch>[1],
) => {
	try {
		const res = await fetch(url, options);
		return res;
	} catch (err) {
		console.error("🚨 [FETCH ERROR]: ", err);
		return null;
	}
};
