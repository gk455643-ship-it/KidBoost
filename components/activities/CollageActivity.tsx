import React, { useState, useRef } from 'react';
import { playSound } from '../../lib/sounds';
import { Check, Trash2, Undo } from 'lucide-react';

interface CollageActivityProps {
  config: { items: string[] };
  onComplete: (success: boolean) => void;
}

interface PlacedItem {
    id: number;
    content: string;
    x: number;
    y: number;
    scale: number;
}

export const CollageActivity: React.FC<CollageActivityProps> = ({ config, onComplete }) => {
  const [items, setItems] = useState<PlacedItem[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Dragging state
  const [dragId, setDragId] = useState<number | null>(null);

  const addItem = (content: string) => {
      playSound('pop');
      const newItem: PlacedItem = {
          id: Date.now(),
          content,
          x: 50, // Center %
          y: 50,
          scale: 1
      };
      setItems(prev => [...prev, newItem]);
  };

  const handleDragStart = (id: number, e: React.MouseEvent | React.TouchEvent) => {
      setDragId(id);
  };

  const handleDragMove = (e: React.MouseEvent | React.TouchEvent) => {
      if (dragId === null || !containerRef.current) return;
      
      const clientX = (e as React.MouseEvent).clientX || (e as React.TouchEvent).touches[0].clientX;
      const clientY = (e as React.MouseEvent).clientY || (e as React.TouchEvent).touches[0].clientY;
      
      const rect = containerRef.current.getBoundingClientRect();
      const x = ((clientX - rect.left) / rect.width) * 100;
      const y = ((clientY - rect.top) / rect.height) * 100;
      
      setItems(prev => prev.map(item => 
          item.id === dragId ? { ...item, x, y } : item
      ));
  };

  const handleDragEnd = () => {
      setDragId(null);
  };

  const removeItem = (id: number, e: React.MouseEvent) => {
      e.stopPropagation();
      playSound('click');
      setItems(prev => prev.filter(i => i.id !== id));
  };

  const clearAll = () => {
      setItems([]);
      playSound('click');
  };

  return (
    <div className="h-full flex flex-col p-4 bg-slate-50">
      {/* Canvas Area */}
      <div 
        ref={containerRef}
        className="flex-1 bg-white rounded-3xl shadow-inner border-4 border-slate-200 relative overflow-hidden touch-none mb-4"
        onMouseMove={handleDragMove}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
        onTouchMove={handleDragMove}
        onTouchEnd={handleDragEnd}
      >
          {items.map(item => (
              <div
                key={item.id}
                onMouseDown={(e) => handleDragStart(item.id, e)}
                onTouchStart={(e) => handleDragStart(item.id, e)}
                className="absolute text-6xl cursor-move select-none transform -translate-x-1/2 -translate-y-1/2 active:scale-110 transition-transform"
                style={{ left: `${item.x}%`, top: `${item.y}%` }}
              >
                  {item.content}
                  {/* Remove Button (Tiny) */}
                  <button 
                    onClick={(e) => removeItem(item.id, e)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-sm w-6 h-6 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                  >
                      <Trash2 className="w-3 h-3" />
                  </button>
              </div>
          ))}
          
          {items.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center text-slate-300 font-bold text-2xl pointer-events-none">
                  Tap emojis to add!
              </div>
          )}
      </div>

      {/* Palette */}
      <div className="bg-white p-4 rounded-3xl shadow-lg border border-slate-100 flex flex-col gap-4">
          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
              {config.items.map((item, i) => (
                  <button
                    key={i}
                    onClick={() => addItem(item)}
                    className="min-w-[64px] h-16 text-4xl flex items-center justify-center bg-slate-50 rounded-xl border-2 border-slate-100 hover:bg-brand-50 hover:border-brand-200 active:scale-90 transition-all"
                  >
                      {item}
                  </button>
              ))}
          </div>

          <div className="flex justify-between items-center">
              <button onClick={clearAll} className="p-3 text-slate-400 hover:text-red-500 transition-colors">
                  <Undo />
              </button>
              <button 
                onClick={() => onComplete(true)}
                className="px-8 py-3 bg-green-500 text-white rounded-xl font-bold shadow-md active:translate-y-1 transition-all flex items-center gap-2"
              >
                  Finish <Check />
              </button>
          </div>
      </div>
    </div>
  );
};