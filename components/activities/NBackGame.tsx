import React, { useState, useEffect, useRef } from 'react';
import { playSound } from '../../lib/sounds';

interface NBackGameProps {
  config: { n: number; type: 'color' | 'image' | 'position'; items?: string[]; gridSize?: number; interval: number };
  onComplete: (success: boolean) => void;
}

export const NBackGame: React.FC<NBackGameProps> = ({ config, onComplete }) => {
  const [history, setHistory] = useState<string[]>([]); 
  const [currentItem, setCurrentItem] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<'match' | 'miss' | null>(null);
  const [turn, setTurn] = useState(0);
  
  const TOTAL_TURNS = 12;
  const MATCH_PROBABILITY = 0.4;
  
  const turnRef = useRef(0);
  
  useEffect(() => {
    const items = config.items || (config.type === 'position' ? Array.from({length: config.gridSize! * config.gridSize!}, (_,i) => i.toString()) : []);
    const seq: string[] = [];

    for (let i = 0; i < TOTAL_TURNS; i++) {
        const isMatch = Math.random() < MATCH_PROBABILITY;
        if (i >= config.n && isMatch) {
            seq.push(seq[i - config.n]);
        } else {
            let pick = items[Math.floor(Math.random() * items.length)];
            if (i >= config.n && pick === seq[i - config.n]) {
                pick = items[Math.floor(Math.random() * items.length)];
            }
            seq.push(pick);
        }
    }
    
    let intervalId: any;
    
    const startGame = () => {
        intervalId = setInterval(() => {
            if (turnRef.current >= TOTAL_TURNS) {
                clearInterval(intervalId);
                setTimeout(() => onComplete(true), 1000);
                return;
            }

            const item = seq[turnRef.current];
            setCurrentItem(item);
            setHistory(prev => [...prev, item]);
            setFeedback(null); 
            setTurn(turnRef.current + 1);
            
            playSound('pop');
            
            turnRef.current += 1;
        }, config.interval);
    };

    const startTimer = setTimeout(startGame, 1000);

    return () => {
        clearInterval(intervalId);
        clearTimeout(startTimer);
    };
  }, [config, onComplete]);

  const handleMatch = () => {
      const len = history.length;
      if (len <= config.n) {
          playSound('wrong');
          return;
      }
      
      const current = history[len - 1];
      const target = history[len - 1 - config.n];
      
      if (current === target) {
          playSound('correct');
          setFeedback('match');
      } else {
          playSound('wrong');
          setFeedback('miss');
      }
  };

  const gridSize = config.gridSize || 3;

  return (
    <div className="h-full flex flex-col items-center justify-center p-4">
       <div className="mb-6 text-center">
           <h3 className="text-2xl font-bold text-slate-500 mb-1">
               {config.n}-Back Match
           </h3>
           <p className="text-slate-400 text-sm mb-4">Tap MATCH if it's the same as {config.n === 1 ? 'the last one' : `${config.n} turns ago`}!</p>
           
           <div className="flex gap-1 justify-center">
               {Array.from({length: TOTAL_TURNS}).map((_, i) => (
                   <div key={i} className={`h-2 w-4 rounded-full transition-colors ${i < turn ? 'bg-brand-400' : 'bg-slate-200'}`} />
               ))}
           </div>
       </div>

       {/* Display Area */}
       <div className="w-64 h-64 bg-slate-100 rounded-3xl border-4 border-slate-200 flex items-center justify-center mb-8 relative overflow-hidden shadow-inner">
           {currentItem && (
               <div className="animate-popIn">
                   {config.type === 'color' && (
                       <div className="w-48 h-48 rounded-full shadow-lg" style={{ backgroundColor: currentItem }} />
                   )}
                   {config.type === 'image' && (
                       <div className="text-9xl">{currentItem}</div>
                   )}
                   {config.type === 'position' && (
                       <div className="w-full h-full grid gap-2 p-4 aspect-square" style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}>
                           {Array.from({ length: gridSize * gridSize }).map((_, i) => (
                               <div key={i} className={`rounded-xl transition-colors duration-300 shadow-sm ${i.toString() === currentItem ? 'bg-blue-500' : 'bg-white'}`} />
                           ))}
                       </div>
                   )}
               </div>
           )}
           
           {/* Feedback Overlay */}
           {feedback === 'match' && (
               <div className="absolute inset-0 flex items-center justify-center bg-green-500/20 z-10 backdrop-blur-sm">
                   <div className="text-green-600 font-black text-4xl animate-bounce">YES!</div>
               </div>
           )}
           {feedback === 'miss' && (
               <div className="absolute inset-0 flex items-center justify-center bg-red-500/20 z-10 backdrop-blur-sm">
                   <div className="text-red-600 font-black text-4xl">NO</div>
               </div>
           )}
       </div>

       <button 
         onClick={handleMatch}
         className="w-full max-w-xs py-5 bg-brand-600 hover:bg-brand-700 text-white rounded-2xl font-black text-3xl shadow-[0px_8px_0px_0px_rgba(194,65,12,1)] active:translate-y-[8px] active:shadow-none transition-all"
       >
           MATCH!
       </button>
    </div>
  );
};