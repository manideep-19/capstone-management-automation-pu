/**
 * Real-time Progress Service
 * Manages real-time updates for email invitation progress
 */

import { EmailProgress } from './emailTrackingService';

interface ProgressUpdate {
    invitationId: string;
    status: 'sending' | 'sent' | 'delivered' | 'opened' | 'clicked' | 'accepted' | 'rejected' | 'expired';
    message: string;
    progress: number;
    timestamp: Date;
}

class RealTimeProgressService {
    private progressCallbacks: Map<string, (progress: EmailProgress) => void> = new Map();
    private invitationProgresses: Map<string, EmailProgress> = new Map();

    /**
     * Start tracking progress for a real invitation
     */
    startTracking(invitationId: string, teamName: string, teamNumber: string, recipientName: string, recipientEmail: string): void {
        console.log(`Starting real-time tracking for invitation: ${invitationId}`);

        // Create initial progress - only show "sending" status
        const initialProgress: EmailProgress = {
            id: `progress_${invitationId}`,
            invitationId,
            teamId: '',
            teamName,
            teamNumber,
            recipientEmail,
            recipientName,
            senderName: '',
            status: 'sending',
            timestamp: new Date(),
            message: 'Email invitation being sent...',
            progress: 10
        };

        this.invitationProgresses.set(invitationId, initialProgress);
        this.notifyProgress(invitationId, initialProgress);

        // DO NOT simulate fake progress - only show real status updates
        // Progress will be updated when:
        // 1. Email is actually sent (via markEmailSent)
        // 2. Invitation is accepted/rejected (via handleInvitationResponse)
    }

    /**
     * Update progress for a specific invitation
     */
    updateProgress(invitationId: string, update: ProgressUpdate): void {
        const currentProgress = this.invitationProgresses.get(invitationId);
        if (!currentProgress) return;

        const updatedProgress: EmailProgress = {
            ...currentProgress,
            status: update.status,
            message: update.message,
            progress: update.progress,
            timestamp: update.timestamp
        };

        this.invitationProgresses.set(invitationId, updatedProgress);
        this.notifyProgress(invitationId, updatedProgress);
    }

    /**
     * Get current progress for an invitation
     */
    getProgress(invitationId: string): EmailProgress | null {
        return this.invitationProgresses.get(invitationId) || null;
    }

    /**
     * Subscribe to progress updates
     */
    subscribe(invitationId: string, callback: (progress: EmailProgress) => void): () => void {
        this.progressCallbacks.set(invitationId, callback);

        // Return unsubscribe function
        return () => {
            this.progressCallbacks.delete(invitationId);
        };
    }

    /**
     * Mark email as sent (called when email is actually sent)
     */
    markEmailSent(invitationId: string): void {
        const currentProgress = this.invitationProgresses.get(invitationId);
        if (!currentProgress) {
            console.warn(`Cannot mark email as sent - no progress found for invitation: ${invitationId}`);
            return;
        }

        this.updateProgress(invitationId, {
            invitationId,
            status: 'sent',
            message: 'Email sent successfully. Waiting for recipient response...',
            progress: 50,
            timestamp: new Date()
        });
    }

    /**
     * Mark link as clicked (called when invitation link is actually clicked)
     */
    markLinkClicked(invitationId: string): void {
        const currentProgress = this.invitationProgresses.get(invitationId);
        if (!currentProgress) {
            console.warn(`Cannot mark link as clicked - no progress found for invitation: ${invitationId}`);
            return;
        }

        this.updateProgress(invitationId, {
            invitationId,
            status: 'clicked',
            message: 'Recipient clicked invitation link',
            progress: 75,
            timestamp: new Date()
        });
    }

    /**
     * Notify all subscribers of progress update
     */
    private notifyProgress(invitationId: string, progress: EmailProgress): void {
        const callback = this.progressCallbacks.get(invitationId);
        if (callback) {
            callback(progress);
        }
    }

    /**
     * Handle invitation response (accept/reject)
     */
    handleInvitationResponse(invitationId: string, status: 'accepted' | 'rejected'): void {
        const message = status === 'accepted'
            ? 'Invitation accepted! Team member added.'
            : 'Invitation declined by recipient.';

        this.updateProgress(invitationId, {
            invitationId,
            status,
            message,
            progress: 100,
            timestamp: new Date()
        });
    }
}

// Export singleton instance
export const realTimeProgressService = new RealTimeProgressService();








