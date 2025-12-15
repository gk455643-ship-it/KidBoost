import React, { useState, useEffect } from 'react';
import { playSound } from '../../lib/sounds';
import { DrawingCanvas } from './DrawingCanvas';

interface MemoryDrawActivityProps {
  config: { item: string; colors: string[] };
  onComplete: (success: boolean) => void;
}

export const MemoryDrawActivity: React.FC<MemoryDrawActivityProps> = ({ config, onComplete }) => {
  const [phase, setPhase] = useState<'memorize' | 'draw'>('memorize');
  const [timeLeft, setTimeLeft] = useState(5);

  useEffect(() => {
      const timer = setInterval(() => {
          setTimeLeft(prev => {
              if (prev <= 1) {
                  clearInterval(timer);
                  setPhase('draw');
                  playSound('pop');
                  return 0;
              }
              return prev - 1;
          });
      }, 1000);
      return () => clearInterval(timer);
  }, []);

  if (phase === 'memorize') {
      return (
          <div className="h-full flex flex-col items-center justify-center p-4 text-center animate-fadeIn">
              <h2 className="text-3xl font-bold text-slate-500 mb-8">Memorize this!</h2>
              
              <div className="text-[150px] leading-none select-none drop-shadow-2xl animate-bounce-slow mb-12">
                  {config.item}
              </div>
              
              <div className="text-6xl font-black text-brand-300">{timeLeft}</div>
          </div>
      );
  }

  return (
      <div className="h-full flex flex-col">
          <div className="p-4 text-center bg-slate-50">
              <h3 className="text-xl font-bold text-slate-500">Draw what you saw!</h3>
          </div>
          <div className="flex-1 overflow-hidden">
              <DrawingCanvas 
                config={{ colors: config.colors }} 
                onComplete={onComplete} 
              />
          </div>
      </div>
  );
};