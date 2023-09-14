// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import {Transfer} from "./lib/Transfer.sol";

contract TestHelper {
    using Transfer for address;

    function transfer(address _to, uint _value) public {
        _to.transfer(_value);
    }
}
