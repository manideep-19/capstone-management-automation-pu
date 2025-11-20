# Capstone Project Automation Web Application - MVP Todo

## Core Files to Create/Modify

### 1. Authentication & User Management
- `src/components/auth/LoginForm.tsx` - Multi-role login (Admin/Student/Faculty/Reviewer)
- `src/components/auth/SignupForm.tsx` - Student registration with email verification
- `src/contexts/AuthContext.tsx` - Authentication state management
- `src/types/user.ts` - User type definitions

### 2. Dashboard Components
- `src/components/dashboard/AdminDashboard.tsx` - Admin overview and management
- `src/components/dashboard/StudentDashboard.tsx` - Team formation and project selection
- `src/components/dashboard/FacultyDashboard.tsx` - Assigned teams and evaluation
- `src/components/layout/DashboardLayout.tsx` - Common dashboard layout

### 3. Core Features
- `src/components/teams/TeamFormation.tsx` - Create/join teams with email invites
- `src/components/projects/ProjectSelection.tsx` - Browse and select projects
- `src/components/projects/ProjectManagement.tsx` - Admin project CRUD
- `src/components/evaluation/EvaluationPanel.tsx` - Faculty evaluation interface

### 4. Data Management
- `src/lib/mockData.ts` - Mock data for MVP (users, projects, teams)
- `src/lib/api.ts` - API simulation functions
- `src/hooks/useAuth.ts` - Authentication hook
- `src/hooks/useProjects.ts` - Project management hook

### 5. Pages
- `src/pages/Login.tsx` - Login page
- `src/pages/Dashboard.tsx` - Role-based dashboard router
- `src/pages/Index.tsx` - Landing page (modify existing)

### 6. Utilities
- `src/lib/notifications.ts` - Notification system
- `src/lib/storage.ts` - Local storage utilities

## Implementation Strategy
1. Start with authentication system and user roles
2. Create basic dashboard layouts for each role
3. Implement team formation workflow
4. Add project selection and assignment
5. Create evaluation and progress tracking
6. Add notifications and file upload simulation

## MVP Limitations
- Using localStorage instead of real database
- Email notifications simulated with browser notifications
- File uploads stored in browser memory
- No real-time chat (basic comment system)
- Simplified assignment algorithms

Total Files: 8 core files (within limit)