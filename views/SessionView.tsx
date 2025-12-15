import React, { useEffect, useState } from 'react';
import { useStore } from '../store';
import { ActivityRenderer } from '../components/ActivityRenderer';
import { X, Moon, Clock, Baby } from 'lucide-react';
import { ParentGate } from '../components/ParentGate';
import { SafetyTimer } from '../components/SafetyTimer';
import { BrainBreakModal } from '../components/BrainBreakModal';
import { SessionReflection } from '../components/SessionReflection';
import { isBedtime } from '../lib/safety';
import { playSound } from '../lib/sounds';
import confetti from 'canvas-confetti';

export const SessionView: React.FC = () => {
  const currentChild = useStore(state => state.currentChild);
  const session = useStore(state => state.session);
  const quitSession = useStore(state => state.quitSession);
  const toggleParentMode = useStore(state => state.toggleParentMode);
  const setChild = useStore(state => state.setChild);

  const [showGate, setShowGate] = useState(false);
  
  // Safety States
  const [bedtimeLocked, setBedtimeLocked] = useState(false);
  const [dailyLimitLocked, setDailyLimitLocked] = useState(false);
  const [coPlayLocked, setCoPlayLocked] = useState(false);
  const [showBrainBreak, setShowBrainBreak] = useState(false);

  // Initial Checks
  useEffect(() => {
      if (currentChild) {
          // Check Bedtime
          if (isBedtime(currentChild.bedtimeStart, currentChild.bedtimeEnd)) {
              setBedtimeLocked(true);
              return;
          }
          // Check Daily Limit
          if (currentChild.todayUsageMinutes >= currentChild.dailyLimitMinutes) {
              setDailyLimitLocked(true);
              return;
          }
          // Co-Play check
          if (currentChild.coPlayRequired) {
              setCoPlayLocked(true);
          }
      }
  }, [currentChild]);

  // Effect for Session Completion (Summary Confetti)
  const isSessionComplete = session.currentActivityIndex >= session.activities.length;
  
  useEffect(() => {
    if (isSessionComplete) {
        playSound('fanfare');
        const duration = 3000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

        const interval: any = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
            return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
        }, 250);
        return () => clearInterval(interval);
    }
  }, [isSessionComplete]);


  const handleQuit = () => {
    setShowGate(true);
  };

  const onGateUnlock = () => {
    quitSession(); // Sets isActive: false
    setShowGate(false);
    setCoPlayLocked(false);
  };

  const onParentExit = () => {
     quitSession();
     setChild(null);
     toggleParentMode(true);
     setShowGate(false);
  };
  
  const handleCoPlayUnlock = () => {
      setCoPlayLocked(false);
  };

  // --- RENDER BLOCKERS ---

  if (bedtimeLocked) {
      return (
          <div className="h-full flex flex-col items-center justify-center bg-slate-900 text-white p-8 text-center animate-fadeIn">
              <Moon className="w-24 h-24 text-blue-300 mb-6 animate-pulse" />
              <h1 className="text-4xl font-bold mb-4">It's Bedtime!</h1>
              <p className="text-xl text-blue-200 mb-8">Sleep tight, see you tomorrow!</p>
              <button onClick={onParentExit} className="px-6 py-3 bg-white/10 rounded-xl hover:bg-white/20 transition-colors">Parent Unlock</button>
          </div>
      );
  }

  if (dailyLimitLocked) {
      return (
          <div className="h-full flex flex-col items-center justify-center bg-orange-500 text-white p-8 text-center animate-fadeIn">
              <Clock className="w-24 h-24 text-orange-200 mb-6" />
              <h1 className="text-4xl font-bold mb-4">Time's Up!</h1>
              <p className="text-xl text-orange-100 mb-8">You've played enough for today.</p>
              <button onClick={onParentExit} className="px-6 py-3 bg-white/20 rounded-xl hover:bg-white/30 transition-colors">Parent Unlock</button>
          </div>
      );
  }

  if (coPlayLocked) {
      return (
          <div className="h-full bg-brand-50 relative">
              <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center animate-fadeIn">
                 <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-md mb-6">
                     <Baby className="w-10 h-10 text-brand-500" />
                 </div>
                 <h1 className="text-3xl font-bold text-slate-800 mb-2">Co-Play Required</h1>
                 <p className="text-slate-500 mb-8 max-w-xs">Because {currentChild?.name} is under 4, a parent must be present to start.</p>
                 <ParentGate onUnlock={handleCoPlayUnlock} onCancel={onParentExit} />
              </div>
          </div>
      );
  }

  if (!session.isActive || session.activities.length === 0) {
    return <div className="h-full flex items-center justify-center text-slate-400">Loading Session...</div>;
  }

  // --- ACTIVE SESSION UI ---
  const currentActivity = session.activities[session.currentActivityIndex];
  const progressPercent = Math.min(100, ((session.currentActivityIndex) / session.activities.length) * 100);

  // SUMMARY SCREEN
  if (isSessionComplete) {
      return (
          <SessionReflection 
            childName={currentChild?.name || 'Kid'}
            earnedStars={session.earnedStars || 0}
            streak={currentChild?.streak || 0}
            onComplete={quitSession}
          />
      );
  }

  // ACTIVITY RENDERER
  return (
    <div className="h-full flex flex-col bg-white">
      <SafetyTimer 
        onBedtimeLimit={() => setBedtimeLocked(true)} 
        onDailyLimit={() => setDailyLimitLocked(true)} 
        onBrainBreak={() => setShowBrainBreak(true)}
      />

      {/* Top Bar */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-100 bg-slate-50/50">
         <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-100 rounded-full flex items-center justify-center text-xl shadow-inner border border-brand-200">
               {currentChild?.avatar}
            </div>
            <div className="flex flex-col">
                <div className="flex items-center gap-2 mb-1">
                    <div className="h-2 w-24 md:w-32 bg-slate-200 rounded-full overflow-hidden">
                       <div className="h-full bg-brand-500 transition-all duration-500" style={{ width: `${progressPercent}%` }} />
                    </div>
                    <span className="text-xs font-bold text-slate-400">
                        {session.currentActivityIndex + 1} / {session.activities.length}
                    </span>
                </div>
            </div>
         </div>
         
         <div className="flex items-center gap-4">
             <div className="hidden md:flex items-center gap-1 bg-yellow-50 px-3 py-1 rounded-full border border-yellow-100">
                 <span className="text-yellow-500">⭐</span>
                 <span className="font-bold text-slate-700">{session.earnedStars}</span>
             </div>
             <button onClick={handleQuit} className="p-2 text-slate-400 hover:text-red-500 transition-colors">
                <X className="w-8 h-8" />
             </button>
         </div>
      </div>

      {/* Main Area */}
      <div className="flex-1 overflow-hidden relative">
         <ActivityRenderer activity={currentActivity} />
      </div>

      {showGate && (
        <ParentGate onUnlock={onGateUnlock} onCancel={() => setShowGate(false)} />
      )}

      {showBrainBreak && (
          <BrainBreakModal onComplete={() => setShowBrainBreak(false)} />
      )}
    </div>
  );
};