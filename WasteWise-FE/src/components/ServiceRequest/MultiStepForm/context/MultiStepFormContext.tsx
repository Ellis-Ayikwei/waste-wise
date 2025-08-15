import React, { createContext } from 'react';
import { MultiStepFormContextType } from '../types';

// Create the context
export const MultiStepFormContext = createContext<MultiStepFormContextType | null>(null);

// Provider component props
interface MultiStepFormProviderProps {
  children: React.ReactNode;
  value: MultiStepFormContextType;
}

// Provider component
export const MultiStepFormProvider: React.FC<MultiStepFormProviderProps> = ({
  children,
  value,
}) => {
  return (
    <MultiStepFormContext.Provider value={value}>
      {children}
    </MultiStepFormContext.Provider>
  );
};