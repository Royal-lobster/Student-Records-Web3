import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers, network } from "hardhat";

describe("Records Contract", function () {
  const firstRecordData = {
    name: "Workshop Grades for Central Metrics Examination",
    description:
      "Grades for Central Metrics Examination for all the students who took the exam",
  };

  async function deployTokenFixture() {
    await network.provider.send("hardhat_reset");
    const [owner, addr1, addr2] = await ethers.getSigners();
    const RecordsContract = await ethers.getContractFactory("Records");
    const DeployedRecordsContract = await RecordsContract.deploy();
    DeployedRecordsContract.connect(owner);
    return { RecordsContract, DeployedRecordsContract, owner, addr1, addr2 };
  }

  async function addRecordFixture() {
    const { DeployedRecordsContract, owner, addr1, addr2 } = await loadFixture(
      deployTokenFixture
    );
    await (
      await DeployedRecordsContract.addRecord(
        firstRecordData.name,
        firstRecordData.description
      )
    ).wait();
    return { DeployedRecordsContract, owner, addr1, addr2 };
  }

  it("Should be able to add new record", async function () {
    const { DeployedRecordsContract } = await loadFixture(addRecordFixture);

    const recordReadTx = await DeployedRecordsContract.getRecord(0);
    expect(recordReadTx.name).to.equal(firstRecordData.name);
  });

  it("Should be able to add new entries to existing record", async function () {
    const { DeployedRecordsContract, addr1 } = await loadFixture(
      addRecordFixture
    );
    const data = {
      recipient: addr1.address,
      ipfsData: "Some data",
    };
    await (
      await DeployedRecordsContract.addEntry(0, data.recipient, data.ipfsData)
    ).wait();
    const entryReadTx = await DeployedRecordsContract.getEntry(0, 0);
    expect(entryReadTx.recipient).to.equal(data.recipient);
  });

  it("Should allow recipient to acknowledge the entry", async function () {
    const { DeployedRecordsContract, addr1 } = await loadFixture(
      addRecordFixture
    );

    const data = {
      recipient: addr1.address,
      ipfsData: "Some data",
    };
    await (
      await DeployedRecordsContract.addEntry(0, data.recipient, data.ipfsData)
    ).wait();

    await (
      await DeployedRecordsContract.connect(addr1).acknowledgeEntry(0, 0)
    ).wait();
    const entryReadTx = await DeployedRecordsContract.getEntry(0, 0);
    expect(entryReadTx.acknowledged).to.equal(true);
  });
});
