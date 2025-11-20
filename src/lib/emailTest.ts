/**
 * Email Test Utility
 * Test the email system to ensure it's working
 */

import { sendWorkingEmail } from './workingEmailService';

/**
 * Test email sending functionality
 */
export const testEmailSending = async (testEmail: string = 'test@example.com'): Promise<boolean> => {
    try {
        console.log('🧪 Testing email system...');

        const testEmailData = {
            to: testEmail,
            subject: '🧪 Email System Test - Capstone Project',
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8">
                    <title>Email Test</title>
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
                        .header { background: #4CAF50; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
                        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
                        .success { color: #4CAF50; font-weight: bold; }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <h1>🧪 Email System Test</h1>
                    </div>
                    <div class="content">
                        <h2>✅ Email System is Working!</h2>
                        <p>This is a test email to verify that the email system is functioning correctly.</p>
                        <p class="success">If you received this email, the email system is working properly!</p>
                        <p><strong>Test Details:</strong></p>
                        <ul>
                            <li>✅ Email service is operational</li>
                            <li>✅ HTML templates are working</li>
                            <li>✅ Email delivery is successful</li>
                            <li>✅ Professional formatting is applied</li>
                        </ul>
                        <p>This test was sent from the Capstone Project Management System.</p>
                    </div>
                </body>
                </html>
            `,
            text: `
🧪 EMAIL SYSTEM TEST

✅ Email System is Working!

This is a test email to verify that the email system is functioning correctly.

If you received this email, the email system is working properly!

Test Details:
✅ Email service is operational
✅ HTML templates are working  
✅ Email delivery is successful
✅ Professional formatting is applied

This test was sent from the Capstone Project Management System.
            `
        };

        const result = await sendWorkingEmail(testEmailData);

        if (result.success) {
            console.log('✅ Email test successful:', result.message);
            return true;
        } else {
            console.error('❌ Email test failed:', result.message);
            return false;
        }

    } catch (error) {
        console.error('❌ Email test error:', error);
        return false;
    }
};

/**
 * Test team invitation email
 */
export const testTeamInvitationEmail = async (testEmail: string = 'test@example.com'): Promise<boolean> => {
    try {
        console.log('🧪 Testing team invitation email...');

        const { sendTeamInvitationEmail } = await import('./workingEmailService');

        const result = await sendTeamInvitationEmail({
            toEmail: testEmail,
            toName: 'Test User',
            fromName: 'Team Leader',
            teamName: 'Test Team',
            invitationLink: 'https://your-app.com/invitation/test123',
            projectName: 'Test Capstone Project',
            teamLeaderEmail: 'leader@example.com',
            teamLeaderRollNo: 'CS2024001',
            teamNumber: 'T123456'
        });

        if (result.success) {
            console.log('✅ Team invitation email test successful:', result.message);
            return true;
        } else {
            console.error('❌ Team invitation email test failed:', result.message);
            return false;
        }

    } catch (error) {
        console.error('❌ Team invitation email test error:', error);
        return false;
    }
};

/**
 * Run all email tests
 */
export const runAllEmailTests = async (testEmail: string = 'test@example.com'): Promise<void> => {
    console.log('🚀 Running all email tests...');

    const basicTest = await testEmailSending(testEmail);
    const invitationTest = await testTeamInvitationEmail(testEmail);

    console.log('\n📊 Email Test Results:');
    console.log(`Basic Email Test: ${basicTest ? '✅ PASSED' : '❌ FAILED'}`);
    console.log(`Team Invitation Test: ${invitationTest ? '✅ PASSED' : '❌ FAILED'}`);

    if (basicTest && invitationTest) {
        console.log('\n🎉 All email tests passed! Email system is working correctly.');
    } else {
        console.log('\n⚠️ Some email tests failed. Check the console for details.');
    }
};

// Auto-run tests in development
if (import.meta.env.DEV) {
    console.log('🧪 Email system tests available. Call runAllEmailTests() to test.');
}






