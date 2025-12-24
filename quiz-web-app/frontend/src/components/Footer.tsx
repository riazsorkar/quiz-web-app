// frontend/src/components/Footer.tsx
'use client';

import Link from 'next/link';
import { 
  Trophy, 
  Twitter, 
  Facebook, 
  Linkedin, 
  Instagram, 
  Mail, 
  MapPin, 
  Phone,
  Heart
} from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'Home', href: '/' },
    { name: 'Quizzes', href: '/quizzes' },
    { name: 'Categories', href: '/categories' },
    { name: 'Leaderboard', href: '/leaderboard' },
    { name: 'About Us', href: '/about' },
    { name: 'Contact', href: '/contact' }
  ];

  const categories = [
    { name: 'Programming', href: '/categories?cat=programming' },
    { name: 'Web Development', href: '/categories?cat=web-dev' },
    { name: 'Mathematics', href: '/categories?cat=math' },
    { name: 'Science', href: '/categories?cat=science' },
    { name: 'Business', href: '/categories?cat=business' },
    { name: 'General Knowledge', href: '/categories?cat=general' }
  ];

  const legalLinks = [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Cookie Policy', href: '/cookies' }
  ];

  const socialLinks = [
    { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
    { icon: Facebook, href: 'https://facebook.com', label: 'Facebook' },
    { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
    { icon: Instagram, href: 'https://instagram.com', label: 'Instagram' }
  ];

  return (
    <footer className="bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Column */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-2 rounded-lg">
                <Trophy className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Quiz Master
              </span>
            </Link>
            
            <p className="text-gray-400">
              Master skills through interactive quizzes. Join our community of learners 
              and take your knowledge to the next level.
            </p>
            
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-800 hover:bg-gray-700 p-2 rounded-lg transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-white">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors flex items-center"
                  >
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-white">Categories</h3>
            <ul className="space-y-3">
              {categories.map((category) => (
                <li key={category.name}>
                  <Link
                    href={category.href}
                    className="text-gray-400 hover:text-white transition-colors flex items-center"
                  >
                    <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-white">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-blue-400 mt-1 mr-3" />
                <span className="text-gray-400">
                  123 Learning Street<br />
                  Knowledge City, KC 12345
                </span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 text-blue-400 mr-3" />
                <span className="text-gray-400">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 text-blue-400 mr-3" />
                <span className="text-gray-400">support@quizmaster.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="max-w-xl mx-auto text-center">
            <h3 className="text-xl font-bold mb-4">Stay Updated</h3>
            <p className="text-gray-400 mb-6">
              Subscribe to our newsletter for the latest quizzes and updates
            </p>
            <form className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-gray-900 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm">
              © {currentYear} Quiz Master. All rights reserved.
            </div>
            
            <div className="flex items-center space-x-6">
              {legalLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-gray-400 hover:text-white text-sm transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
            
            <div className="flex items-center text-gray-400 text-sm">
              Made with <Heart className="h-4 w-4 mx-2 text-red-500 fill-current" /> 
              for learners worldwide
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}