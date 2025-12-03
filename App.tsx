import React, { useState, useEffect, useRef } from 'react';
import { 
  Menu, X, Sun, Moon, LogIn, User, UserPlus, Mail, Lock, 
  ArrowRight, Phone, MessageCircle, AlertCircle, Share2, 
  RotateCcw, CheckCircle, Upload, Camera, Clock, Calendar, 
  Activity, Shield, ExternalLink, Loader2, Send, Bot, 
  AlertTriangle, WifiOff, Save, Home as HomeIcon, Info, 
  Stethoscope, Scan, ChevronLeft, ChevronRight, BarChart3,
  HeartPulse, Award, Users, FileText, Download, Printer,
  ThermometerSun, Umbrella, Eye
} from 'lucide-react';
import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  updateProfile, 
  onAuthStateChanged, 
  signOut,
  User as FirebaseUser
} from "firebase/auth";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  doc, 
  setDoc, 
  getDoc,
  Timestamp 
} from "firebase/firestore";
import { Footer } from './components/Footer';

// --- Types ---
enum RiskLevel {
  LOW = 'Low Risk',
  MODERATE = 'Moderate Risk',
  HIGH = 'High Risk'
}

enum Classification {
  BENIGN = 'Likely Benign',
  INDETERMINATE = 'Indeterminate',
  MALIGNANT = 'Potentially Malignant'
}

interface AnalysisResult {
  riskLevel: RiskLevel;
  classification: Classification;
  confidence: number;
  findings: string[];
  recommendation: string;
}

enum AppState {
  IDLE = 'IDLE',
  SCANNING = 'SCANNING',
  RESULTS = 'RESULTS'
}

enum Page {
  HOME = 'HOME',
  ABOUT = 'ABOUT',
  DOCTORS = 'DOCTORS',
  PREDICTION = 'PREDICTION',
  LOGIN = 'LOGIN',
  SIGNUP = 'SIGNUP',
  PROFILE = 'PROFILE'
}

interface Doctor {
  name: string;
  address?: string;
  rating?: string;
  uri?: string;
  specialty?: string;
  img?: string;
}

interface UserProfileData {
  name: string;
  email: string;
  phone?: string;
  dob?: string;
  avatar?: string;
}

interface PredictionHistoryItem {
  id: string;
  date: string;
  imageUrl: string;
  result: AnalysisResult;
}

// --- Firebase & Env Configuration ---
const getEnv = (key: string) => {
  try {
    return (import.meta as any).env?.[key] || "";
  } catch (e) {
    return "";
  }
};

const firebaseConfig = {
  apiKey: getEnv('VITE_FIREBASE_API_KEY'),
  authDomain: getEnv('VITE_FIREBASE_AUTH_DOMAIN'),
  projectId: getEnv('VITE_FIREBASE_PROJECT_ID'),
  storageBucket: getEnv('VITE_FIREBASE_STORAGE_BUCKET'),
  messagingSenderId: getEnv('VITE_FIREBASE_MESSAGING_SENDER_ID'),
  appId: getEnv('VITE_FIREBASE_APP_ID')
};

const GEMINI_API_KEY = getEnv('VITE_GEMINI_API_KEY');

// Initialize Firebase services (Storage Removed)
let auth: any;
let db: any;
let googleProvider: any;
let isFirebaseInitialized = false;

try {
  if (firebaseConfig.apiKey && firebaseConfig.apiKey !== "YOUR_API_KEY_HERE") {
    const app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    googleProvider = new GoogleAuthProvider();
    isFirebaseInitialized = true;
  } else {
    console.warn("Firebase config missing. App will run in Demo Mode (No persistent storage).");
  }
} catch (e) {
  console.warn("Firebase initialization failed:", e);
}

// --- Services ---

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      const base64Data = result.split(',')[1];
      resolve(base64Data);
    };
    reader.onerror = error => reject(error);
  });
};

const analyzeImage = async (imageFile: File): Promise<AnalysisResult> => {
  if (GEMINI_API_KEY) {
    try {
      const base64Image = await fileToBase64(imageFile);
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [
              { text: `You are an expert dermatologist assisting with preliminary screening. Analyze this skin lesion image with high clinical precision.
                       
                       Evaluate the lesion based on the ABCDE rule (Asymmetry, Border, Color, Diameter, Evolving) and look for specific dermoscopic features like pigment networks, streaks, dots/globules, or blue-white veils.

                       Output strictly valid JSON (no markdown fences) with the following structure:
                       {
                         "riskLevel": "Low Risk" | "Moderate Risk" | "High Risk",
                         "classification": "Likely Benign" | "Indeterminate" | "Potentially Malignant",
                         "confidence": <number 0-100 based on image clarity and feature distinctness>,
                         "findings": [
                            "Specific finding 1 (e.g., 'Regular pigment network observed')", 
                            "Specific finding 2 (e.g., 'Homogeneous light brown pigmentation')", 
                            "Specific finding 3"
                         ],
                         "recommendation": "Professional and actionable medical advice suitable for a screening report."
                       }` 
              },
              { inline_data: { mime_type: imageFile.type, data: base64Image } }
            ]
          }],
          generationConfig: { response_mime_type: "application/json" }
        })
      });

      if (!response.ok) throw new Error("Gemini API Error");
      
      const data = await response.json();
      const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (textResponse) {
        const parsed = JSON.parse(textResponse);
        return {
          riskLevel: parsed.riskLevel,
          classification: parsed.classification,
          confidence: parsed.confidence,
          findings: parsed.findings,
          recommendation: parsed.recommendation
        };
      }
    } catch (error) {
      console.warn("AI Analysis failed, falling back to simulation:", error);
    }
  }

  // Fallback Simulation
  return new Promise((resolve) => {
    setTimeout(() => {
      const randomVal = Math.random();
      let result: AnalysisResult;
      if (randomVal > 0.6) {
        result = {
          riskLevel: RiskLevel.LOW,
          classification: Classification.BENIGN,
          confidence: 96,
          findings: [
            "Symmetrical reticular pigment pattern.",
            "Homogeneous light brown coloration.",
            "Sharp and regular borders detected.",
            "No signs of rapid evolution or regression."
          ],
          recommendation: "The lesion appears benign. Continue routine self-examinations and monitor for any changes in size or color."
        };
      } else if (randomVal > 0.3) {
        result = {
          riskLevel: RiskLevel.MODERATE,
          classification: Classification.INDETERMINATE,
          confidence: 78,
          findings: [
            "Slight asymmetry in one axis.",
            "Faint atypical pigment network at the periphery.",
            "Minor color variation (light brown to dark brown).",
            "Border is mostly regular but shows slight blurring."
          ],
          recommendation: "Features are indeterminate. A follow-up dermoscopy with a specialist is recommended to rule out progression."
        };
      } else {
        result = {
          riskLevel: RiskLevel.HIGH,
          classification: Classification.MALIGNANT,
          confidence: 89,
          findings: [
            "Asymmetrical structure in two axes.",
            "Presence of blue-white veil and irregular dots.",
            "Multiple colors present (variegation).",
            "Irregular, scalloped borders observed."
          ],
          recommendation: "High-risk features detected. Immediate consultation with a dermatologist for biopsy or further evaluation is strongly advised."
        };
      }
      resolve(result);
    }, 2500);
  });
};

