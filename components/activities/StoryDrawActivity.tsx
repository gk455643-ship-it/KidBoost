import React from 'react';
import { DrawingCanvas } from './DrawingCanvas';
import { BookOpen } from 'lucide-react';

interface StoryDrawActivityProps {
  config: { prompt: string; colors: string[] };
  onComplete: (success: boolean) => void;
}

export const StoryDrawActivity: React.FC<StoryDrawActivityProps> = ({ config, onComplete }) => {
  return (
    <div className="h-full flex flex-col bg-slate-50">
       {/* Story Header */}
       <div className="p-6 bg-white border-b border-slate-200 shadow-sm flex items-start gap-4">
           <div className="p-3 bg-brand-100 text-brand-600 rounded-xl hidden md:block">
               <BookOpen className="w-8 h-8" />
           </div>
           <div>
               <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">Story Prompt</h3>
               <p className="text-xl md:text-2xl font-medium text-slate-800 leading-relaxed">
                   "{config.prompt}"
               </p>
           </div>
       </div>

       {/* Drawing Area */}
       <div className="flex-1 overflow-hidden p-2">
           <DrawingCanvas 
               config={{ colors: config.colors }} 
               onComplete={onComplete} 
           />
       </div>
    </div>
  );
};