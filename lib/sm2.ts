import { ItemProgress, MasteryLevel, ChildProfile, Activity, ActivityType } from "../types";
import { ACTIVITY_TEMPLATES, CURRICULUM_ITEMS } from "../constants";

// --- SM-2 ALGORITHM ---

export const getInitialProgress = (childId: string, itemId: string): ItemProgress => ({
    childId,
    itemId,
    box: 0,
    ease: 2.5,
    reps: 0,
    dueDate: new Date().toISOString().split('T')[0],
    lastReviewDate: '',
    streak: 0,
    masteryLevel: MasteryLevel.NOVICE,
    history: [],
    updatedAt: Date.now()
});

export const calculateSM2 = (current: ItemProgress, quality: number): ItemProgress => {
    // Clone
    let next = { ...current };
    const today = new Date().toISOString().split('T')[0];

    // Update History
    next.lastReviewDate = today;
    next.history = [...next.history, { date: today, quality }];

    if (quality >= 3) {
        // Correct response
        if (next.reps === 0) {
            next.box = 1;
        } else if (next.reps === 1) {
            next.box = 6;
        } else {
            next.box = Math.ceil(next.box * next.ease);
        }
        next.reps += 1;
        next.streak += 1;
    } else {
        // Incorrect response
        next.box = 1;
        next.reps = 0; // Reset reps in standard SM-2, sometimes people reset to 0
        next.streak = 0;
    }

    // Update E-Factor (Easiness)
    // EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
    // q is quality (0-5)
    // EF cannot go below 1.3
    const q = quality;
    next.ease = next.ease + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
    if (next.ease < 1.3) next.ease = 1.3;

    // Calculate Due Date
    const due = new Date();
    due.setDate(due.getDate() + next.box);
    next.dueDate = due.toISOString().split('T')[0];

    // Determine Mastery Level
    // Novice: reps < 3
    // Fluent: reps >= 3 && box > 7
    // Rapid: box > 21
    if (next.box > 21) next.masteryLevel = MasteryLevel.RAPID;
    else if (next.reps >= 3 && next.box > 7) next.masteryLevel = MasteryLevel.FLUENT;
    else next.masteryLevel = MasteryLevel.NOVICE;

    // Set updated timestamp for sync
    next.updatedAt = Date.now();

    return next;
};


// --- PLAN GENERATOR ---

