import React, { useState } from 'react';
import { UserProfileData, PredictionHistoryItem, RiskLevel } from '../types';
import { Button } from './Button';
import { User, Mail, Phone, Calendar, Save, Clock, AlertCircle, CheckCircle, AlertTriangle } from 'lucide-react';

interface UserProfileProps {
  user: UserProfileData;
  history: PredictionHistoryItem[];
  onUpdateUser: (data: UserProfileData) => void;
}

export const UserProfile: React.FC<UserProfileProps> = ({ user, history, onUpdateUser }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(user);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser(formData);
    setIsEditing(false);
  };

  const getRiskColor = (risk: RiskLevel) => {
    switch (risk) {
      case RiskLevel.HIGH: return 'text-red-500 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
      case RiskLevel.MODERATE: return 'text-orange-500 bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800';
      case RiskLevel.LOW: return 'text-green-500 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
      default: return 'text-gray-500 bg-gray-50';
    }
  };

  const getRiskIcon = (risk: RiskLevel) => {
    switch (risk) {
      case RiskLevel.HIGH: return <AlertTriangle size={16} />;
      case RiskLevel.MODERATE: return <AlertCircle size={16} />;
      case RiskLevel.LOW: return <CheckCircle size={16} />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 animate-[fadeIn_0.5s_ease-out]">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: User Details */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-soft border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="h-32 bg-primary/10 relative">
               <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
                  <div className="w-24 h-24 rounded-full border-4 border-white dark:border-gray-800 bg-gray-200 overflow-hidden">
                     <img src={user.avatar || "https://source.unsplash.com/random/200x200?face"} alt="Profile" className="w-full h-full object-cover" />
                  </div>
               </div>
            </div>
            
            <div className="pt-16 pb-6 px-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-dark dark:text-white">{user.name}</h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Member since 2024</p>
              </div>

              {isEditing ? (
                <form onSubmit={handleSave} className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Full Name</label>
                    <div className="flex items-center gap-2 mt-1 border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-gray-50 dark:bg-gray-700">
                      <User size={16} className="text-gray-400" />
                      <input 
                        type="text" 
                        value={formData.name} 
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="bg-transparent w-full outline-none text-dark dark:text-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Email</label>
                    <div className="flex items-center gap-2 mt-1 border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-gray-50 dark:bg-gray-700">
                      <Mail size={16} className="text-gray-400" />
                      <input 
                        type="email" 
                        value={formData.email} 
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="bg-transparent w-full outline-none text-dark dark:text-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Phone</label>
                    <div className="flex items-center gap-2 mt-1 border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-gray-50 dark:bg-gray-700">
                      <Phone size={16} className="text-gray-400" />
                      <input 
                        type="text" 
                        value={formData.phone || ''} 
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="bg-transparent w-full outline-none text-dark dark:text-white"
                        placeholder="+1 (555) 000-0000"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button type="submit" fullWidth>Save Changes</Button>
                    <Button type="button" variant="secondary" onClick={() => setIsEditing(false)}>Cancel</Button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <div className="bg-primary/10 p-2 rounded text-primary"><Mail size={18} /></div>
                    <div className="overflow-hidden">
                      <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase">Email</p>
                      <p className="text-dark dark:text-white truncate">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <div className="bg-primary/10 p-2 rounded text-primary"><Phone size={18} /></div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase">Phone</p>
                      <p className="text-dark dark:text-white">{user.phone || 'Not set'}</p>
                    </div>
                  </div>
                   <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <div className="bg-primary/10 p-2 rounded text-primary"><Calendar size={18} /></div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase">Date of Birth</p>
                      <p className="text-dark dark:text-white">{user.dob || 'Not set'}</p>
                    </div>
                  </div>
                  
                  <Button variant="outline" fullWidth onClick={() => setIsEditing(true)} className="mt-4">
                    Edit Profile
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: History */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-soft border border-gray-100 dark:border-gray-700 overflow-hidden h-full flex flex-col">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
              <h3 className="text-xl font-bold text-dark dark:text-white flex items-center gap-2">
                <Clock size={20} className="text-primary" /> Prediction History
              </h3>
              <span className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
                {history.length} Records
              </span>
            </div>
            
            <div className="p-6 flex-1 overflow-y-auto max-h-[600px]">
              {history.length === 0 ? (
                <div className="text-center py-12">
                  <div className="bg-gray-100 dark:bg-gray-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                    <Clock size={32} />
                  </div>
                  <h4 className="text-lg font-bold text-gray-500 dark:text-gray-400">No history found</h4>
                  <p className="text-gray-400 text-sm mt-2">Start a prediction to see your results here.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {history.map((item) => (
                    <div key={item.id} className="border border-gray-100 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow bg-gray-50/50 dark:bg-gray-700/30 flex flex-col sm:flex-row gap-4">
                      <div className="w-full sm:w-24 h-24 shrink-0 rounded-md overflow-hidden bg-gray-200">
                        <img src={item.imageUrl} alt="Analysis" className="w-full h-full object-cover" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2">
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mb-1">
                              <Calendar size={12} /> {item.date}
                            </p>
                            <h4 className="font-bold text-dark dark:text-white text-lg">{item.result.classification}</h4>
                          </div>
                          <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${getRiskColor(item.result.riskLevel)}`}>
                            {getRiskIcon(item.result.riskLevel)}
                            {item.result.riskLevel}
                          </div>
                        </div>
                        
                        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-3">
                           {item.result.recommendation}
                        </p>
                        
                        <div className="flex items-center gap-4 text-xs font-medium text-gray-500">
                           <span>Confidence: <span className="text-dark dark:text-white">{item.result.confidence}%</span></span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};