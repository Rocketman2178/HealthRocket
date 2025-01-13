import React, { useState, useRef, useEffect } from 'react';
import { Shield, ChevronDown, ChevronUp, Users, Building2, Rocket, Gift, CreditCard, X } from 'lucide-react';

export function SubscriptionPlan({ onOpenChange }: SubscriptionPlanProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentPlan, setCurrentPlan] = useState('Pro Plan');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    onOpenChange?.(isOpen);
  }, [isOpen, onOpenChange]);
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const plans = [
    {
      name: 'Free Plan',
      price: '$0/month',
      icon: Rocket,
      description: 'Start your health optimization journey',
      prizeEligible: false
    },
    {
      name: 'Pro Plan',
      price: '$59.95/month',
      icon: Shield,
      description: 'Level up with prizes and premium features',
      prizeEligible: true
    },
    {
      name: 'Pro + Family',
      price: '$89.95/month',
      comingSoon: true,
      icon: Users,
      description: 'Gamify health for your entire family',
      prizeEligible: true
    },
    {
      name: 'Pro + Team',
      price: '$149.95/month',
      comingSoon: true,
      icon: Building2,
      description: 'Optimize and gamify health for your entire team',
      prizeEligible: true
    }
  ];

  const handleBillingClick = () => {
    // TODO: Implement billing management
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-orange-500 font-medium hover:text-orange-400 transition-colors relative z-10"
      >
        <Shield size={16} />
        <span>{currentPlan}</span>
        {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[200]">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown Content */}
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <div className="w-full max-w-sm bg-gray-800 rounded-lg shadow-lg border border-gray-700 overflow-hidden">
              {/* Header */}
              <div className="px-4 py-3 text-sm border-b border-gray-700 flex justify-between items-center">
                <span className="text-gray-400">Select a Plan to View or Change</span>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-300 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Plans */}
              <div className="max-h-[60vh] overflow-y-auto">
                {plans.map((plan) => {
                  const Icon = plan.icon;
                  return (
                    <button
                      key={plan.name}
                      onClick={() => {
                        setCurrentPlan(plan.name);
                        setIsOpen(false);
                      }}
                      className={`w-full px-4 py-3 text-sm text-left hover:bg-gray-700 transition-colors ${
                        currentPlan === plan.name ? 'bg-gray-700/50' : ''
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Icon size={16} className={currentPlan === plan.name ? 'text-orange-500' : 'text-gray-400'} />
                        <div className="font-medium text-white">{plan.name}</div>
                        {plan.comingSoon && (
                          <span className="text-xs bg-gray-700 px-2 py-0.5 rounded text-gray-400">
                            Coming Soon
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-orange-500 font-medium">{plan.price}</span>
                      </div>
                      <div className="text-xs text-gray-400">{plan.description}</div>
                      {plan.prizeEligible && (
                        <div className="flex items-center gap-1 mt-2 text-xs text-lime-500">
                          <Gift size={12} />
                          <span>Eligible for Prize Pool Rewards</span>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Divider */}
              <div className="border-t border-gray-700"></div>

              {/* Billing Management */}
              <button
                onClick={handleBillingClick}
                className="w-full px-4 py-3 text-sm text-left hover:bg-gray-700 transition-colors flex items-center gap-2 text-gray-300"
              >
                <CreditCard size={16} />
                <span>Update Card Info</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}