import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { UserRole } from '@/types/user';

export const SignupForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    rollNo: '',
    password: '',
    confirmPassword: '',
    role: 'student' as UserRole,
    specialization: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { signup, isLoading } = useAuth();
  const navigate = useNavigate();

  const validateStudentEmail = (email: string): boolean => {
    // Pattern: FirstName.RollNumber@presidencyuniversity.in
    const studentEmailPattern = /^[A-Za-z]+\.\d{11}@presidencyuniversity\.in$/;
    return studentEmailPattern.test(email);
  };

  const extractRollNumberFromEmail = (email: string): string => {
    const match = email.match(/^[A-Za-z]+\.(\d{11})@presidencyuniversity\.in$/);
    return match ? match[1] : '';
  };

  const handleEmailChange = (email: string) => {
    setFormData({ ...formData, email });
    
    // Auto-extract roll number for students
    if (formData.role === 'student' && validateStudentEmail(email)) {
      const rollNo = extractRollNumberFromEmail(email);
      setFormData(prev => ({ ...prev, email, rollNo }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Validate student email format
    if (formData.role === 'student') {
      if (!validateStudentEmail(formData.email)) {
        setError('Student email must be in format: FirstName.RollNumber@presidencyuniversity.in (e.g., Manideep.20221CIT0091@presidencyuniversity.in)');
        return;
      }
      if (!formData.rollNo) {
        setError('Roll number is required for students');
        return;
      }
    }

    // Validate other roles have normal email
    if (formData.role !== 'student' && !formData.email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    const success = await signup(formData);
    if (success) {
      if (formData.role === 'admin') {
        navigate('/dashboard');
      } else {
        setSuccess('Account created successfully! Please wait for admin verification before logging in.');
      }
    } else {
      setError('Account creation failed. Email may already exist.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
          <CardDescription>Join the Capstone Portal</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select value={formData.role} onValueChange={(value: UserRole) => setFormData({ ...formData, role: value, email: '', rollNo: '' })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="faculty">Faculty Guide</SelectItem>
                  <SelectItem value="reviewer">Reviewer</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                placeholder="Enter your full name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">
                Email
                {formData.role === 'student' && (
                  <span className="text-xs text-muted-foreground ml-2">
                    (Format: FirstName.RollNumber@presidencyuniversity.in)
                  </span>
                )}
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleEmailChange(e.target.value)}
                required
                placeholder={
                  formData.role === 'student' 
                    ? "e.g., Manideep.20221CIT0091@presidencyuniversity.in"
                    : "Enter your email"
                }
              />
            </div>

            {formData.role === 'student' && (
              <div className="space-y-2">
                <Label htmlFor="rollNo">Roll Number</Label>
                <Input
                  id="rollNo"
                  value={formData.rollNo}
                  onChange={(e) => setFormData({ ...formData, rollNo: e.target.value })}
                  required
                  placeholder="Auto-filled from email or enter manually"
                  disabled={validateStudentEmail(formData.email)}
                />
                {validateStudentEmail(formData.email) && (
                  <p className="text-xs text-green-600">✓ Roll number auto-extracted from email</p>
                )}
              </div>
            )}

            {(formData.role === 'faculty' || formData.role === 'reviewer') && (
              <div className="space-y-2">
                <Label htmlFor="specialization">Specialization</Label>
                <Select value={formData.specialization} onValueChange={(value) => setFormData({ ...formData, specialization: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select specialization" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Computer Science">Computer Science</SelectItem>
                    <SelectItem value="Information Technology">Information Technology</SelectItem>
                    <SelectItem value="Electronics">Electronics</SelectItem>
                    <SelectItem value="Mechanical">Mechanical</SelectItem>
                    <SelectItem value="Civil">Civil</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                placeholder="Enter password"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
                placeholder="Confirm password"
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert>
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <Button
              variant="link"
              onClick={() => navigate('/login')}
              className="text-sm"
            >
              Already have an account? Sign in
            </Button>
          </div>

          {formData.role === 'student' && (
            <div className="mt-4 p-3 bg-blue-50 rounded-md text-xs">
              <p className="font-semibold mb-1">Student Email Format:</p>
              <p>FirstName.RollNumber@presidencyuniversity.in</p>
              <p className="text-blue-600 mt-1">Example: Manideep.20221CIT0091@presidencyuniversity.in</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};