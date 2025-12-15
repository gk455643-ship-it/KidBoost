import React, { useState, useEffect } from 'react';
import { playSound } from '../../lib/sounds';
import { Check, Camera } from 'lucide-react';

interface SnapshotGameProps {
  config: { gridSize: number; items: string[] };
  onComplete: (success: boolean) => void;
}

export const SnapshotGame: React.FC<SnapshotGameProps> = ({ config, onComplete }) => {
  const [placements, setPlacements] = useState<Record<number, string>>({}); 
  const [userPlacements, setUserPlacements] = useState<Record<number, string>>({});
  const [phase, setPhase] = useState<'memorize' | 'recall' | 'feedback'>('memorize');
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(5);
  const MEMORIZE_TIME = 5;

  const totalCells = config.gridSize * config.gridSize;

  useEffect(() => {
    // Randomly place items
    const indices = Array.from({ length: totalCells }, (_, i) => i).sort(() => 0.5 - Math.random());
    const newPlacements: Record<number, string> = {};
    
    config.items.forEach((item, i) => {
        if (i < indices.length) {
            newPlacements[indices[i]] = item;
        }
    });
    setPlacements(newPlacements);
  }, [config, totalCells]);

  // Timer
  useEffect(() => {
      if (phase === 'memorize') {
          const interval = setInterval(() => {
              setTimeLeft(prev => {
                  if (prev <= 0) {
                      clearInterval(interval);
                      setPhase('recall');
                      playSound('pop');
                      return 0;
                  }
                  return prev - 0.1;
              });
          }, 100);
          return () => clearInterval(interval);
      }
  }, [phase]);

  const handleCellClick = (index: number) => {
      if (phase !== 'recall' || !selectedItem) return;

      setUserPlacements(prev => ({ ...prev, [index]: selectedItem }));
      playSound('pop');
      setSelectedItem(null); 
  };

  const checkResult = () => {
      setPhase('feedback');
      
      // Strict match check
      let correct = true;
      Object.entries(placements).forEach(([idx, item]) => {
          if (userPlacements[parseInt(idx)] !== item) correct = false;
      });
      const userCount = Object.keys(userPlacements).length;
      const targetCount = Object.keys(placements).length;
      
      if (correct && userCount === targetCount) {
          playSound('correct');
          setTimeout(() => onComplete(true), 1500);
      } else {
          playSound('wrong');
          setTimeout(() => onComplete(false), 2500);
      }
  };

  return (
    <div className="h-full flex flex-col items-center justify-center p-4">
      <div className="text-center mb-6">
          <h3 className="text-2xl text-slate-500 font-bold mb-2">
              {phase === 'memorize' ? 'Photograph the scene!' : phase === 'recall' ? 'Rebuild the scene' : 'Checking...'}
          </h3>
          {phase === 'memorize' && (
             <div className="w-full max-w-xs mx-auto flex items-center gap-2 text-brand-500">
                 <Camera className="w-5 h-5 animate-pulse" />
                 <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                     <div className="h-full bg-brand-500 transition-all duration-100 ease-linear" style={{ width: `${(timeLeft / MEMORIZE_TIME) * 100}%` }} />
                 </div>
             </div>
          )}
      </div>

      {/* GRID */}
      <div 
         className={`
            bg-slate-100 p-4 rounded-3xl grid gap-4 mb-8 shadow-inner transition-all duration-500
            ${phase === 'memorize' ? 'scale-105 shadow-xl border-4 border-brand-200' : 'scale-100 border-4 border-transparent'}
         `}
         style={{ 
             gridTemplateColumns: `repeat(${config.gridSize}, minmax(0, 1fr))`,
             width: 'min(100%, 400px)',
             aspectRatio: '1'
         }}
      >
          {Array.from({ length: totalCells }).map((_, i) => {
              const content = phase === 'memorize' ? placements[i] : userPlacements[i];
              const isCorrect = phase === 'feedback' && placements[i] === userPlacements[i];
              const isMissed = phase === 'feedback' && placements[i] && !userPlacements[i];
              const isWrong = phase === 'feedback' && userPlacements[i] && placements[i] !== userPlacements[i];

              return (
                  <button
                    key={i}
                    onClick={() => handleCellClick(i)}
                    className={`
                        rounded-2xl flex items-center justify-center text-4xl md:text-5xl shadow-sm border-2 transition-all duration-300
                        ${phase === 'recall' ? 'hover:border-blue-300 bg-white' : 'bg-white'}
                        ${isCorrect ? 'bg-green-100 border-green-500 scale-110 z-10' : ''}
                        ${isWrong ? 'bg-red-100 border-red-500' : ''}
                        ${isMissed ? 'bg-yellow-50 border-yellow-300 border-dashed' : ''}
                    `}
                  >
                      {phase === 'feedback' && isMissed ? <span className="opacity-50 grayscale">{placements[i]}</span> : content}
                  </button>
              );
          })}
      </div>

      {/* RECALL CONTROLS */}
      {phase === 'recall' && (
          <div className="flex flex-col items-center gap-6 animate-fadeIn w-full max-w-md">
              <div className="flex flex-wrap justify-center gap-3 bg-white p-4 rounded-2xl shadow-sm border border-slate-100 w-full">
                  {config.items.map(item => {
                      const isPlaced = Object.values(userPlacements).includes(item);
                      return (
                        <button
                            key={item}
                            onClick={() => { setSelectedItem(item); playSound('click'); }}
                            disabled={isPlaced}
                            className={`w-16 h-16 text-3xl flex items-center justify-center rounded-xl border-2 transition-all
                                ${selectedItem === item ? 'bg-blue-100 border-blue-500 scale-110 shadow-md' : 'bg-slate-50 border-slate-100'}
                                ${isPlaced ? 'opacity-30 grayscale cursor-not-allowed' : 'hover:scale-105'}
                            `}
                        >
                            {item}
                        </button>
                      );
                  })}
              </div>

              <button 
                onClick={checkResult}
                className="w-full py-4 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold shadow-[0px_6px_0px_0px_rgba(21,128,61,1)] active:translate-y-[6px] active:shadow-none flex items-center justify-center gap-2 transition-all"
              >
                  Check <Check />
              </button>
          </div>
      )}
    </div>
  );
};