import React from 'react';

interface SpaceBackgroundProps {
  children: React.ReactNode;
  className?: string;
}

export function SpaceBackground({ children, className = '' }: SpaceBackgroundProps) {
  return (
    <div className={`relative min-h-screen ${className}`}>
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1475274047050-1d0c0975c63e?auto=format&fit=crop&q=80")',
          backgroundPosition: 'center',
          backgroundSize: 'cover'
        }}
      >
        {/* Add a subtle overlay to ensure text readability */}
        <div className="absolute inset-0 bg-black/30" />
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  );
}