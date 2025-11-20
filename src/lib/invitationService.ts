import {
    collection,
    doc,
    addDoc,
    updateDoc,
    deleteDoc,
    getDocs,
    getDoc,
    query,
    where,
    orderBy,
    serverTimestamp
} from 'firebase/firestore';
import { db } from './firebase';
import { TeamInvite, User, Team } from '@/types/user';
import { sendTeamInvitationEmail, generateInvitationLink } from './emailService';
import { notifyTeamLeader, sendAcceptanceNotification } from './notificationService';
import { realTimeProgressService } from './realTimeProgressService';
import { addMemberToTeam, getTeamFromFirestore, updateUserTeamId } from './teamService';

export interface InvitationWithDetails extends TeamInvite {
    invitedUserName: string;
    invitedUserEmail: string;
    teamName: string;
    inviterName: string;
    inviterId?: string;
    teamNumber?: string;
}

export interface CreateInvitationData {
    teamId: string;
    invitedUserId: string;
    inviterId: string;
    teamName: string;
    inviterName: string;
    invitedUserName: string;
    invitedUserEmail: string;
    teamLeaderEmail?: string;
    teamLeaderRollNo?: string;
    teamNumber?: string;
}



/**
 * Create a new team invitation and send email
 */
export const createTeamInvitation = async (
    invitationData: CreateInvitationData
): Promise<{ success: boolean; message: string; invitationId?: string }> => {
    try {
        console.log('\ud83d\udce8 ===== CREATE TEAM INVITATION ===== \ud83d\udce8');
        console.log('Team:', invitationData.teamName);
        console.log('Inviting:', invitationData.invitedUserName, '(' + invitationData.invitedUserEmail + ')');
        console.log('Inviter:', invitationData.inviterName);

        // Check if invitation already exists (by userId or email)
        const existingInvitations = await getTeamInvitations(invitationData.teamId);
        const existingInvite = existingInvitations.find(
            invite => 
                (invite.invitedUserId === invitationData.invitedUserId || 
                 invite.invitedUserEmail.toLowerCase() === invitationData.invitedUserEmail.toLowerCase()) &&
                invite.status === 'pending'
        );

        if (existingInvite) {
            console.log('\u26a0\ufe0f Invitation already exists:', existingInvite.id);
            return {
                success: false,
                message: 'An invitation has already been sent to this email address for this team'
            };
        }

        // Normalize email to lowercase before storing (emails are case-insensitive per RFC)
        const normalizedInvitedEmail = invitationData.invitedUserEmail.trim().toLowerCase();

        // Create invitation document in Firestore
        console.log('\ud83d\udccb Creating invitation document in Firestore...');
        const invitationRef = await addDoc(collection(db, 'invitations'), {
            teamId: invitationData.teamId,
            invitedUserId: invitationData.invitedUserId,
            status: 'pending',
            createdAt: serverTimestamp(),
            inviterId: invitationData.inviterId,
            teamName: invitationData.teamName,
            inviterName: invitationData.inviterName,
            invitedUserName: invitationData.invitedUserName,
            invitedUserEmail: normalizedInvitedEmail, // Store normalized lowercase email
            teamNumber: invitationData.teamNumber || `T${Date.now().toString().slice(-6)}`  // Save team number
        });
        console.log('\u2705 Invitation document created:', invitationRef.id);

        // Generate invitation link
        const invitationLink = generateInvitationLink(invitationData.teamId, invitationRef.id);
        console.log('\ud83d\udd17 Invitation link generated:', invitationLink);

        // Generate team number if not provided
        const teamNumber = invitationData.teamNumber || `T${Date.now().toString().slice(-6)}`;

        // Send email invitation (using normalized email)
        console.log('\ud83d\udce7 ===== SENDING EMAIL INVITATION =====');
        console.log('\ud83d\udce7 Recipient Email:', normalizedInvitedEmail);
        console.log('\ud83d\udce7 Recipient Name:', invitationData.invitedUserName);
        console.log('\ud83d\udce7 Inviter Name:', invitationData.inviterName);
        console.log('\ud83d\udce7 Team Name:', invitationData.teamName);
        console.log('\ud83d\udce7 Team Number:', teamNumber);
        console.log('\ud83d\udce7 Invitation Link:', invitationLink);
        
        const emailResult = await sendTeamInvitationEmail({
            toEmail: normalizedInvitedEmail, // Use normalized lowercase email
            toName: invitationData.invitedUserName,
            fromName: invitationData.inviterName,
            teamName: invitationData.teamName,
            invitationLink,
            teamLeaderEmail: invitationData.teamLeaderEmail,
            teamLeaderRollNo: invitationData.teamLeaderRollNo,
            teamNumber
        });
        
        console.log('\ud83d\udce7 Email Result:', {
            success: emailResult.success,
            message: emailResult.message
        });

        // Mark email as sent if successful
        if (emailResult.success) {
            realTimeProgressService.markEmailSent(invitationRef.id);
        }

        if (!emailResult.success) {
            // If email fails, we still keep the invitation in the database
            console.warn('\u26a0\ufe0f Email sending failed, but invitation was created:', emailResult.message);
            return {
                success: true,
                message: `\ud83d\udcdd Invitation created for ${invitationData.invitedUserName}. Email failed - please share the link manually: ${invitationLink}`,
                invitationId: invitationRef.id
            };
        }

        console.log('\u2705 EMAIL SENT SUCCESSFULLY!');
        return {
            success: true,
            message: emailResult.message || `Invitation sent to ${invitationData.invitedUserName}`,
            invitationId: invitationRef.id
        };
    } catch (error) {
        console.error('\u274c Failed to create team invitation:', error);
        return {
            success: false,
            message: 'Failed to create invitation. Please try again.'
        };
    }
};

