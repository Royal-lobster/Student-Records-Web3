import type { Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { uploadToIPFS } from "$lib/shared/upload-ipfs";

export const load: PageServerLoad = async () => {
  return {};
};

export const actions: Actions = {
  pinJSON: async ({ request }) => {
    const formData = await request.formData();
    const dataObj = Object.fromEntries(formData.entries());
    delete dataObj.RECIPIENT_ETH_ADDR;

    const ipfsData = Object.fromEntries(
      Object.entries(dataObj)
        .filter(([key]) => !["RECIPIENT_ETH_ADDR"].includes(key))
        .map(([key, value]) => [key.replace(/ \[\d+\]$/, ""), value])
    );

    console.log(ipfsData);
    const cid = await uploadToIPFS(ipfsData);
    return { ipfsHash: cid };
  },
};
