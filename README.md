# 🌾 FarmBridge

FarmBridge is a transparent **blockchain-based aid distribution system** designed specifically for **small farmers**.  
It implements a **farmer-initiated model** that allows farmers to request aid directly, enabling donors to contribute to specific farming projects in a **secure, transparent, and accountable** way.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)  

- 🚀 **Live Project:** [https://farm-bridge-project.vercel.app](https://farm-bridge-project.vercel.app)
- 📑 **Smart Contract:** [View on Etherscan](https://sepolia.etherscan.io/address/0x0FE27a83959FD45bb9E173DeD862596fB0755165)
- 🎥 **Youtube Video:** [Watch the Demo Video](https://youtu.be/FF2OaSQs5zo)

---

## 📖 Overview

FarmBridge bridges the gap between **donors** and **small-scale farmers**, creating a decentralized platform that ensures **trust**, **security**, and **traceability** in agricultural aid distribution.

### Key Highlights

- ✅ **Secured registration** with OTP verification via **Fast2SMS**
- 📁 **IPFS integration (Pinata)** for storing address and disaster proof documents
- 📬 **Automated email notifications** for all major platform events
- 🔗 **Blockchain transparency** for every transaction
- 🌍 **Multi-language support** (English, Hindi, Kannada)

---

## ✨ Features

### 👩‍🌾 For Farmers

- **Secure registration** with phone OTP verification  
- **Address proof upload** via IPFS (Pinata)  
- **Aid requests:** Submit purpose, amount, and project details directly on-chain  
- **Verification system:** Admins verify authenticity and validate farmers  
- **Direct fund receipt:** Receive aid directly to their Ethereum wallet  
- **Email notifications:** Receive emails on registration, verification, and fund disbursement  

---

### 💰 For Donors

- **OTP-verified registration** to ensure authenticity  
- **Profile creation:** Include description, contact, and proof documents uploaded to IPFS  
- **Transparent giving:** View verified farmer requests and donate directly  
- **Reputation system:** Reputation increases with successful disbursements  
- **Automated updates:** Get notified via email for all donation activities  

---

### 🛡️ For Platform Administrators

- **Verification management:** Verify farmers and donors after checking IPFS proofs  
- **Disbursement control:** Issue and monitor aid disbursements securely  
- **Analytics dashboard:** Track total funds, disbursements, and activity stats  
- **Transparency & accountability:** Every action is recorded on-chain  

---

## 🤖 AI Chatbot Integration

FarmBridge integrates an **AI-powered multi-language chatbot** that acts as an assistant for farmers, donors, and admins.

### Key Capabilities

- 💬 Answers questions about **FarmBridge**, **Blockchain**, **Ethereum**, and **Smart Contracts**
- 🔗 Provides **internal navigation** with seamless Next.js routing (no page reloads)
- 🌐 Supports **multi-language interaction** (English, Hindi, Kannada) using `next-intl`
- 🗣️ Uses **Gemini 2.0 API** for understanding queries  
- 🔉 Supports **Text-to-Speech (TTS)** and **Speech-to-Text (STT)** using native browser APIs
- 💡 Context-aware responses with personalized assistance  

Accessible via a **floating chatbot icon** across all pages.

---

## 🧠 Email Automation (via Nodemailer)

FarmBridge uses **Nodemailer** for secure, event-driven email delivery.

| Event | Email Trigger |
|--------|----------------|
| ✅ Registration | Welcome mail confirming successful signup |
| 🔍 Verification | Admin verification confirmation mail |
| 📤 Aid Request | Farmer notified when aid request is submitted |
| 💰 Fund Donation | Donor receives confirmation and farmer receives notification |
| 🪙 Fund Disbursement | Email confirmation when funds are received |

---

## 🔐 Secure Registration (via Fast2SMS)

- OTP sent to registered mobile number during signup  
- Prevents fake accounts and ensures genuine participation  
- OTP verification logic integrated seamlessly with both **donor** and **farmer** flows  

---

## 🧾 Document Verification (via Pinata IPFS)

All **proof documents** (address proof for donors, disaster proof for farmers) are uploaded securely to **IPFS** using **Pinata**.  
Admins can view these directly from the dashboard for verification before approval.

---

## ⚙️ Technical Details

FarmBridge combines **modern Web3 + Web2 technologies** for seamless decentralized interaction.

| Stack Layer | Technologies Used |
|--------------|-------------------|
| **Frontend** | Next.js, Tailwind CSS, ShadCN UI |
| **Blockchain** | Solidity (v0.8.17), Hardhat |
| **Interaction** | Ethers.js |
| **Storage** | IPFS (via Pinata) |
| **Email System** | Nodemailer |
| **OTP System** | Fast2SMS API |
| **AI Chatbot** | Gemini 2.0 API |
| **Localization** | next-intl (English, Hindi, Kannada) |
| **Speech Processing** | Native Browser APIs for TTS/STT |

---

## 🧩 Smart Contract Details

The **FarmBridge Smart Contract** manages:

- `struct Farmer` and `struct Donor` for on-chain identity tracking  
- `struct AidRequest` for aid lifecycle management  
- **Mappings** for all participants and their activity logs  
- **Events** for each critical transaction (registration, verification, donation, disbursement)  
- **Modifiers** enforcing role-based access and function permissions  
- **View functions** exposing detailed statistics for UI integration  

---

## 📊 Transparency and Reputation System

- All transactions are **fully traceable** on the blockchain  
- Donors gain **reputation points** for verified disbursements  
- Farmers maintain **trust scores** after admin verification  
- Admins ensure **system integrity** and prevent abuse  

---

## 🧠 Future Enhancements

- Integration with **Polygon or Base** for lower gas fees  
- Advanced **AI fraud detection** for fake proof submissions  
- **Mobile-first UI** for rural accessibility  
- **On-chain multilingual metadata** for aid requests  

---

## 📜 License

This project is licensed under the **MIT License**.  
See the [LICENSE](LICENSE) file for more information.

## Getting Started

### Prerequisites

-   [Next.js](https://nextjs.org/)
-   [Hardhat](https://hardhat.org/) for deployment
-   [MetaMask](https://metamask.io/) or similar Ethereum wallet

### Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/MohammadArmaan/farm-bridge.git
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
    "Organic Vegetables", // Farm type
    "https://crimson-abundant-herring-795.mypinata.cloud/ipfs/0x123...", // IPFS URL
    "9999999999", // Phone Number
    "example@example.com" //Email Address
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
    "https://crimson-abundant-herring-795.mypinata.cloud/ipfs/0x123...", // IPFS URL
    "9999999999", // Phone Number
    "example@example.com" //Email Address
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
