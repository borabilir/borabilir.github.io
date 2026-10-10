import { useEffect, useRef } from 'react';

const LEVEL_TRACKS: Record<string, string> = {
    '1-1': '/mario/1-1.mp3',
    '1-2': '/mario/1-2.mp3',
    '1-3': '/mario/1-1.mp3',
    '1-4': '/mario/1-4.mp3',
    '1-5': '/mario/1-5.mp3',
};

export const useGameMusic = (phase: string, level: string, sound: boolean, runId: number) => {
    const ref = useRef<HTMLAudioElement>(null);
    const soundEnabled = useRef(sound);
    const source = phase === 'playing' ? LEVEL_TRACKS[level] : phase === 'ending' || phase === 'ended' ? '/mario/GameEnd.mp3' : phase === 'won' ? '/mario/LevelEnd.mp3' : undefined;
    const loop = phase === 'playing';

    useEffect(() => {
        const track = ref.current;
        if (!track) return;
        track.volume = 0.35;
        track.pause();
        track.currentTime = 0;
        if (source && soundEnabled.current) void track.play().catch(() => {});
        if (!source) track.load();
        return () => { track.pause(); };
    }, [source, loop, runId]);

    useEffect(() => {
        soundEnabled.current = sound;
        const track = ref.current;
        if (!track) return;
        if (!sound) track.pause();
        else if (track.getAttribute('src') && !track.ended) void track.play().catch(() => {});
    }, [sound]);

    // Retry at the next game input if a browser initially blocks playback.
    useEffect(() => {
        const resume = () => {
            const track = ref.current;
            if (soundEnabled.current && track?.getAttribute('src') && track.paused && !track.ended) {
                void track.play().catch(() => {});
            }
        };
        window.addEventListener('pointerdown', resume);
        window.addEventListener('keydown', resume);
        return () => {
            window.removeEventListener('pointerdown', resume);
            window.removeEventListener('keydown', resume);
        };
    }, []);

    return { ref, source, loop };
};
