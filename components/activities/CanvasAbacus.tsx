import React, { useRef, useEffect, useState } from 'react';
import { playSound } from '../../lib/sounds';
import { RefreshCw, Check } from 'lucide-react';

interface CanvasAbacusProps {
  config: { 
      mode: 'free' | 'set' | 'add'; 
      target?: number; 
      equation?: string; 
      columns?: number; 
  };
  onComplete: (success: boolean) => void;
}

export const CanvasAbacus: React.FC<CanvasAbacusProps> = ({ config, onComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [columns] = useState(config.columns || 3); 
  const [values, setValues] = useState<number[]>(new Array(config.columns || 3).fill(0));
  
  const FRAME_PADDING = 20;
  const TOP_MARGIN = 60;
  const BEAD_HEIGHT = 28;
  const BEAD_WIDTH = 54;
  const BEAM_Y = 160;
  const ROD_SPACING = 70;

  const targetValue = config.mode === 'set' ? (config.target || 0) : 
                      config.mode === 'add' ? eval(config.equation || "0") : 0;

  useEffect(() => {
     draw();
  }, [values, columns]);

  const draw = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      // Wood Frame
      const grdFrame = ctx.createLinearGradient(0, 0, width, 0);
      grdFrame.addColorStop(0, '#8B4513');
      grdFrame.addColorStop(0.5, '#A0522D');
      grdFrame.addColorStop(1, '#8B4513');
      ctx.fillStyle = grdFrame;
      ctx.roundRect(FRAME_PADDING, TOP_MARGIN, width - 2 * FRAME_PADDING, height - TOP_MARGIN - 20, 10);
      ctx.fill();
      
      // Inner Background
      ctx.fillStyle = '#FDF5E6'; 
      ctx.fillRect(FRAME_PADDING + 10, TOP_MARGIN + 10, width - 2 * FRAME_PADDING - 20, height - TOP_MARGIN - 40);

      // Beam
      ctx.fillStyle = '#5D4037';
      ctx.fillRect(FRAME_PADDING, BEAM_Y, width - 2 * FRAME_PADDING, 12);
      // Beam highlight
      ctx.fillStyle = 'rgba(255,255,255,0.1)';
      ctx.fillRect(FRAME_PADDING, BEAM_Y, width - 2 * FRAME_PADDING, 3);

      const startX = (width - (columns * ROD_SPACING)) / 2 + ROD_SPACING / 2;
      
      // Rods
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 4;
      for (let i = 0; i < columns; i++) {
          const x = startX + i * ROD_SPACING;
          ctx.beginPath();
          ctx.moveTo(x, TOP_MARGIN + 10);
          ctx.lineTo(x, height - 30);
          ctx.stroke();
      }

      // Beads
      for (let i = 0; i < columns; i++) {
          const x = startX + i * ROD_SPACING;
          const val = values[i];
          const heavenActive = val >= 5;
          const earthCount = val % 5;

          // Heaven Bead
          const heavenY = heavenActive ? BEAM_Y - BEAD_HEIGHT - 4 : TOP_MARGIN + 20;
          drawBead(ctx, x, heavenY, '#EF4444'); // Red

          // Earth Beads
          for (let b = 0; b < 4; b++) {
              let y = 0;
              if (b < earthCount) {
                  y = BEAM_Y + 16 + b * BEAD_HEIGHT; // Active (Up)
              } else {
                  y = height - 35 - (4 - b) * BEAD_HEIGHT; // Inactive (Down)
              }
              drawBead(ctx, x, y, '#3B82F6'); // Blue
          }
      }
  };

  const drawBead = (ctx: CanvasRenderingContext2D, cx: number, cy: number, colorHex: string) => {
      // Bead Shape
      ctx.beginPath();
      // Hex shape approximation for bead
      const w = BEAD_WIDTH / 2;
      const h = BEAD_HEIGHT / 2;
      
      ctx.moveTo(cx - w, cy + h);
      ctx.lineTo(cx - w + 5, cy);
      ctx.lineTo(cx + w - 5, cy);
      ctx.lineTo(cx + w, cy + h);
      ctx.lineTo(cx + w - 5, cy + 2*h);
      ctx.lineTo(cx - w + 5, cy + 2*h);
      ctx.closePath();

      // Gradient
      const grd = ctx.createRadialGradient(cx - 5, cy + h - 5, 2, cx, cy + h, w);
      grd.addColorStop(0, 'white');
      grd.addColorStop(0.3, colorHex);
      grd.addColorStop(1, adjustColor(colorHex, -40));
      
      ctx.fillStyle = grd;
      ctx.fill();
      
      ctx.strokeStyle = 'rgba(0,0,0,0.3)';
      ctx.lineWidth = 1;
      ctx.stroke();
  };

  const adjustColor = (color: string, amount: number) => {
    return '#' + color.replace(/^#/, '').replace(/../g, color => ('0'+Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)).substr(-2));
  }

  const handleCanvasClick = (e: React.MouseEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;
      const width = canvas.width;
      const height = canvas.height;

      const startX = (width - (columns * ROD_SPACING)) / 2 + ROD_SPACING / 2;

      let colIndex = -1;
      for (let i = 0; i < columns; i++) {
          const rodX = startX + i * ROD_SPACING;
          if (Math.abs(clickX - rodX) < BEAD_WIDTH / 2 + 15) {
              colIndex = i;
              break;
          }
      }

      if (colIndex === -1) return;

      const currentVal = values[colIndex];
      let newVal = currentVal;
      const heavenActive = currentVal >= 5;
      const earthCount = currentVal % 5;

      if (clickY < BEAM_Y) {
          newVal = heavenActive ? currentVal - 5 : currentVal + 5;
          playSound('click');
      } else {
          const earthTop = BEAM_Y + 12;
          const earthBottom = height - 30;
          
          if (clickY > earthTop && clickY < earthBottom) {
               let clickedBead = -1;
               for (let b = 0; b < 4; b++) {
                   let y = (b < earthCount) ? BEAM_Y + 16 + b * BEAD_HEIGHT : height - 35 - (4 - b) * BEAD_HEIGHT;
                   if (clickY >= y && clickY <= y + BEAD_HEIGHT) {
                       clickedBead = b;
                       break;
                   }
               }

               if (clickedBead !== -1) {
                    if (clickedBead < earthCount) {
                        newVal = (heavenActive ? 5 : 0) + clickedBead;
                    } else {
                        newVal = (heavenActive ? 5 : 0) + (clickedBead + 1);
                    }
                    playSound('click');
               }
          }
      }

      if (newVal !== currentVal) {
          const newValues = [...values];
          newValues[colIndex] = newVal;
          setValues(newValues);
      }
  };

  const checkSolution = () => {
      let currentTotal = 0;
      for (let i = 0; i < columns; i++) {
          const power = columns - 1 - i;
          currentTotal += values[i] * Math.pow(10, power);
      }

      if (currentTotal === targetValue) {
          playSound('correct');
          onComplete(true);
      } else {
          playSound('wrong');
      }
  };

  const reset = () => {
      setValues(new Array(columns).fill(0));
      playSound('click');
  };

  return (
    <div className="h-full flex flex-col items-center justify-center bg-slate-50 p-4">
      <div className="mb-6 text-center animate-fadeIn">
          {config.mode === 'free' && <h2 className="text-3xl font-bold text-slate-600">Free Play</h2>}
          {config.mode === 'set' && (
              <>
                <h2 className="text-2xl text-slate-500 font-bold mb-2">Show me:</h2>
                <div className="text-6xl font-black text-brand-600">{config.target}</div>
              </>
          )}
          {config.mode === 'add' && (
              <>
                <h2 className="text-2xl text-slate-500 font-bold mb-2">Solve:</h2>
                <div className="text-6xl font-black text-brand-600">{config.equation} = ?</div>
              </>
          )}
      </div>

      <div className="bg-white p-4 rounded-3xl shadow-xl border-4 border-slate-200">
          <canvas 
            ref={canvasRef} 
            width={Math.min(window.innerWidth - 40, 400)} 
            height={320}
            onClick={handleCanvasClick}
            className="cursor-pointer touch-none"
          />
      </div>

      <div className="mt-6 flex gap-4 items-center">
          <div className="px-6 py-3 bg-white rounded-xl border-2 border-slate-100 font-mono text-2xl text-slate-500 shadow-sm">
             Val: <span className="font-bold text-slate-800">
                 {parseInt(values.join(''))}
             </span>
          </div>
      </div>

      <div className="mt-8 flex gap-6">
          <button onClick={reset} className="w-16 h-16 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center hover:bg-slate-300">
              <RefreshCw />
          </button>

          {config.mode !== 'free' ? (
              <button 
                onClick={checkSolution}
                className="px-10 py-4 bg-green-500 hover:bg-green-600 text-white rounded-2xl font-bold text-xl shadow-[0px_6px_0px_0px_rgba(21,128,61,1)] active:translate-y-[6px] active:shadow-none transition-all flex items-center gap-2"
              >
                  Check <Check />
              </button>
          ) : (
               <button 
                onClick={() => onComplete(true)}
                className="px-10 py-4 bg-blue-500 hover:bg-blue-600 text-white rounded-2xl font-bold text-xl shadow-[0px_6px_0px_0px_rgba(29,78,216,1)] active:translate-y-[6px] active:shadow-none transition-all flex items-center gap-2"
              >
                  Done
              </button>
          )}
      </div>
    </div>
  );
};