import React, { useState, useEffect } from 'react';
import { playSound } from '../../lib/sounds';
import { useAgeStyling } from '../../hooks/useAgeStyling';
import { RefreshCw, RotateCcw, Play, Eye } from 'lucide-react';

interface SequenceGameProps {
  config: { length: number; items: string[] };
  onComplete: (success: boolean, results: {itemId: string, quality: number}[]) => void;
  reverse?: boolean;
}

export const SequenceGame: React.FC<SequenceGameProps> = ({ config, onComplete, reverse = false }) => {
  const styles = useAgeStyling();
  const [sequence, setSequence] = useState<string[]>([]);
  const [userSequence, setUserSequence] = useState<string[]>([]);
  const [phase, setPhase] = useState<'showing' | 'recall'>('showing');
  const [showIndex, setShowIndex] = useState(-1);
  const [options, setOptions] = useState<string[]>([]);

  useEffect(() => {
    const pool = config.items || ["A", "B", "C", "D"];
    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    const seq = shuffled.slice(0, config.length);
    setSequence(seq);
    setOptions(seq.slice().sort(() => 0.5 - Math.random()));
    
    // Start playback
    let idx = 0;
    const interval = setInterval(() => {
        if (idx < seq.length) {
            setShowIndex(idx);
            playSound('pop');
            idx++;
        } else {
            clearInterval(interval);
            setShowIndex(-1);
            setPhase('recall');
        }
    }, 1500); 

    return () => clearInterval(interval);
  }, [config]);

  const handleSelect = (item: string) => {
      if (userSequence.includes(item)) return; 
      
      const newSeq = [...userSequence, item];
      setUserSequence(newSeq);
      playSound('click');

      if (newSeq.length === sequence.length) {
          const correctSeq = reverse ? [...sequence].reverse() : sequence;
          const isCorrect = newSeq.every((val, index) => val === correctSeq[index]);
          
          if (isCorrect) {
              setTimeout(() => {
                playSound('correct');
                onComplete(true, []);
              }, 300);
          } else {
              playSound('wrong');
              setTimeout(() => {
                  onComplete(false, []);
              }, 1000);
          }
      }
  };

  const reset = () => {
      setUserSequence([]);
      playSound('click');
  };

  return (
    <div className="h-full flex flex-col items-center justify-center p-4 bg-slate-50">
      {phase === 'showing' ? (
          <div className="flex flex-col items-center justify-center h-full animate-fadeIn">
              <div className="mb-12 flex items-center gap-2 text-slate-400 font-bold uppercase tracking-widest">
                  <Eye className="w-5 h-5" /> Watch Sequence
              </div>
              
              <div className="h-48 flex items-center justify-center">
                  {showIndex >= 0 ? (
                      <div className="relative animate-bounce">
                          {config.items[0].startsWith('#') ? (
                              <div className="w-48 h-48 rounded-full shadow-2xl border-8 border-white" style={{ backgroundColor: sequence[showIndex] }} />
                          ) : (
                              <div className="text-[140px] drop-shadow-2xl">{sequence[showIndex]}</div>
                          )}
                      </div>
                  ) : (
                      <div className="w-4 h-4 bg-slate-200 rounded-full animate-ping" />
                  )}
              </div>
              
              <div className="mt-16 flex gap-2">
                  {sequence.map((_, i) => (
                      <div key={i} className={`h-2 rounded-full transition-all duration-300 ${i <= showIndex ? 'w-8 bg-brand-500' : 'w-2 bg-slate-200'}`} />
                  ))}
              </div>
          </div>
      ) : (
          <div className="w-full max-w-2xl flex flex-col items-center animate-fadeIn">
              <h3 className={`text-slate-600 mb-8 flex items-center gap-2 ${styles.title}`}>
                  {reverse ? <><RotateCcw className="w-8 h-8" /> Reverse Order!</> : 'Tap in Order!'}
              </h3>
              
              {/* Slots */}
              <div className="flex gap-3 md:gap-6 mb-12">
                  {Array.from({ length: config.length }).map((_, i) => (
                      <div 
                        key={i} 
                        className={`
                            w-20 h-20 md:w-24 md:h-24 rounded-2xl border-4 flex items-center justify-center text-4xl md:text-5xl font-bold transition-all shadow-inner
                            ${userSequence[i] 
                                ? 'bg-white border-brand-500 shadow-md scale-100' 
                                : 'bg-slate-100 border-dashed border-slate-300 scale-95'}
                        `}
                      >
                           {userSequence[i] && (
                               config.items[0].startsWith('#') ? (
                                   <div className="w-12 h-12 rounded-full shadow-sm" style={{ backgroundColor: userSequence[i] }} />
                               ) : (
                                   <span className="animate-popIn">{userSequence[i]}</span>
                               )
                           )}
                      </div>
                  ))}
              </div>

              {/* Options */}
              <div className="flex flex-wrap gap-4 justify-center">
                  {options.map((item, i) => {
                      const isUsed = userSequence.includes(item);
                      const isColor = item.startsWith('#');
                      return (
                        <button
                            key={i}
                            onClick={() => handleSelect(item)}
                            disabled={isUsed}
                            className={`
                                w-24 h-24 bg-white ${styles.card} shadow-[0_4px_0_0_rgba(148,163,184,1)] flex items-center justify-center text-5xl md:text-6xl transition-all active:scale-95 active:shadow-none active:translate-y-1
                                ${isUsed ? 'opacity-20 cursor-not-allowed shadow-none translate-y-1' : 'hover:-translate-y-1 hover:shadow-[0_6px_0_0_rgba(148,163,184,1)]'}
                            `}
                        >
                            {isColor ? <div className="w-16 h-16 rounded-full border-2 border-slate-100" style={{ backgroundColor: item }} /> : item}
                        </button>
                      );
                  })}
              </div>
              
              <button onClick={reset} className="mt-12 text-slate-400 hover:text-slate-600 flex items-center gap-2 px-6 py-2 rounded-full hover:bg-slate-100 transition-colors">
                  <RefreshCw className="w-4 h-4" /> Reset Order
              </button>
          </div>
      )}
    </div>
  );
};