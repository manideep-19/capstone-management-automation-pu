import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { X, Mail, CheckCircle, XCircle, Clock } from 'lucide-react';

interface NotificationBannerProps {
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message: string;
    onClose?: () => void;
    action?: {
        label: string;
        onClick: () => void;
    };
}

export const NotificationBanner: React.FC<NotificationBannerProps> = ({
    type,
    title,
    message,
    onClose,
    action
}) => {
    const getIcon = () => {
        switch (type) {
            case 'success':
                return <CheckCircle className="h-4 w-4" />;
            case 'error':
                return <XCircle className="h-4 w-4" />;
            case 'warning':
                return <Clock className="h-4 w-4" />;
            case 'info':
            default:
                return <Mail className="h-4 w-4" />;
        }
    };

    const getAlertVariant = () => {
        switch (type) {
            case 'success':
                return 'default';
            case 'error':
                return 'destructive';
            case 'warning':
                return 'default';
            case 'info':
            default:
                return 'default';
        }
    };

    return (
        <Alert variant={getAlertVariant()} className="relative">
            <div className="flex items-start space-x-3">
                {getIcon()}
                <div className="flex-1">
                    <h4 className="font-medium">{title}</h4>
                    <AlertDescription className="mt-1">{message}</AlertDescription>
                    {action && (
                        <Button
                            size="sm"
                            variant="outline"
                            className="mt-2"
                            onClick={action.onClick}
                        >
                            {action.label}
                        </Button>
                    )}
                </div>
                {onClose && (
                    <Button
                        size="sm"
                        variant="ghost"
                        className="absolute top-2 right-2 h-6 w-6 p-0"
                        onClick={onClose}
                    >
                        <X className="h-3 w-3" />
                    </Button>
                )}
            </div>
        </Alert>
    );
};