export const generateDailyPlan = (
    child: ChildProfile, 
    progressMap: Record<string, ItemProgress>
): Activity[] => {
    const today = new Date().toISOString().split('T')[0];
    const plan: Activity[] = [];
    
    // Helper to find key from template object
    const findTemplateKey = (tmpl: any) => {
        return Object.keys(ACTIVITY_TEMPLATES).find(key => ACTIVITY_TEMPLATES[key as keyof typeof ACTIVITY_TEMPLATES] === tmpl);
    };

    const addActivity = (idSuffix: string, tmpl: any) => {
        const key = findTemplateKey(tmpl);
        return {
            id: `act_${Date.now()}_${idSuffix}`,
            templateId: key, // Store the key for I18n
            ...tmpl
        };
    };

    // 1. Warmup
    plan.push(addActivity('warmup', ACTIVITY_TEMPLATES.BREATHE));

    // 2. High-Speed "Right Brain" Block
    const photographicPool: any[] = [
        ACTIVITY_TEMPLATES.MANDALA_SIMPLE,
        ACTIVITY_TEMPLATES.FAST_FLASH_FRUIT,
        ACTIVITY_TEMPLATES.DOT_TRIANGLE,
        ACTIVITY_TEMPLATES.SNAPSHOT_FARM,
        ACTIVITY_TEMPLATES.DOT_QUANTITY_5,
        ACTIVITY_TEMPLATES.CHUNK_NUM_2X2,
        ACTIVITY_TEMPLATES.CHUNK_LETTERS_3,
        ACTIVITY_TEMPLATES.VISUAL_SEARCH_LETTER,
        ACTIVITY_TEMPLATES.VISUAL_SEARCH_NUMBER
    ];
    
    if (child.age >= 5) {
        photographicPool.push(
            ACTIVITY_TEMPLATES.MANDALA_MEDIUM,
            ACTIVITY_TEMPLATES.DOT_STAR,
            ACTIVITY_TEMPLATES.SNAPSHOT_SPACE,
            ACTIVITY_TEMPLATES.FAST_FLASH_NUMBER,
            ACTIVITY_TEMPLATES.CHUNK_PHONE
        );
    }
    
    const shuffledPhoto = photographicPool.sort(() => 0.5 - Math.random());
    shuffledPhoto.slice(0, 2).forEach((tmpl, i) => {
         plan.push(addActivity(`photo_${i}`, tmpl));
    });


    // 3. Cognitive / Working Memory / Abacus Block
    const cognitivePool: any[] = [
        ACTIVITY_TEMPLATES.GRID_PAIRS_4,
        ACTIVITY_TEMPLATES.SEQUENCE_3,
        ACTIVITY_TEMPLATES.KIMS_GAME_3,
        ACTIVITY_TEMPLATES.MATRIX_2X2,
        ACTIVITY_TEMPLATES.COUNT_ITEMS,
        ACTIVITY_TEMPLATES.N_BACK_COLORS_1,
        ACTIVITY_TEMPLATES.N_BACK_SHAPES_1,
        ACTIVITY_TEMPLATES.INSTR_2_STEP,
        ACTIVITY_TEMPLATES.RECALL_BACKWARDS_3,
        ACTIVITY_TEMPLATES.LINK_STORY_3,
        ACTIVITY_TEMPLATES.PEG_RHYME_1,
        ACTIVITY_TEMPLATES.PEG_RHYME_2,
        // Abacus Basic
        ACTIVITY_TEMPLATES.ABACUS_FREE,
        ACTIVITY_TEMPLATES.ABACUS_SET_1,
        ACTIVITY_TEMPLATES.ABACUS_SET_5,
        ACTIVITY_TEMPLATES.ABACUS_SUB_1
    ];
    
    if (child.age >= 5) {
        cognitivePool.push(
            ACTIVITY_TEMPLATES.GRID_PAIRS_6,
            ACTIVITY_TEMPLATES.SEQUENCE_NUMBERS,
            ACTIVITY_TEMPLATES.MATRIX_3X3,
            ACTIVITY_TEMPLATES.N_BACK_COLORS_2,
            ACTIVITY_TEMPLATES.N_BACK_POS_1,
            ACTIVITY_TEMPLATES.RECALL_BACKWARDS_NUMBERS,
            ACTIVITY_TEMPLATES.RECALL_BACKWARDS_COLORS,
            ACTIVITY_TEMPLATES.INSTR_3_STEP,
            ACTIVITY_TEMPLATES.INSTR_SHAPES,
            ACTIVITY_TEMPLATES.OP_SPAN_SIMPLE,
            ACTIVITY_TEMPLATES.DUAL_TASK_SOUND,
            ACTIVITY_TEMPLATES.LINK_SPACE,
            // Abacus Hard
            ACTIVITY_TEMPLATES.ABACUS_SET_SIMPLE,
            ACTIVITY_TEMPLATES.ABACUS_SET_DOUBLE,
            ACTIVITY_TEMPLATES.ABACUS_ADD_1,
            ACTIVITY_TEMPLATES.ABACUS_ADD_SIMPLE,
            ACTIVITY_TEMPLATES.ABACUS_MENTAL_1,
            ACTIVITY_TEMPLATES.ABACUS_SUB_SIMPLE
        );
    }
    
    const shuffledCog = cognitivePool.sort(() => 0.5 - Math.random());
    // Mix 3 cognitive/abacus tasks
    shuffledCog.slice(0, 3).forEach((tmpl, i) => {
         plan.push(addActivity(`cog_${i}`, tmpl));
    });


    // 4. Fast Recall / Fluency / Productivity Block
    const fastPool: any[] = [
        ACTIVITY_TEMPLATES.RACE_COLORS,
        ACTIVITY_TEMPLATES.RACE_ANIMALS,
        ACTIVITY_TEMPLATES.FLUENCY_NUMS,
        ACTIVITY_TEMPLATES.FLUENCY_SHAPES,
        ACTIVITY_TEMPLATES.SORT_NATURE,
        ACTIVITY_TEMPLATES.REFLEX_DOT,
        ACTIVITY_TEMPLATES.SORT_FOOD,
        ACTIVITY_TEMPLATES.SORT_VEHICLE,
        ACTIVITY_TEMPLATES.EMOTION_HAPPY,
        // Productivity
        ACTIVITY_TEMPLATES.RHYTHM_CLAP_1,
        ACTIVITY_TEMPLATES.SHELL_3,
        ACTIVITY_TEMPLATES.EYE_CIRCLE,
        ACTIVITY_TEMPLATES.FOCUS_REACTION,
        ACTIVITY_TEMPLATES.FOCUS_HOLD_10,
        // Offline Basic
        ACTIVITY_TEMPLATES.OFFLINE_COUNT_CHAIRS,
        ACTIVITY_TEMPLATES.PHOTO_FIND_COLOR
    ];

    if (child.age >= 5) {
        fastPool.push(
            ACTIVITY_TEMPLATES.RACE_MATH_1,
            ACTIVITY_TEMPLATES.MATCH_SHADOW,
            ACTIVITY_TEMPLATES.FLUENCY_ALPHA,
            ACTIVITY_TEMPLATES.LOGIC_SEQ_SHAPE,
            ACTIVITY_TEMPLATES.ODD_ONE_OUT_FRUIT,
            ACTIVITY_TEMPLATES.STROOP_COLOR,
            ACTIVITY_TEMPLATES.EMOTION_SURPRISE,
            // Productivity Hard
            ACTIVITY_TEMPLATES.RHYTHM_CLAP_2,
            ACTIVITY_TEMPLATES.SHELL_4,
            ACTIVITY_TEMPLATES.EYE_FIGURE8,
            ACTIVITY_TEMPLATES.CONCENTRATION_FOLLOW,
            ACTIVITY_TEMPLATES.FOCUS_HOLD_20,
            // Projects
            ACTIVITY_TEMPLATES.PROJECT_NATURE,
            ACTIVITY_TEMPLATES.OFFLINE_SOUND_HUNT
        );
    }

    const shuffledFast = fastPool.sort(() => 0.5 - Math.random());
    // Add 3 fast/productivity activities
    shuffledFast.slice(0, 3).forEach((tmpl, i) => {
        plan.push(addActivity(`fast_${i}`, tmpl));
    });


    // 5. Creative / Cool Down Block (NEW)
    const creativePool: any[] = [
        ACTIVITY_TEMPLATES.SANDBOX_RAINBOW,
        ACTIVITY_TEMPLATES.SANDBOX_FREE,
        ACTIVITY_TEMPLATES.COLLAGE_FACE,
        ACTIVITY_TEMPLATES.COLLAGE_ROBOT,
        ACTIVITY_TEMPLATES.STORY_SPACE,
        ACTIVITY_TEMPLATES.STORY_JUNGLE,
        ACTIVITY_TEMPLATES.MEMORY_DRAW_SHAPE,
        // Offline Creative
        ACTIVITY_TEMPLATES.PHOTO_SELFIE,
        ACTIVITY_TEMPLATES.OFFLINE_TEXTURE_HUNT
    ];

    if (child.age >= 5) {
        creativePool.push(
            ACTIVITY_TEMPLATES.COLLAGE_GARDEN,
            ACTIVITY_TEMPLATES.COLLAGE_LUNCH,
            ACTIVITY_TEMPLATES.STORY_OCEAN,
            ACTIVITY_TEMPLATES.STORY_CASTLE,
            ACTIVITY_TEMPLATES.MEMORY_DRAW_NATURE,
            ACTIVITY_TEMPLATES.PROJECT_FORT,
            ACTIVITY_TEMPLATES.PROJECT_TOWER
        );
    }

    const shuffledCreative = creativePool.sort(() => 0.5 - Math.random());
    // Add 1 creative activity to finish
    plan.push(addActivity(`creative`, shuffledCreative[0]));

    return plan;
};