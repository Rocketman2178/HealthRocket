import React from 'react';
import { CheckCircle2, Clock } from 'lucide-react';
import { Progress } from '../../ui/progress';

interface VerificationProgressProps {
  verificationRequirements: {
    week1: { completed: number; deadline: string };
    week2: { completed: number; deadline: string };
    week3: { completed: number; deadline: string };
  };
}

export function VerificationProgress({ verificationRequirements }: VerificationProgressProps) {
  // Calculate total weeks completed
  const completedWeeks = [
    verificationRequirements.week1.completed > 0,
    verificationRequirements.week2.completed > 0,
    verificationRequirements.week3.completed > 0
  ].filter(Boolean).length;

  // Calculate progress percentage
  const progress = (completedWeeks / 3) * 100;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2 text-gray-400">
          <CheckCircle2 size={16} className="text-lime-500" />
          <span>Verification Progress</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock size={14} className="text-orange-500" />
          <span className="text-orange-500">{completedWeeks}/3 Weeks</span>
        </div>
      </div>
      <Progress value={progress} max={100} className="bg-gray-700 h-2" />
      <div className="flex justify-between text-xs text-gray-400">
        <span>Weekly Verifications</span>
        <span>{progress.toFixed(0)}% Complete</span>
      </div>
    </div>
  );
}