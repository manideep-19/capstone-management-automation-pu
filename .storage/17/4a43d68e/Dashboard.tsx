import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { AdminDashboard } from '@/components/dashboard/AdminDashboard';
import { StudentDashboard } from '@/components/dashboard/StudentDashboard';
import { FacultyDashboard } from '@/components/dashboard/FacultyDashboard';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

export default function Dashboard() {
  const { user, logout } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
          <p className="text-muted-foreground">Please log in to access the dashboard.</p>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  const renderDashboard = () => {
    switch (user.role) {
      case 'admin':
        return <AdminDashboard />;
      case 'student':
        return <StudentDashboard />;
      case 'faculty':
      case 'reviewer':
        return <FacultyDashboard />;
      default:
        return (
          <div className="text-center py-8">
            <h2 className="text-2xl font-bold mb-4">Unknown Role</h2>
            <p className="text-muted-foreground">Your account role is not recognized.</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold text-blue-600">Capstone Portal</h1>
            <div className="text-sm text-muted-foreground">
              {user.role.charAt(0).toUpperCase() + user.role.slice(1)} Portal
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm">
              <div className="font-medium">{user.name}</div>
              <div className="text-muted-foreground">{user.email}</div>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {renderDashboard()}
      </main>
    </div>
  );
}