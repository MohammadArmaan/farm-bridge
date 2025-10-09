import { NextResponse } from "next/server";
import axios from "axios";
import crypto from "crypto";

export async function POST(req: Request) {
    try {
        const { phone } = await req.json();

        const otp = crypto.randomInt(100000, 999999).toString();

        // Custom OTP message
        const message = `Your OTP is ${otp}. It will expire in 5 minutes.`;

        const response = await axios.post(
            "https://www.fast2sms.com/dev/bulkV2",
            {
                route: "q", // Quick message route (works without DLT)
                message,
                language: "english",
                numbers: phone,
            },
            {
                headers: {
                    authorization: process.env.FAST2SMS_API_KEY!,
                    "Content-Type": "application/json",
                },
            }
        );


        return NextResponse.json({ ...response.data, otp }, { status: 200 });
    } catch (err: any) {
        console.error("Send OTP Error:", err.response?.data || err.message);
        return NextResponse.json(
            { error: err.response?.data || err.message },
            { status: 500 }
        );
    }
}
