import React, { useState } from 'react';
import { Edit2, Check, X } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface EditableFieldProps {
  icon: LucideIcon;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}

export function EditableField({ icon: Icon, value, onChange, placeholder }: EditableFieldProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);

  const handleSave = () => {
    onChange(tempValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempValue(value);
    setIsEditing(false);
  };

  return (
    <div className="flex items-center gap-2">
      <Icon size={16} className="text-gray-400 shrink-0" />
      {isEditing ? (
        <div className="flex-1 flex items-center gap-2">
          <input
            type="text"
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            className="flex-1 bg-gray-800 text-white rounded px-2 py-1 text-sm"
            placeholder={placeholder}
          />
          <button onClick={handleSave} className="text-lime-500 hover:text-lime-400">
            <Check size={16} />
          </button>
          <button onClick={handleCancel} className="text-red-500 hover:text-red-400">
            <X size={16} />
          </button>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-between text-gray-400">
          <span>{value}</span>
          <button 
            onClick={() => setIsEditing(true)}
            className="text-gray-500 hover:text-gray-300"
          >
            <Edit2 size={14} />
          </button>
        </div>
      )}
    </div>
  );
}