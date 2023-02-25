import type { Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { uploadToIPFS } from "$lib/shared/upload-ipfs";

export const load: PageServerLoad = async () => {
  return {};
};

export const actions: Actions = {
  pinJSON: async ({ request }) => {
    const formData = await request.formData();
    const formDataEntries = Object.fromEntries(formData.entries());
    const customFieldsData = JSON.parse(formDataEntries.data as string);
    return { ipfsHash: await uploadToIPFS(customFieldsData) };
  },
};
