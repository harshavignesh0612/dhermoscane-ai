import React, { useState, useEffect } from 'react';
import { Scan, ShieldCheck, MapPin, ChevronRight } from 'lucide-react';
import { Button } from './Button';

interface LandingCarouselProps {
  onStart: () => void;
}

export const LandingCarousel: React.FC<LandingCarouselProps> = ({ onStart }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      icon: <Scan className="w-16 h-16 text-neon-cyan" />,
      title: "AI DIAGNOSTICS",
      desc: "Advanced neural networks analyze dermal irregularities in real-time.",
      color: "from-cyan-500/20 to-blue-500/5"
    },
    {
      icon: <ShieldCheck className="w-16 h-16 text-neon-purple" />,
      title: "RISK ASSESSMENT",
      desc: "Instant categorization into Benign or Malignant probability vectors.",
      color: "from-purple-500/20 to-pink-500/5"
    },
    {
      icon: <MapPin className="w-16 h-16 text-neon-green" />,
      title: "MED-LOCATOR",
      desc: "Geospatial grounding to identify nearest authorized specialists.",
      color: "from-green-500/20 to-teal-500/5"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] justify-between py-8">
      
      {/* Main Carousel Area */}
      <div className="flex-1 flex flex-col items-center justify-center relative perspective-1000">
        
        {/* Background Elements */}
        <div className="absolute inset-0 bg-cyber-grid pointer-events-none opacity-30"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-neon-cyan/20 blur-[100px] rounded-full"></div>

        <div className="relative w-full max-w-xs aspect-[4/5] flex items-center justify-center">
            {slides.map((slide, index) => {
                const isActive = index === currentSlide;
                return (
                    <div 
                        key={index}
                        className={`absolute inset-0 transition-all duration-700 ease-out transform ${
                            isActive 
                            ? 'opacity-100 scale-100 translate-z-0' 
                            : 'opacity-0 scale-90 -translate-y-8'
                        }`}
                    >
                        <div className={`w-full h-full glass-panel neon-border flex flex-col items-center justify-center p-8 text-center bg-gradient-to-b ${slide.color} backdrop-blur-xl relative overflow-hidden group`}>
                             {/* Holographic shimmer */}
                             <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                             
                             <div className="mb-8 p-6 rounded-full bg-black/40 border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.5)] relative animate-float">
                                 {slide.icon}
                                 <div className="absolute inset-0 rounded-full border border-white/20 animate-ping opacity-20"></div>
                             </div>
                             
                             <h2 className="text-3xl font-display font-bold text-white mb-4 tracking-widest">{slide.title}</h2>
                             <div className="h-1 w-12 bg-current mb-6 rounded-full opacity-50"></div>
                             <p className="text-slate-400 font-sans text-lg leading-relaxed">{slide.desc}</p>
                        </div>
                    </div>
                );
            })}
        </div>
      </div>

      {/* Controls */}
      <div className="px-6 space-y-6">
        <div className="flex justify-center gap-3">
            {slides.map((_, idx) => (
                <button 
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    className={`h-1 transition-all duration-300 ${
                        currentSlide === idx ? 'w-8 bg-neon-cyan shadow-[0_0_10px_#06b6d4]' : 'w-2 bg-slate-700'
                    }`}
                />
            ))}
        </div>

        <Button fullWidth onClick={onStart} className="text-lg">
           INITIALIZE SYSTEM <ChevronRight className="w-5 h-5 animate-pulse" />
        </Button>
      </div>
    </div>
  );
};