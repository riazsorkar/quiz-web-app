// frontend/src/app/(auth)/login/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Lock, Mail, Eye, EyeOff, LogIn } from 'lucide-react';
import { authAPI } from '@/lib/api';

interface LoginResponse {
  success: boolean;
  message?: string;
  data?: {
    token: string;
    type: string;
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    roles: string[];
    score: number;
  };
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log('Attempting login with:', email);
      
      // Direct fetch call for debugging
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ email, password }),
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));
      
      const responseText = await response.text();
      console.log('Raw response:', responseText);
      
      let data;
      try {
        data = JSON.parse(responseText);
        console.log('Parsed response:', data);
      } catch (parseError) {
        console.error('Failed to parse JSON:', parseError);
        throw new Error(`Server returned invalid JSON: ${responseText.substring(0, 100)}`);
      }

      if (!response.ok) {
        throw new Error(data.message || `Login failed with status ${response.status}`);
      }

      if (!data.success) {
        throw new Error(data.message || 'Login failed');
      }

      if (!data.data) {
        throw new Error('No user data received');
      }

      console.log('Login successful, storing data...');
      
      // Store token and user data
      localStorage.setItem('token', data.data.token);
      localStorage.setItem('user', JSON.stringify(data.data));

      console.log('Data stored, redirecting to dashboard...');
      
      // Force redirect
      router.push('/dashboard');
      router.refresh(); // Force refresh

    } catch (err: any) {
      console.error('Login error details:', err);
      setError(err.message || 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl">
        <div>
          <div className="flex justify-center">
            <div className="bg-blue-600 p-3 rounded-full">
              <Lock className="h-8 w-8 text-white" />
            </div>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link href="/register" className="font-medium text-blue-600 hover:text-blue-500">
              create a new account
            </Link>
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              <div className="font-bold">Error:</div>
              <div>{error}</div>
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="test@quiz.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="password123"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <LogIn className="h-5 w-5 text-blue-300 group-hover:text-blue-200" />
              </span>
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>

          {/* Demo credentials */}
          <div className="text-center text-sm text-gray-500">
            <p className="font-medium">Demo Credentials:</p>
            <p>Email: test@quiz.com</p>
            <p>Password: password123</p>
          </div>
        </form>
      </div>
    </div>
  );
}