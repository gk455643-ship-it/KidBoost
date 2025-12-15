import React, { useState } from 'react';
import { useStore } from '../store';
import { ArrowRight, Mail, ShieldCheck, Loader2 } from 'lucide-react';

export const AuthView: React.FC = () => {
  const login = useStore(state => state.login);
  const verifyOtp = useStore(state => state.verifyOtp);
  
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(email);
      setStep('otp');
    } catch (err) {
      setError('Failed to send code. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const success = await verifyOtp(email, otp);
    setLoading(false);
    if (!success) {
      setError('Invalid code. Try 123456');
    }
  };

  return (
    <div className="min-h-screen bg-brand-50 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border-4 border-white overflow-hidden">
        <div className="bg-brand-500 p-8 text-center">
            <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">KidBoost</h1>
            <p className="text-brand-100">Distraction-free learning</p>
        </div>
        
        <div className="p-8">
            {step === 'email' ? (
                <form onSubmit={handleEmailSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-500 uppercase tracking-wide">Parent Email</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                            <input 
                                type="email" 
                                required
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-brand-500 focus:outline-none text-lg font-medium transition-colors"
                                placeholder="mom@example.com"
                            />
                        </div>
                    </div>
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-brand-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-brand-200 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : <>Send Code <ArrowRight /></>}
                    </button>
                    {error && <p className="text-red-500 text-center text-sm font-medium">{error}</p>}
                </form>
            ) : (
                <form onSubmit={handleOtpSubmit} className="space-y-6">
                     <div className="text-center mb-6">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 text-green-600 mb-3">
                            <ShieldCheck className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800">Check your email</h3>
                        <p className="text-slate-500 text-sm">We sent a code to {email}</p>
                    </div>

                    <div className="space-y-2">
                        <input 
                            type="text" 
                            required
                            value={otp}
                            onChange={e => setOtp(e.target.value)}
                            className="w-full text-center py-4 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-brand-500 focus:outline-none text-3xl tracking-[1em] font-bold transition-colors"
                            placeholder="••••••"
                            maxLength={6}
                        />
                    </div>
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-brand-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-brand-200 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : 'Verify & Enter'}
                    </button>
                    {error && <p className="text-red-500 text-center text-sm font-medium">{error}</p>}
                    <button type="button" onClick={() => setStep('email')} className="w-full text-slate-400 text-sm hover:text-slate-600">
                        Wrong email? Go back
                    </button>
                </form>
            )}
        </div>
        
        <div className="bg-slate-50 p-4 text-center text-xs text-slate-400 border-t border-slate-100">
            Protected by Parental Gate technology.
        </div>
      </div>
    </div>
  );
};