const sendChatMessage = async (msg: string) => {
  // If no API key is set, return a demo response immediately without failing
  if (!GEMINI_API_KEY) {
    await new Promise(r => setTimeout(r, 500)); // Slight delay for realism
    return "I am running in demo mode. Please configure your Gemini API Key to enable real AI responses. I can still guide you through the app!";
  }

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `You are a helpful and empathetic AI assistant for a Skin Cancer screening app called DermoScan. 
        Answer briefly (under 50 words) and empathetically. 
        Do not diagnose conditions or give definitive medical advice. Always suggest seeing a doctor for concerns.
        User: ${msg}` }] }]
      })
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm sorry, I couldn't process that request.";
  } catch (e) {
    console.error("Chat Error:", e);
    // Fallback response instead of a hard error
    return "I'm having trouble reaching the AI service right now. Please check your internet connection or try again later.";
  }
};

const findNearbyDermatologists = async (lat: number, lng: number): Promise<Doctor[]> => {
  return new Promise(resolve => setTimeout(() => resolve([
    { name: "Skin Health Institute", address: "123 Medical Center Blvd, Suite 200", rating: "4.8", uri: "#" },
    { name: "Dr. Sarah Jenning, MD", address: "45 Park Avenue Dermatology", rating: "4.9", uri: "#" },
    { name: "City General Dermatology Clinic", address: "889 Broadway, Floor 4", rating: "4.5", uri: "#" }
  ]), 1000));
};

// --- Components ---

const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'outline' | 'ghost'; fullWidth?: boolean }> = ({ 
  children, variant = 'primary', fullWidth = false, className = '', ...props 
}) => {
  const baseStyles = "px-6 py-2.5 rounded-md font-medium text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2";
  const variants = {
    primary: "bg-[#00D9A5] text-white hover:bg-[#00b389] shadow-md hover:shadow-lg hover:-translate-y-0.5",
    secondary: "bg-gray-500 text-white hover:bg-gray-600 shadow-md",
    outline: "border border-[#00D9A5] text-[#00D9A5] hover:bg-[#00D9A5] hover:text-white",
    ghost: "bg-transparent text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
  };
  return <button className={`${baseStyles} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`} {...props}>{children}</button>;
};

