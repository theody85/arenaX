// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "./lib/Transfer.sol";

abstract contract AXMarketPlace is ERC1155 {
    // A struct to represent each tokenized asset
    struct Asset {
        uint256 id;
        string title;
        string description;
        string category;
        uint256 totalSupply;
        uint256 decimals;
        uint256 pricePerToken;
        bool isShared;
    }

    Asset[] public assets;

    mapping(uint256 => address) public creators;
    mapping(uint256 => uint256) public assetSupply;
    mapping(uint256 => address[]) owners;

    event AssetMinted(
        uint256 indexed _assetId,
        uint256 _quantity,
        address _owner
    );

    event AssetTransfered(
        uint256 _assetId,
        uint256 _quantity,
        address _owner,
        address _newowner
    );

    // Function to mint new asset tokens
    function mintAsset(
        string memory _title,
        string memory _description,
        string memory _category,
        uint256 _totalSupply,
        uint256 _decimals,
        uint256 _pricePerToken,
        bool _isShared,
        bool _isApproved
    ) external {
        require(_isApproved, "You need to grant  operation rights");

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
                category: _category,
                totalSupply: _totalSupply,
                decimals: _decimals,
                pricePerToken: _pricePerToken,
                isShared: _isShared
            })
        );

        _isShared
            ? _mintSharedAsset(msg.sender, assetId, _totalSupply)
            : _mintNonSharedAsset(msg.sender, assetId);

        assetSupply[assetId] = _totalSupply;

        setApprovalForAll(address(this), _isApproved);
    }

    modifier validID(uint _id) {
        require(_id > 0 && _id <= assets.length, "Invalid asset ID");
        _;
    }

    modifier isShared(uint256 _quantity) {
        require(_quantity > 1, "Quantity must be greater than 1");
        _;
    }

    function _mintSharedAsset(
        address _to,
        uint256 _assetId,
        uint256 _quantity
    ) internal isShared(_quantity) {
        uint256[] memory ids = new uint256[](1);
        uint256[] memory amounts = new uint256[](1);
        ids[0] = _assetId;
        amounts[0] = _quantity;

        _mintBatch(_to, ids, amounts, "");

        creators[_assetId] = _to;
        emit AssetMinted(_assetId, _quantity, _to);
    }

    function _mintNonSharedAsset(address _to, uint256 _assetId) internal {
        _mint(_to, _assetId, 1, "");

        creators[_assetId] = _to;
        emit AssetMinted(_assetId, 1, _to);
    }

    //Function to buy assets
    function buyAsset(
        uint256 _assetId,
        uint256 _quantity
    ) external payable validID(_assetId) {
        require(_quantity > 0, "Number of token must be greater than 0");
        require(
            assetSupply[_assetId] >= _quantity,
            "Not enough tokens left to sell"
        );

        require(
            assets[_assetId - 1].pricePerToken * _quantity <= msg.value,
            "Insufficient funds to complete purchase"
        );

        assets[_assetId - 1].isShared
            ? _buySharedAsset(_assetId, _quantity)
            : _buyNonSharedAsset(_assetId);
    }

    function _buySharedAsset(uint256 _assetId, uint256 _quantity) internal {
        // Transfer the ERC-1155 tokens to the buyer
        uint256[] memory ids = new uint256[](1);
        uint256[] memory amounts = new uint256[](1);
        ids[0] = _assetId;
        amounts[0] = _quantity;

        _safeBatchTransferFrom(
            creators[_assetId],
            msg.sender,
            ids,
            amounts,
            ""
        );
        _transferFunds(payable(creators[_assetId]), msg.value);

        // Update the asset supply
        assetSupply[_assetId] -= _quantity;
        owners[_assetId].push(msg.sender);

        emit AssetTransfered(
            _assetId,
            _quantity,
            creators[_assetId],
            msg.sender
        );
    }

    function _buyNonSharedAsset(uint256 _assetId) internal {
        // Transfer the tokens
        _safeTransferFrom(creators[_assetId], msg.sender, _assetId, 1, "");

        _transferFunds(payable(creators[_assetId]), msg.value);

        assetSupply[_assetId] -= 1;
        owners[_assetId].push(msg.sender);

        emit AssetTransfered(_assetId, 1, creators[_assetId], msg.sender);
    }

    function _transferFunds(address payable _to, uint _amount) internal {
        Transfer.transfer(_to, _amount);
    }

    //Function to retrieve assets supply
    function getAssetSupply(
        uint256 _id
    ) external view validID(_id) returns (uint256) {
        return assetSupply[_id];
    }

    //Function to retrieve all owners
    function getOwners(
        uint256 _id
    ) external view validID(_id) returns (address[] memory) {
        return owners[_id];
    }

    //Fucntion to retrieve all assets
    function getAllAssets() external view returns (Asset[] memory) {
        return assets;
    }

    // Function to retrieve asset details
    function getAsset(
        uint256 _id
    )
        external
        view
        validID(_id)
        returns (
            string memory title,
            string memory description,
            string memory category,
            uint256 totalSupply,
            uint256 decimals,
            uint256 pricePerToken,
            bool shared
        )
    {
        Asset memory asset = assets[_id - 1];
        return (
            asset.title,
            asset.description,
            asset.category,
            asset.totalSupply,
            asset.decimals,
            asset.pricePerToken,
            asset.isShared
        );
    }

    modifier onlyCreator(uint256 _assetId) {
        Asset memory asset = assets[_assetId - 1];

        require(owners[_assetId].length == 0, "Unauthorised access");
        require(msg.sender == creators[_assetId], "Unauthorised access");

        _;
    }

    // Function to update asset details
    function updateAssetDetails(
        uint256 _assetId,
        string memory _title,
        string memory _description,
        uint256 _pricePerToken
    ) external validID(_assetId) onlyCreator(_assetId) {
        assets[_assetId - 1].title = _title;
        assets[_assetId - 1].description = _description;
        assets[_assetId - 1].pricePerToken = _pricePerToken;
    }

    function burnAsset(
        uint256 _assetId
    ) external validID(_assetId) onlyCreator(_assetId) {
        // Burn the tokens
        _burn(creators[_assetId], _assetId, assetSupply[_assetId]);

        creators[_assetId] = address(0);
    }
}
