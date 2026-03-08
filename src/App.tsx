import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Activity, Database, Cpu, ShieldAlert } from 'lucide-react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';

export default function App() {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  const handleScoreUpdate = (newScore: number) => {
    setScore(newScore);
    if (newScore > highScore) {
      setHighScore(newScore);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col relative overflow-hidden font-mono selection:bg-[#ff00ff] selection:text-black">
      {/* CRT & Noise Overlays */}
      <div className="crt-overlay" />
      <div className="noise" />
      
      {/* Header */}
      <header className="relative z-10 p-6 flex justify-between items-center border-b-4 border-[#00ffff] bg-black">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-[#ff00ff] flex items-center justify-center shadow-[4px_4px_0px_#00ffff]">
            <Cpu className="text-black w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tighter text-[#00ffff] glitch-text" data-text="VOID_OS_v0.9.4">VOID_OS_v0.9.4</h1>
            <p className="text-sm text-[#ff00ff] uppercase tracking-[0.3em]">KERNEL_MODE: UNRESTRICTED</p>
          </div>
        </div>

        <div className="flex gap-12">
          <div className="text-right">
            <p className="text-xs text-[#00ffff]/60 uppercase tracking-widest mb-1">LOCAL_DATA</p>
            <p className="text-3xl font-bold text-[#00ffff]">{score.toString().padStart(6, '0')}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-[#ff00ff]/60 uppercase tracking-widest mb-1">MAX_RECOVERY</p>
            <p className="text-3xl font-bold text-[#ff00ff]">{highScore.toString().padStart(6, '0')}</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col lg:flex-row items-center justify-center p-8 gap-12 relative z-10">
        {/* Left Sidebar - System Diagnostics */}
        <div className="hidden lg:flex flex-col gap-6 w-72">
          <div className="bg-black p-5 border-2 border-[#00ffff] shadow-[4px_4px_0px_#ff00ff]">
            <div className="flex items-center gap-3 mb-4 border-b border-[#00ffff]/30 pb-2">
              <Activity className="w-5 h-5 text-[#00ffff]" />
              <span className="text-sm font-bold text-[#00ffff] uppercase">Diagnostics</span>
            </div>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between">
                <span className="text-white/40">CPU_LOAD</span>
                <span className="text-[#00ffff]">42.8%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/40">MEM_ALLOC</span>
                <span className="text-[#00ffff]">1024MB</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/40">NET_STATUS</span>
                <span className="text-[#00ffff]">ENCRYPTED</span>
              </div>
            </div>
          </div>
          
          <div className="bg-black p-5 border-2 border-[#ff00ff] shadow-[4px_4px_0px_#00ffff]">
            <div className="flex items-center gap-3 mb-4 border-b border-[#ff00ff]/30 pb-2">
              <ShieldAlert className="w-5 h-5 text-[#ff00ff]" />
              <span className="text-sm font-bold text-[#ff00ff] uppercase">Alerts</span>
            </div>
            <p className="text-[11px] text-[#ff00ff]/70 leading-relaxed italic">
              WARNING: UNAUTHORIZED DATA ACCESS DETECTED IN SECTOR_7.
            </p>
          </div>
        </div>

        {/* Center - Game Engine */}
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex-shrink-0 screen-tear"
        >
          <div className="mb-4 flex items-center gap-3 px-2">
            <Database className="w-5 h-5 text-[#00ffff]" />
            <span className="text-sm font-bold text-[#00ffff] uppercase tracking-widest">Data_Stream_01</span>
          </div>
          <SnakeGame onScoreUpdate={handleScoreUpdate} />
        </motion.div>

        {/* Right Sidebar - Audio Processor */}
        <motion.div 
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="w-full max-w-md lg:w-96"
        >
          <div className="flex items-center gap-3 mb-4 px-2">
            <Activity className="w-5 h-5 text-[#ff00ff]" />
            <span className="text-sm font-bold text-[#ff00ff] uppercase tracking-widest">Audio_Buffer</span>
          </div>
          <MusicPlayer />
          
          <div className="mt-8 p-4 bg-[#ff00ff]/5 border-2 border-[#ff00ff]/20">
            <p className="text-xs text-[#ff00ff]/60 font-pixel leading-loose">
              LOG_ENTRY_404: THE VOID SPEAKS IN FREQUENCIES WE CANNOT YET COMPREHEND. 
              STAY_ALERT. THE_SNAKE_IS_THE_KEY.
            </p>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 p-6 text-center border-t-4 border-[#ff00ff] bg-black">
        <p className="text-sm text-white/30 tracking-[0.5em] uppercase">
          [ END_OF_TRANSMISSION ]
        </p>
      </footer>
    </div>
  );
}
