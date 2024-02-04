// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract CTR {

    uint256 public number = 5432;
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner {
        require(owner == msg.sender, "Not the owner.");
        _;
    }

    function changeOwnerShip(address _address) external onlyOwner {
        owner = _address;
    }

    function increment(uint256 _nbr) external {
        number += _nbr;
    }

}