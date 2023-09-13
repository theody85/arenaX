// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

abstract contract AssetTokenization is ERC721 {
	// A struct to represent each tokenized asset
	struct Asset {
		string title;
		string description;
		uint256 totalShares;
		uint256 decimals;
		uint256 pricePerToken;
		bool isShared;
	}

	struct Owner {
		address ownerAddress;
		uint256 shareCount;
	}

	Asset[] assets;
	uint256 assetCount;

	//Mapping to track shared owner of each asset
	mapping(uint256 => Owner[]) sharedOwners;
	Owner[] assetOwners;

	// Function to mint new asset tokens
	function mintAsset(
		string memory _title,
		string memory _description,
		uint256 _totalShares,
		uint256 _decimals,
		uint256 _pricePerToken,
		bool _isShared
	) external {
		if (!_isShared) {
			require(
				_totalShares == 1,
				"Total supply of indivisible assets must be 1"
			);
		}

		uint256 tokenId = assetCount++;

		assets.push(
			Asset({
				title: _title,
				description: _description,
				totalShares: _totalShares,
				decimals: _decimals,
				pricePerToken: _pricePerToken,
				isShared: _isShared
			})
		);

		_isShared
			? _mintSharedAsset(msg.sender, tokenId, _totalShares)
			: _safeMint(msg.sender, tokenId);

		//check for event Transfer(address(0), to, tokenId);
	}

	function _mintSharedAsset(
		address to,
		uint256 tokenId,
		uint _shareCount
	) internal virtual {
		require(to != address(0), "ERC721: mint to the zero address");
		require(!_exists(tokenId), "ERC721: token already minted");

		_beforeTokenTransfer(address(0), to, tokenId, 1);

		// Check that tokenId was not minted by `_beforeTokenTransfer` hook
		require(!_exists(tokenId), "ERC721: token already minted");

		assetOwners.push(
			Owner({ ownerAddress: msg.sender, shareCount: _shareCount })
		);

		sharedOwners[tokenId] = assetOwners;

		emit Transfer(address(0), to, tokenId);
		_afterTokenTransfer(address(0), to, tokenId, 1);
	}

	// Function to buy tokens representing fractional ownership
	function buyAsset(uint256 _tokenId, uint256 _amount) external payable {
		require(_amount > 0, "Amount must be greater than 0");
		require(_tokenId <= assetCount, "Invalid token ID");
		require(assets[_tokenId - 1].pricePerToken * _amount <= msg.value);

		assets[_tokenId - 1].isShared
			? _buySharedAsset(_tokenId, _amount)
			: _buyAsset(_tokenId);
	}

	function _buySharedAsset(uint256 _tokenId, uint256 _amount) internal {
		require(
			sharedOwners[_tokenId][0].shareCount >= _amount,
			"Not enough shares to be sold"
		);

		// Transfer tokens to the buyer
		_transferTokens(msg.sender, _tokenId, _amount);

		// Transfer funds to the owner of the asset
		_transferFunds(
			payable(sharedOwners[_tokenId][0].ownerAddress),
			msg.value
		);
	}

	function _buyAsset(uint _tokenId) internal {
		_transfer(ownerOf(_tokenId), msg.sender, _tokenId);

		// Transfer funds to the owner of the asset
		_transferFunds(payable(ownerOf(_tokenId)), msg.value);
	}

	function _transferTokens(
		address _to,
		uint256 _tokenId,
		uint256 _amount
	) internal {
		require(_amount > 0, "Amount must be greater than 0");
		require(_to != address(0), "Invalid recipient address");

		sharedOwners[_tokenId][0].shareCount -= _amount;

		sharedOwners[_tokenId].push(
			Owner({ ownerAddress: _to, shareCount: _amount })
		);
	}

	function _transferFunds(address payable _to, uint _amount) internal {
		(bool sent, ) = _to.call{ value: _amount }("");
		require(sent, "Failed to send Ether");
	}

	//Function to get all assets
	function getAssets() public view returns (Asset[] memory) {
		return assets;
	}

	modifier exists(uint256 _tokenId) {
		require(_tokenId <= assetCount, "Invalid token ID");
		require(assets[_tokenId - 1].totalShares != 0, "Invalid token ID");
		_;
	}

	//Function to get shared owners of a particular asset
	function getSharedOwners(
		uint256 _tokenId
	) public view exists(_tokenId) returns (Owner[] memory) {
		require(sharedOwners[_tokenId].length > 0, "Invalid asset ID");

		return sharedOwners[_tokenId];
	}

	// Function to retrieve asset details
	function getAsset(
		uint256 _tokenId
	)
		external
		view
		exists(_tokenId)
		returns (
			string memory title,
			string memory description,
			uint256 totalShares,
			uint256 decimals,
			uint256 pricePerToken
		)
	{
		Asset memory asset = assets[_tokenId - 1];
		return (
			asset.title,
			asset.description,
			asset.totalShares,
			asset.decimals,
			asset.pricePerToken
		);
	}

	modifier onlyOwner(uint256 _tokenId) {
		Asset memory asset = assets[_tokenId - 1];

		if (asset.isShared) {
			require(
				sharedOwners[_tokenId].length == 1,
				"Requires more than one owner to grant access"
			);
			require(
				msg.sender == sharedOwners[_tokenId][0].ownerAddress,
				"Unauthorised access"
			);
		} else {
			require(msg.sender == ownerOf(_tokenId), "Unauthorised access");
		}

		_;
	}

	// Function to update asset details
	function updateAssetDetails(
		uint256 _tokenId,
		string memory _title,
		string memory _description,
		uint256 _pricePerToken
	) external exists(_tokenId) onlyOwner(_tokenId) {
		require(_tokenId <= assetCount, "Invalid token ID");

		assets[_tokenId - 1].title = _title;
		assets[_tokenId - 1].description = _description;
		assets[_tokenId - 1].pricePerToken = _pricePerToken;
	}
}
