// Simple Synthesizer for UI Sounds
// This avoids needing external MP3 files and works 100% offline

const AudioContextClass = (window.AudioContext || (window as any).webkitAudioContext);
let audioCtx: AudioContext | null = null;

const initAudio = () => {
    if (!audioCtx) {
        audioCtx = new AudioContextClass();
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    return audioCtx;
};

const playTone = (freq: number, type: OscillatorType, duration: number, startTime = 0, volume = 0.1) => {
    const ctx = initAudio();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime + startTime);
    
    gain.gain.setValueAtTime(volume, ctx.currentTime + startTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + startTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime + startTime);
    osc.stop(ctx.currentTime + startTime + duration);
};

// Simulate white noise for Clap/Snare
const playNoise = (duration: number, startTime = 0, volume = 0.1) => {
    const ctx = initAudio();
    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(volume, ctx.currentTime + startTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + startTime + duration);

    noise.connect(gain);
    gain.connect(ctx.destination);
    noise.start(ctx.currentTime + startTime);
};

export const playSound = (type: 'correct' | 'wrong' | 'success' | 'click' | 'pop' | 'fanfare' | 'clap') => {
    try {
        switch (type) {
            case 'correct':
                // High ding
                playTone(600, 'sine', 0.1, 0, 0.1);
                playTone(1200, 'sine', 0.3, 0.05, 0.1);
                break;
            case 'wrong':
                // Low buzz
                playTone(150, 'sawtooth', 0.3, 0, 0.1);
                break;
            case 'success':
                // Small success
                playTone(400, 'sine', 0.2, 0, 0.1);
                playTone(600, 'sine', 0.2, 0.1, 0.1);
                break;
            case 'click':
                playTone(800, 'sine', 0.05, 0, 0.05);
                break;
            case 'pop':
                playTone(400, 'triangle', 0.1, 0, 0.1);
                break;
            case 'clap':
                playNoise(0.1, 0, 0.2);
                playNoise(0.1, 0.1, 0.15);
                break;
            case 'fanfare':
                // Elaborate melody
                const now = 0;
                playTone(523.25, 'sine', 0.2, now, 0.1); // C5
                playTone(659.25, 'sine', 0.2, now + 0.15, 0.1); // E5
                playTone(783.99, 'sine', 0.2, now + 0.30, 0.1); // G5
                playTone(1046.50, 'square', 0.6, now + 0.45, 0.1); // C6
                
                // Add some claps underneath
                playNoise(0.1, now + 0.45, 0.1);
                playNoise(0.1, now + 0.55, 0.1);
                playNoise(0.1, now + 0.65, 0.1);
                break;
        }
    } catch (e) {
        console.error("Audio play failed", e);
    }
};