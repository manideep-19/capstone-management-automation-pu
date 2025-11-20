/**
 * Working Email Service - Actually sends emails
 * Uses multiple fallback methods to ensure email delivery
 */

import { getEmailConfig } from './emailConfig';

export interface EmailData {
  to: string;
  subject: string;
  html: string;
  text: string;
}

export interface EmailResult {
  success: boolean;
  message: string;
  emailId?: string;
}

/**
 * Send email using multiple methods with fallbacks
 * NO MAILTO - Fully automated only
 */
export const sendWorkingEmail = async (emailData: EmailData): Promise<EmailResult> => {
  console.log('🚀 Attempting AUTOMATED email sending to:', emailData.to);
  console.log('📧 Email subject:', emailData.subject);

  // Method 1: Try EmailJS direct API first (most reliable)
  try {
    console.log('🔄 Method 1: Trying Direct EmailJS API...');
    const directEmailJSResult = await sendViaDirectEmailJS(emailData);
    if (directEmailJSResult.success) {
      console.log('✅ Email sent successfully via Direct EmailJS API');
      return directEmailJSResult;
    }
  } catch (error: any) {
    console.warn('⚠️ Direct EmailJS API failed:', error?.message || error);
  }

  // Method 2: Try EmailJS browser SDK
  try {
    console.log('🔄 Method 2: Trying EmailJS Browser SDK...');
    const emailjsResult = await sendViaEmailJS(emailData);
    if (emailjsResult.success) {
      console.log('✅ Email sent successfully via EmailJS Browser SDK');
      return emailjsResult;
    }
  } catch (error: any) {
    console.warn('⚠️ EmailJS Browser SDK failed:', error?.message || error);
  }

  // Method 3: Try Resend API (free tier available)
  try {
    console.log('🔄 Method 3: Trying Resend API...');
    const resendResult = await sendViaResend(emailData);
    if (resendResult.success) {
      console.log('✅ Email sent successfully via Resend API');
      return resendResult;
    }
  } catch (error: any) {
    console.warn('⚠️ Resend API failed:', error?.message || error);
  }

  // Method 4: Try Web3Forms (free email service)
  try {
    console.log('🔄 Method 4: Trying Web3Forms...');
    const web3formsResult = await sendViaWeb3Forms(emailData);
    if (web3formsResult.success) {
      console.log('✅ Email sent successfully via Web3Forms');
      return web3formsResult;
    }
  } catch (error: any) {
    console.warn('⚠️ Web3Forms failed:', error?.message || error);
  }

  // NO MAILTO FALLBACK - Return failure instead
  console.error('❌ All automated email methods failed. NOT opening email client.');
  console.error('📋 Email data that failed to send:', {
    to: emailData.to,
    subject: emailData.subject,
    hasHtml: !!emailData.html,
    hasText: !!emailData.text
  });
  return {
    success: false,
    message: 'All automated email methods failed. Invitation created but email not sent.',
    emailId: undefined
  };
};

/**
 * Method 2: Send via EmailJS Browser SDK
 */
const sendViaEmailJS = async (emailData: EmailData): Promise<EmailResult> => {
  try {
    const emailjs = (await import('@emailjs/browser')).default;
    const emailConfig = getEmailConfig();

    // Check if using demo credentials - only skip if service ID is demo
    const hasDemoServiceId = emailConfig.serviceId === 'service_x2a6fwk';
    const hasDemoTemplateId = emailConfig.templateId === 'template_8h5x8yq';
    const hasDemoPublicKey = emailConfig.publicKey === 'your_public_key' || emailConfig.publicKey === 'LxVqGdVK9IvL-TA1n';
    
    if (hasDemoServiceId) {
      console.warn('⚠️ Service ID is still using demo value. Update serviceId in emailConfig.ts');
      throw new Error('EmailJS Service ID not configured - using demo credentials');
    }
    
    // Warn about other demo credentials but still try
    if (hasDemoTemplateId) {
      console.warn('⚠️ Template ID is still using demo value. Update templateId in emailConfig.ts');
    }
    if (hasDemoPublicKey) {
      console.warn('⚠️ Public Key is still using demo value. Update publicKey in emailConfig.ts');
    }

    // Initialize with credentials
    emailjs.init(emailConfig.publicKey);
    
    const serviceId = emailConfig.serviceId;
    const templateId = emailConfig.templateId;

    // Normalize email to lowercase
    const normalizedEmail = emailData.to.trim().toLowerCase();

    const templateParams = {
      to_email: normalizedEmail, // Use normalized lowercase email
      to_name: normalizedEmail.split('@')[0],
      from_name: 'Capstone Project System',
      subject: emailData.subject,
      message: emailData.text,
      html_content: emailData.html
    };

    console.log('📤 Sending via EmailJS Browser SDK with params:', { ...templateParams, html_content: '[HTML content]' });

    const result = await emailjs.send(
      serviceId,
      templateId,
      templateParams
    );

    console.log('✅ Email sent via EmailJS Browser SDK:', result);
    return {
      success: true,
      message: `Email sent successfully to ${emailData.to}`,
      emailId: `emailjs_${Date.now()}`
    };
  } catch (error: any) {
    console.error('❌ EmailJS Browser SDK error:', error);
    if (error?.message?.includes('not configured') || error?.message?.includes('demo')) {
      throw error; // Re-throw demo credential errors
    }
    throw new Error(`EmailJS Browser SDK failed: ${error?.message || error}`);
  }
};

