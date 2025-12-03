import React from 'react';
import { AnalysisResult, RiskLevel } from '../types';
import { Button } from './Button';
import { Share2, RotateCcw, AlertCircle, CheckCircle } from 'lucide-react';
import { DoctorLocator } from './DoctorLocator';

interface ResultsDashboardProps {
  result: AnalysisResult;
  onReset: () => void;
  imageUrl: string;
}

export const ResultsDashboard: React.FC<ResultsDashboardProps> = ({ result, onReset, imageUrl }) => {
  const isHighRisk = result.riskLevel === RiskLevel.HIGH || result.riskLevel === RiskLevel.MODERATE;

  return (
    <div className="space-y-8 animate-[fadeIn_0.5s_ease-out]">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-soft overflow-hidden border border-gray-100 dark:border-gray-700">
        <div className="p-6 border-b border-gray-100 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-dark dark:text-white text-center">Analysis Result</h2>
        </div>
        
        <div className="p-8">
          <div className="flex flex-col md:flex-row gap-8 items-center mb-8">
             <div className="w-full md:w-1/3">
                <img src={imageUrl} alt="Result" className="w-full h-64 object-cover rounded-lg shadow-sm" />
             </div>
             <div className="w-full md:w-2/3 space-y-4">
                <div className={`p-4 rounded-lg border-l-4 ${isHighRisk ? 'bg-red-50 dark:bg-red-900/20 border-red-500' : 'bg-green-50 dark:bg-green-900/20 border-green-500'}`}>
                    <h3 className={`font-bold text-lg mb-1 ${isHighRisk ? 'text-red-800 dark:text-red-300' : 'text-green-800 dark:text-green-300'}`}>
                        {isHighRisk ? 'Attention Required' : 'Likely Benign'}
                    </h3>
                    <p className={`text-lg ${isHighRisk ? 'text-red-700 dark:text-red-200' : 'text-green-700 dark:text-green-200'}`}>
                        This image most likely belongs to <span className="font-bold">{result.classification}</span> with a <span className="font-bold">{result.confidence}%</span> confidence.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
                        <span className="text-gray-500 dark:text-gray-400 text-sm block mb-1">Risk Level</span>
                        <span className={`font-bold text-lg ${isHighRisk ? 'text-red-500 dark:text-red-400' : 'text-green-500 dark:text-green-400'}`}>{result.riskLevel}</span>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
                        <span className="text-gray-500 dark:text-gray-400 text-sm block mb-1">Confidence</span>
                        <span className="font-bold text-lg text-dark dark:text-white">{result.confidence}%</span>
                    </div>
                </div>
                
                <div>
                   <h4 className="font-bold text-dark dark:text-white mb-2">Findings:</h4>
                   <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-1">
                      {result.findings.map((finding, idx) => (
                          <li key={idx}>{finding}</li>
                      ))}
                   </ul>
                </div>
             </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-100 dark:border-blue-900/30 mb-8">
              <div className="flex gap-3">
                  <AlertCircle className="w-6 h-6 text-blue-500 shrink-0" />
                  <div>
                      <h4 className="font-bold text-blue-800 dark:text-blue-300 mb-1">Recommendation</h4>
                      <p className="text-blue-700 dark:text-blue-200">{result.recommendation}</p>
                  </div>
              </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
             <Button variant="outline" onClick={() => {
                 // Share logic
                 const text = `Skin Analysis Result: ${result.classification} (${result.confidence}%)`;
                 if (navigator.share) navigator.share({ title: 'Analysis', text });
                 else navigator.clipboard.writeText(text).then(() => alert('Copied to clipboard'));
             }}>
                <Share2 size={18} className="mr-2" /> Share Result
             </Button>
             <Button onClick={onReset}>
                <RotateCcw size={18} className="mr-2" /> Analyze Another
             </Button>
          </div>
        </div>
      </div>

      <DoctorLocator />
    </div>
  );
};