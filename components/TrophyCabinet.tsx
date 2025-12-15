import React from 'react';
import { useStore } from '../store';
import { TROPHIES } from '../constants';
import { Lock, X } from 'lucide-react';

interface TrophyCabinetProps {
  onClose: () => void;
}

export const TrophyCabinet: React.FC<TrophyCabinetProps> = ({ onClose }) => {
  const currentChild = useStore(state => state.currentChild);

  if (!currentChild) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border-4 border-slate-100">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-6 flex justify-between items-center text-white">
             <div className="flex items-center gap-4">
                 <div className="text-4xl">🏆</div>
                 <div>
                     <h2 className="text-3xl font-black uppercase tracking-wide">Trophy Room</h2>
                     <p className="opacity-90 font-medium">Keep going, {currentChild.name}!</p>
                 </div>
             </div>
             <button onClick={onClose} className="p-2 bg-white/20 hover:bg-white/40 rounded-full transition-colors">
                 <X className="w-8 h-8" />
             </button>
        </div>

        {/* Grid */}
        <div className="flex-1 overflow-y-auto p-8 bg-slate-50">
             <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                 {TROPHIES.map(trophy => {
                     const isUnlocked = currentChild.unlockedTrophies.includes(trophy.id);
                     return (
                         <div 
                            key={trophy.id}
                            className={`
                                relative p-6 rounded-2xl border-b-8 transition-transform
                                ${isUnlocked 
                                    ? 'bg-white border-yellow-400 shadow-lg scale-100' 
                                    : 'bg-slate-200 border-slate-300 shadow-none scale-95 opacity-70 grayscale'}
                            `}
                         >
                             <div className="flex flex-col items-center text-center">
                                 <div className={`text-6xl mb-4 transition-transform ${isUnlocked ? 'animate-bounce-slow' : ''}`}>
                                     {isUnlocked ? trophy.icon : <Lock className="w-12 h-12 text-slate-400" />}
                                 </div>
                                 <h3 className="font-bold text-slate-800 text-lg leading-tight mb-2">{trophy.title}</h3>
                                 <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">{trophy.description}</p>
                                 
                                 {isUnlocked && (
                                     <div className="mt-4 px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-bold rounded-full">
                                         UNLOCKED
                                     </div>
                                 )}
                             </div>
                         </div>
                     );
                 })}
             </div>
        </div>

      </div>
    </div>
  );
};