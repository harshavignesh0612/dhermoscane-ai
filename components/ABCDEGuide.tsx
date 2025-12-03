import React from 'react';
import { X } from 'lucide-react';

interface ABCDEGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ABCDEGuide: React.FC<ABCDEGuideProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl relative z-10 overflow-hidden animate-[fadeIn_0.3s_ease-out]">
        <div className="p-6 border-b dark:border-gray-700 flex justify-between items-center bg-light dark:bg-gray-900">
          <h2 className="text-xl font-bold text-dark dark:text-white">ABCDEs of Melanoma</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-dark dark:hover:text-white">
            <X size={24} />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[70vh]">
          <p className="text-gray-500 dark:text-gray-400 mb-6">Dermatologists use the ABCDE rule to distinguish benign moles from melanomas.</p>
          
          <div className="space-y-4">
            <div className="flex gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="text-3xl font-bold text-primary w-12 text-center">A</div>
                <div>
                    <h3 className="font-bold text-dark dark:text-white">Asymmetry</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">One half does not match the other half.</p>
                </div>
            </div>
            <div className="flex gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="text-3xl font-bold text-primary w-12 text-center">B</div>
                <div>
                    <h3 className="font-bold text-dark dark:text-white">Border</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">The edges are irregular, ragged, notched, or blurred.</p>
                </div>
            </div>
            <div className="flex gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="text-3xl font-bold text-primary w-12 text-center">C</div>
                <div>
                    <h3 className="font-bold text-dark dark:text-white">Color</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">The color is not the same all over and may include shades of brown or black, or sometimes with patches of pink, red, white, or blue.</p>
                </div>
            </div>
            <div className="flex gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="text-3xl font-bold text-primary w-12 text-center">D</div>
                <div>
                    <h3 className="font-bold text-dark dark:text-white">Diameter</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">The spot is larger than 6 millimeters across (about ¼ inch – the size of a pencil eraser), although melanomas can sometimes be smaller than this.</p>
                </div>
            </div>
            <div className="flex gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="text-3xl font-bold text-primary w-12 text-center">E</div>
                <div>
                    <h3 className="font-bold text-dark dark:text-white">Evolving</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">The mole is changing in size, shape, or color.</p>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};