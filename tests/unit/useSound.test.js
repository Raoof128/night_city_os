import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSound } from '../../src/hooks/useSound';

class FakeAudioContext {
    static instances = [];
    constructor() {
        this.destination = {};
        this.currentTime = 0;
        this.state = 'suspended';
        this.resume = vi.fn().mockResolvedValue(undefined);
        this.createGain = vi.fn(() => ({
            gain: { value: null },
            connect: vi.fn()
        }));
        this.createOscillator = vi.fn(() => ({
            type: 'square',
            frequency: { value: null },
            connect: vi.fn(),
            start: vi.fn(),
            stop: vi.fn()
        }));
        FakeAudioContext.instances.push(this);
    }
}

describe('useSound hook', () => {
    beforeEach(() => {
        global.AudioContext = FakeAudioContext;
    });

    afterEach(() => {
        delete global.AudioContext;
        FakeAudioContext.instances = [];
    });

    it('plays a tone when unmuted', () => {
        const { result } = renderHook(() => useSound(0.5, false));
        act(() => {
            result.current.play('beep');
        });
        const ctx = FakeAudioContext.instances[0];
        expect(ctx.createOscillator).toHaveBeenCalled();
        const oscillator = ctx.createOscillator.mock.results[0].value;
        expect(oscillator.start).toHaveBeenCalledTimes(1);
        expect(oscillator.stop).toHaveBeenCalledTimes(1);
    });

    it('does not play when muted', () => {
        const { result } = renderHook(() => useSound(0.5, true));
        act(() => {
            result.current.play('beep');
        });
        const ctx = FakeAudioContext.instances[0];
        const oscillator = ctx?.createOscillator.mock.results[0]?.value;
        expect(oscillator?.start).toBeUndefined();
    });

    it('resumes suspended context on user interaction', () => {
        const { unmount } = renderHook(() => useSound(0.5, false));
        const ctx = FakeAudioContext.instances[0];
        expect(ctx.resume).not.toHaveBeenCalled();
        act(() => {
            window.dispatchEvent(new Event('pointerdown'));
        });
        expect(ctx.resume).toHaveBeenCalled();
        unmount();
    });
});
