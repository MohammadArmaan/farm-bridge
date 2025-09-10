import { ethers, formatEther, parseEther, formatEther as formatEtherUtil, BigNumberish, formatUnits, parseEther as parseEtherUtil } from "ethers";



const contractABI =  [
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "requestId",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "donor",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "farmer",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "AidFunded",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "requestId",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "farmer",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "purpose",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "AidRequested",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "donorAddress",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "name",
				"type": "string"
			}
		],
		"name": "DonorRegistered",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "donorAddress",
				"type": "address"
			}
		],
		"name": "DonorVerified",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "farmerAddress",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "location",
				"type": "string"
			}
		],
		"name": "FarmerRegistered",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "farmerAddress",
				"type": "address"
			}
		],
		"name": "FarmerVerified",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "donorAddress",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "newScore",
				"type": "uint256"
			}
		],
		"name": "ReputationUpdated",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "aidRequests",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "farmer",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "purpose",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "amountRequested",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "amountFunded",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "fulfilled",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "donorAddresses",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "donors",
		"outputs": [
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "description",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "totalDonated",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "successfulDisbursements",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "isVerified",
				"type": "bool"
			},
			{
				"internalType": "uint256",
				"name": "reputationScore",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "farmerAddresses",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "farmers",
		"outputs": [
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "location",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "farmType",
				"type": "string"
			},
			{
				"internalType": "bool",
				"name": "isVerified",
				"type": "bool"
			},
			{
				"internalType": "uint256",
				"name": "totalReceived",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "lastDisbursementDate",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_requestId",
				"type": "uint256"
			}
		],
		"name": "fundAidRequest",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getAllAidRequests",
		"outputs": [
			{
				"internalType": "uint256[]",
				"name": "ids",
				"type": "uint256[]"
			},
			{
				"internalType": "address[]",
				"name": "farmerAddressesList",
				"type": "address[]"
			},
			{
				"internalType": "string[]",
				"name": "requestNames",
				"type": "string[]"
			},
			{
				"internalType": "string[]",
				"name": "purposes",
				"type": "string[]"
			},
			{
				"internalType": "uint256[]",
				"name": "amountsRequested",
				"type": "uint256[]"
			},
			{
				"internalType": "uint256[]",
				"name": "amountsFunded",
				"type": "uint256[]"
			},
			{
				"internalType": "uint256[]",
				"name": "timestamps",
				"type": "uint256[]"
			},
			{
				"internalType": "bool[]",
				"name": "fulfilledStatuses",
				"type": "bool[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getAllDonors",
		"outputs": [
			{
				"internalType": "address[]",
				"name": "addresses",
				"type": "address[]"
			},
			{
				"internalType": "string[]",
				"name": "names",
				"type": "string[]"
			},
			{
				"internalType": "string[]",
				"name": "descriptions",
				"type": "string[]"
			},
			{
				"internalType": "bool[]",
				"name": "isVerified",
				"type": "bool[]"
			},
			{
				"internalType": "uint256[]",
				"name": "totalDonated",
				"type": "uint256[]"
			},
			{
				"internalType": "uint256[]",
				"name": "successfulDisbursements",
				"type": "uint256[]"
			},
			{
				"internalType": "uint256[]",
				"name": "reputationScores",
				"type": "uint256[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getAllFarmers",
		"outputs": [
			{
				"internalType": "address[]",
				"name": "addresses",
				"type": "address[]"
			},
			{
				"internalType": "string[]",
				"name": "names",
				"type": "string[]"
			},
			{
				"internalType": "string[]",
				"name": "locations",
				"type": "string[]"
			},
			{
				"internalType": "string[]",
				"name": "farmTypes",
				"type": "string[]"
			},
			{
				"internalType": "bool[]",
				"name": "isVerified",
				"type": "bool[]"
			},
			{
				"internalType": "uint256[]",
				"name": "totalReceived",
				"type": "uint256[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getContractStats",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "_totalDonors",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_totalBeneficiaries",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_totalFundsDistributed",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_donorAddress",
				"type": "address"
			}
		],
		"name": "getDonorStats",
		"outputs": [
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "description",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "totalDonated",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "successfulDisbursements",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "isVerified",
				"type": "bool"
			},
			{
				"internalType": "uint256",
				"name": "reputationScore",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_farmerAddress",
				"type": "address"
			}
		],
		"name": "getFarmerStats",
		"outputs": [
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "location",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "farmType",
				"type": "string"
			},
			{
				"internalType": "bool",
				"name": "isVerified",
				"type": "bool"
			},
			{
				"internalType": "uint256",
				"name": "totalReceived",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "lastDisbursementDate",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_address",
				"type": "address"
			}
		],
		"name": "isDonorRegistered",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_address",
				"type": "address"
			}
		],
		"name": "isFarmerRegistered",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_name",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_description",
				"type": "string"
			}
		],
		"name": "registerDonor",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_name",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_location",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_farmType",
				"type": "string"
			}
		],
		"name": "registerFarmer",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "registeredDonors",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "registeredFarmers",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_name",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_purpose",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "_amountRequested",
				"type": "uint256"
			}
		],
		"name": "requestAid",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "totalBeneficiaries",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "totalDonors",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "totalFundsDistributed",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_donorAddress",
				"type": "address"
			}
		],
		"name": "verifyDonor",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_farmerAddress",
				"type": "address"
			}
		],
		"name": "verifyFarmer",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
]
// Contract address - this would be the actual deployed contract address
// const contractAddress = "0x45b9c0F889Fe2Bf137d9432Fd5c5D409b1B693b6";
const contractAddress = "0x6b3a87C68f677E5880E0899646367511f04B7608";

