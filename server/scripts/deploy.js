const hre = require("hardhat");

async function main() {
    // Get the contract factory
    const FarmBridge = await hre.ethers.getContractFactory("FarmBridge");

    // Deploy the contract
    const farmBridge = await FarmBridge.deploy();

    // Wait for deployment to complete
    await farmBridge.waitForDeployment();

    // Log the deployed contract address
    console.log(`FarmBridge contract deployed at: ${fairFund.target}`);
}

// Run the script and handle errors
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
