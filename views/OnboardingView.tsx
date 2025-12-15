import React, { useState, useEffect } from 'react';
import { useStore } from '../store';
import { AgeBand, ChildProfile } from '../types';
import { Check, ChevronRight, User, Baby, Activity } from 'lucide-react';
import { TeacherAvatar } from '../components/TeacherAvatar';

const AVATARS = ["🦁", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼", "🐸", "🐯"];

export const OnboardingView: React.FC = () => {
  const updateUserConsent = useStore(state => state.updateUserConsent);
  const addChild = useStore(state => state.addChild);
  const [step, setStep] = useState<'consent' | 'profile' | 'baseline' | 'finish'>('consent');

  // Profile Form State
  const [name, setName] = useState('');
  const [age, setAge] = useState(5);
  const [selectedAvatar, setSelectedAvatar] = useState(AVATARS[0]);

  // Baseline State
  const [taps, setTaps] = useState(0);
  const [targetVisible, setTargetVisible] = useState(false);
  const [targetPos, setTargetPos] = useState({ top: '50%', left: '50%' });

  // Consent
  const handleConsent = () => {
    updateUserConsent();
    setStep('profile');
  };

  // Create Profile
  const handleProfileSubmit = () => {
    if (!name) return;
    setStep('baseline');
  };

  // Baseline Logic
  useEffect(() => {
    if (step === 'baseline' && taps < 3) {
      const timeout = setTimeout(() => {
        setTargetPos({
          top: `${20 + Math.random() * 60}%`,
          left: `${20 + Math.random() * 60}%`
        });
        setTargetVisible(true);
      }, 1000);
      return () => clearTimeout(timeout);
    } else if (step === 'baseline' && taps >= 3) {
      setTimeout(() => setStep('finish'), 500);
    }
  }, [step, taps]);

  const handleTap = () => {
    setTargetVisible(false);
    setTaps(p => p + 1);
  };

  const handleFinish = () => {
    // Determine Age Band
    let band = AgeBand.PRESCHOOL;
    if (age <= 3) band = AgeBand.TODDLER;
    if (age >= 7) band = AgeBand.SCHOOL;

    addChild({
        name,
        age,
        ageBand: band,
        avatar: selectedAvatar,
        dailyLimitMinutes: age * 10 // Mock logic
    });
    // Store updates state, causing App to re-render and switch to Dashboard
  };

  // --- RENDERERS ---

  if (step === 'consent') {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 max-w-2xl mx-auto text-center space-y-8 animate-fadeIn">
        <div className="w-20 h-20 bg-brand-100 rounded-full flex items-center justify-center text-brand-600 mb-4">
            <User className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-bold text-slate-800">Parental Consent</h1>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 text-left text-slate-600 space-y-4 max-h-[40vh] overflow-y-auto">
            <p><strong>1. Data Privacy:</strong> We store progress data to adapt difficulty. No data is sold.</p>
            <p><strong>2. Safety:</strong> Use this app in a safe environment. For children under 4, co-play is required.</p>
            <p><strong>3. Health:</strong> We enforce 20-minute breaks to protect eyesight.</p>
        </div>
        <button 
            onClick={handleConsent}
            className="w-full bg-brand-500 text-white py-4 rounded-xl font-bold text-xl shadow-lg hover:bg-brand-600 active:scale-95 transition-all"
        >
            I Agree & Continue
        </button>
      </div>
    );
  }

  if (step === 'profile') {
      return (
        <div className="h-full flex flex-col p-6 max-w-lg mx-auto animate-fadeIn overflow-y-auto">
            <h1 className="text-2xl font-bold text-slate-800 mb-2">Create Child Profile</h1>
            <p className="text-slate-500 mb-8">Let's set up the learning path.</p>
            
            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Child's Name</label>
                    <input 
                        value={name}
                        onChange={e => setName(e.target.value)}
                        className="w-full p-4 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-brand-500 outline-none font-bold text-lg"
                        placeholder="e.g. Leo"
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Age: {age} years</label>
                    <input 
                        type="range" 
                        min="2" 
                        max="10" 
                        value={age}
                        onChange={e => setAge(parseInt(e.target.value))}
                        className="w-full h-4 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-500"
                    />
                    <div className="flex justify-between text-xs text-slate-400 mt-2">
                        <span>2y (Toddler)</span>
                        <span>5y (Preschool)</span>
                        <span>10y (School)</span>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Choose Avatar</label>
                    <div className="grid grid-cols-5 gap-3">
                        {AVATARS.map(a => (
                            <button
                                key={a}
                                onClick={() => setSelectedAvatar(a)}
                                className={`aspect-square text-3xl flex items-center justify-center rounded-xl transition-all ${selectedAvatar === a ? 'bg-brand-100 border-2 border-brand-500 scale-110' : 'bg-slate-50 border border-slate-100'}`}
                            >
                                {a}
                            </button>
                        ))}
                    </div>
                </div>

                <button 
                    onClick={handleProfileSubmit}
                    disabled={!name}
                    className="w-full mt-8 bg-brand-500 text-white py-4 rounded-xl font-bold text-xl shadow-lg disabled:opacity-50 disabled:shadow-none"
                >
                    Continue
                </button>
            </div>
        </div>
      );
  }

  if (step === 'baseline') {
      return (
          <div className="h-full w-full relative bg-slate-50 overflow-hidden cursor-crosshair touch-none select-none">
              {/* Instructions Overlay */}
              {!targetVisible && taps === 0 && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur z-10 p-8 text-center animate-fadeIn">
                      <Activity className="w-16 h-16 text-brand-500 mb-4" />
                      <h2 className="text-3xl font-bold text-slate-800 mb-2">Quick Calibration</h2>
                      <p className="text-xl text-slate-600">Tap the orange circle as fast as you can!</p>
                  </div>
              )}

              {/* Game Target */}
              {targetVisible && (
                  <button
                    onMouseDown={handleTap}
                    onTouchStart={handleTap}
                    style={{ top: targetPos.top, left: targetPos.left }}
                    className="absolute w-24 h-24 bg-brand-500 rounded-full shadow-lg border-4 border-white active:scale-90 transition-transform transform -translate-x-1/2 -translate-y-1/2 animate-bounce-slow"
                  />
              )}

              {/* Progress */}
              <div className="absolute top-8 right-8 text-2xl font-bold text-slate-300">
                  {taps}/3
              </div>
          </div>
      );
  }

  // Finish
  return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center animate-fadeIn">
          <TeacherAvatar emotion="excited" size="lg" className="mb-8" />
          <h1 className="text-4xl font-bold text-slate-800 mb-4">All Set!</h1>
          <p className="text-xl text-slate-500 mb-8">We have created a personalized plan for {name}.</p>
          <button 
            onClick={handleFinish}
            className="px-8 py-4 bg-green-500 text-white rounded-xl font-bold text-xl shadow-[0px_6px_0px_0px_rgba(21,128,61,1)] active:translate-y-[6px] active:shadow-none"
          >
              Go to Dashboard
          </button>
      </div>
  );
};
