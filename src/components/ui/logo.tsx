import React from 'react';

interface LogoProps {
  className?: string;
}

export function Logo({ className = '' }: LogoProps) {
  return (
    <div className={`flex justify-center w-full ${className}`}>
      <img 
        src="/health-rocket-logo.png" 
        alt="Health Rocket" 
        className="h-20 w-auto" // Increased from h-16 to h-20 (25% larger)
      />
    </div>
  );
}