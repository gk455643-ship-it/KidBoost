import React, { useState, useEffect } from 'react';
import { playSound } from '../../lib/sounds';
import { RefreshCw, Timer } from 'lucide-react';

interface DotConnectGameProps {
  config: { gridSize: number; pathLength: number };
  onComplete: (success: boolean) => void;
}

export const DotConnectGame: React.FC<DotConnectGameProps> = ({ config, onComplete }) => {
  const [path, setPath] = useState<number[]>([]);
  const [userPath, setUserPath] = useState<number[]>([]);
  const [phase, setPhase] = useState<'memorize' | 'recall'>('memorize');
  const [timeLeft, setTimeLeft] = useState(4);
  const MEMORIZE_TIME = 4;

  useEffect(() => {
    // Generate random continuous path
    const generatePath = () => {
        const size = config.gridSize;
        const p: number[] = [];
        let curr = Math.floor(Math.random() * (size * size));
        p.push(curr);

        while (p.length < config.pathLength) {
            // Find neighbors
            const x = curr % size;
            const y = Math.floor(curr / size);
            const candidates = [];

            if (x > 0) candidates.push(curr - 1);
            if (x < size - 1) candidates.push(curr + 1);
            if (y > 0) candidates.push(curr - size);
            if (y < size - 1) candidates.push(curr + size);

            // Filter visited
            const valid = candidates.filter(c => !p.includes(c));
            
            if (valid.length === 0) break;
            
            curr = valid[Math.floor(Math.random() * valid.length)];
            p.push(curr);
        }
        return p;
    };

    let newPath: number[] = [];
    while (newPath.length < config.pathLength) {
        newPath = generatePath();
    }
    setPath(newPath);
  }, [config]);

  // Timer
  useEffect(() => {
      if (phase === 'memorize') {
          const interval = setInterval(() => {
              setTimeLeft(prev => {
                  if (prev <= 0) {
                      clearInterval(interval);
                      setPhase('recall');
                      return 0;
                  }
                  return prev - 0.1;
              });
          }, 100);
          return () => clearInterval(interval);
      }
  }, [phase]);

  const handleDotClick = (index: number) => {
      if (phase !== 'recall') return;

      // Start or Continue
      if (userPath.length === 0) {
          setUserPath([index]);
          playSound('pop');
      } else {
          // Allow clicking any neighbor for better UX, or just next
          // For simplicity, we just add it. Validation happens at end.
          if (!userPath.includes(index)) {
              setUserPath([...userPath, index]);
              playSound('click');

              // Auto-check if length reached
              if (userPath.length + 1 === config.pathLength) {
                 const finalPath = [...userPath, index];
                 // Check if it matches exactly
                 const isCorrect = finalPath.every((val, i) => val === path[i]);
                 // Also check reverse path? Usually path direction matters in these games for memory.
                 // We stick to exact order.
                 
                 if (isCorrect) {
                     setTimeout(() => { playSound('correct'); onComplete(true); }, 500);
                 } else {
                     setTimeout(() => { playSound('wrong'); onComplete(false); }, 500);
                 }
              }
          }
      }
  };

  const renderLines = (p: number[], color: string, animated = false) => {
      if (p.length < 2) return null;
      const lines = [];
      const size = config.gridSize;
      const gap = 100 / (size - 1);

      for (let i = 0; i < p.length - 1; i++) {
          const from = p[i];
          const to = p[i+1];
          const x1 = (from % size) * gap;
          const y1 = Math.floor(from / size) * gap;
          const x2 = (to % size) * gap;
          const y2 = Math.floor(to / size) * gap;

          lines.push(
              <line 
                key={i}
                x1={`${x1}%`} y1={`${y1}%`} x2={`${x2}%`} y2={`${y2}%`}
                stroke={color}
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={animated ? "100" : "none"}
                className={animated ? "animate-drawPath" : ""}
                style={{ animationDelay: `${i * 0.2}s` }}
              />
          );
      }
      return lines;
  };

  const size = config.gridSize;
  const gap = 100 / (size - 1);

  return (
    <div className="h-full flex flex-col items-center justify-center p-4">
       <div className="mb-8 text-center">
            <h3 className="text-2xl text-slate-500 font-bold mb-2">
                {phase === 'memorize' ? 'Trace the path!' : 'Draw the path!'}
            </h3>
            {phase === 'memorize' && (
                 <div className="w-48 h-2 bg-slate-200 rounded-full mx-auto overflow-hidden">
                     <div className="h-full bg-blue-500 transition-all duration-100 ease-linear" style={{ width: `${(timeLeft / MEMORIZE_TIME) * 100}%` }} />
                 </div>
            )}
       </div>

       <div className="w-64 h-64 md:w-80 md:h-80 relative">
            {/* SVG Overlay for Lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible">
                {phase === 'memorize' && renderLines(path, '#3B82F6', true)}
                {phase === 'recall' && renderLines(userPath, '#F97316')}
            </svg>

            {/* Dots Grid */}
            {Array.from({ length: size * size }).map((_, i) => {
                const x = (i % size) * gap;
                const y = Math.floor(i / size) * gap;
                const isVisited = userPath.includes(i);
                const isPath = phase === 'memorize' && path.includes(i);
                
                return (
                    <div 
                        key={i}
                        onClick={() => handleDotClick(i)}
                        className={`absolute w-8 h-8 rounded-full transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 z-10 border-4
                            ${phase === 'recall' ? 'cursor-pointer hover:scale-110 active:scale-90' : ''}
                            ${isPath ? 'bg-blue-500 border-blue-200 scale-110 shadow-lg' : 
                              (phase === 'recall' && isVisited) ? 'bg-orange-500 border-orange-200 scale-110 shadow-lg' : 'bg-slate-200 border-slate-300'}
                        `}
                        style={{ left: `${x}%`, top: `${y}%` }}
                    />
                );
            })}
       </div>
       
       {phase === 'recall' && (
           <button 
                onClick={() => setUserPath([])} 
                className="mt-12 text-slate-400 flex items-center gap-2 hover:text-slate-600 px-4 py-2 rounded-lg hover:bg-slate-100 transition-colors"
            >
               <RefreshCw className="w-4 h-4" /> Reset Path
           </button>
       )}
    </div>
  );
};