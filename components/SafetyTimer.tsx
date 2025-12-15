import React, { useEffect, useRef } from 'react';
import { useStore } from '../store';
import { isBedtime, getTodayDateString } from '../lib/safety';

interface SafetyTimerProps {
  onBedtimeLimit: () => void;
  onDailyLimit: () => void;
  onBrainBreak: () => void;
}

export const SafetyTimer: React.FC<SafetyTimerProps> = ({ onBedtimeLimit, onDailyLimit, onBrainBreak }) => {
  const currentChild = useStore(state => state.currentChild);
  const incrementUsage = useStore(state => state.incrementUsage);
  
  // Track continuous session time for Breaks
  const sessionMinutesRef = useRef(0);

  useEffect(() => {
    if (!currentChild) return;

    // Initial Check
    if (isBedtime(currentChild.bedtimeStart, currentChild.bedtimeEnd)) {
        onBedtimeLimit();
    }

    const timer = setInterval(() => {
        // 1. Increment Usage
        incrementUsage(1);
        sessionMinutesRef.current += 1;

        // 2. Check Break Rule (Every 20 mins)
        // Mandatory Finnish style break
        if (sessionMinutesRef.current > 0 && sessionMinutesRef.current % 20 === 0) {
            onBrainBreak();
        }

        // 3. Check Bedtime
        if (isBedtime(currentChild.bedtimeStart, currentChild.bedtimeEnd)) {
            onBedtimeLimit();
        }
        
    }, 60000); // Check every minute

    return () => clearInterval(timer);
  }, [currentChild, incrementUsage, onBedtimeLimit, onBrainBreak]);

  // Separate effect to check daily limit to ensure we have fresh data
  useEffect(() => {
     if (currentChild) {
         const today = getTodayDateString();
         const usage = currentChild.lastUsageDate === today ? currentChild.todayUsageMinutes : 0;
         
         if (usage >= currentChild.dailyLimitMinutes) {
             onDailyLimit();
         }
     }
  }, [currentChild?.todayUsageMinutes, currentChild?.dailyLimitMinutes, onDailyLimit]);

  return null; // Logic only component
};