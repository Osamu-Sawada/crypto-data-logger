pragma solidity ^0.4.23;

contract DataLogger {
    // Events
    event Log(address indexed _from, bytes32 _hash);

    function logging(string memory _data) public returns (bool) {
        bytes32 hash = keccak256(abi.encodePacked(_data));
        emit Log(msg.sender, hash);
        return true;
    }

}
