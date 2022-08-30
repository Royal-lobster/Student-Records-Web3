import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "solidity-coverage";
import dotenv from "dotenv";
dotenv.config({ path: __dirname + "/.env" });

const RPC_URL = process.env.ALCHEMY_RPC_URL;
const PRIVATE_KEY = process.env.WALLET_PRIVATE_KEY;

const config: HardhatUserConfig = {
  solidity: "0.8.9",
  networks: {
    mumbai: {
      url: RPC_URL,
      accounts: [`0x${PRIVATE_KEY}`],
    },
  },
};

export default config;