// Global variables to store provider, signer, contract, and account
let provider: ethers.BrowserProvider | null = null;
let signer: ethers.Signer | null = null;
let contract: ethers.Contract | null = null;
let currentAccount: string | null = null;
let isOwner = false;

// Initialize ethers with browser provider (MetaMask)
const initializeEthers = async () => {
  if (typeof window === "undefined") {
    throw new Error("Not in browser environment");
  }

  if (!window.ethereum) {
    throw new Error("No Ethereum wallet detected. Please install MetaMask or another Ethereum wallet");
  }

  try {
    await window.ethereum.request({ method: "eth_requestAccounts" });

    provider = new ethers.BrowserProvider(window.ethereum);
    signer = await provider.getSigner();
    currentAccount = await signer.getAddress();

    contract = new ethers.Contract(contractAddress, contractABI, signer);

    // Check if current account is owner
    try {
      const ownerAddress = await contract.owner();
      isOwner = ownerAddress && currentAccount ? ownerAddress.toLowerCase() === currentAccount.toLowerCase() : false;
    } catch (err) {
      console.error("Error checking owner:", err);
      isOwner = false; // Default to false if the call fails
    }

    window.ethereum.on("accountsChanged", (accounts: string[]) => {
      if (accounts.length > 0) {
        currentAccount = accounts[0];
        window.location.reload();
      } else {
        currentAccount = null;
      }
    });

    return currentAccount;
  } catch (error) {
    console.error("Error initializing ethers:", error);
    throw error;
  }
};

// Connect wallet
export const connectWallet = async (): Promise<string> => {
  try {
    const account = await initializeEthers();
    return account || "";
  } catch (error) {
    console.error("Error connecting wallet:", error);
    throw error;
  }
};

// Check if wallet is connected
export const isWalletConnected = async (): Promise<boolean> => {
  if (typeof window === "undefined") return false;

  if (!window.ethereum) return false;

  try {
    const accounts = await window.ethereum.request({ method: "eth_accounts" });
    if (accounts.length > 0) {
      currentAccount = accounts[0];

      // Initialize ethers if not already initialized
      if (!provider) {
        provider = new ethers.BrowserProvider(window.ethereum);
        signer = await provider.getSigner();
        contract = new ethers.Contract(contractAddress, contractABI, signer);

        // Check if current account is owner
        try {
          const ownerAddress = await contract.owner();
          isOwner = ownerAddress && currentAccount ? ownerAddress.toLowerCase() === currentAccount.toLowerCase() : false;
        } catch (err) {
          console.error("Error checking owner:", err);
          isOwner = false;
        }
      }

      return true;
    }
    return false;
  } catch (error) {
    console.error("Error checking wallet connection:", error);
    return false;
  }
};

// Add helper functions for accessing contract data
export const getContractInstance = () => {
  if (!contract) {
    throw new Error("Contract not initialized. Please connect wallet first.");
  }
  return contract;
};

// export const getCurrentAccount = () => {
//   return currentAccount;
// };

