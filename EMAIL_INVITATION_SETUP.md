# Email Invitation System Setup Guide

This guide explains how to set up and use the email invitation system for team members in the Capstone Project Management application.

## Features Implemented

### 1. Email Service (`src/lib/emailService.ts`)
- **EmailJS Integration**: Ready for production email sending
- **Browser Notifications**: Fallback notifications for development
- **Multiple Email Types**: Team invitations, welcome emails, project assignments
- **Permission Management**: Automatic notification permission requests

### 2. Invitation Management (`src/lib/invitationService.ts`)
- **Firebase Integration**: Full CRUD operations for invitations
- **Real-time Updates**: Live invitation status tracking
- **Email Integration**: Automatic email sending with invitations
- **Validation**: Prevents duplicate invitations and invalid states

### 3. React Hook (`src/hooks/useInvitations.ts`)
- **State Management**: Centralized invitation state
- **Error Handling**: Comprehensive error management
- **Loading States**: UI feedback during operations
- **Auto-refresh**: Automatic data synchronization

### 4. UI Components
- **InvitationManager**: Complete invitation management interface
- **Invitation Page**: Dedicated page for invitation responses
- **Notification Banner**: User-friendly status notifications

### 5. Email Templates (`src/lib/emailTemplates.ts`)
- **Professional Design**: HTML and text email templates
- **Responsive Layout**: Mobile-friendly email design
- **Branded Styling**: Consistent with application theme
- **Multiple Templates**: Invitation, welcome, and assignment emails

## Setup Instructions

### 1. EmailJS Configuration (Production)

1. **Create EmailJS Account**:
   - Go to [EmailJS.com](https://www.emailjs.com/)
   - Sign up for a free account
   - Create a new service (Gmail, Outlook, etc.)

2. **Create Email Templates**:
   - In EmailJS dashboard, create templates for:
     - Team invitation
     - Welcome email
     - Project assignment

3. **Update Configuration**:
   ```typescript
   // In src/lib/emailService.ts
   const EMAILJS_SERVICE_ID = 'your_service_id';
   const EMAILJS_TEMPLATE_ID = 'your_template_id';
   const EMAILJS_PUBLIC_KEY = 'your_public_key';
   ```

4. **Enable Email Sending**:
   ```typescript
   // Uncomment the actual email sending code in sendTeamInvitationEmail function
   const result = await emailjs.send(
     EMAILJS_SERVICE_ID,
     EMAILJS_TEMPLATE_ID,
     {
       to_email: invitationData.toEmail,
       to_name: invitationData.toName,
       from_name: invitationData.fromName,
       team_name: invitationData.teamName,
       invitation_link: invitationData.invitationLink,
       project_name: invitationData.projectName || 'Capstone Project',
     }
   );
   ```

### 2. Firebase Configuration

1. **Enable Firestore**:
   - Ensure Firestore is enabled in your Firebase project
   - Set up appropriate security rules for invitations collection

2. **Security Rules Example**:
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /invitations/{invitationId} {
         allow read, write: if request.auth != null;
         allow create: if request.auth != null && 
           request.auth.uid == resource.data.inviterId;
         allow update: if request.auth != null && 
           (request.auth.uid == resource.data.invitedUserId || 
            request.auth.uid == resource.data.inviterId);
       }
     }
   }
   ```

### 3. Environment Variables

Create a `.env` file in your project root:
```env
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
```

Update the email service to use environment variables:
```typescript
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
```

## Usage Guide

### For Team Leaders

1. **Send Invitations**:
   - Go to Team Management tab
   - Click "Invite Member"
   - Enter student email address
   - Click "Send Invitation"

2. **Manage Invitations**:
   - View all sent invitations
   - Cancel pending invitations
   - Track invitation status

### For Students

1. **Receive Invitations**:
   - Check "Received Invitations" tab
   - View invitation details
   - Accept or reject invitations

2. **Respond to Invitations**:
   - Click invitation link in email
   - Review team and project details
   - Accept or decline invitation

### For Administrators

1. **Monitor System**:
   - View all invitations in Firebase console
   - Track email delivery status
   - Manage invitation templates

## Email Templates

### Team Invitation Template Variables
- `{{to_name}}` - Recipient's name
- `{{from_name}}` - Sender's name
- `{{team_name}}` - Team name
- `{{invitation_link}}` - Direct invitation link
- `{{project_name}}` - Project name (optional)

### Template Structure
```html
Subject: Invitation to join team "{{team_name}}" - Capstone Project

Hello {{to_name}}!

{{from_name}} has invited you to join their capstone project team: {{team_name}}

[Invitation details and call-to-action button]

Click here to accept: {{invitation_link}}
```

## Development vs Production

### Development Mode
- Uses browser notifications instead of emails
- Simulates email sending with delays
- Logs all email operations to console
- No external service dependencies

### Production Mode
- Sends actual emails via EmailJS
- Real-time invitation tracking
- Professional email templates
- Full error handling and retry logic

## Testing

### Manual Testing
1. Create a team as a student
2. Send invitation to another student
3. Check browser notifications
4. Test invitation acceptance/rejection
5. Verify email templates (in production)

### Automated Testing
```bash
# Run the application
npm run dev

# Test invitation flow
1. Login as student A
2. Create team
3. Send invitation to student B
4. Login as student B
5. Accept invitation
6. Verify team membership
```

## Troubleshooting

### Common Issues

1. **Email Not Sending**:
   - Check EmailJS configuration
   - Verify service and template IDs
   - Check browser console for errors

2. **Invitations Not Appearing**:
   - Check Firebase connection
   - Verify Firestore security rules
   - Check user authentication status

3. **Notification Permission Denied**:
   - Manually enable notifications in browser
   - Check browser notification settings
   - Use email as primary notification method

### Debug Mode
Enable debug logging by setting:
```typescript
const DEBUG_EMAIL = true; // In emailService.ts
```

## Security Considerations

1. **Email Validation**: Always validate email addresses
2. **Rate Limiting**: Implement invitation rate limiting
3. **Expiration**: Set invitation expiration dates
4. **Authentication**: Require user authentication for all operations
5. **Data Privacy**: Follow email privacy regulations

## Future Enhancements

1. **Email Analytics**: Track email open rates and click-through rates
2. **Bulk Invitations**: Send multiple invitations at once
3. **Custom Templates**: Allow users to customize email templates
4. **SMS Notifications**: Add SMS as alternative notification method
5. **Calendar Integration**: Add calendar invites for team meetings

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review Firebase and EmailJS documentation
3. Check browser console for error messages
4. Verify all configuration settings

## License

This email invitation system is part of the Capstone Project Management application and follows the same licensing terms.

