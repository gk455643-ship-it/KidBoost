import React, { useState, useMemo } from 'react';
import { PARENT_PIN } from '../constants';
import { Lock, Calculator } from 'lucide-react';

interface ParentGateProps {
  onUnlock: () => void;
  onCancel: () => void;
}

export const ParentGate: React.FC<ParentGateProps> = ({ onUnlock, onCancel }) => {
  const [stage, setStage] = useState<'math' | 'pin'>('math');
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);
  
  // Math Challenge State
  const challenge = useMemo(() => {
      const a = Math.floor(Math.random() * 5) + 2; // 2 to 6
      const b = Math.floor(Math.random() * 5) + 2; // 2 to 6
      return { q: `${a} x ${b}`, a: a * b };
  }, []);
  const [mathAnswer, setMathAnswer] = useState("");

  const handleMathInput = (num: number) => {
      const newAns = mathAnswer + num;
      if (newAns.length > 2) return;
      setMathAnswer(newAns);
      
      if (parseInt(newAns) === challenge.a) {
          setTimeout(() => setStage('pin'), 300);
      } else if (newAns.length === 2) {
          setError(true);
          setTimeout(() => {
              setMathAnswer("");
              setError(false);
          }, 500);
      }
  };

  const handlePinInput = (num: number) => {
    const newPin = pin + num;
    if (newPin.length > 4) return;
    setPin(newPin);
    setError(false);

    if (newPin.length === 4) {
      if (newPin === PARENT_PIN) {
        onUnlock();
      } else {
        setError(true);
        setTimeout(() => setPin(""), 500);
      }
    }
  };

  const handleInput = (num: number) => {
      if (stage === 'math') handleMathInput(num);
      else handlePinInput(num);
  };

  return (
    <div className="fixed inset-0 bg-brand-600/90 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-2xl border-4 border-slate-200">
        
        {/* Header */}
        <div className="flex flex-col items-center mb-6">
          <div className="p-4 bg-slate-100 rounded-full mb-4">
            {stage === 'math' ? <Calculator className="w-8 h-8 text-brand-500" /> : <Lock className="w-8 h-8 text-brand-500" />}
          </div>
          <h2 className="text-2xl font-bold text-slate-800">
              {stage === 'math' ? 'Parent Check' : 'Enter PIN'}
          </h2>
          <p className="text-slate-500">
              {stage === 'math' ? `What is ${challenge.q}?` : 'Access Settings'}
          </p>
        </div>

        {/* Display Dots or Answer */}
        <div className="flex justify-center gap-4 mb-8 h-8 items-center">
          {stage === 'math' ? (
              <span className={`text-4xl font-bold tracking-widest ${error ? 'text-red-500 shake' : 'text-slate-800'}`}>
                  {mathAnswer || "?"}
              </span>
          ) : (
            [0, 1, 2, 3].map((i) => (
                <div key={i} className={`w-4 h-4 rounded-full transition-colors ${i < pin.length ? (error ? 'bg-red-500' : 'bg-slate-800') : 'bg-slate-200'}`} />
            ))
          )}
        </div>

        {/* Keypad */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              onClick={() => handleInput(num)}
              className="h-16 w-16 rounded-full bg-slate-50 text-2xl font-bold text-slate-700 hover:bg-slate-100 active:scale-95 transition-all shadow-sm border border-slate-200"
            >
              {num}
            </button>
          ))}
          <div />
          <button
              onClick={() => handleInput(0)}
              className="h-16 w-16 rounded-full bg-slate-50 text-2xl font-bold text-slate-700 hover:bg-slate-100 active:scale-95 transition-all shadow-sm border border-slate-200"
            >
              0
          </button>
          <div />
        </div>

        <button onClick={onCancel} className="w-full py-3 text-slate-500 font-medium hover:text-slate-700">
          Cancel
        </button>
      </div>
    </div>
  );
};