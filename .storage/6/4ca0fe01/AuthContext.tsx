import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types/user';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (userData: Partial<User> & { password: string }) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Simulate API call
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const foundUser = users.find((u: User & { password: string }) => 
        u.email === email && u.password === password
      );

      if (foundUser && foundUser.isVerified) {
        const { password: _, ...userWithoutPassword } = foundUser;
        setUser(userWithoutPassword);
        localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
        return true;
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (userData: Partial<User> & { password: string }): Promise<boolean> => {
    setIsLoading(true);
    try {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      
      // Check if user already exists
      if (users.find((u: User) => u.email === userData.email)) {
        return false;
      }

      const newUser: User & { password: string } = {
        id: Date.now().toString(),
        email: userData.email!,
        rollNo: userData.rollNo,
        name: userData.name!,
        role: userData.role || 'student',
        isVerified: userData.role === 'admin', // Admin auto-verified
        specialization: userData.specialization,
        maxTeams: userData.role === 'faculty' || userData.role === 'reviewer' ? 3 : undefined,
        createdAt: new Date(),
        password: userData.password
      };

      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));

      // Auto-login if admin, otherwise require verification
      if (newUser.role === 'admin') {
        const { password: _, ...userWithoutPassword } = newUser;
        setUser(userWithoutPassword);
        localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
      }

      return true;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};