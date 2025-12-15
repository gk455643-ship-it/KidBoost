import React, { useState, useEffect, useRef } from 'react';
import { playSound } from '../../lib/sounds';

interface EyeTrackingGameProps {
  config: { path: 'circle' | 'figure8' | 'zigzag'; speed: number; item?: string };
  onComplete: (success: boolean) => void;
}

export const EyeTrackingGame: React.FC<EyeTrackingGameProps> = ({ config, onComplete }) => {
  const [pos, setPos] = useState({ x: 50, y: 50 });
  const [trail, setTrail] = useState<{x: number, y: number, id: number}[]>([]);
  const startTimeRef = useRef(Date.now());
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    const animate = () => {
        const now = Date.now();
        const elapsed = now - startTimeRef.current;
        const duration = config.speed;
        
        const t = (elapsed % duration) / duration;
        let newX = 50;
        let newY = 50;

        if (config.path === 'circle') {
            const angle = t * 2 * Math.PI;
            newX = 50 + 35 * Math.cos(angle);
            newY = 50 + 35 * Math.sin(angle);
        } else if (config.path === 'figure8') {
            const angle = t * 2 * Math.PI;
            newX = 50 + 35 * Math.cos(angle);
            newY = 50 + 20 * Math.sin(2 * angle);
        } else if (config.path === 'zigzag') {
            const tx = (t * 2) % 2; 
            newX = (tx < 1 ? tx : 2 - tx) * 80 + 10;
            const ty = (t * 4) % 2;
            newY = (ty < 1 ? ty : 2 - ty) * 80 + 10;
        }

        setPos({ x: newX, y: newY });
        
        // Add trail
        setTrail(prev => [
            ...prev.slice(-10), 
            { x: newX, y: newY, id: now }
        ]);

        if (elapsed > duration * 3) {
            onComplete(true);
        } else {
            animationFrameRef.current = requestAnimationFrame(animate);
        }
    };

    animationFrameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameRef.current!);
  }, [config, onComplete]);

  return (
    <div className="h-full w-full relative overflow-hidden bg-slate-900 cursor-none">
       <div className="absolute top-8 left-0 right-0 text-center text-slate-500 font-bold text-xl pointer-events-none">
           Follow the {config.item || 'dot'}!
       </div>
       
       {/* Trail */}
       {trail.map((pt, i) => (
           <div 
             key={pt.id}
             className="absolute w-4 h-4 rounded-full bg-green-400/30 blur-sm pointer-events-none"
             style={{ 
                 left: `${pt.x}%`, 
                 top: `${pt.y}%`,
                 transform: 'translate(-50%, -50%)',
                 opacity: i / trail.length
             }}
           />
       ))}

       <div 
         className="absolute w-12 h-12 flex items-center justify-center text-4xl pointer-events-none"
         style={{ 
             left: `${pos.x}%`, 
             top: `${pos.y}%`,
             transform: 'translate(-50%, -50%)' 
         }}
       >
           {config.item || (
               <div className="w-8 h-8 bg-green-400 rounded-full shadow-[0_0_20px_rgba(74,222,128,1)]" />
           )}
       </div>
    </div>
  );
};