export const getIsOwner = () => {
  return isOwner;
};

// Add window ethereum type declaration
declare global {
  interface Window {
    ethereum: any;
  }
}
// Get current account
export const getCurrentAccount = (): string | null => {
  return currentAccount
}

// Check if current account is owner
export const isAccountOwner = (): boolean => {
  return isOwner
}

// Check if user is registered as donor
export const isDonorRegistered = async (address: string): Promise<boolean> => {
  if (!contract) await initializeEthers().catch(() => null)
  try {
    return await contract?.registeredDonors(address)
  } catch (error) {
    console.error("Error checking if registered as donor:", error)
    // For demo purposes, return mock data
    return Math.random() > 0.5
  }
}

// Check if user is registered as farmer
export const isFarmerRegistered = async (address: string): Promise<boolean> => {
  if (!contract) await initializeEthers().catch(() => null)
  try {
    return await contract?.registeredFarmers(address)
  } catch (error) {
    console.error("Error checking if registered as farmer:", error)
    // For demo purposes, return mock data
    return Math.random() > 0.5
  }
}

// Register a donor
export const registerDonor = async (name: string, description: string): Promise<void> => {
  if (!contract) await initializeEthers()
  try {
    const tx = await contract?.registerDonor(name, description)
    await tx.wait()
    console.log("Registered donor:", { name, description })
  } catch (error) {
    console.error("Error registering donor:", error)
    throw error
  }
}

// Register a farmer
export const registerFarmer = async (name: string, location: string, farmType: string): Promise<void> => {
  if (!contract) await initializeEthers()
  try {
    if (!contract) {
      throw new Error("Contract is not initialized. Please connect wallet first.");
    }
    const tx = await contract.registerFarmer(name, location, farmType);
    await tx.wait()
    console.log("Registered farmer:", { name, location, farmType })
  } catch (error) {
    console.error("Error registering farmer:", error)
    throw error
  }
}

// Get contract statistics
export const getContractStats = async (): Promise<any> => {
	if (!contract) await initializeEthers().catch(() => null)
	try {
	  const stats = await contract?.getContractStats()
  
	  // Log structure if you're debugging
	  console.log("Contract stats:", stats)
  
	  return {
		totalDonors: Number(stats?._totalDonors || 0),
		totalBeneficiaries: Number(stats?._totalBeneficiaries || 0),
		totalFundsDistributed: parseFloat(ethers.formatEther(stats?._totalFundsDistributed || 0)),
	  }
	} catch (error) {
	  console.error("Error getting contract stats:", error)
	  return {
		totalDonors: 124,
		totalBeneficiaries: 356,
		totalFundsDistributed: 1250000,
	  }
	}
  }
  

// Get donor statistics
export const getDonorStats = async (address: string): Promise<any> => {
  if (!contract) await initializeEthers().catch(() => null);

  try {
    if (!ethers.isAddress(address)) {
      throw new Error(`Invalid address: ${address}`);
    }

    const stats = await contract?.getDonorStats(address);

    return {
      name: stats?.name || "",
      description: stats?.description || "",
      totalDonated: Number.parseFloat(
        ethers.formatEther(stats?.totalDonated || 0)
      ),
      successfulDisbursements: stats?.successfulDisbursements.toNumber() || 0,
      isVerified: stats?.isVerified || false,
      reputationScore: stats?.reputationScore.toNumber() || 0,
    };
  } catch (error) {
    console.error("Error getting donor stats:", error);
    return {
      name: "Acme Foundation",
      description: "Supporting sustainable agriculture worldwide",
      totalDonated: 5.75,
      successfulDisbursements: 12,
      isVerified: true,
      reputationScore: 85,
    };
  }
};

// Get Global Donor Stats
export const getGlobalDonorStats = async (): Promise<{
  totalDisbursements: number;
  totalMoneyDonated: number;
  totalDonors: number;
}> => {
  try {
    const donors = await getDonors(); // returns array with { address, totalDonated, successfulDisbursements, ... }

    if (!Array.isArray(donors) || donors.length === 0) {
      return { totalDisbursements: 0, totalMoneyDonated: 0, totalDonors: 0 };
    }

    let totalDisbursements = 0;
    let totalMoneyDonated = 0;

    for (const d of donors) {
      // totalDonated might be a string (ethers.formatEther) or number
      const donated =
        typeof d.totalDonated === "string"
          ? parseFloat(d.totalDonated) || 0
          : Number(d.totalDonated) || 0;

      const disb = Number(d.successfulDisbursements) || 0;

      totalMoneyDonated += donated;
      totalDisbursements += disb;
    }

    return {
      totalDisbursements,
      totalMoneyDonated,
      totalDonors: donors.length,
    };
  } catch (error) {
    console.error("Error computing global donor stats:", error);
    return { totalDisbursements: 0, totalMoneyDonated: 0, totalDonors: 0 };
  }
};

  

