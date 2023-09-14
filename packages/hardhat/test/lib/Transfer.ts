import { ethers } from "hardhat";
import { expect } from "chai";

describe("Transfer Library", function () {
  it("should transfer funds correctly using the library", async function () {
    const [sender, recipient] = await ethers.getSigners();
    const Transfer = await ethers.getContractFactory("Transfer");
    await Transfer.deploy();

    const testHelperFactory = await ethers.getContractFactory("TestHelper");
    const testHelper = await testHelperFactory.deploy();

    await expect(testHelper.connect(sender).transfer(recipient.address, 10)).to.be.revertedWith("Failed to send Matic");
  });
});
