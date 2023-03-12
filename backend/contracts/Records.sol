// SPDX-License-Identifier: MIT

pragma solidity >=0.7.3;
import "hardhat/console.sol";

contract Records {
    struct Record {
        uint id;
        string name;
        string description;
        address maintainer;
        string ipfs_structure;
    }

    struct Entry {
        uint record_id;
        uint entry_id;
        address recipient;
        bool acknowledged;
        string ipfs_data;
    }

    mapping(uint => Record) _records;
    mapping(uint => Entry[]) _entries;
    mapping(address => uint[]) _maintainer_records;

    event RecordAdded(
        uint id,
        string name,
        string description,
        address maintainer
    );

    event EntryAdded(
        uint record_id,
        uint entry_id,
        address recipient,
        bool acknowledged,
        string ipfs_data
    );

    /*
     * @dev Create a new record.
     * @param _name The name of the record.
     * @param _description The description of the record.
     */
    function addRecord(
        string memory _name,
        string memory _description,
        string memory _ipfs_structure
    ) public {
        uint id = uint(
            keccak256(abi.encodePacked(block.timestamp, msg.sender)) >> 192
        ); // 20 digit id
        _records[id] = Record({
            id: id,
            name: _name,
            description: _description,
            maintainer: msg.sender,
            ipfs_structure: _ipfs_structure
        });
        _maintainer_records[msg.sender].push(id);
        emit RecordAdded(id, _name, _description, msg.sender);
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
                record_id: _recordId,
                entry_id: _entries[_recordId].length,
                recipient: _recipient,
                acknowledged: false,
                ipfs_data: _ipfs_data
            })
        );
        emit EntryAdded(
            _recordId,
            _entries[_recordId].length - 1,
            _recipient,
            false,
            _ipfs_data
        );
    }

    function addMultipleEntries(
        uint _recordId,
        address[] memory _recipients,
        string[] memory _ipfs_data
    ) public {
        require(
            _records[_recordId].maintainer == msg.sender,
            "Only the maintainer can add entries to a record."
        );
        require(
            _recipients.length == _ipfs_data.length,
            "The number of recipients and the number of ipfs data must be the same."
        );
        for (uint i = 0; i < _recipients.length; i++) {
            _entries[_recordId].push(
                Entry({
                    record_id: _recordId,
                    entry_id: _entries[_recordId].length,
                    recipient: _recipients[i],
                    acknowledged: false,
                    ipfs_data: _ipfs_data[i]
                })
            );
            emit EntryAdded(
                _recordId,
                _entries[_recordId].length - 1,
                _recipients[i],
                false,
                _ipfs_data[i]
            );
        }
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
     * @dev Unacknowledge an entry.
     * @param _recordId The id of the record.
     * @param _entryId The id of the entry.
     */
    function unAcknowledgeEntry(uint _recordId, uint _entryId) public {
        require(
            _entries[_recordId][_entryId].recipient == msg.sender,
            "Only the recipient can unacknowledge an entry."
        );
        _entries[_recordId][_entryId].acknowledged = false;
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
     * @dev Get list of records a maintainer has.
     * @param _maintainer The address of the maintainer.
     * @return The list of records the maintainer has.
     */

    function getRecordsByMaintainer(
        address _maintainer
    ) public view returns (Record[] memory) {
        Record[] memory records = new Record[](
            _maintainer_records[_maintainer].length
        );
        for (uint i = 0; i < _maintainer_records[_maintainer].length; i++) {
            records[i] = Record({
                id: _maintainer_records[_maintainer][i],
                name: _records[_maintainer_records[_maintainer][i]].name,
                description: _records[_maintainer_records[_maintainer][i]]
                    .description,
                maintainer: _records[_maintainer_records[_maintainer][i]]
                    .maintainer,
                ipfs_structure: _records[_maintainer_records[_maintainer][i]]
                    .ipfs_structure
            });
        }
        return records;
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
     * @dev Get entries.
     * @param _recordId The id of the record.
     * @return The list of entries.
     */
    function getEntries(uint _recordId) public view returns (Entry[] memory) {
        return _entries[_recordId];
    }

    /*
     * @dev Get an entry.
     * @param _recordId The id of the record.
     * @param _entryId The id of the entry.
     * @return The entry.
     */
    function getEntry(
        uint _recordId,
        uint _entryId
    ) public view returns (Entry memory) {
        return _entries[_recordId][_entryId];
    }

    /*
     * @dev Update name of a record.
     * @param _recordId The id of the record.
     * @param _name The new name of the record.
     * @param _description The new description of the record.
     */
    function updateRecordDetails(
        uint _recordId,
        string memory _name,
        string memory _description,
        string memory _ipfs_structure
    ) public {
        require(
            _records[_recordId].maintainer == msg.sender,
            "Only the maintainer can update the details of a record."
        );
        _records[_recordId].name = _name;
        _records[_recordId].description = _description;
        _records[_recordId].ipfs_structure = _ipfs_structure;
    }

    /*
     * @dev Update the maintainer of a record.
     * @param _recordId The id of the record.
     * @param _maintainer The new maintainer of the record.
     */
    function updateRecordMaintainer(
        uint _recordId,
        address _maintainer
    ) public {
        require(
            _records[_recordId].maintainer == msg.sender,
            "Only the maintainer can update the maintainer of a record."
        );
        _records[_recordId].maintainer = _maintainer;
    }

    /*
     * @dev Update entry of a record.
     * @param _recordId The id of the record.
     * @param _entryId The id of the entry.
     * @param _recipient The new recipient of the entry.
     * @param _ipfs_data The new IPFS hash of the data.
     */
    function updateEntry(
        uint _recordId,
        uint _entryId,
        address _recipient,
        string memory _ipfs_data
    ) public {
        require(
            _records[_recordId].maintainer == msg.sender,
            "Only the maintainer can update the entries of a record."
        );
        require(
            !_entries[_recordId][_entryId].acknowledged,
            "Entry already acknowledged."
        );
        _entries[_recordId][_entryId].recipient = _recipient;
        _entries[_recordId][_entryId].ipfs_data = _ipfs_data;
    }

    /*
     * @dev Delete a record.
     * @param _recordId The id of the record.
     */
    function deleteRecord(uint _recordId) public {
        require(
            _records[_recordId].maintainer == msg.sender,
            "Only the maintainer can delete a record."
        );
        delete _records[_recordId];
        delete _entries[_recordId];
        for (uint i = 0; i < _maintainer_records[msg.sender].length; i++) {
            if (_maintainer_records[msg.sender][i] == _recordId) {
                _maintainer_records[msg.sender][i] = _maintainer_records[
                    msg.sender
                ][_maintainer_records[msg.sender].length - 1];
                _maintainer_records[msg.sender].pop();
                break;
            }
        }
    }

    /*
     * @dev Delete an entry.
     * @param _recordId The id of the record.
     * @param _entryId The id of the entry.
     */
    function deleteEntry(uint _recordId, uint _entryId) public {
        require(
            _records[_recordId].maintainer == msg.sender,
            "Only the maintainer can delete entries from a record."
        );
        delete _entries[_recordId][_entryId];
    }
}