/**
 * Method 2: Send via Resend API (free tier)
 */
const sendViaResend = async (emailData: EmailData): Promise<EmailResult> => {
  try {
    // Using Resend API (free tier available)
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer re_demo_key' // Replace with real API key
      },
      body: JSON.stringify({
        from: 'Capstone Project <noreply@capstone-project.com>',
        to: [emailData.to],
        subject: emailData.subject,
        html: emailData.html,
        text: emailData.text
      })
    });

    if (!response.ok) {
      throw new Error(`Resend API failed: ${response.status}`);
    }

    const result = await response.json();
    console.log('✅ Email sent via Resend:', result);

    return {
      success: true,
      message: `Email sent via Resend to ${emailData.to}`,
      emailId: result.id || `resend_${Date.now()}`
    };
  } catch (error) {
    throw new Error(`Resend failed: ${error}`);
  }
};

/**
 * Method 3: Send via Web3Forms (free service)
 */
const sendViaWeb3Forms = async (emailData: EmailData): Promise<EmailResult> => {
  try {
    const formData = new FormData();
    formData.append('access_key', 'demo_key'); // Replace with real access key
    formData.append('name', 'Capstone Project System');
    formData.append('email', 'noreply@capstone-project.com');
    formData.append('to', emailData.to);
    formData.append('subject', emailData.subject);
    formData.append('message', emailData.text);
    formData.append('html', emailData.html);

    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error(`Web3Forms failed: ${response.status}`);
    }

    const result = await response.json();
    console.log('✅ Email sent via Web3Forms:', result);

    return {
      success: true,
      message: `Email sent via Web3Forms to ${emailData.to}`,
      emailId: `web3forms_${Date.now()}`
    };
  } catch (error) {
    throw new Error(`Web3Forms failed: ${error}`);
  }
};

/**
 * Method 1: Send via Direct EmailJS API (most reliable)
 */
