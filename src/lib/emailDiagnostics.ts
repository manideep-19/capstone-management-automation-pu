/**
 * Email Diagnostics Tool
 * Helps diagnose email sending issues
 */

import { getEmailConfig } from './emailConfig';
import emailjs from '@emailjs/browser';

export interface DiagnosticResult {
    success: boolean;
    message: string;
    details: {
        serviceId?: string;
        templateId?: string;
        publicKey?: string;
        error?: string;
        emailjsResponse?: any;
    };
}

/**
 * Test EmailJS configuration
 */
export const testEmailJSConfiguration = async (testEmail: string): Promise<DiagnosticResult> => {
    const emailConfig = getEmailConfig();
    const details: DiagnosticResult['details'] = {
        serviceId: emailConfig.serviceId,
        templateId: emailConfig.templateId,
        publicKey: emailConfig.publicKey?.substring(0, 10) + '...'
    };

    console.log('🔍 ===== EMAIL DIAGNOSTICS =====');
    console.log('📧 Testing EmailJS Configuration...');
    console.log('Service ID:', emailConfig.serviceId);
    console.log('Template ID:', emailConfig.templateId);
    console.log('Public Key:', emailConfig.publicKey?.substring(0, 15) + '...');

    // Check for demo/placeholder values
    const hasDemoServiceId = emailConfig.serviceId === 'service_x2a6fwk';
    const hasDemoTemplateId = emailConfig.templateId === 'template_8h5x8yq';
    const hasDemoPublicKey = emailConfig.publicKey === 'your_public_key' || emailConfig.publicKey === 'LxVqGdVK9IvL-TA1n';

    if (hasDemoServiceId) {
        return {
            success: false,
            message: '❌ Service ID is using demo value. Please update it in emailConfig.ts',
            details: {
                ...details,
                error: 'Demo Service ID detected'
            }
        };
    }

    if (hasDemoTemplateId) {
        return {
            success: false,
            message: '❌ Template ID is using demo/placeholder value. Please create a template in EmailJS and update templateId in emailConfig.ts',
            details: {
                ...details,
                error: 'Demo Template ID detected'
            }
        };
    }

    if (hasDemoPublicKey) {
        return {
            success: false,
            message: '❌ Public Key is using demo/placeholder value. Please get your Public Key from EmailJS dashboard and update publicKey in emailConfig.ts',
            details: {
                ...details,
                error: 'Demo Public Key detected'
            }
        };
    }

    // Try to send a test email
    try {
        console.log('🔄 Initializing EmailJS...');
        emailjs.init(emailConfig.publicKey);

        console.log('📤 Sending test email to:', testEmail);
        const result = await emailjs.send(
            emailConfig.serviceId,
            emailConfig.templateId,
            {
                to_email: testEmail,
                to_name: 'Test User',
                from_name: 'Capstone Project System',
                team_name: 'Test Team',
                invitation_link: 'https://example.com/invitation/test',
                project_name: 'Test Project',
                team_number: 'TEST-001',
                team_leader_email: 'leader@example.com',
                team_leader_rollno: 'TEST001'
            }
        );

        console.log('✅ Test email sent successfully!');
        return {
            success: true,
            message: '✅ EmailJS configuration is working! Test email sent successfully.',
            details: {
                ...details,
                emailjsResponse: result
            }
        };
    } catch (error: any) {
        console.error('❌ Test email failed:', error);
        
        let errorMessage = 'Unknown error';
        if (error?.text) {
            errorMessage = error.text;
        } else if (error?.message) {
            errorMessage = error.message;
        } else if (error?.status) {
            errorMessage = `HTTP ${error.status}: ${error.statusText || 'Unknown error'}`;
        }

        // Provide specific guidance based on error
        let guidance = '';
        if (errorMessage.includes('401') || errorMessage.includes('403') || errorMessage.includes('unauthorized')) {
            guidance = '\n\n💡 This usually means:\n- Your Public Key is incorrect\n- Your Service ID is incorrect\n- Your EmailJS account has restrictions\n\nCheck: EmailJS Dashboard → Account → General → Public Key';
        } else if (errorMessage.includes('template') || errorMessage.includes('404')) {
            guidance = '\n\n💡 This usually means:\n- Your Template ID is incorrect\n- The template doesn\'t exist\n- The template is not published\n\nCheck: EmailJS Dashboard → Email Templates → Your Template → Template ID';
        } else if (errorMessage.includes('service')) {
            guidance = '\n\n💡 This usually means:\n- Your Service ID is incorrect\n- The email service is not connected\n- The service is not active\n\nCheck: EmailJS Dashboard → Email Services → Your Service → Service ID';
        }

        return {
            success: false,
            message: `❌ Test email failed: ${errorMessage}${guidance}`,
            details: {
                ...details,
                error: errorMessage,
                emailjsResponse: error
            }
        };
    }
};

/**
 * Check EmailJS configuration without sending email
 */
export const checkEmailJSConfiguration = (): DiagnosticResult => {
    const emailConfig = getEmailConfig();
    
    const issues: string[] = [];
    const warnings: string[] = [];

    // Check Service ID
    if (!emailConfig.serviceId || emailConfig.serviceId === 'service_x2a6fwk') {
        issues.push('Service ID is missing or using demo value');
    } else if (!emailConfig.serviceId.startsWith('service_')) {
        warnings.push('Service ID format looks incorrect (should start with "service_")');
    }

    // Check Template ID
    if (!emailConfig.templateId || emailConfig.templateId === 'template_8h5x8yq') {
        issues.push('Template ID is missing or using demo/placeholder value');
    } else if (!emailConfig.templateId.startsWith('template_')) {
        warnings.push('Template ID format looks incorrect (should start with "template_")');
    }

    // Check Public Key
    if (!emailConfig.publicKey || emailConfig.publicKey === 'your_public_key' || emailConfig.publicKey === 'LxVqGdVK9IvL-TA1n') {
        issues.push('Public Key is missing or using demo/placeholder value');
    } else if (emailConfig.publicKey.length < 10) {
        warnings.push('Public Key seems too short (should be longer)');
    }

    // Check if enabled
    if (!emailConfig.enabled) {
        issues.push('EmailJS is disabled in configuration');
    }

    const details: DiagnosticResult['details'] = {
        serviceId: emailConfig.serviceId,
        templateId: emailConfig.templateId,
        publicKey: emailConfig.publicKey?.substring(0, 10) + '...'
    };

    if (issues.length > 0) {
        return {
            success: false,
            message: `❌ Configuration Issues Found:\n${issues.map(i => `  • ${i}`).join('\n')}${warnings.length > 0 ? `\n\n⚠️ Warnings:\n${warnings.map(w => `  • ${w}`).join('\n')}` : ''}`,
            details
        };
    }

    if (warnings.length > 0) {
        return {
            success: true,
            message: `⚠️ Configuration looks OK but has warnings:\n${warnings.map(w => `  • ${w}`).join('\n')}`,
            details
        };
    }

    return {
        success: true,
        message: '✅ EmailJS configuration looks good! All required values are set.',
        details
    };
};

