import React, { useState, useEffect } from 'react';
import { playSound } from '../../lib/sounds';

interface InstructionGameProps {
  config: { steps: number; items: string[] };
  onComplete: (success: boolean) => void;
}

export const InstructionGame: React.FC<InstructionGameProps> = ({ config, onComplete }) => {
  const [phase, setPhase] = useState<'instruction' | 'action'>('instruction');
  const [sequence, setSequence] = useState<string[]>([]);
  const [userSequence, setUserSequence] = useState<string[]>([]);
  const [options, setOptions] = useState<string[]>([]);

  useEffect(() => {
    // Generate instruction sequence
    const shuffled = [...config.items].sort(() => 0.5 - Math.random());
    const seq = shuffled.slice(0, config.steps);
    setSequence(seq);
    
    // Options include sequence + distractors
    const pool = config.items.filter(i => !seq.includes(i));
    const distractors = pool.slice(0, 4); // max 4 distractors
    const opts = [...seq, ...distractors].sort(() => 0.5 - Math.random());
    setOptions(opts);

  }, [config]);

  const startAction = () => {
      setPhase('action');
  };

  const handleSelect = (item: string) => {
      // Allow duplicates? Usually instructions are unique items in this context.
      // Assuming unique for now.
      if (userSequence.includes(item)) return;

      const newSeq = [...userSequence, item];
      setUserSequence(newSeq);
      playSound('click');

      // Check current tap validity immediately? Or wait for full sequence?
      // Strict instruction: "First X, Then Y".
      // Check immediately for better feedback for kids.
      const currentIndex = newSeq.length - 1;
      if (item !== sequence[currentIndex]) {
          playSound('wrong');
          // Reset or fail? Let's fail/reset
          setTimeout(() => {
              onComplete(false); 
          }, 500);
          return;
      }

      // If correct so far
      if (newSeq.length === sequence.length) {
          playSound('correct');
          onComplete(true);
      }
  };

  return (
    <div className="h-full flex flex-col items-center justify-center p-4">
      {phase === 'instruction' ? (
          <div className="flex flex-col items-center animate-fadeIn text-center">
              <h3 className="text-3xl font-bold text-slate-700 mb-8">Follow the path!</h3>
              
              <div className="flex flex-wrap justify-center items-center gap-4 mb-12">
                  {sequence.map((item, i) => (
                      <React.Fragment key={i}>
                          <div className="w-24 h-24 bg-white border-4 border-slate-200 rounded-2xl flex items-center justify-center text-5xl shadow-sm animate-bounce-slow" style={{ animationDelay: `${i * 0.2}s` }}>
                              {item}
                          </div>
                          {i < sequence.length - 1 && (
                              <div className="text-slate-300 text-2xl">➔</div>
                          )}
                      </React.Fragment>
                  ))}
              </div>

              <button 
                onClick={startAction}
                className="px-10 py-4 bg-blue-500 hover:bg-blue-600 text-white text-2xl font-bold rounded-2xl shadow-lg transition-all active:scale-95"
              >
                  I'm Ready!
              </button>
          </div>
      ) : (
          <div className="flex flex-col items-center">
              <h3 className="text-2xl font-bold text-slate-500 mb-8">Tap in the correct order!</h3>
              
              {/* Progress slots */}
              <div className="flex gap-2 mb-8 h-16">
                  {Array.from({ length: config.steps }).map((_, i) => (
                      <div key={i} className={`w-12 h-12 rounded-full border-4 flex items-center justify-center text-xl ${userSequence[i] ? 'bg-green-100 border-green-500 text-green-700' : 'border-slate-200 text-slate-300'}`}>
                          {userSequence[i] ? '✓' : i + 1}
                      </div>
                  ))}
              </div>

              <div className="grid grid-cols-3 gap-4">
                  {options.map((item, i) => {
                      const isSelected = userSequence.includes(item);
                      return (
                          <button
                            key={i}
                            onClick={() => handleSelect(item)}
                            disabled={isSelected}
                            className={`w-24 h-24 bg-white border-4 rounded-2xl flex items-center justify-center text-5xl shadow-sm transition-all active:scale-90 ${isSelected ? 'opacity-50 border-slate-100' : 'border-slate-200 hover:border-blue-300'}`}
                          >
                              {item}
                          </button>
                      );
                  })}
              </div>
          </div>
      )}
    </div>
  );
};