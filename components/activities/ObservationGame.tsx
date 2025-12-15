import React, { useState, useEffect } from 'react';
import { playSound } from '../../lib/sounds';
import { useAgeStyling } from '../../hooks/useAgeStyling';
import { HelpCircle, Eye, EyeOff } from 'lucide-react';

interface ObservationGameProps {
  config: { mode: 'missing' | 'count'; items: string[]; count?: number; min?: number; max?: number };
  onComplete: (success: boolean) => void;
}

export const ObservationGame: React.FC<ObservationGameProps> = ({ config, onComplete }) => {
  const styles = useAgeStyling();
  const [phase, setPhase] = useState<'observe' | 'mask' | 'answer'>('observe');
  const [displayedItems, setDisplayedItems] = useState<string[]>([]);
  const [missingItem, setMissingItem] = useState<string>('');
  const [options, setOptions] = useState<string[]>([]);
  const [correctCount, setCorrectCount] = useState(0);

  useEffect(() => {
    // SETUP
    const pool = config.items;
    
    if (config.mode === 'missing') {
        const count = config.count || 3;
        const shuffled = [...pool].sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, count);
        setDisplayedItems(selected);
        
        const missing = selected[Math.floor(Math.random() * selected.length)];
        setMissingItem(missing);
        
        const distractors = pool.filter(i => !selected.includes(i)).slice(0, 3);
        setOptions([missing, ...distractors].sort(() => 0.5 - Math.random()));
        
    } else if (config.mode === 'count') {
        const min = config.min || 3;
        const max = config.max || 8;
        const num = Math.floor(Math.random() * (max - min + 1)) + min;
        setCorrectCount(num);
        
        const generated = Array.from({ length: num }).map(() => pool[Math.floor(Math.random() * pool.length)]);
        setDisplayedItems(generated);
        
        const opts = [num, num + 1, num - 1, num + 2].filter(n => n > 0).sort((a, b) => a - b);
        setOptions(opts.map(String).sort(() => 0.5 - Math.random()));
    }

    // TIMING
    const timeToObserve = config.mode === 'count' ? 3000 : 5000;
    const timer = setTimeout(() => {
        setPhase('mask');
        playSound('pop');
        setTimeout(() => setPhase('answer'), 1500); // 1.5s mask transition
    }, timeToObserve);

    return () => clearTimeout(timer);
  }, [config]);

  const handleAnswer = (ans: string) => {
      let isCorrect = false;
      if (config.mode === 'missing') {
          isCorrect = ans === missingItem;
      } else {
          isCorrect = parseInt(ans) === correctCount;
      }

      if (isCorrect) {
          playSound('correct');
          onComplete(true);
      } else {
          playSound('wrong');
          setTimeout(() => onComplete(false), 500); // Small delay for sound
      }
  };

  return (
    <div className="h-full flex flex-col items-center justify-center p-4 bg-slate-50 relative overflow-hidden">
       {/* OBSERVE PHASE */}
       <div className={`
           transition-all duration-500 ease-in-out flex flex-col items-center w-full max-w-4xl
           ${phase === 'observe' ? 'opacity-100 scale-100' : 'opacity-0 scale-90 absolute'}
       `}>
           <div className="flex items-center gap-2 mb-8 text-slate-400 font-bold uppercase tracking-widest">
               <Eye className="w-5 h-5" /> {config.mode === 'missing' ? 'Memorize Items' : 'Count Them!'}
           </div>

           <div className="flex flex-wrap justify-center gap-8 md:gap-12 p-8">
               {displayedItems.map((item, i) => (
                   <div key={i} className="text-7xl md:text-9xl animate-bounce-slow drop-shadow-lg" style={{ animationDelay: `${i*0.1}s` }}>
                       {item}
                   </div>
               ))}
           </div>
       </div>

       {/* CURTAIN / MASK PHASE */}
       <div className={`
            absolute inset-0 bg-brand-500 z-10 flex items-center justify-center transition-transform duration-700 ease-in-out
            ${phase === 'mask' ? 'translate-y-0' : phase === 'answer' ? '-translate-y-full' : 'translate-y-full'}
       `}>
           <div className="text-white flex flex-col items-center animate-pulse">
               <EyeOff className="w-24 h-24 mb-4" />
               <h2 className="text-4xl font-black">Hiding...</h2>
           </div>
       </div>

       {/* ANSWER PHASE */}
       {phase === 'answer' && (
           <div className="w-full max-w-3xl text-center animate-fadeIn flex flex-col items-center">
                <HelpCircle className="w-16 h-16 text-brand-500 mb-6 animate-bounce" />
                <h3 className={`text-slate-600 font-bold mb-12 ${styles.title}`}>
                   {config.mode === 'missing' ? 'What is missing?' : 'How many were there?'}
               </h3>
               
               {config.mode === 'missing' ? (
                    <div className="grid grid-cols-2 gap-6 w-full max-w-lg">
                        {options.map((opt, i) => (
                            <button
                                key={i}
                                onClick={() => handleAnswer(opt)}
                                className={`
                                    h-40 bg-white ${styles.card} shadow-[0_4px_0_0_rgba(148,163,184,1)] flex items-center justify-center text-7xl md:text-8xl transition-all active:scale-95 active:shadow-none active:translate-y-1 hover:-translate-y-1
                                `}
                            >
                                {opt}
                            </button>
                        ))}
                    </div>
               ) : (
                   <div className="flex flex-wrap justify-center gap-6">
                        {options.map((opt, i) => (
                            <button
                                key={i}
                                onClick={() => handleAnswer(opt)}
                                className="w-24 h-24 md:w-32 md:h-32 bg-brand-500 hover:bg-brand-600 text-white rounded-3xl font-black text-4xl md:text-5xl shadow-[0_6px_0_0_rgba(194,65,12,1)] active:translate-y-[6px] active:shadow-none transition-all"
                            >
                                {opt}
                            </button>
                        ))}
                   </div>
               )}
           </div>
       )}
    </div>
  );
};