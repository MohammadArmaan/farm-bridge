import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import path from "path";

export async function POST(request: Request) {
    try {
        const { subject, toEmail, emailBody } = await request.json();


        const transporter = nodemailer.createTransport({
            service: "gmail", 
            auth: {
                user: process.env.GMAIL_EMAIL, 
                pass: process.env.GMAIL_APP_PASSWORD, 
            },
        });


        const emailHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>FarmBridge Notification</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="border-collapse: collapse; margin: 20px auto; background-color: #ffffff; border: 1px solid #dddddd; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
            <tr>
                <td align="center" style="padding: 40px 0 30px 0; background-color: #f9f9f9; border-top-left-radius: 8px; border-top-right-radius: 8px;">
                    <img src="cid:logo" alt="FarmBridge Logo" width="100" style="display: block;" />
                    <h1 style="color: #166534; margin-top: 10px; font-size: 28px;">FarmBridge</h1>
                </td>
            </tr>
            <tr>
                <td style="padding: 40px 30px 40px 30px;">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                        <tr>
                            <td style="color: #333333; font-size: 22px;">
                                <b>${subject}</b>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding: 20px 0 30px 0; color: #555555; font-size: 16px; line-height: 1.5;">
                                <!-- The message from the form will be injected here -->
                                ${emailBody}
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                    <tr>
                                        <td align="center">
                                            <a href="https://farm-bridge-project.vercel.app" target="_blank" style="display: inline-block; padding: 14px 28px; font-size: 16px; font-weight: bold; color: #ffffff; background-color: #22c55e; text-decoration: none; border-radius: 5px;">
                                                Visit FarmBridge
                                            </a>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
            <tr>
                <td align="center" style="padding: 20px 30px; background-color: #eeeeee; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px; color: #777777; font-size: 12px;">
                    You are receiving this email as a member of the FarmBridge platform.
                    <br/>
                    &copy; 2025 FarmBridge. All rights reserved.
                </td>
            </tr>
        </table>
    </body>
    </html>
    `;

        const mailOptions = {
            from: `FarmBridge <${process.env.GMAIL_EMAIL}>`,
            to: toEmail,
            subject: subject,
            html: emailHtml,
            attachments: [
                {
                    filename: "logo.png",
                    path: path.join(process.cwd(), "public", "logo.png"),
                    cid: "logo", 
                },
            ],
        };


        await transporter.sendMail(mailOptions);

        return NextResponse.json(
            { message: "Email sent successfully!" },
            { status: 200 }
        );
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { message: "Failed to send email." },
            { status: 500 }
        );
    }
}
