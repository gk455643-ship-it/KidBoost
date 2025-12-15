import React, { useState, useEffect } from 'react';
import { playSound } from '../../lib/sounds';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface SortingGameProps {
  config: { 
      left: { label: string, color?: string, items: string[] };
      right: { label: string, color?: string, items: string[] };
  };
  onComplete: (success: boolean) => void;
}

export const SortingGame: React.FC<SortingGameProps> = ({ config, onComplete }) => {
  const [currentItem, setCurrentItem] = useState<string>('');
  const [score, setScore] = useState(0);
  const GOAL = 10;

  const nextItem = () => {
      const isLeft = Math.random() > 0.5;
      const pool = isLeft ? config.left.items : config.right.items;
      const item = pool[Math.floor(Math.random() * pool.length)];
      setCurrentItem(item);
  };

  useEffect(() => {
      nextItem();
  }, []);

  const handleSort = (direction: 'left' | 'right') => {
      const isLeftCorrect = config.left.items.includes(currentItem);
      const isRightCorrect = config.right.items.includes(currentItem);
      
      // Handle overlap gracefully (if item is in both, either is correct)
      const correct = (direction === 'left' && isLeftCorrect) || (direction === 'right' && isRightCorrect);

      if (correct) {
          playSound('pop');
          if (score + 1 >= GOAL) {
              onComplete(true);
          } else {
              setScore(s => s + 1);
              nextItem();
          }
      } else {
          playSound('wrong');
          // Shake effect?
      }
  };

  return (
    <div className="h-full flex flex-col items-center justify-center p-4 relative overflow-hidden">
       {/* Top Progress */}
       <div className="absolute top-4 w-full px-12">
           <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
               <div className="h-full bg-green-500 transition-all duration-300" style={{ width: `${(score / GOAL) * 100}%` }} />
           </div>
       </div>

       {/* Center Item */}
       <div className="flex-1 flex items-center justify-center">
           <div className="w-40 h-40 bg-white rounded-3xl shadow-xl border-4 border-slate-100 flex items-center justify-center text-8xl animate-bounce-slow">
               {currentItem}
           </div>
       </div>

       {/* Controls */}
       <div className="w-full flex justify-between gap-8 mb-8 px-4">
           <button 
             onClick={() => handleSort('left')}
             className="flex-1 py-8 bg-white border-b-8 border-slate-200 rounded-3xl shadow-sm active:border-b-0 active:translate-y-2 transition-all flex flex-col items-center gap-2 group"
             style={{ borderColor: config.left.color }}
           >
               <ArrowLeft className="w-8 h-8 text-slate-400 group-hover:text-slate-600" />
               <span className="font-bold text-xl text-slate-700">{config.left.label}</span>
           </button>

           <button 
             onClick={() => handleSort('right')}
             className="flex-1 py-8 bg-white border-b-8 border-slate-200 rounded-3xl shadow-sm active:border-b-0 active:translate-y-2 transition-all flex flex-col items-center gap-2 group"
             style={{ borderColor: config.right.color }}
           >
               <ArrowRight className="w-8 h-8 text-slate-400 group-hover:text-slate-600" />
               <span className="font-bold text-xl text-slate-700">{config.right.label}</span>
           </button>
       </div>
    </div>
  );
};