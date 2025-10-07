# FarmBridge Smart Contract

## Project Overview

This project deploys a FarmBridge smart contract to the Ethereum blockchain. The contract manages a fund, likely distributing funds fairly amongst participants based on predefined rules or algorithms. The project utilizes Hardhat for development and testing.

## Features

-   **FarmBridge Smart Contract:** A Solidity smart contract (`contracts/FarmBridge.sol`) implementing a fair fund distribution mechanism.
-   **Lock Smart Contract:** A supplementary Solidity smart contract (`contracts/Lock.sol`) potentially used for controlling access or locking funds within the FarmBridge contract.
-   **Hardhat Integration:** Uses Hardhat (`hardhat.config.js`) for compilation, deployment, and testing of smart contracts.
-   **Deployment Script:** A JavaScript deployment script (`scripts/deploy.js`) automates the contract deployment process.
-   **Javascript Frontend Modules:** Javascript modules in `ignition/modules/` likely interact with the deployed smart contract. `FarmBridge.js` is likely the main module for interacting with the FarmBridge contract,
-   **Testing Framework:** JavaScript unit tests for the FarmBridge contract (`test/FarmBridge.js`).

## Usage

1. **Compile Contracts:** `npx hardhat compile`
2. **Deploy Contracts:** `npx hardhat run scripts/deploy.js` (You will likely need to configure network settings in `hardhat.config.js` before deploying).
3. **Run Tests:** `npx hardhat test`
4. **Interact with Contracts (Frontend):** Instructions for using the Javascript frontend modules in `ignition/modules` are not provided in the directory structure. Further documentation will be needed to explain the usage of `FarmBridge.js` and `Lock.js`.

## Contact Information

(Please add contact information here - email, website, etc.)
