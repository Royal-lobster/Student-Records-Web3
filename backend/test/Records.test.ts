import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Records Contract", function () {
  const firstRecordData = {
    name: "Workshop Grades for Central Metrics Examination",
    description:
      "Grades for Central Metrics Examination for all the students who took the exam",
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
      await add0thRecordFixture();
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

  it("Should'nt be able to allow non-maintainers to add entry", async function () {
    const { DeployedRecordsContract, addr2 } = await loadFixture(
      add0thEntryTo0thRecordFixture
    );
    await expect(
      DeployedRecordsContract.connect(addr2).addEntry(
        0,
        addr2.address,
        "SOME_FISHY_IPFS_HASH"
      )
    ).to.be.revertedWith("Only the maintainer can add entries to a record.");
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

  it("Should'nt be able to allow non-recipient to acknowledge the entry", async function () {
    const { DeployedRecordsContract, addr2 } = await loadFixture(
      add0thEntryTo0thRecordFixture
    );
    await expect(
      DeployedRecordsContract.connect(addr2).acknowledgeEntry(0, 0)
    ).to.be.revertedWith("Only the recipient can acknowledge an entry.");
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
    const { DeployedRecordsContract } = await loadFixture(
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
    for (const recordData of additionalRecordData) {
      await (
        await DeployedRecordsContract.addRecord(
          recordData.name,
          recordData.description
        )
      ).wait();
    }
    const recordCount = await DeployedRecordsContract._recordsLength();
    expect(recordCount).to.equal(additionalRecordData.length + 1);
  });

  it("Should show all records by maintainer address", async function () {
    const { DeployedRecordsContract, owner } = await loadFixture(
      deployTokenFixture
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
    for (const recordData of additionalRecordData) {
      await (
        await DeployedRecordsContract.addRecord(
          recordData.name,
          recordData.description
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
    const { DeployedRecordsContract } = await loadFixture(
      add0thEntryTo0thRecordFixture
    );
    await (await DeployedRecordsContract.deleteEntry(0, 0)).wait();
    const entry = await DeployedRecordsContract.getEntry(0, 0);
    expect(entry.recipient).to.equal(ethers.constants.AddressZero);
  });

  it("Should'nt be able to allow non-maintainers to delete entry", async function () {
    const { DeployedRecordsContract, addr2 } = await loadFixture(
      add0thEntryTo0thRecordFixture
    );
    await expect(
      DeployedRecordsContract.connect(addr2).deleteEntry(0, 0)
    ).to.be.revertedWith(
      "Only the maintainer can delete entries from a record."
    );
  });

  it("Should be able to delete record and reduce _recordsLength", async function () {
    const { DeployedRecordsContract } = await loadFixture(add0thRecordFixture);
    await (await DeployedRecordsContract.deleteRecord(0)).wait();
    const recordCount = await DeployedRecordsContract._recordsLength();
    const recordReadTx = await DeployedRecordsContract.getRecord(0);
    expect(recordCount).to.equal(0);
    expect(recordReadTx.name).to.equal("");
  });

  it("Should'nt be able to allow non-maintainers to delete record", async function () {
    const { DeployedRecordsContract, addr2 } = await loadFixture(
      add0thRecordFixture
    );
    await expect(
      DeployedRecordsContract.connect(addr2).deleteRecord(0)
    ).to.be.revertedWith("Only the maintainer can delete a record.");
  });

  it("Should be able to update record details", async function () {
    const { DeployedRecordsContract } = await loadFixture(add0thRecordFixture);
    const newRecordData = {
      name: "Workshop Grades for Local Metrics Examination",
      description:
        "Grades for Local Metrics Examination for all the students who took the exam",
    };
    await (
      await DeployedRecordsContract.updateRecordDetails(
        0,
        newRecordData.name,
        newRecordData.description
      )
    ).wait();
    const recordReadTx = await DeployedRecordsContract.getRecord(0);
    expect(recordReadTx.name).to.equal(newRecordData.name);
    expect(recordReadTx.description).to.equal(newRecordData.description);
  });

  it("Should'nt be able to update record details by non-maintainer", async function () {
    const { DeployedRecordsContract, addr2 } = await loadFixture(
      add0thRecordFixture
    );
    await expect(
      DeployedRecordsContract.connect(addr2).updateRecordDetails(
        0,
        "SOME_NEW_NAME",
        "SOME_NEW_DESCRIPTION"
      )
    ).to.be.revertedWith(
      "Only the maintainer can update the details of a record."
    );
  });

  it("Should be able to update record maintainer", async function () {
    const { DeployedRecordsContract, addr3 } = await loadFixture(
      add0thRecordFixture
    );
    await (
      await DeployedRecordsContract.updateRecordMaintainer(0, addr3.address)
    ).wait();
    const recordReadTx = await DeployedRecordsContract.getRecord(0);
    expect(recordReadTx.maintainer).to.equal(addr3.address);
  });

  it("Should'nt be able to update record maintainer by non-maintainer", async function () {
    const { DeployedRecordsContract, addr2, addr3 } = await loadFixture(
      add0thRecordFixture
    );
    await expect(
      DeployedRecordsContract.connect(addr2).updateRecordMaintainer(
        0,
        addr3.address
      )
    ).to.be.revertedWith(
      "Only the maintainer can update the maintainer of a record."
    );
  });

  it("Should be able to update entry", async function () {
    const { DeployedRecordsContract, addr2 } =
      await add0thEntryTo0thRecordFixture();
    const newEntryData = {
      recipient: addr2.address,
      ipfsHash: "SOME_OTHER_IPFS_HASH",
    };
    await (
      await DeployedRecordsContract.updateEntry(
        0,
        0,
        newEntryData.recipient,
        newEntryData.ipfsHash
      )
    ).wait();
    const entryReadTx = await DeployedRecordsContract.getEntry(0, 0);
    expect(entryReadTx.recipient).to.equal(newEntryData.recipient);
    expect(entryReadTx.ipfs_data).to.equal(newEntryData.ipfsHash);
  });

  it("Should'nt be able to update entry by non-maintainer", async function () {
    const { DeployedRecordsContract, addr2 } =
      await add0thEntryTo0thRecordFixture();
    await expect(
      DeployedRecordsContract.connect(addr2).updateEntry(
        0,
        0,
        addr2.address,
        "SOME_NEW_IPFS_HASH"
      )
    ).to.be.revertedWith(
      "Only the maintainer can update the entries of a record."
    );
  });

  it("Should'nt be able to update entry if recipient acknowledge it", async function () {
    const { DeployedRecordsContract, addr1, addr2 } =
      await add0thEntryTo0thRecordFixture();
    await (
      await DeployedRecordsContract.connect(addr1).acknowledgeEntry(0, 0)
    ).wait();
    const newEntryData = {
      recipient: addr2.address,
      ipfsHash: "SOME_OTHER_IPFS_HASH",
    };
    await expect(
      DeployedRecordsContract.updateEntry(
        0,
        0,
        newEntryData.recipient,
        newEntryData.ipfsHash
      )
    ).to.be.revertedWith("Entry already acknowledged.");
  });
});
