'use client';

import Link from 'next/link';
import {
  Home,
  Trophy,
  LogIn,
  LogOut,
  LayoutDashboard,
  BookOpen,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { LayoutGrid, Shield } from 'lucide-react';

interface UserData {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
  score: number;
  avatarColor?: string;
}

export default function Navigation() {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const pathname = usePathname();

  // Sync user state with localStorage
  const checkUser = () => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (err) {
        console.error('Invalid user data in localStorage', err);
        setUser(null);
      }
    } else {
      setUser(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    checkUser();

    // Sync login/logout across tabs
    window.addEventListener('storage', checkUser);

    return () => {
      window.removeEventListener('storage', checkUser);
    };
  }, [pathname]); // 👈 re-run on route change (App Router way)

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    router.push('/login');
    router.refresh();
  };

  if (loading) {
    return (
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-16 flex items-center text-gray-600">
            Loading...
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Trophy className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-800">
                Quiz Master
              </span>
            </Link>
          </div>

          {/* Navigation */}
          <div className="flex items-center space-x-4">
            <Link
              href="/"
              className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-1"
            >
              <Home className="h-4 w-4" />
              <span>Home</span>
            </Link>

            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-1"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  <span>Dashboard</span>
                </Link>

                <Link
                  href="/quizzes"
                  className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-1"
                >
                  <BookOpen className="h-4 w-4" />
                  <span>Quizzes</span>
                </Link>

                <Link
  href="/categories"
  className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-1"
>
  <LayoutGrid className="h-4 w-4" />
  <span>Categories</span>
</Link>

{user?.roles?.includes('ROLE_ADMIN') && (
  <Link
    href="/admin"
    className="text-gray-600 hover:text-purple-600 px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-1"
  >
    <Shield className="h-4 w-4" />
    <span>Admin</span>
  </Link>
)}

                <Link
                  href="/leaderboard"
                  className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Leaderboard
                </Link>

                {/* User */}
                <div className="flex items-center space-x-3">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold"
                    style={{ backgroundColor: user.avatarColor || '#4F46E5' }}
                  >
                    {user.firstName.charAt(0).toUpperCase()}
                  </div>

                  <span className="text-sm text-gray-700 hidden md:inline">
                    {user.firstName} {user.lastName.charAt(0)}.
                  </span>

                  <button
                    onClick={handleLogout}
                    className="text-gray-600 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-1"
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="hidden md:inline">Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/leaderboard"
                  className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Leaderboard
                </Link>

                <Link
                  href="/login"
                  className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-1"
                >
                  <LogIn className="h-4 w-4" />
                  <span>Login</span>
                </Link>

                <Link
                  href="/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
