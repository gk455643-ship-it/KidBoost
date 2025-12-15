import React, { useState } from 'react';
import { playSound } from '../../lib/sounds';
import { Check, ClipboardList, UserCheck } from 'lucide-react';
import { ParentGate } from '../ParentGate';

interface OfflineTaskActivityProps {
  config: { task: string; inputType?: 'confirm' | 'number' | 'text' };
  onComplete: (success: boolean) => void;
}

export const OfflineTaskActivity: React.FC<OfflineTaskActivityProps> = ({ config, onComplete }) => {
  const [phase, setPhase] = useState<'task' | 'verify'>('task');
  const [inputVal, setInputVal] = useState('');
  const [showGate, setShowGate] = useState(false);

  const handleTaskDone = () => {
      playSound('pop');
      setPhase('verify');
  };

  const startVerification = () => {
      // Simple gate to ensure parent is actually checking
      setShowGate(true);
  };

  const onParentConfirm = () => {
      setShowGate(false);
      playSound('fanfare');
      onComplete(true);
  };

  if (phase === 'verify') {
      return (
          <div className="h-full flex flex-col items-center justify-center p-8 bg-slate-50 text-center animate-fadeIn">
              <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mb-6 text-purple-600 animate-bounce">
                  <UserCheck className="w-12 h-12" />
              </div>
              
              <h2 className="text-3xl font-bold text-slate-800 mb-4">Ask a Parent!</h2>
              <p className="text-xl text-slate-500 mb-12 max-w-sm">
                  Show your work to a parent. Can they confirm you finished the task?
              </p>

              <button 
                onClick={startVerification}
                className="w-full max-w-sm py-5 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl font-bold text-xl shadow-lg active:scale-95 transition-all"
              >
                  Parent Confirm
              </button>

              <button 
                  onClick={() => setPhase('task')}
                  className="mt-6 text-slate-400 font-bold hover:text-slate-600"
              >
                  Not done yet
              </button>

              {showGate && <ParentGate onUnlock={onParentConfirm} onCancel={() => setShowGate(false)} />}
          </div>
      );
  }

  return (
    <div className="h-full flex flex-col items-center justify-center p-8 bg-amber-50 relative overflow-hidden">
       {/* Background Decoration */}
       <div className="absolute top-10 left-10 text-9xl opacity-10 rotate-12">📋</div>
       <div className="absolute bottom-10 right-10 text-9xl opacity-10 -rotate-12">✅</div>

       <div className="relative z-10 w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-lg mb-8 animate-bounce-slow">
           <ClipboardList className="w-16 h-16 text-amber-500" />
       </div>

       <h2 className="relative z-10 text-4xl md:text-5xl font-black text-slate-800 text-center mb-6 leading-tight">
           {config.task}
       </h2>

       <p className="relative z-10 text-xl text-slate-500 text-center mb-12 max-w-md">
           Go do it in the real world, then come back!
       </p>

       {config.inputType === 'number' && (
           <input 
             type="number" 
             value={inputVal}
             onChange={e => setInputVal(e.target.value)}
             placeholder="#"
             className="relative z-10 w-40 text-center text-5xl p-4 rounded-xl border-4 border-amber-200 mb-8 font-black text-slate-700 outline-none focus:border-amber-400 focus:shadow-lg transition-all"
           />
       )}

       <button 
         onClick={handleTaskDone}
         disabled={config.inputType === 'number' && !inputVal}
         className="relative z-10 w-full max-w-sm py-5 bg-green-500 hover:bg-green-600 text-white rounded-2xl font-bold text-2xl shadow-[0px_6px_0px_0px_rgba(21,128,61,1)] active:translate-y-[6px] active:shadow-none transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:translate-y-0 disabled:shadow-none"
       >
           I Did It! <Check className="w-8 h-8" />
       </button>
    </div>
  );
};