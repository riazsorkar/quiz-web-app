// frontend/src/components/ProtectedRoute.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      
      console.log('ProtectedRoute - Checking auth:');
      console.log('Token exists:', !!token);
      console.log('User exists:', !!user);
      console.log('Current path:', pathname);

      if (!token || !user) {
        console.log('Not authenticated, redirecting to login');
        setIsAuthenticated(false);
        if (pathname !== '/login' && pathname !== '/register') {
          router.push('/login');
        }
      } else {
        console.log('User is authenticated');
        setIsAuthenticated(true);
      }
      setLoading(false);
    };

    checkAuth();
    
    // Listen for storage changes (in case logout happens in another tab)
    const handleStorageChange = () => {
      checkAuth();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [router, pathname]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Allow access to auth pages without authentication
  if (pathname === '/login' || pathname === '/register') {
    return <>{children}</>;
  }

  // For protected pages, check authentication
  return isAuthenticated ? <>{children}</> : null;
}