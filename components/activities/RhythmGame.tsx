import React, { useState, useEffect, useRef } from 'react';
import { playSound } from '../../lib/sounds';
import { Music, Play } from 'lucide-react';

interface RhythmGameProps {
  config: { pattern: number[]; tempo: number };
  onComplete: (success: boolean) => void;
}

export const RhythmGame: React.FC<RhythmGameProps> = ({ config, onComplete }) => {
  const [phase, setPhase] = useState<'listen' | 'repeat'>('listen');
  const [activeBeat, setActiveBeat] = useState(-1);
  const [userTaps, setUserTaps] = useState<number[]>([]);
  const [roundsPlayed, setRoundsPlayed] = useState(0);
  
  const MAX_ROUNDS = 3;

  useEffect(() => {
      if (phase === 'listen') {
          playPattern();
      }
  }, [phase, roundsPlayed]);

  const playPattern = () => {
      let step = 0;
      setActiveBeat(-1);
      setUserTaps([]);

      const interval = setInterval(() => {
          if (step >= config.pattern.length) {
              clearInterval(interval);
              setActiveBeat(-1);
              setTimeout(() => setPhase('repeat'), 500);
              return;
          }

          setActiveBeat(step);
          if (config.pattern[step] === 1) {
              playSound('clap');
          }
          step++;
      }, config.tempo);

      return () => clearInterval(interval);
  };

  const handleTap = () => {
      if (phase !== 'repeat') return;
      
      const newTaps = [...userTaps, 1];
      setUserTaps(newTaps);
      playSound('clap');

      // Check simple count match
      const expectedTaps = config.pattern.filter(p => p === 1).length;
      if (newTaps.length >= expectedTaps) {
          setTimeout(() => {
              if (newTaps.length === expectedTaps) {
                  playSound('correct');
                  if (roundsPlayed + 1 >= MAX_ROUNDS) {
                      onComplete(true);
                  } else {
                      setRoundsPlayed(r => r + 1);
                      setPhase('listen');
                  }
              } else {
                  playSound('wrong');
                  setPhase('listen');
              }
          }, 500);
      }
  };

  return (
    <div className="h-full flex flex-col items-center justify-center p-4">
      <div className="mb-8 flex items-center gap-2">
           <span className={`h-4 w-4 rounded-full ${phase === 'listen' ? 'bg-blue-500 animate-pulse' : 'bg-slate-200'}`} />
           <h3 className="text-3xl font-bold text-slate-600">
               {phase === 'listen' ? 'Listen & Watch!' : 'Tap the Beat!'}
           </h3>
      </div>

      <div className="flex gap-4 mb-12">
          {config.pattern.map((beat, i) => (
              <div 
                key={i}
                className={`w-16 h-16 rounded-full border-4 transition-all duration-150 flex items-center justify-center
                    ${phase === 'listen' && activeBeat === i 
                        ? (beat === 1 ? 'bg-pink-500 border-pink-600 scale-125 shadow-xl' : 'bg-slate-200 scale-90') 
                        : 'bg-white border-slate-200'}
                `}
              >
                  {beat === 1 && phase === 'listen' && activeBeat === i && <Music className="text-white w-8 h-8" />}
              </div>
          ))}
      </div>

      {phase === 'repeat' ? (
          <button 
            onMouseDown={handleTap}
            className="w-48 h-48 rounded-full bg-brand-500 shadow-[0px_10px_0px_0px_rgba(194,65,12,1)] active:shadow-none active:translate-y-[10px] transition-all flex items-center justify-center animate-bounce-slow"
          >
              <div className="text-white text-center">
                  <Music className="w-20 h-20 mx-auto" />
                  <span className="font-bold uppercase tracking-widest mt-2 block">TAP</span>
              </div>
          </button>
      ) : (
          <div className="w-48 h-48 flex items-center justify-center text-slate-300">
               <div className="text-6xl animate-pulse">👂</div>
          </div>
      )}
      
      <div className="mt-8 flex gap-2">
          {Array.from({length: MAX_ROUNDS}).map((_, i) => (
              <div key={i} className={`w-3 h-3 rounded-full ${i < roundsPlayed ? 'bg-green-500' : 'bg-slate-200'}`} />
          ))}
      </div>
    </div>
  );
};