import React, { useEffect, useState } from 'react';

interface BreatheActivityProps {
  duration: number;
  onComplete: (success: boolean) => void;
}

export const BreatheActivity: React.FC<BreatheActivityProps> = ({ duration, onComplete }) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [phase, setPhase] = useState<'Inhale' | 'Hold' | 'Exhale'>('Inhale');

  useEffect(() => {
    const timer = setInterval(() => {
        setTimeLeft(prev => {
            if (prev <= 1) {
                clearInterval(timer);
                onComplete(true);
                return 0;
            }
            return prev - 1;
        });
    }, 1000);
    return () => clearInterval(timer);
  }, [onComplete]);

  // Breathing cycle animation logic
  useEffect(() => {
      // Simple 4-4-4 cycle loop just for visual text update
      const cycle = setInterval(() => {
          setPhase(p => p === 'Inhale' ? 'Hold' : p === 'Hold' ? 'Exhale' : 'Inhale');
      }, 4000);
      return () => clearInterval(cycle);
  }, []);

  return (
    <div className="h-full flex flex-col items-center justify-center relative overflow-hidden bg-sky-50">
       <div className={`w-64 h-64 bg-sky-300/50 rounded-full absolute transition-transform duration-[4000ms] ease-in-out ${phase === 'Inhale' ? 'scale-150' : phase === 'Exhale' ? 'scale-50' : 'scale-100'}`} />
       <div className={`w-48 h-48 bg-sky-400/50 rounded-full absolute transition-transform duration-[4000ms] ease-in-out ${phase === 'Inhale' ? 'scale-125' : phase === 'Exhale' ? 'scale-75' : 'scale-100'}`} />
       
       <div className="z-10 text-center">
           <h2 className="text-4xl font-bold text-sky-700 mb-8">{phase}...</h2>
           <div className="text-6xl font-black text-sky-900">{timeLeft}</div>
       </div>
    </div>
  );
};
