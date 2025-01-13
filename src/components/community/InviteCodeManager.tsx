import React, { useState } from 'react';
import { Ticket, Plus, Calendar, Copy, Check, X } from 'lucide-react';
import { Card } from '../ui/card';
import { supabase } from '../../lib/supabase';
import type { InviteCode } from '../../types/community';

interface InviteCodeManagerProps {
  communityId: string;
  onCodeCreated?: () => void;
}

export function InviteCodeManager({ communityId, onCodeCreated }: InviteCodeManagerProps) {
  const [showCreate, setShowCreate] = useState(false);
  const [type, setType] = useState<'single_use' | 'multi_use' | 'time_limited'>('single_use');
  const [expiresAt, setExpiresAt] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCreate = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .rpc('create_invite_code', {
          p_community_id: communityId,
          p_type: type,
          p_expires_at: type === 'time_limited' ? new Date(expiresAt).toISOString() : null
        });

      if (error) throw error;

      if (onCodeCreated) {
        onCodeCreated();
      }

      setShowCreate(false);
    } catch (err) {
      console.error('Error creating invite code:', err);
      setError(err instanceof Error ? err.message : 'Failed to create invite code');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Ticket className="text-orange-500" size={20} />
          <h3 className="text-lg font-semibold text-white">Invite Codes</h3>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 px-3 py-1.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
        >
          <Plus size={16} />
          <span>Create Code</span>
        </button>
      </div>

      {showCreate && (
        <div className="bg-gray-700/50 rounded-lg p-4 mb-4">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Code Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as typeof type)}
                className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 border border-gray-600"
              >
                <option value="single_use">Single Use</option>
                <option value="multi_use">Multi Use</option>
                <option value="time_limited">Time Limited</option>
              </select>
            </div>

            {type === 'time_limited' && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Expires At
                </label>
                <input
                  type="datetime-local"
                  value={expiresAt}
                  onChange={(e) => setExpiresAt(e.target.value)}
                  className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 border border-gray-600"
                />
              </div>
            )}

            {error && (
              <div className="text-sm text-red-400">{error}</div>
            )}

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowCreate(false)}
                className="px-3 py-1.5 text-gray-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={loading || (type === 'time_limited' && !expiresAt)}
                className="px-3 py-1.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50"
              >
                Create Code
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {/* Invite code list would go here */}
        <div className="text-sm text-center text-gray-400">
          No active invite codes
        </div>
      </div>
    </Card>
  );
}