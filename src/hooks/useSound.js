import { useCallback, useEffect, useMemo, useRef } from 'react';

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

    const ensureContext = useCallback(() => {
        if (typeof window === 'undefined') return null;
        if (contextRef.current) return contextRef.current;
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return null;
        contextRef.current = new AudioContext();
        return contextRef.current;
    }, []);

    useEffect(() => {
        const ctx = ensureContext();
        if (!ctx) return undefined;
        const unlock = () => {
            if (ctx.state === 'suspended' && typeof ctx.resume === 'function') {
                ctx.resume().catch(() => {});
            }
        };
        window.addEventListener('pointerdown', unlock, { once: true });
        window.addEventListener('keydown', unlock, { once: true });
        return () => {
            window.removeEventListener('pointerdown', unlock);
            window.removeEventListener('keydown', unlock);
        };
    }, [ensureContext]);

    const play = useMemo(() => {
        return (type = 'beep') => {
            if (muted) return;
            const ctx = ensureContext();
            if (!ctx) return;
            const base = {
                beep: { freq: 640, duration: 0.08 },
                boot: { freq: 420, duration: 0.25 },
                error: { freq: 120, duration: 0.25 },
                type: { freq: 880, duration: 0.02 },
                hover: { freq: 980, duration: 0.03 },
                hum: { freq: 220, duration: 0.4 }
            }[type] || { freq: 520, duration: 0.1 };
            try {
                createTone(ctx, base.freq, base.duration, masterVolume);
            } catch (err) {
                // Fail silently; audio support might be blocked.
            }
        };
    }, [ensureContext, masterVolume, muted]);

    return { play };
};

export default useSound;
