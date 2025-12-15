
export enum AgeBand {
  TODDLER = '2-3', // Huge icons, minimal text
  PRESCHOOL = '4-6', // Colorful, simple text
  SCHOOL = '7-10' // Charts, more instructions
}

export enum ActivityType {
  FLASH_MEMORY = 'FLASH_MEMORY', // Photographic memory (Item -> Wait -> Pick Item)
  GRID_MEMORY = 'GRID_MEMORY', // Working memory (Pairs)
  SEQUENCE_MEMORY = 'SEQUENCE_MEMORY', // Order Recall (A, B, C -> A, B, C)
  SEQUENCE_BACKWARDS = 'SEQUENCE_BACKWARDS', // Reverse Recall (A, B, C -> C, B, A)
  MATRIX_MEMORY = 'MATRIX_MEMORY', // Spatial Recall (Grid Pattern)
  OBSERVATION = 'OBSERVATION', // Kim's Game (Missing), Count, Odd one out
  MANDALA_MEMORY = 'MANDALA_MEMORY', // Color/Pattern Recall
  DOT_CONNECT = 'DOT_CONNECT', // Spatial Path Recall
  SNAPSHOT_RECALL = 'SNAPSHOT_RECALL', // Scene/Item Placement Recall
  SPEED_RACE = 'SPEED_RACE', // Timed Multiple Choice / Math / Logic
  FLUENCY_GRID = 'FLUENCY_GRID', // Rapid Visual Scanning
  SORTING_SPRINT = 'SORTING_SPRINT', // Categorization (Left/Right)
  N_BACK = 'N_BACK', // Working Memory (Match n-steps ago)
  INSTRUCTION_FOLLOWING = 'INSTRUCTION_FOLLOWING', // Multi-step instructions
  CREATIVE_DRAW = 'CREATIVE_DRAW', // Creativity
  ABACUS = 'ABACUS', // Math/Logic
  BREATHE = 'BREATHE', // Break
  BASELINE_TAP = 'BASELINE_TAP', // For calibration
  RHYTHM = 'RHYTHM', // Visual/Audio Pattern Repeat
  EYE_TRACKING = 'EYE_TRACKING', // Smooth Pursuit
  SHELL_GAME = 'SHELL_GAME', // Object Permanence / Concentration
  FOCUS_HOLD = 'FOCUS_HOLD', // Sustained Attention
  STORY_DRAW = 'STORY_DRAW', // Guided prompt -> Draw
  COLLAGE = 'COLLAGE', // Drag and drop composition
  MEMORY_DRAW = 'MEMORY_DRAW', // Memorize image -> Draw it
  PHOTO_HUNT = 'PHOTO_HUNT', // Camera task -> Upload
  OFFLINE_TASK = 'OFFLINE_TASK' // Real world action -> Confirm
}

export interface Activity {
  id: string;
  templateId?: string; // For i18n lookup
  type: ActivityType;
  title: string;
  description: string;
  durationSeconds: number;
  config?: any; 
}

export enum MasteryLevel {
    NOVICE = 'NOVICE',
    FLUENT = 'FLUENT',
    RAPID = 'RAPID'
}

export interface ItemProgress {
    childId: string;
    itemId: string;
    box: number; // Interval in days (I)
    ease: number; // E-Factor (EF)
    reps: number; // Repetition count (n)
    dueDate: string; // YYYY-MM-DD
    lastReviewDate: string; // YYYY-MM-DD
    streak: number;
    masteryLevel: MasteryLevel;
    history: { date: string, quality: number }[];
    updatedAt?: number; // Timestamp for sync
}

export interface Trophy {
  id: string;
  title: string;
  description: string;
  icon: string;
  condition: (child: ChildProfile) => boolean;
}

export interface ChildProfile {
  id: string;
  parent_id?: string;
  name: string;
  age: number;
  ageBand: AgeBand;
  avatar: string;
  streak: number;
  stars: number;
  dailyLimitMinutes: number;
  todayUsageMinutes: number;
  lastUsageDate: string; // "YYYY-MM-DD"
  bedtimeStart: string; // "20:00"
  bedtimeEnd: string; // "07:00"
  coPlayRequired: boolean;
  language?: string; // 'en' | 'hi'
  unlockedTrophies: string[];
}

export interface UserProfile {
  id: string;
  email: string;
  pin: string;
  consentAgreedAt?: string;
  children: ChildProfile[];
}

export interface SessionState {
  isActive: boolean;
  currentActivityIndex: number;
  activities: Activity[];
  startTime: number | null;
  completedActivities: string[]; 
  earnedStars: number;
}

export interface AppState {
  user: UserProfile | null;
  currentChild: ChildProfile | null;
  itemProgress: Record<string, ItemProgress>; // Key: childId_itemId
  parentMode: boolean;
  session: SessionState;
  lastSyncedAt: number; // New: Global sync timestamp
  
  // Auth Methods
  login: (email: string) => Promise<void>;
  verifyOtp: (email: string, token: string) => Promise<boolean>;
  logout: () => void;

  // Onboarding Methods
  addChild: (child: Partial<ChildProfile>) => void;
  updateUserConsent: () => void;

  // App Methods
  setChild: (child: ChildProfile | null) => void;
  updateChild: (childId: string, updates: Partial<ChildProfile>) => void;
  deleteChild: (childId: string) => void;
  toggleParentMode: (isParent: boolean) => void;
  startSession: () => void; // Changed signature to use generator
  completeActivity: () => void;
  submitActivityResults: (results: {itemId: string, quality: number}[]) => void;
  checkTrophies: () => { newUnlocks: string[] };
  quitSession: () => void;
  addStars: (amount: number) => void;
  incrementUsage: (minutes: number) => void;
}
