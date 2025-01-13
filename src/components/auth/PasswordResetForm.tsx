import React, { useState } from 'react';
import { Rocket, ArrowLeft } from 'lucide-react';
import { Logo } from '../ui/logo';
import { useSupabase } from '../../contexts/SupabaseContext';

interface PasswordResetFormProps {
  onBack: () => void;
}

export function PasswordResetForm({ onBack }: PasswordResetFormProps) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const { resetPassword } = useSupabase();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    try {
      setLoading(true);
      setMessage(null);
      await resetPassword(email);
      setMessage('Check your email for password reset instructions');
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-xl mt-24">
      <div className="flex justify-center mb-6">
        <div className="w-20 h-20 bg-orange-500/20 rounded-full flex items-center justify-center">
          <Rocket className="text-orange-500" size={32} />
        </div>
      </div>

      <h2 className="text-2xl font-bold text-white text-center mb-2">
        Reset Password
      </h2>
      <p className="text-gray-400 text-center mb-6">
        Enter your email to receive password reset instructions
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
            required
          />
        </div>

        {message && (
          <div className={`text-sm text-center ${
            message.includes('Check your email') ? 'text-green-400' : 'text-red-400'
          }`}>
            {message}
          </div>
        )}

        <div className="flex flex-col gap-3">
          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Sending...' : 'Send Reset Instructions'}
          </button>
          
          <button
            type="button"
            onClick={onBack}
            className="flex items-center justify-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Back to Login</span>
          </button>
        </div>
      </form>
    </div>
  );
}