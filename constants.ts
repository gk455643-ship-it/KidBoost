import { ActivityType, AgeBand, ChildProfile, Trophy } from "./types";

export const PARENT_PIN = "1234"; // Default for demo

export const TROPHIES: Trophy[] = [
    {
        id: 'first_steps',
        title: 'First Steps',
        description: 'Complete your first session',
        icon: '👟',
        condition: (c) => c.stars > 0
    },
    {
        id: 'streak_3',
        title: 'On Fire!',
        description: 'Reach a 3-day streak',
        icon: '🔥',
        condition: (c) => c.streak >= 3
    },
    {
        id: 'streak_7',
        title: 'Week Warrior',
        description: 'Reach a 7-day streak',
        icon: '🏆',
        condition: (c) => c.streak >= 7
    },
    {
        id: 'star_collector',
        title: 'Star Collector',
        description: 'Earn 100 stars',
        icon: '⭐',
        condition: (c) => c.stars >= 100
    },
    {
        id: 'super_star',
        title: 'Super Star',
        description: 'Earn 500 stars',
        icon: '🌟',
        condition: (c) => c.stars >= 500
    },
    {
        id: 'night_owl',
        title: 'Night Owl',
        description: 'Practice after 6 PM',
        icon: '🦉',
        condition: (_c) => {
             const now = new Date();
             return now.getHours() >= 18;
        }
    }
];

export const MOCK_CHILDREN: ChildProfile[] = [
  {
    id: "c1",
    name: "Leo",
    age: 5,
    ageBand: AgeBand.PRESCHOOL,
    avatar: "🦁",
    streak: 12,
    stars: 340,
    dailyLimitMinutes: 45,
    todayUsageMinutes: 15,
    lastUsageDate: new Date().toISOString().split('T')[0],
    bedtimeStart: "20:00",
    bedtimeEnd: "07:00",
    coPlayRequired: false,
    unlockedTrophies: ['first_steps', 'streak_3', 'star_collector']
  },
  {
    id: "c2",
    name: "Mia",
    age: 3,
    ageBand: AgeBand.TODDLER,
    avatar: "🐱",
    streak: 3,
    stars: 45,
    dailyLimitMinutes: 30,
    todayUsageMinutes: 0,
    lastUsageDate: new Date().toISOString().split('T')[0],
    bedtimeStart: "19:30",
    bedtimeEnd: "06:30",
    coPlayRequired: true,
    unlockedTrophies: ['first_steps']
  }
];

// Pool of items to learn
export const CURRICULUM_ITEMS = {
    ANIMALS: ["🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼", "🐸", "🐯", "🦁", "🐮", "🐷"],
    COLORS: ["#EF4444", "#3B82F6", "#10B981", "#F59E0B", "#8B5CF6", "#EC4899", "#000000", "#FFFFFF"],
    NUMBERS: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
    SHAPES: ["Square", "Circle", "Triangle", "Star"],
    FRUIT: ["🍎", "🍌", "🍇", "🍊", "🍓", "🍍", "🥝", "🍒"],
    VEHICLES: ["🚗", "🚌", "🚑", "🚓", "🚒", "🚕", "🚚", "🚲"]
};

// --- ACTIVITY TEMPLATES ---