/**
 * Get all invitations for a specific team
 */
export const getTeamInvitations = async (teamId: string): Promise<InvitationWithDetails[]> => {
    try {
        console.log('🔍 Fetching invitations for team:', teamId);
        const invitationsRef = collection(db, 'invitations');

        // Try with orderBy first (requires Firestore index)
        try {
            const q = query(
                invitationsRef,
                where('teamId', '==', teamId),
                orderBy('createdAt', 'desc')
            );
            const querySnapshot = await getDocs(q);

            const invitations: InvitationWithDetails[] = [];
            console.log('📊 Found', querySnapshot.size, 'invitations for team:', teamId);

            querySnapshot.forEach((docSnapshot) => {
                const data = docSnapshot.data();
                console.log('📧 Invitation:', {
                    id: docSnapshot.id,
                    invitedUser: data.invitedUserName,
                    status: data.status,
                    teamNumber: data.teamNumber
                });
                invitations.push({
                    id: docSnapshot.id,
                    teamId: data.teamId,
                    invitedUserId: data.invitedUserId,
                    status: data.status,
                    createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(),
                    invitedUserName: data.invitedUserName || '',
                    invitedUserEmail: data.invitedUserEmail || '',
                    teamName: data.teamName || '',
                    inviterName: data.inviterName || '',
                    inviterId: data.inviterId || '',
                    teamNumber: data.teamNumber || ''
                });
            });

            console.log('✅ Returning', invitations.length, 'invitations');
            return invitations;
        } catch (indexError: any) {
            // If index doesn't exist, fall back to query without orderBy
            if (indexError.code === 'failed-precondition' || indexError.message?.includes('index')) {
                console.warn('⚠️ Firestore index not found, querying without orderBy');
                const q = query(
                    invitationsRef,
                    where('teamId', '==', teamId)
                );
                const querySnapshot = await getDocs(q);

                const invitations: InvitationWithDetails[] = [];
                console.log('📊 Found', querySnapshot.size, 'invitations for team (no order):', teamId);

                querySnapshot.forEach((docSnapshot) => {
                    const data = docSnapshot.data();
                    invitations.push({
                        id: docSnapshot.id,
                        teamId: data.teamId,
                        invitedUserId: data.invitedUserId,
                        status: data.status,
                        createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(),
                        invitedUserName: data.invitedUserName || '',
                        invitedUserEmail: data.invitedUserEmail || '',
                        teamName: data.teamName || '',
                        inviterName: data.inviterName || '',
                        inviterId: data.inviterId || '',
                        teamNumber: data.teamNumber || ''
                    });
                });

                // Sort manually by createdAt
                invitations.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

                console.log('✅ Returning', invitations.length, 'invitations (sorted manually)');
                return invitations;
            }
            throw indexError;
        }
    } catch (error) {
        console.error('❌ Failed to get team invitations:', error);
        return [];
    }
};

/**
 * Get all invitations for a specific user
 */
export const getUserInvitations = async (userId: string): Promise<InvitationWithDetails[]> => {
    try {
        const invitationsRef = collection(db, 'invitations');
        const q = query(
            invitationsRef,
            where('invitedUserId', '==', userId),
            orderBy('createdAt', 'desc')
        );

        const querySnapshot = await getDocs(q);
        const invitations: InvitationWithDetails[] = [];

        querySnapshot.forEach((docSnapshot) => {
            const data = docSnapshot.data();
            invitations.push({
                id: docSnapshot.id,
                teamId: data.teamId,
                invitedUserId: data.invitedUserId,
                status: data.status,
                createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(),
                invitedUserName: data.invitedUserName || '',
                invitedUserEmail: data.invitedUserEmail || '',
                teamName: data.teamName || '',
                inviterName: data.inviterName || '',
                inviterId: data.inviterId || '',
                teamNumber: data.teamNumber || ''
            });
        });

        return invitations;
    } catch (error) {
        console.error('Failed to get user invitations:', error);
        return [];
    }
};

