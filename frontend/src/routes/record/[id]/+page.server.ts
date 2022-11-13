import { ipfsDataKeys } from "$lib/types";
import type { Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { Web3Storage, getFilesFromPath, File } from "web3.storage";
import { WEB3STORAGE_TOKEN } from "$env/static/private";

export const load: PageServerLoad = async () => {
  return {};
};

export const actions: Actions = {
  pinJSON: async ({ request }) => {
    const formData = await request.formData();
    const dataObj = Object.fromEntries(formData.entries());
    const ipfsData = Object.fromEntries(
      Object.entries(dataObj).filter(([key]) =>
        Object.values(ipfsDataKeys).includes(key as ipfsDataKeys)
      )
    );

    const client = new Web3Storage({
      token: WEB3STORAGE_TOKEN,
    });

    const jsonFile = new File([JSON.stringify(ipfsData)], "data.json", {
      type: "application/json",
    });

    const cid = await client.put([jsonFile]);
    console.log("PINNED: ", cid);

    // used to populate cloudflare cache on pined json data
    fetch(`https://${cid}.ipfs.cf-ipfs.com/data.json`);

    return { ipfsHash: cid };
  },
};
