/**
 * Demo script to test the email invitation flow
 * This can be used for testing and demonstration purposes
 */

import { sendTeamInvitationEmail, generateInvitationLink } from './emailService';
import { sendTeamInvitationEmail as sendRealEmail } from './realEmailService';
import { createTeamInvitation } from './invitationService';

export const demoInvitationFlow = async () => {
    console.log('🎯 Starting Email Invitation Demo Flow...');

    try {
        // Demo data
        const demoData = {
            toEmail: 'demo.student@presidencyuniversity.in',
            toName: 'Demo Student',
            fromName: 'John Doe',
            teamName: 'Team Alpha',
            projectName: 'AI-Powered Learning Management System',
            teamLeaderEmail: 'john.doe@presidencyuniversity.in',
            teamLeaderRollNo: '2022CSE001',
            teamNumber: `T${Date.now().toString().slice(-6)}`
        };

        // Step 1: Generate invitation link
        console.log('📧 Step 1: Generating invitation link...');
        const invitationLink = generateInvitationLink('demo-team-123', 'demo-invite-456');
        console.log('✅ Invitation link generated:', invitationLink);

        // Step 2: Send email invitation using real email service
        console.log('📧 Step 2: Sending real email invitation...');
        const emailResult = await sendRealEmail({
            ...demoData,
            invitationLink
        });

        if (emailResult.success) {
            console.log('✅ Email sent successfully:', emailResult.message);
        } else {
            console.log('❌ Email failed:', emailResult.message);
        }

        // Step 3: Simulate invitation creation (would normally use Firebase)
        console.log('📧 Step 3: Creating invitation record...');
        const invitationData = {
            teamId: 'demo-team-123',
            invitedUserId: 'demo-user-456',
            inviterId: 'demo-inviter-789',
            teamName: demoData.teamName,
            inviterName: demoData.fromName,
            invitedUserName: demoData.toName,
            invitedUserEmail: demoData.toEmail
        };

        // Note: This would normally create a real invitation in Firebase
        console.log('✅ Invitation data prepared:', invitationData);

        console.log('🎉 Demo flow completed successfully!');
        console.log('📋 Next steps:');
        console.log('   1. Check browser notifications');
        console.log('   2. Test invitation acceptance flow');
        console.log('   3. Verify team membership updates');

        return {
            success: true,
            invitationLink,
            emailResult,
            invitationData
        };

    } catch (error) {
        console.error('❌ Demo flow failed:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        };
    }
};

/**
 * Test notification permission
 */
export const testNotificationPermission = async () => {
    console.log('🔔 Testing notification permission...');

    if (!('Notification' in window)) {
        console.log('❌ This browser does not support notifications');
        return false;
    }

    if (Notification.permission === 'granted') {
        console.log('✅ Notifications are already enabled');
        return true;
    }

    if (Notification.permission === 'denied') {
        console.log('❌ Notifications are blocked');
        return false;
    }

    try {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
            console.log('✅ Notification permission granted');

            // Test notification
            new Notification('Test Notification', {
                body: 'Email invitation system is working!',
                icon: '/favicon.svg'
            });

            return true;
        } else {
            console.log('❌ Notification permission denied');
            return false;
        }
    } catch (error) {
        console.error('❌ Error requesting notification permission:', error);
        return false;
    }
};

/**
 * Run complete demo
 */
export const runCompleteDemo = async () => {
    console.log('🚀 Starting Complete Email Invitation Demo...');

    // Test notifications first
    const notificationEnabled = await testNotificationPermission();

    if (!notificationEnabled) {
        console.log('⚠️ Notifications not available, but demo will continue...');
    }

    // Run invitation flow
    const result = await demoInvitationFlow();

    if (result.success) {
        console.log('🎉 Complete demo finished successfully!');
        console.log('📧 Check your browser for notifications');
        console.log('🔗 Invitation link:', result.invitationLink);
    } else {
        console.log('❌ Demo failed:', result.error);
    }

    return result;
};

// Make functions available globally for testing
if (typeof window !== 'undefined') {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).demoInvitationFlow = demoInvitationFlow;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).testNotificationPermission = testNotificationPermission;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).runCompleteDemo = runCompleteDemo;
}
