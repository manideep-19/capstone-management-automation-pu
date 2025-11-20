# 📧 How to Set Up EmailJS with Outlook - Step by Step Guide

## Why You're Not Receiving Emails

The issue is that your EmailJS configuration is using **placeholder/demo values** instead of real credentials. The template ID `template_8h5x8yq` and public key `LxVqGdVK9IvL-TA1n` are detected as demo values, so emails aren't being sent.

## ✅ Quick Fix (5 Minutes)

### Step 1: Create EmailJS Account
1. Go to https://www.emailjs.com/
2. Click **"Sign Up"** (it's free)
3. Create an account with your email

### Step 2: Add Outlook Email Service
1. In EmailJS dashboard, click **"Email Services"** (left sidebar)
2. Click **"Add New Service"**
3. Select **"Outlook"** (or "Microsoft 365")
4. Click **"Connect Account"**
5. Sign in with your Outlook account
6. Give it a name (e.g., "Outlook Service")
7. **Copy the Service ID** (looks like `service_abc123xyz`)
   - ✅ You already have: `service_fyepgv9` - check if this is correct!

### Step 3: Create Email Template
1. Click **"Email Templates"** (left sidebar)
2. Click **"Create New Template"**
3. Name it: "Team Invitation"
4. **Subject:** `🎓 Team Invitation - Team {{team_number}} | Capstone Project`
5. **Content:** Copy this template:

```
Hello {{to_name}}! 👋

{{from_name}} has invited you to join their capstone project team!

🏆 Team: {{team_name}}
🔢 Team Number: {{team_number}}

👨‍💼 Team Leader:
Name: {{from_name}}
{{#team_leader_email}}Email: {{team_leader_email}}{{/team_leader_email}}
{{#team_leader_rollno}}Roll Number: {{team_leader_rollno}}{{/team_leader_rollno}}

To accept this invitation, click the link below:
{{invitation_link}}

Or copy and paste this link into your browser:
{{invitation_link}}

⏰ Note: This invitation will expire in 7 days.

---
Capstone Project Management System
This is an automated message.
```

6. **Important:** Make sure these variables are in your template:
   - `{{to_name}}`
   - `{{to_email}}`
   - `{{from_name}}`
   - `{{team_name}}`
   - `{{team_number}}`
   - `{{invitation_link}}`
   - `{{team_leader_email}}` (optional)
   - `{{team_leader_rollno}}` (optional)

7. Click **"Save"**
8. **Copy the Template ID** (looks like `template_abc123xyz`)

### Step 4: Get Your Public Key
1. Click your **profile icon** (top right)
2. Click **"Account"** → **"General"**
3. Find **"Public Key"** (might be called "User ID")
4. **Copy it** (looks like `user_abc123xyz` or a long string)

### Step 5: Update Configuration
1. Open `src/lib/emailConfig.ts`
2. Replace these values:

```typescript
export const EMAIL_CONFIG = {
    serviceId: 'service_fyepgv9',        // ✅ Keep this if it's your service ID
    templateId: 'template_YOUR_NEW_ID',  // ⬅️ Paste your Template ID here
    publicKey: 'YOUR_PUBLIC_KEY',        // ⬅️ Paste your Public Key here
    enabled: true
};
```

3. **Save the file**
4. **Restart your dev server:**
   ```bash
   # Stop server (Ctrl+C)
   npm run dev
   ```

### Step 6: Test It!
1. Go to Student Dashboard → **"Email Setup"** tab
2. Click **"Check Configuration"** - should show ✅
3. Enter your Outlook email
4. Click **"Send Test Email"**
5. Check your Outlook inbox!

## 🔍 Troubleshooting

### "Template ID is using demo value"
- You need to create a template in EmailJS and get the real Template ID
- The placeholder `template_8h5x8yq` won't work

### "Public Key is using demo value"
- Get your Public Key from EmailJS Dashboard → Account → General
- The placeholder `LxVqGdVK9IvL-TA1n` won't work

### "401 Unauthorized" or "403 Forbidden"
- Your Public Key is incorrect
- Your Service ID is incorrect
- Check that your EmailJS account is active

### "Template not found" or "404"
- Your Template ID is incorrect
- The template might not be saved/published
- Make sure you copied the Template ID correctly

### Email sent but not received
- Check spam/junk folder
- Wait a few minutes (sometimes there's a delay)
- Check EmailJS dashboard → "Email Logs" to see if email was sent

## 📋 Quick Checklist

- [ ] EmailJS account created
- [ ] Outlook service added and connected
- [ ] Service ID copied
- [ ] Email template created with all variables
- [ ] Template ID copied
- [ ] Public Key copied
- [ ] `emailConfig.ts` updated with real values
- [ ] Dev server restarted
- [ ] Test email sent successfully

## 🆘 Still Having Issues?

1. **Check Browser Console (F12):**
   - Look for error messages
   - They'll tell you exactly what's wrong

2. **Use the Diagnostics Tool:**
   - Go to Student Dashboard → Email Setup tab
   - Click "Check Configuration"
   - It will show you what's wrong

3. **Check EmailJS Dashboard:**
   - Go to EmailJS → Email Logs
   - See if emails are being sent
   - Check for error messages

4. **Verify Your Outlook Connection:**
   - In EmailJS → Email Services
   - Make sure Outlook service shows "Connected"
   - If not, reconnect it

## 💡 Pro Tips

- **Free tier:** EmailJS free tier allows 200 emails/month
- **Testing:** Always test with your own email first
- **Template:** You can use HTML in your template for better formatting
- **Variables:** Make sure variable names match exactly (case-sensitive)

---

**Once you update the Template ID and Public Key with real values from EmailJS, emails will start working!** ✉️