const sendViaDirectEmailJS = async (emailData: EmailData): Promise<EmailResult> => {
  try {
    const emailConfig = getEmailConfig();
    
    // Check if using demo credentials - only skip if ALL are demo
    const hasDemoServiceId = emailConfig.serviceId === 'service_x2a6fwk';
    const hasDemoTemplateId = emailConfig.templateId === 'template_8h5x8yq';
    const hasDemoPublicKey = emailConfig.publicKey === 'your_public_key' || emailConfig.publicKey === 'LxVqGdVK9IvL-TA1n';
    
    // Only skip if service ID is demo (most critical)
    if (hasDemoServiceId) {
      console.warn('⚠️ Service ID is still using demo value. Update serviceId in emailConfig.ts');
      throw new Error('EmailJS Service ID not configured - using demo credentials');
    }
    
    // Warn about other demo credentials but still try
    if (hasDemoTemplateId) {
      console.warn('⚠️ Template ID is still using demo value. Update templateId in emailConfig.ts');
    }
    if (hasDemoPublicKey) {
      console.warn('⚠️ Public Key is still using demo value. Update publicKey in emailConfig.ts');
    }
    
    const serviceId = emailConfig.serviceId;
    const templateId = emailConfig.templateId;
    const userId = emailConfig.publicKey;

    // Normalize email to lowercase
    const normalizedEmail = emailData.to.trim().toLowerCase();

    const templateParams = {
      to_email: normalizedEmail, // Use normalized lowercase email
      to_name: normalizedEmail.split('@')[0],
      from_name: 'Capstone Project System',
      subject: emailData.subject,
      message: emailData.text,
      html_content: emailData.html
    };

    console.log('📤 Sending via Direct EmailJS API with params:', { ...templateParams, html_content: '[HTML content]' });

    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        service_id: serviceId,
        template_id: templateId,
        user_id: userId,
        template_params: templateParams
      })
    });

    const responseText = await response.text();
    console.log('📥 Direct EmailJS API response status:', response.status);
    console.log('📥 Direct EmailJS API response:', responseText);

    if (!response.ok) {
      // Check for common error messages
      if (response.status === 400 || response.status === 401) {
        console.error('❌ EmailJS authentication failed - check your credentials');
        throw new Error(`EmailJS authentication failed (${response.status}). Please check your service ID, template ID, and public key.`);
      }
      throw new Error(`Direct EmailJS API failed: ${response.status} - ${responseText}`);
    }

    let result;
    try {
      result = JSON.parse(responseText);
    } catch {
      result = { text: responseText };
    }

    console.log('✅ Email sent via Direct EmailJS API:', result);

    return {
      success: true,
      message: `Email sent via Direct EmailJS API to ${emailData.to}`,
      emailId: `direct_emailjs_${Date.now()}`
    };
  } catch (error: any) {
    console.error('❌ Direct EmailJS API error:', error);
    throw new Error(`Direct EmailJS API failed: ${error?.message || error}`);
  }
};

/**
 * Method 5: Final fallback - mailto
 */
const sendViaMailto = async (emailData: EmailData): Promise<EmailResult> => {
  try {
    const subject = encodeURIComponent(emailData.subject);
    const body = encodeURIComponent(emailData.text);
    const mailtoLink = `mailto:${emailData.to}?subject=${subject}&body=${body}`;

    // Open email client
    window.open(mailtoLink, '_blank');

    console.log('📧 Email client opened for:', emailData.to);

    // Show notification
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('📧 Email Client Opened', {
        body: `Please send the email to ${emailData.to}`,
        icon: '/favicon.svg'
      });
    }

    return {
      success: true,
      message: `Email client opened to send email to ${emailData.to}`,
      emailId: `mailto_${Date.now()}`
    };
  } catch (error) {
    console.error('❌ Mailto fallback failed:', error);
    return {
      success: false,
      message: 'All email methods failed. Please try again later.'
    };
  }
};

/**
 * Send team invitation email
 */