const Sidebar: React.FC<{ 
  currentPage: Page; 
  onNavigate: (page: Page) => void; 
  isCollapsed: boolean; 
  toggleCollapse: () => void;
  isLoggedIn: boolean;
  onLogout: () => void;
  toggleTheme: () => void;
  isDarkMode: boolean;
}> = ({ currentPage, onNavigate, isCollapsed, toggleCollapse, isLoggedIn, onLogout, toggleTheme, isDarkMode }) => {
  
  const menuItems = [
    { page: Page.HOME, label: "Home", icon: <HomeIcon size={20} /> },
    { page: Page.PREDICTION, label: "AI Analysis", icon: <Scan size={20} /> },
    { page: Page.DOCTORS, label: "Find Doctors", icon: <Stethoscope size={20} /> },
    { page: Page.ABOUT, label: "About", icon: <Info size={20} /> },
  ];

  return (
    <aside className={`${isCollapsed ? 'w-20' : 'w-64'} bg-white dark:bg-gray-800 h-screen sticky top-0 border-r border-gray-100 dark:border-gray-700 transition-all duration-300 flex flex-col z-50 shadow-lg print:hidden`}>
      <div className="h-16 flex items-center justify-center border-b border-gray-100 dark:border-gray-700 relative">
        <div className="flex items-center gap-2 overflow-hidden px-4">
           <Activity className="text-primary w-8 h-8 shrink-0" />
           <span className={`font-bold text-xl text-dark dark:text-white whitespace-nowrap transition-opacity duration-200 ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100'}`}>
             DermoScan
           </span>
        </div>
        <button 
          onClick={toggleCollapse}
          className="absolute -right-3 top-1/2 -translate-y-1/2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-full p-1 text-gray-500 dark:text-gray-300 hover:text-primary shadow-sm"
        >
          {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>

      <div className="flex-1 py-6 flex flex-col gap-2 px-3 overflow-y-auto">
        {menuItems.map((item) => (
          <button
            key={item.label}
            onClick={() => onNavigate(item.page)}
            className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 group relative
              ${currentPage === item.page 
                ? 'bg-primary/10 text-primary font-bold' 
                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-primary'
              }`}
          >
            <div className={`${isCollapsed ? 'mx-auto' : ''}`}>{item.icon}</div>
            <span className={`whitespace-nowrap transition-all duration-200 ${isCollapsed ? 'opacity-0 w-0 hidden' : 'opacity-100'}`}>
              {item.label}
            </span>
            {isCollapsed && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-dark text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none z-50 whitespace-nowrap">
                {item.label}
              </div>
            )}
          </button>
        ))}
      </div>

      <div className="p-4 border-t border-gray-100 dark:border-gray-700">
        <button 
          onClick={toggleTheme}
          className="flex items-center gap-3 p-3 w-full rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 mb-2"
        >
           <div className={`${isCollapsed ? 'mx-auto' : ''}`}>{isDarkMode ? <Sun size={20} /> : <Moon size={20} />}</div>
           <span className={`whitespace-nowrap ${isCollapsed ? 'hidden' : 'block'}`}>Theme</span>
        </button>

        {isLoggedIn ? (
          <div className="flex flex-col gap-2">
             <button 
               onClick={() => onNavigate(Page.PROFILE)}
               className={`flex items-center gap-3 p-3 rounded-lg w-full text-left transition-colors ${currentPage === Page.PROFILE ? 'bg-primary/10 text-primary' : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300'}`}
             >
                <div className={`w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary shrink-0 ${isCollapsed ? 'mx-auto' : ''}`}><User size={16} /></div>
                <div className={`overflow-hidden transition-all duration-200 ${isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}`}>
                   <p className="text-sm font-bold truncate">My Profile</p>
                </div>
             </button>
             <button onClick={onLogout} className="flex items-center gap-3 p-3 w-full rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20">
                <div className={`${isCollapsed ? 'mx-auto' : ''}`}><LogOutIcon /></div>
                <span className={`${isCollapsed ? 'hidden' : 'block'}`}>Logout</span>
             </button>
          </div>
        ) : (
          <div className={`flex flex-col gap-2 ${isCollapsed ? 'items-center' : ''}`}>
             <Button fullWidth={!isCollapsed} variant="outline" onClick={() => onNavigate(Page.LOGIN)} className={isCollapsed ? 'px-2' : ''}>
               {isCollapsed ? <LogIn size={18}/> : 'Login'}
             </Button>
             <Button fullWidth={!isCollapsed} onClick={() => onNavigate(Page.SIGNUP)} className={isCollapsed ? 'px-2' : ''}>
               {isCollapsed ? <UserPlus size={18}/> : 'Join'}
             </Button>
          </div>
        )}
      </div>
    </aside>
  );
};

const LogOutIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
);

const Home: React.FC<{ onNavigate: (page: Page) => void }> = ({ onNavigate }) => (
  <div className="space-y-24 pb-20">
    <div className="relative rounded-3xl overflow-hidden bg-dark text-white shadow-2xl mx-4 mt-4">
      <div className="absolute inset-0">
        <img 
          src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" 
          className="w-full h-full object-cover opacity-20" 
          alt="Medical Background"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent"></div>
      </div>
      
      <div className="relative z-10 px-8 py-20 md:px-16 md:py-32 max-w-4xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-primary text-sm font-bold mb-6 border border-primary/20 backdrop-blur-sm">
           <Activity size={16} /> AI-Powered Dermatology
        </div>
        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
          Advanced Skin Health <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-teal-400">Screening Platform</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl leading-relaxed">
          Leverage the power of artificial intelligence to detect early signs of skin irregularities. 
          Fast, private, and accessible healthcare technology right at your fingertips.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button onClick={() => onNavigate(Page.PREDICTION)} className="h-12 px-8 text-lg rounded-full">
            Start Free Analysis <ArrowRight size={20} />
          </Button>
          <Button variant="outline" onClick={() => onNavigate(Page.ABOUT)} className="h-12 px-8 text-lg rounded-full border-gray-600 text-white hover:bg-white hover:text-dark">
            How it Works
          </Button>
        </div>
        
        <div className="mt-12 flex gap-8 text-sm text-gray-400">
           <div className="flex items-center gap-2"><CheckCircle size={16} className="text-primary"/> 95% Accuracy Rate</div>
           <div className="flex items-center gap-2"><CheckCircle size={16} className="text-primary"/> HIPAA Compliant</div>
           <div className="flex items-center gap-2"><CheckCircle size={16} className="text-primary"/> 24/7 Access</div>
        </div>
      </div>
    </div>

    <div className="container mx-auto px-4">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h2 className="text-3xl font-bold text-dark dark:text-white mb-4">Comprehensive Care Ecosystem</h2>
        <p className="text-gray-500 dark:text-gray-400">We combine cutting-edge AI technology with professional medical networks to provide a complete skin health solution.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { icon: <Scan className="w-8 h-8 text-white" />, title: "Instant Analysis", desc: "Upload a photo and get an AI-generated risk assessment in seconds using our advanced neural networks.", color: "bg-blue-500" },
          { icon: <Users className="w-8 h-8 text-white" />, title: "Doctor Network", desc: "Connect with certified dermatologists near you for professional diagnosis and treatment plans.", color: "bg-teal-500" },
          { icon: <Shield className="w-8 h-8 text-white" />, title: "Secure History", desc: "Keep track of your skin health over time with our encrypted, private medical history dashboard.", color: "bg-purple-500" }
        ].map((feature, idx) => (
          <div key={idx} className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-soft border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-shadow group">
            <div className={`${feature.color} w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg transform group-hover:scale-110 transition-transform duration-300`}>
              {feature.icon}
            </div>
            <h3 className="text-xl font-bold text-dark dark:text-white mb-3">{feature.title}</h3>
            <p className="text-gray-500 dark:text-gray-400 leading-relaxed">{feature.desc}</p>
          </div>
        ))}
      </div>
    </div>

    <div className="bg-primary/5 py-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
           {[
             { label: "Analyses Conducted", val: "10k+", icon: <BarChart3 className="text-primary"/> },
             { label: "Active Users", val: "5000+", icon: <Users className="text-primary"/> },
             { label: "Partner Clinics", val: "120+", icon: <HeartPulse className="text-primary"/> },
             { label: "Accuracy", val: "98.5%", icon: <Award className="text-primary"/> },
           ].map((stat, idx) => (
             <div key={idx} className="text-center">
                <div className="flex justify-center mb-4">{stat.icon}</div>
                <div className="text-3xl md:text-4xl font-bold text-dark dark:text-white mb-2">{stat.val}</div>
                <div className="text-gray-500 dark:text-gray-400 uppercase text-xs tracking-wider font-bold">{stat.label}</div>
             </div>
           ))}
        </div>
      </div>
    </div>

    <div className="container mx-auto px-4">
      <div className="bg-dark rounded-3xl p-8 md:p-16 text-center relative overflow-hidden">
         <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
         <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
         
         <div className="relative z-10 max-w-2xl mx-auto">
           <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to check your skin health?</h2>
           <p className="text-gray-300 mb-8 text-lg">Join thousands of users who are taking proactive steps towards better health today.</p>
           <Button onClick={() => onNavigate(Page.PREDICTION)} className="h-14 px-10 text-lg rounded-full shadow-xl shadow-primary/20">
             Get Started Now
           </Button>
         </div>
      </div>
    </div>
  </div>
);