// Get farmer statistics
export const getFarmerStats = async (address: string): Promise<any> => {
  if (!contract) await initializeEthers().catch(() => null)
  try {
    const stats = await contract?.getFarmerStats(address)
    return {
      name: stats?.name || "",
      location: stats?.location || "",
      farmType: stats?.farmType || "",
      isVerified: stats?.isVerified || false,
      totalReceived: Number.parseFloat(ethers.formatEther(stats?.totalReceived || 0)),
      lastDisbursementDate: stats?.lastDisbursementDate.toNumber() || 0,
    }
  } catch (error) {
    console.error("Error getting farmer stats:", error)
    // For demo purposes, return mock data
    return {
      name: "John Smith",
      location: "Nairobi, Kenya",
      farmType: "Organic Vegetables",
      isVerified: true,
      totalReceived: 1.25,
      lastDisbursementDate: Date.now() / 1000 - 86400 * 7, // 7 days ago
    }
  }
}

// Get donor disbursements
export const getDonorDisbursements = async (address: string): Promise<number[]> => {
  if (!contract) await initializeEthers().catch(() => null)
  try {
    const disbIds = await contract?.getDonorDisbursements(address)
    return disbIds.map((id: any) => id.toNumber())
  } catch (error) {
    console.error("Error getting donor disbursements:", error)
    // For demo purposes, return mock data
    return [1, 2, 3]
  }
}

// Get farmer disbursements
export const getFarmerDisbursements = async (address: string): Promise<number[]> => {
  if (!contract) await initializeEthers().catch(() => null)
  try {
    const disbIds = await contract?.getFarmerDisbursements(address)
    return disbIds.map((id: any) => id.toNumber())
  } catch (error) {
    console.error("Error getting farmer disbursements:", error)
    // For demo purposes, return mock data
    return [1, 2]
  }
}

// Get disbursement details
export const getDisbursementDetails = async (id: number): Promise<any> => {
  if (!contract) await initializeEthers().catch(() => null)
  try {
    const details = await contract?.getDisbursementDetails(id)
    return {
      id: details?.id.toNumber(),
      donor: details?.donor,
      farmer: details?.farmer,
      amount: Number.parseFloat(ethers.formatEther(details?.amount || 0)),
      timestamp: details?.timestamp.toNumber(),
      purpose: details?.purpose,
      claimed: details?.claimed,
      claimDeadline: details?.claimDeadline.toNumber(),
    }
  } catch (error) {
    console.error("Error getting disbursement details:", error)
    // For demo purposes, return mock data based on ID
    const now = Date.now() / 1000

    if (id === 1) {
      return {
        id: 1,
        donor: "0x789abc...",
        farmer: "0x123def...",
        amount: 0.5,
        timestamp: now - 86400, // 1 day ago
        purpose: "Purchase of organic seeds",
        claimed: false,
        claimDeadline: now + 86400 * 6, // 6 days from now
      }
    } else if (id === 2) {
      return {
        id: 2,
        donor: "0x789abc...",
        farmer: "0x456ghi...",
        amount: 0.75,
        timestamp: now - 86400 * 2, // 2 days ago
        purpose: "Irrigation system upgrade",
        claimed: true,
        claimDeadline: now + 86400 * 12, // 12 days from now
      }
    } else {
      return {
        id: 3,
        donor: "0x789abc...",
        farmer: "0x789jkl...",
        amount: 0.3,
        timestamp: now - 86400 * 5, // 5 days ago
        purpose: "Sustainable farming training",
        claimed: false,
        claimDeadline: now - 86400, // 1 day ago (expired)
      }
    }
  }
}

