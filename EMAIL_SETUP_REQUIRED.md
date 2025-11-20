# ⚠️ EMAIL SETUP REQUIRED - Emails Are NOT Being Sent!

## 🚨 **CRITICAL ISSUE**

Your application is currently using **DEMO/PLACEHOLDER EmailJS credentials** that do NOT actually send emails. The tracking system shows fake progress, but **no real emails are being delivered**.

## ✅ **QUICK FIX - Set Up EmailJS (5 minutes)**

### Step 1: Create EmailJS Account
1. Go to https://www.emailjs.com/
2. Click "Sign Up" (free account)
3. Verify your email

### Step 2: Create Email Service
1. In EmailJS dashboard, go to "Email Services"
2. Click "Add New Service"
3. Choose your email provider (Gmail recommended)
4. Follow the setup instructions
5. **Copy the SERVICE ID** (e.g., `service_abc123`)

### Step 3: Create Email Template
1. Go to "Email Templates"
2. Click "Create New Template"
3. Use this template:

**Subject:** `🎓 Team Invitation - Team {{team_number}} | Capstone Project`

**Body (HTML):**
```html
<h2>Hello {{to_name}}! 👋</h2>
<p><strong>{{from_name}}</strong> has invited you to join their capstone project team!</p>

<h3>Team Details:</h3>
<ul>
  <li><strong>Team:</strong> {{team_name}}</li>
  <li><strong>Team Number:</strong> {{team_number}}</li>
  <li><strong>Team Leader:</strong> {{from_name}}</li>
</ul>

<p>Click the link below to accept or decline:</p>
<p><a href="{{invitation_link}}">{{invitation_link}}</a></p>

<p>Best regards,<br>Capstone Project Management System</p>
```

4. **Copy the TEMPLATE ID** (e.g., `template_xyz789`)

### Step 4: Get Your Public Key
1. Go to "Account" → "General"
2. Find your **PUBLIC KEY** (e.g., `user_abcd1234`)
3. Copy it

### Step 5: Update Configuration

**Option A: Update `src/lib/emailConfig.ts`**

Open `src/lib/emailConfig.ts` and replace:

```typescript
export const EMAIL_CONFIG = {
    serviceId: 'YOUR_SERVICE_ID_HERE',      // From Step 2
    templateId: 'YOUR_TEMPLATE_ID_HERE',    // From Step 3
    publicKey: 'YOUR_PUBLIC_KEY_HERE',      // From Step 4
    enabled: true
};
```

**Option B: Use Environment Variables (Recommended)**

Create a `.env` file in the project root:

```env
VITE_EMAILJS_SERVICE_ID=your_service_id_here
VITE_EMAILJS_TEMPLATE_ID=your_template_id_here
VITE_EMAILJS_PUBLIC_KEY=your_public_key_here
```

### Step 6: Restart Application
1. Stop the dev server (Ctrl+C)
2. Run: `npm run dev`
3. Try sending an invitation again

## 🧪 **Test Email Sending**

After setup, check the browser console when sending an invitation. You should see:
- ✅ `Email sent via Direct EmailJS API` (success)
- ❌ `EmailJS authentication failed` (if credentials are wrong)

## 📧 **Email Template Variables**

Make sure your EmailJS template includes these variables:
- `{{to_name}}` - Recipient's name
- `{{to_email}}` - Recipient's email
- `{{from_name}}` - Sender's name
- `{{team_name}}` - Team name
- `{{team_number}}` - Team number
- `{{invitation_link}}` - Invitation link
- `{{project_name}}` - Project name (optional)
- `{{team_leader_email}}` - Team leader email (optional)
- `{{team_leader_rollno}}` - Team leader roll number (optional)

## ⚠️ **Current Status**

- ❌ **Emails are NOT being sent** (using demo credentials)
- ✅ **Tracking shows fake progress** (this is misleading)
- ✅ **Invitation links work** (but emails don't arrive)

## 🆘 **Need Help?**

1. Check browser console for error messages
2. Verify EmailJS credentials are correct
3. Make sure EmailJS service is active
4. Check EmailJS dashboard for send logs

---

**Once EmailJS is configured, emails will actually be sent to recipients!**

