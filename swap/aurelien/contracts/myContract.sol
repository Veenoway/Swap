// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract CTR {

    uint256 public number = 5432;

    function increment(uint256 _nbr) external {
        number += _nbr;
    }

}