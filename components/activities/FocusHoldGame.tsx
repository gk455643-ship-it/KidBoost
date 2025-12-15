import React, { useState, useRef } from 'react';
import { playSound } from '../../lib/sounds';
import { Fingerprint } from 'lucide-react';

interface FocusHoldGameProps {
  config: { duration: number };
  onComplete: (success: boolean) => void;
}

export const FocusHoldGame: React.FC<FocusHoldGameProps> = ({ config, onComplete }) => {
  const [holding, setHolding] = useState(false);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("Hold the button!");
  
  const startTimeRef = useRef<number | null>(null);
  const intervalRef = useRef<any>(null);

  const startHold = () => {
      setHolding(true);
      setMessage("Don't let go!");
      playSound('pop');
      startTimeRef.current = Date.now();
      
      intervalRef.current = setInterval(() => {
          const elapsed = (Date.now() - (startTimeRef.current || 0)) / 1000;
          const p = Math.min(100, (elapsed / config.duration) * 100);
          setProgress(p);

          if (elapsed >= config.duration) {
              clearInterval(intervalRef.current);
              setHolding(false); 
              playSound('success');
              setMessage("Perfect Focus!");
              setTimeout(() => onComplete(true), 1000);
          }
      }, 50);
  };

  const endHold = () => {
      if (progress < 100) {
          clearInterval(intervalRef.current);
          setHolding(false);
          setProgress(0);
          setMessage("Try again! Hold until full.");
          playSound('wrong');
      }
  };

  return (
    <div className="h-full flex flex-col items-center justify-center p-4">
      <h2 className="text-3xl font-bold text-slate-700 mb-12 animate-fadeIn">{message}</h2>

      <div className="relative">
          {/* Pulse Effect */}
          {holding && (
              <div className="absolute inset-0 rounded-full bg-brand-400 opacity-20 animate-ping" />
          )}

          <button
            onMouseDown={startHold}
            onMouseUp={endHold}
            onMouseLeave={endHold}
            onTouchStart={startHold}
            onTouchEnd={endHold}
            className={`
                w-64 h-64 rounded-full border-8 flex items-center justify-center transition-all duration-200 relative overflow-hidden
                ${holding ? 'border-brand-500 scale-95 bg-brand-50' : 'border-slate-300 bg-white shadow-2xl hover:scale-105'}
            `}
          >
              <div 
                className="absolute bottom-0 left-0 right-0 bg-brand-500/20 transition-all duration-75 ease-linear"
                style={{ height: `${progress}%` }}
              />
              
              <Fingerprint className={`w-32 h-32 z-10 transition-colors ${holding ? 'text-brand-600 animate-pulse' : 'text-slate-300'}`} />
              
              {holding && (
                  <div className="absolute z-20 text-5xl font-black text-brand-800 drop-shadow-md">
                      {Math.ceil(config.duration - (progress / 100 * config.duration))}
                  </div>
              )}
          </button>
      </div>
    </div>
  );
};