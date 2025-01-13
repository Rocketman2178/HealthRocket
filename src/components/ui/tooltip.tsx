import React, { useState } from 'react';
import { Info, X } from 'lucide-react';
import { ModalContainer } from './modal-container';
import { HEALTH_CATEGORIES } from '../../data/healthCategories';

interface TooltipProps {
  content?: React.ReactNode;
  children?: React.ReactNode;
  categoryId?: string;
}

export function Tooltip({ content, children, categoryId }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const healthCategory = categoryId ? HEALTH_CATEGORIES.find(cat => cat.id === categoryId) : null;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsVisible(!isVisible);
  };


  const defaultContent = (
    <div className="space-y-4">
      <div>
        <h4 className="font-semibold text-white text-sm mb-1">Rank & Status Calculation</h4>
        <p className="text-gray-300 text-xs">
          Your Current Rank and Status are calculated based on your average daily Fuel Points (FP) earned compared to other players in your Community.
        </p>
      </div>

      <div>
        <h4 className="font-semibold text-white text-sm mb-1">Status Period</h4>
        <ul className="space-y-3">
          <li className="flex items-start gap-2">
            <div className="mt-1">
              <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
            </div>
            <div>
              <div className="text-gray-300 font-medium text-xs">First 30 Days</div>
              <p className="text-gray-400 text-xs">Your status will be "Pending" while we establish your baseline performance</p>
            </div>
          </li>
          <li className="flex items-start gap-2">
            <div className="mt-1">
              <div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div>
            </div>
            <div>
              <div className="text-gray-300 font-medium text-xs">90-Day Rolling Average</div>
              <p className="text-gray-400 text-xs">After your first 30 days, your status is calculated using your average daily FP over the past 90 days</p>
            </div>
          </li>
        </ul>
      </div>

      <div>
        <h4 className="font-semibold text-white text-sm mb-1">Status Requirements</h4>
        <ul className="space-y-3">
          <li className="flex items-start gap-2">
            <div className="mt-1">
              <div className="w-1.5 h-1.5 rounded-full bg-lime-500"></div>
            </div>
            <div>
              <div className="text-lime-500 font-medium text-xs">Hero Status</div>
              <p className="text-gray-300 text-xs">Maintain top 50% of Community FP earnings</p>
              <p className="text-gray-400 text-[10px] mt-0.5">Prize Pool Eligible</p>
            </div>
          </li>
          <li className="flex items-start gap-2">
            <div className="mt-1">
              <div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div>
            </div>
            <div>
              <div className="text-orange-500 font-medium text-xs">Legend Status</div>
              <p className="text-gray-300 text-xs">Achieve top 10% of Community FP earnings</p>
              <p className="text-gray-400 text-[10px] mt-0.5">2X Prize Pool Eligible</p>
            </div>
          </li>
        </ul>
      </div>

      <div className="border-t border-gray-700 pt-3">
        <p className="text-[10px] text-gray-400">
          Rankings and Status update daily based on your Community's performance
        </p>
      </div>
    </div>
  );

  const healthCategoryContent = healthCategory && (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-white mb-2">{healthCategory.name}</h3>
        <p className="text-orange-500 text-lg">{healthCategory.subtitle}</p>
      </div>

      <div>
        <h4 className="text-lg font-semibold text-gray-300 mb-2">Overview</h4>
        <p className="text-gray-400 leading-relaxed">{healthCategory.description}</p>
      </div>

      <div>
        <h4 className="text-lg font-semibold text-gray-300 mb-3">Key Components</h4>
        <div className="grid grid-cols-1 gap-3">
          {healthCategory.keyComponents.map((component, index) => (
            <div key={index} className="flex items-start gap-3">
              <div className="mt-1.5">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              </div>
              <span className="text-gray-400">{component}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="relative inline-block">
      <button
        onClick={handleClick}
        className="text-gray-400 hover:text-gray-300 transition-colors"
      >
        {children || <Info size={14} />}
      </button>
      {isVisible && (
        <ModalContainer onClose={() => setIsVisible(false)}>
          <div className="w-full max-w-md max-h-[85vh] flex flex-col">
            <div className="flex justify-end p-3 border-b border-gray-700">
              <button
                onClick={() => setIsVisible(false)}
                className="text-gray-400 hover:text-gray-300 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            <div className="p-4 overflow-y-auto">
              {healthCategory ? healthCategoryContent : (content || defaultContent)}
            </div>
          </div>
        </ModalContainer>
      )}
    </div>
  );
}