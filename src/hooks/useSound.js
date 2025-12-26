import { useEffect, useMemo, useRef } from 'react';

const createTone = (audioContext, frequency = 440, duration = 0.1, volume = 0.2) => {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    oscillator.type = 'square';
    oscillator.frequency.value = frequency;
    gainNode.gain.value = volume;
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    oscillator.start();
    oscillator.stop(audioContext.currentTime + duration);
};

export const useSound = (masterVolume = 0.4, muted = false) => {
    const contextRef = useRef(null);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        if (!contextRef.current) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) {
                contextRef.current = new AudioContext();
            }
        }
    }, []);

    const play = useMemo(() => {
        return (type = 'beep') => {
            if (muted || !contextRef.current) return;
            const ctx = contextRef.current;
            const base = {
                beep: { freq: 640, duration: 0.08 },
                boot: { freq: 420, duration: 0.25 },
                error: { freq: 120, duration: 0.25 },
                type: { freq: 880, duration: 0.02 }
            }[type] || { freq: 520, duration: 0.1 };
            createTone(ctx, base.freq, base.duration, masterVolume);
        };
    }, [masterVolume, muted]);

    return { play };
};

export default useSound;
