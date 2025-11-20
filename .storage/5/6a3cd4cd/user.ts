export type UserRole = 'admin' | 'student' | 'faculty' | 'reviewer';

export interface User {
  id: string;
  email: string;
  rollNo?: string; // Only for students
  name: string;
  role: UserRole;
  isVerified: boolean;
  specialization?: string; // For faculty/reviewers
  maxTeams?: number; // For faculty/reviewers
  createdAt: Date;
}

export interface Team {
  id: string;
  name: string;
  members: string[]; // User IDs
  leaderId: string;
  projectId?: string;
  guideId?: string;
  reviewerId?: string;
  status: 'forming' | 'complete' | 'assigned' | 'in-progress' | 'completed';
  invites: TeamInvite[];
  createdAt: Date;
}

export interface TeamInvite {
  id: string;
  teamId: string;
  invitedUserId: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: Date;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  specialization: string;
  isAssigned: boolean;
  guideId?: string;
  reviewerId?: string;
  createdAt: Date;
}

export interface Evaluation {
  id: string;
  teamId: string;
  evaluatorId: string;
  type: 'guide' | 'reviewer';
  phase: 'proposal' | 'mid-review' | 'final';
  marks?: number;
  comments: string;
  status: 'pending' | 'completed';
  createdAt: Date;
}

export interface Upload {
  id: string;
  teamId: string;
  uploaderId: string;
  fileName: string;
  fileType: 'report' | 'presentation' | 'code' | 'other';
  fileSize: number;
  uploadDate: Date;
}