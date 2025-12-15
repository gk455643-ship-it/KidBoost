import React, { useState, useEffect } from 'react';
import { useStore } from '../store';
import { AgeBand } from '../types';
import { useTranslation } from '../lib/i18n';
import { TeacherAvatar } from '../components/TeacherAvatar';
import { ParentGate } from '../components/ParentGate';
import { isBedtime, getTodayDateString } from '../lib/safety';
import { Play, Lock, Star, Clock, Trophy, Map } from 'lucide-react';
import { playSound } from '../lib/sounds';
import { TrophyCabinet } from '../components/TrophyCabinet';

export const KidHomeView: React.FC = () => {
  const currentChild = useStore(state => state.currentChild);
  const startSession = useStore(state => state.startSession);
  const toggleParentMode = useStore(state => state.toggleParentMode);
  const setChild = useStore(state => state.setChild);
  const { t } = useTranslation();

  const [showGate, setShowGate] = useState(false);
  const [showTrophies, setShowTrophies] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [lockReason, setLockReason] = useState<'bedtime' | 'limit' | null>(null);

  useEffect(() => {
    if (!currentChild) return;
    
    // Check Bedtime
    if (isBedtime(currentChild.bedtimeStart, currentChild.bedtimeEnd)) {
        setIsLocked(true);
        setLockReason('bedtime');
        return;
    }

    // Check Daily Limit
    const today = getTodayDateString();
    const usage = currentChild.lastUsageDate === today ? currentChild.todayUsageMinutes : 0;
    if (usage >= currentChild.dailyLimitMinutes) {
        setIsLocked(true);
        setLockReason('limit');
        return;
    }
    
    setIsLocked(false);
    setLockReason(null);
  }, [currentChild]);

  const handleStart = () => {
    playSound('pop');
    startSession();
  };

  const handleParentExit = () => {
      setShowGate(true);
  };

  const onGateUnlock = () => {
      setChild(null);
      toggleParentMode(true);
  };

  if (!currentChild) return null;

  // --- AGE ADAPTED RENDERS ---

  // 1. TODDLER (2-3): Huge Icons, Minimal Text, Instant Action
  if (currentChild.ageBand === AgeBand.TODDLER) {
      return (
          <div className="h-full bg-sky-50 flex flex-col items-center justify-center relative overflow-hidden">
              {/* Background Shapes */}
              <div className="absolute top-10 left-10 w-32 h-32 bg-yellow-200 rounded-full blur-xl opacity-50" />
              <div className="absolute bottom-10 right-10 w-48 h-48 bg-pink-200 rounded-full blur-xl opacity-50" />

              <button 
                onClick={handleParentExit} 
                className="absolute top-6 right-6 p-4 bg-white/50 rounded-full text-slate-400"
              >
                  <Lock className="w-8 h-8" />
              </button>

              <div className="z-10 flex flex-col items-center gap-8 animate-fadeIn">
                  <TeacherAvatar emotion="excited" size="lg" />
                  
                  <div className="text-center">
                      <h1 className="text-5xl font-black text-slate-700 mb-2">{t('hi_name', { name: currentChild.name })}</h1>
                  </div>

                  {isLocked ? (
                      <div className="bg-slate-200 p-8 rounded-[3rem] flex flex-col items-center">
                          {lockReason === 'bedtime' ? <div className="text-6xl mb-4">😴</div> : <div className="text-6xl mb-4">✅</div>}
                          <span className="text-2xl font-bold text-slate-500">{t('all_done')}</span>
                      </div>
                  ) : (
                      <button 
                        onClick={handleStart}
                        className="w-64 h-64 bg-green-400 hover:bg-green-500 rounded-full shadow-[0px_10px_0px_0px_rgba(21,128,61,1)] active:translate-y-[10px] active:shadow-none transition-all flex items-center justify-center animate-bounce-slow"
                      >
                          <Play className="w-32 h-32 text-white fill-current ml-4" />
                      </button>
                  )}
              </div>

              {showGate && <ParentGate onUnlock={onGateUnlock} onCancel={() => setShowGate(false)} />}
          </div>
      );
  }

  // 2. PRESCHOOL (4-6): Colorful, Mission Ribbon, "Adventure" Theme
  if (currentChild.ageBand === AgeBand.PRESCHOOL) {
      return (
          <div className="h-full bg-gradient-to-b from-orange-50 to-orange-100 flex flex-col relative overflow-hidden">
              {/* Header */}
              <div className="p-6 flex justify-between items-start">
                   <div className="flex items-center gap-4 bg-white/60 backdrop-blur p-2 pr-6 rounded-full border border-white/50 shadow-sm">
                       <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-2xl border-2 border-orange-200">
                           {currentChild.avatar}
                       </div>
                       <div>
                           <div className="font-bold text-slate-700 text-lg leading-none">{currentChild.name}</div>
                           <div className="flex items-center gap-1 text-orange-500 font-bold text-xs">
                               <Star className="w-3 h-3 fill-current" /> {currentChild.stars}
                           </div>
                       </div>
                   </div>

                   <button onClick={handleParentExit} className="p-3 bg-white/60 rounded-xl text-slate-400 hover:bg-white transition-colors">
                       <Lock className="w-6 h-6" />
                   </button>
              </div>

              <div className="flex-1 flex flex-col items-center justify-center gap-8 z-10 animate-fadeIn">
                   <TeacherAvatar emotion="happy" size="lg" />
                   
                   <div className="bg-white rounded-3xl p-6 shadow-xl border-4 border-orange-200 max-w-sm w-full text-center relative">
                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-orange-500 text-white px-6 py-2 rounded-full font-bold shadow-md whitespace-nowrap">
                            {t('todays_mission')}
                        </div>
                        <div className="mt-4 flex justify-center gap-4 mb-6">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="w-12 h-12 bg-orange-50 rounded-xl border-2 border-orange-100 flex items-center justify-center text-2xl">
                                    {i === 3 ? '🎨' : i === 4 ? '🧘' : '❓'}
                                </div>
                            ))}
                        </div>
                        
                        {isLocked ? (
                            <div className="py-4 bg-slate-100 rounded-xl text-slate-500 font-bold">
                                {lockReason === 'bedtime' ? t('sleep_mode') : t('daily_goal_reached')}
                            </div>
                        ) : (
                            <button 
                                onClick={handleStart}
                                className="w-full py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl font-bold text-2xl shadow-[0px_6px_0px_0px_rgba(194,65,12,1)] active:translate-y-[6px] active:shadow-none transition-all flex items-center justify-center gap-3"
                            >
                                <Play className="fill-current w-6 h-6" /> {t('lets_go')}
                            </button>
                        )}
                   </div>

                   <button 
                      onClick={() => setShowTrophies(true)}
                      className="bg-yellow-400 text-white px-6 py-2 rounded-full font-bold shadow-lg flex items-center gap-2 animate-pulse hover:animate-none"
                    >
                       <Trophy className="w-5 h-5" /> {t('my_trophies')}
                   </button>
              </div>
              
              {showGate && <ParentGate onUnlock={onGateUnlock} onCancel={() => setShowGate(false)} />}
              {showTrophies && <TrophyCabinet onClose={() => setShowTrophies(false)} />}
          </div>
      );
  }

  // 3. SCHOOL (7-10): Charts, Progress, "Daily Objective"
  return (
      <div className="h-full bg-slate-50 flex flex-col relative">
          <header className="bg-white px-6 py-4 flex justify-between items-center shadow-sm border-b border-slate-100">
              <div className="flex items-center gap-3">
                  <div className="text-3xl">{currentChild.avatar}</div>
                  <h1 className="text-2xl font-bold text-slate-800">{t('welcome', { name: currentChild.name })}</h1>
              </div>
              <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 bg-yellow-50 px-3 py-1.5 rounded-lg border border-yellow-100">
                      <Star className="w-5 h-5 text-yellow-500 fill-current" />
                      <span className="font-bold text-slate-700">{currentChild.stars}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-orange-50 px-3 py-1.5 rounded-lg border border-orange-100">
                      <Trophy className="w-5 h-5 text-orange-500" />
                      <span className="font-bold text-slate-700">{currentChild.streak} {t('day_streak')}</span>
                  </div>
                  <button onClick={handleParentExit} className="p-2 text-slate-300 hover:text-slate-500">
                      <Lock className="w-5 h-5" />
                  </button>
              </div>
          </header>

          <main className="flex-1 max-w-4xl mx-auto w-full p-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="flex flex-col items-center md:items-start space-y-6 animate-fadeIn">
                  <TeacherAvatar emotion="happy" size="md" />
                  
                  <div className="space-y-2 text-center md:text-left">
                      <h2 className="text-4xl font-bold text-slate-800">{t('ready_training')}</h2>
                      <p className="text-slate-500 text-lg">{t('focus_desc')}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 w-full">
                      <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center gap-3 shadow-sm">
                          <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><Clock className="w-5 h-5" /></div>
                          <div>
                              <div className="text-xs text-slate-400 font-bold uppercase">Duration</div>
                              <div className="font-bold text-slate-700">~15 Mins</div>
                          </div>
                      </div>
                      <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center gap-3 shadow-sm">
                          <div className="p-2 bg-purple-100 text-purple-600 rounded-lg"><Map className="w-5 h-5" /></div>
                          <div>
                              <div className="text-xs text-slate-400 font-bold uppercase">Activities</div>
                              <div className="font-bold text-slate-700">6 Tasks</div>
                          </div>
                      </div>
                  </div>

                  <button 
                      onClick={() => setShowTrophies(true)}
                      className="w-full py-3 border-2 border-slate-200 text-slate-500 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-50 hover:border-slate-300 transition-colors"
                  >
                       <Trophy className="w-5 h-5" /> {t('my_trophies')}
                   </button>
              </div>

              <div className="flex flex-col items-center justify-center animate-fadeIn delay-100">
                  {isLocked ? (
                      <div className="w-full aspect-video bg-slate-200 rounded-3xl flex flex-col items-center justify-center text-slate-500">
                          <Lock className="w-16 h-16 mb-4" />
                          <h3 className="text-2xl font-bold">{lockReason === 'bedtime' ? t('sleep_mode') : t('daily_goal_reached')}</h3>
                          <p>{t('come_back_tmrw')}</p>
                      </div>
                  ) : (
                      <div className="w-full bg-white rounded-[2rem] p-8 shadow-xl border-4 border-slate-100 text-center">
                           <h3 className="text-xl font-bold text-slate-400 mb-8 uppercase tracking-widest">{t('session_preview')}</h3>
                           <div className="flex justify-center gap-4 mb-10 opacity-50 grayscale hover:grayscale-0 transition-all">
                               <div className="text-4xl">🧠</div>
                               <div className="text-4xl">⚡</div>
                               <div className="text-4xl">🎨</div>
                           </div>
                           <button 
                                onClick={handleStart}
                                className="w-full py-5 bg-brand-600 hover:bg-brand-700 text-white rounded-2xl font-bold text-2xl shadow-[0px_6px_0px_0px_rgba(194,65,12,1)] active:translate-y-[6px] active:shadow-none transition-all flex items-center justify-center gap-3"
                            >
                                <Play className="fill-current w-6 h-6" /> {t('start_session')}
                            </button>
                      </div>
                  )}
              </div>
          </main>
          
          {showGate && <ParentGate onUnlock={onGateUnlock} onCancel={() => setShowGate(false)} />}
          {showTrophies && <TrophyCabinet onClose={() => setShowTrophies(false)} />}
      </div>
  );
};