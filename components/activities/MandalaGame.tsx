import React, { useState, useEffect } from 'react';
import { playSound } from '../../lib/sounds';
import { RefreshCw, Check, Timer } from 'lucide-react';

interface MandalaGameProps {
  config: { segments: number; colors: string[] };
  onComplete: (success: boolean) => void;
}

export const MandalaGame: React.FC<MandalaGameProps> = ({ config, onComplete }) => {
  const [targetColors, setTargetColors] = useState<string[]>([]);
  const [userColors, setUserColors] = useState<string[]>([]);
  const [phase, setPhase] = useState<'memorize' | 'recall' | 'feedback'>('memorize');
  const [selectedColor, setSelectedColor] = useState<string>(config.colors[0]);
  const [timeLeft, setTimeLeft] = useState(5);
  const MEMORIZE_TIME = 5;

  useEffect(() => {
    // Generate random pattern
    const pattern = Array.from({ length: config.segments }).map(() => 
        config.colors[Math.floor(Math.random() * config.colors.length)]
    );
    setTargetColors(pattern);
    setUserColors(new Array(config.segments).fill('#FFFFFF')); // White/Empty initially
  }, [config]);

  // Timer Logic
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

  const handleSegmentClick = (index: number) => {
      if (phase !== 'recall') return;
      
      const newColors = [...userColors];
      newColors[index] = selectedColor;
      setUserColors(newColors);
      playSound('click');
  };

  const checkResult = () => {
      setPhase('feedback');
      const isCorrect = targetColors.every((c, i) => c === userColors[i]);
      
      if (isCorrect) {
          playSound('correct');
          setTimeout(() => onComplete(true), 1500);
      } else {
          playSound('wrong');
          setTimeout(() => onComplete(false), 2000);
      }
  };

  // SVG Calculation
  const radius = 100;
  const center = 100;
  
  const getSegmentPath = (index: number, total: number) => {
      const startAngle = (index * 360) / total;
      const endAngle = ((index + 1) * 360) / total;
      
      // Convert to radians
      const startRad = (startAngle - 90) * (Math.PI / 180);
      const endRad = (endAngle - 90) * (Math.PI / 180);

      const x1 = center + radius * Math.cos(startRad);
      const y1 = center + radius * Math.sin(startRad);
      const x2 = center + radius * Math.cos(endRad);
      const y2 = center + radius * Math.sin(endRad);

      return `M ${center} ${center} L ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2} Z`;
  };

  return (
    <div className="h-full flex flex-col items-center justify-center p-4 bg-slate-50">
      <div className="mb-8 text-center">
         <h3 className="text-2xl text-slate-500 font-bold mb-2">
            {phase === 'memorize' ? 'Memorize the Colors!' : phase === 'recall' ? 'Color the Pattern' : 'Checking...'}
         </h3>
         
         {phase === 'memorize' && (
             <div className="w-64 h-2 bg-slate-200 rounded-full overflow-hidden mx-auto mt-4">
                 <div 
                    className="h-full bg-brand-500 transition-all duration-100 ease-linear" 
                    style={{ width: `${(timeLeft / MEMORIZE_TIME) * 100}%` }}
                 />
             </div>
         )}
      </div>

      <div className={`relative w-64 h-64 md:w-80 md:h-80 mb-8 transition-all duration-500 ${phase === 'memorize' ? 'scale-110' : 'scale-100'}`}>
          <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-xl transform transition-transform hover:scale-105">
              {Array.from({ length: config.segments }).map((_, i) => {
                  const fillColor = phase === 'memorize' ? targetColors[i] : userColors[i];
                  const isWrong = phase === 'feedback' && userColors[i] !== targetColors[i];
                  const showCorrect = phase === 'feedback';

                  return (
                    <g key={i}>
                      <path
                        d={getSegmentPath(i, config.segments)}
                        fill={showCorrect ? targetColors[i] : fillColor}
                        stroke={isWrong ? '#EF4444' : '#334155'}
                        strokeWidth={isWrong ? "4" : "2"}
                        onClick={() => handleSegmentClick(i)}
                        className={`transition-all duration-300 ${phase === 'recall' ? 'cursor-pointer hover:opacity-80' : ''}`}
                        style={{ opacity: showCorrect && isWrong ? 0.5 : 1 }}
                      />
                      {isWrong && (
                          <text x={center} y={center} textAnchor="middle" dy="5" fontSize="10" fill="white">❌</text>
                      )}
                    </g>
                  );
              })}
              {/* Inner Circle */}
              <circle cx="100" cy="100" r="15" fill="white" stroke="#334155" strokeWidth="2" />
          </svg>
      </div>

      {phase === 'recall' && (
          <div className="flex flex-col items-center gap-6 animate-fadeIn w-full max-w-md">
              {/* Palette */}
              <div className="flex justify-center gap-4 p-3 bg-white rounded-2xl shadow-sm border border-slate-100 w-full">
                  {config.colors.map(c => (
                      <button
                        key={c}
                        onClick={() => { setSelectedColor(c); playSound('click'); }}
                        className={`w-12 h-12 rounded-full border-4 shadow-sm transition-transform ${selectedColor === c ? 'scale-110 border-slate-800 ring-2 ring-slate-200 z-10' : 'scale-100 border-white'}`}
                        style={{ backgroundColor: c }}
                      />
                  ))}
              </div>

              <button 
                onClick={checkResult}
                className="w-full py-4 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold text-xl shadow-[0px_6px_0px_0px_rgba(21,128,61,1)] active:translate-y-[6px] active:shadow-none flex items-center justify-center gap-2 transition-all"
              >
                  Done <Check />
              </button>
          </div>
      )}
      
      {phase === 'feedback' && (
          <div className="text-xl font-bold text-slate-400 animate-pulse">
              Comparing...
          </div>
      )}
    </div>
  );
};