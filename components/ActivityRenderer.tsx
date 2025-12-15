import React, { useEffect, useState } from 'react';
import { Activity, ActivityType, MasteryLevel } from '../types';
import { useStore } from '../store';
import { useTranslation } from '../lib/i18n';
import { useAgeStyling } from '../hooks/useAgeStyling';
import { TeacherAvatar } from './TeacherAvatar';
import { Play, ArrowRight, Trophy, Star, Loader2, AlertCircle } from 'lucide-react';
import { playSound } from '../lib/sounds';
import confetti from 'canvas-confetti';

// Sub-components for activities
import { FlashMemoryGame } from './activities/FlashMemoryGame';
import { GridMemoryGame } from './activities/GridMemoryGame';
import { DrawingCanvas } from './activities/DrawingCanvas';
import { BreatheActivity } from './activities/BreatheActivity';
import { SequenceGame } from './activities/SequenceGame';
import { MatrixGame } from './activities/MatrixGame';
import { ObservationGame } from './activities/ObservationGame';
import { MandalaGame } from './activities/MandalaGame';
import { DotConnectGame } from './activities/DotConnectGame';
import { SnapshotGame } from './activities/SnapshotGame';
import { SpeedRaceGame } from './activities/SpeedRaceGame';
import { FluencyGame } from './activities/FluencyGame';
import { SortingGame } from './activities/SortingGame';
import { NBackGame } from './activities/NBackGame';
import { InstructionGame } from './activities/InstructionGame';
import { CanvasAbacus } from './activities/CanvasAbacus';
import { RhythmGame } from './activities/RhythmGame';
import { EyeTrackingGame } from './activities/EyeTrackingGame';
import { ShellGame } from './activities/ShellGame';
import { FocusHoldGame } from './activities/FocusHoldGame';
import { StoryDrawActivity } from './activities/StoryDrawActivity';
import { CollageActivity } from './activities/CollageActivity';
import { MemoryDrawActivity } from './activities/MemoryDrawActivity';
import { PhotoHuntActivity } from './activities/PhotoHuntActivity';
import { OfflineTaskActivity } from './activities/OfflineTaskActivity';

interface ActivityRendererProps {
  activity: Activity;
}

