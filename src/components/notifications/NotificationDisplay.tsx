import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Bell, CheckCircle, XCircle, Users, Mail } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface Notification {
    id: string;
    type: 'invitation_accepted' | 'invitation_rejected' | 'team_member_added';
    title: string;
    message: string;
    timestamp: Date;
    isRead: boolean;
    teamName: string;
    teamNumber: string;
    memberName: string;
    memberEmail: string;
}

export const NotificationDisplay: React.FC = () => {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // Simulate loading notifications (in a real app, this would fetch from an API)
    useEffect(() => {
        const loadNotifications = () => {
            setIsLoading(true);

            // Simulate some demo notifications
            const demoNotifications: Notification[] = [
                {
                    id: '1',
                    type: 'invitation_accepted',
                    title: '🎉 Team Member Joined!',
                    message: 'John Doe has accepted your invitation to join Team Alpha',
                    timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
                    isRead: false,
                    teamName: 'Team Alpha',
                    teamNumber: 'T123456',
                    memberName: 'John Doe',
                    memberEmail: 'john.doe@presidencyuniversity.in'
                },
                {
                    id: '2',
                    type: 'invitation_rejected',
                    title: '❌ Invitation Declined',
                    message: 'Sarah Smith has declined your invitation to join Team Alpha',
                    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
                    isRead: true,
                    teamName: 'Team Alpha',
                    teamNumber: 'T123456',
                    memberName: 'Sarah Smith',
                    memberEmail: 'sarah.smith@presidencyuniversity.in'
                }
            ];

            setNotifications(demoNotifications);
            setIsLoading(false);
        };

        loadNotifications();
    }, []);

    const markAsRead = (notificationId: string) => {
        setNotifications(prev =>
            prev.map(notif =>
                notif.id === notificationId
                    ? { ...notif, isRead: true }
                    : notif
            )
        );
    };

    const markAllAsRead = () => {
        setNotifications(prev =>
            prev.map(notif => ({ ...notif, isRead: true }))
        );
    };

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case 'invitation_accepted':
                return <CheckCircle className="h-4 w-4 text-green-500" />;
            case 'invitation_rejected':
                return <XCircle className="h-4 w-4 text-red-500" />;
            case 'team_member_added':
                return <Users className="h-4 w-4 text-blue-500" />;
            default:
                return <Bell className="h-4 w-4 text-gray-500" />;
        }
    };

    const getNotificationColor = (type: string) => {
        switch (type) {
            case 'invitation_accepted':
                return 'border-green-200 bg-green-50';
            case 'invitation_rejected':
                return 'border-red-200 bg-red-50';
            case 'team_member_added':
                return 'border-blue-200 bg-blue-50';
            default:
                return 'border-gray-200 bg-gray-50';
        }
    };

    const unreadCount = notifications.filter(n => !n.isRead).length;

    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Bell className="h-5 w-5" />
                        Notifications
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p>Loading notifications...</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                        <Bell className="h-5 w-5" />
                        Notifications
                        {unreadCount > 0 && (
                            <Badge variant="destructive" className="ml-2">
                                {unreadCount}
                            </Badge>
                        )}
                    </CardTitle>
                    {unreadCount > 0 && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={markAllAsRead}
                        >
                            Mark All Read
                        </Button>
                    )}
                </div>
                <CardDescription>
                    Team invitation responses and updates
                </CardDescription>
            </CardHeader>
            <CardContent>
                {notifications.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                        <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No notifications yet</p>
                        <p className="text-sm">You'll receive notifications when students respond to your invitations</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {notifications.map((notification) => (
                            <div
                                key={notification.id}
                                className={`p-4 rounded-lg border ${getNotificationColor(notification.type)} ${!notification.isRead ? 'ring-2 ring-blue-200' : ''
                                    }`}
                            >
                                <div className="flex items-start space-x-3">
                                    {getNotificationIcon(notification.type)}
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                            <h4 className="font-semibold">{notification.title}</h4>
                                            {!notification.isRead && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => markAsRead(notification.id)}
                                                >
                                                    Mark Read
                                                </Button>
                                            )}
                                        </div>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            {notification.message}
                                        </p>
                                        <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
                                            <span>Team: {notification.teamName}</span>
                                            <span>Number: {notification.teamNumber}</span>
                                            <span>{notification.timestamp.toLocaleString()}</span>
                                        </div>
                                        <div className="flex items-center gap-2 mt-2">
                                            <span className="text-xs text-muted-foreground">
                                                Member: {notification.memberName}
                                            </span>
                                            <span className="text-xs text-muted-foreground">
                                                Email: {notification.memberEmail}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
};








