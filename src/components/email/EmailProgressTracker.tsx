import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
    Mail,
    Send,
    CheckCircle,
    Eye,
    MousePointer,
    UserCheck,
    UserX,
    Clock,
    AlertCircle
} from 'lucide-react';
import { EmailProgress } from '@/lib/emailTrackingService';
import { realTimeProgressService } from '@/lib/realTimeProgressService';

interface EmailProgressTrackerProps {
    invitationId: string;
    teamName: string;
    teamNumber: string;
    recipientName: string;
    recipientEmail: string;
    onProgressComplete?: (status: 'accepted' | 'rejected') => void;
}

export const EmailProgressTracker: React.FC<EmailProgressTrackerProps> = ({
    invitationId,
    teamName,
    teamNumber,
    recipientName,
    recipientEmail,
    onProgressComplete
}) => {
    const [progress, setProgress] = useState<EmailProgress | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Start real-time tracking for this invitation
        const startTracking = () => {
            setIsLoading(true);

            // Start tracking with real-time service
            realTimeProgressService.startTracking(
                invitationId,
                teamName,
                teamNumber,
                recipientName,
                recipientEmail
            );

            // Subscribe to progress updates
            const unsubscribe = realTimeProgressService.subscribe(invitationId, (progress) => {
                setProgress(progress);
                setIsLoading(false);

                // Handle completion
                if (progress.status === 'accepted' || progress.status === 'rejected') {
                    onProgressComplete?.(progress.status);
                }
            });

            // Cleanup subscription on unmount
            return unsubscribe;
        };

        const unsubscribe = startTracking();
        return unsubscribe;
    }, [invitationId, teamName, teamNumber, recipientName, recipientEmail, onProgressComplete]);

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'sending':
                return <Send className="h-4 w-4 text-blue-500" />;
            case 'sent':
                return <Mail className="h-4 w-4 text-blue-500" />;
            case 'delivered':
                return <CheckCircle className="h-4 w-4 text-green-500" />;
            case 'opened':
                return <Eye className="h-4 w-4 text-green-500" />;
            case 'clicked':
                return <MousePointer className="h-4 w-4 text-green-500" />;
            case 'accepted':
                return <UserCheck className="h-4 w-4 text-green-500" />;
            case 'rejected':
                return <UserX className="h-4 w-4 text-red-500" />;
            case 'expired':
                return <AlertCircle className="h-4 w-4 text-orange-500" />;
            default:
                return <Clock className="h-4 w-4 text-gray-500" />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'sending':
            case 'sent':
                return 'bg-blue-100 text-blue-800';
            case 'delivered':
            case 'opened':
            case 'clicked':
                return 'bg-green-100 text-green-800';
            case 'accepted':
                return 'bg-green-100 text-green-800';
            case 'rejected':
                return 'bg-red-100 text-red-800';
            case 'expired':
                return 'bg-orange-100 text-orange-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusMessage = (status: string) => {
        switch (status) {
            case 'sending':
                return 'Preparing email invitation...';
            case 'sent':
                return 'Email sent successfully';
            case 'delivered':
                return 'Email delivered to recipient';
            case 'opened':
                return 'Email opened by recipient';
            case 'clicked':
                return 'Recipient clicked invitation link';
            case 'accepted':
                return 'Invitation accepted! Team member added.';
            case 'rejected':
                return 'Invitation declined by recipient';
            case 'expired':
                return 'Invitation has expired';
            default:
                return 'Processing...';
        }
    };

    if (isLoading && !progress) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Mail className="h-5 w-5" />
                        Email Progress Tracking
                    </CardTitle>
                    <CardDescription>
                        Tracking invitation to {recipientName} ({recipientEmail})
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p>Initializing email tracking...</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (!progress) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Mail className="h-5 w-5" />
                        Email Progress Tracking
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                            No progress data available for this invitation.
                        </AlertDescription>
                    </Alert>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Mail className="h-5 w-5" />
                    Email Progress Tracking
                </CardTitle>
                <CardDescription>
                    Tracking invitation to {recipientName} ({recipientEmail})
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Progress Bar */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Progress</span>
                        <span className="text-sm text-muted-foreground">{progress.progress}%</span>
                    </div>
                    <Progress value={progress.progress} className="h-2" />
                </div>

                {/* Current Status */}
                <div className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
                    {getStatusIcon(progress.status)}
                    <div className="flex-1">
                        <div className="flex items-center gap-2">
                            <span className="font-medium">{getStatusMessage(progress.status)}</span>
                            <Badge className={getStatusColor(progress.status)}>
                                {progress.status}
                            </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                            {progress.message}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                            Last updated: {progress.timestamp.toLocaleString()}
                        </p>
                    </div>
                </div>

                {/* Team Information */}
                <div className="bg-blue-50 p-3 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">Team Details</h4>
                    <div className="text-sm text-blue-800 space-y-1">
                        <p><strong>Team:</strong> {teamName}</p>
                        <p><strong>Team Number:</strong> {teamNumber}</p>
                        <p><strong>Recipient:</strong> {recipientName}</p>
                        <p><strong>Email:</strong> {recipientEmail}</p>
                    </div>
                </div>

                {/* Progress Steps */}
                <div className="space-y-2">
                    <h4 className="font-medium">Progress Steps</h4>
                    <div className="space-y-2">
                        {[
                            { status: 'sending', label: 'Sending Email', completed: progress.status === 'sending' || progress.status === 'sent' || progress.status === 'clicked' || progress.status === 'accepted' || progress.status === 'rejected' },
                            { status: 'sent', label: 'Email Sent', completed: progress.status === 'sent' || progress.status === 'clicked' || progress.status === 'accepted' || progress.status === 'rejected' },
                            { status: 'clicked', label: 'Link Clicked', completed: progress.status === 'clicked' || progress.status === 'accepted' || progress.status === 'rejected' },
                            { status: 'accepted', label: 'Invitation Accepted', completed: progress.status === 'accepted' },
                            { status: 'rejected', label: 'Invitation Rejected', completed: progress.status === 'rejected' }
                        ].map((step, index) => (
                            <div key={index} className="flex items-center space-x-2">
                                <div className={`w-4 h-4 rounded-full flex items-center justify-center ${step.completed ? 'bg-green-500 text-white' : 'bg-gray-300'
                                    }`}>
                                    {step.completed && <CheckCircle className="h-3 w-3" />}
                                </div>
                                <span className={`text-sm ${step.completed ? 'text-green-700 font-medium' : 'text-gray-500'
                                    }`}>
                                    {step.label}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Final Status */}
                {(progress.status === 'accepted' || progress.status === 'rejected') && (
                    <Alert className={progress.status === 'accepted' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
                        <AlertDescription className={progress.status === 'accepted' ? 'text-green-800' : 'text-red-800'}>
                            <strong>
                                {progress.status === 'accepted' ? '🎉 Invitation Accepted!' : '❌ Invitation Declined'}
                            </strong>
                            <br />
                            {progress.status === 'accepted'
                                ? `${recipientName} has joined your team ${teamName}.`
                                : `${recipientName} has declined your invitation to join team ${teamName}.`
                            }
                        </AlertDescription>
                    </Alert>
                )}
            </CardContent>
        </Card>
    );
};
