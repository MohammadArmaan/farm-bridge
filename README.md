# 🌾 FarmBridge

FarmBridge is a transparent **blockchain-based aid distribution system** designed specifically for **small farmers**.  
It implements a **farmer-initiated model** that allows farmers to request aid directly, enabling donors to contribute to specific farming projects in a **transparent and accountable** way.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)  
🚀 **Live Project:** [farm-fund-project.vercel.app](https://farm-fund-project.vercel.app)

---

## 📖 Overview

FarmBridge bridges the gap between **donors** and **small-scale farmers**, creating a decentralized platform that:

-   Enables farmers to directly request financial assistance for specific agricultural needs
-   Allows donors to contribute directly to verified farmers' projects
-   Provides transparency in the flow of funds from donors to beneficiaries
-   Builds reputation and trust through a verification system
-   Tracks donation history and successful disbursements
-   Provides multi language support(English, Hindi and Kannada) making it easier to follow

---

## ✨ Features

### 👩‍🌾 For Farmers

-   **Self-registration**: Farmers can register with details including location and farm type
-   **Aid requests**: Create specific funding requests with detailed purposes and amounts
-   **Verification**: Verified by the platform to build trust with donors
-   **Direct fund receipt**: Receive funds directly to their wallet once approved

### 💰 For Donors

-   **Registration**: Create a profile with name and description
-   **Transparent giving**: View all aid requests and choose which projects to fund
-   **Reputation system**: Build reputation through consistent, successful disbursements
-   **Verification**: Get verified to enhance trust with farmers and other stakeholders

### 🛡️ For Platform Administrators

-   **Verification management**: Verify both farmers and donors to ensure authenticity
-   **Statistics tracking**: Access comprehensive statistics on platform usage
-   **Transparency**: All transactions and activities are recorded on the blockchain

---

## 🤖 Chatbot Integration

FarmBridge now comes with an **AI-powered multi-language chatbot** that helps both farmers and donors:

-   Answer questions about **FarmBridge**, **Blockchain**, **Ethereum**, and **Smart Contracts**
-   Provide quick navigation with internal links (without page reloads)
-   Support **multi-language responses** (English, Hindi, Kannada, etc.)
-   Support **Text to Speech and Speech to Text** for different languages
-   Accessible through a floating chatbot icon on all pages

---

## Technical Details

FarmBridge is built on Ethereum using Solidity version 0.8.17. It implements the following main components:

-   Structs for Donors, Farmers, and AidRequests
-   Comprehensive mapping and tracking systems for all participants
-   Event emissions for key actions to enable front-end notifications
-   Role-based permission system with owner, donor, and farmer modifiers
-   View functions to access aggregated statistics and individual profiles

## Getting Started

### Prerequisites

-   [Next.js](https://nextjs.org/)
-   [Hardhat](https://hardhat.org/) for deployment
-   [MetaMask](https://metamask.io/) or similar Ethereum wallet

### Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/Rahulhanje/FarmBridge.git
    cd FarmBridge
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Compile the smart contract:

    ```bash
    # Using Truffle
    truffle compile

    # Using Hardhat
    npx hardhat compile
    ```

4. Deploy to a test network:

    ```bash
    # Using Truffle
    truffle migrate --network sepolia

    # Using Hardhat
    npx hardhat run scripts/deploy.js --network sepolia
    ```

## Usage

### For Farmers

#### Register as a Farmer

```javascript
await FarmBridge.registerFarmer(
    "John Doe", // Name
    "Nairobi, Kenya", // Location
    "Organic Vegetables" // Farm type
);
```

#### Request Aid

```javascript
await FarmBridge.requestAid(
    "Irrigation System", // Request name
    "Installing drip irrigation", // Purpose
    ethers.utils.parseEther("0.5") // Amount (in ETH)
);
```

### For Donors

#### Register as a Donor

```javascript
await FarmBridge.registerDonor(
    "ABC Foundation", // Name
    "Supporting sustainable farming" // Description
);
```

#### Fund an Aid Request

```javascript
await FarmBridge.fundAidRequest(
    1, // Request ID
    { value: ethers.utils.parseEther("0.5") } // Amount to fund
);
```

### For Administrators

#### Verify a Farmer

```javascript
await FarmBridge.verifyFarmer("0x123..."); // Farmer's address
```

#### Verify a Donor

```javascript
await FarmBridge.verifyDonor("0x456..."); // Donor's address
```

#### Get Contract Statistics

```javascript
const stats = await FarmBridge.getContractStats();
console.log(`Total Donors: ${stats._totalDonors}`);
console.log(`Total Beneficiaries: ${stats._totalBeneficiaries}`);
console.log(`Total Funds Distributed: ${stats._totalFundsDistributed}`);
```

## View Functions

### Get All Aid Requests

```javascript
const requests = await FarmBridge.getAllAidRequests();
// Returns arrays of request details including IDs, farmer addresses, etc.
```

### Get All Farmers

```javascript
const farmers = await FarmBridge.getAllFarmers();
// Returns arrays of farmer details including addresses, names, locations, etc.
```

### Get All Donors

```javascript
const donors = await FarmBridge.getAllDonors();
// Returns arrays of donor details including addresses, names, descriptions, etc.
```

## Events

The contract emits the following events that can be listened to:

-   `DonorRegistered`: When a new donor registers
-   `FarmerRegistered`: When a new farmer registers
-   `AidRequested`: When a farmer creates a new aid request
-   `AidFunded`: When a donor funds an aid request
-   `DonorVerified`: When an administrator verifies a donor
-   `FarmerVerified`: When an administrator verifies a farmer
-   `ReputationUpdated`: When a donor's reputation score is updated

## Security Considerations

-   The contract implements access controls using modifiers
-   Verification system reduces the risk of fraudulent requests
-   Reputation system helps identify reliable donors
-   Direct fund transfers minimize intermediaries
-   Consider additional security audits before mainnet deployment

## Future Enhancements

-   Multi-signature approvals for large aid requests
-   Integration with oracle services for farm verification
-   Support for non-ETH stablecoins
-   Enhanced reputation algorithms
-   Governance mechanisms for community-led decisions

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Developers

FarmBridge was built in 2025 by final year students of Don Bosco Institute of Technology

-   [Mohammad Armaan](https://mohammadarmaan.co.in)
-   Mohammed Moinuddin
-   Muhammed Shaheer
-   Koustav Das
