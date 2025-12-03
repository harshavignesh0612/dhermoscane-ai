import React, { useState } from 'react';
import { Page } from '../types';
import { Button } from './Button';
import { Mail, Lock, User, ArrowRight, AlertCircle } from 'lucide-react';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth'; // Import methods
import { auth, googleProvider } from '../firebase'; // Import auth and provider

interface LoginProps {
  onNavigate: (page: Page) => void;
  onLogin: () => void;
}

export const Login: React.FC<LoginProps> = ({ onNavigate, onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
        await signInWithEmailAndPassword(auth, email, password);
        onLogin();
    } catch (err: any) {
        console.error(err);
        setError('Invalid email or password.');
    } finally {
        setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
      try {
          await signInWithPopup(auth, googleProvider);
          onLogin();
      } catch (err: any) {
          console.error(err);
          setError("Could not sign in with Google.");
      }
  }

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-light dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-soft border border-gray-100 dark:border-gray-700">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
             <User size={24} />
          </div>
          <h2 className="text-3xl font-bold text-dark dark:text-white">Welcome Back</h2>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Sign in to access your dashboard and medical history.
          </p>
        </div>

        {error && (
            <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm flex items-center gap-2">
                <AlertCircle size={16} /> {error}
            </div>
        )}
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {/* Inputs for Email/Password (same as before) */}
          <div className="space-y-4">
            <div>
              <label htmlFor="email-address" className="sr-only">Email address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Mail size={18} />
                </div>
                <input
                  id="email-address"
                  type="email"
                  required
                  className="appearance-none relative block w-full px-3 py-3 pl-10 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 rounded-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm transition-colors"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Lock size={18} />
                </div>
                <input
                  id="password"
                  type="password"
                  required
                  className="appearance-none relative block w-full px-3 py-3 pl-10 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 rounded-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm transition-colors"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <a href="#" className="font-medium text-primary hover:text-[#00b389]">
                Forgot password?
              </a>
            </div>
          </div>

          <div>
            <Button type="submit" fullWidth disabled={loading}>
              {loading ? 'Signing In...' : 'Sign In'} <ArrowRight size={18} className="ml-2" />
            </Button>
          </div>
        </form>
        
        <div className="relative mt-6">
           <div className="absolute inset-0 flex items-center">
             <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
           </div>
           <div className="relative flex justify-center text-sm">
             <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">Or continue with</span>
           </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-3">
           <button onClick={handleGoogleLogin} className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600">
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5 mr-2" alt="Google" />
              Sign in with Google
           </button>
        </div>

        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          Don't have an account?{' '}
          <button onClick={() => onNavigate(Page.SIGNUP)} className="font-medium text-primary hover:text-[#00b389]">
            Sign up now
          </button>
        </p>
      </div>
    </div>
  );
};