export const sendTeamInvitationEmail = async (data: {
  toEmail: string;
  toName: string;
  fromName: string;
  teamName: string;
  invitationLink: string;
  projectName?: string;
  teamLeaderEmail?: string;
  teamLeaderRollNo?: string;
  teamNumber?: string;
}): Promise<EmailResult> => {
  const teamNumber = data.teamNumber || `T${Date.now().toString().slice(-6)}`;
  const subject = `🎓 Team Invitation - Team ${teamNumber} | Capstone Project`;

  // Extract invitation ID and team ID from the link for action URLs
  const linkParts = data.invitationLink.split('/');
  const invitationId = linkParts[linkParts.length - 1];
  const teamId = linkParts[linkParts.length - 2];
  const baseUrl = data.invitationLink.split('/invitation')[0];

  // Create direct action links
  const acceptLink = `${baseUrl}/invitation/${teamId}/${invitationId}?action=accept`;
  const rejectLink = `${baseUrl}/invitation/${teamId}/${invitationId}?action=reject`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Team Invitation</title>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5; }
        .email-container { background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 30px; text-align: center; }
        .header h1 { margin: 0 0 10px 0; font-size: 28px; }
        .content { padding: 40px 30px; }
        .team-info { background: #f8f9fa; padding: 25px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #667eea; }
        .team-info h3 { margin: 0 0 15px 0; color: #667eea; font-size: 22px; }
        .detail-row { margin: 12px 0; }
        .detail-label { color: #666; font-size: 14px; margin-bottom: 4px; }
        .detail-value { font-weight: 600; color: #333; font-size: 16px; }
        .action-buttons { text-align: center; margin: 40px 0; padding: 30px 0; border-top: 2px solid #e9ecef; border-bottom: 2px solid #e9ecef; }
        .action-buttons h3 { color: #667eea; margin-bottom: 25px; }
        .btn { display: inline-block; padding: 18px 45px; margin: 10px 15px; text-decoration: none; border-radius: 50px; font-weight: bold; font-size: 17px; transition: all 0.3s; text-align: center; }
        .btn-accept { background: linear-gradient(135deg, #56ab2f 0%, #a8e6cf 100%); color: white; box-shadow: 0 4px 15px rgba(86, 171, 47, 0.4); }
        .btn-accept:hover { box-shadow: 0 6px 20px rgba(86, 171, 47, 0.6); transform: translateY(-2px); }
        .btn-reject { background: linear-gradient(135deg, #ff6b6b 0%, #feca57 100%); color: white; box-shadow: 0 4px 15px rgba(255, 107, 107, 0.4); }
        .btn-reject:hover { box-shadow: 0 6px 20px rgba(255, 107, 107, 0.6); transform: translateY(-2px); }
        .info-box { background: #e3f2fd; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #2196f3; }
        .footer { background: #f8f9fa; padding: 25px; text-align: center; color: #6c757d; font-size: 14px; border-top: 2px solid #e9ecef; }
        .highlight { background: #fff3cd; padding: 20px; border-radius: 8px; border-left: 4px solid #ffc107; margin: 25px 0; }
        .features { background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #22c55e; }
        ul { padding-left: 20px; }
        li { margin: 10px 0; }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="header">
          <h1>🎓 You're Invited to Join a Team!</h1>
          <p style="margin: 0; font-size: 18px;">Team Number: <strong>${teamNumber}</strong></p>
        </div>
        
        <div class="content">
          <h2 style="color: #667eea; margin-bottom: 15px;">Hello ${data.toName}! 👋</h2>
          <p style="font-size: 16px; color: #555; margin-bottom: 30px;"><strong>${data.fromName}</strong> has invited you to join their capstone project team!</p>
          
          <div class="team-info">
            <h3>🏆 Team: ${data.teamName}</h3>
            <div class="detail-row">
              <div class="detail-label">🔢 Team Number</div>
              <div class="detail-value">${teamNumber}</div>
            </div>
            ${data.projectName ? `
            <div class="detail-row">
              <div class="detail-label">📋 Project</div>
              <div class="detail-value">${data.projectName}</div>
            </div>
            ` : ''}
          </div>
          
          <div class="info-box">
            <h4 style="margin: 0 0 15px 0; color: #2196f3;">👨‍💼 Team Leader Details:</h4>
            <div class="detail-row">
              <div class="detail-label">Name</div>
              <div class="detail-value">${data.fromName}</div>
            </div>
            ${data.teamLeaderEmail ? `
            <div class="detail-row">
              <div class="detail-label">Email</div>
              <div class="detail-value">${data.teamLeaderEmail}</div>
            </div>
            ` : ''}
            ${data.teamLeaderRollNo ? `
            <div class="detail-row">
              <div class="detail-label">Roll Number</div>
              <div class="detail-value">${data.teamLeaderRollNo}</div>
            </div>
            ` : ''}
          </div>
          
          <div class="features">
            <p style="margin: 0 0 15px 0; font-weight: 600; color: #22c55e;">✨ As a team member, you'll be able to:</p>
            <ul style="margin: 0;">
              <li>🤝 Collaborate on project development</li>
              <li>📚 Access shared resources and documents</li>
              <li>📊 Track project progress and milestones</li>
              <li>💬 Communicate with team members and faculty</li>
              <li>🏅 Contribute to team success</li>
            </ul>
          </div>
          
          <div class="action-buttons">
            <h3>👇 Click a button below to respond:</h3>
            <div style="margin-top: 20px;">
              <a href="${acceptLink}" class="btn btn-accept">✅ Accept Invitation</a>
              <a href="${rejectLink}" class="btn btn-reject">❌ Decline Invitation</a>
            </div>
          </div>
          
          <div class="highlight">
            <p style="margin: 0 0 10px 0; font-weight: 600;">🔑 What happens next?</p>
            <ul style="margin: 0;">
              <li><strong>If you Accept:</strong> You'll be redirected to the platform. If you don't have an account, you'll create one first, then see your team member details</li>
              <li><strong>If you Decline:</strong> The team leader will be notified, and you won't be added to the team</li>
              <li>The team leader will be notified of your decision immediately</li>
            </ul>
          </div>
          
          <p style="font-size: 14px; color: #666; margin-top: 30px; text-align: center;">
            If the buttons don't work, copy and paste this link into your browser:
          </p>
          <p style="word-break: break-all; background: #f8f9fa; padding: 15px; border-radius: 5px; font-family: monospace; font-size: 12px; border: 1px solid #dee2e6; text-align: center;">
            ${data.invitationLink}
          </p>
          
          <p style="background: #fff3cd; padding: 15px; border-radius: 8px; border-left: 4px solid #ffc107; margin-top: 25px; font-size: 14px;">
            <strong>⏰ Note:</strong> This invitation will expire in 7 days. Make your decision soon to secure your spot!
          </p>
        </div>
        
        <div class="footer">
          <p style="margin: 0 0 10px 0; font-weight: 600;">Capstone Project Management System</p>
          <p style="margin: 0;">This is an automated message. If you have questions, contact your faculty advisor or the team leader.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
🎓 TEAM INVITATION - CAPSTONE PROJECT
Team Number: ${teamNumber}

Hello ${data.toName}!

${data.fromName} has invited you to join their capstone project team: ${data.teamName}

TEAM DETAILS:
🏆 Team: ${data.teamName}
🔢 Team Number: ${teamNumber}
${data.projectName ? `📋 Project: ${data.projectName}` : ''}

TEAM LEADER DETAILS:
👨‍💼 Name: ${data.fromName}
${data.teamLeaderEmail ? `📧 Email: ${data.teamLeaderEmail}` : ''}
${data.teamLeaderRollNo ? `🎓 Roll Number: ${data.teamLeaderRollNo}` : ''}

As a team member, you'll be able to:
🤝 Collaborate on project development
📚 Access shared resources and documents
📊 Track project progress and milestones
💬 Communicate with team members and faculty

To accept this invitation, visit: ${data.invitationLink}

⏰ Note: This invitation will expire in 7 days. If you don't want to join this team, you can simply ignore this email.

This is an automated message from the Capstone Project Management System.
If you have any questions, please contact your faculty advisor.
  `;

  // Normalize email to lowercase (emails are case-insensitive per RFC)
  const normalizedToEmail = data.toEmail.trim().toLowerCase();
  
  return await sendWorkingEmail({
    to: normalizedToEmail, // Use normalized lowercase email
    subject,
    html,
    text
  });
};

/**
 * Send welcome email to new team members
 */
export const sendWelcomeEmail = async (data: {
  toEmail: string;
  toName: string;
  teamName: string;
  projectName?: string;
  teamMembers: string[];
}): Promise<EmailResult> => {
  const subject = `🎉 Welcome to team "${data.teamName}"!`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to the Team</title>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5; }
        .email-container { background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #56ab2f 0%, #a8e6cf 100%); color: white; padding: 30px; text-align: center; }
        .content { padding: 30px; }
        .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #6c757d; font-size: 14px; }
        .team-info { background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #22c55e; }
        .team-members { background: #e0f2fe; padding: 15px; border-radius: 8px; margin: 15px 0; }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="header">
          <h1>🎉 Welcome to the Team!</h1>
          <p>You're now part of an amazing capstone project team!</p>
        </div>
        <div class="content">
          <h2>Hello ${data.toName}! 👋</h2>
          
          <p>Congratulations! You have successfully joined the capstone project team:</p>
          
          <div class="team-info">
            <h3>🏆 Team: ${data.teamName}</h3>
            ${data.projectName ? `<p><strong>📋 Project:</strong> ${data.projectName}</p>` : ''}
          </div>
          
          <div class="team-members">
            <p><strong>👥 Your Team Members:</strong></p>
            <ul>
              ${data.teamMembers.map(member => `<li>${member}</li>`).join('')}
            </ul>
          </div>
          
          <p>You can now access your team dashboard and start collaborating on your capstone project. Good luck with your project! 🚀</p>
        </div>
        <div class="footer">
          <p>This is an automated message from the Capstone Project Management System.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
🎉 WELCOME TO THE TEAM!

Hello ${data.toName}!

Congratulations! You have successfully joined the capstone project team: ${data.teamName}

${data.projectName ? `Project: ${data.projectName}` : ''}

Your Team Members:
${data.teamMembers.map(member => `👤 ${member}`).join('\n')}

You can now access your team dashboard and start collaborating on your capstone project. Good luck with your project! 🚀

This is an automated message from the Capstone Project Management System.
  `;

  return await sendWorkingEmail({
    to: data.toEmail,
    subject,
    html,
    text
  });
};






