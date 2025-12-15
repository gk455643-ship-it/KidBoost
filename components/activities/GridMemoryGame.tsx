import React, { useState, useEffect } from 'react';
import { playSound } from '../../lib/sounds';
import { useAgeStyling } from '../../hooks/useAgeStyling';
import { Sparkles, Brain } from 'lucide-react';

interface GridMemoryGameProps {
  config: { gridSize: number };
  onComplete: (success: boolean, results: {itemId: string, quality: number}[]) => void;
}

const EMOJIS = ["🍎", "🚗", "🐸", "🌟", "🏀", "🎸", "🍦", "🚀", "😺", "🐶", "🦋", "🌈"];

export const GridMemoryGame: React.FC<GridMemoryGameProps> = ({ config, onComplete }) => {
  const styles = useAgeStyling();
  const [cards, setCards] = useState<{id: number, content: string, revealed: boolean, matched: boolean}[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matches, setMatches] = useState(0);
  
  const [itemPerformance, setItemPerformance] = useState<Record<string, number>>({}); 

  useEffect(() => {
    // Determine items based on grid size
    const totalCards = config.gridSize; // Usually 4, 6, 12, etc.
    const pairCount = totalCards / 2;
    
    // Pick pairs
    const selectedEmojis = EMOJIS.sort(() => 0.5 - Math.random()).slice(0, pairCount);
    
    const deck = [...selectedEmojis, ...selectedEmojis]
        .sort(() => 0.5 - Math.random())
        .map((emoji, idx) => ({
            id: idx,
            content: emoji,
            revealed: false,
            matched: false
        }));
    setCards(deck);
    
    const perf: Record<string, number> = {};
    selectedEmojis.forEach(e => perf[e] = 0);
    setItemPerformance(perf);

  }, [config]);

  useEffect(() => {
    if (flipped.length === 2) {
      const [first, second] = flipped;
      
      // Prevent clicking if indices invalid or same card (logic usually prevents this but safety first)
      if (cards[first].id === cards[second].id) {
          setFlipped([]);
          return;
      }

      const match = cards[first].content === cards[second].content;
      
      if (match) {
        playSound('correct');
        setMatches(m => m + 1);
        
        setCards(prev => prev.map(c => 
            (c.id === first || c.id === second) ? { ...c, matched: true, revealed: true } : c
        ));
        setFlipped([]);
      } else {
        playSound('wrong');
        
        // Record mistake
        setItemPerformance(prev => ({
            ...prev,
            [cards[first].content]: (prev[cards[first].content] || 0) + 1,
            [cards[second].content]: (prev[cards[second].content] || 0) + 1
        }));

        const timer = setTimeout(() => {
          setCards(prev => prev.map(c => 
            (c.id === first || c.id === second) ? { ...c, revealed: false } : c
          ));
          setFlipped([]);
        }, 1000);
        return () => clearTimeout(timer);
      }
    }
  }, [flipped, cards]);

  useEffect(() => {
    if (cards.length > 0 && cards.every(c => c.matched)) {
        setTimeout(() => {
            const results = Object.entries(itemPerformance).map(([itemId, mistakes]) => {
                const count = mistakes as number;
                let quality = 5;
                if (count === 1) quality = 3;
                if (count > 1) quality = 1;
                return { itemId, quality };
            });
            onComplete(true, results);
        }, 800);
    }
  }, [cards, onComplete, itemPerformance]);

  const handleCardClick = (idx: number) => {
    if (flipped.length >= 2 || cards[idx].revealed || cards[idx].matched) return;
    
    playSound('pop');
    setCards(prev => prev.map((c, i) => i === idx ? { ...c, revealed: true } : c));
    setFlipped(prev => [...prev, idx]);
  };

  // Grid sizing logic based on count
  const cols = config.gridSize === 4 ? 2 : config.gridSize === 6 ? 3 : config.gridSize === 8 ? 4 : 3;

  return (
    <div className="h-full flex flex-col items-center justify-center p-4">
      <div className="flex items-center gap-2 mb-8 text-slate-400 font-bold uppercase tracking-widest">
           <Brain className="w-5 h-5" /> Memory Pairs
      </div>

      <div 
        className={`grid gap-4 w-full max-w-lg mx-auto ${styles.gridGap}`}
        style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
      >
        {cards.map((card, idx) => (
            <button
                key={idx}
                onClick={() => handleCardClick(idx)}
                disabled={card.revealed || card.matched}
                className="aspect-[3/4] relative perspective-1000 group"
            >
                <div className={`
                    w-full h-full transition-all duration-500 transform preserve-3d
                    ${card.revealed || card.matched ? 'rotate-y-180' : ''}
                `}>
                    {/* Front (Hidden state) */}
                    <div className={`
                        absolute inset-0 backface-hidden bg-brand-500 rounded-2xl shadow-[0_4px_0_0_rgba(194,65,12,1)] border-4 border-brand-400 flex items-center justify-center
                        ${!card.revealed && !card.matched ? 'group-hover:-translate-y-1 group-active:translate-y-0 transition-transform' : ''}
                    `}>
                        <div className="w-full h-full opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjIiIGZpbGw9IiNmZmYiLz48L3N2Zz4=')]"></div>
                        <Sparkles className="w-8 h-8 text-white absolute" />
                    </div>

                    {/* Back (Revealed state) */}
                    <div className={`
                        absolute inset-0 backface-hidden rotate-y-180 bg-white rounded-2xl border-4 flex items-center justify-center shadow-sm overflow-hidden
                        ${card.matched ? 'border-green-400 bg-green-50' : 'border-slate-200'}
                    `}>
                        <span className={`text-5xl md:text-6xl select-none transition-transform ${card.matched ? 'scale-125 animate-bounce-slow' : 'scale-100'}`}>
                            {card.content}
                        </span>
                        {card.matched && (
                            <div className="absolute top-2 right-2 text-green-500">
                                <Sparkles className="w-4 h-4 animate-spin" />
                            </div>
                        )}
                    </div>
                </div>
            </button>
        ))}
      </div>
    </div>
  );
};