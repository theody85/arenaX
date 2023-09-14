// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./ArenaX.sol";

contract AXMarketPlaceTestable is AXMarketPlace {
    constructor() ERC1155("AXMarketPlaceTestable") {
        // Constructor logic if needed
    }
}
