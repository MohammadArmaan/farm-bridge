const { expect } = require("chai");
const { ethers } = require("hardhat");
const { time, loadFixture } = require("@nomicfoundation/hardhat-network-helpers");

describe("FarmBridge", function () {
  async function deployFarmBridgeFixture() {
    const [owner, donor, farmer, other] = await ethers.getSigners();

    const FarmBridge = await ethers.getContractFactory("FarmBridge");
    const farmBridge = await FarmBridge.deploy();

    return { farmBridge, owner, donor, farmer, other };
  }

  describe("Deployment", function () {
    it("Should set the correct owner", async function () {
      const { farmBridge, owner } = await loadFixture(deployFarmBridgeFixture);
      expect(await farmBridge.owner()).to.equal(owner.address);
    });

    it("Should initialize with zero stats", async function () {
      const { farmBridge } = await loadFixture(deployFarmBridgeFixture);
      const stats = await farmBridge.getContractStats();
      expect(stats._totalDonors).to.equal(0);
      expect(stats._totalBeneficiaries).to.equal(0);
      expect(stats._totalFundsDistributed).to.equal(0);
    });
  });

  describe("Donor Registration", function () {
    it("Should allow donor to register with all details", async function () {
      const { farmBridge, donor } = await loadFixture(deployFarmBridgeFixture);

      await farmBridge.connect(donor).registerDonor(
        "AidOrg",
        "Helping farmers",
        "ipfs://donor-hash",
        "+1234567890",
        "donor@example.com"
      );

      const donorStats = await farmBridge.getDonorStats(donor.address);
      expect(donorStats.name).to.equal("AidOrg");
      expect(donorStats.description).to.equal("Helping farmers");
      expect(donorStats.email).to.equal("donor@example.com");
      expect(donorStats.phoneNo).to.equal("+1234567890");
      expect(donorStats.ipfs).to.equal("ipfs://donor-hash");
      expect(donorStats.isVerified).to.equal(false);
      expect(donorStats.reputationScore).to.equal(50);
    });

    it("Should emit DonorRegistered event", async function () {
      const { farmBridge, donor } = await loadFixture(deployFarmBridgeFixture);

      await expect(
        farmBridge.connect(donor).registerDonor(
          "AidOrg",
          "Helping farmers",
          "ipfs://hash",
          "+1234567890",
          "donor@example.com"
        )
      )
        .to.emit(farmBridge, "DonorRegistered")
        .withArgs(donor.address, "AidOrg", "donor@example.com", "ipfs://hash", "+1234567890");
    });

    it("Should not allow duplicate donor registration", async function () {
      const { farmBridge, donor } = await loadFixture(deployFarmBridgeFixture);

      await farmBridge.connect(donor).registerDonor(
        "AidOrg",
        "Helping farmers",
        "ipfs://hash",
        "+1234567890",
        "donor@example.com"
      );

      await expect(
        farmBridge.connect(donor).registerDonor(
          "Again",
          "Nope",
          "ipfs://hash2",
          "+9876543210",
          "donor2@example.com"
        )
      ).to.be.revertedWith("Donor already registered");
    });

    it("Should increment total donors count", async function () {
      const { farmBridge, donor, other } = await loadFixture(deployFarmBridgeFixture);

      await farmBridge.connect(donor).registerDonor(
        "Donor1",
        "Description1",
        "ipfs://hash1",
        "+1111111111",
        "donor1@example.com"
      );

      let stats = await farmBridge.getContractStats();
      expect(stats._totalDonors).to.equal(1);

      await farmBridge.connect(other).registerDonor(
        "Donor2",
        "Description2",
        "ipfs://hash2",
        "+2222222222",
        "donor2@example.com"
      );

      stats = await farmBridge.getContractStats();
      expect(stats._totalDonors).to.equal(2);
    });

    it("Should return true for isDonorRegistered", async function () {
      const { farmBridge, donor } = await loadFixture(deployFarmBridgeFixture);

      expect(await farmBridge.isDonorRegistered(donor.address)).to.equal(false);

      await farmBridge.connect(donor).registerDonor(
        "AidOrg",
        "Helping",
        "ipfs://hash",
        "+1234567890",
        "donor@example.com"
      );

      expect(await farmBridge.isDonorRegistered(donor.address)).to.equal(true);
    });
  });

  describe("Farmer Registration", function () {
    it("Should allow farmer to register with all details", async function () {
      const { farmBridge, farmer } = await loadFixture(deployFarmBridgeFixture);

      await farmBridge.connect(farmer).registerFarmer(
        "Ravi",
        "Village A",
        "Organic",
        "ipfs://farmer-hash",
        "+9876543210",
        "farmer@example.com"
      );

      const stats = await farmBridge.getFarmerStats(farmer.address);
      expect(stats.name).to.equal("Ravi");
      expect(stats.location).to.equal("Village A");
      expect(stats.farmType).to.equal("Organic");
      expect(stats.email).to.equal("farmer@example.com");
      expect(stats.phoneNo).to.equal("+9876543210");
      expect(stats.ipfs).to.equal("ipfs://farmer-hash");
      expect(stats.isVerified).to.equal(false);
      expect(stats.totalReceived).to.equal(0);
    });

    it("Should emit FarmerRegistered event", async function () {
      const { farmBridge, farmer } = await loadFixture(deployFarmBridgeFixture);

      await expect(
        farmBridge.connect(farmer).registerFarmer(
          "Ravi",
          "Village A",
          "Organic",
          "ipfs://hash",
          "+9876543210",
          "farmer@example.com"
        )
      )
        .to.emit(farmBridge, "FarmerRegistered")
        .withArgs(farmer.address, "Ravi", "Village A", "farmer@example.com", "ipfs://hash", "+9876543210");
    });

    it("Should not allow duplicate farmer registration", async function () {
      const { farmBridge, farmer } = await loadFixture(deployFarmBridgeFixture);

      await farmBridge.connect(farmer).registerFarmer(
        "Ravi",
        "Village A",
        "Organic",
        "ipfs://hash",
        "+9876543210",
        "farmer@example.com"
      );

      await expect(
        farmBridge.connect(farmer).registerFarmer(
          "Ravi2",
          "Village B",
          "Traditional",
          "ipfs://hash2",
          "+1111111111",
          "farmer2@example.com"
        )
      ).to.be.revertedWith("Farmer already registered");
    });

    it("Should increment total beneficiaries count", async function () {
      const { farmBridge, farmer, other } = await loadFixture(deployFarmBridgeFixture);

      await farmBridge.connect(farmer).registerFarmer(
        "Farmer1",
        "Location1",
        "Type1",
        "ipfs://hash1",
        "+1111111111",
        "farmer1@example.com"
      );

      let stats = await farmBridge.getContractStats();
      expect(stats._totalBeneficiaries).to.equal(1);

      await farmBridge.connect(other).registerFarmer(
        "Farmer2",
        "Location2",
        "Type2",
        "ipfs://hash2",
        "+2222222222",
        "farmer2@example.com"
      );

      stats = await farmBridge.getContractStats();
      expect(stats._totalBeneficiaries).to.equal(2);
    });

    it("Should return true for isFarmerRegistered", async function () {
      const { farmBridge, farmer } = await loadFixture(deployFarmBridgeFixture);

      expect(await farmBridge.isFarmerRegistered(farmer.address)).to.equal(false);

      await farmBridge.connect(farmer).registerFarmer(
        "Ravi",
        "Village A",
        "Organic",
        "ipfs://hash",
        "+9876543210",
        "farmer@example.com"
      );

      expect(await farmBridge.isFarmerRegistered(farmer.address)).to.equal(true);
    });
  });

  describe("Verification", function () {
    it("Should allow owner to verify donor", async function () {
      const { farmBridge, owner, donor } = await loadFixture(deployFarmBridgeFixture);

      await farmBridge.connect(donor).registerDonor(
        "AidOrg",
        "Helping",
        "ipfs://hash",
        "+1234567890",
        "donor@example.com"
      );

      await expect(farmBridge.connect(owner).verifyDonor(donor.address))
        .to.emit(farmBridge, "DonorVerified")
        .withArgs(donor.address);

      const stats = await farmBridge.getDonorStats(donor.address);
      expect(stats.isVerified).to.equal(true);
    });

    it("Should allow owner to verify farmer", async function () {
      const { farmBridge, owner, farmer } = await loadFixture(deployFarmBridgeFixture);

      await farmBridge.connect(farmer).registerFarmer(
        "Ravi",
        "Village A",
        "Organic",
        "ipfs://hash",
        "+9876543210",
        "farmer@example.com"
      );

      await expect(farmBridge.connect(owner).verifyFarmer(farmer.address))
        .to.emit(farmBridge, "FarmerVerified")
        .withArgs(farmer.address);

      const stats = await farmBridge.getFarmerStats(farmer.address);
      expect(stats.isVerified).to.equal(true);
    });

    it("Should not allow non-owner to verify", async function () {
      const { farmBridge, donor, farmer } = await loadFixture(deployFarmBridgeFixture);

      await farmBridge.connect(donor).registerDonor(
        "AidOrg",
        "Helping",
        "ipfs://hash",
        "+1234567890",
        "donor@example.com"
      );

      await expect(
        farmBridge.connect(farmer).verifyDonor(donor.address)
      ).to.be.revertedWith("Only owner can call this function");
    });

    it("Should revert if verifying unregistered donor", async function () {
      const { farmBridge, owner, other } = await loadFixture(deployFarmBridgeFixture);

      await expect(
        farmBridge.connect(owner).verifyDonor(other.address)
      ).to.be.revertedWith("Donor not registered");
    });

    it("Should revert if verifying unregistered farmer", async function () {
      const { farmBridge, owner, other } = await loadFixture(deployFarmBridgeFixture);

      await expect(
        farmBridge.connect(owner).verifyFarmer(other.address)
      ).to.be.revertedWith("Farmer not registered");
    });
  });

  describe("Aid Requests", function () {
    it("Should allow registered farmer to request aid", async function () {
      const { farmBridge, farmer } = await loadFixture(deployFarmBridgeFixture);

      await farmBridge.connect(farmer).registerFarmer(
        "Ravi",
        "Village A",
        "Organic",
        "ipfs://hash",
        "+9876543210",
        "farmer@example.com"
      );

      const amount = ethers.parseEther("1");
      await expect(
        farmBridge.connect(farmer).requestAid("Seeds Purchase", "Need seeds for planting", amount)
      )
        .to.emit(farmBridge, "AidRequested")
        .withArgs(0, farmer.address, "Seeds Purchase", "Need seeds for planting", amount);
    });

    it("Should not allow unregistered farmer to request aid", async function () {
      const { farmBridge, other } = await loadFixture(deployFarmBridgeFixture);

      const amount = ethers.parseEther("1");
      await expect(
        farmBridge.connect(other).requestAid("Seeds", "Need help", amount)
      ).to.be.revertedWith("Only registered farmers can call this function");
    });

    it("Should not allow zero amount aid request", async function () {
      const { farmBridge, farmer } = await loadFixture(deployFarmBridgeFixture);

      await farmBridge.connect(farmer).registerFarmer(
        "Ravi",
        "Village A",
        "Organic",
        "ipfs://hash",
        "+9876543210",
        "farmer@example.com"
      );

      await expect(
        farmBridge.connect(farmer).requestAid("Seeds", "Need help", 0)
      ).to.be.revertedWith("Requested amount must be greater than zero");
    });

    it("Should correctly store aid request details", async function () {
      const { farmBridge, farmer } = await loadFixture(deployFarmBridgeFixture);

      await farmBridge.connect(farmer).registerFarmer(
        "Ravi",
        "Village A",
        "Organic",
        "ipfs://hash",
        "+9876543210",
        "farmer@example.com"
      );

      const amount = ethers.parseEther("2.5");
      await farmBridge.connect(farmer).requestAid("Tools", "Need farming tools", amount);

      const allRequests = await farmBridge.getAllAidRequests();
      expect(allRequests.ids.length).to.equal(1);
      expect(allRequests.farmerAddressesList[0]).to.equal(farmer.address);
      expect(allRequests.requestNames[0]).to.equal("Tools");
      expect(allRequests.purposes[0]).to.equal("Need farming tools");
      expect(allRequests.amountsRequested[0]).to.equal(amount);
      expect(allRequests.amountsFunded[0]).to.equal(0);
      expect(allRequests.fulfilledStatuses[0]).to.equal(false);
    });
  });

  describe("Funding Aid Requests", function () {
    it("Should allow registered donor to fund aid request", async function () {
      const { farmBridge, donor, farmer } = await loadFixture(deployFarmBridgeFixture);

      // Register and setup
      await farmBridge.connect(donor).registerDonor(
        "AidOrg",
        "Helping",
        "ipfs://hash",
        "+1234567890",
        "donor@example.com"
      );
      await farmBridge.connect(farmer).registerFarmer(
        "Ravi",
        "Village A",
        "Organic",
        "ipfs://hash",
        "+9876543210",
        "farmer@example.com"
      );

      const requestAmount = ethers.parseEther("1");
      await farmBridge.connect(farmer).requestAid("Seeds", "Need seeds", requestAmount);

      const fundAmount = ethers.parseEther("0.5");
      await expect(
        farmBridge.connect(donor).fundAidRequest(0, { value: fundAmount })
      )
        .to.emit(farmBridge, "AidFunded")
        .withArgs(0, donor.address, farmer.address, fundAmount);
    });

    it("Should not allow unregistered donor to fund", async function () {
      const { farmBridge, farmer, other } = await loadFixture(deployFarmBridgeFixture);

      await farmBridge.connect(farmer).registerFarmer(
        "Ravi",
        "Village A",
        "Organic",
        "ipfs://hash",
        "+9876543210",
        "farmer@example.com"
      );

      const requestAmount = ethers.parseEther("1");
      await farmBridge.connect(farmer).requestAid("Seeds", "Need seeds", requestAmount);

      await expect(
        farmBridge.connect(other).fundAidRequest(0, { value: ethers.parseEther("0.5") })
      ).to.be.revertedWith("Only registered donors can call this function");
    });

    it("Should update donor and farmer statistics after funding", async function () {
      const { farmBridge, donor, farmer } = await loadFixture(deployFarmBridgeFixture);

      await farmBridge.connect(donor).registerDonor(
        "AidOrg",
        "Helping",
        "ipfs://hash",
        "+1234567890",
        "donor@example.com"
      );
      await farmBridge.connect(farmer).registerFarmer(
        "Ravi",
        "Village A",
        "Organic",
        "ipfs://hash",
        "+9876543210",
        "farmer@example.com"
      );

      const requestAmount = ethers.parseEther("1");
      await farmBridge.connect(farmer).requestAid("Seeds", "Need seeds", requestAmount);

      const fundAmount = ethers.parseEther("0.5");
      await farmBridge.connect(donor).fundAidRequest(0, { value: fundAmount });

      const donorStats = await farmBridge.getDonorStats(donor.address);
      expect(donorStats.totalDonated).to.equal(fundAmount);
      expect(donorStats.successfulDisbursements).to.equal(1);

      const farmerStats = await farmBridge.getFarmerStats(farmer.address);
      expect(farmerStats.totalReceived).to.equal(fundAmount);
    });

    it("Should mark request as fulfilled when fully funded", async function () {
      const { farmBridge, donor, farmer } = await loadFixture(deployFarmBridgeFixture);

      await farmBridge.connect(donor).registerDonor(
        "AidOrg",
        "Helping",
        "ipfs://hash",
        "+1234567890",
        "donor@example.com"
      );
      await farmBridge.connect(farmer).registerFarmer(
        "Ravi",
        "Village A",
        "Organic",
        "ipfs://hash",
        "+9876543210",
        "farmer@example.com"
      );

      const requestAmount = ethers.parseEther("1");
      await farmBridge.connect(farmer).requestAid("Seeds", "Need seeds", requestAmount);

      await farmBridge.connect(donor).fundAidRequest(0, { value: requestAmount });

      const allRequests = await farmBridge.getAllAidRequests();
      expect(allRequests.fulfilledStatuses[0]).to.equal(true);
      expect(allRequests.amountsFunded[0]).to.equal(requestAmount);
    });

    it("Should allow partial funding", async function () {
      const { farmBridge, donor, farmer } = await loadFixture(deployFarmBridgeFixture);

      await farmBridge.connect(donor).registerDonor(
        "AidOrg",
        "Helping",
        "ipfs://hash",
        "+1234567890",
        "donor@example.com"
      );
      await farmBridge.connect(farmer).registerFarmer(
        "Ravi",
        "Village A",
        "Organic",
        "ipfs://hash",
        "+9876543210",
        "farmer@example.com"
      );

      const requestAmount = ethers.parseEther("2");
      await farmBridge.connect(farmer).requestAid("Seeds", "Need seeds", requestAmount);

      const fundAmount = ethers.parseEther("0.5");
      await farmBridge.connect(donor).fundAidRequest(0, { value: fundAmount });

      const allRequests = await farmBridge.getAllAidRequests();
      expect(allRequests.fulfilledStatuses[0]).to.equal(false);
      expect(allRequests.amountsFunded[0]).to.equal(fundAmount);
    });

    it("Should not allow funding fulfilled requests", async function () {
      const { farmBridge, donor, farmer } = await loadFixture(deployFarmBridgeFixture);

      await farmBridge.connect(donor).registerDonor(
        "AidOrg",
        "Helping",
        "ipfs://hash",
        "+1234567890",
        "donor@example.com"
      );
      await farmBridge.connect(farmer).registerFarmer(
        "Ravi",
        "Village A",
        "Organic",
        "ipfs://hash",
        "+9876543210",
        "farmer@example.com"
      );

      const requestAmount = ethers.parseEther("1");
      await farmBridge.connect(farmer).requestAid("Seeds", "Need seeds", requestAmount);

      await farmBridge.connect(donor).fundAidRequest(0, { value: requestAmount });

      await expect(
        farmBridge.connect(donor).fundAidRequest(0, { value: ethers.parseEther("0.1") })
      ).to.be.revertedWith("Aid request already fulfilled");
    });

    it("Should revert on invalid request ID", async function () {
      const { farmBridge, donor } = await loadFixture(deployFarmBridgeFixture);

      await farmBridge.connect(donor).registerDonor(
        "AidOrg",
        "Helping",
        "ipfs://hash",
        "+1234567890",
        "donor@example.com"
      );

      await expect(
        farmBridge.connect(donor).fundAidRequest(999, { value: ethers.parseEther("1") })
      ).to.be.revertedWith("Invalid request ID");
    });

    it("Should revert if no ETH is sent", async function () {
      const { farmBridge, donor, farmer } = await loadFixture(deployFarmBridgeFixture);

      await farmBridge.connect(donor).registerDonor(
        "AidOrg",
        "Helping",
        "ipfs://hash",
        "+1234567890",
        "donor@example.com"
      );
      await farmBridge.connect(farmer).registerFarmer(
        "Ravi",
        "Village A",
        "Organic",
        "ipfs://hash",
        "+9876543210",
        "farmer@example.com"
      );

      await farmBridge.connect(farmer).requestAid("Seeds", "Need seeds", ethers.parseEther("1"));

      await expect(
        farmBridge.connect(donor).fundAidRequest(0, { value: 0 })
      ).to.be.revertedWith("Must send ETH to fund");
    });

    it("Should transfer funds directly to farmer", async function () {
      const { farmBridge, donor, farmer } = await loadFixture(deployFarmBridgeFixture);

      await farmBridge.connect(donor).registerDonor(
        "AidOrg",
        "Helping",
        "ipfs://hash",
        "+1234567890",
        "donor@example.com"
      );
      await farmBridge.connect(farmer).registerFarmer(
        "Ravi",
        "Village A",
        "Organic",
        "ipfs://hash",
        "+9876543210",
        "farmer@example.com"
      );

      await farmBridge.connect(farmer).requestAid("Seeds", "Need seeds", ethers.parseEther("1"));

      const farmerBalanceBefore = await ethers.provider.getBalance(farmer.address);
      const fundAmount = ethers.parseEther("0.5");

      await farmBridge.connect(donor).fundAidRequest(0, { value: fundAmount });

      const farmerBalanceAfter = await ethers.provider.getBalance(farmer.address);
      expect(farmerBalanceAfter - farmerBalanceBefore).to.equal(fundAmount);
    });

    it("Should update total funds distributed", async function () {
      const { farmBridge, donor, farmer } = await loadFixture(deployFarmBridgeFixture);

      await farmBridge.connect(donor).registerDonor(
        "AidOrg",
        "Helping",
        "ipfs://hash",
        "+1234567890",
        "donor@example.com"
      );
      await farmBridge.connect(farmer).registerFarmer(
        "Ravi",
        "Village A",
        "Organic",
        "ipfs://hash",
        "+9876543210",
        "farmer@example.com"
      );

      await farmBridge.connect(farmer).requestAid("Seeds", "Need seeds", ethers.parseEther("1"));

      const fundAmount = ethers.parseEther("0.5");
      await farmBridge.connect(donor).fundAidRequest(0, { value: fundAmount });

      const stats = await farmBridge.getContractStats();
      expect(stats._totalFundsDistributed).to.equal(fundAmount);
    });
  });

  describe("Reputation System", function () {
    it("Should update donor reputation after funding", async function () {
      const { farmBridge, donor, farmer } = await loadFixture(deployFarmBridgeFixture);

      await farmBridge.connect(donor).registerDonor(
        "AidOrg",
        "Helping",
        "ipfs://hash",
        "+1234567890",
        "donor@example.com"
      );
      await farmBridge.connect(farmer).registerFarmer(
        "Ravi",
        "Village A",
        "Organic",
        "ipfs://hash",
        "+9876543210",
        "farmer@example.com"
      );

      await farmBridge.connect(farmer).requestAid("Seeds", "Need seeds", ethers.parseEther("1"));

      await expect(
        farmBridge.connect(donor).fundAidRequest(0, { value: ethers.parseEther("0.5") })
      ).to.emit(farmBridge, "ReputationUpdated");

      const donorStats = await farmBridge.getDonorStats(donor.address);
      expect(donorStats.reputationScore).to.be.greaterThan(0);
      expect(donorStats.reputationScore).to.be.lessThanOrEqual(100);
    });

    it("Should cap reputation score at 100", async function () {
      const { farmBridge, donor, farmer } = await loadFixture(deployFarmBridgeFixture);

      await farmBridge.connect(donor).registerDonor(
        "AidOrg",
        "Helping",
        "ipfs://hash",
        "+1234567890",
        "donor@example.com"
      );
      await farmBridge.connect(farmer).registerFarmer(
        "Ravi",
        "Village A",
        "Organic",
        "ipfs://hash",
        "+9876543210",
        "farmer@example.com"
      );

      // Create and fund multiple requests
      for (let i = 0; i < 5; i++) {
        await farmBridge.connect(farmer).requestAid(`Request ${i}`, "Need help", ethers.parseEther("1"));
        await farmBridge.connect(donor).fundAidRequest(i, { value: ethers.parseEther("1") });
      }

      const donorStats = await farmBridge.getDonorStats(donor.address);
      expect(donorStats.reputationScore).to.be.lessThanOrEqual(100);
    });
  });

  describe("View Functions", function () {
    it("Should return all aid requests", async function () {
      const { farmBridge, farmer } = await loadFixture(deployFarmBridgeFixture);

      await farmBridge.connect(farmer).registerFarmer(
        "Ravi",
        "Village A",
        "Organic",
        "ipfs://hash",
        "+9876543210",
        "farmer@example.com"
      );

      await farmBridge.connect(farmer).requestAid("Request1", "Purpose1", ethers.parseEther("1"));
      await farmBridge.connect(farmer).requestAid("Request2", "Purpose2", ethers.parseEther("2"));

      const allRequests = await farmBridge.getAllAidRequests();
      expect(allRequests.ids.length).to.equal(2);
      expect(allRequests.requestNames[0]).to.equal("Request1");
      expect(allRequests.requestNames[1]).to.equal("Request2");
    });

    it("Should return all farmers", async function () {
      const { farmBridge, farmer, other } = await loadFixture(deployFarmBridgeFixture);

      await farmBridge.connect(farmer).registerFarmer(
        "Farmer1",
        "Location1",
        "Type1",
        "ipfs://hash1",
        "+1111111111",
        "farmer1@example.com"
      );
      await farmBridge.connect(other).registerFarmer(
        "Farmer2",
        "Location2",
        "Type2",
        "ipfs://hash2",
        "+2222222222",
        "farmer2@example.com"
      );

      const allFarmers = await farmBridge.getAllFarmers();
      expect(allFarmers.addresses.length).to.equal(2);
      expect(allFarmers.names[0]).to.equal("Farmer1");
      expect(allFarmers.names[1]).to.equal("Farmer2");
      expect(allFarmers.email[0]).to.equal("farmer1@example.com");
      expect(allFarmers.phoneNo[0]).to.equal("+1111111111");
    });

    it("Should return all donors", async function () {
      const { farmBridge, donor, other } = await loadFixture(deployFarmBridgeFixture);

      await farmBridge.connect(donor).registerDonor(
        "Donor1",
        "Desc1",
        "ipfs://hash1",
        "+1111111111",
        "donor1@example.com"
      );
      await farmBridge.connect(other).registerDonor(
        "Donor2",
        "Desc2",
        "ipfs://hash2",
        "+2222222222",
        "donor2@example.com"
      );

      const allDonors = await farmBridge.getAllDonors();
      expect(allDonors.addresses.length).to.equal(2);
      expect(allDonors.names[0]).to.equal("Donor1");
      expect(allDonors.names[1]).to.equal("Donor2");
      expect(allDonors.email[0]).to.equal("donor1@example.com");
      expect(allDonors.phoneNo[0]).to.equal("+1111111111");
    });

    it("Should return correct contract stats", async function () {
      const { farmBridge, donor, farmer } = await loadFixture(deployFarmBridgeFixture);

      await farmBridge.connect(donor).registerDonor(
        "Donor",
        "Desc",
        "ipfs://hash",
        "+1111111111",
        "donor@example.com"
      );
      await farmBridge.connect(farmer).registerFarmer(
        "Farmer",
        "Location",
        "Type",
        "ipfs://hash",
        "+2222222222",
        "farmer@example.com"
      );

      await farmBridge.connect(farmer).requestAid("Seeds", "Need seeds", ethers.parseEther("1"));
      await farmBridge.connect(donor).fundAidRequest(0, { value: ethers.parseEther("0.5") });

      const stats = await farmBridge.getContractStats();
      expect(stats._totalDonors).to.equal(1);
      expect(stats._totalBeneficiaries).to.equal(1);
      expect(stats._totalFundsDistributed).to.equal(ethers.parseEther("0.5"));
    });
  });

  describe("Multiple Donors Funding Same Request", function () {
    it("Should allow multiple donors to fund the same request", async function () {
      const { farmBridge, donor, farmer, other } = await loadFixture(deployFarmBridgeFixture);

      // Register donors and farmer
      await farmBridge.connect(donor).registerDonor(
        "Donor1",
        "Helping",
        "ipfs://hash1",
        "+1111111111",
        "donor1@example.com"
      );
      await farmBridge.connect(other).registerDonor(
        "Donor2",
        "Also helping",
        "ipfs://hash2",
        "+2222222222",
        "donor2@example.com"
      );
      await farmBridge.connect(farmer).registerFarmer(
        "Ravi",
        "Village A",
        "Organic",
        "ipfs://hash",
        "+9876543210",
        "farmer@example.com"
      );

      // Create aid request
      const requestAmount = ethers.parseEther("2");
      await farmBridge.connect(farmer).requestAid("Seeds", "Need seeds", requestAmount);

      // First donor funds partially
      const fund1 = ethers.parseEther("0.8");
      await farmBridge.connect(donor).fundAidRequest(0, { value: fund1 });

      // Second donor funds the rest
      const fund2 = ethers.parseEther("1.2");
      await farmBridge.connect(other).fundAidRequest(0, { value: fund2 });

      // Check request is fulfilled
      const allRequests = await farmBridge.getAllAidRequests();
      expect(allRequests.fulfilledStatuses[0]).to.equal(true);
      expect(allRequests.amountsFunded[0]).to.equal(fund1 + fund2);

      // Check both donors' stats updated
      const donor1Stats = await farmBridge.getDonorStats(donor.address);
      expect(donor1Stats.totalDonated).to.equal(fund1);
      expect(donor1Stats.successfulDisbursements).to.equal(1);

      const donor2Stats = await farmBridge.getDonorStats(other.address);
      expect(donor2Stats.totalDonated).to.equal(fund2);
      expect(donor2Stats.successfulDisbursements).to.equal(1);
    });

    it("Should accumulate farmer's total received from multiple donors", async function () {
      const { farmBridge, donor, farmer, other } = await loadFixture(deployFarmBridgeFixture);

      await farmBridge.connect(donor).registerDonor(
        "Donor1",
        "Helping",
        "ipfs://hash1",
        "+1111111111",
        "donor1@example.com"
      );
      await farmBridge.connect(other).registerDonor(
        "Donor2",
        "Also helping",
        "ipfs://hash2",
        "+2222222222",
        "donor2@example.com"
      );
      await farmBridge.connect(farmer).registerFarmer(
        "Ravi",
        "Village A",
        "Organic",
        "ipfs://hash",
        "+9876543210",
        "farmer@example.com"
      );

      await farmBridge.connect(farmer).requestAid("Seeds", "Need seeds", ethers.parseEther("2"));

      const fund1 = ethers.parseEther("0.8");
      const fund2 = ethers.parseEther("1.2");

      await farmBridge.connect(donor).fundAidRequest(0, { value: fund1 });
      await farmBridge.connect(other).fundAidRequest(0, { value: fund2 });

      const farmerStats = await farmBridge.getFarmerStats(farmer.address);
      expect(farmerStats.totalReceived).to.equal(fund1 + fund2);
    });
  });

  describe("Edge Cases", function () {
    it("Should handle over-funding gracefully", async function () {
      const { farmBridge, donor, farmer } = await loadFixture(deployFarmBridgeFixture);

      await farmBridge.connect(donor).registerDonor(
        "Donor",
        "Helping",
        "ipfs://hash",
        "+1111111111",
        "donor@example.com"
      );
      await farmBridge.connect(farmer).registerFarmer(
        "Ravi",
        "Village A",
        "Organic",
        "ipfs://hash",
        "+9876543210",
        "farmer@example.com"
      );

      const requestAmount = ethers.parseEther("1");
      await farmBridge.connect(farmer).requestAid("Seeds", "Need seeds", requestAmount);

      // Fund more than requested
      const fundAmount = ethers.parseEther("2");
      await farmBridge.connect(donor).fundAidRequest(0, { value: fundAmount });

      const allRequests = await farmBridge.getAllAidRequests();
      expect(allRequests.fulfilledStatuses[0]).to.equal(true);
      expect(allRequests.amountsFunded[0]).to.equal(fundAmount);

      // Farmer should receive the full funded amount
      const farmerStats = await farmBridge.getFarmerStats(farmer.address);
      expect(farmerStats.totalReceived).to.equal(fundAmount);
    });

    it("Should handle very small funding amounts", async function () {
      const { farmBridge, donor, farmer } = await loadFixture(deployFarmBridgeFixture);

      await farmBridge.connect(donor).registerDonor(
        "Donor",
        "Helping",
        "ipfs://hash",
        "+1111111111",
        "donor@example.com"
      );
      await farmBridge.connect(farmer).registerFarmer(
        "Ravi",
        "Village A",
        "Organic",
        "ipfs://hash",
        "+9876543210",
        "farmer@example.com"
      );

      await farmBridge.connect(farmer).requestAid("Seeds", "Need seeds", ethers.parseEther("1"));

      // Fund with 1 wei
      await farmBridge.connect(donor).fundAidRequest(0, { value: 1 });

      const allRequests = await farmBridge.getAllAidRequests();
      expect(allRequests.amountsFunded[0]).to.equal(1);
      expect(allRequests.fulfilledStatuses[0]).to.equal(false);
    });

    it("Should handle large numbers of aid requests", async function () {
      const { farmBridge, farmer } = await loadFixture(deployFarmBridgeFixture);

      await farmBridge.connect(farmer).registerFarmer(
        "Ravi",
        "Village A",
        "Organic",
        "ipfs://hash",
        "+9876543210",
        "farmer@example.com"
      );

      // Create 10 aid requests
      for (let i = 0; i < 10; i++) {
        await farmBridge.connect(farmer).requestAid(
          `Request ${i}`,
          `Purpose ${i}`,
          ethers.parseEther("1")
        );
      }

      const allRequests = await farmBridge.getAllAidRequests();
      expect(allRequests.ids.length).to.equal(10);
    });

    it("Should update lastDisbursementDate on each funding", async function () {
      const { farmBridge, donor, farmer } = await loadFixture(deployFarmBridgeFixture);

      await farmBridge.connect(donor).registerDonor(
        "Donor",
        "Helping",
        "ipfs://hash",
        "+1111111111",
        "donor@example.com"
      );
      await farmBridge.connect(farmer).registerFarmer(
        "Ravi",
        "Village A",
        "Organic",
        "ipfs://hash",
        "+9876543210",
        "farmer@example.com"
      );

      await farmBridge.connect(farmer).requestAid("Seeds", "Need seeds", ethers.parseEther("2"));

      // First funding
      await farmBridge.connect(donor).fundAidRequest(0, { value: ethers.parseEther("0.5") });
      let farmerStats = await farmBridge.getFarmerStats(farmer.address);
      const firstTimestamp = farmerStats.lastDisbursementDate;
      expect(firstTimestamp).to.be.greaterThan(0);

      // Wait and fund again
      await time.increase(60); // Increase time by 60 seconds

      await farmBridge.connect(donor).fundAidRequest(0, { value: ethers.parseEther("0.5") });
      farmerStats = await farmBridge.getFarmerStats(farmer.address);
      const secondTimestamp = farmerStats.lastDisbursementDate;
      expect(secondTimestamp).to.be.greaterThan(firstTimestamp);
    });
  });

  describe("Registration with Empty Fields", function () {
    it("Should allow donor registration with empty optional fields", async function () {
      const { farmBridge, donor } = await loadFixture(deployFarmBridgeFixture);

      await farmBridge.connect(donor).registerDonor(
        "Donor",
        "Description",
        "",
        "",
        ""
      );

      const donorStats = await farmBridge.getDonorStats(donor.address);
      expect(donorStats.name).to.equal("Donor");
      expect(donorStats.email).to.equal("");
      expect(donorStats.phoneNo).to.equal("");
      expect(donorStats.ipfs).to.equal("");
    });

    it("Should allow farmer registration with empty optional fields", async function () {
      const { farmBridge, farmer } = await loadFixture(deployFarmBridgeFixture);

      await farmBridge.connect(farmer).registerFarmer(
        "Farmer",
        "Location",
        "Type",
        "",
        "",
        ""
      );

      const farmerStats = await farmBridge.getFarmerStats(farmer.address);
      expect(farmerStats.name).to.equal("Farmer");
      expect(farmerStats.email).to.equal("");
      expect(farmerStats.phoneNo).to.equal("");
      expect(farmerStats.ipfs).to.equal("");
    });
  });

  describe("Gas Optimization Tests", function () {
    it("Should efficiently handle bulk aid requests", async function () {
      const { farmBridge, farmer } = await loadFixture(deployFarmBridgeFixture);

      await farmBridge.connect(farmer).registerFarmer(
        "Ravi",
        "Village A",
        "Organic",
        "ipfs://hash",
        "+9876543210",
        "farmer@example.com"
      );

      // Create multiple requests
      const requests = [];
      for (let i = 0; i < 5; i++) {
        const tx = await farmBridge.connect(farmer).requestAid(
          `Request ${i}`,
          `Purpose ${i}`,
          ethers.parseEther("1")
        );
        requests.push(tx);
      }

      // Verify all were created
      const allRequests = await farmBridge.getAllAidRequests();
      expect(allRequests.ids.length).to.equal(5);
    });
  });

  describe("Complete Workflow", function () {
    it("Should complete a full workflow from registration to fulfilled request", async function () {
      const { farmBridge, owner, donor, farmer } = await loadFixture(deployFarmBridgeFixture);

      // Step 1: Register donor and farmer
      await farmBridge.connect(donor).registerDonor(
        "AidOrg",
        "Helping farmers",
        "ipfs://donor-hash",
        "+1234567890",
        "donor@example.com"
      );
      await farmBridge.connect(farmer).registerFarmer(
        "Ravi Kumar",
        "Village Rajasthan",
        "Organic Farming",
        "ipfs://farmer-hash",
        "+9876543210",
        "farmer@example.com"
      );

      // Step 2: Verify both
      await farmBridge.connect(owner).verifyDonor(donor.address);
      await farmBridge.connect(owner).verifyFarmer(farmer.address);

      // Step 3: Farmer requests aid
      const requestAmount = ethers.parseEther("5");
      await farmBridge.connect(farmer).requestAid(
        "Seeds and Fertilizer",
        "Need quality seeds and organic fertilizer for next season",
        requestAmount
      );

      // Step 4: Donor funds the request
      await farmBridge.connect(donor).fundAidRequest(0, { value: requestAmount });

      // Verify final state
      const allRequests = await farmBridge.getAllAidRequests();
      expect(allRequests.fulfilledStatuses[0]).to.equal(true);

      const donorStats = await farmBridge.getDonorStats(donor.address);
      expect(donorStats.totalDonated).to.equal(requestAmount);
      expect(donorStats.successfulDisbursements).to.equal(1);
      expect(donorStats.isVerified).to.equal(true);

      const farmerStats = await farmBridge.getFarmerStats(farmer.address);
      expect(farmerStats.totalReceived).to.equal(requestAmount);
      expect(farmerStats.isVerified).to.equal(true);

      const contractStats = await farmBridge.getContractStats();
      expect(contractStats._totalDonors).to.equal(1);
      expect(contractStats._totalBeneficiaries).to.equal(1);
      expect(contractStats._totalFundsDistributed).to.equal(requestAmount);
    });

    it("Should handle multiple requests and multiple fundings", async function () {
      const { farmBridge, owner, donor, farmer, other } = await loadFixture(deployFarmBridgeFixture);

      // Register all parties
      await farmBridge.connect(donor).registerDonor(
        "Donor1",
        "Helping",
        "ipfs://hash1",
        "+1111111111",
        "donor1@example.com"
      );
      await farmBridge.connect(other).registerDonor(
        "Donor2",
        "Also helping",
        "ipfs://hash2",
        "+2222222222",
        "donor2@example.com"
      );
      await farmBridge.connect(farmer).registerFarmer(
        "Ravi",
        "Village A",
        "Organic",
        "ipfs://hash",
        "+9876543210",
        "farmer@example.com"
      );

      // Create multiple aid requests
      await farmBridge.connect(farmer).requestAid("Seeds", "Need seeds", ethers.parseEther("1"));
      await farmBridge.connect(farmer).requestAid("Tools", "Need tools", ethers.parseEther("2"));
      await farmBridge.connect(farmer).requestAid("Fertilizer", "Need fertilizer", ethers.parseEther("1.5"));

      // Different donors fund different requests
      await farmBridge.connect(donor).fundAidRequest(0, { value: ethers.parseEther("1") });
      await farmBridge.connect(other).fundAidRequest(1, { value: ethers.parseEther("1") });
      await farmBridge.connect(donor).fundAidRequest(1, { value: ethers.parseEther("1") });
      await farmBridge.connect(other).fundAidRequest(2, { value: ethers.parseEther("1.5") });

      // Verify results
      const allRequests = await farmBridge.getAllAidRequests();
      expect(allRequests.fulfilledStatuses[0]).to.equal(true);
      expect(allRequests.fulfilledStatuses[1]).to.equal(true);
      expect(allRequests.fulfilledStatuses[2]).to.equal(true);

      const donor1Stats = await farmBridge.getDonorStats(donor.address);
      expect(donor1Stats.totalDonated).to.equal(ethers.parseEther("2"));
      expect(donor1Stats.successfulDisbursements).to.equal(2);

      const donor2Stats = await farmBridge.getDonorStats(other.address);
      expect(donor2Stats.totalDonated).to.equal(ethers.parseEther("2.5"));
      expect(donor2Stats.successfulDisbursements).to.equal(2);

      const farmerStats = await farmBridge.getFarmerStats(farmer.address);
      expect(farmerStats.totalReceived).to.equal(ethers.parseEther("4.5"));
    });
  });
});