// Create a disbursement
export const createDisbursement = async (
  farmerAddress: string,
  purpose: string,
  claimDeadlineDays: number,
  amount: number,
): Promise<void> => {
  if (!contract) await initializeEthers()
  try {
    const amountWei = ethers.parseEther(amount.toString())
    const tx = await contract?.createDisbursement(farmerAddress, purpose, claimDeadlineDays, {
      value: amountWei,
    })
    await tx.wait()
    console.log("Created disbursement:", { farmerAddress, purpose, claimDeadlineDays, amount })
  } catch (error) {
    console.error("Error creating disbursement:", error)
    throw error
  }
}
// Claim funds
export const claimFunds = async (disbursementId: number): Promise<void> => {
  if (!contract) await initializeEthers()
  try {
    const tx = await contract?.claimFunds(disbursementId)
    await tx.wait()
    console.log("Claimed funds for disbursement:", disbursementId)
  } catch (error) {
    console.error("Error claiming funds:", error)
    throw error
  }
}

// Reclaim expired funds
export const reclaimExpiredFunds = async (disbursementId: number): Promise<void> => {
  if (!contract) await initializeEthers()
  try {
    const tx = await contract?.reclaimExpiredFunds(disbursementId)
    await tx.wait()
    console.log("Reclaimed expired funds for disbursement:", disbursementId)
  } catch (error) {
    console.error("Error reclaiming expired funds:", error)
    throw error
  }
}

// Verify farmer (owner only)
export const verifyFarmer = async (farmerAddress: string): Promise<void> => {
  if (!contract) await initializeEthers()
  try {
    const tx = await contract?.verifyFarmer(farmerAddress)
    await tx.wait()
    console.log("Verified farmer:", farmerAddress)
  } catch (error) {
    console.error("Error verifying farmer:", error)
    throw error
  }
}

// Verify donor (owner only)
export const verifyDonor = async (donorAddress: string): Promise<void> => {
  if (!contract) await initializeEthers()
  try {
    const tx = await contract?.verifyDonor(donorAddress)
    await tx.wait()
    console.log("Verified donor:", donorAddress)
  } catch (error) {
    console.error("Error verifying donor:", error)
    throw error
  }
}


// Get list of farmers
export const getFarmers = async (): Promise<any[]> => {
	try {
	  if (!contract) await initializeEthers();
  
	  const result = await contract!.getAllFarmers();
  
	  if (!Array.isArray(result) || result.length < 6) {
		throw new Error("Unexpected return format from getAllFarmers");
	  }
  
	  const [addresses, names, locations, farmTypes, isVerified, totalReceived] = result;
  
	  const farmers = addresses.map((address: string, index: number) => ({
		address,
		name: names[index],
		location: locations[index],
		farmType: farmTypes[index],
		isVerified: isVerified[index],
		totalReceived: ethers.formatEther(totalReceived[index].toString()) // Ensure BigInt to string
	  }));
  
	  return farmers;
	} catch (error) {
	  console.error("Error fetching farmers:", error);
	  return [];
	}
  };
  
  

  

// Get list of donors
export const getDonors = async (): Promise<any[]> => {
  try {
    if (!contract) await initializeEthers();

    const result = await contract!.getAllDonors();

    // Match the exact order from Solidity
    const [
      addresses,
      names,
      descriptions,
      isVerified,
      totalDonated,
      successfulDisbursements,
      reputationScores
    ] = result;

    const donors = addresses.map((address: string, index: number) => ({
      address,
      name: names[index],
      description: descriptions[index],
      isVerified: isVerified[index],
      totalDonated: ethers.formatEther(totalDonated[index]),
      successfulDisbursements: Number(successfulDisbursements[index]),
      reputationScore: Number(reputationScores[index])
    }));

    return donors;
  } catch (error) {
    console.error("Error fetching donors:", error);
    return [];
  }
};

export interface AidRequest {
	id: number;
	farmer: string;
	name: string;
	purpose: string;
	amountRequested: string;
	amountFunded: string;
	timestamp: number;
	fulfilled: boolean;
	percentFunded: number;
  }

  export const checkIsFarmer = async (address: string): Promise<boolean> => {
	try {
		if (!contract) await initializeEthers();
	  return await contract!.isFarmerRegistered(address);
	} catch (error) {
	  console.error("Error checking farmer status:", error);
	  return false;
	}
  };
  
  // Check if user is registered as donor
  export const checkIsDonor = async (address: string): Promise<boolean> => {
	try {
		if (!contract) await initializeEthers();
	  return await contract!.isDonorRegistered(address);
	} catch (error) {
	  console.error("Error checking donor status:", error);
	  return false;
	}
  };
  
 
  
  // Create new aid request
  export const requestAid = async (name: string, purpose: string, amountEth: string): Promise<void> => {
	try {
		if (!contract) await initializeEthers();
	  const amountInWei = ethers.parseEther(amountEth);
	  const tx = await contract!.requestAid(name, purpose, amountInWei);
	  await tx.wait();
	} catch (error) {
	  console.error("Error creating aid request:", error);
	  throw error;
	}
  };
  
  // Fund an aid request
