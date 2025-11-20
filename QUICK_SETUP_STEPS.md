# 🚀 QUICK SETUP - Get Your EmailJS Credentials in 3 Steps

## ⚡ Super Quick Guide

### Step 1: Get Template ID (2 minutes)
1. Go to: https://www.emailjs.com/
2. Login to your account
3. Click **"Email Templates"** (left sidebar)
4. Click **"Create New Template"**
5. Copy the template from `EMAILJS_TEMPLATE_READY_TO_COPY.txt` file
6. Paste it into EmailJS template editor
7. Click **"Save"**
8. **Copy the Template ID** (shown after saving, looks like `template_abc123`)

### Step 2: Get Public Key (30 seconds)
1. In EmailJS dashboard, click your **profile icon** (top right)
2. Click **"Account"** → **"General"**
3. Find **"Public Key"** (or "User ID")
4. **Copy it** (looks like `user_abc123` or `LxVqGdVK9IvL-TA1n`)

### Step 3: Update Config (30 seconds)
1. Open: `src/lib/emailConfig.ts`
2. Replace these two lines:

```typescript
templateId: 'template_8h5x8yq',  // ← Paste your Template ID here
publicKey: 'LxVqGdVK9IvL-TA1n',  // ← Paste your Public Key here
```

3. Save the file
4. Restart your dev server: `npm run dev`
5. **Done!** Try sending an invitation now! 🎉

---

## 📋 What You Need:

✅ Service ID: `service_fyepgv9` (you already have this!)
⚠️ Template ID: Get from Step 1 above
⚠️ Public Key: Get from Step 2 above

---

## 🆘 Can't Find It?

**Template ID:**
- After saving template, it's shown on the template page
- Or check the URL when editing the template
- Usually starts with `template_`

**Public Key:**
- Account → General → Public Key
- Might be called "User ID" instead
- Usually starts with `user_` or is a long string

---

**That's it! Once you have both values, paste them in `emailConfig.ts` and emails will work!** ✉️

