import { createContext, useContext } from 'react';
import { AllFeatureLayoutContextType } from '../types/AllFeatureLayout.type';

export const AllFeatureLayoutContext = createContext<AllFeatureLayoutContextType | null>(null);

export const useAllFeatureLayoutContext = () => {
  const ctx = useContext(AllFeatureLayoutContext);
  if (!ctx) throw new Error('AllFeatureLayoutContext not found');
  return ctx;
};