// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

library Transfer {
    function transfer(address _to, uint _value) internal {
        (bool success, ) = _to.call{value: _value}("");
        require(success, "Failed to send Matic");
    }
}
