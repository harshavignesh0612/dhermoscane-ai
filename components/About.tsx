import React from 'react';

export const About: React.FC = () => {
  return (
    <div>
      <div 
        className="relative bg-cover bg-center h-[300px] flex items-center justify-center" 
        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80")' }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="relative z-10 text-center">
            <p className="text-gray-200 text-sm uppercase tracking-wider mb-2">Home / About</p>
            <h1 className="text-4xl font-bold text-white">About Skin Cancer Disease</h1>
        </div>
      </div>

      <div className="py-16 container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h1 className="text-3xl font-bold text-dark dark:text-white mb-6">Overview</h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg leading-relaxed">
            Cancer begins when healthy cells change and grow out of control, forming a mass called a tumor. A tumor can be cancerous or benign. A cancerous tumor is malignant, meaning it can grow and spread to other parts of the body. A benign tumor means the tumor can grow but will not spread.
          </p>
          <p className="text-gray-500 dark:text-gray-400 text-lg leading-relaxed mt-4">
            Doctors diagnose skin cancer in more than 3 million Americans each year, making it the most common type of cancer. If skin cancer is found early, it can usually be treated with topical medications, procedures done in the office by a dermatologist, or an outpatient surgery.
          </p>
        </div>

        <h1 className="text-center text-3xl font-bold text-dark dark:text-white mb-10">Symptoms And Causes</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-soft border border-gray-100 dark:border-gray-700">
             <h3 className="text-xl font-bold text-dark dark:text-white mb-3">Multidisciplinary Team</h3>
             <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">In some cases, skin cancer may be more advanced and require management by a multidisciplinary team that often includes a dermatologist, surgical oncologist, radiation oncologist, and a medical oncologist.</p>
             <span className="text-primary font-medium text-sm">Read more</span>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-soft border border-gray-100 dark:border-gray-700">
             <h3 className="text-xl font-bold text-dark dark:text-white mb-3">Basal Cell Carcinoma</h3>
             <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">Basal cells are the round cells found in the lower epidermis. About 80% of skin cancers develop from this type of cell. It usually grows slowly and rarely spreads to other parts of the body.</p>
             <span className="text-primary font-medium text-sm">Symptoms</span>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-soft border border-gray-100 dark:border-gray-700">
             <h3 className="text-xl font-bold text-dark dark:text-white mb-3">Squamous Cell Carcinoma</h3>
             <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">Around 20% of skin cancers develop from squamous cells. It is mainly caused by sun exposure, so it may be diagnosed on many regions of the skin.</p>
             <span className="text-primary font-medium text-sm">Treatments</span>
          </div>
        </div>
      </div>
    </div>
  );
};