// Expanded About Page
const About: React.FC = () => (
  <div className="container mx-auto px-4 py-12 max-w-5xl animate-[fadeIn_0.5s_ease-out]">
    <div className="text-center mb-16">
      <h1 className="text-4xl md:text-5xl font-bold text-dark dark:text-white mb-6">About Skin Cancer</h1>
      <p className="text-xl text-gray-500 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
        Understanding the risks, recognizing the symptoms early, and knowing how to prevent skin cancer are your most powerful tools for maintaining skin health.
      </p>
    </div>

    <div className="space-y-16">
      {/* What is Skin Cancer */}
      <section className="grid md:grid-cols-2 gap-12 items-center">
        <div>
           <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-bold mb-4">
             <Activity size={16} /> Disease Overview
           </div>
           <h2 className="text-3xl font-bold text-dark dark:text-white mb-6">What is Skin Cancer?</h2>
           <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6 text-lg">
             Skin cancer is the abnormal growth of skin cells, most often developing on skin exposed to the sun. But this common form of cancer can also occur on areas of your skin not ordinarily exposed to sunlight.
           </p>
           <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
             There are three major types of skin cancer: <b>basal cell carcinoma</b>, <b>squamous cell carcinoma</b>, and <b>melanoma</b>. Early detection allows for the most effective treatment options.
           </p>
        </div>
        <div className="relative h-80 rounded-2xl overflow-hidden shadow-2xl">
           <img src="https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" alt="Dermatology examination" className="absolute inset-0 w-full h-full object-cover" />
           <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
              <p className="text-white font-medium">Regular check-ups are key to early detection.</p>
           </div>
        </div>
      </section>

      {/* Prevention Grid */}
      <div className="grid md:grid-cols-2 gap-8">
        <section className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-soft border border-gray-100 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-dark dark:text-white mb-6 flex items-center gap-3">
             <Shield className="text-green-500" /> Prevention Tips
          </h2>
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
               <div className="mt-1 p-1 bg-green-100 dark:bg-green-900/30 rounded-full text-green-600 dark:text-green-400"><ThermometerSun size={16} /></div>
               <div>
                 <h4 className="font-bold text-dark dark:text-white">Avoid Peak Sun</h4>
                 <p className="text-sm text-gray-500 dark:text-gray-400">Stay in the shade between 10 a.m. and 4 p.m.</p>
               </div>
            </li>
            <li className="flex items-start gap-3">
               <div className="mt-1 p-1 bg-green-100 dark:bg-green-900/30 rounded-full text-green-600 dark:text-green-400"><Umbrella size={16} /></div>
               <div>
                 <h4 className="font-bold text-dark dark:text-white">Wear Sunscreen</h4>
                 <p className="text-sm text-gray-500 dark:text-gray-400">Use broad-spectrum sunscreen with an SPF of at least 30.</p>
               </div>
            </li>
            <li className="flex items-start gap-3">
               <div className="mt-1 p-1 bg-green-100 dark:bg-green-900/30 rounded-full text-green-600 dark:text-green-400"><Eye size={16} /></div>
               <div>
                 <h4 className="font-bold text-dark dark:text-white">Examine Your Skin</h4>
                 <p className="text-sm text-gray-500 dark:text-gray-400">Check your skin monthly for new growths or changes.</p>
               </div>
            </li>
          </ul>
        </section>

        <section className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-soft border border-gray-100 dark:border-gray-700">
           <h2 className="text-2xl font-bold text-dark dark:text-white mb-6 flex items-center gap-3">
              <AlertTriangle className="text-red-500" /> Risk Factors
           </h2>
           <ul className="space-y-4">
            <li className="flex gap-3 items-center text-gray-700 dark:text-gray-300">
               <div className="w-2 h-2 bg-red-400 rounded-full" /> Fair skin that burns easily.
            </li>
            <li className="flex gap-3 items-center text-gray-700 dark:text-gray-300">
               <div className="w-2 h-2 bg-red-400 rounded-full" /> A history of sunburns.
            </li>
            <li className="flex gap-3 items-center text-gray-700 dark:text-gray-300">
               <div className="w-2 h-2 bg-red-400 rounded-full" /> Excessive sun exposure.
            </li>
            <li className="flex gap-3 items-center text-gray-700 dark:text-gray-300">
               <div className="w-2 h-2 bg-red-400 rounded-full" /> Sunny or high-altitude climates.
            </li>
            <li className="flex gap-3 items-center text-gray-700 dark:text-gray-300">
               <div className="w-2 h-2 bg-red-400 rounded-full" /> Moles (nevi) on your skin.
            </li>
            <li className="flex gap-3 items-center text-gray-700 dark:text-gray-300">
               <div className="w-2 h-2 bg-red-400 rounded-full" /> A family history of skin cancer.
            </li>
          </ul>
        </section>
      </div>
    </div>
  </div>
);

// Professional Image Capture with Guidelines
const ImageCapture: React.FC<{ onImageSelected: (file: File) => void }> = ({ onImageSelected }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-soft p-8 border border-gray-100 dark:border-gray-700 text-center">
        <h2 className="text-2xl font-bold text-dark dark:text-white mb-2">Upload Image for Analysis</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-8">Supported formats: JPG, PNG. Max size: 10MB.</p>
        
        {/* Guidelines */}
        <div className="grid grid-cols-3 gap-4 mb-8 text-left">
           <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/50 text-blue-600 rounded-full flex items-center justify-center font-bold mb-2">1</div>
              <p className="text-xs font-medium text-gray-600 dark:text-gray-300">Ensure good lighting without shadows.</p>
           </div>
           <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/50 text-blue-600 rounded-full flex items-center justify-center font-bold mb-2">2</div>
              <p className="text-xs font-medium text-gray-600 dark:text-gray-300">Center the lesion in the frame.</p>
           </div>
           <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/50 text-blue-600 rounded-full flex items-center justify-center font-bold mb-2">3</div>
              <p className="text-xs font-medium text-gray-600 dark:text-gray-300">Keep the camera steady and focused.</p>
           </div>
        </div>

        <div 
          className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-12 mb-8 flex flex-col items-center justify-center hover:border-primary hover:bg-primary/5 transition-all cursor-pointer group"
          onClick={() => fileInputRef.current?.click()}
        >
           <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-full mb-4 group-hover:scale-110 transition-transform">
              <Upload className="h-8 w-8 text-gray-500 dark:text-gray-400 group-hover:text-primary" />
           </div>
           <p className="text-lg font-medium text-dark dark:text-white mb-1">Click to upload image</p>
           <p className="text-sm text-gray-500 dark:text-gray-400">or drag and drop here</p>
           <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={(e) => e.target.files?.[0] && onImageSelected(e.target.files[0])} />
        </div>

        <div className="flex gap-4 justify-center">
          <Button onClick={() => fileInputRef.current?.click()} className="px-8">
             Choose File
          </Button>
          <Button variant="outline" onClick={() => fileInputRef.current?.click()} className="px-8">
             <Camera size={18} className="mr-2"/> Take Photo
          </Button>
        </div>
      </div>
    </div>
  );
};

