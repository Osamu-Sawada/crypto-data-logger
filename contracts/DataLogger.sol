pragma solidity ^0.5.0;

contract DataLogger {
    // Events
    event Log(address indexed _from, bytes32 _hash, bytes _data);

    function logging(bytes memory _data) public returns (bool) {
        bytes32 hash = keccak256(_data);
        emit Log(msg.sender, hash, _data);
        return true;
    }

}
