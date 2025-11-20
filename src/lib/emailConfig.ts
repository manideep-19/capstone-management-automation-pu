/**
 * Email configuration for the invitation system
 * Update these values to enable actual email sending
 */

// EmailJS Configuration
// Get these values from https://www.emailjs.com/
export const EMAIL_CONFIG = {
    // Replace with your actual EmailJS service ID
    serviceId: 'service_fyepgv9', // Your EmailJS service ID

    // Replace with your actual EmailJS template ID
    templateId: 'template_8h5x8yq', // TODO: Replace with your template ID

    // Replace with your actual EmailJS public key
    publicKey: 'LxVqGdVK9IvL-TA1n', // TODO: Replace with your public key

    // Set to true to enable EmailJS (requires valid configuration above)
    enabled: true // Enable working email service
};

// Alternative: Use environment variables
export const getEmailConfig = () => {
    return {
        serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID || EMAIL_CONFIG.serviceId,
        templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID || EMAIL_CONFIG.templateId,
        publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY || EMAIL_CONFIG.publicKey,
        enabled: EMAIL_CONFIG.enabled || !!import.meta.env.VITE_EMAILJS_PUBLIC_KEY
    };
};

// Quick setup instructions
export const EMAIL_SETUP_INSTRUCTIONS = `
📧 Email Setup Instructions:

1. Go to https://www.emailjs.com/ and create a free account
2. Create a new email service (Gmail, Outlook, etc.)
3. Create an email template with these variables:
   - {{to_name}} - Recipient's name
   - {{from_name}} - Sender's name
   - {{team_name}} - Team name
   - {{invitation_link}} - Direct invitation link
   - {{project_name}} - Project name (optional)

4. Update the configuration in src/lib/emailConfig.ts:
   - Set serviceId to your EmailJS service ID
   - Set templateId to your EmailJS template ID
   - Set publicKey to your EmailJS public key
   - Set enabled to true

5. Or use environment variables:
   - VITE_EMAILJS_SERVICE_ID=your_service_id
   - VITE_EMAILJS_TEMPLATE_ID=your_template_id
   - VITE_EMAILJS_PUBLIC_KEY=your_public_key

Current Status: ${EMAIL_CONFIG.enabled ? '✅ EmailJS Enabled' : '⚠️ Using mailto fallback'}
`;

// Log setup instructions in development
if (import.meta.env.DEV) {
    console.log(EMAIL_SETUP_INSTRUCTIONS);
}

