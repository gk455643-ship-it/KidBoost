import React, { useState, useEffect, useRef } from 'react';
import { playSound } from '../../lib/sounds';
import { useAgeStyling } from '../../hooks/useAgeStyling';
import { Timer } from 'lucide-react';

interface FlashMemoryGameProps {
  config: { items: string[] };
  onComplete: (success: boolean, results: {itemId: string, quality: number}[]) => void;
}

export const FlashMemoryGame: React.FC<FlashMemoryGameProps> = ({ config, onComplete }) => {
  const styles = useAgeStyling();
  const [phase, setPhase] = useState<'memorize' | 'recall'>('memorize');
  const [targetItem, setTargetItem] = useState<string>('');
  const [options, setOptions] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState(3);
  const [queue, setQueue] = useState<string[]>([]);
  const [results, setResults] = useState<{itemId: string, quality: number}[]>([]);
  const [isLocked, setIsLocked] = useState(false); 
  const [feedbackItem, setFeedbackItem] = useState<string | null>(null);

  const startTimeRef = useRef<number>(0);
  const maxTime = 3; 

  useEffect(() => {
    setQueue([...config.items]);
  }, [config]);

  useEffect(() => {
      if (queue.length > 0 && !targetItem) {
          nextRound();
      } else if (queue.length === 0 && !targetItem && results.length > 0) {
          setTimeout(() => onComplete(true, results), 500);
      }
  }, [queue, targetItem, results, onComplete]);

  const nextRound = () => {
      if (queue.length === 0) return;
      const current = queue[0];
      setTargetItem(current);
      
      const pool = ["🍎", "🚗", "🐸", "🌟", "🏀", "🎸", "🍦", "🚀", ...config.items];
      const distractors = pool
        .filter(i => i !== current)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3); // Always 3 distractors for consistency, or adjust based on age
      
      setOptions([current, ...distractors].sort(() => 0.5 - Math.random()));
      setPhase('memorize');
      setTimeLeft(maxTime);
      setIsLocked(false);
      setFeedbackItem(null);
      playSound('pop');
  };

  useEffect(() => {
    if (phase === 'memorize') {
      const timer = setInterval(() => {
          setTimeLeft(prev => {
              if (prev <= 0) {
                  clearInterval(timer);
                  setPhase('recall');
                  startTimeRef.current = Date.now();
                  return 0;
              }
              return prev - 0.1;
          });
      }, 100);
      return () => clearInterval(timer);
    }
  }, [phase]);

  const handleSelect = (item: string) => {
    if (isLocked) return;
    setIsLocked(true);

    const success = item === targetItem;
    const duration = Date.now() - startTimeRef.current;
    const HESITATION_THRESHOLD = 4000;

    if (success) {
        setFeedbackItem(item);
        playSound('correct');
        const quality = duration > HESITATION_THRESHOLD ? 4 : 5;
        
        setResults(prev => [...prev, { itemId: targetItem, quality }]);
        
        setTimeout(() => {
            setTargetItem(''); 
            setQueue(q => q.slice(1)); 
        }, 1000);
    } else {
        playSound('wrong');
        // Shake animation handled by CSS/Class
        setTimeout(() => {
            setIsLocked(false);
        }, 600);
        
        // Don't record failure immediately, let them try again but penalize internally if needed
        // For strictly testing memory, maybe we do move on? 
        // Let's stick to "One chance" for Score but allow retry for UI flow?
        // Actually, for "Flash Cards", usually you want to correct them.
        // Let's mark it wrong in results, show correct answer, then move on.
        
        setResults(prev => [...prev, { itemId: targetItem, quality: 0 }]);
        setTimeout(() => {
             setTargetItem(''); 
             setQueue(q => q.slice(1)); 
        }, 1000);
    }
  };

  if (queue.length === 0 && !targetItem) {
      return (
        <div className="h-full flex items-center justify-center">
            <div className="text-4xl animate-bounce">🎉</div>
        </div>
      );
  }

  const isColor = targetItem.startsWith('#');

  return (
    <div className="h-full flex flex-col items-center justify-center p-6 bg-slate-50">
      {phase === 'memorize' ? (
        <div className={`w-full max-w-md aspect-square bg-white ${styles.card} shadow-xl flex flex-col items-center justify-center relative overflow-hidden animate-fadeIn`}>
           <div className="absolute top-0 left-0 w-full h-2 bg-slate-100">
               <div 
                 className="h-full bg-brand-500 transition-all duration-100 ease-linear"
                 style={{ width: `${(timeLeft / maxTime) * 100}%` }}
               />
           </div>
           
           <h2 className={`text-slate-400 font-bold mb-8 uppercase tracking-widest ${styles.title.replace('text-4xl', 'text-xl')}`}>Memorize</h2>
           
           <div className={`transition-all duration-500 transform hover:scale-110 ${isColor ? 'w-48 h-48 rounded-full shadow-lg' : 'text-[120px] md:text-[160px]'}`}
                style={{ backgroundColor: isColor ? targetItem : undefined }}>
             {!isColor && targetItem}
           </div>
           
           <div className="absolute bottom-6 flex items-center gap-2 text-brand-300 font-bold">
               <Timer className="w-5 h-5 animate-pulse" />
               <span className="text-xl">{Math.ceil(timeLeft)}</span>
           </div>
        </div>
      ) : (
        <div className="w-full max-w-2xl flex flex-col items-center animate-fadeIn">
          <h2 className={`text-center text-slate-600 mb-8 ${styles.title}`}>Which one was it?</h2>
          
          <div className={`grid grid-cols-2 ${styles.gridGap} w-full`}>
            {options.map((opt, idx) => {
              const isOptColor = opt.startsWith('#');
              const isSelected = feedbackItem === opt;
              
              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(opt)}
                  disabled={isLocked}
                  className={`
                      aspect-square bg-white ${styles.card} shadow-sm active:scale-95 transition-all flex items-center justify-center relative overflow-hidden
                      ${isSelected ? 'border-green-500 bg-green-50 ring-4 ring-green-200' : 'hover:border-brand-200'}
                      ${isLocked && !isSelected ? 'opacity-50' : ''}
                  `}
                >
                  {isOptColor ? (
                      <div className="w-full h-full" style={{ backgroundColor: opt }} />
                  ) : (
                      <span className="text-7xl md:text-8xl select-none">{opt}</span>
                  )}
                  
                  {isSelected && (
                      <div className="absolute inset-0 flex items-center justify-center bg-white/30 backdrop-blur-sm animate-fadeIn">
                          <div className="bg-green-500 text-white rounded-full p-4 shadow-xl animate-bounce">
                              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" /></svg>
                          </div>
                      </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};