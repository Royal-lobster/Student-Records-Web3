import { WEB3STORAGE_TOKEN } from "$env/static/private";
import { File, Web3Storage } from "web3.storage";

export const uploadToIPFS = async (ipfsData: Object) => {
  const client = new Web3Storage({
    token: WEB3STORAGE_TOKEN,
  });

  const jsonFile = new File([JSON.stringify(ipfsData)], "data.json", {
    type: "application/json",
  });

  const cid = await client.put([jsonFile]);
  console.log("PINNED: ", cid);

  // used to populate cloudflare cache on pined json data
  fetch(`https://${cid}.ipfs.w3s.link/data.json`);

  return cid;
};
