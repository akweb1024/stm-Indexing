import nodemailer from 'nodemailer';

// Email configuration
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

interface ReviewerInvitation {
    reviewerEmail: string;
    reviewerName: string;
    paperTitle: string;
    paperDoi: string;
    journalName: string;
    invitationLink: string;
}

export const sendReviewerInvitation = async (invitation: ReviewerInvitation) => {
    const { reviewerEmail, reviewerName, paperTitle, paperDoi, journalName, invitationLink } = invitation;

    const mailOptions = {
        from: process.env.SMTP_FROM || 'noreply@stm-indexing.com',
        to: reviewerEmail,
        subject: `Invitation to Review: ${paperTitle}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #333;">Peer Review Invitation</h2>
                <p>Dear ${reviewerName},</p>
                
                <p>You have been invited to review the following manuscript:</p>
                
                <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
                    <h3 style="margin-top: 0;">${paperTitle}</h3>
                    <p><strong>Journal:</strong> ${journalName}</p>
                    <p><strong>DOI:</strong> ${paperDoi}</p>
                </div>
                
                <p>We believe your expertise makes you an ideal reviewer for this work.</p>
                
                <p style="margin: 30px 0;">
                    <a href="${invitationLink}" 
                       style="background-color: #667eea; color: white; padding: 12px 30px; 
                              text-decoration: none; border-radius: 5px; display: inline-block;">
                        Accept Invitation
                    </a>
                </p>
                
                <p>If you have any questions, please don't hesitate to contact us.</p>
                
                <p>Best regards,<br>
                Editorial Team</p>
                
                <hr style="margin-top: 30px; border: none; border-top: 1px solid #ddd;">
                <p style="font-size: 12px; color: #666;">
                    This is an automated message from the STM Indexing & Verification Platform.
                </p>
            </div>
        `
    };

    try {
        // In development, just log the email
        if (process.env.NODE_ENV === 'development' || !process.env.SMTP_USER) {
            console.log('📧 [DEV MODE] Email would be sent to:', reviewerEmail);
            console.log('Subject:', mailOptions.subject);
            console.log('Invitation Link:', invitationLink);
            return { success: true, mode: 'development', email: reviewerEmail };
        }

        const info = await transporter.sendMail(mailOptions);
        console.log('✅ Email sent:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('❌ Email sending failed:', error);
        throw new Error(`Failed to send email: ${(error as Error).message}`);
    }
};

export const sendBulkInvitations = async (invitations: ReviewerInvitation[]) => {
    const results = await Promise.allSettled(
        invitations.map(inv => sendReviewerInvitation(inv))
    );

    const successful = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;

    return { successful, failed, total: invitations.length };
};