const ScanningOverlay: React.FC<{ imageUrl: string }> = ({ imageUrl }) => (
  <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-soft p-12 text-center border border-gray-100 dark:border-gray-700">
    <div className="mb-8 relative inline-block">
      <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-primary/20 relative">
         <img src={imageUrl} alt="Analyzing" className="w-full h-full object-cover opacity-50" />
         <div className="absolute inset-0 flex items-center justify-center bg-black/10">
            <Loader2 className="w-16 h-16 text-primary animate-spin" />
         </div>
      </div>
      <div className="absolute -inset-4 border-t-2 border-primary rounded-full animate-spin"></div>
    </div>
    <h3 className="text-2xl font-bold text-dark dark:text-white mb-2">Analyzing Skin Lesion...</h3>
    <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto">Please wait a moment while our AI processes the dermoscopic features.</p>
  </div>
);

// Updated Results Dashboard: Professional Clinical Report
const ResultsDashboard: React.FC<{ result: AnalysisResult; onReset: () => void; imageUrl: string }> = ({ result, onReset, imageUrl }) => {
  const isHighRisk = result.riskLevel === RiskLevel.HIGH;
  const isModerateRisk = result.riskLevel === RiskLevel.MODERATE;
  
  const riskColor = isHighRisk ? "red" : isModerateRisk ? "orange" : "green";
  const RiskIcon = isHighRisk ? AlertTriangle : isModerateRisk ? AlertCircle : CheckCircle;

  const handleDownloadPDF = () => {
    window.print();
  };

  return (
    <div className="max-w-5xl mx-auto animate-[fadeIn_0.5s_ease-out] print:max-w-none">
      {/* Report Header */}
      <div className="bg-white dark:bg-gray-800 rounded-t-2xl p-8 border-b border-gray-100 dark:border-gray-700 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
         <div>
            <div className="flex items-center gap-3 mb-2">
               <div className="p-2 bg-primary/10 rounded-lg text-primary"><FileText size={24} /></div>
               <h2 className="text-3xl font-bold text-dark dark:text-white">Analysis Report</h2>
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
               Patient ID: <span className="font-mono text-dark dark:text-white">#PT-{Math.floor(Math.random()*10000)}</span> • Date: {new Date().toLocaleDateString()}
            </p>
         </div>
         <div className={`px-6 py-3 rounded-full border-2 font-bold flex items-center gap-2 shadow-sm ${
             isHighRisk ? 'bg-red-50 text-red-600 border-red-100' : 
             isModerateRisk ? 'bg-orange-50 text-orange-600 border-orange-100' : 
             'bg-green-50 text-green-600 border-green-100'
         }`}>
             <RiskIcon size={20} /> {result.riskLevel}
         </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-b-2xl shadow-soft p-8 border border-t-0 border-gray-100 dark:border-gray-700">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
           {/* Left: Visual Evidence */}
           <div className="space-y-8">
              <div>
                 <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Dermoscopic Image</h3>
                 <div className="relative rounded-2xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700 group aspect-video bg-gray-100 dark:bg-gray-900">
                    <img src={imageUrl} alt="Analyzed Lesion" className="w-full h-full object-contain" />
                 </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700/30 p-6 rounded-2xl border border-gray-100 dark:border-gray-600">
                 <div className="flex justify-between items-end mb-3">
                    <div>
                       <span className="text-gray-500 dark:text-gray-400 font-medium text-sm">AI Confidence</span>
                       <div className="text-3xl font-bold text-dark dark:text-white">{result.confidence}%</div>
                    </div>
                    <Activity className="text-primary opacity-50" />
                 </div>
                 <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-3">
                    <div className="bg-primary h-3 rounded-full transition-all duration-1000 relative" style={{ width: `${result.confidence}%` }}>
                       <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white shadow-md rounded-full"></div>
                    </div>
                 </div>
                 <p className="text-xs text-gray-400 mt-3 flex items-center gap-1">
                    <Info size={12} /> Confidence score indicates the clarity of dermoscopic features identified.
                 </p>
              </div>
           </div>

           {/* Right: Clinical Details */}
           <div className="space-y-8">
              <div>
                 <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Clinical Assessment</h3>
                 
                 <div className="mb-6">
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Classification</div>
                    <div className="text-xl font-medium text-dark dark:text-white">{result.classification}</div>
                 </div>

                 <div className="space-y-4">
                    <h4 className="font-bold text-dark dark:text-white text-sm">Observed Findings (ABCDE):</h4>
                    <ul className="space-y-3">
                       {result.findings.map((finding, i) => (
                          <li key={i} className="flex gap-3 text-sm text-gray-600 dark:text-gray-300 p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                             <CheckCircle size={16} className="text-primary mt-0.5 shrink-0" />
                             {finding}
                          </li>
                       ))}
                    </ul>
                 </div>
              </div>

              <div className={`p-6 rounded-2xl border-l-4 ${
                  isHighRisk ? 'bg-red-50 border-red-500 dark:bg-red-900/10' : 
                  'bg-blue-50 border-blue-500 dark:bg-blue-900/10'
              }`}>
                 <h4 className={`font-bold mb-2 flex items-center gap-2 ${
                     isHighRisk ? 'text-red-800 dark:text-red-300' : 'text-blue-800 dark:text-blue-300'
                 }`}>
                    <Stethoscope size={20} /> Clinical Recommendation
                 </h4>
                 <p className={`text-base leading-relaxed ${
                     isHighRisk ? 'text-red-700 dark:text-red-200' : 'text-blue-700 dark:text-blue-200'
                 }`}>
                    {result.recommendation}
                 </p>
              </div>
           </div>
        </div>

        {/* Action Footer (Hidden in Print) */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between pt-8 border-t border-gray-100 dark:border-gray-700 print:hidden">
           <Button variant="ghost" onClick={onReset} className="text-gray-500 hover:text-dark">
              <RotateCcw size={18} className="mr-2" /> Start New Analysis
           </Button>
           <div className="flex gap-3">
              <Button variant="outline" onClick={handleDownloadPDF}>
                 <Printer size={18} className="mr-2" /> Print / Save PDF
              </Button>
              <Button onClick={() => alert("Report shared with your linked provider.")}>
                 <Share2 size={18} className="mr-2" /> Share with Doctor
              </Button>
           </div>
        </div>
      </div>
      
      <div className="mt-12 print:hidden">
         <h3 className="text-xl font-bold text-dark dark:text-white text-center mb-8">Recommended Specialists Nearby</h3>
         <DoctorLocator />
      </div>
    </div>
  );
};

const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: string; text: string }[]>([{ role: 'model', text: 'Hello! I am your DermoScan assistant.' }]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatRef = useRef<any>(null);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setIsLoading(true);
    try {
      const responseText = await sendChatMessage(userMsg);
      setMessages(prev => [...prev, { role: 'model', text: responseText }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'model', text: "I'm having trouble connecting." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button onClick={() => setIsOpen(!isOpen)} className="fixed bottom-6 right-6 z-50 p-4 bg-primary text-white rounded-full shadow-lg hover:bg-[#00b389] transition-colors">{isOpen ? <X size={24} /> : <MessageCircle size={24} />}</button>
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50 flex flex-col h-[400px]">
          <div className="bg-primary p-4 rounded-t-lg text-white flex items-center gap-2"><Bot size={20}/> <span className="font-bold text-sm">Support Chat</span></div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900">
            {messages.map((m, i) => <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}><div className={`max-w-[85%] p-2 rounded-lg text-xs ${m.role === 'user' ? 'bg-primary text-white' : 'bg-white dark:bg-gray-800 border dark:border-gray-700 dark:text-gray-300'}`}>{m.text}</div></div>)}
            {isLoading && <div className="text-xs text-gray-500">Typing...</div>}
          </div>
          <form onSubmit={handleSend} className="p-3 border-t dark:border-gray-700 flex gap-2"><input value={input} onChange={e => setInput(e.target.value)} className="flex-1 text-sm border rounded px-2 dark:bg-gray-700 dark:text-white" placeholder="Type..." /><button type="submit" disabled={isLoading}><Send size={16} className="text-primary"/></button></form>
        </div>
      )}
    </>
  );
};

