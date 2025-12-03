import React from 'react';
import { Page } from '../types';
import { Menu, X, Sun, Moon, LogIn, User } from 'lucide-react';
import { Button } from './Button';

interface HeaderProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  toggleTheme: () => void;
  isDarkMode: boolean;
  isLoggedIn: boolean;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  currentPage, 
  onNavigate, 
  toggleTheme, 
  isDarkMode,
  isLoggedIn,
  onLogout
}) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const navClass = (page: Page) => 
    `cursor-pointer px-3 py-2 text-sm font-medium transition-colors ${
      currentPage === page 
      ? 'text-primary' 
      : 'text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary'
    }`;

  return (
    <header>
      <nav className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-50 border-b border-gray-100 dark:border-gray-700 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Brand */}
            <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => onNavigate(Page.HOME)}>
              <span className="text-2xl font-bold text-dark dark:text-white">Skin Cancer<span className="text-primary">-Disease</span></span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-6">
              <a onClick={() => onNavigate(Page.HOME)} className={navClass(Page.HOME)}>Home</a>
              <a onClick={() => onNavigate(Page.ABOUT)} className={navClass(Page.ABOUT)}>About</a>
              <a onClick={() => onNavigate(Page.DOCTORS)} className={navClass(Page.DOCTORS)}>Doctors</a>
              <a onClick={() => onNavigate(Page.PREDICTION)} className={navClass(Page.PREDICTION)}>Prediction</a>
              
              <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 mx-2"></div>
              
              <button 
                onClick={toggleTheme}
                className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors focus:outline-none"
                aria-label="Toggle Dark Mode"
              >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>

              {isLoggedIn ? (
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => onNavigate(Page.PROFILE)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-full transition-colors ${currentPage === Page.PROFILE ? 'bg-primary/10 text-primary' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                  >
                     <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary overflow-hidden">
                        <User size={14} />
                     </div>
                     <span className="text-sm font-medium">Profile</span>
                  </button>
                  <Button variant="outline" onClick={onLogout} className="py-2 px-3 !text-xs border-none text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20">
                    Logout
                  </Button>
                </div>
              ) : (
                <div className="flex gap-2">
                   <Button variant="outline" onClick={() => onNavigate(Page.LOGIN)} className="py-2 px-4 !text-xs">
                     Login
                   </Button>
                   <Button onClick={() => onNavigate(Page.SIGNUP)} className="py-2 px-4 !text-xs">
                     Join
                   </Button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center gap-4">
              <button 
                onClick={toggleTheme}
                className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:text-primary transition-colors focus:outline-none"
              >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-600 dark:text-gray-300 hover:text-primary focus:outline-none"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white dark:bg-gray-800 border-t dark:border-gray-700 transition-all">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 flex flex-col">
              <a onClick={() => {onNavigate(Page.HOME); setIsMenuOpen(false);}} className={navClass(Page.HOME)}>Home</a>
              <a onClick={() => {onNavigate(Page.ABOUT); setIsMenuOpen(false);}} className={navClass(Page.ABOUT)}>About</a>
              <a onClick={() => {onNavigate(Page.DOCTORS); setIsMenuOpen(false);}} className={navClass(Page.DOCTORS)}>Doctors</a>
              <a onClick={() => {onNavigate(Page.PREDICTION); setIsMenuOpen(false);}} className={navClass(Page.PREDICTION)}>Prediction</a>
              
              <div className="border-t dark:border-gray-700 my-2 pt-2 flex flex-col gap-2 p-2">
                 {isLoggedIn ? (
                    <>
                    <Button fullWidth variant="secondary" onClick={() => { onNavigate(Page.PROFILE); setIsMenuOpen(false); }}>
                      <User size={18} /> My Profile
                    </Button>
                    <Button fullWidth variant="outline" onClick={() => { onLogout(); setIsMenuOpen(false); }}>
                      Logout
                    </Button>
                    </>
                 ) : (
                   <>
                    <Button fullWidth variant="outline" onClick={() => { onNavigate(Page.LOGIN); setIsMenuOpen(false); }}>
                       Login
                    </Button>
                    <Button fullWidth onClick={() => { onNavigate(Page.SIGNUP); setIsMenuOpen(false); }}>
                       Join Now
                    </Button>
                   </>
                 )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};