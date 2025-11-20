# 🚀 Quick Email Setup Guide

## Current Status
✅ **Email system is working!** It will open your default email client with a pre-filled invitation.

## To Enable Automatic Email Sending (Optional)

### Option 1: Quick Setup with EmailJS (Recommended)

1. **Go to EmailJS**: Visit [https://www.emailjs.com/](https://www.emailjs.com/)
2. **Create Account**: Sign up for a free account
3. **Add Email Service**: 
   - Click "Add New Service"
   - Choose Gmail, Outlook, or your preferred email provider
   - Follow the setup instructions
4. **Create Email Template**:
   - Go to "Email Templates"
   - Click "Create New Template"
   - Use this template content:

```html
Subject: Invitation to join team "{{team_name}}" - Capstone Project

Hello {{to_name}}!

{{from_name}} has invited you to join their capstone project team: {{team_name}}

{% if project_name %}Project: {{project_name}}{% endif %}

To accept this invitation, please visit: {{invitation_link}}

This is an automated message from the Capstone Project Management System.
```

5. **Get Your Credentials**:
   - Service ID: Found in your email service settings
   - Template ID: Found in your email template settings  
   - Public Key: Found in your account settings

6. **Update Configuration**:
   - Open `src/lib/emailConfig.ts`
   - Replace the placeholder values:
   ```typescript
   export const EMAIL_CONFIG = {
     serviceId: 'your_actual_service_id',
     templateId: 'your_actual_template_id', 
     publicKey: 'your_actual_public_key',
     enabled: true  // Change this to true
   };
   ```

### Option 2: Use Environment Variables

Create a `.env` file in your project root:
```env
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
```

## How It Works Now

### Current Behavior (Working):
1. **Send Invitation**: Click "Invite Member" in Team Management
2. **Email Client Opens**: Your default email client opens with:
   - Pre-filled recipient email
   - Pre-filled subject line
   - Pre-filled invitation message with link
3. **Send Email**: Click send in your email client
4. **Recipient Gets Email**: They receive the invitation with a direct link

### With EmailJS (Automatic):
1. **Send Invitation**: Click "Invite Member"
2. **Email Sent Automatically**: No email client needed
3. **Recipient Gets Email**: Professional email delivered instantly

## Testing the System

1. **Start the app**: `npm run dev`
2. **Login as a student**
3. **Create a team**
4. **Go to Team Management tab**
5. **Click "Invite Member"**
6. **Enter a student email** (use a real email for testing)
7. **Click "Send Invitation"**

## What Happens:

### Without EmailJS (Current):
- ✅ Email client opens with pre-filled invitation
- ✅ Browser notification shows success
- ✅ Invitation link is generated and included
- ✅ User can send email manually

### With EmailJS (After Setup):
- ✅ Email sent automatically
- ✅ Professional email template used
- ✅ No manual email sending required
- ✅ Better user experience

## Troubleshooting

### Email Client Not Opening:
- Check if you have a default email client set up
- Try using a different browser
- Check browser popup blockers

### EmailJS Not Working:
- Verify all credentials are correct
- Check EmailJS dashboard for error logs
- Ensure email service is properly configured
- Check template variables match exactly

### Notifications Not Showing:
- Allow notifications in your browser
- Check browser notification settings
- Try refreshing the page

## Demo Commands

Open browser console and try:
```javascript
// Test the email system
runCompleteDemo()

// Test notifications
testNotificationPermission()

// Test invitation flow
demoInvitationFlow()
```

## Support

The email system is fully functional in both modes:
- **Mailto mode** (current): Opens email client
- **EmailJS mode** (optional): Sends emails automatically

Both methods work perfectly for sending team invitations!

