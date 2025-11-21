# 📧 Fixing Email Service on Vercel

If your email service is not working after deploying to Vercel, it is likely because the **Environment Variables** are missing. Vercel does not read your local `.env` file for security reasons.

## 🚀 Step-by-Step Fix

### 1. Get Your EmailJS Credentials
If you haven't already, get your credentials from [EmailJS](https://www.emailjs.com/):
1. **Service ID**: Found in the "Email Services" tab.
2. **Template ID**: Found in the "Email Templates" tab.
3. **Public Key**: Found in the "Account" > "General" section.

### 2. Add Environment Variables in Vercel
1. Go to your [Vercel Dashboard](https://vercel.com/dashboard).
2. Select your project (**capstone-Fixed**).
3. Click on the **Settings** tab.
4. Click on **Environment Variables** in the left sidebar.
5. Add the following variables one by one:

| Key | Value |
|-----|-------|
| `VITE_EMAILJS_SERVICE_ID` | Your actual Service ID (e.g., `service_xyz123`) |
| `VITE_EMAILJS_TEMPLATE_ID` | Your actual Template ID (e.g., `template_abc456`) |
| `VITE_EMAILJS_PUBLIC_KEY` | Your actual Public Key (e.g., `user_123456789`) |

> **Note:** Make sure there are no spaces around the values.

### 3. Redeploy Your Project
After adding the environment variables, you must redeploy for them to take effect:
1. Go to the **Deployments** tab in Vercel.
2. Click the three dots (`...`) next to your latest deployment.
3. Select **Redeploy**.
4. Wait for the build to finish.

## 🔍 Verification

Once redeployed:
1. Open your live website.
2. Open the browser console (F12 or Right-click > Inspect > Console).
3. Try sending an invitation.
4. Look for logs starting with `📧` or `✅`.
   - If you see `✅ ===== EMAILJS SEND SUCCESS =====`, it works!
   - If you see `❌`, check the error message in the console.

## 🛠 Troubleshooting

If it still doesn't work:
- **Check Variable Names**: Ensure they are exactly `VITE_EMAILJS_SERVICE_ID`, etc.
- **Check Values**: Ensure you copied the correct IDs and Keys.
- **Check Template**: Ensure your EmailJS template has the correct variables (`{{to_name}}`, `{{invitation_link}}`, etc.).
