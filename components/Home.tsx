import React from 'react';
import { Page } from '../types';
import { Button } from './Button';
import { Activity, Shield, Clock, Calendar, CheckCircle } from 'lucide-react';

interface HomeProps {
  onNavigate: (page: Page) => void;
}

export const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  return (
    <div>
      {/* Hero Section */}
      <div 
        className="relative bg-cover bg-center h-[600px] flex items-center" 
        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80")' }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <span className="text-white text-lg md:text-xl block mb-4 font-light tracking-wider uppercase">Let's make your life happier</span>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-8 drop-shadow-md">Healthy Living</h1>
          
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Button 
              onClick={() => onNavigate(Page.PREDICTION)} 
              className="px-8 py-3.5 text-lg rounded-full shadow-lg transform hover:scale-105 transition-transform"
            >
              Start Prediction
            </Button>
             <Button 
              variant="outline"
              onClick={() => onNavigate(Page.ABOUT)} 
              className="px-8 py-3.5 text-lg rounded-full border-white text-white hover:bg-white hover:text-primary"
            >
              Learn More
            </Button>
          </div>
        </div>
      </div>

      {/* Features Cards */}
      <div className="bg-white dark:bg-gray-800 relative z-20 -mt-16 container mx-auto px-4 transition-colors duration-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 shadow-soft rounded-lg bg-white dark:bg-gray-800 p-8 border border-gray-100 dark:border-gray-700">
          <div className="flex items-start gap-4 p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <div className="bg-primary/10 p-3 rounded-full text-primary">
              <Activity size={24} />
            </div>
            <div>
              <h3 className="font-bold text-dark dark:text-white text-lg mb-2">AI Precision</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Advanced neural networks analyze skin lesions with high accuracy to assess risk levels instantly.</p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <div className="bg-primary/10 p-3 rounded-full text-primary">
              <Shield size={24} />
            </div>
            <div>
              <h3 className="font-bold text-dark dark:text-white text-lg mb-2">Secure & Private</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Your medical data is processed securely. We prioritize patient confidentiality and data protection.</p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <div className="bg-primary/10 p-3 rounded-full text-primary">
              <Clock size={24} />
            </div>
            <div>
              <h3 className="font-bold text-dark dark:text-white text-lg mb-2">24/7 Availability</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Access preliminary screening anytime, anywhere, without waiting for an appointment.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div className="bg-light dark:bg-gray-900 py-20 transition-colors duration-200">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2">
              <h1 className="text-3xl lg:text-4xl font-bold text-dark dark:text-white mb-6 leading-tight">Know About Skin Cancer <br /> Disease</h1>
              <p className="text-gray-500 dark:text-gray-400 mb-6 leading-relaxed text-lg">
                Skin cancer is the out-of-control growth of abnormal cells in the epidermis, the outermost skin layer, caused by unrepaired DNA damage that triggers mutations. These mutations lead the skin cells to multiply rapidly and form malignant tumors.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                  <CheckCircle size={20} className="text-primary" /> Basal cell carcinoma (BCC)
                </li>
                <li className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                  <CheckCircle size={20} className="text-primary" /> Squamous cell carcinoma (SCC)
                </li>
                <li className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                  <CheckCircle size={20} className="text-primary" /> Melanoma & Merkel cell carcinoma
                </li>
              </ul>
              <Button onClick={() => onNavigate(Page.ABOUT)}>Learn More</Button>
            </div>
            <div className="lg:w-1/2 relative">
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-primary/20 rounded-full z-0"></div>
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-secondary/10 rounded-full z-0"></div>
              <img 
                src="https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="Doctor with plant" 
                className="rounded-lg shadow-xl w-full object-cover h-[450px] relative z-10"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Appointment Section */}
      <div className="py-20 bg-white dark:bg-gray-800 transition-colors duration-200">
        <div className="container mx-auto px-4">
          <h1 className="text-center text-3xl font-bold text-dark dark:text-white mb-12">Make an Appointment</h1>
          
          <form className="max-w-4xl mx-auto bg-white dark:bg-gray-800" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <input type="text" placeholder="Full name" className="w-full px-4 py-3 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors" />
              <input type="email" placeholder="Email address.." className="w-full px-4 py-3 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors" />
              <input type="date" className="w-full px-4 py-3 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors text-gray-500 dark:text-gray-300" />
              <select className="w-full px-4 py-3 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors text-gray-500 dark:text-gray-300 bg-white dark:bg-gray-700">
                <option value="general">General Health</option>
                <option value="cardiology">Cardiology</option>
                <option value="dental">Dental</option>
                <option value="neurology">Neurology</option>
                <option value="dermatology">Dermatology</option>
              </select>
              <input type="text" placeholder="Phone Number.." className="w-full px-4 py-3 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors" />
              <div className="md:col-span-1 hidden md:block"></div> {/* Spacer */}
              <textarea rows={4} placeholder="Enter message.." className="w-full md:col-span-2 px-4 py-3 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"></textarea>
            </div>
            <div className="text-center">
              <Button type="submit" className="px-8 py-3">Submit Request</Button>
            </div>
          </form>
        </div>
      </div>

      {/* Latest News */}
      <div className="py-16 bg-light dark:bg-gray-900 transition-colors duration-200">
        <div className="container mx-auto px-4">
          <h1 className="text-center text-3xl font-bold text-dark dark:text-white mb-12">Latest News</h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((item) => (
              <div key={item} className="bg-white dark:bg-gray-800 rounded-lg shadow-soft overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-shadow cursor-pointer group">
                <div className="h-56 overflow-hidden">
                  <img src={`https://source.unsplash.com/random/800x600?medical,doctor,sig=${item}`} alt="Blog" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"/>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="bg-primary/10 text-primary text-xs font-bold px-2 py-1 rounded uppercase tracking-wide">Health</span>
                    <span className="text-gray-400 dark:text-gray-500 text-xs flex items-center gap-1"><Calendar size={12}/> 1 week ago</span>
                  </div>
                  <h5 className="font-bold text-lg text-dark dark:text-white mb-3 hover:text-primary transition-colors">Skin health in the modern age: Prevention tips</h5>
                  <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                     <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600 overflow-hidden">
                       <img src={`https://source.unsplash.com/random/100x100?face,sig=${item}`} alt="Author" />
                     </div>
                     <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">Dr. Roger Adams</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Button variant="primary">Read More</Button>
          </div>
        </div>
      </div>
    </div>
  );
};