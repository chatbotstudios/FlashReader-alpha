import { useState, useEffect, useRef, useCallback } from 'react';
import { WordDisplay } from './WordDisplay';
import { parseText, ParsedWord, calculateTotalTime } from '../utils/wordParser';
import { Play, Pause, RotateCcw, Rewind } from 'lucide-react';

interface SpeedReaderProps {
  text: string;
  onComplete?: () => void;
}

export function SpeedReader({ text, onComplete }: SpeedReaderProps) {
  const [words, setWords] = useState<ParsedWord[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [wpm, setWpm] = useState(300);
  const [showControls, setShowControls] = useState(false);

  const timeoutRef = useRef<number>();
  const startTimeRef = useRef<number>(0);
  const elapsedTimeRef = useRef<number>(0);
  const hideTimerRef = useRef<number>();
  const controlsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (text.trim()) {
      const parsed = parseText(text);
      setWords(parsed);
      setCurrentIndex(0);
      setIsPlaying(false);
      elapsedTimeRef.current = 0;
    }
  }, [text]);

  const scheduleNextWord = useCallback(() => {
    if (currentIndex >= words.length - 1) {
      setIsPlaying(false);
      onComplete?.();
      return;
    }

    const currentWord = words[currentIndex];
    const baseInterval = 60000 / wpm;
    const delay = baseInterval * currentWord.delay;

    timeoutRef.current = window.setTimeout(() => {
      setCurrentIndex((prev) => prev + 1);
    }, delay);
  }, [currentIndex, words, wpm, onComplete]);

  useEffect(() => {
    if (isPlaying && words.length > 0) {
      startTimeRef.current = Date.now() - elapsedTimeRef.current;
      scheduleNextWord();
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isPlaying, currentIndex, scheduleNextWord, words]);

  const togglePlayPause = useCallback(() => {
    if (isPlaying) {
      elapsedTimeRef.current = Date.now() - startTimeRef.current;
    }
    setIsPlaying((prev) => !prev);
  }, [isPlaying]);

  const restart = useCallback(() => {
    setCurrentIndex(0);
    setIsPlaying(false);
    elapsedTimeRef.current = 0;
  }, []);

  const stepBack = useCallback(() => {
    const targetIndex = Math.max(0, currentIndex - Math.floor(wpm / 12));
    setCurrentIndex(targetIndex);
    elapsedTimeRef.current = 0;
  }, [currentIndex, wpm]);

  const stepForward = useCallback(() => {
    const targetIndex = Math.min(words.length - 1, currentIndex + Math.floor(wpm / 12));
    setCurrentIndex(targetIndex);
    elapsedTimeRef.current = 0;
  }, [currentIndex, wpm, words.length]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        togglePlayPause();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        stepBack();
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        stepForward();
      } else if (e.code === 'ArrowUp') {
        e.preventDefault();
        setWpm((prev) => Math.min(1000, prev + 50));
      } else if (e.code === 'ArrowDown') {
        e.preventDefault();
        setWpm((prev) => Math.max(100, prev - 50));
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [togglePlayPause, stepBack, stepForward]);

  useEffect(() => {
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    if (showControls) {
      hideTimerRef.current = window.setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
  }, [showControls]);

  const handleControlsMouseEnter = () => {
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    setShowControls(true);
  };

  const handleControlsMouseLeave = () => {
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    hideTimerRef.current = window.setTimeout(() => {
      setShowControls(false);
    }, 3000);
  };

  const handleControlsInteraction = () => {
    setShowControls(true);
  };

  const progress = words.length > 0 ? (currentIndex / words.length) * 100 : 0;
  const totalTime = words.length > 0 ? calculateTotalTime(words, wpm) : 0;
  const elapsedSeconds = (currentIndex / words.length) * totalTime;
  const remainingSeconds = totalTime - elapsedSeconds;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (words.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center opacity-30 select-none">
        <div className="text-6xl font-mono text-gray-400 dark:text-gray-600">Ready</div>
        <p className="mt-4 text-gray-400 dark:text-gray-500">Input text below to start</p>
      </div>
    );
  }

  const currentWord = words[currentIndex];

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 flex items-center justify-center">
        <WordDisplay word={currentWord.text} orpIndex={currentWord.orpIndex} />
      </div>

      <div
        ref={controlsRef}
        className="px-4 sm:px-8 pb-12 space-y-6 transition-opacity duration-300 mt-auto"
        style={{
          opacity: showControls ? 1 : 0.25,
          pointerEvents: showControls ? 'auto' : 'auto',
        }}
        onMouseEnter={handleControlsMouseEnter}
        onMouseLeave={handleControlsMouseLeave}
        onClick={handleControlsInteraction}
      >
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-400">
            <span>Elapsed: {formatTime(elapsedSeconds)}</span>
            <span>{Math.round(progress)}%</span>
            <span>Remaining: {formatTime(remainingSeconds)}</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
            <div
              className="bg-blue-500 h-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-gray-600 dark:text-gray-300 min-w-24">
              Speed: {wpm} WPM
            </label>
            <input
              type="range"
              min="100"
              max="1000"
              step="50"
              value={wpm}
              onChange={(e) => setWpm(Number(e.target.value))}
              className="flex-1 h-3 sm:h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
          </div>

          <div className="flex justify-center gap-3">
            <button
              onClick={stepBack}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg transition-colors border border-gray-200 dark:border-gray-600"
              title="Step back 5 seconds"
            >
              <Rewind size={20} />
              <span className="text-sm">-5s</span>
            </button>

            <button
              onClick={togglePlayPause}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors font-medium shadow-sm"
            >
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
              <span>{isPlaying ? 'Pause' : 'Play'}</span>
            </button>

            <button
              onClick={restart}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg transition-colors border border-gray-200 dark:border-gray-600"
              title="Restart from beginning"
            >
              <RotateCcw size={20} />
              <span className="text-sm">Restart</span>
            </button>
          </div>

          <p className="text-center text-xs text-gray-400 dark:text-gray-500">
            Press <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded">Space</kbd> to play/pause
          </p>
        </div>
      </div>
    </div>
  );
}
