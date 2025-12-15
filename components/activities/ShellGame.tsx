import React, { useState, useEffect } from 'react';
import { playSound } from '../../lib/sounds';

interface ShellGameProps {
  config: { cups: number; swaps: number; speed: 'slow' | 'medium' | 'fast' };
  onComplete: (success: boolean) => void;
}

export const ShellGame: React.FC<ShellGameProps> = ({ config, onComplete }) => {
  const [cups, setCups] = useState<number[]>([]); 
  const [starIndex, setStarIndex] = useState(0); 
  const [phase, setPhase] = useState<'show' | 'hide' | 'shuffle' | 'pick'>('show');
  const [swapCount, setSwapCount] = useState(0);

  useEffect(() => {
      setCups(Array.from({ length: config.cups }, (_, i) => i));
      setStarIndex(Math.floor(Math.random() * config.cups));
      
      const t1 = setTimeout(() => setPhase('hide'), 1500);
      const t2 = setTimeout(() => setPhase('shuffle'), 2500);
      
      return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [config]);

  useEffect(() => {
      if (phase === 'shuffle' && swapCount < config.swaps) {
          const speedMap = { slow: 1000, medium: 700, fast: 400 };
          const interval = speedMap[config.speed] || 700;

          const timer = setTimeout(() => {
              setCups(prev => {
                  const newCups = [...prev];
                  const i = Math.floor(Math.random() * newCups.length);
                  let j = Math.floor(Math.random() * newCups.length);
                  while (j === i) j = Math.floor(Math.random() * newCups.length);
                  
                  [newCups[i], newCups[j]] = [newCups[j], newCups[i]];
                  return newCups;
              });
              playSound('click');
              setSwapCount(s => s + 1);

          }, interval);
          return () => clearTimeout(timer);
      } else if (phase === 'shuffle' && swapCount >= config.swaps) {
          setPhase('pick');
      }
  }, [phase, swapCount, config]);

  const handlePick = (originalIndex: number) => {
      if (phase !== 'pick') return;
      
      if (originalIndex === starIndex) {
          playSound('correct');
          setPhase('show'); 
          setTimeout(() => onComplete(true), 1500);
      } else {
          playSound('wrong');
          setPhase('show'); 
          setTimeout(() => onComplete(false), 1500);
      }
  };

  return (
    <div className="h-full flex flex-col items-center justify-center p-4">
      <h3 className="text-2xl text-slate-500 font-bold mb-12">
          {phase === 'pick' ? 'Where is the Star?' : 'Watch carefully!'}
      </h3>

      <div className="flex gap-4 md:gap-8">
          {cups.map((originalIdx) => (
              <button 
                key={originalIdx} 
                onClick={() => handlePick(originalIdx)}
                disabled={phase !== 'pick'}
                className="w-24 h-32 flex flex-col items-center justify-end relative transition-all duration-300 transform"
              >
                  {/* Cup Graphic */}
                  <div className={`
                      w-24 h-24 relative z-10 transition-transform duration-500
                      ${(phase === 'show') ? '-translate-y-12' : 'translate-y-0'}
                  `}>
                      <svg viewBox="0 0 100 100" className={`w-full h-full drop-shadow-md ${phase === 'pick' ? 'cursor-pointer hover:scale-105' : ''}`}>
                          <path d="M 20 100 L 10 100 L 15 20 C 15 5 85 5 85 20 L 90 100 L 80 100 Z" fill="#F97316" stroke="#C2410C" strokeWidth="2" />
                          <path d="M 15 20 C 15 5 85 5 85 20" fill="#FB923C" />
                      </svg>
                  </div>
                  
                  {/* The Item */}
                  {originalIdx === starIndex && (
                      <div className="absolute bottom-2 text-4xl animate-bounce">⭐</div>
                  )}
              </button>
          ))}
      </div>
    </div>
  );
};