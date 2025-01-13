import React from 'react';

interface ModalContainerProps {
  children: React.ReactNode;
  onClose?: () => void;
}

export function ModalContainer({ children, onClose }: ModalContainerProps) {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 mb-16">
      <div 
        className="relative w-full max-w-2xl bg-gray-800 rounded-lg shadow-xl mb-16"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
      {onClose && (
        <div 
          className="absolute inset-0"
          onClick={onClose}
        />
      )}
    </div>
  );
}