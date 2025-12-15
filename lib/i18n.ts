import { useStore } from '../store';

export const translations = {
  en: {
    // General
    "start": "START",
    "next": "NEXT",
    "back": "Back",
    "done": "Done",
    "check": "Check",
    "retry": "Try Again!",
    "great": "Great!",
    "good_job": "Good Job!",
    "nice_try": "Nice Try!",
    "loading": "Loading...",
    "skip": "Skip",
    
    // Auth & Onboarding
    "parent_email": "Parent Email",
    "send_code": "Send Code",
    "verify_enter": "Verify & Enter",
    "create_profile": "Create Child Profile",
    "child_name": "Child's Name",
    "continue": "Continue",
    "i_agree": "I Agree & Continue",

    // Parent Dashboard
    "parent_dashboard": "Parent Dashboard",
    "manage_desc": "Manage learning, safety, and progress.",
    "add_child_profile": "Add Child Profile",
    "start_session": "Start Session",
    "profile": "Profile",
    "safety": "Limits & Safety",
    "analytics": "Analytics",
    "report_card": "Report Card",
    "delete_profile": "Delete Profile",
    "save_changes": "Save Changes",
    "close": "Close",
    "edit_mode": "Edit Mode",
    
    // Kid View
    "hi_name": "Hi, {name}!",
    "all_done": "All Done!",
    "mission_complete": "Mission Complete! 🎉",
    "sleep_mode": "Sleep Mode Active",
    "daily_goal_reached": "Daily Goal Reached",
    "come_back_tmrw": "Come back tomorrow!",
    "todays_mission": "TODAY'S MISSION",
    "lets_go": "LET'S GO!",
    "my_trophies": "My Trophies",
    "ready_training": "Ready for today's training?",
    "focus_desc": "Focus, memory, and creativity await.",
    "session_preview": "Session Preview",
    "stars_earned": "Stars Earned",
    "day_streak": "Day Streak",
    "welcome": "Welcome, {name}",
    
    // Safety
    "bedtime_title": "It's Bedtime!",
    "bedtime_msg": "Sleep tight, see you tomorrow!",
    "limit_title": "Time's Up!",
    "limit_msg": "You've played enough for today.",
    "coplay_title": "Co-Play Required",
    "coplay_msg": "Because {name} is under 4, a parent must be present.",
    "parent_unlock": "Parent Unlock",
    
    // Activity Instructions
    "memorize": "Memorize",
    "recall": "Recall",
    "which_one": "Which one was it?",
    "watch_carefully": "Watch carefully!",
    "tap_order": "Tap in Order!",
    "reverse_order": "Reverse Order!",
    "trace_path": "Trace the path!",
    "draw_path": "Draw the path!",
    "photograph_scene": "Photograph the scene!",
    "rebuild_scene": "Rebuild the scene!",
    "checking": "Checking...",
    "show_me": "Show me:",
    "solve": "Solve:",
    "listen_watch": "Listen & Watch!",
    "tap_beat": "Tap the Beat!",
    "follow_dot": "Follow the dot!",
    "where_star": "Where is the Star?",
    "hold_button": "Hold the button!",
    "dont_let_go": "Don't let go!",
    "perfect_focus": "Perfect Focus!",
    "draw_saw": "Draw what you saw!",
    "story_prompt": "Story Prompt",
    "parent_check": "Parent Check",
    "ask_parent": "Ask a Parent!",
    "parent_confirm_msg": "Show your work to a parent. Can they confirm you finished the task?",
    "parent_confirm_btn": "Parent Confirm",
    "not_done": "Not done yet",
    "i_did_it": "I Did It!",
    "tap_match": "Tap MATCH if it's the same!",
    "memorize_pattern": "Memorize the pattern!",
    "recreate_pattern": "Recreate the pattern",
    "memorize_colors": "Memorize the Colors!",
    "color_pattern": "Color the Pattern",
    "tap_highlighted": "Tap highlighted item!",
    "find_missing": "What is missing?",
    "how_many": "How many were there?",
    "sort_items": "Sort items!",
    "follow_path": "Follow the path!",
    "im_ready": "I'm Ready!",
    "build_scene": "Build the scene",
    
    // Brain Break
    "brain_break_ready": "Ready!",
    "exercise_reach": "Reach for the Sky!",
    "exercise_toes": "Touch your Toes!",
    "exercise_wiggle": "Wiggle it out!",
    
    // Trophy
    "trophy_room": "Trophy Room",
    "keep_going": "Keep going, {name}!",
    "unlocked": "UNLOCKED"
  },
  hi: {
    // General
    "start": "शुरू करें",
    "next": "अगला",
    "back": "पीछे",
    "done": "हो गया",
    "check": "जांचें",
    "retry": "फिर से कोशिश करें!",
    "great": "बहुत अच्छे!",
    "good_job": "शाबाश!",
    "nice_try": "अच्छा प्रयास!",
    "loading": "लोड हो रहा है...",
    "skip": "छोड़ें",

    // Auth & Onboarding
    "parent_email": "माता-पिता का ईमेल",
    "send_code": "कोड भेजें",
    "verify_enter": "सत्यापित करें और प्रवेश करें",
    "create_profile": "बच्चे की प्रोफाइल बनाएं",
    "child_name": "बच्चे का नाम",
    "continue": "जारी रखें",
    "i_agree": "मैं सहमत हूँ",

    // Parent Dashboard
    "parent_dashboard": "अभिभावक डैशबोर्ड",
    "manage_desc": "सीखने, सुरक्षा और प्रगति का प्रबंधन करें।",
    "add_child_profile": "प्रोफाइल जोड़ें",
    "start_session": "सत्र शुरू करें",
    "profile": "प्रोफाइल",
    "safety": "सुरक्षा",
    "analytics": "विश्लेषण",
    "report_card": "रिपोर्ट कार्ड",
    "delete_profile": "प्रोफाइल हटाएं",
    "save_changes": "बदलाव सहेजें",
    "close": "बंद करें",
    "edit_mode": "संपादन मोड",

    // Kid View
    "hi_name": "नमस्ते, {name}!",
    "all_done": "पूरा हो गया!",
    "mission_complete": "मिशन पूरा हुआ! 🎉",
    "sleep_mode": "स्लीप मोड सक्रिय",
    "daily_goal_reached": "दैनिक लक्ष्य पूरा हुआ",
    "come_back_tmrw": "कल वापस आना!",
    "todays_mission": "आज का मिशन",
    "lets_go": "चलो चलें!",
    "my_trophies": "मेरी ट्राफियां",
    "ready_training": "आज की ट्रेनिंग के लिए तैयार?",
    "focus_desc": "ध्यान, स्मृति और रचनात्मकता।",
    "session_preview": "सत्र की झलक",
    "stars_earned": "सितारे मिले",
    "day_streak": "लगातार दिन",
    "welcome": "स्वागत है, {name}",

    // Safety
    "bedtime_title": "सोने का समय!",
    "bedtime_msg": "शुभ रात्रि, कल मिलते हैं!",
    "limit_title": "समय समाप्त!",
    "limit_msg": "आज के लिए खेल खत्म।",
    "coplay_title": "माता-पिता आवश्यक",
    "coplay_msg": "{name} छोटा है, माता-पिता साथ रहें।",
    "parent_unlock": "अभिभावक अनलॉक",

    // Activity Instructions
    "memorize": "याद रखें",
    "recall": "याद करें",
    "which_one": "वह कौन सा था?",
    "watch_carefully": "ध्यान से देखें!",
    "tap_order": "क्रम में टैप करें!",
    "reverse_order": "उल्टे क्रम में!",
    "trace_path": "रास्ता ट्रेस करें!",
    "draw_path": "रास्ता बनाएं!",
    "photograph_scene": "दृश्य की फोटो लें!",
    "rebuild_scene": "दृश्य फिर से बनाएं!",
    "checking": "जांच हो रही है...",
    "show_me": "मुझे दिखाओ:",
    "solve": "हल करें:",
    "listen_watch": "सुनें और देखें!",
    "tap_beat": "बीट पर टैप करें!",
    "follow_dot": "बिंदु का पीछा करें!",
    "where_star": "तारा कहाँ है?",
    "hold_button": "बटन दबाए रखें!",
    "dont_let_go": "छोड़ना मत!",
    "perfect_focus": "उत्तम ध्यान!",
    "draw_saw": "जो देखा वो बनाएं!",
    "story_prompt": "कहानी संकेत",
    "parent_check": "अभिभावक जांच",
    "ask_parent": "माता-पिता से पूछें!",
    "parent_confirm_msg": "अपना काम माता-पिता को दिखाएं। क्या वे पुष्टि कर सकते हैं?",
    "parent_confirm_btn": "माता-पिता की पुष्टि",
    "not_done": "अभी नहीं हुआ",
    "i_did_it": "मैंने कर लिया!",
    "tap_match": "अगर समान है तो मैच दबाएं!",
    "memorize_pattern": "पैटर्न याद रखें!",
    "recreate_pattern": "पैटर्न फिर से बनाएं",
    "memorize_colors": "रंग याद रखें!",
    "color_pattern": "पैटर्न में रंग भरें",
    "tap_highlighted": "हाइलाइट की गई वस्तु टैप करें!",
    "find_missing": "क्या गायब है?",
    "how_many": "वहाँ कितने थे?",
    "sort_items": "वस्तुओं को छांटें!",
    "follow_path": "रास्ते का पालन करें!",
    "im_ready": "मैं तैयार हूँ!",
    "build_scene": "दृश्य बनाएं",

    // Brain Break
    "brain_break_ready": "तैयार!",
    "exercise_reach": "आसमान को छुएं!",
    "exercise_toes": "पैर के अंगूठे छुएं!",
    "exercise_wiggle": "हिलाएं-डुलाएं!",

    // Trophy
    "trophy_room": "ट्रॉफी रूम",
    "keep_going": "बढ़ते रहो, {name}!",
    "unlocked": "अनलॉक"
  }
};

export const useTranslation = () => {
  const currentChild = useStore(state => state.currentChild);
  // Default to English if no child selected or language not set
  const lang = (currentChild?.language as 'en' | 'hi') || 'en';

  const t = (key: keyof typeof translations['en'], params?: Record<string, string>) => {
    let text = translations[lang][key as keyof typeof translations['hi']] || translations['en'][key] || key;
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        text = text.replace(`{${k}}`, v);
      });
    }
    return text;
  };

  return { t, lang };
};
