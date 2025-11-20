import { User, Project, Team, Evaluation, Upload } from '@/types/user';

// Initialize mock data in localStorage if not exists
export const initializeMockData = () => {
  if (!localStorage.getItem('users')) {
    const mockUsers: (User & { password: string })[] = [
      {
        id: '1',
        email: 'admin@college.edu',
        name: 'System Administrator',
        role: 'admin',
        isVerified: true,
        createdAt: new Date(),
        password: 'admin123'
      },
      {
        id: '2',
        email: 'faculty@college.edu',
        name: 'Dr. John Smith',
        role: 'faculty',
        isVerified: true,
        specialization: 'Computer Science',
        maxTeams: 3,
        createdAt: new Date(),
        password: 'faculty123'
      },
      {
        id: '3',
        email: 'reviewer@college.edu',
        name: 'Dr. Jane Doe',
        role: 'reviewer',
        isVerified: true,
        specialization: 'Information Technology',
        maxTeams: 3,
        createdAt: new Date(),
        password: 'reviewer123'
      },
      {
        id: '4',
        email: 'student@college.edu',
        rollNo: 'CS2021001',
        name: 'Alice Johnson',
        role: 'student',
        isVerified: true,
        createdAt: new Date(),
        password: 'student123'
      },
      {
        id: '5',
        email: 'student2@college.edu',
        rollNo: 'CS2021002',
        name: 'Bob Wilson',
        role: 'student',
        isVerified: true,
        createdAt: new Date(),
        password: 'student123'
      }
    ];
    localStorage.setItem('users', JSON.stringify(mockUsers));
  }

  if (!localStorage.getItem('projects')) {
    const mockProjects: Project[] = [
      {
        id: '1',
        title: 'AI-Powered Student Management System',
        description: 'Develop an intelligent system for managing student records, attendance, and performance analytics using machine learning algorithms.',
        specialization: 'Computer Science',
        isAssigned: false,
        createdAt: new Date()
      },
      {
        id: '2',
        title: 'IoT-Based Smart Campus Solution',
        description: 'Create an Internet of Things solution for smart campus management including energy monitoring, security systems, and resource optimization.',
        specialization: 'Electronics',
        isAssigned: false,
        createdAt: new Date()
      },
      {
        id: '3',
        title: 'Blockchain-Based Certificate Verification',
        description: 'Design and implement a blockchain solution for secure academic certificate verification and fraud prevention.',
        specialization: 'Information Technology',
        isAssigned: false,
        createdAt: new Date()
      },
      {
        id: '4',
        title: 'Mobile App for Campus Navigation',
        description: 'Develop a mobile application with AR features for campus navigation, event notifications, and student services.',
        specialization: 'Computer Science',
        isAssigned: false,
        createdAt: new Date()
      },
      {
        id: '5',
        title: 'Automated Library Management System',
        description: 'Create a comprehensive library management system with RFID integration, automated cataloging, and recommendation engine.',
        specialization: 'Information Technology',
        isAssigned: false,
        createdAt: new Date()
      }
    ];
    localStorage.setItem('projects', JSON.stringify(mockProjects));
  }

  if (!localStorage.getItem('teams')) {
    localStorage.setItem('teams', JSON.stringify([]));
  }

  if (!localStorage.getItem('evaluations')) {
    localStorage.setItem('evaluations', JSON.stringify([]));
  }

  if (!localStorage.getItem('uploads')) {
    localStorage.setItem('uploads', JSON.stringify([]));
  }
};

// Utility functions for data management
export const getUsers = (): User[] => {
  const users = JSON.parse(localStorage.getItem('users') || '[]') as (User & { password: string })[];
  return users.map(({ password, ...user }) => user);
};

export const getProjects = (): Project[] => {
  return JSON.parse(localStorage.getItem('projects') || '[]');
};

export const getTeams = (): Team[] => {
  return JSON.parse(localStorage.getItem('teams') || '[]');
};

export const getEvaluations = (): Evaluation[] => {
  return JSON.parse(localStorage.getItem('evaluations') || '[]');
};

export const getUploads = (): Upload[] => {
  return JSON.parse(localStorage.getItem('uploads') || '[]');
};

export const updateUsers = (users: User[]) => {
  const existingUsers = JSON.parse(localStorage.getItem('users') || '[]') as (User & { password: string })[];
  const updatedUsers = existingUsers.map((existingUser) => {
    const updatedUser = users.find(u => u.id === existingUser.id);
    return updatedUser ? { ...existingUser, ...updatedUser } : existingUser;
  });
  localStorage.setItem('users', JSON.stringify(updatedUsers));
};

export const updateProjects = (projects: Project[]) => {
  localStorage.setItem('projects', JSON.stringify(projects));
};

export const updateTeams = (teams: Team[]) => {
  localStorage.setItem('teams', JSON.stringify(teams));
};

export const addTeam = (team: Team) => {
  const teams = getTeams();
  teams.push(team);
  updateTeams(teams);
};

export const addProject = (project: Project) => {
  const projects = getProjects();
  projects.push(project);
  updateProjects(projects);
};