/**
 * Accept a team invitation
 */
export const acceptTeamInvitation = async (
    invitationId: string,
    userId: string
): Promise<{ success: boolean; message: string; teamId?: string }> => {
    try {
        // Get invitation details first
        const invitation = await getInvitationById(invitationId);
        if (!invitation) {
            return {
                success: false,
                message: 'Invitation not found'
            };
        }

        // Update invitation status
        const invitationRef = doc(db, 'invitations', invitationId);
        await updateDoc(invitationRef, {
            status: 'accepted',
            respondedAt: serverTimestamp()
        });

        // Add user to team members in Firestore
        console.log(`➕ Adding user ${userId} to team ${invitation.teamId} in Firestore...`);
        const memberAdded = await addMemberToTeam(invitation.teamId, userId);
        
        if (!memberAdded) {
            console.warn('⚠️ Failed to add member to team, but invitation was accepted');
        } else {
            console.log('✅ User successfully added to team in Firestore');
        }

        // Update user's teamId in Firestore users collection
        await updateUserTeamId(userId, invitation.teamId);

        // Update real-time progress
        realTimeProgressService.handleInvitationResponse(invitationId, 'accepted');

        // Notify team leader about acceptance
        await notifyTeamLeader({
            type: 'invitation_accepted',
            teamLeaderId: invitation.inviterId || '',
            teamLeaderEmail: invitation.inviterName || '',
            teamLeaderName: invitation.inviterName || '',
            teamName: invitation.teamName,
            teamNumber: invitation.teamNumber || '',
            memberName: invitation.invitedUserName,
            memberEmail: invitation.invitedUserEmail,
            invitationId: invitationId
        });

        return {
            success: true,
            message: 'Invitation accepted successfully',
            teamId: invitation.teamId
        };
    } catch (error) {
        console.error('Failed to accept invitation:', error);
        return {
            success: false,
            message: 'Failed to accept invitation. Please try again.'
        };
    }
};

/**
 * Reject a team invitation
 */
export const rejectTeamInvitation = async (
    invitationId: string,
    userId: string
): Promise<{ success: boolean; message: string }> => {
    try {
        // Get invitation details first
        const invitation = await getInvitationById(invitationId);
        if (!invitation) {
            return {
                success: false,
                message: 'Invitation not found'
            };
        }

        // Update invitation status
        const invitationRef = doc(db, 'invitations', invitationId);
        await updateDoc(invitationRef, {
            status: 'rejected',
            respondedAt: serverTimestamp()
        });

        // Update real-time progress
        realTimeProgressService.handleInvitationResponse(invitationId, 'rejected');

        // Notify team leader about rejection
        await notifyTeamLeader({
            type: 'invitation_rejected',
            teamLeaderId: invitation.inviterId || '',
            teamLeaderEmail: invitation.inviterName || '',
            teamLeaderName: invitation.inviterName || '',
            teamName: invitation.teamName,
            teamNumber: invitation.teamNumber || '',
            memberName: invitation.invitedUserName,
            memberEmail: invitation.invitedUserEmail,
            invitationId: invitationId
        });

        return {
            success: true,
            message: 'Invitation rejected'
        };
    } catch (error) {
        console.error('Failed to reject invitation:', error);
        return {
            success: false,
            message: 'Failed to reject invitation. Please try again.'
        };
    }
};

/**
 * Cancel a pending invitation
 */
export const cancelTeamInvitation = async (
    invitationId: string
): Promise<{ success: boolean; message: string }> => {
    try {
        // Delete the invitation
        const invitationRef = doc(db, 'invitations', invitationId);
        await deleteDoc(invitationRef);

        return {
            success: true,
            message: 'Invitation cancelled successfully'
        };
    } catch (error) {
        console.error('Failed to cancel invitation:', error);
        return {
            success: false,
            message: 'Failed to cancel invitation. Please try again.'
        };
    }
};

/**
 * Get invitation by ID
 */
export const getInvitationById = async (invitationId: string): Promise<InvitationWithDetails | null> => {
    try {
        const invitationRef = doc(db, 'invitations', invitationId);
        const invitationSnap = await getDoc(invitationRef);

        if (!invitationSnap.exists()) {
            return null;
        }

        const data = invitationSnap.data();

        return {
            id: invitationSnap.id,
            teamId: data.teamId,
            invitedUserId: data.invitedUserId,
            status: data.status,
            createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(),
            invitedUserName: data.invitedUserName || '',
            invitedUserEmail: data.invitedUserEmail || '',
            teamName: data.teamName || '',
            inviterName: data.inviterName || '',
            inviterId: data.inviterId || '',
            teamNumber: data.teamNumber || ''
        };
    } catch (error) {
        console.error('Failed to get invitation by ID:', error);
        return null;
    }
};
