import React, { useRef, useState, useEffect } from 'react';
import { Eraser, Check, Undo, Redo, Palette, Brush } from 'lucide-react';
import { playSound } from '../../lib/sounds';

interface DrawingCanvasProps {
  config: { colors: string[] };
  onComplete: (success: boolean) => void;
}

export const DrawingCanvas: React.FC<DrawingCanvasProps> = ({ config, onComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [color, setColor] = useState(config.colors[0] || '#000000');
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushSize, setBrushSize] = useState(12);
  const [tool, setTool] = useState<'pen' | 'eraser'>('pen');
  
  // History for Undo/Redo
  const [history, setHistory] = useState<ImageData[]>([]);
  const [historyStep, setHistoryStep] = useState(-1);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
        // Handle high DPI displays
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.parentElement?.getBoundingClientRect();
        
        if (rect) {
            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;
            canvas.style.width = `${rect.width}px`;
            canvas.style.height = `${rect.height}px`;
            
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.scale(dpr, dpr);
                ctx.lineCap = 'round';
                ctx.lineJoin = 'round';
                // Save initial blank state
                saveState();
            }
        }
    }
  }, []);

  const saveState = () => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (canvas && ctx) {
          // We must use the raw canvas dimensions for getImageData
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          
          const newHistory = history.slice(0, historyStep + 1);
          newHistory.push(imageData);
          
          setHistory(newHistory);
          setHistoryStep(newHistory.length - 1);
      }
  };

  const undo = () => {
      if (historyStep > 0) {
          const step = historyStep - 1;
          restoreState(step);
          setHistoryStep(step);
          playSound('click');
      }
  };

  const redo = () => {
      if (historyStep < history.length - 1) {
          const step = historyStep + 1;
          restoreState(step);
          setHistoryStep(step);
          playSound('click');
      }
  };

  const restoreState = (stepIndex: number) => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (canvas && ctx && history[stepIndex]) {
          ctx.putImageData(history[stepIndex], 0, 0);
      }
  };

  const getPos = (e: React.MouseEvent | React.TouchEvent | any) => {
      const canvas = canvasRef.current;
      if (!canvas) return { x: 0, y: 0 };
      const rect = canvas.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      return {
          x: clientX - rect.left,
          y: clientY - rect.top
      };
  };

  const startDraw = (e: any) => {
      setIsDrawing(true);
      const ctx = canvasRef.current?.getContext('2d');
      const { x, y } = getPos(e);
      if (ctx) {
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.strokeStyle = tool === 'eraser' ? '#ffffff' : color;
          ctx.lineWidth = brushSize;
      }
  };

  const draw = (e: any) => {
      if (!isDrawing) return;
      if (e.type === 'touchmove') e.preventDefault(); // Stop scroll
      
      const ctx = canvasRef.current?.getContext('2d');
      const { x, y } = getPos(e);
      if (ctx) {
        ctx.lineTo(x, y);
        ctx.stroke();
      }
  };

  const stopDraw = () => {
      if (isDrawing) {
          setIsDrawing(false);
          saveState();
      }
  };

  return (
    <div className="h-full flex flex-col p-4 bg-slate-50 relative">
      <div className="flex-1 bg-white rounded-3xl shadow-lg border-4 border-slate-200 overflow-hidden relative touch-none cursor-crosshair">
         <canvas 
            ref={canvasRef}
            className="block w-full h-full"
            onMouseDown={startDraw}
            onMouseMove={draw}
            onMouseUp={stopDraw}
            onMouseLeave={stopDraw}
            onTouchStart={startDraw}
            onTouchMove={draw}
            onTouchEnd={stopDraw}
         />
         
         {/* Undo/Redo Floating Controls */}
         <div className="absolute top-4 left-4 flex gap-2">
             <button 
                onClick={undo} 
                disabled={historyStep <= 0}
                className="p-3 bg-white rounded-full shadow-md border border-slate-200 text-slate-600 disabled:opacity-30 disabled:shadow-none hover:bg-slate-50 transition-all active:scale-95"
             >
                 <Undo className="w-6 h-6" />
             </button>
             <button 
                onClick={redo} 
                disabled={historyStep >= history.length - 1}
                className="p-3 bg-white rounded-full shadow-md border border-slate-200 text-slate-600 disabled:opacity-30 disabled:shadow-none hover:bg-slate-50 transition-all active:scale-95"
             >
                 <Redo className="w-6 h-6" />
             </button>
         </div>

         {/* Brush Size Indicator */}
         <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full border border-slate-200 text-xs font-bold text-slate-400 pointer-events-none">
             Size: {brushSize}
         </div>
      </div>
      
      {/* Controls Area */}
      <div className="mt-4 bg-white p-4 rounded-3xl shadow-sm border border-slate-200">
         <div className="flex flex-col gap-4">
             
             {/* Top Row: Tools & Brush Size */}
             <div className="flex items-center justify-between">
                 <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
                      <button 
                        onClick={() => { setTool('pen'); playSound('click'); }}
                        className={`p-3 rounded-lg transition-all ${tool === 'pen' ? 'bg-white shadow-sm text-brand-500' : 'text-slate-400'}`}
                      >
                          <Brush className="w-6 h-6" />
                      </button>
                      <button 
                        onClick={() => { setTool('eraser'); playSound('click'); }}
                        className={`p-3 rounded-lg transition-all ${tool === 'eraser' ? 'bg-white shadow-sm text-brand-500' : 'text-slate-400'}`}
                      >
                          <Eraser className="w-6 h-6" />
                      </button>
                 </div>

                 {/* Brush Size Slider */}
                 <div className="flex-1 px-6 flex items-center gap-2">
                     <div className="w-2 h-2 rounded-full bg-slate-300" />
                     <input 
                        type="range" 
                        min="4" 
                        max="40" 
                        value={brushSize}
                        onChange={(e) => setBrushSize(parseInt(e.target.value))}
                        className="flex-1 h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-500"
                     />
                     <div className="w-6 h-6 rounded-full bg-slate-300" />
                 </div>

                 <button 
                    onClick={() => onComplete(true)}
                    className="bg-green-500 text-white px-6 py-3 rounded-xl font-bold text-lg shadow-[0px_4px_0px_0px_rgba(21,128,61,1)] active:translate-y-[4px] active:shadow-none flex items-center gap-2 transition-all"
                 >
                     Done <Check />
                 </button>
             </div>

             {/* Bottom Row: Colors */}
             <div className="flex gap-3 overflow-x-auto pb-1 no-scrollbar items-center">
                 <Palette className="w-6 h-6 text-slate-300 mr-2 flex-shrink-0" />
                 {config.colors.map(c => (
                     <button 
                        key={c}
                        onClick={() => { setColor(c); setTool('pen'); playSound('click'); }}
                        className={`
                            w-12 h-12 rounded-full border-4 shadow-sm transition-transform flex-shrink-0 
                            ${color === c && tool === 'pen' ? 'scale-110 border-slate-800 ring-2 ring-slate-100' : 'border-white scale-100'}
                        `}
                        style={{ backgroundColor: c }}
                     />
                 ))}
             </div>
         </div>
      </div>
    </div>
  );
};