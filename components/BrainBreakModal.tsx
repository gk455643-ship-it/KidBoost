import React, { useState, useEffect } from 'react';
import { playSound } from '../lib/sounds';
import { Move, ArrowUp, ArrowDown, Activity } from 'lucide-react';

interface BrainBreakModalProps {
  onComplete: () => void;
}

const EXERCISES = [
    { text: "Reach for the Sky!", icon: <ArrowUp className="w-24 h-24" />, color: "bg-sky-400", anim: "animate-bounce" },
    { text: "Touch your Toes!", icon: <ArrowDown className="w-24 h-24" />, color: "bg-green-400", anim: "animate-bounce-slow" },
    { text: "Wiggle it out!", icon: <Move className="w-24 h-24" />, color: "bg-orange-400", anim: "animate-wiggle" }
];

export const BrainBreakModal: React.FC<BrainBreakModalProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [timeLeft, setTimeLeft] = useState(5);

  useEffect(() => {
      // Start sound
      playSound('pop');
  }, []);

  useEffect(() => {
      if (step >= EXERCISES.length) {
          playSound('fanfare');
          setTimeout(onComplete, 1000);
          return;
      }

      const timer = setInterval(() => {
          setTimeLeft(prev => {
              if (prev <= 1) {
                  clearInterval(timer);
                  // Next step
                  playSound('success');
                  setStep(s => s + 1);
                  return 5; // Reset to 5s
              }
              return prev - 1;
          });
      }, 1000);

      return () => clearInterval(timer);
  }, [step, onComplete]);

  if (step >= EXERCISES.length) {
      return (
          <div className="fixed inset-0 z-[100] bg-brand-500 flex items-center justify-center animate-fadeIn">
              <h1 className="text-6xl text-white font-black animate-bounce">Ready!</h1>
          </div>
      );
  }

  const current = EXERCISES[step];

  return (
    <div className={`fixed inset-0 z-[90] ${current.color} flex flex-col items-center justify-center p-8 transition-colors duration-500`}>
        <div className="bg-white/20 p-4 rounded-full mb-8 backdrop-blur-sm animate-pulse">
            <Activity className="w-12 h-12 text-white" />
        </div>

        <h2 className="text-5xl md:text-7xl font-black text-white text-center mb-12 drop-shadow-md">
            {current.text}
        </h2>

        <div className={`text-white mb-12 ${current.anim}`}>
            {current.icon}
        </div>

        <div className="w-64 h-4 bg-black/20 rounded-full overflow-hidden">
            <div 
                className="h-full bg-white transition-all duration-1000 ease-linear"
                style={{ width: `${(timeLeft / 5) * 100}%` }}
            />
        </div>
        <div className="mt-4 text-4xl font-bold text-white/80">{timeLeft}</div>
    </div>
  );
};