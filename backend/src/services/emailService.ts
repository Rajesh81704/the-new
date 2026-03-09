import nodemailer from 'nodemailer';
import { unifiedConfig } from '../config/unifiedConfig';

export class EmailService {
    private transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp.ethereal.email',
            port: parseInt(process.env.SMTP_PORT || '587'),
            secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
    }

    async sendPasswordResetEmail(to: string, resetToken: string, isCompanyAdmin = false) {
        // For development, we'll log the token and use a mock URL
        // In production, you would construct the URL based on the domain/subdomain
        const appUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

        // Construct the reset link based on the user type
        // user -> user.domain.com/reset-password
        // company -> company.domain.com/reset-password
        const baseUrl = new URL(appUrl);
        let subdomain = isCompanyAdmin ? 'company.' : 'user.';

        // Adjust logic depending on your actual domains. If local testing, it might be company.localhost:5173
        const resetUrl = `http://${subdomain}${baseUrl.hostname}${baseUrl.port ? `:${baseUrl.port}` : ''}/reset-password?token=${resetToken}`;

        const mailOptions = {
            from: `"ConnectPro Support" <${process.env.SMTP_FROM || 'noreply@example.com'}>`,
            to,
            subject: 'Password Reset Request',
            text: `You requested a password reset. Click the link below to reset your password. If you didn't request this, please ignore this email.\n\n${resetUrl}`,
            html: `
            <p>You requested a password reset. Click the link below to reset your password. If you didn't request this, please ignore this email.</p>
            <br>
            <a href="${resetUrl}">Reset Password</a>
        `
        };

        try {
            const info = await this.transporter.sendMail(mailOptions);
            console.log('Message sent: %s', info.messageId);

            // If using ethereal email for dev, log the preview URL
            if (process.env.SMTP_HOST === 'smtp.ethereal.email') {
                console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
            }
            return true;
        } catch (error) {
            console.error('Error sending email:', error);
            // In production, we might want to throw error if mail fails depending on requirements.
            // For now, returning false is safer.
            return false;
        }
    }
}

export const emailService = new EmailService();
