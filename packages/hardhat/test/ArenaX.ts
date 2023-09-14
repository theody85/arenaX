/* eslint-disable @typescript-eslint/ban-ts-comment */
import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract, Signer } from "ethers";
import { Provider } from "@ethersproject/providers";

describe("AXMarketPlace", function () {
  let AXMarketPlace;

  let axMarketPlace: Contract;
  let owner: Signer | Provider;
  let user: Signer | Provider;
  let creator: Signer | Provider;

  beforeEach(async function () {
    [owner, user, creator] = await ethers.getSigners();

    AXMarketPlace = await ethers.getContractFactory("AXMarketPlaceTestable");
    axMarketPlace = await AXMarketPlace.deploy();
    // await axMarketPlace.deployed();
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
          //@ts-ignore
          .withArgs(1, testObject.totalSupply, owner?.address);

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
          //@ts-ignore
          .withArgs(1, 1, owner.address);

        const asset = await axMarketPlace.getAsset(1);

        expect(asset.title).to.equal(testObject.title);
        expect(asset.description).to.equal(testObject.description);
        expect(asset.category).to.equal(testObject.category);
        expect(asset.totalSupply).to.equal(testObject.totalSupply);
        expect(asset.decimals).to.equal(testObject.decimals);
        expect(asset.pricePerToken).to.equal(testObject.pricePerToken);
        expect(asset.shared).to.equal(testObject.isShared);
      });

      it("should not mint a non-shared asset if total supply is not 1", async function () {
        await expect(
          axMarketPlace.mintAsset(
            testObject.title,
            testObject.description,
            testObject.category,
            5,
            testObject.decimals,
            testObject.pricePerToken,
            testObject.isShared,
            testObject.isApproved,
          ),
        ).to.be.revertedWith("Total supply of indivisible assets must be 1");
      });
    });
  });

  describe("Buy Assets", function () {
    describe("Shared assets", function () {
      it("should buy a shared asset", async function () {
        const assetId = 1;
        const quantity = 5;
        const assetPrice = ethers.utils.parseEther("1"); // Price per token
        //@ts-ignore
        const totalCost: bigint = BigInt(assetPrice) * BigInt(quantity);

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
          axMarketPlace.connect(user).buyAsset(assetId, quantity, {
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
        const ownerOfAsset = await axMarketPlace.getOwners(assetId);
        //@ts-ignore
        expect(ownerOfAsset[0]).to.equal(user.address);
      });
    });

    describe("Non-shared Assets", function () {
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
          axMarketPlace.connect(user).buyAsset(assetId, 1, {
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
        const ownerOfAsset = await axMarketPlace.getOwners(assetId);
        //@ts-ignore
        expect(ownerOfAsset[0]).to.equal(user.address);
      });

      it("should not buy a asset if assetId is invalid", async function () {
        const assetId = 0;
        const assetPrice = ethers.utils.parseEther("1"); // Price per token
        const totalCost = assetPrice;

        // Mint a non-shared asset and set the price
        await axMarketPlace.connect(owner).mintAsset(
          "Non-Shared Asset",
          "A non-shared asset for testing",
          "Test",
          1,
          18,
          assetPrice,
          false,
          true, // isApproved
        );

        await expect(
          axMarketPlace.connect(user).buyAsset(assetId, 1, {
            value: totalCost,
          }),
        ).to.be.revertedWith("Invalid asset ID");
      });

      it("should not buy a asset if quantity <= 0", async function () {
        const assetId = 1;
        const assetPrice = ethers.utils.parseEther("1"); // Price per token
        const totalCost = assetPrice;

        // Mint a non-shared asset and set the price
        await axMarketPlace.connect(owner).mintAsset(
          "Non-Shared Asset",
          "A non-shared asset for testing",
          "Test",
          1,
          18,
          assetPrice,
          false,
          true, // isApproved
        );

        await expect(
          axMarketPlace.connect(user).buyAsset(assetId, 0, {
            value: totalCost,
          }),
        ).to.be.revertedWith("Number of token must be greater than 0");
      });

      it("should not buy a asset if quantity > assets supply", async function () {
        const assetId = 1;
        const assetPrice = ethers.utils.parseEther("1"); // Price per token
        const totalCost = assetPrice;

        // Mint a non-shared asset and set the price
        await axMarketPlace.connect(owner).mintAsset(
          "Non-Shared Asset",
          "A non-shared asset for testing",
          "Test",
          1,
          18,
          assetPrice,
          false,
          true, // isApproved
        );

        await expect(
          axMarketPlace.connect(user).buyAsset(assetId, 5, {
            value: totalCost,
          }),
        ).to.be.revertedWith("Not enough tokens left to sell");
      });

      it("should not buy  asset if funds is less than price of assets", async function () {
        const assetId = 1;
        const assetPrice = ethers.utils.parseEther("1"); // Price per token
        const totalCost = ethers.utils.parseEther("0.5");

        // Mint a non-shared asset and set the price
        await axMarketPlace.connect(owner).mintAsset(
          "Non-Shared Asset",
          "A non-shared asset for testing",
          "Test",
          1,
          18,
          assetPrice,
          false,
          true, // isApproved
        );

        await expect(
          axMarketPlace.connect(user).buyAsset(assetId, 1, {
            value: totalCost,
          }),
        ).to.be.revertedWith("Insufficient funds to complete purchase");
      });
    });
  });

  describe("Getters", function () {
    describe("getAssetsSupply", function () {
      it("should return the correct asset supply", async function () {
        const assetId = 1;
        const totalSupply = 10; // Set the total supply for the asset

        // Mint an asset with the specified total supply
        await axMarketPlace.connect(owner).mintAsset(
          "Test Asset",
          "A test asset for supply testing",
          "Test",
          totalSupply,
          18, // Decimals
          ethers.utils.parseEther("1"), // Price per token
          true, // isShared
          true, // isApproved
        );

        // Call getAssetSupply to retrieve the asset supply
        const assetSupply = await axMarketPlace.getAssetSupply(assetId);

        // Check that the returned supply matches the expected total supply
        expect(assetSupply).to.equal(totalSupply);
      });

      it("should revert if assetId provided is invalid", async function () {
        const assetId = 0;
        const totalSupply = 10; // Set the total supply for the asset

        // Mint an asset with the specified total supply
        await axMarketPlace.connect(owner).mintAsset(
          "Test Asset",
          "A test asset for supply testing",
          "Test",
          totalSupply,
          18, // Decimals
          ethers.utils.parseEther("1"), // Price per token
          true, // isShared
          true, // isApproved
        );

        // Check that the returned supply matches the expected total supply
        await expect(axMarketPlace.getAssetSupply(assetId)).to.be.revertedWith("Invalid asset ID");
      });
    });

    describe("getOwners", function () {
      it("should revert if assetId provided is invalid", async function () {
        const assetId = 0;
        const totalSupply = 10; // Set the total supply for the asset

        // Mint an asset with the specified total supply
        await axMarketPlace.connect(owner).mintAsset(
          "Test Asset",
          "A test asset for supply testing",
          "Test",
          totalSupply,
          18, // Decimals
          ethers.utils.parseEther("1"), // Price per token
          true, // isShared
          true, // isApproved
        );

        // Check that the returned supply matches the expected total supply
        await expect(axMarketPlace.getOwners(assetId)).to.be.revertedWith("Invalid asset ID");
      });
    });

    describe("getAsset", function () {
      it("should revert if assetId provided is invalid", async function () {
        const assetId = 0;
        const totalSupply = 10; // Set the total supply for the asset

        // Mint an asset with the specified total supply
        await axMarketPlace.connect(owner).mintAsset(
          "Test Asset",
          "A test asset for supply testing",
          "Test",
          totalSupply,
          18, // Decimals
          ethers.utils.parseEther("1"), // Price per token
          true, // isShared
          true, // isApproved
        );

        // Check that the returned supply matches the expected total supply
        await expect(axMarketPlace.getAsset(assetId)).to.be.revertedWith("Invalid asset ID");
      });
    });

    describe("Creator Rights", function () {
      describe("Update Asset Details", function () {
        it("should allow the creator to update asset details", async function () {
          const assetId = 1;

          await axMarketPlace.connect(creator).mintAsset(
            "Test Asset",
            "A test asset for updating details",
            "Test",
            1, // Total supply
            18, // Decimals
            ethers.utils.parseEther("1"), // Price per token
            false, // isShared
            true, // isApproved
          );

          // Update asset details as the creator
          const newTitle = "Updated Title";
          const newDescription = "Updated Description";
          const newPrice = ethers.utils.parseEther("2");

          await axMarketPlace.connect(creator).updateAssetDetails(assetId, newTitle, newDescription, newPrice);

          // Retrieve the updated asset details
          // const asset = await axMarketPlace.assets(assetId);

          // // Check that the asset details have been updated
          // expect(asset.title).to.equal(newTitle);
          // expect(asset.description).to.equal(newDescription);
          // expect(asset.pricePerToken).to.equal(newPrice);
        });

        it("should not allow the creator to update asset details if ID is invalid", async function () {
          const assetId = 0;

          await axMarketPlace.connect(creator).mintAsset(
            "Test Asset",
            "A test asset for updating details",
            "Test",
            10, // Total supply
            18, // Decimals
            ethers.utils.parseEther("1"), // Price per token
            true, // isShared
            true, // isApproved
          );

          // Update asset details as the creator
          const newTitle = "Updated Title";
          const newDescription = "Updated Description";
          const newPrice = ethers.utils.parseEther("2");

          await expect(
            axMarketPlace.connect(creator).updateAssetDetails(assetId, newTitle, newDescription, newPrice),
          ).to.be.revertedWith("Invalid asset ID");
        });

        it("should not allow a non-creator to update asset details", async function () {
          const assetId = 1;

          // Mint an asset and set the creator
          await axMarketPlace.connect(owner).mintAsset(
            "Test Asset",
            "A test asset for updating details",
            "Test",
            10, // Total supply
            18, // Decimals
            ethers.utils.parseEther("1"), // Price per token
            true, // isShared
            true, // isApproved
          );

          // Attempt to update asset details as a non-creator
          const newTitle = "Updated Title";
          const newDescription = "Updated Description";
          const newPrice = ethers.utils.parseEther("2");

          await expect(
            axMarketPlace.connect(user).updateAssetDetails(assetId, newTitle, newDescription, newPrice),
          ).to.be.revertedWith("Unauthorised access");
        });
      });

      describe("Burn assets", function () {
        it("should allow the creator to burn an asset", async function () {
          const assetId = 1;

          await axMarketPlace
            .connect(creator)
            .mintAsset(
              "Test Asset",
              "A test asset for burning",
              "Test",
              1,
              18,
              ethers.utils.parseEther("1"),
              false,
              true,
            );

          await axMarketPlace.connect(creator).burnAsset(assetId);

          const creatorAddress = await axMarketPlace.creators(assetId);
          expect(creatorAddress).to.equal("0x0000000000000000000000000000000000000000");
        });

        it("should not allow the creator to burn an asset if asset Id is invalid", async function () {
          const assetId = 0;

          await axMarketPlace
            .connect(creator)
            .mintAsset(
              "Test Asset",
              "A test asset for burning",
              "Test",
              1,
              18,
              ethers.utils.parseEther("1"),
              false,
              true,
            );

          await expect(axMarketPlace.connect(creator).burnAsset(assetId)).to.be.revertedWith("Invalid asset ID");
        });

        it("should not allow a non-creator to burn an asset", async function () {
          const assetId = 1;

          // Mint an asset and set the creator
          await axMarketPlace.connect(owner).mintAsset(
            "Test Asset",
            "A test asset for burning",
            "Test",
            1, // Total supply
            18, // Decimals
            ethers.utils.parseEther("1"), // Price per token
            false, // isShared
            true, // isApproved
          );

          // Attempt to burn the asset as a non-creator
          await expect(axMarketPlace.connect(user).burnAsset(assetId)).to.be.revertedWith("Unauthorised access");
        });
      });

      it("should revert when burning an asset with owners", async function () {
        const assetId = 1;

        // Mint an asset and set the creator
        await axMarketPlace.connect(owner).mintAsset(
          "Test Asset",
          "A test asset with owners",
          "Test",
          1, // Total supply
          18, // Decimals
          ethers.utils.parseEther("1"), // Price per token
          false, // isShared
          true, // isApproved
        );

        await axMarketPlace.connect(user).buyAsset(assetId, 1, { value: ethers.utils.parseEther("1") });

        // Attempt to burn the asset as the creator
        await expect(axMarketPlace.connect(creator).burnAsset(assetId)).to.be.revertedWith("Unauthorised access");
      });
    });
  });
});
