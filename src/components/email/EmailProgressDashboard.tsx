import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
    AlertCircle,
    TrendingUp,
    Activity
} from 'lucide-react';
import { EmailProgress } from '@/lib/emailTrackingService';

interface EmailProgressDashboardProps {
    teamId: string;
    teamName: string;
    teamNumber: string;
}

export const EmailProgressDashboard: React.FC<EmailProgressDashboardProps> = ({
    teamId,
    teamName,
    teamNumber
}) => {
    const [progresses, setProgresses] = useState<EmailProgress[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Load real email progresses from invitations
        const loadProgresses = async () => {
            setIsLoading(true);

            // In a real implementation, you would fetch from your database
            // For now, we'll start with an empty array and let real invitations populate it
            setProgresses([]);
            setIsLoading(false);
        };

        loadProgresses();
    }, [teamId, teamName, teamNumber]);

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

    const activeProgresses = progresses.filter(p => p.status !== 'accepted' && p.status !== 'rejected');
    const completedProgresses = progresses.filter(p => p.status === 'accepted' || p.status === 'rejected');
    const acceptedCount = progresses.filter(p => p.status === 'accepted').length;
    const rejectedCount = progresses.filter(p => p.status === 'rejected').length;

    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Activity className="h-5 w-5" />
                        Email Progress Dashboard
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p>Loading email progress...</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Total Invitations
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{progresses.length}</div>
                        <p className="text-xs text-muted-foreground">
                            All time invitations sent
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Accepted
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">{acceptedCount}</div>
                        <p className="text-xs text-muted-foreground">
                            Team members joined
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Rejected
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">{rejectedCount}</div>
                        <p className="text-xs text-muted-foreground">
                            Invitations declined
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Progress Tabs */}
            <Tabs defaultValue="active" className="w-full">
                <TabsList>
                    <TabsTrigger value="active">Active Progress</TabsTrigger>
                    <TabsTrigger value="completed">Completed</TabsTrigger>
                    <TabsTrigger value="all">All Invitations</TabsTrigger>
                </TabsList>

                <TabsContent value="active" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <TrendingUp className="h-5 w-5" />
                                Active Email Progress
                            </CardTitle>
                            <CardDescription>
                                Track the progress of pending invitations
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {activeProgresses.length === 0 ? (
                                <div className="text-center py-8 text-muted-foreground">
                                    <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                    <p>No email progress to track</p>
                                    <p className="text-sm">Send invitations to see progress tracking</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {activeProgresses.map((progress) => (
                                        <div key={progress.id} className="space-y-3">
                                            {/* Progress Header */}
                                            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                                                <div className="flex items-center space-x-3">
                                                    {getStatusIcon(progress.status)}
                                                    <div>
                                                        <p className="font-medium">{progress.recipientName}</p>
                                                        <p className="text-sm text-muted-foreground">
                                                            {progress.recipientEmail}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <Badge className={getStatusColor(progress.status)}>
                                                        {progress.status}
                                                    </Badge>
                                                </div>
                                            </div>

                                            {/* Progress Bar */}
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm font-medium">Progress</span>
                                                    <span className="text-sm text-muted-foreground">{progress.progress}%</span>
                                                </div>
                                                <Progress value={progress.progress} className="h-2" />
                                            </div>

                                            {/* Status Message */}
                                            <div className="p-3 bg-blue-50 rounded-lg">
                                                <p className="text-sm text-blue-800">
                                                    <strong>{getStatusMessage(progress.status)}</strong>
                                                </p>
                                                <p className="text-xs text-blue-600 mt-1">
                                                    Last updated: {progress.timestamp.toLocaleString()}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="completed" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <CheckCircle className="h-5 w-5" />
                                Completed Invitations
                            </CardTitle>
                            <CardDescription>
                                Invitations that have been accepted or rejected
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {completedProgresses.length === 0 ? (
                                <div className="text-center py-8 text-muted-foreground">
                                    <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                    <p>No completed invitations</p>
                                    <p className="text-sm">Send invitations to see completed responses</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {completedProgresses.map((progress) => (
                                        <div key={progress.id} className="flex items-center justify-between p-3 border rounded-lg">
                                            <div className="flex items-center space-x-3">
                                                {getStatusIcon(progress.status)}
                                                <div>
                                                    <p className="font-medium">{progress.recipientName}</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {progress.recipientEmail}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {progress.timestamp.toLocaleString()}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Badge className={getStatusColor(progress.status)}>
                                                    {progress.status}
                                                </Badge>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="all" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Mail className="h-5 w-5" />
                                All Email Progress
                            </CardTitle>
                            <CardDescription>
                                Complete history of all email invitations
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {progresses.map((progress) => (
                                    <div key={progress.id} className="flex items-center justify-between p-3 border rounded-lg">
                                        <div className="flex items-center space-x-3">
                                            {getStatusIcon(progress.status)}
                                            <div>
                                                <p className="font-medium">{progress.recipientName}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {progress.recipientEmail}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {progress.timestamp.toLocaleString()}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Badge className={getStatusColor(progress.status)}>
                                                {progress.status}
                                            </Badge>
                                            {progress.status !== 'accepted' && progress.status !== 'rejected' && (
                                                <div className="w-16">
                                                    <Progress value={progress.progress} className="h-1" />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};
