export const contractABI = [
    {
        inputs: [],
        stateMutability: "nonpayable",
        type: "constructor",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "uint256",
                name: "requestId",
                type: "uint256",
            },
            {
                indexed: true,
                internalType: "address",
                name: "donor",
                type: "address",
            },
            {
                indexed: true,
                internalType: "address",
                name: "farmer",
                type: "address",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "amount",
                type: "uint256",
            },
        ],
        name: "AidFunded",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "uint256",
                name: "requestId",
                type: "uint256",
            },
            {
                indexed: true,
                internalType: "address",
                name: "farmer",
                type: "address",
            },
            {
                indexed: false,
                internalType: "string",
                name: "name",
                type: "string",
            },
            {
                indexed: false,
                internalType: "string",
                name: "purpose",
                type: "string",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "amount",
                type: "uint256",
            },
        ],
        name: "AidRequested",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "donorAddress",
                type: "address",
            },
            {
                indexed: false,
                internalType: "string",
                name: "name",
                type: "string",
            },
            {
                indexed: false,
                internalType: "string",
                name: "email",
                type: "string",
            },
            {
                indexed: false,
                internalType: "string",
                name: "ipfs",
                type: "string",
            },
            {
                indexed: false,
                internalType: "string",
                name: "phoneNo",
                type: "string",
            },
        ],
        name: "DonorRegistered",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "donorAddress",
                type: "address",
            },
        ],
        name: "DonorVerified",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "farmerAddress",
                type: "address",
            },
            {
                indexed: false,
                internalType: "string",
                name: "name",
                type: "string",
            },
            {
                indexed: false,
                internalType: "string",
                name: "location",
                type: "string",
            },
            {
                indexed: false,
                internalType: "string",
                name: "email",
                type: "string",
            },
            {
                indexed: false,
                internalType: "string",
                name: "ipfs",
                type: "string",
            },
            {
                indexed: false,
                internalType: "string",
                name: "phoneNo",
                type: "string",
            },
        ],
        name: "FarmerRegistered",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "farmerAddress",
                type: "address",
            },
        ],
        name: "FarmerVerified",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "donorAddress",
                type: "address",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "newScore",
                type: "uint256",
            },
        ],
        name: "ReputationUpdated",
        type: "event",
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256",
            },
        ],
        name: "aidRequests",
        outputs: [
            {
                internalType: "uint256",
                name: "id",
                type: "uint256",
            },
            {
                internalType: "address",
                name: "farmer",
                type: "address",
            },
            {
                internalType: "string",
                name: "name",
                type: "string",
            },
            {
                internalType: "string",
                name: "purpose",
                type: "string",
            },
            {
                internalType: "uint256",
                name: "amountRequested",
                type: "uint256",
            },
            {
                internalType: "uint256",
                name: "amountFunded",
                type: "uint256",
            },
            {
                internalType: "uint256",
                name: "timestamp",
                type: "uint256",
            },
            {
                internalType: "bool",
                name: "fulfilled",
                type: "bool",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256",
            },
        ],
        name: "donorAddresses",
        outputs: [
            {
                internalType: "address",
                name: "",
                type: "address",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "",
                type: "address",
            },
        ],
        name: "donors",
        outputs: [
            {
                internalType: "string",
                name: "name",
                type: "string",
            },
            {
                internalType: "string",
                name: "description",
                type: "string",
            },
            {
                internalType: "uint256",
                name: "totalDonated",
                type: "uint256",
            },
            {
                internalType: "uint256",
                name: "successfulDisbursements",
                type: "uint256",
            },
            {
                internalType: "bool",
                name: "isVerified",
                type: "bool",
            },
            {
                internalType: "bool",
                name: "isOtpVerified",
                type: "bool",
            },
            {
                internalType: "string",
                name: "phoneNo",
                type: "string",
            },
            {
                internalType: "string",
                name: "email",
                type: "string",
            },
            {
                internalType: "string",
                name: "ipfs",
                type: "string",
            },
            {
                internalType: "uint256",
                name: "reputationScore",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256",
            },
        ],
        name: "farmerAddresses",
        outputs: [
            {
                internalType: "address",
                name: "",
                type: "address",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "",
                type: "address",
            },
        ],
        name: "farmers",
        outputs: [
            {
                internalType: "string",
                name: "name",
                type: "string",
            },
            {
                internalType: "string",
                name: "location",
                type: "string",
            },
            {
                internalType: "string",
                name: "farmType",
                type: "string",
            },
            {
                internalType: "string",
                name: "phoneNo",
                type: "string",
            },
            {
                internalType: "string",
                name: "email",
                type: "string",
            },
            {
                internalType: "bool",
                name: "isVerified",
                type: "bool",
            },
            {
                internalType: "bool",
                name: "isOtpVerified",
                type: "bool",
            },
            {
                internalType: "string",
                name: "ipfs",
                type: "string",
            },
            {
                internalType: "uint256",
                name: "totalReceived",
                type: "uint256",
            },
            {
                internalType: "uint256",
                name: "lastDisbursementDate",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "_requestId",
                type: "uint256",
            },
        ],
        name: "fundAidRequest",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [],
        name: "getAllAidRequests",
        outputs: [
            {
                internalType: "uint256[]",
                name: "ids",
                type: "uint256[]",
            },
            {
                internalType: "address[]",
                name: "farmerAddressesList",
                type: "address[]",
            },
            {
                internalType: "string[]",
                name: "requestNames",
                type: "string[]",
            },
            {
                internalType: "string[]",
                name: "purposes",
                type: "string[]",
            },
            {
                internalType: "uint256[]",
                name: "amountsRequested",
                type: "uint256[]",
            },
            {
                internalType: "uint256[]",
                name: "amountsFunded",
                type: "uint256[]",
            },
            {
                internalType: "uint256[]",
                name: "timestamps",
                type: "uint256[]",
            },
            {
                internalType: "bool[]",
                name: "fulfilledStatuses",
                type: "bool[]",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "getAllDonors",
        outputs: [
            {
                internalType: "address[]",
                name: "addresses",
                type: "address[]",
            },
            {
                internalType: "string[]",
                name: "names",
                type: "string[]",
            },
            {
                internalType: "string[]",
                name: "descriptions",
                type: "string[]",
            },
            {
                internalType: "bool[]",
                name: "isVerified",
                type: "bool[]",
            },
            {
                internalType: "string[]",
                name: "email",
                type: "string[]",
            },
            {
                internalType: "string[]",
                name: "phoneNo",
                type: "string[]",
            },
            {
                internalType: "string[]",
                name: "ipfs",
                type: "string[]",
            },
            {
                internalType: "uint256[]",
                name: "totalDonated",
                type: "uint256[]",
            },
            {
                internalType: "uint256[]",
                name: "successfulDisbursements",
                type: "uint256[]",
            },
            {
                internalType: "uint256[]",
                name: "reputationScores",
                type: "uint256[]",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "getAllFarmers",
        outputs: [
            {
                internalType: "address[]",
                name: "addresses",
                type: "address[]",
            },
            {
                internalType: "string[]",
                name: "names",
                type: "string[]",
            },
            {
                internalType: "string[]",
                name: "locations",
                type: "string[]",
            },
            {
                internalType: "string[]",
                name: "farmTypes",
                type: "string[]",
            },
            {
                internalType: "string[]",
                name: "email",
                type: "string[]",
            },
            {
                internalType: "string[]",
                name: "phoneNo",
                type: "string[]",
            },
            {
                internalType: "string[]",
                name: "ipfs",
                type: "string[]",
            },
            {
                internalType: "bool[]",
                name: "isVerified",
                type: "bool[]",
            },
            {
                internalType: "uint256[]",
                name: "totalReceived",
                type: "uint256[]",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "getContractStats",
        outputs: [
            {
                internalType: "uint256",
                name: "_totalDonors",
                type: "uint256",
            },
            {
                internalType: "uint256",
                name: "_totalBeneficiaries",
                type: "uint256",
            },
            {
                internalType: "uint256",
                name: "_totalFundsDistributed",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "_donorAddress",
                type: "address",
            },
        ],
        name: "getDonorStats",
        outputs: [
            {
                internalType: "string",
                name: "name",
                type: "string",
            },
            {
                internalType: "string",
                name: "description",
                type: "string",
            },
            {
                internalType: "uint256",
                name: "totalDonated",
                type: "uint256",
            },
            {
                internalType: "uint256",
                name: "successfulDisbursements",
                type: "uint256",
            },
            {
                internalType: "bool",
                name: "isVerified",
                type: "bool",
            },
            {
                internalType: "uint256",
                name: "reputationScore",
                type: "uint256",
            },
            {
                internalType: "string",
                name: "email",
                type: "string",
            },
            {
                internalType: "string",
                name: "phoneNo",
                type: "string",
            },
            {
                internalType: "string",
                name: "ipfs",
                type: "string",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "_farmerAddress",
                type: "address",
            },
        ],
        name: "getFarmerStats",
        outputs: [
            {
                internalType: "string",
                name: "name",
                type: "string",
            },
            {
                internalType: "string",
                name: "location",
                type: "string",
            },
            {
                internalType: "string",
                name: "farmType",
                type: "string",
            },
            {
                internalType: "bool",
                name: "isVerified",
                type: "bool",
            },
            {
                internalType: "uint256",
                name: "totalReceived",
                type: "uint256",
            },
            {
                internalType: "uint256",
                name: "lastDisbursementDate",
                type: "uint256",
            },
            {
                internalType: "string",
                name: "email",
                type: "string",
            },
            {
                internalType: "string",
                name: "phoneNo",
                type: "string",
            },
            {
                internalType: "string",
                name: "ipfs",
                type: "string",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "_address",
                type: "address",
            },
        ],
        name: "isDonorRegistered",
        outputs: [
            {
                internalType: "bool",
                name: "",
                type: "bool",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "_address",
                type: "address",
            },
        ],
        name: "isFarmerRegistered",
        outputs: [
            {
                internalType: "bool",
                name: "",
                type: "bool",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "owner",
        outputs: [
            {
                internalType: "address",
                name: "",
                type: "address",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "string",
                name: "_name",
                type: "string",
            },
            {
                internalType: "string",
                name: "_description",
                type: "string",
            },
            {
                internalType: "string",
                name: "_ipfs",
                type: "string",
            },
            {
                internalType: "string",
                name: "_phoneNo",
                type: "string",
            },
            {
                internalType: "string",
                name: "_email",
                type: "string",
            },
        ],
        name: "registerDonor",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "string",
                name: "_name",
                type: "string",
            },
            {
                internalType: "string",
                name: "_location",
                type: "string",
            },
            {
                internalType: "string",
                name: "_farmType",
                type: "string",
            },
            {
                internalType: "string",
                name: "_ipfs",
                type: "string",
            },
            {
                internalType: "string",
                name: "_phoneNo",
                type: "string",
            },
            {
                internalType: "string",
                name: "_email",
                type: "string",
            },
        ],
        name: "registerFarmer",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "",
                type: "address",
            },
        ],
        name: "registeredDonors",
        outputs: [
            {
                internalType: "bool",
                name: "",
                type: "bool",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "",
                type: "address",
            },
        ],
        name: "registeredFarmers",
        outputs: [
            {
                internalType: "bool",
                name: "",
                type: "bool",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "string",
                name: "_name",
                type: "string",
            },
            {
                internalType: "string",
                name: "_purpose",
                type: "string",
            },
            {
                internalType: "uint256",
                name: "_amountRequested",
                type: "uint256",
            },
        ],
        name: "requestAid",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [],
        name: "totalBeneficiaries",
        outputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "totalDonors",
        outputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "totalFundsDistributed",
        outputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "_donorAddress",
                type: "address",
            },
        ],
        name: "verifyDonor",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "_farmerAddress",
                type: "address",
            },
        ],
        name: "verifyFarmer",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
];
