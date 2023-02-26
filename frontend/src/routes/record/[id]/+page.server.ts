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
    console.log(dataObj);
    // const ipfsData = Object.fromEntries(
    //   Object.entries(dataObj).filter(
    //     ([key]) => !["recipent", "description"].includes(key)
    //   )
    // );
    // const cid = await uploadToIPFS(ipfsData);
    return { ipfsHash: "cid" };
  },
};