export const ActivityRenderer: React.FC<ActivityRendererProps> = ({ activity }) => {
  const completeActivity = useStore((state) => state.completeActivity);
  const submitActivityResults = useStore((state) => state.submitActivityResults);
  const addStars = useStore((state) => state.addStars);
  const checkTrophies = useStore((state) => state.checkTrophies);
  const itemProgress = useStore((state) => state.itemProgress);
  const currentChild = useStore(state => state.currentChild);
  const { t } = useTranslation();
  
  const styles = useAgeStyling();

  const [stage, setStage] = useState<'intro' | 'active' | 'success'>('intro');
  const [newUnlocks, setNewUnlocks] = useState<string[]>([]);
  const [result, setResult] = useState<{success: boolean}>({success: true});
  const [practicedItems, setPracticedItems] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [interactionLocked, setInteractionLocked] = useState(false);
  
  // Reset stage when activity changes
  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => {
        setStage('intro');
        setNewUnlocks([]);
        setResult({success: true});
        setPracticedItems([]);
        setInteractionLocked(false);
        setLoading(false);
        
        // Auto sound for intro
        playSound('pop');
    }, 500); // Artificial delay to smooth transition
    return () => clearTimeout(t);
  }, [activity.id]);

  const handleComplete = (success: boolean, results: {itemId: string, quality: number}[] = []) => {
    if (interactionLocked) return;
    setInteractionLocked(true); // Prevent double completion

    setResult({ success });
    
    if (success) {
      playSound('fanfare');
      confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
      });
      addStars(10); // Reward
      
      // Submit SM-2 results if any
      if (results.length > 0) {
          submitActivityResults(results);
          // Store item IDs to show mastery updates
          setPracticedItems(results.map(r => r.itemId));
      }

      // Check for trophies
      const { newUnlocks: unlocks } = checkTrophies();
      if (unlocks.length > 0) {
          setNewUnlocks(unlocks);
          playSound('success'); // Additional ding for trophy
      }

    } else {
      playSound('wrong');
    }
    
    setStage('success');
    setInteractionLocked(false);
  };

  const handleNext = () => {
    if (interactionLocked) return;
    setInteractionLocked(true);
    playSound('click');
    completeActivity();
  };

  const startActive = () => {
      if (interactionLocked) return;
      playSound('pop');
      setStage('active');
  };

  if (loading) {
      return (
          <div className="h-full flex items-center justify-center">
              <Loader2 className="w-12 h-12 text-brand-500 animate-spin" />
          </div>
      );
  }

  if (!activity) {
      return (
          <div className="h-full flex flex-col items-center justify-center p-8 text-center text-slate-400">
              <AlertCircle className="w-12 h-12 mb-2" />
              <p>Activity not found.</p>
              <button onClick={() => completeActivity()} className="mt-4 text-brand-500 font-bold">Skip</button>
          </div>
      );
  }

  if (stage === 'intro') {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center animate-fadeIn">
        <TeacherAvatar emotion="excited" size="lg" className="mb-8" />
        <h1 className={`text-brand-600 mb-6 ${styles.title}`}>
          {activity.templateId ? t(`act_title_${activity.templateId}` as any) || activity.title : activity.title}
        </h1>
        <p className={`text-slate-600 mb-12 max-w-lg ${styles.body}`}>
          {activity.templateId ? t(`act_desc_${activity.templateId}` as any) || activity.description : activity.description}
        </p>
        <button
          onClick={startActive}
          disabled={interactionLocked}
          className={`group relative inline-flex items-center justify-center bg-brand-500 text-white font-bold transition-all duration-200 hover:bg-brand-600 shadow-[0px_6px_0px_0px_rgba(194,65,12,1)] active:shadow-none active:translate-y-[6px] disabled:opacity-50 disabled:shadow-none disabled:translate-y-0 ${styles.button}`}
        >
          <Play className="w-8 h-8 mr-3 fill-current" />
          {t('start')}
        </button>
      </div>
    );
  }

  if (stage === 'success') {
     const { success } = result;

     return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center animate-fadeIn relative">
        <TeacherAvatar emotion={success ? "happy" : "wrong"} size="lg" className="mb-8" />
        
        <h1 className={`mb-4 ${styles.title} ${success ? 'text-green-500' : 'text-slate-600'}`}>
            {success ? t('good_job') : t('nice_try')}
        </h1>
        
        {success ? (
            <div className="flex flex-col items-center gap-6 mb-12">
                 {/* Item Mastery Updates */}
                 {practicedItems.length > 0 && currentChild && (
                     <div className="flex flex-wrap justify-center gap-4">
                         {practicedItems.slice(0, 3).map(itemId => {
                             const key = `${currentChild.id}_${itemId}`;
                             const progress = itemProgress[key];
                             const level = progress?.masteryLevel || MasteryLevel.NOVICE;
                             const stars = level === MasteryLevel.RAPID ? 3 : level === MasteryLevel.FLUENT ? 2 : 1;
                             
                             return (
                                 <div key={itemId} className="bg-white p-3 rounded-2xl shadow-sm border-2 border-slate-100 flex flex-col items-center animate-bounce-slow">
                                     <div className="text-3xl mb-1">{itemId.startsWith('#') || itemId.length > 4 ? '🧠' : itemId}</div>
                                     <div className="flex gap-1">
                                         {[1,2,3].map(s => (
                                             <Star key={s} className={`w-4 h-4 ${s <= stars ? 'text-yellow-400 fill-current' : 'text-slate-200'}`} />
                                         ))}
                                     </div>
                                 </div>
                             );
                         })}
                     </div>
                 )}

                 {/* Generic Stars if no items or overflow */}
                 {practicedItems.length === 0 && (
                     <div className="flex gap-2">
                        {[1,2,3].map(i => (
                            <div key={i} className="text-6xl animate-bounce" style={{ animationDelay: `${i*0.2}s` }}>⭐</div>
                        ))}
                    </div>
                 )}
            </div>
        ) : (
             <p className={`text-slate-500 mb-12 ${styles.body}`}>{t('retry')}</p>
        )}

        {newUnlocks.length > 0 && (
            <div className="absolute top-10 right-10 animate-bounce-slow bg-yellow-400 p-4 rounded-xl shadow-lg border-4 border-white rotate-12">
                 <div className="text-center text-white">
                     <Trophy className="w-10 h-10 mx-auto mb-1" />
                     <div className="font-black text-xs uppercase">{t('unlocked')}!</div>
                 </div>
            </div>
        )}

        <button
          onClick={handleNext}
          disabled={interactionLocked}
          className={`group relative inline-flex items-center justify-center bg-brand-500 text-white font-bold transition-all duration-200 hover:bg-brand-600 shadow-[0px_6px_0px_0px_rgba(194,65,12,1)] active:shadow-none active:translate-y-[6px] disabled:opacity-50 disabled:shadow-none disabled:translate-y-0 ${styles.button}`}
        >
          {t('next')} <ArrowRight className="w-8 h-8 ml-3" />
        </button>
      </div>
    );
  }

  // Active Stage Renderer
  return (
    <div className="h-full w-full flex flex-col relative">
       {/* Top Bar */}
       <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10 pointer-events-none">
          <div className="bg-white/90 backdrop-blur px-4 py-2 rounded-xl shadow-sm border border-slate-100 pointer-events-auto">
             <span className="font-bold text-slate-500 text-lg uppercase tracking-wider">{activity.type.replace('_', ' ')}</span>
          </div>
       </div>

       {/* Game Container */}
       <div className="flex-1 overflow-hidden">
          {activity.type === ActivityType.FLASH_MEMORY && (
              <FlashMemoryGame config={activity.config} onComplete={handleComplete} />
          )}
          {activity.type === ActivityType.GRID_MEMORY && (
              <GridMemoryGame config={activity.config} onComplete={handleComplete} />
          )}
          {activity.type === ActivityType.SEQUENCE_MEMORY && (
              <SequenceGame config={activity.config} onComplete={handleComplete} />
          )}
          {activity.type === ActivityType.SEQUENCE_BACKWARDS && (
              <SequenceGame config={activity.config} reverse={true} onComplete={handleComplete} />
          )}
          {activity.type === ActivityType.MATRIX_MEMORY && (
              <MatrixGame config={activity.config} onComplete={(s) => handleComplete(s)} />
          )}
          {activity.type === ActivityType.OBSERVATION && (
              <ObservationGame config={activity.config} onComplete={(s) => handleComplete(s)} />
          )}
          {activity.type === ActivityType.MANDALA_MEMORY && (
              <MandalaGame config={activity.config} onComplete={(s) => handleComplete(s)} />
          )}
          {activity.type === ActivityType.DOT_CONNECT && (
              <DotConnectGame config={activity.config} onComplete={(s) => handleComplete(s)} />
          )}
          {activity.type === ActivityType.SNAPSHOT_RECALL && (
              <SnapshotGame config={activity.config} onComplete={(s) => handleComplete(s)} />
          )}
          {activity.type === ActivityType.SPEED_RACE && (
              <SpeedRaceGame config={activity.config} onComplete={(s) => handleComplete(s)} />
          )}
          {activity.type === ActivityType.FLUENCY_GRID && (
              <FluencyGame config={activity.config} onComplete={(s) => handleComplete(s)} />
          )}
          {activity.type === ActivityType.SORTING_SPRINT && (
              <SortingGame config={activity.config} onComplete={(s) => handleComplete(s)} />
          )}
          {activity.type === ActivityType.N_BACK && (
              <NBackGame config={activity.config} onComplete={(s) => handleComplete(s)} />
          )}
          {activity.type === ActivityType.INSTRUCTION_FOLLOWING && (
              <InstructionGame config={activity.config} onComplete={(s) => handleComplete(s)} />
          )}
          {activity.type === ActivityType.ABACUS && (
              <CanvasAbacus config={activity.config} onComplete={(s) => handleComplete(s)} />
          )}
          {activity.type === ActivityType.RHYTHM && (
              <RhythmGame config={activity.config} onComplete={(s) => handleComplete(s)} />
          )}
          {activity.type === ActivityType.EYE_TRACKING && (
              <EyeTrackingGame config={activity.config} onComplete={(s) => handleComplete(s)} />
          )}
          {activity.type === ActivityType.SHELL_GAME && (
              <ShellGame config={activity.config} onComplete={(s) => handleComplete(s)} />
          )}
          {activity.type === ActivityType.FOCUS_HOLD && (
              <FocusHoldGame config={activity.config} onComplete={(s) => handleComplete(s)} />
          )}
          {activity.type === ActivityType.CREATIVE_DRAW && (
              <DrawingCanvas config={activity.config} onComplete={(s) => handleComplete(s)} />
          )}
          {activity.type === ActivityType.STORY_DRAW && (
              <StoryDrawActivity config={activity.config} onComplete={(s) => handleComplete(s)} />
          )}
          {activity.type === ActivityType.COLLAGE && (
              <CollageActivity config={activity.config} onComplete={(s) => handleComplete(s)} />
          )}
          {activity.type === ActivityType.MEMORY_DRAW && (
              <MemoryDrawActivity config={activity.config} onComplete={(s) => handleComplete(s)} />
          )}
          {activity.type === ActivityType.PHOTO_HUNT && (
              <PhotoHuntActivity config={activity.config} onComplete={(s) => handleComplete(s)} />
          )}
          {activity.type === ActivityType.OFFLINE_TASK && (
              <OfflineTaskActivity config={activity.config} onComplete={(s) => handleComplete(s)} />
          )}
          {activity.type === ActivityType.BREATHE && (
              <BreatheActivity duration={activity.durationSeconds} onComplete={(s) => handleComplete(s)} />
          )}
          
          {/* Fallback */}
          {![
              ActivityType.FLASH_MEMORY, ActivityType.GRID_MEMORY, ActivityType.SEQUENCE_MEMORY, 
              ActivityType.MATRIX_MEMORY, ActivityType.OBSERVATION, ActivityType.CREATIVE_DRAW, 
              ActivityType.BREATHE, ActivityType.MANDALA_MEMORY, ActivityType.DOT_CONNECT, 
              ActivityType.SNAPSHOT_RECALL, ActivityType.SPEED_RACE, ActivityType.FLUENCY_GRID, 
              ActivityType.SORTING_SPRINT, ActivityType.N_BACK, ActivityType.SEQUENCE_BACKWARDS,
              ActivityType.INSTRUCTION_FOLLOWING, ActivityType.ABACUS, ActivityType.RHYTHM,
              ActivityType.EYE_TRACKING, ActivityType.SHELL_GAME, ActivityType.FOCUS_HOLD,
              ActivityType.STORY_DRAW, ActivityType.COLLAGE, ActivityType.MEMORY_DRAW,
              ActivityType.PHOTO_HUNT, ActivityType.OFFLINE_TASK
            ].includes(activity.type) && (
              <div className="h-full flex flex-col items-center justify-center">
                  <p className="text-2xl text-slate-400">Activity Coming Soon</p>
                  <button onClick={() => handleComplete(true)} className="mt-4 px-6 py-3 bg-slate-200 rounded-xl">{t('skip')}</button>
              </div>
          )}
       </div>
    </div>
  );
};