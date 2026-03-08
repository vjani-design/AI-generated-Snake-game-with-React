import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Music, Terminal } from 'lucide-react';
import { motion } from 'motion/react';

const TRACKS = [
  {
    id: 1,
    title: "VOID_SIGNAL",
    artist: "NULL_PTR",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    cover: "https://picsum.photos/seed/glitch1/300/300"
  },
  {
    id: 2,
    title: "BUFFER_OVERFLOW",
    artist: "STACK_TRACE",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    cover: "https://picsum.photos/seed/glitch2/300/300"
  },
  {
    id: 3,
    title: "KERNEL_PANIC",
    artist: "ROOT_ACCESS",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    cover: "https://picsum.photos/seed/glitch3/300/300"
  }
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(() => setIsPlaying(false));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const skipForward = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setProgress(0);
  };

  const skipBackward = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setProgress(0);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      setProgress((current / duration) * 100);
    }
  };

  const handleEnded = () => {
    skipForward();
  };

  return (
    <div className="bg-black p-6 w-full max-w-md border-2 border-[#00ffff] shadow-[6px_6px_0px_#ff00ff] font-pixel">
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
      />

      <div className="flex items-center gap-6">
        <div className="relative w-28 h-28 flex-shrink-0 border-2 border-[#ff00ff]">
          <img
            src={currentTrack.cover}
            alt={currentTrack.title}
            className="w-full h-full object-cover grayscale contrast-150"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-[#00ffff]/10 mix-blend-overlay" />
          {isPlaying && (
            <div className="absolute top-0 left-0 w-full h-1 bg-[#00ffff] animate-pulse" />
          )}
        </div>

        <div className="flex-grow min-w-0">
          <h3 className="text-2xl font-bold text-[#00ffff] truncate glitch-text" data-text={currentTrack.title}>{currentTrack.title}</h3>
          <p className="text-lg text-[#ff00ff] truncate">AUTH: {currentTrack.artist}</p>
          
          <div className="mt-4 flex items-center gap-4">
            <button onClick={skipBackward} className="text-[#00ffff] hover:text-white">
              <SkipBack className="w-6 h-6" />
            </button>
            <button 
              onClick={togglePlay}
              className="w-12 h-12 flex items-center justify-center bg-[#00ffff] text-black hover:bg-white transition-colors shadow-[4px_4px_0px_#ff00ff]"
            >
              {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-0.5" />}
            </button>
            <button onClick={skipForward} className="text-[#00ffff] hover:text-white">
              <SkipForward className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <div className="h-2 w-full bg-[#ff00ff]/20 border border-[#ff00ff]/40">
          <motion.div 
            className="h-full bg-[#ff00ff]"
            animate={{ width: `${progress}%` }}
            transition={{ type: 'spring', bounce: 0, duration: 0.2 }}
          />
        </div>
        <div className="mt-3 flex justify-between items-center text-sm">
           <div className="flex items-center gap-2 text-[#00ffff]">
             <Terminal className="w-4 h-4" />
             <span>STREAM_SYNC_OK</span>
           </div>
           <span className="text-[#ff00ff]">NODE_{currentTrackIndex + 1}_OF_{TRACKS.length}</span>
        </div>
      </div>
    </div>
  );
}
