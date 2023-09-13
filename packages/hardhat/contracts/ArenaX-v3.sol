// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

abstract contract AXMarketPlace is ERC1155 {
	// A struct to represent each tokenized asset
	struct Asset {
		uint256 id;
		string title;
		string description;
		uint256 totalSupply;
		uint256 decimals;
		uint256 pricePerToken;
		bool isShared;
	}

	Asset[] public assets;

	// Mapping from asset ID to its supply
	mapping(uint256 => uint256) public assetSupply;

	// Function to mint new asset tokens
	function mintAsset(
		string memory _title,
		string memory _description,
		uint256 _totalSupply,
		uint256 _decimals,
		uint256 _pricePerToken,
		bool _isShared
	) external {
		if (!_isShared) {
			require(
				_totalSupply == 1,
				"Total supply of indivisible assets must be 1"
			);
		}

		uint256 assetId = assets.length + 1;

		assets.push(
			Asset({
				id: assetId,
				title: _title,
				description: _description,
				totalSupply: _totalSupply,
				decimals: _decimals,
				pricePerToken: _pricePerToken,
				isShared: _isShared
			})
		);

		assetSupply[assetId] = _totalSupply;
	}

	function buyAsset(uint256 _tokenId, uint256 _tokenNum) external payable {
		require(_tokenNum > 0, "Number of token must be greater than 0");
		require(_tokenId <= assets.length, "Invalid token ID");
		require(assets[_tokenId - 1].pricePerToken * _tokenNum <= msg.value);

		assets[_tokenId - 1].isShared
			? _buySharedAsset(_tokenId, _tokenNum)
			: _buyAsset(_tokenId);
	}

	function _buySharedAsset(uint256 _tokenId, uint256 _tokenNum) internal {}
}
