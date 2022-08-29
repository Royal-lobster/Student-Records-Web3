import { ethers } from "hardhat";

async function main() {
  const Records = await ethers.getContractFactory("Records");
  const records = await Records.deploy();

  await records.deployed();

  console.log(
    `Deployed records at ${records.address} with gas ${records.deployTransaction.gasPrice}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
