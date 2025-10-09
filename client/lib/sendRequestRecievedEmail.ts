export const sendAidRequestConfirmationEmail = async (
    farmerEmail: string,
    farmerName: string,
    requestDetails: {
        requestName: string;
        purpose: string;
        amountRequested: string;
        requestId?: number;
    }
) => {
    const subject = "✅ Your Aid Request Has Been Submitted Successfully!";

    const emailBody = `
        <p>Dear ${farmerName},</p>
        
        <p>Great news! Your aid request has been successfully submitted on FarmBridge and is now visible to all verified donors on our platform.</p>
        
        <div style="background-color: #f0fdf4; border-left: 4px solid #22c55e; padding: 15px; margin: 20px 0;">
            <h3 style="color: #166534; margin-top: 0;">Request Details:</h3>
            <table style="width: 100%; border-collapse: collapse;">
                <tr>
                    <td style="padding: 8px 0; color: #666;"><strong>Request Name:</strong></td>
                    <td style="padding: 8px 0;">${requestDetails.requestName}</td>
                </tr>
                <tr>
                    <td style="padding: 8px 0; color: #666;"><strong>Purpose:</strong></td>
                    <td style="padding: 8px 0;">${requestDetails.purpose}</td>
                </tr>
                <tr>
                    <td style="padding: 8px 0; color: #666;"><strong>Amount Requested:</strong></td>
                    <td style="padding: 8px 0; color: #166534;"><strong>${requestDetails.amountRequested} ETH</strong></td>
                </tr>
                ${requestDetails.requestId !== undefined ? `
                <tr>
                    <td style="padding: 8px 0; color: #666;"><strong>Request ID:</strong></td>
                    <td style="padding: 8px 0;">#${requestDetails.requestId}</td>
                </tr>
                ` : ''}
            </table>
        </div>

        <h3 style="color: #166534; margin-top: 30px;">What Happens Next?</h3>
        <ol style="line-height: 1.8; color: #555;">
            <li><strong>Donor Review:</strong> Verified donors can now view your request and choose to support you</li>
            <li><strong>Direct Funding:</strong> Donors will send funds directly to your wallet address via blockchain</li>
            <li><strong>Real-Time Updates:</strong> You'll receive notifications when donors fund your request</li>
            <li><strong>Track Progress:</strong> Monitor your funding progress in real-time</li>
        </ol>

        <div style="background-color: #eff6ff; border: 1px solid #3b82f6; border-radius: 8px; padding: 20px; margin: 25px 0;">
            <h3 style="color: #1e40af; margin-top: 0;">📊 View Your Request</h3>
            <p style="margin-bottom: 15px;">You can view and track your aid request at any time:</p>
            <a href="https://farm-bridge-project.vercel.app/AllAids" 
               target="_blank" 
               style="display: inline-block; padding: 12px 24px; background-color: #22c55e; color: white; text-decoration: none; border-radius: 6px; font-weight: bold;">
                View All Aid Requests →
            </a>
        </div>

        <h3 style="color: #166534; margin-top: 30px;">Tips for Success:</h3>
        <ul style="line-height: 1.8; color: #555;">
            <li>Be patient - donors carefully review each request</li>
            <li>Ensure your profile is complete with accurate farming information</li>
            <li>Keep your wallet secure and ready to receive funds</li>
            <li>Check your email regularly for funding notifications</li>
        </ul>

        <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            We're committed to supporting your agricultural journey. If you have any questions or need assistance, please don't hesitate to reach out to our support team.
        </p>

        <p style="margin-top: 30px;">Best regards,<br/><strong>The FarmBridge Team</strong></p>
        
        <div style="margin-top: 30px; padding: 15px; background-color: #fef3c7; border-radius: 8px;">
            <p style="margin: 0; color: #92400e; font-size: 14px;">
                <strong>💡 Pro Tip:</strong> Requests with clear, detailed purposes tend to get funded faster. Make sure your request clearly explains how the funds will be used!
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
            throw new Error("Failed to send email");
        }
        
        return { success: true, message: "Email sent successfully" };
    } catch (error) {
        console.error("Error sending aid request confirmation email:", error);
        return { success: false, message: "Failed to send email" };
    }
};