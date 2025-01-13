import React, { useState } from 'react';
import { Star, Send } from 'lucide-react';
import { GuideService } from '../../lib/guide/GuideService';
import { useSupabase } from '../../contexts/SupabaseContext'; 

interface FeedbackFormProps {
  onSubmit: () => void;
  onCancel: () => void;
}

export function FeedbackForm({ onSubmit, onCancel }: FeedbackFormProps) {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [category, setCategory] = useState('general');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useSupabase();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    // Allow submission without rating
    const finalRating = rating || null;

    try {
      setLoading(true);
      setError(null);

      await GuideService.submitFeedback(
        user.id,
        feedback,
        finalRating,
        category
      );

      onSubmit();
    } catch (err) {
      console.error('Error submitting feedback:', err);
      setError('Failed to submit feedback. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 text-sm text-red-400 bg-red-400/10 rounded-lg">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Category
        </label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg"
        >
          <option value="general">General Feedback</option>
          <option value="feature">Feature Request</option>
          <option value="bug">Bug Report</option>
          <option value="content">Content Feedback</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Rating (Optional)
        </label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setRating(value)}
              className={`p-1 rounded-full transition-colors ${
                value <= rating
                  ? 'text-orange-500'
                  : 'text-gray-500 hover:text-orange-400'
              }`}
            >
              <Star size={20} fill={value <= rating ? 'currentColor' : 'none'} />
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Feedback
        </label>
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Share your thoughts..."
          className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
          rows={4}
        />
      </div>

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading || !feedback.trim()}
          className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send size={16} />
          <span>Submit</span>
        </button>
      </div>
    </form>
  );
}