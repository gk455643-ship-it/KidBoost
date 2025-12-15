import { ItemProgress, MasteryLevel } from '../types';

export interface AnalyticsSummary {
    retention7Day: number;
    retention14Day: number;
    efficiencyScore: number;
    itemsMastered: number;
    totalItems: number;
    weakItems: WeakItemDef[];
    calendarData: Record<string, { count: number; avgQuality: number }>;
}

export interface WeakItemDef {
    itemId: string;
    ease: number;
    streak: number;
    remediation: string;
}

export const analyzeProgress = (progressMap: Record<string, ItemProgress>, childId: string): AnalyticsSummary => {
    const items = Object.values(progressMap).filter(i => i.childId === childId);
    const now = new Date();
    const msPerDay = 24 * 60 * 60 * 1000;

    let totalReviews7 = 0;
    let success7 = 0;
    let totalReviews14 = 0;
    let success14 = 0;
    let masteredCount = 0;
    let totalEase = 0;
    
    const weakItems: WeakItemDef[] = [];
    const calendarData: Record<string, { count: number; qualitySum: number; avgQuality: number }> = {};

    items.forEach(item => {
        // Mastery Count
        if (item.masteryLevel === MasteryLevel.RAPID || item.masteryLevel === MasteryLevel.FLUENT) {
            masteredCount++;
        }
        totalEase += item.ease;

        // Weak Item Detection
        // Ease < 2.0 means struggling. Streak < 2 implies inconsistency.
        if ((item.ease < 2.0 || (item.streak < 2 && item.reps > 3))) {
            let remediation = "Flash Cards";
            if (/\d/.test(item.itemId)) remediation = "Abacus Practice";
            else if (item.itemId.startsWith('#')) remediation = "Color Matching";
            else if (item.itemId.length > 3) remediation = "Memory Grid";

            weakItems.push({
                itemId: item.itemId,
                ease: item.ease,
                streak: item.streak,
                remediation
            });
        }

        // Process History for Retention & Calendar
        item.history.forEach(log => {
            const logDate = new Date(log.date);
            const diffDays = Math.floor((now.getTime() - logDate.getTime()) / msPerDay);
            const isSuccess = log.quality >= 3;

            // Retention 7 Days
            if (diffDays <= 7) {
                totalReviews7++;
                if (isSuccess) success7++;
            }

            // Retention 14 Days
            if (diffDays <= 14) {
                totalReviews14++;
                if (isSuccess) success14++;
            }

            // Calendar Aggregation
            if (!calendarData[log.date]) {
                calendarData[log.date] = { count: 0, qualitySum: 0, avgQuality: 0 };
            }
            calendarData[log.date].count++;
            calendarData[log.date].qualitySum += log.quality;
        });
    });

    // Finalize Calendar Averages
    Object.keys(calendarData).forEach(date => {
        calendarData[date].avgQuality = calendarData[date].qualitySum / calendarData[date].count;
    });

    // Efficiency Score (0-100) based on average Ease factor (2.5 is default/good)
    // Normalized: 1.3 (hard) -> 0, 3.0 (easy) -> 100
    const avgEase = items.length > 0 ? totalEase / items.length : 2.5;
    const efficiency = Math.min(100, Math.max(0, ((avgEase - 1.3) / 1.7) * 100));

    return {
        retention7Day: totalReviews7 > 0 ? Math.round((success7 / totalReviews7) * 100) : 100,
        retention14Day: totalReviews14 > 0 ? Math.round((success14 / totalReviews14) * 100) : 100,
        efficiencyScore: Math.round(efficiency),
        itemsMastered: masteredCount,
        totalItems: items.length,
        weakItems: weakItems.sort((a, b) => a.ease - b.ease).slice(0, 5), // Top 5 weakest
        calendarData
    };
};