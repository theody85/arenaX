/* eslint-disable @typescript-eslint/ban-ts-comment */
import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract, Signer } from "ethers";
import { Provider } from "@ethersproject/providers";

describe("AXMarketPlace", function () {
  let AXMarketPlace;

  let axMarketPlace: Contract;
  let owner: string | Signer | Provider;
  let user: string | Signer | Provider;
  // let user2:{ address: any };

  before(async function () {
    [owner, user] = await ethers.getSigners();

    AXMarketPlace = await ethers.getContractFactory("AXMarketPlaceTestable");
    axMarketPlace = await AXMarketPlace.deploy();
    await axMarketPlace.deployed();
  });

  describe("mintAsset", function () {
    it("should not be able to mint if user doesn't approve", async function () {
      const testObject = {
        title: "Shared Asset",
        description: "A shared asset for testing",
        category: "Test",
        totalSupply: 100,
        decimals: 18,
        pricePerToken: ethers.utils.parseEther("1"), // 1 ETH
        isShared: true,
        isApproved: false,
      };

      await expect(
        axMarketPlace.mintAsset(
          testObject.title,
          testObject.description,
          testObject.category,
          1,
          testObject.decimals,
          testObject.pricePerToken,
          testObject.isShared,
          testObject.isApproved,
        ),
      ).to.be.revertedWith("You need to grant  operation rights");
    });

    describe("Shared Asset", function () {
      const testObject = {
        title: "Shared Asset",
        description: "A shared asset for testing",
        category: "Test",
        totalSupply: 100,
        decimals: 18,
        pricePerToken: ethers.utils.parseEther("1"), // 1 ETH
        isShared: true,
        isApproved: true,
      };

      it("should mint a shared asset", async function () {
        await expect(
          axMarketPlace.mintAsset(
            testObject.title,
            testObject.description,
            testObject.category,
            testObject.totalSupply,
            testObject.decimals,
            testObject.pricePerToken,
            testObject.isShared,
            testObject.isApproved,
          ),
        )
          .to.emit(axMarketPlace, "AssetMinted")
          .withArgs(1, testObject.totalSupply, owner.address);

        const asset = await axMarketPlace.getAllAssets();

        expect(asset.length).to.equal(1);
        expect(asset[0].id).to.equal(1);
        expect(asset[0].title).to.equal(testObject.title);
        expect(asset[0].description).to.equal(testObject.description);
        expect(asset[0].category).to.equal(testObject.category);
        expect(asset[0].totalSupply).to.equal(testObject.totalSupply);
        expect(asset[0].decimals).to.equal(testObject.decimals);
        expect(asset[0].pricePerToken).to.equal(testObject.pricePerToken);
        expect(asset[0].isShared).to.equal(testObject.isShared);
      });

      it("should not mint a shared asset if total supply is not more than 1", async function () {
        await expect(
          axMarketPlace.mintAsset(
            testObject.title,
            testObject.description,
            testObject.category,
            1,
            testObject.decimals,
            testObject.pricePerToken,
            testObject.isShared,
            testObject.isApproved,
          ),
        ).to.be.revertedWith("Quantity must be greater than 1");
      });
    });

    describe("Non-shared Asset", function () {
      const testObject = {
        title: "Non-shared Asset",
        description: "A non-shared asset for testing",
        category: "Test",
        totalSupply: 1,
        decimals: 18,
        pricePerToken: ethers.utils.parseEther("1"), // 1 ETH
        isShared: false,
        isApproved: true,
      };

      it("should mint a non-shared asset", async function () {
        await expect(
          axMarketPlace.mintAsset(
            testObject.title,
            testObject.description,
            testObject.category,
            testObject.totalSupply,
            testObject.decimals,
            testObject.pricePerToken,
            testObject.isShared,
            testObject.isApproved,
          ),
        )
          .to.emit(axMarketPlace, "AssetMinted")
          .withArgs(2, 1, owner.address);

        const asset = await axMarketPlace.getAsset(2);

        expect(asset.title).to.equal(testObject.title);
        expect(asset.description).to.equal(testObject.description);
        expect(asset.category).to.equal(testObject.category);
        expect(asset.totalSupply).to.equal(testObject.totalSupply);
        expect(asset.decimals).to.equal(testObject.decimals);
        expect(asset.pricePerToken).to.equal(testObject.pricePerToken);
        expect(asset.shared).to.equal(testObject.isShared);
      });
    });
  });

  describe("Buy Assets", function () {
    it("should buy a shared asset", async function () {
      const assetId = 1;
      const quantity = 5;
      const assetPrice = ethers.utils.parseEther("1"); // Price per token
      const totalCost = assetPrice.mul(quantity);

      // Mint a shared asset with sufficient supply and set the price
      await axMarketPlace.connect(owner).mintAsset(
        "Shared Asset",
        "A shared asset for testing",
        "Test",
        10, // Total supply
        18, // Decimals
        assetPrice,
        true, // isShared
        true, // isApproved
      );

      // Buy the shared asset
      await expect(
        axMarketPlace.connect(user)._buySharedAsset(assetId, quantity, {
          value: totalCost,
        }),
      )
        .to.emit(axMarketPlace, "AssetTransfered")
        //@ts-ignore
        .withArgs(assetId, quantity, owner.address, user.address);

      // Check the updated asset supply
      const assetSupply = await axMarketPlace.assetSupply(assetId);
      expect(assetSupply).to.equal(5);

      // Check the ownership
      const ownerOfAsset = await axMarketPlace.ownerOf(assetId);
      //@ts-ignore
      expect(ownerOfAsset).to.equal(user.address);
    });

    it("should buy a non-shared asset", async function () {
      const assetId = 1;
      const assetPrice = ethers.utils.parseEther("1"); // Price per token
      const totalCost = assetPrice;

      // Mint a non-shared asset and set the price
      await axMarketPlace.connect(owner).mintAsset(
        "Non-Shared Asset",
        "A non-shared asset for testing",
        "Test",
        1, // Total supply
        18, // Decimals
        assetPrice,
        false, // isShared
        true, // isApproved
      );

      // Buy the non-shared asset
      await expect(
        axMarketPlace.connect(user)._buyNonSharedAsset(assetId, {
          value: totalCost,
        }),
      )
        .to.emit(axMarketPlace, "AssetTransfered")
        //@ts-ignore
        .withArgs(assetId, 1, owner.address, user.address);

      // Check the updated asset supply
      const assetSupply = await axMarketPlace.assetSupply(assetId);
      expect(assetSupply).to.equal(0);

      // Check the ownership
      const ownerOfAsset = await axMarketPlace.ownerOf(assetId);
      //@ts-ignore
      expect(ownerOfAsset).to.equal(user.address);
    });
  });
});
