
export const isBedtime = (startStr: string, endStr: string): boolean => {
    if (!startStr || !endStr) return false;

    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    const [startH, startM] = startStr.split(':').map(Number);
    const [endH, endM] = endStr.split(':').map(Number);
    
    const startMinutes = startH * 60 + startM;
    const endMinutes = endH * 60 + endM;

    if (startMinutes < endMinutes) {
        // Example: 14:00 to 16:00 (Nap time)
        return currentMinutes >= startMinutes && currentMinutes < endMinutes;
    } else {
        // Example: 20:00 to 07:00 (Overnight)
        return currentMinutes >= startMinutes || currentMinutes < endMinutes;
    }
};

export const getTodayDateString = () => {
    return new Date().toISOString().split('T')[0];
};
