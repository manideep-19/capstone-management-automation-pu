import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const success = await login(email, password);
      if (success) {
        // Login successful - PublicRoute will handle redirect
        console.log('✅ Login successful! PublicRoute will redirect...');
        // Don't navigate here - let PublicRoute handle it
      } else {
        setError('Invalid credentials. Please check your email and password.');
      }
    } catch (err: unknown) {
      console.error('Login error:', err);
      const error = err as { code?: string; message?: string };

      if (error.message === 'ACCOUNT_NOT_VERIFIED') {
        setError('Your account is pending admin verification. Please wait for approval or contact the administrator.');
      } else if (error.code === 'auth/user-not-found') {
        setError('No account found with this email address. Please sign up first.');
      } else if (error.code === 'auth/wrong-password') {
        setError('Incorrect password. Please try again.');
      } else if (error.code === 'auth/invalid-credential') {
        setError('Invalid email or password. Please check your credentials.');
      } else if (error.code === 'auth/too-many-requests') {
        setError('Too many failed login attempts. Please try again later.');
      } else if (error.code === 'auth/invalid-email') {
        setError('Invalid email format. Please enter a valid email address.');
      } else {
        setError(error?.message || 'Failed to sign in. Please try again.');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Capstone Portal</CardTitle>
          <CardDescription>Sign in to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
              />
            </div>
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
          <div className="mt-4 text-center">
            <Button
              variant="link"
              onClick={() => navigate('/signup')}
              className="text-sm"
            >
              New student? Create account
            </Button>
          </div>

          {/* Login Instructions */}
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md text-xs space-y-2">
            <p className="font-semibold text-blue-900">Login Instructions:</p>
            <ul className="list-disc list-inside text-blue-800 space-y-1">
              <li>Use the email and password you created during signup</li>
              <li>Students and Faculty need admin approval before logging in</li>
              <li>Admin accounts can log in immediately after creation</li>
              <li>If login fails, check if your account is verified by the admin</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};