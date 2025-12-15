import React, { useState, useEffect, useRef } from 'react';
import { playSound } from '../../lib/sounds';
import { useAgeStyling } from '../../hooks/useAgeStyling';

interface SpeedRaceGameProps {
  config: { 
      rounds: number; 
      type: 'color_text_match' | 'image_match' | 'math' | 'logic_size' | 'shadow_match' | 'reflex' | 'math_compare'; 
      items?: string[];
      complexity?: number;
  };
  onComplete: (success: boolean) => void;
}

export const SpeedRaceGame: React.FC<SpeedRaceGameProps> = ({ config, onComplete }) => {
  const styles = useAgeStyling();
  const [round, setRound] = useState(0);
  const [question, setQuestion] = useState<{prompt: string, options: string[], answer: string, isShadow?: boolean} | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const startTimeRef = useRef<number>(0);
  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    generateQuestion();
  }, [round]);

  const generateQuestion = () => {
      let q = { prompt: '', options: [] as string[], answer: '', isShadow: false };

      if (config.type === 'color_text_match') {
          const colors = config.items || ["#EF4444", "#3B82F6", "#10B981"];
          const answer = colors[Math.floor(Math.random() * colors.length)];
          q.prompt = answer; 
          q.answer = answer;
          const others = colors.filter(c => c !== answer).sort(() => 0.5 - Math.random()).slice(0, 2);
          q.options = [answer, ...others].sort(() => 0.5 - Math.random());

      } else if (config.type === 'image_match') {
          const items = config.items || ["🐶", "🐱"];
          const answer = items[Math.floor(Math.random() * items.length)];
          q.prompt = answer;
          q.answer = answer;
          const others = items.filter(i => i !== answer).sort(() => 0.5 - Math.random()).slice(0, 2);
          q.options = [answer, ...others].sort(() => 0.5 - Math.random());

      } else if (config.type === 'math') {
          const a = Math.floor(Math.random() * 5) + 1;
          const b = Math.floor(Math.random() * 5) + 1;
          q.prompt = `${a} + ${b} = ?`;
          q.answer = (a + b).toString();
          const wrong1 = (a + b + 1).toString();
          const wrong2 = Math.max(1, a + b - 1).toString();
          q.options = [q.answer, wrong1, wrong2].sort(() => 0.5 - Math.random());

      } else if (config.type === 'math_compare') {
          const a = Math.floor(Math.random() * 20) + 1;
          const b = Math.floor(Math.random() * 20) + 1;
          const valA = a === b ? a + 1 : a;
          q.prompt = "Which is bigger?";
          q.answer = Math.max(valA, b).toString();
          q.options = [valA.toString(), b.toString()];

      } else if (config.type === 'logic_size') {
          const pairs = [
              { big: "🐘", small: "🐭" },
              { big: "🐳", small: "🐟" },
              { big: "🌳", small: "🌱" },
              { big: "🚌", small: "🚲" }
          ];
          const pair = pairs[Math.floor(Math.random() * pairs.length)];
          q.prompt = "Which is bigger?";
          q.answer = pair.big;
          q.options = [pair.big, pair.small].sort(() => 0.5 - Math.random());

      } else if (config.type === 'shadow_match') {
          const items = config.items || ["🍎", "🚗"];
          const answer = items[Math.floor(Math.random() * items.length)];
          q.prompt = answer;
          q.isShadow = true;
          q.answer = answer;
          const others = items.filter(i => i !== answer).sort(() => 0.5 - Math.random()).slice(0, 2);
          q.options = [answer, ...others].sort(() => 0.5 - Math.random());
      
      } else if (config.type === 'reflex') {
          q.prompt = "Tap!";
          q.answer = "🔴";
          q.options = ["🔴"];
      }

      setQuestion(q);
      startTimeRef.current = Date.now();
      setIsLocked(false);
  };

  const handleAnswer = (ans: string) => {
      if (feedback || isLocked) return;

      const duration = Date.now() - startTimeRef.current;
      // Hesitation logic could be used to adjust difficulty later or log stats.
      // For now, we just enforce accuracy.

      if (ans === question?.answer) {
          playSound('click');
          setFeedback('correct');
          
          setTimeout(() => {
              if (round + 1 >= config.rounds) {
                  onComplete(true);
              } else {
                  setRound(r => r + 1);
                  setFeedback(null);
              }
          }, 500);
      } else {
          playSound('wrong');
          setFeedback('wrong');
          
          // Anti-Cheat: Lock out for 1s to prevent spamming
          setIsLocked(true);
          setTimeout(() => {
              setFeedback(null);
              setIsLocked(false);
          }, 1000);
      }
  };

  if (!question) return null;

  return (
    <div className="h-full flex flex-col items-center justify-center p-4">
      <div className={`w-full max-w-md bg-white ${styles.card} p-8 flex flex-col items-center shadow-xl border-slate-100`}>
          
          {/* Progress Dots */}
          <div className="flex gap-2 mb-8">
              {Array.from({length: config.rounds}).map((_, i) => (
                  <div key={i} className={`w-3 h-3 rounded-full ${i < round ? 'bg-green-500' : i === round ? 'bg-blue-500 animate-pulse' : 'bg-slate-200'}`} />
              ))}
          </div>

          <h2 className={`text-slate-500 mb-6 font-bold ${styles.title}`}>{question.prompt}</h2>

          {/* Prompt Visual */}
          {config.type === 'color_text_match' ? (
               <div className="w-32 h-32 rounded-full shadow-md mb-12" style={{ backgroundColor: question.answer }} />
          ) : config.type === 'shadow_match' ? (
               <div className="text-8xl mb-12 brightness-0 opacity-80 blur-[1px] transform scale-y-90 origin-bottom">{question.prompt}</div>
          ) : config.type === 'reflex' ? (
               <div className="h-32 mb-12 flex items-center justify-center text-slate-400 font-bold">Wait for it...</div>
          ) : (
               <div className="text-8xl mb-12">{question.prompt.includes('?') ? '❓' : ''}</div>
          )}

          {/* Options */}
          <div className="flex flex-wrap justify-center gap-4 w-full">
              {question.options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => handleAnswer(opt)}
                    disabled={isLocked}
                    className={`
                        min-w-[100px] h-24 px-6 rounded-2xl border-4 text-4xl font-bold flex items-center justify-center shadow-sm transition-all active:scale-95
                        ${feedback === 'wrong' ? 'border-red-200 bg-red-50' : 'border-slate-200 bg-slate-50 hover:bg-white hover:border-blue-300'}
                        ${isLocked ? 'opacity-50 cursor-not-allowed' : ''}
                    `}
                    style={{ backgroundColor: config.type === 'color_text_match' ? opt : undefined }}
                  >
                      {config.type !== 'color_text_match' && opt}
                  </button>
              ))}
          </div>
      </div>
    </div>
  );
};