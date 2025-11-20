/**
 * Email templates for team invitations and notifications
 * These templates can be used with EmailJS or any other email service
 */

export interface EmailTemplate {
    subject: string;
    html: string;
    text: string;
}

/**
 * Team invitation email template
 */
export const getTeamInvitationTemplate = (data: {
    toName: string;
    fromName: string;
    teamName: string;
    invitationLink: string;
    projectName?: string;
}): EmailTemplate => {
    const subject = `Invitation to join team "${data.teamName}" - Capstone Project`;

    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Team Invitation</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #2563eb; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f8fafc; padding: 30px; border-radius: 0 0 8px 8px; }
        .button { display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #64748b; font-size: 14px; }
        .team-info { background: white; padding: 20px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #2563eb; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎓 Capstone Project Team Invitation</h1>
        </div>
        <div class="content">
          <h2>Hello ${data.toName}!</h2>
          
          <p><strong>${data.fromName}</strong> has invited you to join their capstone project team:</p>
          
          <div class="team-info">
            <h3>Team: ${data.teamName}</h3>
            ${data.projectName ? `<p><strong>Project:</strong> ${data.projectName}</p>` : ''}
          </div>
          
          <p>As a team member, you'll be able to:</p>
          <ul>
            <li>Collaborate on project development</li>
            <li>Access shared resources and documents</li>
            <li>Track project progress and milestones</li>
            <li>Communicate with team members and faculty</li>
          </ul>
          
          <p>Click the button below to accept this invitation:</p>
          
          <a href="${data.invitationLink}" class="button">Accept Invitation</a>
          
          <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
          <p style="word-break: break-all; background: #e2e8f0; padding: 10px; border-radius: 4px; font-family: monospace;">
            ${data.invitationLink}
          </p>
          
          <p><strong>Note:</strong> This invitation will expire in 7 days. If you don't want to join this team, you can simply ignore this email.</p>
        </div>
        <div class="footer">
          <p>This is an automated message from the Capstone Project Management System.</p>
          <p>If you have any questions, please contact your faculty advisor.</p>
        </div>
      </div>
    </body>
    </html>
  `;

    const text = `
Team Invitation - Capstone Project

Hello ${data.toName}!

${data.fromName} has invited you to join their capstone project team: ${data.teamName}

${data.projectName ? `Project: ${data.projectName}` : ''}

As a team member, you'll be able to:
- Collaborate on project development
- Access shared resources and documents
- Track project progress and milestones
- Communicate with team members and faculty

To accept this invitation, visit: ${data.invitationLink}

Note: This invitation will expire in 7 days. If you don't want to join this team, you can simply ignore this email.

This is an automated message from the Capstone Project Management System.
If you have any questions, please contact your faculty advisor.
  `;

    return { subject, html, text };
};

/**
 * Welcome email template for new team members
 */
export const getWelcomeEmailTemplate = (data: {
    toName: string;
    teamName: string;
    projectName?: string;
    teamMembers: string[];
}): EmailTemplate => {
    const subject = `Welcome to team "${data.teamName}"!`;

    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to the Team</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #059669; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f0fdf4; padding: 30px; border-radius: 0 0 8px 8px; }
        .team-info { background: white; padding: 20px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #059669; }
        .footer { text-align: center; margin-top: 30px; color: #64748b; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 Welcome to the Team!</h1>
        </div>
        <div class="content">
          <h2>Hello ${data.toName}!</h2>
          
          <p>Congratulations! You have successfully joined the capstone project team:</p>
          
          <div class="team-info">
            <h3>Team: ${data.teamName}</h3>
            ${data.projectName ? `<p><strong>Project:</strong> ${data.projectName}</p>` : ''}
            <p><strong>Team Members:</strong></p>
            <ul>
              ${data.teamMembers.map(member => `<li>${member}</li>`).join('')}
            </ul>
          </div>
          
          <p>You can now access your team dashboard and start collaborating on your capstone project. Good luck with your project!</p>
        </div>
        <div class="footer">
          <p>This is an automated message from the Capstone Project Management System.</p>
        </div>
      </div>
    </body>
    </html>
  `;

    const text = `
Welcome to the Team!

Hello ${data.toName}!

Congratulations! You have successfully joined the capstone project team: ${data.teamName}

${data.projectName ? `Project: ${data.projectName}` : ''}

Team Members:
${data.teamMembers.map(member => `- ${member}`).join('\n')}

You can now access your team dashboard and start collaborating on your capstone project. Good luck with your project!

This is an automated message from the Capstone Project Management System.
  `;

    return { subject, html, text };
};

/**
 * Project assignment notification template
 */
export const getProjectAssignmentTemplate = (data: {
    toName: string;
    teamName: string;
    projectName: string;
    guideName?: string;
}): EmailTemplate => {
    const subject = `Project Assigned: ${data.projectName}`;

    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Project Assignment</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #7c3aed; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #faf5ff; padding: 30px; border-radius: 0 0 8px 8px; }
        .project-info { background: white; padding: 20px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #7c3aed; }
        .footer { text-align: center; margin-top: 30px; color: #64748b; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>📋 Project Assignment</h1>
        </div>
        <div class="content">
          <h2>Hello ${data.toName}!</h2>
          
          <p>Great news! Your team has been assigned a capstone project:</p>
          
          <div class="project-info">
            <h3>${data.projectName}</h3>
            <p><strong>Team:</strong> ${data.teamName}</p>
            ${data.guideName ? `<p><strong>Faculty Guide:</strong> ${data.guideName}</p>` : ''}
          </div>
          
          <p>You can now start working on your project. Make sure to check your dashboard for project details and requirements.</p>
        </div>
        <div class="footer">
          <p>This is an automated message from the Capstone Project Management System.</p>
        </div>
      </div>
    </body>
    </html>
  `;

    const text = `
Project Assignment

Hello ${data.toName}!

Great news! Your team has been assigned a capstone project:

Project: ${data.projectName}
Team: ${data.teamName}
${data.guideName ? `Faculty Guide: ${data.guideName}` : ''}

You can now start working on your project. Make sure to check your dashboard for project details and requirements.

This is an automated message from the Capstone Project Management System.
  `;

    return { subject, html, text };
};

