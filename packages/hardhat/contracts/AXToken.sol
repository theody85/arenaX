// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract AXToken is ERC20, Ownable {
	constructor(uint256 initialSupply) ERC20("AXToken", "AX") {
		_mint(msg.sender, initialSupply * (10 ** uint256(decimals())));
	}

	// Mint new tokens (shares) and assign them to an account
	function mintShares(address account, uint256 amount) external onlyOwner {
		_mint(account, amount);
	}
}
