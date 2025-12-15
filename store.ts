import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { AppState, ChildProfile, SessionState, Activity, AgeBand, ItemProgress } from './types';
import { supabase } from './lib/supabase';
import { MOCK_CHILDREN, TROPHIES } from './constants';
import { getTodayDateString } from './lib/safety';
import { generateDailyPlan, calculateSM2, getInitialProgress } from './lib/sm2';
import { db, saveProgressLocal, processSyncQueue, syncDown, getLocalProgressMap } from './lib/db';

interface Store extends AppState {
    syncStatus: 'idle' | 'syncing' | 'offline';
    setSyncStatus: (status: 'idle' | 'syncing' | 'offline') => void;
    initializeSync: () => void;
    checkSessionExpiry: () => void;
}

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      user: null,
      currentChild: null,
      itemProgress: {},
      parentMode: false,
      syncStatus: 'idle',
      lastSyncedAt: 0,
      session: {
        isActive: false,
        currentActivityIndex: 0,
        activities: [],
        startTime: null,
        completedActivities: [],
        earnedStars: 0
      },

      setSyncStatus: (status) => set({ syncStatus: status }),

      // Sync Initialization
      initializeSync: () => {
          const handleOnline = () => {
              set({ syncStatus: 'syncing' });
              // Attempt to push queue
              processSyncQueue()
                .then(() => set({ syncStatus: 'idle' }))
                .catch(() => set({ syncStatus: 'idle' })); // Gentle error handling
          };
          const handleOffline = () => set({ syncStatus: 'offline' });

          window.addEventListener('online', handleOnline);
          window.addEventListener('offline', handleOffline);

          // Initial check
          if (navigator.onLine) {
              handleOnline();
          } else {
              handleOffline();
          }
      },

      checkSessionExpiry: () => {
          const state = get();
          if (state.session.isActive && state.session.startTime) {
              const now = Date.now();
              const hoursElapsed = (now - state.session.startTime) / (1000 * 60 * 60);
              if (hoursElapsed > 4) {
                  // Expire session if older than 4 hours
                  set({
                      session: {
                          isActive: false,
                          currentActivityIndex: 0,
                          activities: [],
                          startTime: null,
                          completedActivities: [],
                          earnedStars: 0
                      }
                  });
              }
          }
      },

      // Auth Actions
      login: async (email: string) => {
        await supabase.auth.signInWithOtp({ email });
      },

      verifyOtp: async (email: string, token: string) => {
        const { data, error } = await supabase.auth.verifyOtp({ email, token, type: 'email' });
        if (error || !data.user) {
            return false;
        }
        
        const currentUser = get().user;
        
        if (currentUser && currentUser.email === email) {
            set({ parentMode: true }); 
            return true;
        }

        const isNewUser = email.includes('new');
        const userProfile = {
            id: data.user.id,
            email: data.user.email!,
            pin: '1234',
            children: isNewUser ? [] : MOCK_CHILDREN,
            consentAgreedAt: isNewUser ? undefined : new Date().toISOString()
        };
        
        set({ user: userProfile, parentMode: true });
        return true;
      },

      logout: async () => {
          await supabase.auth.signOut();
          set({ user: null, currentChild: null, parentMode: false, session: {
            isActive: false,
            currentActivityIndex: 0,
            activities: [],
            startTime: null,
            completedActivities: [],
            earnedStars: 0
          }});
      },

      // Onboarding
      updateUserConsent: () => set((state) => {
          if (!state.user) return {};
          return {
              user: { ...state.user, consentAgreedAt: new Date().toISOString() }
          };
      }),

      addChild: (childData: Partial<ChildProfile>) => set((state) => {
          if (!state.user) return {};
          
          const newChild: ChildProfile = {
              id: `c_${Date.now()}`,
              parent_id: state.user.id,
              name: childData.name || 'Kid',
              age: childData.age || 4,
              ageBand: childData.ageBand || AgeBand.PRESCHOOL,
              avatar: childData.avatar || '🐼',
              streak: 0,
              stars: 0,
              dailyLimitMinutes: childData.dailyLimitMinutes || 30,
              todayUsageMinutes: 0,
              lastUsageDate: getTodayDateString(),
              bedtimeStart: "20:00",
              bedtimeEnd: "07:00",
              coPlayRequired: (childData.age || 4) < 4,
              language: 'en',
              unlockedTrophies: []
          };

          return {
              user: {
                  ...state.user,
                  children: [...state.user.children, newChild]
              }
          };
      }),

      updateChild: (childId: string, updates: Partial<ChildProfile>) => set((state) => {
          if (!state.user) return {};
          const updatedChildren = state.user.children.map(c => 
              c.id === childId ? { ...c, ...updates } : c
          );
          return {
              user: { ...state.user, children: updatedChildren },
              currentChild: state.currentChild?.id === childId ? { ...state.currentChild, ...updates } : state.currentChild
          };
      }),

      deleteChild: (childId: string) => set((state) => {
          if (!state.user) return {};
          return {
              user: { ...state.user, children: state.user.children.filter(c => c.id !== childId) },
              currentChild: state.currentChild?.id === childId ? null : state.currentChild
          };
      }),

      // App Methods
      setChild: (child: ChildProfile | null) => {
          set({ currentChild: child, parentMode: false });
          
          if (child) {
              const state = get();
              // Perform Sync Down (Incremental)
              syncDown(child.id, state.lastSyncedAt).then(async (newTimestamp) => {
                  if (newTimestamp) {
                      set({ lastSyncedAt: newTimestamp });
                  }
                  // Refresh local state from Dexie after sync
                  const map = await getLocalProgressMap(child.id);
                  if (Object.keys(map).length > 0) {
                      set({ itemProgress: map });
                  }
              });
          }
      },
      
      toggleParentMode: (isParent: boolean) => set({ parentMode: isParent }),
      
      startSession: () => set((state) => {
        if (!state.currentChild) return {};

        const plan = generateDailyPlan(state.currentChild, state.itemProgress);

        return {
            session: {
            isActive: true,
            currentActivityIndex: 0,
            activities: plan,
            startTime: Date.now(),
            completedActivities: [],
            earnedStars: 0
            }
        };
      }),

      completeActivity: () => set((state) => {
        const nextIndex = state.session.currentActivityIndex + 1;
        const currentActId = state.session.activities[state.session.currentActivityIndex]?.id;

        return {
          session: {
            ...state.session,
            currentActivityIndex: nextIndex,
            completedActivities: [...state.session.completedActivities, currentActId]
          }
        };
      }),

      submitActivityResults: (results: {itemId: string, quality: number}[]) => set((state) => {
          if (!state.currentChild) return {};

          const childId = state.currentChild.id;
          const newProgressMap = { ...state.itemProgress };
          const changedItems: ItemProgress[] = [];

          results.forEach(res => {
              const key = `${childId}_${res.itemId}`;
              const current = newProgressMap[key] || getInitialProgress(childId, res.itemId);
              const updated = calculateSM2(current, res.quality);
              newProgressMap[key] = updated;
              changedItems.push(updated);
          });

          // SAVE TO DEXIE (Which queues Sync)
          saveProgressLocal(changedItems).catch(err => console.error("Dexie Save Error", err));

          return { itemProgress: newProgressMap };
      }),

      checkTrophies: () => {
          const state = get();
          if (!state.currentChild || !state.user) return { newUnlocks: [] };

          const child = state.currentChild;
          const newUnlocks: string[] = [];
          
          TROPHIES.forEach(trophy => {
              if (!child.unlockedTrophies.includes(trophy.id)) {
                  if (trophy.condition(child)) {
                      newUnlocks.push(trophy.id);
                  }
              }
          });

          if (newUnlocks.length > 0) {
              const updatedChild = {
                  ...child,
                  unlockedTrophies: [...child.unlockedTrophies, ...newUnlocks]
              };
              
              const updatedChildren = state.user.children.map(c => 
                c.id === updatedChild.id ? updatedChild : c
              );

              set({ 
                  currentChild: updatedChild,
                  user: { ...state.user, children: updatedChildren }
              });
          }

          return { newUnlocks };
      },

      quitSession: () => set({
        session: {
          isActive: false,
          currentActivityIndex: 0,
          activities: [],
          startTime: null,
          completedActivities: [],
          earnedStars: 0
        }
      }),

      addStars: (amount: number) => set((state) => {
        if (!state.currentChild || !state.user) return {};
        
        const updatedChild = {
            ...state.currentChild,
            stars: state.currentChild.stars + amount
        };

        const updatedChildren = state.user.children.map(c => 
            c.id === updatedChild.id ? updatedChild : c
        );
        
        let updatedSession = state.session;
        if (state.session.isActive) {
            updatedSession = {
                ...state.session,
                earnedStars: (state.session.earnedStars || 0) + amount
            };
        }

        return {
          currentChild: updatedChild,
          user: {
              ...state.user,
              children: updatedChildren
          },
          session: updatedSession
        };
      }),

      incrementUsage: (minutes: number) => set((state) => {
          if (!state.currentChild || !state.user) return {};

          const today = getTodayDateString();
          let newUsage = state.currentChild.todayUsageMinutes;

          if (state.currentChild.lastUsageDate !== today) {
              newUsage = 0;
          }

          newUsage += minutes;

          const updatedChild = {
              ...state.currentChild,
              todayUsageMinutes: newUsage,
              lastUsageDate: today
          };

          const updatedChildren = state.user.children.map(c => 
            c.id === updatedChild.id ? updatedChild : c
          );

          return {
              currentChild: updatedChild,
              user: { ...state.user, children: updatedChildren }
          };
      })
    }),
    {
      name: 'kidboost-storage', 
      storage: createJSONStorage(() => localStorage), 
      partialize: (state) => ({ 
          user: state.user, 
          currentChild: state.currentChild,
          itemProgress: state.itemProgress,
          session: state.session,
          parentMode: state.parentMode,
          lastSyncedAt: state.lastSyncedAt
      }), 
    }
  )
);
