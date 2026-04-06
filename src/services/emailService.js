import resend from '../config/email.js';
import dotenv from 'dotenv';

dotenv.config();

export const sendVerificationEmail = async (email, verificationToken, userName) => {
    try {
        const verificationLink = `${process.env.APP_URL || 'http://localhost:3000'}/api/auth/verify-email?token=${verificationToken}&email=${email}`;

        const result = await resend.emails.send({
            from: process.env.FROM_EMAIL,
            to: email,
            subject: 'Email Verification - ProManager',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px;">
                        <h2 style="color: #333;">Welcome to ProManager, ${userName}!</h2>
                        <p style="color: #666; font-size: 14px;">
                            Thank you for registering. Please verify your email address to activate your account.
                        </p>
                        <div style="margin: 30px 0;">
                            <a href="${verificationLink}" 
                               style="background-color: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                                Verify Email
                            </a>
                        </div>
                        <p style="color: #999; font-size: 12px;">
                            This link will expire in 24 hours.
                        </p>
                        <p style="color: #999; font-size: 12px;">
                            If you didn't create this account, please ignore this email.
                        </p>
                    </div>
                </div>
            `
        });

        console.log('Verification email sent:', result);
        return { success: true, messageId: result.id };
    } catch (error) {
        console.error('Error sending verification email:', error);
        return { success: false, error: error.message };
    }
};

export const sendWelcomeEmail = async (email, userName) => {
    try {
        const result = await resend.emails.send({
            from: process.env.FROM_EMAIL,
            to: email,
            subject: 'Welcome to ProManager!',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px;">
                        <h2 style="color: #333;">Welcome to ProManager, ${userName}!</h2>
                        <p style="color: #666; font-size: 14px;">
                            Your email has been verified successfully. You can now log in to your account.
                        </p>
                        <p style="color: #666; font-size: 14px;">
                            Happy managing!
                        </p>
                    </div>
                </div>
            `
        });

        console.log('Welcome email sent:', result);
        return { success: true, messageId: result.id };
    } catch (error) {
        console.error('Error sending welcome email:', error);
        return { success: false, error: error.message };
    }
};
