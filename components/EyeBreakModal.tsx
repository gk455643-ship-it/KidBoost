import React, { useEffect, useState } from 'react';
import { Eye } from 'lucide-react';
import { playSound } from '../lib/sounds';

interface EyeBreakModalProps {
  onComplete: () => void;
}

export const EyeBreakModal: React.FC<EyeBreakModalProps> = ({ onComplete }) => {
  const [seconds, setSeconds] = useState(20);

  useEffect(() => {
    playSound('success'); // Gentle notification
    const interval = setInterval(() => {
      setSeconds(s => {
        if (s <= 1) {
          clearInterval(interval);
          setTimeout(onComplete, 1000);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[60] bg-sky-900/95 backdrop-blur-lg flex flex-col items-center justify-center p-8 text-white animate-fadeIn">
      <div className="mb-8 p-6 bg-white/10 rounded-full animate-pulse">
        <Eye className="w-24 h-24 text-sky-200" />
      </div>
      
      <h2 className="text-4xl font-bold mb-4 text-center">Eye Break!</h2>
      <p className="text-xl text-sky-200 mb-12 text-center max-w-md">
        Look at something far away (20 feet) for 20 seconds.
      </p>
      
      <div className="relative w-48 h-48 flex items-center justify-center">
         <div className="absolute inset-0 border-8 border-sky-500/30 rounded-full"></div>
         <svg className="absolute inset-0 w-full h-full -rotate-90">
             <circle 
                cx="96" cy="96" r="88" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="8" 
                strokeDasharray="553" // 2*PI*88
                strokeDashoffset={553 - (553 * (20 - seconds) / 20)}
                className="text-sky-400 transition-all duration-1000 ease-linear"
             />
         </svg>
         <div className="text-6xl font-black">{seconds}</div>
      </div>

      <div className="mt-12 opacity-50 text-sm">Protects your vision 👁️</div>
    </div>
  );
};