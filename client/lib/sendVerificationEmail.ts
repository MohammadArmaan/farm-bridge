export async function sendVerificationEmail (
    email: string,
    name: string,
    type: "donor" | "farmer"
)  {
    const subject = type === "donor" 
        ? "🎉 Your Donor Account Has Been Verified!"
        : "🎉 Your Farmer Account Has Been Verified!";

    const emailBody = type === "donor"
        ? `
            <p>Dear ${name},</p>
            <p>Great news! Your donor account on FarmBridge has been successfully verified by our admin team.</p>
            <h3 style="color: #166534; margin-top: 20px;">What's Next?</h3>
            <p>You can now:</p>
            <ul style="line-height: 1.8;">
                <li><strong>Create Disbursements:</strong> Support verified farmers directly</li>
                <li><strong>Fund Aid Requests:</strong> Browse and fund agricultural aid requests</li>
                <li><strong>Track Your Impact:</strong> Monitor your donations through blockchain transparency</li>
                <li><strong>Build Your Reputation:</strong> Gain reputation points with successful disbursements</li>
            </ul>
            <p style="margin-top: 20px;">Thank you for being part of our mission to empower small farmers worldwide. Your support makes a real difference!</p>
            <p style="margin-top: 30px;">Best regards,<br/><strong>The FarmBridge Team</strong></p>
        `
        : `
            <p>Dear ${name},</p>
            <p>Congratulations! Your farmer account on FarmBridge has been successfully verified by our admin team.</p>
            <h3 style="color: #166534; margin-top: 20px;">What's Next?</h3>
            <p>You can now:</p>
            <ul style="line-height: 1.8;">
                <li><strong>Request Aid:</strong> Create aid requests for your farming needs</li>
                <li><strong>Receive Direct Support:</strong> Get funding directly from verified donors</li>
                <li><strong>Claim Funds:</strong> Access disbursements sent to you securely via blockchain</li>
                <li><strong>Build Trust:</strong> Connect with donors who want to support your agricultural journey</li>
            </ul>
            <p style="margin-top: 20px;">We're excited to support your farming journey and help you grow. Welcome to the FarmBridge community!</p>
            <p style="margin-top: 30px;">Best regards,<br/><strong>The FarmBridge Team</strong></p>
        `;

    try {
        const response = await fetch("/api/send-email", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ subject, toEmail: email, emailBody }),
        });

        if (!response.ok) {
            throw new Error("Failed to send email");
        }
        
        return true;
    } catch (error) {
        console.error("Error sending verification email:", error);
        return false;
    }
};