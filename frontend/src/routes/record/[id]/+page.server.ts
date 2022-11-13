import { ipfsDataKeys } from "$lib/types";
import type { Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
  return {};
};

export const actions: Actions = {
  pinJSON: async ({ request }) => {
    const data = await request.formData();
    const ipfsData = Object.fromEntries(
      Object.entries(data).filter(([key]) =>
        Object.values(ipfsDataKeys).includes(key as ipfsDataKeys)
      )
    );
    console.log({ ipfsData });
    return { ipfsHash: "YO_GOT_THUH_HASH" };
  },
};
