"use client";

import axios from "axios";

export async function uploadToPinata(file: File) {
    const url = "https://api.pinata.cloud/pinning/pinFileToIPFS";

    const formData = new FormData();
    formData.append("file", file);

    const res = await axios.post(url, formData, {
        maxBodyLength: Infinity,
        headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}`,
            "Content-Type": `multipart/form-data`,
        },
    });

    return {
        cid: res.data.IpfsHash,
        url: `https://crimson-abundant-herring-795.mypinata.cloud/ipfs/${res.data.IpfsHash}`,
    };
}
