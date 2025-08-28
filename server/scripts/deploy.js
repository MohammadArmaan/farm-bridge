const hre = require("hardhat");

async function main() {
    // Get the contract factory
    const FairFund = await hre.ethers.getContractFactory("FairFund");

    // Deploy the contract
    const fairFund = await FairFund.deploy();

    // Wait for deployment to complete
    await fairFund.waitForDeployment();

    // Log the deployed contract address
    console.log(`FairFund contract deployed at: ${fairFund.target}`);
}

// Run the script and handle errors
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
