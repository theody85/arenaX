// // SPDX-License-Identifier: MIT
// pragma solidity ^0.8.0;

// import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
// import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

// abstract contract AXMarketPlace is ERC721 {
// 	// A struct to represent each tokenized asset
// 	struct Asset {
// 		string title;
// 		string description;
// 		uint256 totalSupply;
// 		uint256 decimals;
// 		uint256 pricePerToken;
// 		bool isShared;
// 	}

// 	Asset[] public assets;
// 	uint256 public assetCount;

// 	IERC20 public sharesToken; // Reference to the ERC-20 token contract

// 	constructor(address _sharesTokenAddress) ERC721("AssetTokenization", "AT") {
// 		sharesToken = IERC20(_sharesTokenAddress);
// 	}

// 	// Function to mint new asset tokens
// 	function mintAsset(
// 		string memory _title,
// 		string memory _description,
// 		uint256 _totalSupply,
// 		uint256 _decimals,
// 		uint256 _pricePerToken,
// 		bool _isShared
// 	) external {
// 		if (!_isShared) {
// 			require(
// 				_totalSupply == 1,
// 				"Total supply of indivisible assets must be 1"
// 			);
// 		}

// 		uint256 assetId = assets.length + 1;

// 		assets.push(
// 			Asset({
// 				title: _title,
// 				description: _description,
// 				totalSupply: _totalSupply,
// 				decimals: _decimals,
// 				pricePerToken: _pricePerToken,
// 				isShared: _isShared
// 			})
// 		);

// 		_isShared
// 			? _mintERC20Asset(msg.sender, _totalSupply)
// 			: _mintERC721Asset(msg.sender, assetId);
// 	}

// 	function _mintERC20Asset(address _to, uint _totalShares) internal virtual {
// 		sharesToken.mintShares(_to, _totalShares);

// 		//check for Transfer(address(0), account, amount);
// 	}

// 	function _mintERC721Asset(address _to, uint _tokenId) internal virtual {
// 		_safeMint(msg.sender, _tokenId);

// 		// check for Transfer(address(0), to, tokenId);
// 	}

// 	// function buyAsset(uint256 _tokenId, uint256 _amount) external payable {
// 	// 	require(_amount > 0, "Amount must be greater than 0");
// 	// 	require(_tokenId <= assetCount, "Invalid token ID");
// 	// 	require(assets[_tokenId - 1].pricePerToken * _amount <= msg.value);

// 	// 	assets[_tokenId - 1].isShared
// 	// 		? _buySharedAsset(_tokenId, _amount)
// 	// 		: _buyAsset(_tokenId);
// 	// }
// }
