import React, { useState } from 'react';
import { useSupabase } from '../../../contexts/SupabaseContext';
import { supabase } from '../../../lib/supabase';

interface NameFormProps {
  onComplete: () => void;
}

export function NameForm({ onComplete }: NameFormProps) {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useSupabase();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      setLoading(true);
      const { error } = await supabase
        .from('users')
        .insert({
          id: user.id,
          email: user.email!,
          name,
          plan: 'Free Plan',
          level: 1,
          fuel_points: 0,
          burn_streak: 0,
          health_score: 0,
          health_span_years: 0
        });

      if (error) throw error;
      onComplete();
    } catch (error) {
      console.error('Error saving name:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-xl">
      <h2 className="text-2xl font-bold text-white mb-2">Welcome!</h2>
      <p className="text-gray-400 mb-6">Let's start by getting to know you.</p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
            What's your name?
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="Enter your full name"
            required
          />
        </div>
        
        <button
          type="submit"
          disabled={loading || !name.trim()}
          className="w-full px-4 py-2 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Saving...' : 'Continue'}
        </button>
      </form>
    </div>
  );
}