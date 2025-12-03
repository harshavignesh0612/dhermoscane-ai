import React, { useEffect, useState } from 'react';
import { MapPin, Phone, ExternalLink, Loader2 } from 'lucide-react';
import { findNearbyDermatologists } from '../services/geminiService';
import { Doctor } from '../types';

export const DoctorLocator: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (err) => {
          console.error("Geolocation error:", err);
          setError("Location access denied.");
        }
      );
    } else {
      setError("Geolocation not supported.");
    }
  }, []);

  useEffect(() => {
    if (location) {
      setLoading(true);
      findNearbyDermatologists(location.lat, location.lng)
        .then(data => {
            setDoctors(data);
            setLoading(false);
        })
        .catch(err => {
            console.error(err);
            setError("Could not load doctors.");
            setLoading(false);
        });
    }
  }, [location]);

  return (
    <div className="py-8">
      <h2 className="text-2xl font-bold text-center text-dark dark:text-white mb-8">Nearby Dermatologists</h2>
      
      {loading ? (
        <div className="flex justify-center p-8">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      ) : error ? (
        <div className="text-center text-red-500 p-4">{error}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {doctors.length > 0 ? doctors.map((doc, i) => (
             <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow-soft border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow">
               <div className="h-32 bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                  <div className="w-20 h-20 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden border-4 border-white dark:border-gray-800 shadow-sm">
                      <img src={`https://source.unsplash.com/random/100x100?doctor,sig=${i}`} alt="Doctor" className="w-full h-full object-cover" />
                  </div>
               </div>
               <div className="p-6 text-center">
                 <h4 className="font-bold text-lg text-dark dark:text-white mb-1">{doc.name}</h4>
                 <span className="text-sm text-gray-500 dark:text-gray-400 block mb-3">Dermatology</span>
                 <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2 h-10">{doc.address}</p>
                 
                 <div className="flex justify-center gap-3">
                   <button className="p-2 rounded-full bg-light dark:bg-gray-700 text-primary hover:bg-primary hover:text-white transition-colors">
                      <Phone size={18} />
                   </button>
                   {doc.uri && (
                     <a href={doc.uri} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-light dark:bg-gray-700 text-primary hover:bg-primary hover:text-white transition-colors">
                        <ExternalLink size={18} />
                     </a>
                   )}
                 </div>
               </div>
             </div>
           )) : (
             <div className="col-span-full text-center text-gray-500 dark:text-gray-400">No doctors found nearby.</div>
           )}
        </div>
      )}
    </div>
  );
};