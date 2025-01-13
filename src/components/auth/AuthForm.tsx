import React, { useState } from 'react';
import { Rocket } from 'lucide-react';
import { useSupabase } from '../../contexts/SupabaseContext';
import { AuthError, DatabaseError } from '../../lib/errors';
import { PasswordResetForm } from './PasswordResetForm';
import { Logo } from '../ui/logo';

export function AuthForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showResetForm, setShowResetForm] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const { signIn, signUp } = useSupabase();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (loading) return;
      
      setLoading(true);
      setMessage(null);
      
      // Input validation
      if (!email.trim()) {
        throw new AuthError('Email is required');
      }
      
      if (password.length < 6) {
        throw new AuthError('Password must be at least 6 characters');
      }

      if (isSignUp) {
        if (!name.trim()) {
          throw new AuthError('Name is required');
        }
        
        // Show loading message
        setMessage('Creating your account...');
        
        await signUp(email, password, name);
      } else {
        setMessage('Signing in...');
        await signIn(email, password);
      }
    } catch (error) {
      let errorMessage = 'An unexpected error occurred. Please try again.';
      
      if (error instanceof AuthError) {
        errorMessage = error.message;
      } else if (error instanceof DatabaseError) {
        errorMessage = 'Failed to create account. Please try again.';
      }
      
      setMessage(errorMessage);
      console.error('Auth error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center px-4 relative">
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1475274047050-1d0c0975c63e?auto=format&fit=crop&q=80")',
          backgroundPosition: 'center',
          backgroundSize: 'cover'
        }}
      >
        <div className="absolute inset-0 bg-black/30" />
      </div>
      
      <div className="relative z-10 w-full max-w-[480px] pt-12 mb-8">
        <Logo />
      </div>

      {showResetForm ? (
        <div className="w-full max-w-md relative z-10 mt-0">
          <PasswordResetForm onBack={() => setShowResetForm(false)} />
        </div>
      ) : (
        <>
          <div className="relative z-10 max-w-md w-full space-y-8 mt-0">
            <div className="flex rounded-lg bg-gray-800 p-1">
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(false);
                  setMessage(null);
                }}
                className={`flex-1 py-2.5 text-sm font-medium rounded-md transition-colors ${
                  !isSignUp
                    ? 'bg-orange-500 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(true);
                  setMessage(null);
                }}
                className={`flex-1 py-2.5 text-sm font-medium rounded-md transition-colors ${
                  isSignUp
                    ? 'bg-orange-500 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Create Account
              </button>
            </div>
            <div className="mt-6 text-center">
              <h2 className="text-xl font-bold text-white">
                {isSignUp ? 'Create your account' : 'Welcome back'}
              </h2>
              <p className="mt-2 text-sm text-gray-400">
                {isSignUp 
                  ? 'Enter your details to get started' 
                  : 'Enter your credentials to continue'}
              </p>
            </div>
            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              <div className="rounded-md shadow-sm space-y-4">
                {isSignUp && (
                  <div>
                    <label htmlFor="full-name" className="sr-only">
                      Full name
                    </label>
                    <input
                      id="full-name"
                      name="name"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-700 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm"
                      placeholder="Full name"
                    />
                  </div>
                )}
                <div>
                  <label htmlFor="email-address" className="sr-only">
                    Email address
                  </label>
                  <input
                    id="email-address"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-700 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm"
                    placeholder="Email address"
                  />
                </div>
                <div>
                  <label htmlFor="password" className="sr-only">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={isSignUp || showPassword ? "text" : "password"}
                      autoComplete={isSignUp ? 'new-password' : 'current-password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-700 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm"
                      placeholder="Password"
                      minLength={6}
                    />
                    <div className="absolute right-3 top-2 flex items-center gap-3">
                      {!isSignUp && (
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="text-xs text-gray-400 hover:text-gray-300"
                        >
                          {showPassword ? 'Hide' : 'Show'}
                        </button>
                      )}
                      <span className="text-xs text-gray-400">Min 6 chars</span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative w-full flex items-center justify-center gap-2 py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    'Processing...'
                  ) : (
                    <>
                      <span>Launch</span>
                      <Rocket size={16} className="group-hover:translate-x-0.5 transition-transform" />
                    </>
                  )}
                </button>
              </div>

              {message && (
                <div className={`text-sm text-center ${
                  message.includes('successfully') ? 'text-green-400' : 'text-red-400'
                }`}>
                  {message}
                </div>
              )}
              
              {!isSignUp && (
                <div className="text-center mt-4">
                  <button
                    onClick={() => setShowResetForm(true)}
                    className="text-sm text-orange-500 hover:text-orange-400"
                  >
                    Forgot password?
                  </button>
                </div>
              )}
            </form>
          </div>
        </>
      )}
    </div>
  );
}