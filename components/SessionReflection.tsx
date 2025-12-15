import React, { useState } from 'react';
import { playSound } from '../lib/sounds';
import { CheckCircle } from 'lucide-react';
import { TeacherAvatar } from './TeacherAvatar';

interface SessionReflectionProps {
  childName: string;
  earnedStars: number;
  streak: number;
  onComplete: () => void;
}

export const SessionReflection: React.FC<SessionReflectionProps> = ({ 
    childName, earnedStars, streak, onComplete 
}) => {
  const [step, setStep] = useState<'mood' | 'likes' | 'summary'>('mood');
  const [likes, setLikes] = useState<string[]>([]);

  const handleMoodSelect = (_mood: string) => {
      playSound('pop');
      setTimeout(() => setStep('likes'), 500);
  };

  const toggleLike = (id: string) => {
      playSound('click');
      setLikes(prev => prev.includes(id) ? prev.filter(l => l !== id) : [...prev, id]);
  };

  const finishLikes = () => {
      playSound('success');
      setStep('summary');
  };

  if (step === 'mood') {
      return (
          <div className="h-full flex flex-col items-center justify-center p-4 bg-brand-50 animate-fadeIn">
              <h2 className="text-3xl font-bold text-slate-700 mb-8">How was it, {childName}?</h2>
              <div className="grid grid-cols-2 gap-6 w-full max-w-sm">
                  {['🤩', '🙂', '😐', '😤'].map((emoji, i) => (
                      <button 
                        key={i}
                        onClick={() => handleMoodSelect(emoji)}
                        className="aspect-square bg-white rounded-3xl text-7xl shadow-lg border-4 border-white hover:border-brand-300 hover:scale-105 transition-all flex items-center justify-center"
                      >
                          {emoji}
                      </button>
                  ))}
              </div>
          </div>
      );
  }

  if (step === 'likes') {
      return (
          <div className="h-full flex flex-col items-center justify-center p-4 bg-sky-50 animate-fadeIn">
              <h2 className="text-3xl font-bold text-slate-700 mb-2">What did you like?</h2>
              <p className="text-slate-400 mb-8">Tap all the fun ones!</p>
              
              <div className="grid grid-cols-2 gap-4 w-full max-w-sm mb-8">
                  {[
                      { id: 'memory', icon: '🧠', label: 'Memory' },
                      { id: 'speed', icon: '⚡', label: 'Speed' },
                      { id: 'art', icon: '🎨', label: 'Art' },
                      { id: 'math', icon: '🔢', label: 'Math' }
                  ].map((item) => {
                      const isActive = likes.includes(item.id);
                      return (
                          <button 
                            key={item.id}
                            onClick={() => toggleLike(item.id)}
                            className={`p-4 rounded-2xl border-4 transition-all flex flex-col items-center gap-2
                                ${isActive ? 'bg-white border-green-500 shadow-md scale-105' : 'bg-white/50 border-transparent text-slate-400 hover:bg-white'}
                            `}
                          >
                              <div className="text-5xl">{item.icon}</div>
                              <span className="font-bold">{item.label}</span>
                          </button>
                      );
                  })}
              </div>

              <button 
                onClick={finishLikes}
                className="w-full max-w-xs py-4 bg-green-500 text-white rounded-2xl font-bold text-xl shadow-lg active:scale-95 transition-all"
              >
                  Next
              </button>
          </div>
      );
  }

  // Summary
  return (
        <div className="h-full flex flex-col items-center justify-center p-8 text-center animate-fadeIn bg-white relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <div className="absolute top-20 left-10 text-6xl animate-bounce-slow opacity-50">🌟</div>
                <div className="absolute bottom-20 right-10 text-6xl animate-bounce-slow opacity-50 delay-700">🎉</div>
            </div>

            <TeacherAvatar emotion="excited" size="lg" className="mb-8 scale-125" />
            <h1 className="text-4xl md:text-5xl font-black text-brand-600 mb-2">Session Complete!</h1>
            
            <div className="grid grid-cols-2 gap-4 w-full max-w-md mb-12 mt-8">
                <div className="bg-yellow-50 p-6 rounded-3xl shadow-sm border-2 border-yellow-100 flex flex-col items-center transform transition-transform hover:scale-105">
                     <div className="text-5xl mb-2">⭐</div>
                     <div className="text-3xl font-black text-slate-800">+{earnedStars}</div>
                     <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Stars Earned</div>
                </div>
                <div className="bg-orange-50 p-6 rounded-3xl shadow-sm border-2 border-orange-100 flex flex-col items-center transform transition-transform hover:scale-105">
                     <div className="text-5xl mb-2">🔥</div>
                     <div className="text-3xl font-black text-slate-800">{streak}</div>
                     <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Day Streak</div>
                </div>
            </div>
            
            <button 
                onClick={onComplete} 
                className="w-full max-w-sm py-5 bg-brand-600 hover:bg-brand-700 text-white rounded-2xl font-bold text-2xl shadow-[0px_6px_0px_0px_rgba(194,65,12,1)] active:translate-y-[6px] active:shadow-none transition-all flex items-center justify-center gap-3"
            >
                <CheckCircle className="w-8 h-8" /> Finish
            </button>
        </div>
  );
};