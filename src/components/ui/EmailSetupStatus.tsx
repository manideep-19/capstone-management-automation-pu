import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

export const EmailSetupStatus: React.FC = () => {
    const emailConfig = {
        serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID,
        templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
    };

    const isConfigured = emailConfig.serviceId && emailConfig.templateId && emailConfig.publicKey;

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    Email Service Status
                    {isConfigured ? (
                        <Badge className="bg-green-500">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Configured
                        </Badge>
                    ) : (
                        <Badge variant="destructive">
                            <XCircle className="h-3 w-3 mr-1" />
                            Not Configured
                        </Badge>
                    )}
                </CardTitle>
                <CardDescription>Email notification service configuration status</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {isConfigured ? (
                    <Alert>
                        <CheckCircle2 className="h-4 w-4" />
                        <AlertDescription>
                            Email service is properly configured. Team invitations will be sent via email.
                        </AlertDescription>
                    </Alert>
                ) : (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                            Email service is not configured. Please set up EmailJS credentials in your environment variables.
                        </AlertDescription>
                    </Alert>
                )}

                <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between p-2 border rounded">
                        <span className="text-muted-foreground">Service ID:</span>
                        <span className="flex items-center gap-2">
                            {emailConfig.serviceId ? (
                                <>
                                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                                    <span className="font-mono">***{emailConfig.serviceId.slice(-4)}</span>
                                </>
                            ) : (
                                <>
                                    <XCircle className="h-4 w-4 text-red-500" />
                                    <span className="text-muted-foreground">Not set</span>
                                </>
                            )}
                        </span>
                    </div>

                    <div className="flex items-center justify-between p-2 border rounded">
                        <span className="text-muted-foreground">Template ID:</span>
                        <span className="flex items-center gap-2">
                            {emailConfig.templateId ? (
                                <>
                                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                                    <span className="font-mono">***{emailConfig.templateId.slice(-4)}</span>
                                </>
                            ) : (
                                <>
                                    <XCircle className="h-4 w-4 text-red-500" />
                                    <span className="text-muted-foreground">Not set</span>
                                </>
                            )}
                        </span>
                    </div>

                    <div className="flex items-center justify-between p-2 border rounded">
                        <span className="text-muted-foreground">Public Key:</span>
                        <span className="flex items-center gap-2">
                            {emailConfig.publicKey ? (
                                <>
                                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                                    <span className="font-mono">***{emailConfig.publicKey.slice(-4)}</span>
                                </>
                            ) : (
                                <>
                                    <XCircle className="h-4 w-4 text-red-500" />
                                    <span className="text-muted-foreground">Not set</span>
                                </>
                            )}
                        </span>
                    </div>
                </div>

                {!isConfigured && (
                    <div className="mt-4 p-4 bg-muted rounded-lg text-xs space-y-2">
                        <p className="font-semibold">Setup Instructions:</p>
                        <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                            <li>Create an account at EmailJS (https://www.emailjs.com/)</li>
                            <li>Create an email service and template</li>
                            <li>Add the following to your .env file:</li>
                        </ol>
                        <pre className="bg-background p-2 rounded border mt-2">
                            {`VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key`}
                        </pre>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
