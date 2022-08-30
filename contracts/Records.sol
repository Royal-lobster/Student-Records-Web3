// SPDX-License-Identifier: MIT

pragma solidity >=0.7.3;

contract Records {
    struct Record {
        string name;
        string description;
        address maintainer;
    }

    struct Entry {
        address recipient;
        bool acknowledged;
        string ipfs_data;
    }

    mapping(uint => Record) _records;
    mapping(uint => Entry[]) _entries;

    uint public _recordsLength = 0;

    /*
     * @dev Create a new record.
     * @param _name The name of the record.
     * @param _description The description of the record.
     * @param _maintainer The address of the maintainer of the record.
     */
    function addRecord(string memory _name, string memory _description) public {
        _records[_recordsLength] = Record({
            name: _name,
            description: _description,
            maintainer: msg.sender
        });
        _recordsLength++;
    }

    /*
     * @dev Add a new entry to a record.
     * @param _recordId The id of the record.
     * @param _recipient The address of the recipient of the record.
     * @param _ipfs_data The IPFS hash of the data.
     */
    function addEntry(
        uint _recordId,
        address _recipient,
        string memory _ipfs_data
    ) public {
        require(
            _records[_recordId].maintainer == msg.sender,
            "Only the maintainer can add entries to a record."
        );
        _entries[_recordId].push(
            Entry({
                recipient: _recipient,
                acknowledged: false,
                ipfs_data: _ipfs_data
            })
        );
    }

    /*
     * @dev Acknowledge an entry.
     * @param _recordId The id of the record.
     * @param _entryId The id of the entry.
     */
    function acknowledgeEntry(uint _recordId, uint _entryId) public {
        require(
            _entries[_recordId][_entryId].recipient == msg.sender,
            "Only the recipient can acknowledge an entry."
        );
        _entries[_recordId][_entryId].acknowledged = true;
    }

    /*
     * @dev Get the number of entries in a record.
     * @param _recordId The id of the record.
     * @return The number of entries in the record.
     */
    function getEntryCount(uint _recordId) public view returns (uint) {
        return _entries[_recordId].length;
    }

    /*
     * @dev Get a record.
     * @param _recordId The id of the record.
     * @return The record.
     */
    function getRecord(uint _recordId) public view returns (Record memory) {
        return _records[_recordId];
    }

    /*
     * @dev Get an entry.
     * @param _recordId The id of the record.
     * @param _entryId The id of the entry.
     * @return The entry.
     */
    function getEntry(uint _recordId, uint _entryId)
        public
        view
        returns (Entry memory)
    {
        return _entries[_recordId][_entryId];
    }
}