//   export const fundAidRequest = async (requestId: number): Promise<void> => {
// 	try {
// 	//   const amountInWei = parseEther(amountEth);
// 	  const tx = await contract!.fundAidRequest(requestId);
// 	  await tx.wait();
// 	} catch (error) {
// 	  console.error("Error funding aid request:", error);
// 	  throw error;
// 	}
//   };


  export async function fundAidRequest(requestId: number, amount: string): Promise<boolean> {
	try {
	  
		if(!contract) await initializeEthers();
	  
	  // Convert ETH amount to wei
	  const amountInWei = parseEtherUtil(amount);
	  
	  // Call the fundAidRequest function with the value in the transaction
	  const tx = await contract!.fundAidRequest(requestId, {
		value: amountInWei,  // This sends ETH with the transaction
		gasLimit: 300000     // Optional: You can set gas limit
	  });
	  
	  // Wait for transaction to be mined
	  await tx.wait();
	  
	  console.log('Aid request funded successfully', tx.hash);
	  return true;
	} catch (error) {
	  console.error('Error funding aid request:', error);
	  throw error;
	}
  }
  
  // Get all aid requests
  export async function getAllAidRequests() {
	try {
		if (!contract) await initializeEthers();
	  const result = await contract!.getAllAidRequests();
	  
	  // Extract the arrays from the result
	  const { 
		ids, 
		farmerAddressesList, 
		requestNames, 
		purposes, 
		amountsRequested, 
		amountsFunded, 
		timestamps, 
		fulfilledStatuses 
	  } = result;
	  
	  // Format the results into an array of objects
	  const formattedRequests = [];
	  for (let i = 0; i < ids.length; i++) {
		// Ensure we're handling BigNumber objects correctly
		const requestId = ids[i].toNumber ? ids[i].toNumber() : Number(ids[i]);
		const requestTimestamp = timestamps[i].toNumber ? 
		  timestamps[i].toNumber() * 1000 : Number(timestamps[i]) * 1000;
		
		let requestedAmount, fundedAmount;
		
		// Handle different ways the amounts might be returned
		try {
		  // If it's a BigNumber object from ethers
		  requestedAmount = formatEther(amountsRequested[i]);
		  fundedAmount = formatEther(amountsFunded[i]);
		} catch (e) {
		  // If it's a string or number
		  requestedAmount = formatUnits(
			amountsRequested[i].toString(), 
			'ether'
		  );
		  fundedAmount = formatUnits(
			amountsFunded[i].toString(), 
			'ether'
		  );
		}
		
		formattedRequests.push({
		  id: requestId,
		  farmer: farmerAddressesList[i],
		  name: requestNames[i],
		  purpose: purposes[i],
		  amountRequested: requestedAmount,
		  amountFunded: fundedAmount,
		  timestamp: new Date(requestTimestamp),
		  fulfilled: fulfilledStatuses[i]
		});
	  }
	  
	  return formattedRequests;
	} catch (error) {
	  console.error("Error fetching aid requests:", error);
	  return []; // Return empty array on error
	}
  }
  export async function getFarmerDetails(address: string) {
	try {
		if (!contract) await initializeEthers();
	  const farmerData = await contract!.getFarmerStats(address);
	  return {
		name: farmerData[0],
		location: farmerData[1],
		farmType: farmerData[2],
		isVerified: farmerData[3],
		totalReceived: farmerData[4],
		lastDisbursementDate: farmerData[5],
	  };
	} catch (error) {
	  console.error("Error fetching farmer details:", error);
	  return null;
	}
  }


  // Helper functions
  export const formatDate = (timestamp: number): string => {
	return new Date(timestamp * 1000).toLocaleDateString();
  };
  
// Helper function to truncate Ethereum addresses
export function truncateAddress(address: string): string {
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
}