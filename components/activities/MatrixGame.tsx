import React, { useState, useEffect } from 'react';
import { playSound } from '../../lib/sounds';

interface MatrixGameProps {
  config: { gridSize: number; fillCount: number };
  onComplete: (success: boolean) => void;
}

export const MatrixGame: React.FC<MatrixGameProps> = ({ config, onComplete }) => {
  const [pattern, setPattern] = useState<number[]>([]);
  const [userPattern, setUserPattern] = useState<number[]>([]);
  const [phase, setPhase] = useState<'memorize' | 'recall'>('memorize');
  
  const totalCells = config.gridSize * config.gridSize;

  useEffect(() => {
    const indices = Array.from({ length: totalCells }, (_, i) => i);
    const shuffled = indices.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, config.fillCount);
    setPattern(selected);

    const timer = setTimeout(() => {
        setPhase('recall');
    }, 2000 + (config.fillCount * 500)); 

    return () => clearTimeout(timer);
  }, [config, totalCells]);

  const handleCellClick = (index: number) => {
      if (phase !== 'recall') return;
      
      let next = [...userPattern];
      if (next.includes(index)) {
          next = next.filter(i => i !== index);
          playSound('click');
      } else {
          if (next.length < config.fillCount) {
              next.push(index);
              playSound('pop');
          }
      }
      setUserPattern(next);

      if (next.length === config.fillCount) {
          const sortedPattern = [...pattern].sort();
          const sortedUser = [...next].sort();
          const isCorrect = sortedPattern.every((val, i) => val === sortedUser[i]);
          
          if (isCorrect) {
              setTimeout(() => onComplete(true), 500);
          } else {
              setTimeout(() => {
                  playSound('wrong');
                  onComplete(false);
              }, 1000);
          }
      }
  };

  return (
    <div className="h-full flex flex-col items-center justify-center p-4">
      <h3 className="text-2xl text-slate-500 font-bold mb-8">
          {phase === 'memorize' ? 'Memorize the pattern!' : `Recreate the pattern (${userPattern.length}/${config.fillCount})`}
      </h3>

      <div 
        className="grid gap-3 bg-slate-200 p-4 rounded-3xl shadow-inner border-4 border-slate-300"
        style={{ 
            gridTemplateColumns: `repeat(${config.gridSize}, minmax(0, 1fr))`,
            width: 'min(100%, 400px)',
            aspectRatio: '1'
        }}
      >
          {Array.from({ length: totalCells }).map((_, i) => {
              const isPattern = pattern.includes(i);
              const isUserSelected = userPattern.includes(i);
              
              // During memorize, show pattern. During recall, show user selection.
              const isActive = phase === 'memorize' ? isPattern : isUserSelected;
              
              return (
                  <button
                    key={i}
                    onClick={() => handleCellClick(i)}
                    disabled={phase === 'memorize'}
                    className="relative perspective-1000"
                  >
                      <div className={`
                          w-full h-full rounded-xl transition-all duration-500 transform-style-3d
                          ${isActive ? 'bg-blue-500 shadow-[0_4px_0_0_rgba(29,78,216,1)] scale-95' : 'bg-white shadow-sm hover:scale-105'}
                      `}>
                          {phase === 'recall' && isUserSelected && (
                              <div className="absolute inset-0 flex items-center justify-center">
                                  <div className="w-3 h-3 bg-white/30 rounded-full animate-ping" />
                              </div>
                          )}
                      </div>
                  </button>
              );
          })}
      </div>
    </div>
  );
};