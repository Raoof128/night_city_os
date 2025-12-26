import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Square } from 'lucide-react';

const MusicPlayerApp = () => {
  const [playing, setPlaying] = useState(false);
  const [track, setTrack] = useState(0);
  const tracks = [
    'NIGHT_CITY_RADIO_V1',
    'SAMURAI_NEVER_FADE',
    'ARASAKA_CORP_ANTHEM',
    'BADLANDS_WIND',
  ];

  return (
    <div className="h-full bg-black p-6 flex flex-col items-center justify-center text-center relative overflow-hidden">
      {/* Audio Visualizer Background Mockup */}
      {playing && (
        <div className="absolute inset-0 opacity-20 flex items-end justify-center gap-1 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="w-2 bg-[var(--color-yellow)]"
              animate={{ height: ['10%', '80%', '30%'] }}
              transition={{
                duration: 0.5,
                repeat: Infinity,
                repeatType: 'reverse',
                delay: i * 0.05,
              }}
            />
          ))}
        </div>
      )}

      <div className="w-48 h-48 border-4 border-gray-800 rounded-full flex items-center justify-center mb-8 relative z-10 bg-black">
        <motion.div
          animate={{ rotate: playing ? 360 : 0 }}
          transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
          className="absolute inset-0 border-t-4 border-[var(--color-yellow)] rounded-full"
        />
        <div className="text-6xl text-gray-800 select-none">♪</div>
      </div>

      <div className="text-[var(--color-blue)] font-mono text-lg mb-2 tracking-widest relative z-10">
        {tracks[track]}
      </div>
      <div className="text-xs text-[var(--color-red)] font-bold mb-4 relative z-10">
        {playing ? 'PLAYING...' : 'PAUSED'}
      </div>

      {/* Progress Bar Mock */}
      <div className="w-full h-1 bg-gray-800 mb-8 relative z-10">
        <motion.div
          className="h-full bg-[var(--color-yellow)]"
          initial={{ width: '0%' }}
          animate={{ width: playing ? '100%' : '0%' }}
          transition={{ duration: 180, ease: 'linear' }} // Mock 3 min song
        />
      </div>

      <div className="flex items-center gap-6 relative z-10 mb-6">
        <button
          onClick={() => setTrack((t) => (t - 1 + tracks.length) % tracks.length)}
          className="p-3 border border-[var(--color-blue)] hover:bg-[var(--color-blue)] hover:text-black transition-colors"
        >
          <ChevronRight className="rotate-180" />
        </button>
        <button
          onClick={() => setPlaying(!playing)}
          className="p-4 border-2 border-[var(--color-yellow)] bg-[var(--color-yellow)]/10 hover:bg-[var(--color-yellow)] hover:text-black transition-colors rounded-full"
        >
          {playing ? (
            <Square size={24} fill="currentColor" />
          ) : (
            <ChevronRight size={24} fill="currentColor" />
          )}
        </button>
        <button
          onClick={() => setTrack((t) => (t + 1) % tracks.length)}
          className="p-3 border border-[var(--color-blue)] hover:bg-[var(--color-blue)] hover:text-black transition-colors"
        >
          <ChevronRight />
        </button>
      </div>

      <div className="flex items-center gap-2 w-2/3 relative z-10">
        <span className="text-xs text-gray-500 font-bold">VOL</span>
        <input
          type="range"
          className="w-full accent-[var(--color-yellow)] h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer"
        />
      </div>
    </div>
  );
};

export default MusicPlayerApp;
