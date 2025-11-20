import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
    createTeamInvitation,
    getTeamInvitations,
    getUserInvitations,
    acceptTeamInvitation,
    rejectTeamInvitation,
    cancelTeamInvitation,
    getInvitationById,
    InvitationWithDetails,
    CreateInvitationData
} from '@/lib/invitationService';

export const useInvitations = () => {
    const { user } = useAuth();
    const [teamInvitations, setTeamInvitations] = useState<InvitationWithDetails[]>([]);
    const [userInvitations, setUserInvitations] = useState<InvitationWithDetails[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Load team invitations
    const loadTeamInvitations = useCallback(async (teamId: string) => {
        if (!teamId) return;

        setIsLoading(true);
        setError(null);

        try {
            const invitations = await getTeamInvitations(teamId);
            setTeamInvitations(invitations);
        } catch (err) {
            setError('Failed to load team invitations');
            console.error('Error loading team invitations:', err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Load user invitations
    const loadUserInvitations = useCallback(async () => {
        if (!user?.id) return;

        setIsLoading(true);
        setError(null);

        try {
            const invitations = await getUserInvitations(user.id);
            setUserInvitations(invitations);
        } catch (err) {
            setError('Failed to load user invitations');
            console.error('Error loading user invitations:', err);
        } finally {
            setIsLoading(false);
        }
    }, [user?.id]);

    // Send team invitation
    const sendInvitation = useCallback(async (invitationData: CreateInvitationData) => {
        setIsLoading(true);
        setError(null);

        try {
            const result = await createTeamInvitation(invitationData);

            if (result.success) {
                // Reload team invitations
                await loadTeamInvitations(invitationData.teamId);
                return result;
            } else {
                setError(result.message);
                return result;
            }
        } catch (err) {
            const errorMessage = 'Failed to send invitation';
            setError(errorMessage);
            console.error('Error sending invitation:', err);
            return { success: false, message: errorMessage };
        } finally {
            setIsLoading(false);
        }
    }, [loadTeamInvitations]);

    // Accept invitation
    const acceptInvitation = useCallback(async (invitationId: string) => {
        if (!user?.id) return { success: false, message: 'User not authenticated' };

        setIsLoading(true);
        setError(null);

        try {
            const result = await acceptTeamInvitation(invitationId, user.id);

            if (result.success) {
                // Reload user invitations
                await loadUserInvitations();
                return result;
            } else {
                setError(result.message);
                return result;
            }
        } catch (err) {
            const errorMessage = 'Failed to accept invitation';
            setError(errorMessage);
            console.error('Error accepting invitation:', err);
            return { success: false, message: errorMessage };
        } finally {
            setIsLoading(false);
        }
    }, [user?.id, loadUserInvitations]);

    // Reject invitation
    const rejectInvitation = useCallback(async (invitationId: string) => {
        if (!user?.id) return { success: false, message: 'User not authenticated' };

        setIsLoading(true);
        setError(null);

        try {
            const result = await rejectTeamInvitation(invitationId, user.id);

            if (result.success) {
                // Reload user invitations
                await loadUserInvitations();
                return result;
            } else {
                setError(result.message);
                return result;
            }
        } catch (err) {
            const errorMessage = 'Failed to reject invitation';
            setError(errorMessage);
            console.error('Error rejecting invitation:', err);
            return { success: false, message: errorMessage };
        } finally {
            setIsLoading(false);
        }
    }, [user?.id, loadUserInvitations]);

    // Cancel invitation
    const cancelInvitation = useCallback(async (invitationId: string, teamId: string) => {
        setIsLoading(true);
        setError(null);

        try {
            const result = await cancelTeamInvitation(invitationId);

            if (result.success) {
                // Reload team invitations
                await loadTeamInvitations(teamId);
                return result;
            } else {
                setError(result.message);
                return result;
            }
        } catch (err) {
            const errorMessage = 'Failed to cancel invitation';
            setError(errorMessage);
            console.error('Error canceling invitation:', err);
            return { success: false, message: errorMessage };
        } finally {
            setIsLoading(false);
        }
    }, [loadTeamInvitations]);

    // Get invitation by ID
    const getInvitation = useCallback(async (invitationId: string) => {
        try {
            return await getInvitationById(invitationId);
        } catch (err) {
            console.error('Error getting invitation:', err);
            return null;
        }
    }, []);

    // Clear error
    const clearError = useCallback(() => {
        setError(null);
    }, []);

    // Load user invitations on mount
    useEffect(() => {
        if (user?.id) {
            loadUserInvitations();
        }
    }, [user?.id, loadUserInvitations]);

    return {
        teamInvitations,
        userInvitations,
        isLoading,
        error,
        sendInvitation,
        acceptInvitation,
        rejectInvitation,
        cancelInvitation,
        getInvitation,
        loadTeamInvitations,
        loadUserInvitations,
        clearError
    };
};

