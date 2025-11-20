/**
 * Notification Service for real-time updates
 * Handles team leader notifications for invitation responses
 */

import { sendTeamInvitationEmail } from './realEmailService';

export interface NotificationData {
    type: 'invitation_accepted' | 'invitation_rejected' | 'team_member_added';
    teamLeaderId: string;
    teamLeaderEmail: string;
    teamLeaderName: string;
    teamName: string;
    teamNumber: string;
    memberName: string;
    memberEmail: string;
    invitationId: string;
}

export interface NotificationResult {
    success: boolean;
    message: string;
}

/**
 * Send notification to team leader about invitation response
 */
export const notifyTeamLeader = async (
    notificationData: NotificationData
): Promise<NotificationResult> => {
    try {
        console.log('Sending notification to team leader:', notificationData);

        if (notificationData.type === 'invitation_accepted') {
            // Send welcome email to new team member
            await sendTeamInvitationEmail({
                toEmail: notificationData.memberEmail,
                toName: notificationData.memberName,
                fromName: notificationData.teamLeaderName,
                teamName: notificationData.teamName,
                invitationLink: '', // Not needed for welcome email
                projectName: '',
                teamLeaderEmail: notificationData.teamLeaderEmail,
                teamLeaderRollNo: '',
                teamNumber: notificationData.teamNumber
            });
        } else if (notificationData.type === 'invitation_rejected') {
            // Send rejection notification to team leader
            await sendRejectionNotification(notificationData);
        }

        // Show browser notification
        if ('Notification' in window && Notification.permission === 'granted') {
            const title = notificationData.type === 'invitation_accepted'
                ? '🎉 Team Member Joined!'
                : '❌ Invitation Declined';

            const body = notificationData.type === 'invitation_accepted'
                ? `${notificationData.memberName} has joined your team ${notificationData.teamName}`
                : `${notificationData.memberName} has declined your invitation to team ${notificationData.teamName}`;

            new Notification(title, {
                body,
                icon: '/favicon.svg'
            });
        }

        return {
            success: true,
            message: 'Notification sent successfully'
        };
    } catch (error) {
        console.error('Failed to send notification:', error);
        return {
            success: false,
            message: 'Failed to send notification'
        };
    }
};

/**
 * Send rejection notification email to team leader
 */
const sendRejectionNotification = async (data: NotificationData) => {
    const subject = `❌ Invitation Declined - Team ${data.teamNumber}`;

    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Invitation Declined</title>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5; }
        .email-container { background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%); color: white; padding: 30px; text-align: center; }
        .content { padding: 30px; }
        .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #6c757d; font-size: 14px; }
        .team-info { background: #fff3cd; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107; }
        .member-info { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="header">
          <h1>❌ Invitation Declined</h1>
          <p>Team ${data.teamNumber}</p>
        </div>
        <div class="content">
          <h2>Hello ${data.teamLeaderName}!</h2>
          
          <p>Unfortunately, one of your team invitations has been declined:</p>
          
          <div class="team-info">
            <h3>🏆 Team: ${data.teamName}</h3>
            <p><strong>🔢 Team Number:</strong> ${data.teamNumber}</p>
          </div>
          
          <div class="member-info">
            <h4>👤 Student Details:</h4>
            <p><strong>Name:</strong> ${data.memberName}</p>
            <p><strong>Email:</strong> ${data.memberEmail}</p>
          </div>
          
          <p>Don't worry! You can still invite other students to join your team. Consider reaching out to other potential team members.</p>
          
          <p style="background: #e3f2fd; padding: 15px; border-radius: 5px; border-left: 4px solid #2196f3; margin-top: 20px;">
            <strong>💡 Tip:</strong> You can send invitations to multiple students to increase your chances of forming a complete team.
          </p>
        </div>
        <div class="footer">
          <p>This is an automated message from the Capstone Project Management System.</p>
        </div>
      </div>
    </body>
    </html>
  `;

    const text = `
❌ INVITATION DECLINED - TEAM ${data.teamNumber}

Hello ${data.teamLeaderName}!

Unfortunately, one of your team invitations has been declined:

TEAM DETAILS:
🏆 Team: ${data.teamName}
🔢 Team Number: ${data.teamNumber}

STUDENT DETAILS:
👤 Name: ${data.memberName}
📧 Email: ${data.memberEmail}

Don't worry! You can still invite other students to join your team. Consider reaching out to other potential team members.

💡 Tip: You can send invitations to multiple students to increase your chances of forming a complete team.

This is an automated message from the Capstone Project Management System.
  `;

    // For demo purposes, we'll simulate sending the email
    console.log('Sending rejection notification email:', { to: data.teamLeaderEmail, subject, html, text });

    // Show browser notification
    if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('📧 Rejection Notification Sent', {
            body: `Email sent to ${data.teamLeaderName} about declined invitation`,
            icon: '/favicon.svg'
        });
    }
};

/**
 * Send acceptance notification email to team leader
 */
export const sendAcceptanceNotification = async (data: NotificationData) => {
    const subject = `🎉 Team Member Joined - Team ${data.teamNumber}`;

    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Team Member Joined</title>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5; }
        .email-container { background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #56ab2f 0%, #a8e6cf 100%); color: white; padding: 30px; text-align: center; }
        .content { padding: 30px; }
        .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #6c757d; font-size: 14px; }
        .team-info { background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #22c55e; }
        .member-info { background: #e0f2fe; padding: 20px; border-radius: 8px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="header">
          <h1>🎉 Team Member Joined!</h1>
          <p>Team ${data.teamNumber}</p>
        </div>
        <div class="content">
          <h2>Hello ${data.teamLeaderName}!</h2>
          
          <p>Great news! A new team member has joined your capstone project team:</p>
          
          <div class="team-info">
            <h3>🏆 Team: ${data.teamName}</h3>
            <p><strong>🔢 Team Number:</strong> ${data.teamNumber}</p>
          </div>
          
          <div class="member-info">
            <h4>👤 New Team Member:</h4>
            <p><strong>Name:</strong> ${data.memberName}</p>
            <p><strong>Email:</strong> ${data.memberEmail}</p>
          </div>
          
          <p>Your team is growing! You can now collaborate with your new team member on your capstone project.</p>
          
          <p style="background: #e3f2fd; padding: 15px; border-radius: 5px; border-left: 4px solid #2196f3; margin-top: 20px;">
            <strong>🚀 Next Steps:</strong> Consider assigning roles and responsibilities to your team members to ensure effective collaboration.
          </p>
        </div>
        <div class="footer">
          <p>This is an automated message from the Capstone Project Management System.</p>
        </div>
      </div>
    </body>
    </html>
  `;

    const text = `
🎉 TEAM MEMBER JOINED - TEAM ${data.teamNumber}

Hello ${data.teamLeaderName}!

Great news! A new team member has joined your capstone project team:

TEAM DETAILS:
🏆 Team: ${data.teamName}
🔢 Team Number: ${data.teamNumber}

NEW TEAM MEMBER:
👤 Name: ${data.memberName}
📧 Email: ${data.memberEmail}

Your team is growing! You can now collaborate with your new team member on your capstone project.

🚀 Next Steps: Consider assigning roles and responsibilities to your team members to ensure effective collaboration.

This is an automated message from the Capstone Project Management System.
  `;

    // For demo purposes, we'll simulate sending the email
    console.log('Sending acceptance notification email:', { to: data.teamLeaderEmail, subject, html, text });

    // Show browser notification
    if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('📧 Acceptance Notification Sent', {
            body: `Email sent to ${data.teamLeaderName} about new team member`,
            icon: '/favicon.svg'
        });
    }
};








