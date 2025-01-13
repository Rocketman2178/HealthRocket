import React from 'react';
import { CheckCircle2, Clock, AlertTriangle } from 'lucide-react';

interface VerificationRequirementsProps {
  verificationRequirements: {
    week1: { completed: number; deadline: string };
    week2: { completed: number; deadline: string };
    week3: { completed: number; deadline: string };
  };
}

export function VerificationRequirements({ verificationRequirements }: VerificationRequirementsProps) {
  const now = new Date();

  const weeks = [
    {
      number: 1,
      requirements: verificationRequirements.week1,
      deadline: new Date(verificationRequirements.week1.deadline)
    },
    {
      number: 2,
      requirements: verificationRequirements.week2,
      deadline: new Date(verificationRequirements.week2.deadline)
    },
    {
      number: 3,
      requirements: verificationRequirements.week3,
      deadline: new Date(verificationRequirements.week3.deadline)
    }
  ];

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-medium text-white">Verification Requirements</h4>
      <div className="space-y-2">
        {weeks.map((week) => {
          const isPastDeadline = now > week.deadline;
          const isCompleted = week.requirements.completed > 0;
          const isCurrentWeek = now <= week.deadline && (!week.number === 1 || now > weeks[week.number - 2]?.deadline);

          return (
            <div 
              key={week.number}
              className={`flex items-center justify-between p-2 rounded-lg ${
                isCompleted 
                  ? 'bg-gray-700/30 text-gray-300'
                  : isPastDeadline
                    ? 'bg-red-500/10 text-red-400'
                    : isCurrentWeek
                      ? 'bg-orange-500/10 text-orange-400'
                      : 'bg-gray-700/50 text-gray-400'
              }`}
            >
              <div className="flex items-center gap-2">
                {isCompleted ? (
                  <CheckCircle2 size={16} className="text-lime-500" />
                ) : isPastDeadline ? (
                  <AlertTriangle size={16} className="text-red-400" />
                ) : (
                  <Clock size={16} />
                )}
                <span className="text-sm">Week {week.number} Verification</span>
              </div>
              <div className="text-xs">
                {isCompleted ? (
                  "Complete"
                ) : isPastDeadline ? (
                  "Missed"
                ) : (
                  `Due ${week.deadline.toLocaleDateString()}`
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}