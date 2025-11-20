import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import emailjs from '@emailjs/browser';
import { getEmailConfig } from './lib/emailConfig';

// Initialize EmailJS at app startup
const initializeEmailJS = () => {
  try {
    const emailConfig = getEmailConfig();
    
    // Check if EmailJS is properly configured
    if (emailConfig.enabled && emailConfig.publicKey && 
        emailConfig.publicKey !== 'your_public_key' && 
        emailConfig.publicKey !== 'LxVqGdVK9IvL-TA1n') {
      
      emailjs.init(emailConfig.publicKey);
      console.log('✅ EmailJS initialized successfully');
      console.log('📧 Service ID:', emailConfig.serviceId);
      console.log('📧 Template ID:', emailConfig.templateId);
      console.log('📧 Public Key:', emailConfig.publicKey.substring(0, 10) + '...');
    } else {
      console.warn('⚠️ EmailJS not initialized - missing or invalid Public Key');
      console.warn('📝 Set VITE_EMAILJS_PUBLIC_KEY in .env or update emailConfig.ts');
    }
  } catch (error) {
    console.error('❌ Failed to initialize EmailJS:', error);
  }
};

// Initialize EmailJS before rendering app
initializeEmailJS();

createRoot(document.getElementById('root')!).render(<App />);
