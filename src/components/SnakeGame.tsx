import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION = { x: 0, y: -1 };
const INITIAL_SPEED = 120;

export default function SnakeGame({ onScoreUpdate }: { onScoreUpdate: (score: number) => void }) {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [score, setScore] = useState(0);
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);

  const generateFood = useCallback(() => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      const isOnSnake = snake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
      if (!isOnSnake) break;
    }
    return newFood;
  }, [snake]);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setScore(0);
    onScoreUpdate(0);
    setIsGameOver(false);
    setIsPaused(false);
    setFood(generateFood());
  };

  const moveSnake = useCallback(() => {
    if (isPaused || isGameOver) return;

    setSnake(prevSnake => {
      const head = prevSnake[0];
      const newHead = {
        x: (head.x + direction.x + GRID_SIZE) % GRID_SIZE,
        y: (head.y + direction.y + GRID_SIZE) % GRID_SIZE,
      };

      if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        setIsGameOver(true);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(s => {
          const newScore = s + 10;
          onScoreUpdate(newScore);
          return newScore;
        });
        setFood(generateFood());
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, isGameOver, isPaused, generateFood, onScoreUpdate]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          if (direction.y === 0) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          if (direction.y === 0) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          if (direction.x === 0) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          if (direction.x === 0) setDirection({ x: 1, y: 0 });
          break;
        case ' ':
          if (isGameOver) resetGame();
          else setIsPaused(p => !p);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction, isGameOver]);

  useEffect(() => {
    gameLoopRef.current = setInterval(moveSnake, INITIAL_SPEED);
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [moveSnake]);

  return (
    <div className="relative flex flex-col items-center justify-center p-4 font-pixel">
      <div 
        className="relative grid bg-black border-4 border-[#00ffff] shadow-[8px_8px_0px_#ff00ff] overflow-hidden"
        style={{
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          width: 'min(80vw, 500px)',
          aspectRatio: '1/1'
        }}
      >
        {/* Snake */}
        {snake.map((segment, i) => (
          <div
            key={`${i}-${segment.x}-${segment.y}`}
            style={{
              gridColumnStart: segment.x + 1,
              gridRowStart: segment.y + 1,
            }}
            className={`${
              i === 0 
                ? 'bg-[#00ffff] shadow-[0_0_10px_#00ffff]' 
                : 'bg-[#ff00ff]'
            } border border-black`}
          />
        ))}

        {/* Food */}
        <div
          style={{
            gridColumnStart: food.x + 1,
            gridRowStart: food.y + 1,
          }}
          className="bg-white animate-pulse shadow-[0_0_15px_#ffffff]"
        />

        {/* Overlay */}
        <AnimatePresence>
          {(isGameOver || isPaused) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 z-20"
            >
              {isGameOver ? (
                <div className="text-center p-8 border-2 border-[#ff00ff]">
                  <h2 className="text-5xl font-bold text-[#ff00ff] mb-4 glitch-text" data-text="SYSTEM_FAILURE">SYSTEM_FAILURE</h2>
                  <p className="text-[#00ffff] text-2xl mb-6">DATA_LOSS: {score}</p>
                  <button
                    onClick={resetGame}
                    className="px-8 py-3 bg-[#00ffff] text-black font-bold text-xl hover:bg-white transition-colors shadow-[4px_4px_0px_#ff00ff] active:translate-y-1"
                  >
                    REBOOT_CORE
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <h2 className="text-5xl font-bold text-[#00ffff] mb-4 glitch-text" data-text="HALT_EXECUTION">HALT_EXECUTION</h2>
                  <p className="text-white/60 text-xl mb-6">INPUT_REQUIRED: [SPACE]</p>
                  <button
                    onClick={() => setIsPaused(false)}
                    className="px-8 py-3 bg-[#ff00ff] text-black font-bold text-xl hover:bg-white transition-colors shadow-[4px_4px_0px_#00ffff]"
                  >
                    RESUME_PROCESS
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      <div className="mt-8 grid grid-cols-2 gap-x-12 gap-y-2 text-xl text-[#00ffff]">
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 bg-[#00ffff]" />
          <span>UNIT_SEGMENT</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 bg-[#ff00ff]" />
          <span>CORE_DATA</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 bg-white" />
          <span>PACKET_NODE</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[#ff00ff]">[SPACE]</span>
          <span>INTERRUPT</span>
        </div>
      </div>
    </div>
  );
}
