import React from 'react';
import { AlertTriangle } from 'lucide-react';

export const Disclaimer: React.FC = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-cyber-black/90 backdrop-blur-md border-t border-neon-red/30 text-slate-300 text-[10px] py-2 px-4 z-50">
      <div className="max-w-md mx-auto flex items-center gap-3 font-mono">
        <AlertTriangle className="w-4 h-4 text-neon-red shrink-0 animate-pulse" />
        <p className="leading-tight opacity-80 uppercase tracking-wide">
          <strong className="text-neon-red">WARNING:</strong> EDUCATIONAL USE ONLY. NOT A DIAGNOSTIC DEVICE.
        </p>
      </div>
    </div>
  );
};