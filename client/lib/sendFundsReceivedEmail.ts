export const sendFundsReceivedEmail = async ({
    farmerEmail,
    farmerName,
    requestedEth,
    fundedEth,
    isFulfilled
}: {
    farmerEmail: string;
    farmerName: string;
    requestedEth: string;
    fundedEth: string;
    isFulfilled: boolean;
}) => {
    // ✅ Validate email before sending
    if (!farmerEmail || farmerEmail.trim() === "") {
        console.error("Cannot send email: farmerEmail is empty or undefined");
        throw new Error("Farmer email is required");
    }

    const subject = isFulfilled 
        ? "🎉 Your Aid Request Has Been Fully Funded!"
        : "💰 You've Received Funding for Your Aid Request!";

    const percentFunded = ((parseFloat(fundedEth) / parseFloat(requestedEth)) * 100).toFixed(1);

    const emailBody = `
        <p>Dear ${farmerName},</p>
        
        <p>${isFulfilled 
            ? "Congratulations! Your aid request has been fully funded and the funds are now available in your wallet!" 
            : "Great news! A donor has contributed to your aid request on FarmBridge."
        }</p>
        
        <div style="background-color: #f0fdf4; border-left: 4px solid #22c55e; padding: 15px; margin: 20px 0;">
            <h3 style="color: #166534; margin-top: 0;">Funding Summary:</h3>
            <table style="width: 100%; border-collapse: collapse;">
                <tr>
                    <td style="padding: 8px 0; color: #666;"><strong>Amount Requested:</strong></td>
                    <td style="padding: 8px 0;">${requestedEth} ETH</td>
                </tr>
                <tr>
                    <td style="padding: 8px 0; color: #666;"><strong>Total Funded:</strong></td>
                    <td style="padding: 8px 0; color: #166534;"><strong>${fundedEth} ETH</strong></td>
                </tr>
                <tr>
                    <td style="padding: 8px 0; color: #666;"><strong>Funding Progress:</strong></td>
                    <td style="padding: 8px 0;">
                        <div style="background-color: #e5e7eb; border-radius: 9999px; height: 20px; width: 100%; max-width: 200px;">
                            <div style="background-color: #22c55e; height: 20px; width: ${percentFunded}%; border-radius: 9999px; text-align: center; line-height: 20px; color: white; font-size: 12px; font-weight: bold;">
                                ${percentFunded}%
                            </div>
                        </div>
                    </td>
                </tr>
                ${!isFulfilled ? `
                <tr>
                    <td style="padding: 8px 0; color: #666;"><strong>Still Needed:</strong></td>
                    <td style="padding: 8px 0; color: #f59e0b;"><strong>${(parseFloat(requestedEth) - parseFloat(fundedEth)).toFixed(4)} ETH</strong></td>
                </tr>
                ` : ''}
            </table>
        </div>

        ${isFulfilled ? `
            <div style="background-color: #dcfce7; border: 2px solid #22c55e; border-radius: 8px; padding: 20px; margin: 25px 0;">
                <h3 style="color: #166534; margin-top: 0;">✅ Request Fully Funded!</h3>
                <p style="margin-bottom: 0;">Your aid request has reached its goal! The funds have been transferred directly to your wallet address via blockchain. You can now use these funds for your agricultural needs.</p>
            </div>
        ` : `
            <div style="background-color: #fef3c7; border: 2px solid #f59e0b; border-radius: 8px; padding: 20px; margin: 25px 0;">
                <h3 style="color: #92400e; margin-top: 0;">📊 Partial Funding Received</h3>
                <p style="margin-bottom: 0;">You've received partial funding for your request. Your request remains active and visible to other donors who may contribute the remaining amount.</p>
            </div>
        `}

        <h3 style="color: #166534; margin-top: 30px;">What To Do Next:</h3>
        <ol style="line-height: 1.8; color: #555;">
            <li><strong>Check Your Wallet:</strong> The funds have been sent directly to your registered wallet address</li>
            <li><strong>Use Wisely:</strong> Utilize the funds for the purpose stated in your aid request</li>
            ${!isFulfilled ? '<li><strong>Track Progress:</strong> Monitor your request for additional funding from other donors</li>' : ''}
            <li><strong>Stay Connected:</strong> Keep your profile updated for future opportunities</li>
        </ol>

        <div style="background-color: #eff6ff; border: 1px solid #3b82f6; border-radius: 8px; padding: 20px; margin: 25px 0;">
            <h3 style="color: #1e40af; margin-top: 0;">📊 View All Requests</h3>
            <p style="margin-bottom: 15px;">Check the status of all aid requests on the platform:</p>
            <a href="https://farm-bridge-project.vercel.app/AllAids" 
               target="_blank" 
               style="display: inline-block; padding: 12px 24px; background-color: #22c55e; color: white; text-decoration: none; border-radius: 6px; font-weight: bold;">
                View All Aid Requests →
            </a>
        </div>

        <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            Thank you for being part of the FarmBridge community. We're committed to supporting your agricultural journey and connecting you with donors who believe in your work.
        </p>

        <p style="margin-top: 30px;">Best regards,<br/><strong>The FarmBridge Team</strong></p>
        
        <div style="margin-top: 30px; padding: 15px; background-color: #dbeafe; border-radius: 8px;">
            <p style="margin: 0; color: #1e40af; font-size: 14px;">
                <strong>💡 Tip:</strong> Make sure to keep detailed records of how you use these funds. Transparent reporting helps build trust with donors and increases your chances of receiving future support!
            </p>
        </div>
    `;

    try {
        const response = await fetch("/api/send-email", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                subject, 
                toEmail: farmerEmail, 
                emailBody 
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Email API error:", errorData);
            throw new Error(errorData.message || "Failed to send email");
        }
        
        return { success: true, message: "Email sent successfully" };
    } catch (error) {
        console.error("Error sending funds received email:", error);
        throw error; // Re-throw to handle in calling function
    }
};