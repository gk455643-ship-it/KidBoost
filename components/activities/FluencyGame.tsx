import React, { useState, useEffect } from 'react';
import { playSound } from '../../lib/sounds';
import { Zap } from 'lucide-react';

interface FluencyGameProps {
  config: { items: string[]; gridSize: number };
  onComplete: (success: boolean) => void;
}

export const FluencyGame: React.FC<FluencyGameProps> = ({ config, onComplete }) => {
  const [gridItems, setGridItems] = useState<string[]>([]);
  const [targetIndex, setTargetIndex] = useState<number>(0);
  const [count, setCount] = useState(0);
  const [combo, setCombo] = useState(0);
  const [shake, setShake] = useState(false);
  const [completed, setCompleted] = useState(false);

  // Target goal logic
  const GOAL = 10; 

  useEffect(() => {
    generateGrid();
  }, [config]);

  const generateGrid = () => {
    const items = config.items;
    let grid = [];
    while(grid.length < config.gridSize) {
        grid.push(...items);
    }
    grid = grid.slice(0, config.gridSize).sort(() => 0.5 - Math.random());
    setGridItems(grid);
    setTargetIndex(Math.floor(Math.random() * config.gridSize));
  };

  const nextRound = () => {
      // Find new target different from current location
      let newTarget = Math.floor(Math.random() * config.gridSize);
      while (newTarget === targetIndex && config.gridSize > 1) {
          newTarget = Math.floor(Math.random() * config.gridSize);
      }
      setTargetIndex(newTarget);
  };

  const handleTap = (index: number) => {
      if (completed) return;

      if (index === targetIndex) {
          playSound('pop');
          setCombo(c => c + 1);
          setCount(c => {
              const newCount = c + 1;
              if (newCount >= GOAL) {
                  setCompleted(true);
                  playSound('success');
                  setTimeout(() => onComplete(true), 1000);
              }
              return newCount;
          });
          nextRound();
      } else {
          playSound('wrong');
          setCombo(0);
          setShake(true);
          setTimeout(() => setShake(false), 500);
      }
  };

  return (
    <div className="h-full flex flex-col items-center justify-center p-4 overflow-hidden relative">
      
      {/* HUD */}
      <div className="absolute top-4 left-0 right-0 px-6 flex justify-between items-center">
          <div className="text-xl font-bold text-slate-400">
              {count} / {GOAL}
          </div>
          {combo > 1 && (
              <div className="flex items-center gap-1 text-orange-500 font-black text-2xl animate-bounce">
                  <Zap className="fill-current w-6 h-6" /> {combo}x
              </div>
          )}
      </div>

      <h3 className="text-2xl text-slate-500 font-bold mb-8">Tap highlighted item!</h3>
      
      <div className={`
          grid gap-4 w-full max-w-md aspect-square transition-transform duration-100
          ${shake ? 'translate-x-2' : ''}
      `}
        style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}
      >
          {gridItems.map((item, i) => {
              const isTarget = i === targetIndex;
              return (
                  <button
                    key={i}
                    onClick={() => handleTap(i)}
                    className={`
                        rounded-3xl text-4xl md:text-5xl font-bold flex items-center justify-center transition-all duration-150 shadow-sm
                        ${isTarget 
                            ? 'bg-yellow-300 border-b-8 border-yellow-500 scale-100 z-10' 
                            : 'bg-white border-2 border-slate-100 opacity-60 scale-95 hover:opacity-100'}
                    `}
                  >
                      {item}
                  </button>
              );
          })}
      </div>
      
      {/* Progress Bar */}
      <div className="w-full max-w-xs h-3 bg-slate-200 rounded-full mt-10 overflow-hidden">
          <div 
            className="h-full bg-green-500 transition-all duration-300 ease-out"
            style={{ width: `${(count / GOAL) * 100}%` }}
          />
      </div>
    </div>
  );
};