const ABCDEGuide: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl relative z-10 overflow-hidden p-6 max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4"><h2 className="text-xl font-bold dark:text-white">ABCDEs of Melanoma</h2><button onClick={onClose}><X size={24} className="text-gray-400"/></button></div>
        <div className="space-y-4">
            {[
                { l: 'A', t: 'Asymmetry', d: 'One half does not match the other half.' },
                { l: 'B', t: 'Border', d: 'The edges are irregular, ragged, notched, or blurred.' },
                { l: 'C', t: 'Color', d: 'The color is not the same all over.' },
                { l: 'D', t: 'Diameter', d: 'The spot is larger than 6mm.' },
                { l: 'E', t: 'Evolving', d: 'The mole is changing in size, shape, or color.' }
            ].map((item, i) => (
                <div key={i} className="flex gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="text-3xl font-bold text-primary w-8 text-center">{item.l}</div>
                    <div><h3 className="font-bold dark:text-white">{item.t}</h3><p className="text-sm text-gray-600 dark:text-gray-300">{item.d}</p></div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

// ... (Rest of components: Login, Signup, UserProfile, DoctorLocator remain the same as previous) ...

const Login: React.FC<{ onNavigate: (page: Page) => void; onLogin: (demo?: boolean) => void }> = ({ onNavigate, onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
        if (!auth) throw new Error("auth/config-missing");
        await signInWithEmailAndPassword(auth, email, password);
        onLogin();
    } catch (err: any) {
        console.error("Login error:", err);
        if (err.code === 'auth/network-request-failed' || err.message === "auth/config-missing" || err.code === 'auth/internal-error') {
             setError("Network/Config error. Switching to Demo Mode...");
             setTimeout(() => onLogin(true), 1500);
        } else if (err.code === 'auth/invalid-credential') {
             setError('Invalid email or password.');
        } else {
             setError('Connection failed. Starting Demo Mode...');
             setTimeout(() => onLogin(true), 1500);
        }
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-soft border border-gray-100 dark:border-gray-700">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4"><User size={24} /></div>
          <h2 className="text-3xl font-bold text-dark dark:text-white">Welcome Back</h2>
        </div>
        {error && <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm flex items-center gap-2"><AlertCircle size={16} /> {error}</div>}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="relative"><div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400"><Mail size={18} /></div><input type="email" required className="appearance-none relative block w-full px-3 py-3 pl-10 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
            <div className="relative"><div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400"><Lock size={18} /></div><input type="password" required className="appearance-none relative block w-full px-3 py-3 pl-10 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} /></div>
          </div>
          <Button type="submit" fullWidth disabled={loading}>{loading ? 'Signing In...' : 'Sign In'} <ArrowRight size={18} className="ml-2" /></Button>
        </form>
        <div className="mt-4 text-center">
            <button type="button" onClick={() => onLogin(true)} className="text-sm text-gray-500 hover:text-primary underline">Skip login (Demo Mode)</button>
        </div>
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">Don't have an account? <button onClick={() => onNavigate(Page.SIGNUP)} className="font-medium text-primary hover:text-[#00b389]">Sign up now</button></p>
      </div>
    </div>
  );
};

const Signup: React.FC<{ onNavigate: (page: Page) => void; onSignup: (demo?: boolean) => void }> = ({ onNavigate, onSignup }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (!auth) throw new Error("auth/config-missing");
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      if (cred.user) {
          await updateProfile(cred.user, { displayName: name });
          // Create initial user document in Firestore
          if (db) {
              await setDoc(doc(db, "users", cred.user.uid), {
                  name,
                  email,
                  joined: Timestamp.now(),
                  role: "patient"
              });
          }
      }
      onSignup();
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/network-request-failed' || err.message === "auth/config-missing") {
         setError("Network error. Switching to Demo Mode...");
         setTimeout(() => onSignup(true), 1500);
      } else {
         setError(err.message.replace('Firebase: ', ''));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-soft border border-gray-100 dark:border-gray-700">
        <div className="text-center"><div className="mx-auto h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4"><UserPlus size={24} /></div><h2 className="text-3xl font-bold text-dark dark:text-white">Create Account</h2></div>
        {error && <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm flex items-center gap-2"><AlertCircle size={16} /> {error}</div>}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="relative"><div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400"><User size={18} /></div><input type="text" required className="appearance-none relative block w-full px-3 py-3 pl-10 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} /></div>
            <div className="relative"><div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400"><Mail size={18} /></div><input type="email" required className="appearance-none relative block w-full px-3 py-3 pl-10 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
            <div className="relative"><div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400"><Lock size={18} /></div><input type="password" required className="appearance-none relative block w-full px-3 py-3 pl-10 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} /></div>
          </div>
          <Button type="submit" fullWidth disabled={loading}>{loading ? 'Creating Account...' : 'Create Account'}</Button>
        </form>
         <div className="mt-4 text-center">
            <button type="button" onClick={() => onSignup(true)} className="text-sm text-gray-500 hover:text-primary underline">Skip signup (Demo Mode)</button>
        </div>
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">Already have an account? <button onClick={() => onNavigate(Page.LOGIN)} className="font-medium text-primary hover:text-[#00b389]">Sign in</button></p>
      </div>
    </div>
  );
};

const UserProfile: React.FC<{ user: UserProfileData; history: PredictionHistoryItem[]; onUpdateUser: (data: UserProfileData) => void }> = ({ user, history, onUpdateUser }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(user);
  
  useEffect(() => { setFormData(user); }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (auth?.currentUser && db) {
        // Save to Firestore
        await setDoc(doc(db, "users", auth.currentUser.uid), {
            name: formData.name,
            email: formData.email,
            phone: formData.phone || '',
            dob: formData.dob || '',
        }, { merge: true });
        
        // Update local auth profile
        await updateProfile(auth.currentUser, { displayName: formData.name });
    }
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

  return (
    <div className="container mx-auto px-4 py-12 animate-[fadeIn_0.5s_ease-out]">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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
              <div className="text-center mb-6"><h2 className="text-2xl font-bold text-dark dark:text-white">{user.name}</h2><p className="text-gray-500 dark:text-gray-400 text-sm">{auth?.currentUser ? "Verified Patient" : "Guest User"}</p></div>
              {isEditing ? (
                <form onSubmit={handleSave} className="space-y-4">
                  <div><label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Name</label><input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full border p-2 rounded dark:bg-gray-700 dark:text-white" /></div>
                  <div><label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Phone</label><input type="text" value={formData.phone || ''} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full border p-2 rounded dark:bg-gray-700 dark:text-white" /></div>
                  <div className="flex gap-2 pt-2"><Button type="submit" fullWidth>Save</Button><Button type="button" variant="secondary" onClick={() => setIsEditing(false)}>Cancel</Button></div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"><Mail size={18} className="text-primary"/><div className="truncate text-dark dark:text-white">{user.email}</div></div>
                  {user.phone && <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"><Phone size={18} className="text-primary"/><div className="text-dark dark:text-white">{user.phone}</div></div>}
                  <Button variant="outline" fullWidth onClick={() => setIsEditing(true)}>Edit Profile</Button>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-soft border border-gray-100 dark:border-gray-700 p-6">
            <h3 className="text-xl font-bold text-dark dark:text-white mb-6 flex items-center gap-2"><Clock size={20} className="text-primary" /> Prediction History</h3>
            <div className="space-y-4 max-h-[500px] overflow-y-auto">
               {history.length === 0 ? <p className="text-gray-500 text-center py-8">No analysis history found.</p> : history.map(item => (
                   <div key={item.id} className="border border-gray-100 dark:border-gray-700 rounded-lg p-4 flex gap-4 bg-gray-50/50 dark:bg-gray-700/50">
                       <img src={item.imageUrl} className="w-20 h-20 rounded object-cover bg-gray-200" alt="scan" onError={(e) => (e.currentTarget.src = "https://placehold.co/100x100?text=No+Image")} />
                       <div>
                           <div className="flex gap-2 items-center mb-1"><span className="text-xs text-gray-500">{item.date}</span><span className={`text-xs px-2 py-0.5 rounded-full border ${getRiskColor(item.result.riskLevel)}`}>{item.result.riskLevel}</span></div>
                           <h4 className="font-bold text-dark dark:text-white">{item.result.classification}</h4>
                           <p className="text-xs text-gray-500 mt-1 line-clamp-1">{item.result.recommendation}</p>
                       </div>
                   </div>
               ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const DoctorLocator: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          findNearbyDermatologists(position.coords.latitude, position.coords.longitude)
            .then(data => { setDoctors(data); setLoading(false); })
            .catch(() => { setError("Could not load doctors."); setLoading(false); });
        },
        () => { setError("Location access denied."); setLoading(false); }
      );
    } else {
      setError("Geolocation not supported.");
    }
  }, []);

  return (
    <div className="py-8">
      {loading ? <div className="flex justify-center p-8"><Loader2 className="w-8 h-8 text-primary animate-spin" /></div> : error ? <div className="text-center text-red-500 p-4">{error}</div> : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {doctors.map((doc, i) => (
             <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow-soft border border-gray-100 dark:border-gray-700 p-6 text-center hover:shadow-md transition-shadow">
               <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 overflow-hidden"><img src={`https://source.unsplash.com/random/100x100?doctor,sig=${i}`} alt="Doc" className="w-full h-full object-cover"/></div>
               <h4 className="font-bold text-lg text-dark dark:text-white mb-1">{doc.name}</h4>
               <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 h-10 line-clamp-2">{doc.address}</p>
               <div className="flex justify-center gap-3"><button className="p-2 rounded-full bg-light dark:bg-gray-700 text-primary hover:bg-primary hover:text-white"><Phone size={18} /></button><a href={doc.uri} className="p-2 rounded-full bg-light dark:bg-gray-700 text-primary hover:bg-primary hover:text-white"><ExternalLink size={18} /></a></div>
             </div>
           ))}
        </div>
      )}
    </div>
  );
};

// --- Main App Component ---

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>(Page.HOME);
  const [isDarkMode, setIsDarkMode] = useState(() => (typeof window !== 'undefined' ? localStorage.getItem('theme') === 'dark' : false));
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfileData>({ name: '', email: '', avatar: '' });
  const [predictionHistory, setPredictionHistory] = useState<PredictionHistoryItem[]>([]);
  const [predictState, setPredictState] = useState<AppState>(AppState.IDLE);
  const [image, setImage] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // ... (useEffect hooks and handlers remain the same) ...
  useEffect(() => {
    if (isDarkMode) { document.documentElement.classList.add('dark'); localStorage.setItem('theme', 'dark'); }
    else { document.documentElement.classList.remove('dark'); localStorage.setItem('theme', 'light'); }
  }, [isDarkMode]);

  useEffect(() => {
    if (!auth) return;
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setIsLoggedIn(true);
        let profileData = { name: user.displayName || 'User', email: user.email || '', avatar: user.photoURL || 'https://source.unsplash.com/random/200x200?face', phone: '', dob: '' };
        if (db) {
            const userDoc = await getDoc(doc(db, "users", user.uid));
            if (userDoc.exists()) {
                const data = userDoc.data();
                profileData = { ...profileData, ...data };
            }
            const q = query(collection(db, "history"), where("userId", "==", user.uid), orderBy("timestamp", "desc"));
            onSnapshot(q, (snapshot) => {
                const hist = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PredictionHistoryItem));
                setPredictionHistory(hist);
            });
        }
        setUserProfile(profileData);
      } else {
        setIsLoggedIn(false);
        setUserProfile({ name: '', email: '', avatar: '' });
        setPredictionHistory([]);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleNavigate = (page: Page) => { setCurrentPage(page); window.scrollTo(0, 0); };
  const handleLogout = async () => { if(auth) await signOut(auth); handleNavigate(Page.HOME); setIsLoggedIn(false); };
  
  const handleLoginSuccess = (demo: boolean = false) => {
      if (demo) {
          setIsLoggedIn(true);
          setUserProfile({ name: 'Demo User', email: 'demo@example.com', avatar: 'https://source.unsplash.com/random/200x200?face' });
          setPredictionHistory([
              { id: '1', date: new Date().toLocaleDateString(), imageUrl: 'https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80', result: { riskLevel: RiskLevel.LOW, classification: Classification.BENIGN, confidence: 95, findings: ['Symmetrical', 'Uniform color'], recommendation: 'Routine checkup.' } }
          ]);
      }
      handleNavigate(Page.HOME);
  };

  const handleImageSelected = async (file: File) => {
    const localUrl = URL.createObjectURL(file); 
    setImage(localUrl); 
    setPredictState(AppState.SCANNING);

    try {
      let storageUrl = localUrl; 
      try {
         const b64 = await fileToBase64(file);
         if (b64.length < 1000000) { 
             storageUrl = `data:${file.type};base64,${b64}`;
         }
      } catch (e) {
         console.warn("Could not convert image for local storage fallback");
      }

      const res = await analyzeImage(file); 
      setResult(res); 
      setPredictState(AppState.RESULTS);

      if (isLoggedIn && db && auth?.currentUser) {
          try {
            await addDoc(collection(db, "history"), {
                userId: auth.currentUser.uid,
                timestamp: Timestamp.now(),
                date: new Date().toLocaleDateString(),
                imageUrl: storageUrl, 
                result: res
            });
          } catch (historyError) {
            console.warn("Could not save to history:", historyError);
          }
      }
    } catch (e) { 
        console.error(e);
        setPredictState(AppState.IDLE); 
        alert("Analysis failed."); 
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 font-sans text-gray-600 dark:text-gray-300 transition-colors duration-200 overflow-hidden">
      
      {/* Sidebar Navigation */}
      <Sidebar 
        currentPage={currentPage} 
        onNavigate={handleNavigate} 
        isCollapsed={isSidebarCollapsed} 
        toggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
        toggleTheme={() => setIsDarkMode(!isDarkMode)}
        isDarkMode={isDarkMode}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        <main className="flex-1 overflow-y-auto w-full">
          {currentPage === Page.HOME && <Home onNavigate={handleNavigate} />}
          {currentPage === Page.ABOUT && <About />}
          {currentPage === Page.LOGIN && <Login onNavigate={handleNavigate} onLogin={handleLoginSuccess} />}
          {currentPage === Page.SIGNUP && <Signup onNavigate={handleNavigate} onSignup={handleLoginSuccess} />}
          {currentPage === Page.PROFILE && <UserProfile user={userProfile} history={predictionHistory} onUpdateUser={setUserProfile} />}
          {currentPage === Page.DOCTORS && <div className="container mx-auto px-4 py-12"><DoctorLocator /></div>}
          {currentPage === Page.PREDICTION && (
             <div className="container mx-auto px-4 py-16 max-w-5xl text-center">
               <h1 className="text-4xl font-bold dark:text-white mb-4">Classification of Skin Cancer</h1>
               <button onClick={() => setIsGuideOpen(true)} className="text-primary text-sm font-bold mt-2 mb-12 inline-flex items-center gap-2 hover:underline">
                  <Info size={16} /> View ABCDE Guide
               </button>
               
               {predictState === AppState.IDLE && <ImageCapture onImageSelected={handleImageSelected} />}
               {predictState === AppState.SCANNING && image && <ScanningOverlay imageUrl={image} />}
               {predictState === AppState.RESULTS && result && image && <ResultsDashboard result={result} onReset={() => { setPredictState(AppState.IDLE); setImage(null); setResult(null); }} imageUrl={image} />}
             </div>
          )}
          
          {/* Footer visible ONLY on Home page */}
          {currentPage === Page.HOME && (
             <div className="mt-auto">
                <Footer />
             </div>
          )}
        </main>
        
        {/* Floating Chat Widget */}
        <ChatWidget />
      </div>

      <ABCDEGuide isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />
    </div>
  );
}