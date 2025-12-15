import React, { useState, useMemo } from 'react';
import { useStore } from '../store';
import { ChildProfile } from '../types';
import { analyzeProgress } from '../lib/analytics';
import { 
  Settings, Plus, Clock, Flame, Star, Brain, Shield, Moon, Trash2, BarChart3, X, Play, Globe, Baby, AlertTriangle,
  Calendar as CalendarIcon, Download, ChevronLeft, ChevronRight
} from 'lucide-react';

export const ParentDashboard: React.FC = () => {
  const user = useStore(state => state.user);
  const setChild = useStore(state => state.setChild);
  const updateChild = useStore(state => state.updateChild);
  const deleteChild = useStore(state => state.deleteChild);
  const addChild = useStore(state => state.addChild);
  const itemProgress = useStore(state => state.itemProgress);

  const [editingChild, setEditingChild] = useState<ChildProfile | null>(null);
  const [activeTab, setActiveTab] = useState<'profile' | 'safety' | 'progress' | 'report'>('profile');
  const [reportDate, setReportDate] = useState(new Date());

  // Analytics for currently editing child
  const analytics = useMemo(() => {
      if (!editingChild) return null;
      return analyzeProgress(itemProgress, editingChild.id);
  }, [editingChild, itemProgress]);

  // Calendar Logic
  const getCalendarDays = () => {
      const year = reportDate.getFullYear();
      const month = reportDate.getMonth();
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);
      const days = [];
      
      // Padding
      for(let i=0; i<firstDay.getDay(); i++) days.push(null);
      // Days
      for(let i=1; i<=lastDay.getDate(); i++) days.push(new Date(year, month, i));
      
      return days;
  };

  const handleSaveSettings = () => {
      if (editingChild) {
          updateChild(editingChild.id, editingChild);
          setEditingChild(null);
      }
  };

  const handleDelete = () => {
      if (editingChild && confirm(`Are you sure you want to delete ${editingChild.name}?`)) {
          deleteChild(editingChild.id);
          setEditingChild(null);
      }
  };

  const printReport = () => {
      window.print();
  };

  if (!user) return null;

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden">
      {/* Header */}
      <header className="bg-white px-8 py-6 flex justify-between items-center shadow-sm z-10 print:hidden">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Parent Dashboard</h1>
          <p className="text-slate-500">Manage learning, safety, and progress.</p>
        </div>
        <div className="flex gap-4">
             <button className="p-3 bg-slate-100 rounded-full text-slate-500 hover:bg-slate-200 transition-colors">
                <Settings className="w-6 h-6" />
             </button>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-8 print:hidden">
        <div className="max-w-6xl mx-auto">
            
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold text-slate-700 uppercase tracking-wide">Children</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {/* Child Cards */}
                {user.children.map((child) => {
                    return (
                        <div key={child.id} className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow relative overflow-hidden group">
                            {/* Card Header */}
                            <div className="flex items-start justify-between mb-6">
                                <div className="flex gap-4">
                                    <div className="w-16 h-16 bg-brand-100 rounded-2xl flex items-center justify-center text-4xl shadow-inner">
                                        {child.avatar}
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold text-slate-800">{child.name}</h3>
                                        <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
                                            <span className="bg-slate-100 px-2 py-0.5 rounded-md">{child.age}y</span>
                                            <span className="bg-brand-50 text-brand-600 px-2 py-0.5 rounded-md uppercase text-xs tracking-wider">{child.ageBand}</span>
                                        </div>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => { setEditingChild(child); setActiveTab('profile'); }}
                                    className="p-2 text-slate-300 hover:text-slate-600 transition-colors hover:bg-slate-50 rounded-xl"
                                >
                                    <Settings className="w-6 h-6" />
                                </button>
                            </div>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-3 gap-2 mb-8">
                                <div className="bg-orange-50 p-3 rounded-2xl flex flex-col items-center">
                                    <Flame className="w-5 h-5 text-orange-500 mb-1" />
                                    <span className="text-xl font-bold text-slate-800">{child.streak}</span>
                                    <span className="text-[10px] uppercase font-bold text-slate-400">Streak</span>
                                </div>
                                <div className="bg-yellow-50 p-3 rounded-2xl flex flex-col items-center">
                                    <Star className="w-5 h-5 text-yellow-500 mb-1" />
                                    <span className="text-xl font-bold text-slate-800">{child.stars}</span>
                                    <span className="text-[10px] uppercase font-bold text-slate-400">Stars</span>
                                </div>
                                <div className="bg-blue-50 p-3 rounded-2xl flex flex-col items-center">
                                    <Clock className="w-5 h-5 text-blue-500 mb-1" />
                                    <span className="text-xl font-bold text-slate-800">{child.todayUsageMinutes}m</span>
                                    <span className="text-[10px] uppercase font-bold text-slate-400">Today</span>
                                </div>
                            </div>

                            {/* Action Button */}
                            <button 
                                onClick={() => setChild(child)}
                                className="w-full py-4 bg-brand-600 hover:bg-brand-700 text-white rounded-2xl font-bold text-lg shadow-[0px_4px_0px_0px_rgba(194,65,12,1)] active:translate-y-[4px] active:shadow-none transition-all flex items-center justify-center gap-2"
                            >
                                <Play className="fill-current w-5 h-5" /> Start Session
                            </button>
                        </div>
                    );
                })}

                {/* Add Child Card */}
                <button 
                    onClick={() => addChild({ name: 'New Kid', age: 4 })}
                    className="flex flex-col items-center justify-center gap-4 bg-slate-50 border-3 border-dashed border-slate-300 rounded-[2rem] p-6 text-slate-400 hover:bg-white hover:border-brand-300 hover:text-brand-500 transition-all min-h-[300px]"
                >
                    <div className="w-20 h-20 rounded-full bg-white border-2 border-slate-200 flex items-center justify-center shadow-sm">
                        <Plus className="w-8 h-8" />
                    </div>
                    <span className="font-bold text-lg">Add Child Profile</span>
                </button>
            </div>
        </div>
      </div>

      {/* SETTINGS / DETAILS MODAL */}
      {editingChild && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fadeIn print:static print:bg-white print:p-0">
              <div className="bg-white rounded-3xl w-full max-w-5xl h-[85vh] shadow-2xl overflow-hidden flex flex-col md:flex-row print:shadow-none print:h-auto print:w-full print:max-w-none">
                  
                  {/* Sidebar */}
                  <div className="w-full md:w-64 bg-slate-50 p-6 flex flex-col border-r border-slate-100 print:hidden">
                      <div className="flex items-center gap-3 mb-8">
                          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-2xl shadow-sm border border-slate-100">
                              {editingChild.avatar}
                          </div>
                          <div>
                              <h3 className="font-bold text-slate-800 truncate">{editingChild.name}</h3>
                              <p className="text-xs text-slate-500">Edit Mode</p>
                          </div>
                      </div>

                      <nav className="space-y-2 flex-1">
                          <button 
                             onClick={() => setActiveTab('profile')}
                             className={`w-full text-left px-4 py-3 rounded-xl font-bold text-sm flex items-center gap-3 transition-colors ${activeTab === 'profile' ? 'bg-brand-500 text-white shadow-md' : 'text-slate-500 hover:bg-white'}`}
                          >
                              <Brain className="w-5 h-5" /> Profile
                          </button>
                          <button 
                             onClick={() => setActiveTab('safety')}
                             className={`w-full text-left px-4 py-3 rounded-xl font-bold text-sm flex items-center gap-3 transition-colors ${activeTab === 'safety' ? 'bg-brand-500 text-white shadow-md' : 'text-slate-500 hover:bg-white'}`}
                          >
                              <Shield className="w-5 h-5" /> Limits & Safety
                          </button>
                          <button 
                             onClick={() => setActiveTab('progress')}
                             className={`w-full text-left px-4 py-3 rounded-xl font-bold text-sm flex items-center gap-3 transition-colors ${activeTab === 'progress' ? 'bg-brand-500 text-white shadow-md' : 'text-slate-500 hover:bg-white'}`}
                          >
                              <BarChart3 className="w-5 h-5" /> Analytics
                          </button>
                          <button 
                             onClick={() => setActiveTab('report')}
                             className={`w-full text-left px-4 py-3 rounded-xl font-bold text-sm flex items-center gap-3 transition-colors ${activeTab === 'report' ? 'bg-brand-500 text-white shadow-md' : 'text-slate-500 hover:bg-white'}`}
                          >
                              <Download className="w-5 h-5" /> Report Card
                          </button>
                      </nav>

                      <button onClick={handleDelete} className="mt-auto flex items-center gap-2 text-red-400 hover:text-red-600 px-4 py-2 text-sm font-bold">
                          <Trash2 className="w-4 h-4" /> Delete Profile
                      </button>
                  </div>

                  {/* Main Panel */}
                  <div className="flex-1 flex flex-col relative overflow-hidden">
                      <button onClick={() => setEditingChild(null)} className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 print:hidden">
                          <X className="w-6 h-6" />
                      </button>

                      <div className="flex-1 overflow-y-auto p-8 print:p-0 print:overflow-visible">
                          
                          {/* PROFILE TAB */}
                          {activeTab === 'profile' && (
                              <div className="space-y-8 animate-fadeIn">
                                  <h2 className="text-2xl font-bold text-slate-800">Profile Details</h2>
                                  <div className="space-y-4">
                                      <label className="block text-sm font-bold text-slate-500 uppercase">Name</label>
                                      <input 
                                          value={editingChild.name} 
                                          onChange={e => setEditingChild({...editingChild, name: e.target.value})}
                                          className="w-full p-4 bg-slate-50 border-2 border-slate-200 rounded-xl font-bold text-slate-800 focus:border-brand-500 outline-none" 
                                      />
                                  </div>
                                  <div className="grid grid-cols-2 gap-6">
                                      <div className="space-y-4">
                                          <label className="block text-sm font-bold text-slate-500 uppercase">Age</label>
                                          <input 
                                              type="number"
                                              value={editingChild.age} 
                                              onChange={e => setEditingChild({...editingChild, age: parseInt(e.target.value)})}
                                              className="w-full p-4 bg-slate-50 border-2 border-slate-200 rounded-xl font-bold text-slate-800 focus:border-brand-500 outline-none" 
                                          />
                                      </div>
                                      <div className="space-y-4">
                                          <label className="block text-sm font-bold text-slate-500 uppercase">Language</label>
                                          <div className="relative">
                                              <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                                              <select 
                                                  value={editingChild.language || 'en'}
                                                  onChange={e => setEditingChild({...editingChild, language: e.target.value})}
                                                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-200 rounded-xl font-bold text-slate-800 focus:border-brand-500 outline-none appearance-none"
                                              >
                                                  <option value="en">English</option>
                                                  <option value="es">Spanish</option>
                                                  <option value="fr">French</option>
                                              </select>
                                          </div>
                                      </div>
                                  </div>
                              </div>
                          )}

                          {/* SAFETY TAB */}
                          {activeTab === 'safety' && (
                              <div className="space-y-8 animate-fadeIn">
                                  <h2 className="text-2xl font-bold text-slate-800">Limits & Safety</h2>
                                  <div className="bg-orange-50 p-6 rounded-2xl border border-orange-100 flex items-start gap-4">
                                      <div className="p-3 bg-white rounded-full text-orange-500 shadow-sm"><Moon className="w-6 h-6" /></div>
                                      <div className="flex-1">
                                          <h3 className="font-bold text-slate-800">Bedtime Lock</h3>
                                          <p className="text-sm text-slate-500 mb-4">App will lock during these hours.</p>
                                          <div className="flex gap-4 items-center">
                                              <input 
                                                  type="time" 
                                                  value={editingChild.bedtimeStart}
                                                  onChange={e => setEditingChild({...editingChild, bedtimeStart: e.target.value})}
                                                  className="p-3 bg-white border border-slate-200 rounded-lg font-bold text-slate-700"
                                              />
                                              <span className="text-slate-400 font-bold">to</span>
                                              <input 
                                                  type="time" 
                                                  value={editingChild.bedtimeEnd}
                                                  onChange={e => setEditingChild({...editingChild, bedtimeEnd: e.target.value})}
                                                  className="p-3 bg-white border border-slate-200 rounded-lg font-bold text-slate-700"
                                              />
                                          </div>
                                      </div>
                                  </div>
                                  <div className="space-y-4">
                                      <label className="block text-sm font-bold text-slate-500 uppercase">Daily Time Limit (Minutes)</label>
                                      <div className="flex items-center gap-4">
                                          <input 
                                              type="range" min="10" max="120" step="5"
                                              value={editingChild.dailyLimitMinutes} 
                                              onChange={e => setEditingChild({...editingChild, dailyLimitMinutes: parseInt(e.target.value)})}
                                              className="flex-1 h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-500" 
                                          />
                                          <span className="text-2xl font-bold text-brand-600 w-20 text-right">{editingChild.dailyLimitMinutes}m</span>
                                      </div>
                                  </div>
                                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
                                      <div className="flex items-center gap-3">
                                          <Baby className="w-6 h-6 text-slate-500" />
                                          <div>
                                              <h4 className="font-bold text-slate-700">Co-Play Mode</h4>
                                              <p className="text-xs text-slate-500">Require parental tap to finish tasks.</p>
                                          </div>
                                      </div>
                                      <button 
                                          onClick={() => setEditingChild({...editingChild, coPlayRequired: !editingChild.coPlayRequired})}
                                          className={`w-14 h-8 rounded-full transition-colors relative ${editingChild.coPlayRequired ? 'bg-brand-500' : 'bg-slate-300'}`}
                                      >
                                          <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform shadow-sm ${editingChild.coPlayRequired ? 'left-7' : 'left-1'}`} />
                                      </button>
                                  </div>
                              </div>
                          )}

                          {/* ANALYTICS TAB */}
                          {activeTab === 'progress' && analytics && (
                              <div className="space-y-8 animate-fadeIn">
                                  <div className="flex items-center justify-between">
                                     <h2 className="text-2xl font-bold text-slate-800">Learning Analytics</h2>
                                     <div className="text-sm text-slate-400 font-medium bg-slate-50 px-3 py-1 rounded-lg">
                                         Last 30 Days
                                     </div>
                                  </div>

                                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                      <div className="bg-green-50 p-4 rounded-2xl border border-green-100">
                                          <div className="text-xs font-bold text-green-700 mb-1 uppercase">Retention (7d)</div>
                                          <div className="text-3xl font-black text-slate-800">{analytics.retention7Day}%</div>
                                      </div>
                                      <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
                                          <div className="text-xs font-bold text-blue-700 mb-1 uppercase">Retention (14d)</div>
                                          <div className="text-3xl font-black text-slate-800">{analytics.retention14Day}%</div>
                                      </div>
                                      <div className="bg-purple-50 p-4 rounded-2xl border border-purple-100">
                                          <div className="text-xs font-bold text-purple-700 mb-1 uppercase">Mastered Items</div>
                                          <div className="text-3xl font-black text-slate-800">{analytics.itemsMastered}</div>
                                          <div className="text-[10px] text-slate-500">of {analytics.totalItems} total</div>
                                      </div>
                                      <div className="bg-orange-50 p-4 rounded-2xl border border-orange-100">
                                          <div className="text-xs font-bold text-orange-700 mb-1 uppercase">Efficiency</div>
                                          <div className="text-3xl font-black text-slate-800">{analytics.efficiencyScore}</div>
                                          <div className="text-[10px] text-slate-500">Score (0-100)</div>
                                      </div>
                                  </div>

                                  {/* Weak Items */}
                                  <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
                                      <h3 className="font-bold text-slate-700 uppercase text-sm tracking-wide flex items-center gap-2 mb-4">
                                          <AlertTriangle className="w-4 h-4 text-orange-500" /> Focus Areas
                                      </h3>
                                      {analytics.weakItems.length > 0 ? (
                                          <div className="space-y-3">
                                              {analytics.weakItems.map((item, idx) => (
                                                  <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                                                      <div className="flex items-center gap-3">
                                                          <span className="text-2xl">{item.itemId.startsWith('#') ? '🎨' : item.itemId}</span>
                                                          <div>
                                                              <div className="font-bold text-slate-700 text-sm">{item.itemId}</div>
                                                              <div className="text-xs text-slate-400">Struggling</div>
                                                          </div>
                                                      </div>
                                                      <div className="text-right">
                                                          <div className="text-xs font-bold text-brand-600 bg-brand-50 px-2 py-1 rounded">
                                                              Try: {item.remediation}
                                                          </div>
                                                      </div>
                                                  </div>
                                              ))}
                                          </div>
                                      ) : (
                                          <div className="text-slate-400 text-sm text-center py-4">No weak items detected. Great job!</div>
                                      )}
                                  </div>

                                  {/* Calendar */}
                                  <div>
                                      <div className="flex justify-between items-center mb-4">
                                          <h3 className="font-bold text-slate-700 uppercase text-sm tracking-wide flex items-center gap-2">
                                              <CalendarIcon className="w-4 h-4" /> Activity Log
                                          </h3>
                                          <div className="flex gap-2">
                                              <button onClick={() => setReportDate(d => new Date(d.getFullYear(), d.getMonth()-1))}><ChevronLeft className="w-5 h-5 text-slate-400" /></button>
                                              <span className="font-bold text-slate-600">{reportDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
                                              <button onClick={() => setReportDate(d => new Date(d.getFullYear(), d.getMonth()+1))}><ChevronRight className="w-5 h-5 text-slate-400" /></button>
                                          </div>
                                      </div>
                                      <div className="grid grid-cols-7 gap-1 text-center mb-2">
                                          {['S','M','T','W','T','F','S'].map(d => <div key={d} className="text-xs font-bold text-slate-300">{d}</div>)}
                                      </div>
                                      <div className="grid grid-cols-7 gap-2">
                                          {getCalendarDays().map((date, i) => {
                                              if (!date) return <div key={`empty-${i}`} />;
                                              const dateKey = date.toISOString().split('T')[0];
                                              const data = analytics.calendarData[dateKey];
                                              return (
                                                  <div key={dateKey} className={`aspect-square rounded-lg flex items-center justify-center text-xs font-bold relative border
                                                      ${data ? 'bg-brand-50 border-brand-200 text-brand-700' : 'bg-white border-slate-100 text-slate-300'}`}>
                                                      {date.getDate()}
                                                      {data && (
                                                          <div className="absolute bottom-1 right-1 w-2 h-2 rounded-full bg-brand-500" />
                                                      )}
                                                  </div>
                                              );
                                          })}
                                      </div>
                                  </div>
                              </div>
                          )}

                          {/* REPORT CARD TAB (Printable) */}
                          {activeTab === 'report' && analytics && (
                              <div className="animate-fadeIn p-4 md:p-8 bg-white print:p-0">
                                  <div className="border-4 border-slate-800 p-8 rounded-[2rem] relative bg-white overflow-hidden print:border-4 print:shadow-none shadow-xl max-w-2xl mx-auto">
                                      {/* Decorative Corner */}
                                      <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400 rotate-45 transform translate-x-16 -translate-y-16" />
                                      
                                      <div className="flex justify-between items-start mb-12 relative z-10">
                                          <div>
                                              <h1 className="text-4xl font-black text-slate-800 uppercase tracking-tight mb-2">KidBoost Report</h1>
                                              <div className="text-slate-500 font-medium">Progress Update • {new Date().toLocaleDateString()}</div>
                                          </div>
                                          <div className="text-6xl">{editingChild.avatar}</div>
                                      </div>

                                      <div className="flex items-center gap-6 mb-12 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                           <div>
                                               <div className="text-sm font-bold text-slate-400 uppercase">Student</div>
                                               <div className="text-3xl font-bold text-slate-800">{editingChild.name}</div>
                                           </div>
                                           <div className="h-10 w-px bg-slate-300" />
                                           <div>
                                               <div className="text-sm font-bold text-slate-400 uppercase">Level</div>
                                               <div className="text-3xl font-bold text-slate-800">{editingChild.ageBand}</div>
                                           </div>
                                      </div>

                                      <div className="grid grid-cols-2 gap-8 mb-12">
                                           <div>
                                               <div className="text-6xl font-black text-brand-500 mb-2">{analytics.retention7Day}%</div>
                                               <div className="font-bold text-slate-600 uppercase tracking-wide text-sm">Retention Score</div>
                                           </div>
                                           <div>
                                               <div className="text-6xl font-black text-green-500 mb-2">{analytics.itemsMastered}</div>
                                               <div className="font-bold text-slate-600 uppercase tracking-wide text-sm">Skills Mastered</div>
                                           </div>
                                      </div>

                                      <div className="mb-8">
                                          <h3 className="font-bold text-slate-800 uppercase border-b-2 border-slate-100 pb-2 mb-4">Focus Areas</h3>
                                          <div className="space-y-2">
                                              {analytics.weakItems.slice(0, 3).map((item, i) => (
                                                  <div key={i} className="flex justify-between items-center text-sm">
                                                      <span className="font-bold text-slate-600">• {item.itemId}</span>
                                                      <span className="text-slate-400 italic">Try {item.remediation}</span>
                                                  </div>
                                              ))}
                                              {analytics.weakItems.length === 0 && <div className="text-slate-400 italic">No specific focus areas needed!</div>}
                                          </div>
                                      </div>

                                      <div className="text-center mt-12 pt-8 border-t-2 border-slate-100">
                                          <div className="inline-block px-8 py-2 bg-slate-800 text-white rounded-full font-bold uppercase text-sm tracking-widest">
                                              Keep Learning!
                                          </div>
                                      </div>
                                  </div>

                                  <div className="mt-8 text-center print:hidden">
                                      <button 
                                        onClick={printReport}
                                        className="bg-brand-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-brand-700 flex items-center gap-2 mx-auto"
                                      >
                                          <Download /> Print / Save PDF
                                      </button>
                                  </div>
                              </div>
                          )}

                      </div>

                      {/* Footer Actions */}
                      <div className="p-6 border-t border-slate-100 flex justify-end gap-4 bg-white print:hidden">
                          <button onClick={() => setEditingChild(null)} className="px-6 py-3 font-bold text-slate-500 hover:bg-slate-50 rounded-xl">
                              Close
                          </button>
                          <button onClick={handleSaveSettings} className="px-8 py-3 bg-brand-600 text-white font-bold rounded-xl shadow-lg hover:bg-brand-700 active:translate-y-1 transition-all">
                              Save Changes
                          </button>
                      </div>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};