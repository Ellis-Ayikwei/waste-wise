import React, { useState, useRef, useEffect } from 'react';
import { IconChevronDown } from '@tabler/icons-react';

interface SelectProps {
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
  placeholder?: string;
  className?: string;
}

interface SelectTriggerProps {
  children: React.ReactNode;
  className?: string;
}

interface SelectContentProps {
  children: React.ReactNode;
  className?: string;
}

interface SelectItemProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

interface SelectValueProps {
  placeholder?: string;
  children?: React.ReactNode;
}

const Select: React.FC<SelectProps> = ({ value, onValueChange, children, placeholder, className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState('');
  const selectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (newValue: string, label: string) => {
    onValueChange(newValue);
    setSelectedLabel(label);
    setIsOpen(false);
  };

  return (
    <div ref={selectRef} className={`relative ${className}`}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          if (child.type === SelectTrigger) {
            return React.cloneElement(child, {
              onClick: () => setIsOpen(!isOpen),
              isOpen,
              selectedLabel: selectedLabel || placeholder
            });
          }
          if (child.type === SelectContent && isOpen) {
            return React.cloneElement(child, {
              onSelect: handleSelect
            });
          }
        }
        return null;
      })}
    </div>
  );
};

const SelectTrigger: React.FC<SelectTriggerProps & { onClick?: () => void; isOpen?: boolean; selectedLabel?: string }> = ({ 
  children, 
  className = '',
  onClick,
  isOpen,
  selectedLabel
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${className}`}
    >
      <div className="flex items-center justify-between">
        <span className={selectedLabel ? 'text-gray-900' : 'text-gray-500'}>
          {selectedLabel || 'Select an option'}
        </span>
        <IconChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>
    </button>
  );
};

const SelectContent: React.FC<SelectContentProps & { onSelect?: (value: string, label: string) => void }> = ({ 
  children, 
  className = '',
  onSelect
}) => {
  return (
    <div className={`absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto ${className}`}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child) && child.type === SelectItem) {
          return React.cloneElement(child, {
            onSelect
          });
        }
        return child;
      })}
    </div>
  );
};

const SelectItem: React.FC<SelectItemProps & { onSelect?: (value: string, label: string) => void }> = ({ 
  value, 
  children, 
  className = '',
  onSelect
}) => {
  return (
    <button
      type="button"
      onClick={() => onSelect?.(value, children as string)}
      className={`w-full px-3 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none ${className}`}
    >
      {children}
    </button>
  );
};

const SelectValue: React.FC<SelectValueProps> = ({ placeholder, children }) => {
  return <>{children || placeholder}</>;
};

export { Select, SelectTrigger, SelectContent, SelectItem, SelectValue };
