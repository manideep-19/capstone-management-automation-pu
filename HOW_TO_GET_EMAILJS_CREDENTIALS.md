# 📧 How to Get EmailJS Template ID and Public Key

## Step-by-Step Guide to Get Your EmailJS Credentials

### 🎯 **Step 1: Log in to EmailJS**

1. Go to https://www.emailjs.com/
2. Click **"Sign In"** (or create an account if you don't have one)
3. Log in with your credentials

---

### 🔑 **Step 2: Get Your Public Key (User ID)**

1. Once logged in, click on your **profile/account icon** (usually top right)
2. Go to **"Account"** → **"General"** (or look for "API Keys" section)
3. You'll see your **Public Key** (also called User ID)
   - It looks like: `user_abc123xyz` or `LxVqGdVK9IvL-TA1n`
   - It might be labeled as "Public Key" or "User ID"
4. **Copy this value** - this is your `publicKey`

**Visual Guide:**
```
EmailJS Dashboard
  └─ Account (top right)
      └─ General
          └─ Public Key: user_abc123xyz  ← Copy this!
```

---

### 📝 **Step 3: Create an Email Template (if you don't have one)**

1. In the EmailJS dashboard, click **"Email Templates"** in the left sidebar
2. Click **"Create New Template"** button
3. Fill in the template details:

   **Template Name:** `Team Invitation` (or any name you like)
   
   **Subject:** 
   ```
   🎓 Team Invitation - Team {{team_number}} | Capstone Project
   ```

   **Content (HTML):**
   ```html
   <!DOCTYPE html>
   <html>
   <head>
     <meta charset="utf-8">
     <style>
       body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
       .container { max-width: 600px; margin: 0 auto; padding: 20px; }
       .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
       .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
       .button { display: inline-block; padding: 15px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
       .info-box { background: #e3f2fd; padding: 15px; border-radius: 5px; margin: 15px 0; }
     </style>
   </head>
   <body>
     <div class="container">
       <div class="header">
         <h1>🎓 You're Invited to Join a Team!</h1>
         <p>Team Number: <strong>{{team_number}}</strong></p>
       </div>
       <div class="content">
         <h2>Hello {{to_name}}! 👋</h2>
         <p><strong>{{from_name}}</strong> has invited you to join their capstone project team!</p>
         
         <div class="info-box">
           <h3>🏆 Team: {{team_name}}</h3>
           <p><strong>Team Number:</strong> {{team_number}}</p>
           <p><strong>Team Leader:</strong> {{from_name}}</p>
           {{#if project_name}}
           <p><strong>Project:</strong> {{project_name}}</p>
           {{/if}}
         </div>
         
         <p>Click the button below to accept or decline this invitation:</p>
         <a href="{{invitation_link}}" class="button">View Invitation</a>
         
         <p style="margin-top: 30px; font-size: 14px; color: #666;">
           Or copy and paste this link into your browser:<br>
           <span style="word-break: break-all; color: #667eea;">{{invitation_link}}</span>
         </p>
         
         <p style="margin-top: 20px; padding: 15px; background: #fff3cd; border-radius: 5px;">
           <strong>⏰ Note:</strong> This invitation will expire in 7 days.
         </p>
       </div>
     </div>
   </body>
   </html>
   ```

   **Content (Plain Text - for email clients that don't support HTML):**
   ```
   🎓 TEAM INVITATION - CAPSTONE PROJECT
   Team Number: {{team_number}}
   
   Hello {{to_name}}!
   
   {{from_name}} has invited you to join their capstone project team: {{team_name}}
   
   TEAM DETAILS:
   🏆 Team: {{team_name}}
   🔢 Team Number: {{team_number}}
   👨‍💼 Team Leader: {{from_name}}
   
   To accept this invitation, visit: {{invitation_link}}
   
   ⏰ Note: This invitation will expire in 7 days.
   
   Best regards,
   Capstone Project Management System
   ```

4. **Important:** Make sure your template includes these variables:
   - `{{to_name}}` - Recipient's name
   - `{{to_email}}` - Recipient's email (if needed)
   - `{{from_name}}` - Sender's name
   - `{{team_name}}` - Team name
   - `{{team_number}}` - Team number
   - `{{invitation_link}}` - Invitation link
   - `{{project_name}}` - Project name (optional)
   - `{{team_leader_email}}` - Team leader email (optional)
   - `{{team_leader_rollno}}` - Team leader roll number (optional)

5. Click **"Save"** button

---

### 🆔 **Step 4: Get Your Template ID**

1. After saving your template, you'll be taken back to the templates list
2. Find your template in the list
3. Click on it to open it
4. Look for the **Template ID** - it's usually shown at the top or in the URL
   - It looks like: `template_abc123xyz` or `template_8h5x8yq`
   - It might be labeled as "Template ID" or shown in the template settings
5. **Copy this value** - this is your `templateId`

**Alternative way to find Template ID:**
- In the templates list, hover over your template
- The Template ID might be shown in a tooltip or in the template card
- Or click "Edit" on your template and check the URL - it might contain the template ID

**Visual Guide:**
```
EmailJS Dashboard
  └─ Email Templates
      └─ Your Template: "Team Invitation"
          └─ Template ID: template_abc123xyz  ← Copy this!
```

---

### ✅ **Step 5: Update Your Configuration**

Now that you have both values, update `src/lib/emailConfig.ts`:

```typescript
export const EMAIL_CONFIG = {
    serviceId: 'service_fyepgv9',        // ✅ You already have this
    templateId: 'template_abc123xyz',   // ✅ Paste your Template ID here
    publicKey: 'user_abc123xyz',         // ✅ Paste your Public Key here
    enabled: true
};
```

**Example:**
```typescript
export const EMAIL_CONFIG = {
    serviceId: 'service_fyepgv9',
    templateId: 'template_xyz789',      // Your actual template ID
    publicKey: 'user_LxVqGdVK9IvL',     // Your actual public key
    enabled: true
};
```

---

### 🧪 **Step 6: Test It**

1. Save the `emailConfig.ts` file
2. Restart your development server:
   ```bash
   # Stop the server (Ctrl+C)
   npm run dev
   ```
3. Try sending an invitation
4. Check the browser console (F12) for any errors
5. Check the recipient's email inbox!

---

### 🆘 **Troubleshooting**

**Can't find Public Key?**
- Look in "Account Settings" → "General"
- It might be called "User ID" instead of "Public Key"
- Check the EmailJS documentation: https://www.emailjs.com/docs/

**Can't find Template ID?**
- Click on your template to edit it
- Check the URL - it might contain the template ID
- Look in the template settings/options
- The template ID is usually visible in the template list or when editing

**Template variables not working?**
- Make sure you use double curly braces: `{{variable_name}}`
- Variable names are case-sensitive
- Check that your template includes all required variables

**Still having issues?**
- Check the browser console (F12) for error messages
- Make sure all three values (Service ID, Template ID, Public Key) are correct
- Verify your EmailJS service is active and connected
- Check EmailJS dashboard → Email Services to make sure your service is set up

---

### 📸 **Quick Reference**

**Where to find each credential:**

| Credential | Where to Find |
|------------|---------------|
| **Service ID** | Email Services → Your Service → Service ID |
| **Template ID** | Email Templates → Your Template → Template ID |
| **Public Key** | Account → General → Public Key |

**All three are needed for emails to work!**

---

**Need more help?** Check the EmailJS documentation: https://www.emailjs.com/docs/