export const ACTIVITY_TEMPLATES = {
  // --- BASIC MEMORY ---
  FLASH_ANIMALS: {
    type: ActivityType.FLASH_MEMORY,
    title: "Animal Flash",
    description: "Remember the animal!",
    durationSeconds: 30,
    config: { items: CURRICULUM_ITEMS.ANIMALS }
  },
  FLASH_COLORS: {
    type: ActivityType.FLASH_MEMORY,
    title: "Color Flash",
    description: "Watch the color carefully.",
    durationSeconds: 30,
    config: { items: CURRICULUM_ITEMS.COLORS }
  },
  FLASH_NUMBERS: {
    type: ActivityType.FLASH_MEMORY,
    title: "Number Flash",
    description: "Memorize the number.",
    durationSeconds: 30,
    config: { items: CURRICULUM_ITEMS.NUMBERS }
  },
  GRID_PAIRS_4: {
    type: ActivityType.GRID_MEMORY,
    title: "Tiny Pairs",
    description: "Find the matching pairs.",
    durationSeconds: 60,
    config: { gridSize: 4 }
  },
  GRID_PAIRS_6: {
    type: ActivityType.GRID_MEMORY,
    title: "More Pairs",
    description: "Can you find all 3 pairs?",
    durationSeconds: 90,
    config: { gridSize: 6 }
  },
  SEQUENCE_3: {
    type: ActivityType.SEQUENCE_MEMORY,
    title: "Order Up",
    description: "Tap the items in the order they appeared.",
    durationSeconds: 45,
    config: { length: 3, items: [...CURRICULUM_ITEMS.ANIMALS, ...CURRICULUM_ITEMS.FRUIT] }
  },
  SEQUENCE_NUMBERS: {
    type: ActivityType.SEQUENCE_MEMORY,
    title: "Number Train",
    description: "Remember the code!",
    durationSeconds: 45,
    config: { length: 4, items: CURRICULUM_ITEMS.NUMBERS }
  },
  KIMS_GAME_3: {
    type: ActivityType.OBSERVATION,
    title: "Missing Friend",
    description: "Who is hiding?",
    durationSeconds: 45,
    config: { mode: 'missing', count: 3, items: CURRICULUM_ITEMS.ANIMALS }
  },
  KIMS_GAME_5: {
    type: ActivityType.OBSERVATION,
    title: "Expert Detective",
    description: "Spot the missing item from the group.",
    durationSeconds: 60,
    config: { mode: 'missing', count: 5, items: [...CURRICULUM_ITEMS.ANIMALS, ...CURRICULUM_ITEMS.VEHICLES] }
  },
  MATRIX_2X2: {
    type: ActivityType.MATRIX_MEMORY,
    title: "Pattern Match",
    description: "Copy the pattern in the grid.",
    durationSeconds: 45,
    config: { gridSize: 2, fillCount: 2 }
  },
  MATRIX_3X3: {
    type: ActivityType.MATRIX_MEMORY,
    title: "Big Pattern",
    description: "Remember the larger pattern.",
    durationSeconds: 60,
    config: { gridSize: 3, fillCount: 4 }
  },
  COUNT_ITEMS: {
    type: ActivityType.OBSERVATION,
    title: "How Many?",
    description: "Count the items quickly!",
    durationSeconds: 30,
    config: { mode: 'count', min: 3, max: 8, items: CURRICULUM_ITEMS.FRUIT }
  },
  DRAW: {
    type: ActivityType.CREATIVE_DRAW,
    title: "Creative Time",
    description: "Let's draw something fun!",
    durationSeconds: 120,
    config: { colors: ["#EF4444", "#3B82F6", "#F59E0B", "#10B981", "#000000"] }
  },
  BREATHE: {
    type: ActivityType.BREATHE,
    title: "Rest Time",
    description: "Take a deep breath...",
    durationSeconds: 20,
    config: {}
  },

  // --- PHOTOGRAPHIC / HEGURU ACTIVITIES ---
  
  MANDALA_SIMPLE: {
      type: ActivityType.MANDALA_MEMORY,
      title: "Color Wheel",
      description: "Remember the colors!",
      durationSeconds: 45,
      config: { segments: 4, colors: ['#EF4444', '#3B82F6'] }
  },
  MANDALA_MEDIUM: {
      type: ActivityType.MANDALA_MEMORY,
      title: "Magic Circle",
      description: "Memorize the pattern.",
      durationSeconds: 60,
      config: { segments: 6, colors: ['#EF4444', '#3B82F6', '#F59E0B'] }
  },
  MANDALA_HARD: {
      type: ActivityType.MANDALA_MEMORY,
      title: "Kaleidoscope",
      description: "A complex pattern to remember.",
      durationSeconds: 90,
      config: { segments: 8, colors: ['#EF4444', '#3B82F6', '#F59E0B', '#10B981'] }
  },
  DOT_TRIANGLE: {
      type: ActivityType.DOT_CONNECT,
      title: "Connect 3",
      description: "Trace the triangle shape.",
      durationSeconds: 30,
      config: { gridSize: 3, pathLength: 3 }
  },
  DOT_SQUARE: {
      type: ActivityType.DOT_CONNECT,
      title: "Box It Up",
      description: "Draw the square path.",
      durationSeconds: 30,
      config: { gridSize: 3, pathLength: 4 }
  },
  DOT_STAR: {
      type: ActivityType.DOT_CONNECT,
      title: "Star Path",
      description: "Follow the star shape.",
      durationSeconds: 45,
      config: { gridSize: 4, pathLength: 5 }
  },
  DOT_ZIGZAG: {
      type: ActivityType.DOT_CONNECT,
      title: "Zig Zag",
      description: "Remember the jagged line.",
      durationSeconds: 45,
      config: { gridSize: 4, pathLength: 6 }
  },
  SNAPSHOT_FARM: {
      type: ActivityType.SNAPSHOT_RECALL,
      title: "Farm Photo",
      description: "Where were the animals?",
      durationSeconds: 45,
      config: { gridSize: 2, items: ["🐮", "🐷"] }
  },
  SNAPSHOT_ZOO: {
      type: ActivityType.SNAPSHOT_RECALL,
      title: "Zoo Snap",
      description: "Place the animals back in their spots.",
      durationSeconds: 60,
      config: { gridSize: 2, items: ["🦁", "🦓", "🐒"] }
  },
  SNAPSHOT_SPACE: {
      type: ActivityType.SNAPSHOT_RECALL,
      title: "Space Mission",
      description: "Rebuild the galaxy map.",
      durationSeconds: 60,
      config: { gridSize: 3, items: ["🚀", "⭐", "🌙"] }
  },
  SNAPSHOT_BEACH: {
      type: ActivityType.SNAPSHOT_RECALL,
      title: "Beach Day",
      description: "Put the beach items back.",
      durationSeconds: 90,
      config: { gridSize: 3, items: ["🦀", "🏖️", "☀️", "🏐"] }
  },
  FAST_FLASH_FRUIT: {
      type: ActivityType.FLASH_MEMORY,
      title: "Fast Fruit",
      description: "Super fast! Don't blink.",
      durationSeconds: 30,
      config: { items: CURRICULUM_ITEMS.FRUIT, speed: 500 }
  },
  FAST_FLASH_NUMBER: {
      type: ActivityType.FLASH_MEMORY,
      title: "Speed Numbers",
      description: "Instant recall!",
      durationSeconds: 30,
      config: { items: CURRICULUM_ITEMS.NUMBERS, speed: 300 }
  },
  DOT_QUANTITY_5: {
      type: ActivityType.OBSERVATION,
      title: "Dot Sight",
      description: "How many dots? (Instant)",
      durationSeconds: 20,
      config: { mode: 'count', min: 4, max: 6, items: ["⚫"] }
  },
  DOT_QUANTITY_10: {
      type: ActivityType.OBSERVATION,
      title: "Many Dots",
      description: "Count the cloud of dots.",
      durationSeconds: 30,
      config: { mode: 'count', min: 8, max: 12, items: ["⚫"] }
  },

  // --- FAST RECALL / SPEED ACTIVITIES ---
  RACE_COLORS: {
      type: ActivityType.SPEED_RACE,
      title: "Color Dash",
      description: "Tap the correct color as fast as you can!",
      durationSeconds: 45,
      config: { rounds: 5, type: 'color_text_match', items: CURRICULUM_ITEMS.COLORS }
  },
  RACE_ANIMALS: {
      type: ActivityType.SPEED_RACE,
      title: "Animal Sprint",
      description: "Find the animal quickly!",
      durationSeconds: 45,
      config: { rounds: 5, type: 'image_match', items: CURRICULUM_ITEMS.ANIMALS }
  },
  RACE_MATH_1: {
      type: ActivityType.SPEED_RACE,
      title: "Math Racer",
      description: "Solve the math problems.",
      durationSeconds: 60,
      config: { rounds: 5, type: 'math', complexity: 1 } 
  },
  RACE_LOGIC_BIG: {
      type: ActivityType.SPEED_RACE,
      title: "Big vs Small",
      description: "Which one is bigger?",
      durationSeconds: 45,
      config: { rounds: 5, type: 'logic_size' }
  },
  FLUENCY_NUMS: {
      type: ActivityType.FLUENCY_GRID,
      title: "Number Flow",
      description: "Tap the highlighted numbers.",
      durationSeconds: 45,
      config: { items: CURRICULUM_ITEMS.NUMBERS, gridSize: 9 }
  },
  FLUENCY_SHAPES: {
      type: ActivityType.FLUENCY_GRID,
      title: "Shape Hunter",
      description: "Scan and tap the shapes!",
      durationSeconds: 45,
      config: { items: ["🟦", "🔵", "🔺", "⭐", "🔷"], gridSize: 9 }
  },
  MATCH_SHADOW: {
      type: ActivityType.SPEED_RACE,
      title: "Shadow Match",
      description: "Match the object to its shadow.",
      durationSeconds: 60,
      config: { rounds: 5, type: 'shadow_match', items: ["🍎", "🚗", "🐸", "🚀", "🎸"] }
  },
  SORT_NATURE: {
      type: ActivityType.SORTING_SPRINT,
      title: "Nature Sort",
      description: "Animal or Plant?",
      durationSeconds: 60,
      config: { 
          left: { label: "Animal", items: ["🐶", "🦁", "🐸", "🐷"] },
          right: { label: "Plant", items: ["🌳", "🌻", "🍎", "🥕"] }
      }
  },
  SORT_COLOR_BIN: {
      type: ActivityType.SORTING_SPRINT,
      title: "Red vs Blue",
      description: "Sort into the correct bin.",
      durationSeconds: 45,
      config: { 
          left: { label: "Red", color: "#EF4444", items: ["🍎", "❤️", "🌹", "🎈"] },
          right: { label: "Blue", color: "#3B82F6", items: ["🚙", "👖", "📘", "💧"] }
      }
  },
  REFLEX_DOT: {
      type: ActivityType.SPEED_RACE,
      title: "Reflex Test",
      description: "Tap the dot when it appears!",
      durationSeconds: 30,
      config: { rounds: 5, type: 'reflex' }
  },
  FLUENCY_ALPHA: {
      type: ActivityType.FLUENCY_GRID,
      title: "Letter Scan",
      description: "Tap the letters in order.",
      durationSeconds: 60,
      config: { items: ["A", "B", "C", "D", "E", "F", "G", "H", "I"], gridSize: 9 }
  },
  RACE_MATH_COMPARE: {
      type: ActivityType.SPEED_RACE,
      title: "Number Battle",
      description: "Tap the larger number.",
      durationSeconds: 45,
      config: { rounds: 5, type: 'math_compare' }
  },

  // --- WORKING MEMORY ACTIVITIES ---
  N_BACK_COLORS_1: {
      type: ActivityType.N_BACK,
      title: "Color Match",
      description: "Tap MATCH if it's the same color as the last one.",
      durationSeconds: 45,
      config: { n: 1, type: 'color', items: CURRICULUM_ITEMS.COLORS, interval: 2000 }
  },
  N_BACK_SHAPES_1: {
      type: ActivityType.N_BACK,
      title: "Shape Match",
      description: "Tap MATCH if it's the same shape as before.",
      durationSeconds: 45,
      config: { n: 1, type: 'image', items: CURRICULUM_ITEMS.SHAPES, interval: 2000 }
  },
  N_BACK_POS_1: {
      type: ActivityType.N_BACK,
      title: "Spot Match",
      description: "Is it in the same spot as the last one?",
      durationSeconds: 60,
      config: { n: 1, type: 'position', gridSize: 3, interval: 2000 }
  },
  N_BACK_COLORS_2: {
      type: ActivityType.N_BACK,
      title: "Tricky Colors",
      description: "Match the color from TWO steps ago!",
      durationSeconds: 60,
      config: { n: 2, type: 'color', items: CURRICULUM_ITEMS.COLORS, interval: 2500 }
  },
  RECALL_BACKWARDS_3: {
      type: ActivityType.SEQUENCE_BACKWARDS,
      title: "Rewind Recall",
      description: "Tap the items in REVERSE order. Last one first!",
      durationSeconds: 45,
      config: { length: 3, items: [...CURRICULUM_ITEMS.ANIMALS, ...CURRICULUM_ITEMS.FRUIT] }
  },
  RECALL_BACKWARDS_NUMBERS: {
      type: ActivityType.SEQUENCE_BACKWARDS,
      title: "Number Rewind",
      description: "Recall the numbers backwards.",
      durationSeconds: 60,
      config: { length: 4, items: CURRICULUM_ITEMS.NUMBERS }
  },
  RECALL_BACKWARDS_COLORS: {
      type: ActivityType.SEQUENCE_BACKWARDS,
      title: "Color Rewind",
      description: "Reverse the color sequence.",
      durationSeconds: 60,
      config: { length: 4, items: CURRICULUM_ITEMS.COLORS }
  },
  INSTR_2_STEP: {
      type: ActivityType.INSTRUCTION_FOLLOWING,
      title: "Follow Me",
      description: "Listen and follow the steps.",
      durationSeconds: 45,
      config: { steps: 2, items: CURRICULUM_ITEMS.ANIMALS }
  },
  INSTR_3_STEP: {
      type: ActivityType.INSTRUCTION_FOLLOWING,
      title: "Captain's Orders",
      description: "Follow the 3 commands in order.",
      durationSeconds: 60,
      config: { steps: 3, items: [...CURRICULUM_ITEMS.VEHICLES, ...CURRICULUM_ITEMS.FRUIT] }
  },
  INSTR_SHAPES: {
      type: ActivityType.INSTRUCTION_FOLLOWING,
      title: "Shape Master",
      description: "Tap the shapes in the exact order shown.",
      durationSeconds: 60,
      config: { steps: 4, items: CURRICULUM_ITEMS.SHAPES }
  },

  // --- CHUNKING ACTIVITIES (NEW) ---
  CHUNK_NUM_2X2: {
      type: ActivityType.FLASH_MEMORY,
      title: "Number Chunks",
      description: "Remember the groups: 12  34",
      durationSeconds: 30,
      config: { items: ["12  34", "56  78", "90  12"] }
  },
  CHUNK_LETTERS_3: {
      type: ActivityType.FLASH_MEMORY,
      title: "Letter Groups",
      description: "Remember the code: ABC",
      durationSeconds: 30,
      config: { items: ["ABC", "XYZ", "CAT", "DOG"] }
  },
  CHUNK_PHONE: {
      type: ActivityType.FLASH_MEMORY,
      title: "Phone Numbers",
      description: "Remember: 555 - 0199",
      durationSeconds: 45,
      config: { items: ["555 - 0123", "888 - 9999"] }
  },

  // --- MNEMONICS & LINKING (NEW) ---
  LINK_STORY_3: {
      type: ActivityType.SEQUENCE_MEMORY,
      title: "Story Link",
      description: "Create a story connecting these 3 items.",
      durationSeconds: 60,
      config: { length: 3, items: ["🦁", "🍕", "🎸"] } // Lion eating pizza playing guitar
  },
  LINK_SPACE: {
      type: ActivityType.SEQUENCE_MEMORY,
      title: "Space Story",
      description: "Link: Rocket, Moon, Cheese.",
      durationSeconds: 60,
      config: { length: 3, items: ["🚀", "🌙", "🧀"] }
  },
  PEG_RHYME_1: {
      type: ActivityType.FLASH_MEMORY,
      title: "Peg Memory: 1",
      description: "1 is a BUN. Remember the picture.",
      durationSeconds: 30,
      config: { items: ["1 = 🥯"] }
  },
  PEG_RHYME_2: {
      type: ActivityType.FLASH_MEMORY,
      title: "Peg Memory: 2",
      description: "2 is a SHOE. Remember the picture.",
      durationSeconds: 30,
      config: { items: ["2 = 👟"] }
  },

  // --- LOGIC & REASONING (NEW) ---
  LOGIC_SEQ_SHAPE: {
      type: ActivityType.SPEED_RACE,
      title: "What comes next?",
      description: "Square, Circle, Square, ...?",
      durationSeconds: 45,
      config: { type: 'image_match', items: ["🟥", "🔵"] } // Simplified reuse
  },
  ODD_ONE_OUT_FRUIT: {
      type: ActivityType.OBSERVATION,
      title: "Odd One Out",
      description: "Find the one that is NOT a fruit.",
      durationSeconds: 45,
      config: { mode: 'missing', count: 4, items: ["🍎", "🍌", "🍇", "🚗"] } // Simulated
  },
  STROOP_COLOR: {
      type: ActivityType.SPEED_RACE,
      title: "Tricky Colors",
      description: "Tap the COLOR, not the word!",
      durationSeconds: 45,
      config: { type: 'color_text_match', items: ["#EF4444", "#3B82F6"], rounds: 5 }
  },
  
  // --- VISUAL SEARCH / FLUENCY (NEW) ---
  VISUAL_SEARCH_LETTER: {
      type: ActivityType.FLUENCY_GRID,
      title: "Find 'A'",
      description: "Tap all the letter A's quickly!",
      durationSeconds: 45,
      config: { items: ["A", "B", "C", "D", "A", "E", "A"], gridSize: 9 }
  },
  VISUAL_SEARCH_NUMBER: {
      type: ActivityType.FLUENCY_GRID,
      title: "Find '5'",
      description: "Spot the number 5 among the 2s.",
      durationSeconds: 45,
      config: { items: ["2", "2", "5", "2", "5", "2", "2"], gridSize: 9 }
  },

  // --- OPERATION SPAN / DUAL TASK (NEW) ---
  OP_SPAN_SIMPLE: {
      type: ActivityType.INSTRUCTION_FOLLOWING,
      title: "Math & Memory",
      description: "Answer the math, but remember the fruit!",
      durationSeconds: 60,
      config: { steps: 3, items: ["1+1=2", "🍎", "2+2=4", "🍌"] }
  },
  DUAL_TASK_SOUND: {
      type: ActivityType.INSTRUCTION_FOLLOWING,
      title: "Clap & Remember",
      description: "Clap your hands, then tap the Star.",
      durationSeconds: 45,
      config: { steps: 2, items: ["👏", "⭐"] }
  },

  // --- EMOTIONAL INTELLIGENCE (NEW) ---
  EMOTION_HAPPY: {
      type: ActivityType.SPEED_RACE,
      title: "Find Happy",
      description: "Tap the happy face!",
      durationSeconds: 30,
      config: { type: 'image_match', items: ["😊", "😢", "😠"] }
  },
  EMOTION_SURPRISE: {
      type: ActivityType.SPEED_RACE,
      title: "Find Surprise",
      description: "Who looks surprised?",
      durationSeconds: 30,
      config: { type: 'image_match', items: ["😲", "😐", "😴"] }
  },

  // --- CATEGORIZATION (NEW) ---
  SORT_FOOD: {
      type: ActivityType.SORTING_SPRINT,
      title: "Healthy Sort",
      description: "Fruit or Candy?",
      durationSeconds: 45,
      config: { 
          left: { label: "Fruit", items: ["🍎", "🍌", "🍇"] },
          right: { label: "Candy", items: ["🍬", "🍭", "🍫"] }
      }
  },
  SORT_VEHICLE: {
      type: ActivityType.SORTING_SPRINT,
      title: "Air vs Land",
      description: "Does it fly or drive?",
      durationSeconds: 45,
      config: { 
          left: { label: "Air", items: ["✈️", "🚁", "🚀"] },
          right: { label: "Land", items: ["🚗", "🚌", "🚲"] }
      }
  },

  // --- ABACUS ACTIVITIES ---
  ABACUS_FREE: {
      type: ActivityType.ABACUS,
      title: "Abacus Play",
      description: "Move the beads to explore numbers!",
      durationSeconds: 60,
      config: { mode: 'free', columns: 3 }
  },
  ABACUS_SET_1: {
      type: ActivityType.ABACUS,
      title: "Show Me 1",
      description: "Move the beads to show the number 1.",
      durationSeconds: 30,
      config: { mode: 'set', target: 1, columns: 2 }
  },
  ABACUS_SET_5: {
      type: ActivityType.ABACUS,
      title: "Show Me 5",
      description: "Move the heaven bead for 5.",
      durationSeconds: 30,
      config: { mode: 'set', target: 5, columns: 2 }
  },
  ABACUS_SET_SIMPLE: {
      type: ActivityType.ABACUS,
      title: "Number Builder",
      description: "Set the abacus to this number.",
      durationSeconds: 45,
      config: { mode: 'set', target: 7, columns: 2 } 
  },
  ABACUS_SET_DOUBLE: {
      type: ActivityType.ABACUS,
      title: "Big Numbers",
      description: "Make a two-digit number.",
      durationSeconds: 60,
      config: { mode: 'set', target: 25, columns: 3 }
  },
  ABACUS_ADD_1: {
      type: ActivityType.ABACUS,
      title: "Bead Addition",
      description: "1 + 1 = ?",
      durationSeconds: 45,
      config: { mode: 'add', equation: "1 + 1", columns: 2 }
  },
  ABACUS_ADD_SIMPLE: {
      type: ActivityType.ABACUS,
      title: "Math with Beads",
      description: "Solve this math problem using beads.",
      durationSeconds: 60,
      config: { mode: 'add', equation: "2 + 5", columns: 2 }
  },
  ABACUS_MENTAL_1: {
      type: ActivityType.ABACUS,
      title: "Flash Abacus",
      description: "Remember the number and set it!",
      durationSeconds: 45,
      config: { mode: 'set', target: 8, columns: 2 }
  },
  ABACUS_SUB_1: {
      type: ActivityType.ABACUS,
      title: "Simple Subtraction",
      description: "Use the beads: 5 - 1 = ?",
      durationSeconds: 45,
      config: { mode: 'add', equation: "5 - 1", columns: 2 }
  },
  ABACUS_SUB_SIMPLE: {
      type: ActivityType.ABACUS,
      title: "Take Away",
      description: "Solve: 8 - 3",
      durationSeconds: 60,
      config: { mode: 'add', equation: "8 - 3", columns: 2 }
  },

  // --- PRODUCTIVITY / FOCUS ACTIVITIES ---
  RHYTHM_CLAP_1: {
      type: ActivityType.RHYTHM,
      title: "Rhythm Copycat",
      description: "Listen and tap the rhythm!",
      durationSeconds: 45,
      config: { pattern: [1, 0, 1, 1], tempo: 600 } 
  },
  RHYTHM_CLAP_2: {
      type: ActivityType.RHYTHM,
      title: "Rhythm Master",
      description: "Follow the beat: X X _ X",
      durationSeconds: 45,
      config: { pattern: [1, 1, 0, 1], tempo: 500 }
  },
  SHELL_3: {
      type: ActivityType.SHELL_GAME,
      title: "Magic Cups",
      description: "Follow the ball under the cups!",
      durationSeconds: 60,
      config: { cups: 3, speed: 'slow', swaps: 5 }
  },
  SHELL_4: {
      type: ActivityType.SHELL_GAME,
      title: "Super Shells",
      description: "Keep your eye on the prize.",
      durationSeconds: 60,
      config: { cups: 4, speed: 'medium', swaps: 7 }
  },
  EYE_CIRCLE: {
      type: ActivityType.EYE_TRACKING,
      title: "Circle Watch",
      description: "Follow the dot with your eyes (and finger!).",
      durationSeconds: 45,
      config: { path: 'circle', speed: 3000 }
  },
  EYE_FIGURE8: {
      type: ActivityType.EYE_TRACKING,
      title: "Figure 8",
      description: "Trace the 8 with your eyes.",
      durationSeconds: 45,
      config: { path: 'figure8', speed: 4000 }
  },
  FOCUS_REACTION: {
      type: ActivityType.SPEED_RACE,
      title: "Wait for Green",
      description: "Don't tap until it turns GREEN!",
      durationSeconds: 30,
      config: { type: 'reflex', rounds: 3 }
  },
  FOCUS_HOLD_10: {
      type: ActivityType.FOCUS_HOLD,
      title: "Steady Finger",
      description: "Hold the button for 10 seconds.",
      durationSeconds: 30,
      config: { duration: 10 }
  },
  FOCUS_HOLD_20: {
      type: ActivityType.FOCUS_HOLD,
      title: "Statue Challenge",
      description: "Can you hold still for 20 seconds?",
      durationSeconds: 40,
      config: { duration: 20 }
  },
  CONCENTRATION_FOLLOW: {
      type: ActivityType.EYE_TRACKING,
      title: "Follow the Star",
      description: "Keep watching the star as it moves.",
      durationSeconds: 45,
      config: { path: 'zigzag', speed: 5000, item: "⭐" }
  },

  // --- CREATIVITY ACTIVITIES ---
  STORY_SPACE: {
      type: ActivityType.STORY_DRAW,
      title: "Space Adventure",
      description: "Draw an alien you met on Mars.",
      durationSeconds: 120,
      config: { prompt: "You landed on Mars and saw a funny alien. What did it look like?", colors: ["#FFFFFF", "#000000", "#4ADE80", "#A855F7", "#FACC15"] }
  },
  STORY_JUNGLE: {
      type: ActivityType.STORY_DRAW,
      title: "Jungle Explorer",
      description: "Draw the biggest tiger in the jungle!",
      durationSeconds: 120,
      config: { prompt: "Deep in the jungle, you found a tiger sleeping under a tree.", colors: ["#F97316", "#000000", "#16A34A", "#854D0E", "#FEF08A"] }
  },
  STORY_OCEAN: {
      type: ActivityType.STORY_DRAW,
      title: "Ocean Deep",
      description: "Draw a colorful fish swimming.",
      durationSeconds: 120,
      config: { prompt: "Under the sea, a fish with shiny scales swam by.", colors: ["#3B82F6", "#F472B6", "#FACC15", "#FFFFFF", "#4ADE80"] }
  },
  STORY_CASTLE: {
      type: ActivityType.STORY_DRAW,
      title: "Magic Castle",
      description: "Draw the King or Queen of the castle.",
      durationSeconds: 120,
      config: { prompt: "The castle gates opened and out walked the...", colors: ["#9333EA", "#FACC15", "#EF4444", "#000000", "#E2E8F0"] }
  },
  COLLAGE_ROBOT: {
      type: ActivityType.COLLAGE,
      title: "Build a Robot",
      description: "Drag parts to make a cool robot.",
      durationSeconds: 120,
      config: { items: ["🤖", "⚙️", "🔧", "🔋", "🔩", "📏", "🦾", "🦿", "📡", "💿"] }
  },
  COLLAGE_FACE: {
      type: ActivityType.COLLAGE,
      title: "Make a Face",
      description: "Create a funny face!",
      durationSeconds: 120,
      config: { items: ["👀", "👁️", "👃", "👄", "👅", "👂", "👓", "🧢", "🎀", "🧔"] }
  },
  COLLAGE_GARDEN: {
      type: ActivityType.COLLAGE,
      title: "Design a Garden",
      description: "Plant flowers and trees.",
      durationSeconds: 120,
      config: { items: ["🌻", "🌹", "🌷", "🌲", "🌳", "🌵", "🍄", "🦋", "🐝", "🐞"] }
  },
  COLLAGE_LUNCH: {
      type: ActivityType.COLLAGE,
      title: "Pack a Lunch",
      description: "Fill the box with yummy food.",
      durationSeconds: 120,
      config: { items: ["🍎", "🍌", "🥪", "🧃", "🍪", "🥕", "🍇", "🧀", "🥚", "🍩"] }
  },
  SANDBOX_RAINBOW: {
      type: ActivityType.CREATIVE_DRAW,
      title: "Rainbow Sketch",
      description: "Draw a beautiful rainbow.",
      durationSeconds: 90,
      config: { colors: ["#EF4444", "#F97316", "#FACC15", "#4ADE80", "#3B82F6", "#8B5CF6", "#EC4899"] }
  },
  SANDBOX_FREE: {
      type: ActivityType.CREATIVE_DRAW,
      title: "Free Draw",
      description: "Draw whatever you like!",
      durationSeconds: 120,
      config: { colors: ["#000000", "#EF4444", "#3B82F6", "#10B981", "#F59E0B"] }
  },
  MEMORY_DRAW_SHAPE: {
      type: ActivityType.MEMORY_DRAW,
      title: "Draw the Shape",
      description: "Memorize the shape, then draw it.",
      durationSeconds: 90,
      config: { item: "🔷", colors: ["#3B82F6", "#000000"] }
  },
  MEMORY_DRAW_NATURE: {
      type: ActivityType.MEMORY_DRAW,
      title: "Draw the Tree",
      description: "Look at the tree, then draw it from memory.",
      durationSeconds: 90,
      config: { item: "🌳", colors: ["#16A34A", "#854D0E", "#000000"] }
  },

  // --- OFFLINE / PROJECT ACTIVITIES (NEW) ---
  
  // Photo Hunt
  PHOTO_FIND_COLOR: {
      type: ActivityType.PHOTO_HUNT,
      title: "Color Hunt",
      description: "Find something RED and take a picture!",
      durationSeconds: 120,
      config: { target: "Something Red", icon: "🟥" }
  },
  PHOTO_FIND_SHAPE: {
      type: ActivityType.PHOTO_HUNT,
      title: "Shape Hunter",
      description: "Find something ROUND like a circle.",
      durationSeconds: 120,
      config: { target: "Something Round", icon: "⚪" }
  },
  PHOTO_SELFIE: {
      type: ActivityType.PHOTO_HUNT,
      title: "Funny Face",
      description: "Make a super funny face and snap it!",
      durationSeconds: 60,
      config: { target: "Funny Face", icon: "🤪" }
  },

  // Projects (Photo Verification)
  PROJECT_FORT: {
      type: ActivityType.PHOTO_HUNT,
      title: "Fort Builder",
      description: "Build a pillow fort and show me!",
      durationSeconds: 300,
      config: { target: "Your Pillow Fort", icon: "🏰" }
  },
  PROJECT_NATURE: {
      type: ActivityType.PHOTO_HUNT,
      title: "Nature Art",
      description: "Make a picture using leaves and sticks.",
      durationSeconds: 300,
      config: { target: "Leaf Art", icon: "🍂" }
  },
  PROJECT_TOWER: {
      type: ActivityType.PHOTO_HUNT,
      title: "Mega Tower",
      description: "Build the tallest tower you can!",
      durationSeconds: 240,
      config: { target: "High Tower", icon: "🧱" }
  },

  // Offline / Real World Tasks
  OFFLINE_COUNT_CHAIRS: {
      type: ActivityType.OFFLINE_TASK,
      title: "Chair Counter",
      description: "Go count every chair in your house.",
      durationSeconds: 120,
      config: { task: "How many chairs?", inputType: "number" }
  },
  OFFLINE_TEXTURE_HUNT: {
      type: ActivityType.OFFLINE_TASK,
      title: "Texture Touch",
      description: "Touch something SOFT, HARD, and COLD.",
      durationSeconds: 120,
      config: { task: "Did you find them all?", inputType: "confirm" }
  },
  OFFLINE_SOUND_HUNT: {
      type: ActivityType.OFFLINE_TASK,
      title: "Sound Detective",
      description: "Close your eyes. What 3 sounds do you hear?",
      durationSeconds: 90,
      config: { task: "Tell your parent what you heard!", inputType: "confirm" }
  }
};

// Helper to get random template based on age
export const getRandomActivity = (_age: number) => {
    return ACTIVITY_TEMPLATES.FLASH_ANIMALS; 
};