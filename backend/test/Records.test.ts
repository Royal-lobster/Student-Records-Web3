import { expect } from "chai";
import { ethers } from "hardhat";
import { ContractReceipt } from "ethers";

const getRecordId = (reciept: ContractReceipt) => {
  return ethers.BigNumber.from(
    reciept.events && reciept.events[0].args && reciept.events[0].args[0]
  ).toBigInt();
};

const getRecordEvent = (reciept: ContractReceipt) => {
  return reciept.events && reciept.events[0];
};

describe("Records Contract", function () {
  const firstRecordData = {
    name: "Workshop Grades for Central Metrics Examination",
    description:
      "Grades for Central Metrics Examination for all the students who took the exam",
    ipfs_structure: "SOME_IPFS_HASH",
  };

  async function deployTokenFixture() {
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
      await deployTokenFixture();
    const reciept = await (
      await DeployedRecordsContract.addRecord(
        firstRecordData.name,
        firstRecordData.description,
        firstRecordData.ipfs_structure
      )
    ).wait();
    const recordId = getRecordId(reciept);
    return { DeployedRecordsContract, owner, addr1, addr2, addr3, recordId };
  }

  async function add0thEntryTo0thRecordFixture() {
    const { DeployedRecordsContract, owner, addr1, addr2, addr3, recordId } =
      await add0thRecordFixture();
    const reciept = await (
      await DeployedRecordsContract.addEntry(
        recordId,
        addr1.address,
        "SOME_IPFS_HASH"
      )
    ).wait();
    return { DeployedRecordsContract, owner, addr1, addr2, addr3, recordId };
  }

  it("Should be able to add/read record", async function () {
    const { DeployedRecordsContract, recordId } = await add0thRecordFixture();

    const recordReadTx = await DeployedRecordsContract.getRecord(recordId);
    expect(recordReadTx.name).to.equal(firstRecordData.name);
  });

  it("Should be able to emit correct record added event", async function () {
    const { DeployedRecordsContract } = await deployTokenFixture();
    const recordIdTx = await DeployedRecordsContract.addRecord(
      firstRecordData.name,
      firstRecordData.description,
      firstRecordData.ipfs_structure
    );
    const reciept = await recordIdTx.wait();
    const e = getRecordEvent(reciept);
    expect(e?.args && e.args[1]).to.equal(firstRecordData.name);
  });

  it("Should be able to add/read new entry to existing record", async function () {
    const { DeployedRecordsContract, addr1, recordId } =
      await add0thEntryTo0thRecordFixture();
    const entryReadTx = await DeployedRecordsContract.getEntry(recordId, 0);
    expect(entryReadTx.recipient).to.equal(addr1.address);
  });

  it("Should be able to emit correct entry added event", async function () {
    const { DeployedRecordsContract, addr1, recordId } =
      await add0thEntryTo0thRecordFixture();
    const entryIdTx = await DeployedRecordsContract.addEntry(
      recordId,
      addr1.address,
      "SOME_IPFS_HASH"
    );
    const entryId = await entryIdTx.wait();
    expect(
      entryId.events && entryId.events[0].args && entryId.events[0].args[2]
    ).to.equal(addr1.address);
  });

  it("Should'nt be able to allow non-maintainers to add entry", async function () {
    const { DeployedRecordsContract, addr2, recordId } =
      await add0thEntryTo0thRecordFixture();
    await expect(
      DeployedRecordsContract.connect(addr2).addEntry(
        recordId,
        addr2.address,
        "SOME_FISHY_IPFS_HASH"
      )
    ).to.be.revertedWith("Only the maintainer can add entries to a record.");
  });

  it("Should allow recipient to acknowledge the entry", async function () {
    const { DeployedRecordsContract, addr1, recordId } =
      await add0thEntryTo0thRecordFixture();
    await (
      await DeployedRecordsContract.connect(addr1).acknowledgeEntry(recordId, 0)
    ).wait();
    const entryReadTx = await DeployedRecordsContract.getEntry(recordId, 0);
    expect(entryReadTx.acknowledged).to.equal(true);
  });

  it("Should'nt be able to allow non-recipient to acknowledge the entry", async function () {
    const { DeployedRecordsContract, addr2, recordId } =
      await add0thEntryTo0thRecordFixture();
    await expect(
      DeployedRecordsContract.connect(addr2).acknowledgeEntry(recordId, 0)
    ).to.be.revertedWith("Only the recipient can acknowledge an entry.");
  });

  it("Should allow recipient to unAcknowledge an entry  ", async function () {
    const { DeployedRecordsContract, addr1, recordId } =
      await add0thEntryTo0thRecordFixture();
    await (
      await DeployedRecordsContract.connect(addr1).unAcknowledgeEntry(
        recordId,
        0
      )
    ).wait();
    const entryReadTx = await DeployedRecordsContract.getEntry(recordId, 0);
    expect(entryReadTx.acknowledged).to.equal(false);
  });

  it("Should'nt be able to allow non-recipient to unAcknowledge the entry", async function () {
    const { DeployedRecordsContract, addr2, recordId } =
      await add0thEntryTo0thRecordFixture();
    await expect(
      DeployedRecordsContract.connect(addr2).unAcknowledgeEntry(recordId, 0)
    ).to.be.revertedWith("Only the recipient can unacknowledge an entry.");
  });

  it("Should allow adding multiple entries and show counts", async function () {
    const { DeployedRecordsContract, addr2, addr3, recordId } =
      await add0thEntryTo0thRecordFixture();
    const additionalEntriesData = [
      { recipient: addr2.address, ipfsHash: "SOME_IPFS_HASH" },
      { recipient: addr3.address, ipfsHash: "SOME_IPFS_HASH" },
    ];
    for (const entryData of additionalEntriesData) {
      await (
        await DeployedRecordsContract.addEntry(
          recordId,
          entryData.recipient,
          entryData.ipfsHash
        )
      ).wait();
    }
    const entryCount = await DeployedRecordsContract.getEntryCount(recordId);
    expect(entryCount).to.equal(3);
  });

  it("Should allow adding multiple records", async function () {
    const { DeployedRecordsContract } = await add0thEntryTo0thRecordFixture();
    const additionalRecordData = [
      {
        name: "Student Attendance for Central Metrics Examination",
        description:
          "Attendance for Central Metrics Examination for all the students who took the exam",
        ipfs_structure: "SOME_IPFS_HASH",
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
    const recordIds = [];
    for (const recordData of additionalRecordData) {
      const reciept = await (
        await DeployedRecordsContract.addRecord(
          recordData.name,
          recordData.description,
          firstRecordData.ipfs_structure
        )
      ).wait();
      const id = getRecordId(reciept);
      recordIds.push(id);
    }

    for (let i = 0; i < recordIds.length; i++) {
      const recordReadTx = await DeployedRecordsContract.getRecord(
        recordIds[i]
      );
      expect(recordReadTx.name).to.equal(additionalRecordData[i].name);
    }
  });

  it("Should show all records by maintainer address", async function () {
    const { DeployedRecordsContract, owner } = await deployTokenFixture();
    const additionalRecordData = [
      {
        name: "Student Attendance for Central Metrics Examination",
        description:
          "Attendance for Central Metrics Examination for all the students who took the exam",
        ipfs_structure: "SOME_IPFS_HASH",
      },
      {
        name: "Grades for First Year Students",
        description:
          "Grades for First Year Students for all the students who took the exam",
        ipfs_structure: "SOME_IPFS_HASH",
      },
      {
        name: "Grades for Second Year Students",
        description: "Grades for Second Year Students for all the students",
        ipfs_structure: "SOME_IPFS_HASH",
      },
    ];
    for (const recordData of additionalRecordData) {
      await (
        await DeployedRecordsContract.addRecord(
          recordData.name,
          recordData.description,
          firstRecordData.ipfs_structure
        )
      ).wait();
    }
    const maintainerRecords =
      await DeployedRecordsContract.getRecordsByMaintainer(owner.address);

    for (let i = 0; i < maintainerRecords.length; i++) {
      expect(maintainerRecords[i].name).to.equal(additionalRecordData[i].name);
    }
  });

  it("Should be able to delete entry of record", async function () {
    const { DeployedRecordsContract, recordId } =
      await add0thEntryTo0thRecordFixture();
    await (await DeployedRecordsContract.deleteEntry(recordId, 0)).wait();
    const entry = await DeployedRecordsContract.getEntry(recordId, 0);
    expect(entry.recipient).to.equal(ethers.constants.AddressZero);
  });

  it("Should remove the record id from maintainer's records", async function () {
    const { DeployedRecordsContract, owner, recordId } =
      await add0thEntryTo0thRecordFixture();
    await (await DeployedRecordsContract.deleteRecord(recordId)).wait();
    const maintainerRecords =
      await DeployedRecordsContract.getRecordsByMaintainer(owner.address);
    expect(maintainerRecords.length).to.equal(0);
  });

  it("Should'nt be able to allow non-maintainers to delete entry", async function () {
    const { DeployedRecordsContract, addr2, recordId } =
      await add0thEntryTo0thRecordFixture();
    await expect(
      DeployedRecordsContract.connect(addr2).deleteEntry(recordId, 0)
    ).to.be.revertedWith(
      "Only the maintainer can delete entries from a record."
    );
  });

  it("Should be able to delete record", async function () {
    const { DeployedRecordsContract, recordId } = await add0thRecordFixture();
    await (await DeployedRecordsContract.deleteRecord(recordId)).wait();
    const recordReadTx = await DeployedRecordsContract.getRecord(0);
    expect(recordReadTx.name).to.equal("");
  });

  it("Should'nt be able to allow non-maintainers to delete record", async function () {
    const { DeployedRecordsContract, addr2, recordId } =
      await add0thRecordFixture();
    await expect(
      DeployedRecordsContract.connect(addr2).deleteRecord(recordId)
    ).to.be.revertedWith("Only the maintainer can delete a record.");
  });

  it("Should be able to update record details", async function () {
    const { DeployedRecordsContract, recordId } = await add0thRecordFixture();
    const newRecordData = {
      name: "Workshop Grades for Local Metrics Examination",
      description:
        "Grades for Local Metrics Examination for all the students who took the exam",
      ipfs_structure: "SOME_IPFS_HASH",
    };
    await (
      await DeployedRecordsContract.updateRecordDetails(
        recordId,
        newRecordData.name,
        newRecordData.description,
        firstRecordData.ipfs_structure
      )
    ).wait();
    const recordReadTx = await DeployedRecordsContract.getRecord(recordId);
    expect(recordReadTx.name).to.equal(newRecordData.name);
    expect(recordReadTx.description).to.equal(newRecordData.description);
  });

  it("Should'nt be able to update record details by non-maintainer", async function () {
    const { DeployedRecordsContract, addr2 } = await add0thRecordFixture();
    await expect(
      DeployedRecordsContract.connect(addr2).updateRecordDetails(
        0,
        "SOME_NEW_NAME",
        "SOME_NEW_DESCRIPTION",
        "SOME_NEW_IPFS_STRUCTURE"
      )
    ).to.be.revertedWith(
      "Only the maintainer can update the details of a record."
    );
  });

  it("Should be able to update record maintainer", async function () {
    const { DeployedRecordsContract, addr3, recordId } =
      await add0thRecordFixture();
    await (
      await DeployedRecordsContract.updateRecordMaintainer(
        recordId,
        addr3.address
      )
    ).wait();
    const recordReadTx = await DeployedRecordsContract.getRecord(recordId);
    expect(recordReadTx.maintainer).to.equal(addr3.address);
  });

  it("Should'nt be able to update record maintainer by non-maintainer", async function () {
    const { DeployedRecordsContract, addr2, addr3, recordId } =
      await add0thRecordFixture();
    await expect(
      DeployedRecordsContract.connect(addr2).updateRecordMaintainer(
        recordId,
        addr3.address
      )
    ).to.be.revertedWith(
      "Only the maintainer can update the maintainer of a record."
    );
  });

  it("Should be able to update entry", async function () {
    const { DeployedRecordsContract, addr2, recordId } =
      await add0thEntryTo0thRecordFixture();
    const newEntryData = {
      recipient: addr2.address,
      ipfsHash: "SOME_OTHER_IPFS_HASH",
    };
    await (
      await DeployedRecordsContract.updateEntry(
        recordId,
        0,
        newEntryData.recipient,
        newEntryData.ipfsHash
      )
    ).wait();
    const entryReadTx = await DeployedRecordsContract.getEntry(recordId, 0);
    expect(entryReadTx.recipient).to.equal(newEntryData.recipient);
    expect(entryReadTx.ipfs_data).to.equal(newEntryData.ipfsHash);
  });

  it("Should'nt be able to update entry by non-maintainer", async function () {
    const { DeployedRecordsContract, addr2, recordId } =
      await add0thEntryTo0thRecordFixture();
    await expect(
      DeployedRecordsContract.connect(addr2).updateEntry(
        recordId,
        0,
        addr2.address,
        "SOME_NEW_IPFS_HASH"
      )
    ).to.be.revertedWith(
      "Only the maintainer can update the entries of a record."
    );
  });

  it("Should'nt be able to update entry if recipient acknowledge it", async function () {
    const { DeployedRecordsContract, addr1, addr2, recordId } =
      await add0thEntryTo0thRecordFixture();
    await (
      await DeployedRecordsContract.connect(addr1).acknowledgeEntry(recordId, 0)
    ).wait();
    const newEntryData = {
      recipient: addr2.address,
      ipfsHash: "SOME_OTHER_IPFS_HASH",
    };
    await expect(
      DeployedRecordsContract.updateEntry(
        recordId,
        0,
        newEntryData.recipient,
        newEntryData.ipfsHash
      )
    ).to.be.revertedWith("Entry already acknowledged.");
  });

  it("Should be able to add multiple entries to a record", async function () {
    const { DeployedRecordsContract, recordId, addr1, addr2, addr3 } =
      await add0thRecordFixture();
    await (
      await DeployedRecordsContract.addMultipleEntries(
        recordId,
        [addr1.address, addr2.address, addr3.address],
        ["SOME_IPFS_HASH", "SOME_OTHER_IPFS_HASH", "SOME_THIRD_IPFS_HASH"]
      )
    ).wait();
    const recordReadTx = await DeployedRecordsContract.getEntryCount(recordId);
    expect(recordReadTx).to.equal(3);
  });
});
