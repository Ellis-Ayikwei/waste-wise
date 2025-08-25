import React from 'react';

interface InputProps {
  id?: string;
  type?: string;
  placeholder?: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  disabled?: boolean;
  step?: string;
}

const Input: React.FC<InputProps> = ({
  id,
  type = 'text',
  placeholder = '',
  value,
  onChange,
  className = '',
  disabled = false,
  step,
}) => {
  return (
    <input
      id={id}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      step={step}
      className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
        disabled ? 'bg-gray-100 text-gray-500' : ''
      } ${className}`}
    />
  );
};

export default Input;
