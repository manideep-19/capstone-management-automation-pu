import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { checkEmailJSConfiguration, testEmailJSConfiguration } from '@/lib/emailDiagnostics';
import { AlertCircle, CheckCircle2, Loader2, Mail } from 'lucide-react';

export const EmailDiagnostics: React.FC = () => {
    const [testEmail, setTestEmail] = useState('');
    const [isTesting, setIsTesting] = useState(false);
    const [testResult, setTestResult] = useState<any>(null);
    const [configCheck, setConfigCheck] = useState<any>(null);

    const handleCheckConfig = () => {
        const result = checkEmailJSConfiguration();
        setConfigCheck(result);
    };

    const handleTestEmail = async () => {
        if (!testEmail || !testEmail.includes('@')) {
            alert('Please enter a valid email address');
            return;
        }

        setIsTesting(true);
        setTestResult(null);

        try {
            const result = await testEmailJSConfiguration(testEmail);
            setTestResult(result);
        } catch (error: any) {
            setTestResult({
                success: false,
                message: `Error: ${error?.message || error}`,
                details: { error: error?.message || 'Unknown error' }
            });
        } finally {
            setIsTesting(false);
        }
    };

    return (
        <div className="space-y-4">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Mail className="h-5 w-5" />
                        Email Configuration Diagnostics
                    </CardTitle>
                    <CardDescription>
                        Check your EmailJS configuration and test email sending
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Configuration Check */}
                    <div className="space-y-2">
                        <Button onClick={handleCheckConfig} variant="outline" className="w-full">
                            Check Configuration
                        </Button>
                        {configCheck && (
                            <Alert className={configCheck.success ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}>
                                <div className="flex items-start gap-2">
                                    {configCheck.success ? (
                                        <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                                    ) : (
                                        <AlertCircle className="h-4 w-4 text-red-600 mt-0.5" />
                                    )}
                                    <AlertDescription className="whitespace-pre-line">
                                        {configCheck.message}
                                        {configCheck.details && (
                                            <div className="mt-2 text-xs">
                                                <div>Service ID: {configCheck.details.serviceId || 'Not set'}</div>
                                                <div>Template ID: {configCheck.details.templateId || 'Not set'}</div>
                                                <div>Public Key: {configCheck.details.publicKey || 'Not set'}</div>
                                            </div>
                                        )}
                                    </AlertDescription>
                                </div>
                            </Alert>
                        )}
                    </div>

                    {/* Test Email */}
                    <div className="space-y-2">
                        <Label htmlFor="testEmail">Test Email Address</Label>
                        <div className="flex gap-2">
                            <Input
                                id="testEmail"
                                type="email"
                                value={testEmail}
                                onChange={(e) => setTestEmail(e.target.value)}
                                placeholder="your.email@outlook.com"
                            />
                            <Button 
                                onClick={handleTestEmail} 
                                disabled={isTesting || !testEmail}
                            >
                                {isTesting ? (
                                    <>
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        Testing...
                                    </>
                                ) : (
                                    'Send Test Email'
                                )}
                            </Button>
                        </div>
                        {testResult && (
                            <Alert className={testResult.success ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}>
                                <div className="flex items-start gap-2">
                                    {testResult.success ? (
                                        <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                                    ) : (
                                        <AlertCircle className="h-4 w-4 text-red-600 mt-0.5" />
                                    )}
                                    <AlertDescription className="whitespace-pre-line">
                                        {testResult.message}
                                        {testResult.details?.error && (
                                            <div className="mt-2 text-xs font-mono bg-white p-2 rounded">
                                                {testResult.details.error}
                                            </div>
                                        )}
                                    </AlertDescription>
                                </div>
                            </Alert>
                        )}
                    </div>

                    {/* Setup Instructions */}
                    <Alert className="bg-blue-50 border-blue-200">
                        <AlertCircle className="h-4 w-4 text-blue-600" />
                        <AlertDescription className="text-blue-800">
                            <strong>📧 Need to set up EmailJS?</strong>
                            <ol className="list-decimal list-inside mt-2 space-y-1 text-sm">
                                <li>Go to <a href="https://www.emailjs.com/" target="_blank" rel="noopener noreferrer" className="underline">emailjs.com</a> and create an account</li>
                                <li>Add an email service (Gmail, Outlook, etc.)</li>
                                <li>Create an email template with variables: to_email, to_name, from_name, team_name, invitation_link</li>
                                <li>Get your Service ID, Template ID, and Public Key</li>
                                <li>Update <code className="bg-blue-100 px-1 rounded">src/lib/emailConfig.ts</code> with your credentials</li>
                            </ol>
                        </AlertDescription>
                    </Alert>
                </CardContent>
            </Card>
        </div>
    );
};

