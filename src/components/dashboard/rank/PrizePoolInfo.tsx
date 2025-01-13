import React, { useState, useEffect } from 'react';
import { Trophy, ExternalLink, X } from 'lucide-react';
import { supabase } from '../../../lib/supabase';

interface Partner {
  id: string;
  name: string;
  description: string;
  prize_description: string;
  website_url: string;
  logo_url?: string;
}

export function PrizePoolInfo() {
  const [isOpen, setIsOpen] = useState(false);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPartners() {
      try {
        const { data, error } = await supabase
          .rpc('get_prize_pool_partners');

        if (error) throw error;
        setPartners(data || []);
      } catch (err) {
        console.error('Error fetching partners:', err);
      } finally {
        setLoading(false);
      }
    }

    if (isOpen) {
      fetchPartners();
    }
  }, [isOpen]);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex flex-col items-center gap-1 text-gray-400 hover:text-orange-500 transition-colors"
      >
        <Trophy size={16} />
        <span className="text-[10px]">Prize Pool Info</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-lg max-w-2xl w-full">
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
              <div>
                <h2 className="text-xl font-bold text-white">Monthly Prize Pool Info</h2>
                <p className="text-sm text-gray-400 mt-1">
                  Pro Players are eligible to win prizes from these great Health & Wellness partners
                </p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-300"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-4 max-h-[70vh] overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500" />
                </div>
              ) : (
                <div className="space-y-6">
                  {partners.map(partner => (
                    <div 
                      key={partner.id}
                      className="bg-gray-700/50 rounded-lg p-4 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-white">{partner.name}</h3>
                        <a
                          href={partner.website_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-3 py-1.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm"
                        >
                          <span>Visit</span>
                          <ExternalLink size={14} />
                        </a>
                      </div>
                      <p className="text-sm text-gray-300">{partner.description}</p>
                      <div className="bg-orange-500/10 text-orange-500 px-3 py-2 rounded-lg text-sm">
                        {partner.prize_description}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-4 border-t border-gray-700 text-center text-xs text-gray-400">
              Prize eligibility based on monthly leaderboard status
            </div>
          </div>
        </div>
      )}
    </>
  );
}