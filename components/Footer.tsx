import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin, Github } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-gray-800 pt-16 pb-8 border-t border-gray-100 dark:border-gray-700 mt-auto transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <h5 className="font-bold text-dark dark:text-white mb-4">Company</h5>
            <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
              <li><a href="#" className="hover:text-primary">About Us</a></li>
              <li><a href="#" className="hover:text-primary">Career</a></li>
              <li><a href="#" className="hover:text-primary">Editorial Team</a></li>
              <li><a href="#" className="hover:text-primary">Protection</a></li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold text-dark dark:text-white mb-4">More</h5>
            <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
              <li><a href="#" className="hover:text-primary">Terms & Condition</a></li>
              <li><a href="#" className="hover:text-primary">Privacy</a></li>
              <li><a href="#" className="hover:text-primary">Advertise</a></li>
              <li><a href="#" className="hover:text-primary">Join as Doctors</a></li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold text-dark dark:text-white mb-4">Our Partner</h5>
            <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
              <li><a href="#" className="hover:text-primary">One-Fitness</a></li>
              <li><a href="#" className="hover:text-primary">One-Drugs</a></li>
              <li><a href="#" className="hover:text-primary">One-Live</a></li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold text-dark dark:text-white mb-4">Contact</h5>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">351 Willow Street Franklin, MA 02038</p>
            <a href="#" className="block text-sm text-primary mb-1">701-573-7582</a>
            <a href="#" className="block text-sm text-primary mb-4">healthcare@temporary.net</a>

            <div className="flex space-x-3">
              <a href="#" className="text-gray-400 dark:text-gray-500 hover:text-primary"><Facebook size={18} /></a>
              <a href="#" className="text-gray-400 dark:text-gray-500 hover:text-primary"><Twitter size={18} /></a>
              <a href="#" className="text-gray-400 dark:text-gray-500 hover:text-primary"><Instagram size={18} /></a>
              <a href="#" className="text-gray-400 dark:text-gray-500 hover:text-primary"><Linkedin size={18} /></a>
            </div>
          </div>
        </div>
        
        <hr className="border-gray-200 dark:border-gray-700 mb-6" />
        
        <p className="text-center text-sm text-gray-500 dark:text-gray-400">
          Copyright &copy; 2024 <a href="#" className="text-primary">Skin Cancer AI</a>. All rights reserved
        </p>
      </div>
    </footer>
  );
};