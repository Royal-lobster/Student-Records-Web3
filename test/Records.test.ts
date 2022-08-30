import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
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
    const [owner, addr1, addr2, addr3] = await ethers.getSigners();
    const RecordsContract = await ethers.getContractFactory("Records");
    const DeployedRecordsContract = await RecordsContract.deploy();
    DeployedRecordsContract.connect(owner);
    return {
      RecordsContract,
      DeployedRecordsContract,
      owner,
      addr1,
      addr2,
      addr3,
    };
  }

  async function add0thRecordFixture() {
    const { DeployedRecordsContract, owner, addr1, addr2, addr3 } =
      await loadFixture(deployTokenFixture);
    await (
      await DeployedRecordsContract.addRecord(
        firstRecordData.name,
        firstRecordData.description
      )
    ).wait();
    return { DeployedRecordsContract, owner, addr1, addr2, addr3 };
  }

  async function add0thEntryTo0thRecordFixture() {
    const { DeployedRecordsContract, owner, addr1, addr2, addr3 } =
      await loadFixture(add0thRecordFixture);
    await (
      await DeployedRecordsContract.addEntry(0, addr1.address, "SOME_IPFS_HASH")
    ).wait();
    return { DeployedRecordsContract, owner, addr1, addr2, addr3 };
  }

  it("Should be able to add/read record", async function () {
    const { DeployedRecordsContract } = await loadFixture(add0thRecordFixture);

    const recordReadTx = await DeployedRecordsContract.getRecord(0);
    expect(recordReadTx.name).to.equal(firstRecordData.name);
  });

  it("Should be able to add/read new entry to existing record", async function () {
    const { DeployedRecordsContract, addr1 } = await loadFixture(
      add0thEntryTo0thRecordFixture
    );
    const entryReadTx = await DeployedRecordsContract.getEntry(0, 0);
    expect(entryReadTx.recipient).to.equal(addr1.address);
  });

  it("Should allow recipient to acknowledge the entry", async function () {
    const { DeployedRecordsContract, addr1 } = await loadFixture(
      add0thEntryTo0thRecordFixture
    );
    await (
      await DeployedRecordsContract.connect(addr1).acknowledgeEntry(0, 0)
    ).wait();
    const entryReadTx = await DeployedRecordsContract.getEntry(0, 0);
    expect(entryReadTx.acknowledged).to.equal(true);
  });

  it("Should allow adding multiple entries and show counts", async function () {
    const { DeployedRecordsContract, addr2, addr3 } = await loadFixture(
      add0thEntryTo0thRecordFixture
    );
    const additionalEntriesData = [
      { recipient: addr2.address, ipfsHash: "SOME_IPFS_HASH" },
      { recipient: addr3.address, ipfsHash: "SOME_IPFS_HASH" },
    ];

    for (const entryData of additionalEntriesData) {
      await (
        await DeployedRecordsContract.addEntry(
          0,
          entryData.recipient,
          entryData.ipfsHash
        )
      ).wait();
    }

    const entryCount = await DeployedRecordsContract.getEntryCount(0);
    expect(entryCount).to.equal(3);
  });

  it("Should allow adding multiple records and show counts", async function () {
    const { DeployedRecordsContract, addr1, addr2 } = await loadFixture(
      add0thEntryTo0thRecordFixture
    );
    const additionalRecordData = [
      {
        name: "Student Attendance for Central Metrics Examination",
        description:
          "Attendance for Central Metrics Examination for all the students who took the exam",
      },
      {
        name: "Grades for First Year Students",
        description:
          "Grades for First Year Students for all the students who took the exam",
      },
      {
        name: "Grades for Second Year Students",
        description: "Grades for Second Year Students for all the students",
      },
    ];

    for (let i = 0; i < additionalRecordData.length; i++) {
      await (
        await DeployedRecordsContract.addRecord(
          additionalRecordData[i].name,
          additionalRecordData[i].description
        )
      ).wait();
    }

    const recordCount = await DeployedRecordsContract._recordsLength();

    expect(recordCount).to.equal(additionalRecordData.length + 1);
  });
});
