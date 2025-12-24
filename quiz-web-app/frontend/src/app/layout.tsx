// frontend/src/app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navigation from '@/components/Navigation';
import { ToastProvider } from '@/context/ToastContext';
import Footer from '@/components/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Quiz Master',
  description: 'Interactive Quiz Platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
  <html lang="en">
    <body className={inter.className}>
      <ToastProvider>
        <div className="min-h-screen flex flex-col">
          <Navigation />
          <main className="flex-grow">{children}</main>
          <Footer />
        </div>
      </ToastProvider>
    </body>
  </html>
);
}

