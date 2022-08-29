import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers, network } from "hardhat";

describe("Records Contract", function () {
  it("Should be able to add new record", async function () {
    await network.provider.send("hardhat_reset");
    const [owner] = await ethers.getSigners();
    const RecordsContract = await ethers.getContractFactory("Records");
    const DeployedRecordsContract = await RecordsContract.deploy();
    DeployedRecordsContract.connect(owner);

    const data = {
      name: "Workshop Grades for Central Metrics Examination",
      description:
        "Grades for Central Metrics Examination for all the students who took the exam",
    };

    await (
      await DeployedRecordsContract.addRecord(data.name, data.description)
    ).wait();

    const recordReadTx = await DeployedRecordsContract.getRecord(0);
    expect(recordReadTx.name).to.equal(data.name);
  });
});
