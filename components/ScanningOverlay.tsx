import React from 'react';
import { Loader2 } from 'lucide-react';

interface ScanningOverlayProps {
  imageUrl: string;
}

export const ScanningOverlay: React.FC<ScanningOverlayProps> = ({ imageUrl }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-soft p-8 text-center border border-gray-100 dark:border-gray-700">
      <div className="mb-6 relative inline-block">
        <img 
          src={imageUrl} 
          alt="Analyzing" 
          className="w-64 h-64 object-cover rounded-lg shadow-md mx-auto opacity-50"
        />
        <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
        </div>
      </div>
      <h3 className="text-xl font-bold text-dark dark:text-white mb-2">Analyzing Image...</h3>
      <p className="text-gray-500 dark:text-gray-400">Please wait while our AI processes the skin lesion.</p>
    </div>
  );
};