import { useEffect, useRef } from 'react';

interface WordDisplayProps {
  word: string;
  orpIndex: number;
}

export function WordDisplay({ word, orpIndex }: WordDisplayProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.classList.remove('word-flash');
      void containerRef.current.offsetWidth;
      containerRef.current.classList.add('word-flash');
    }
  }, [word]);

  return (
    <div className="flex flex-col items-center justify-center h-48 sm:h-64 relative">
      <div className="absolute top-1/2 left-1/2 w-0.5 h-6 sm:h-8 bg-blue-500 dark:bg-blue-400 -translate-x-1/2 -translate-y-12 sm:-translate-y-16 opacity-50" />
      <div className="absolute top-1/2 left-1/2 w-0.5 h-6 sm:h-8 bg-blue-500 dark:bg-blue-400 -translate-x-1/2 translate-y-6 sm:translate-y-8 opacity-50" />

      <div
        ref={containerRef}
        className="text-4xl sm:text-6xl md:text-7xl font-mono tracking-wider word-flash select-none"
        style={{
          display: 'flex',
          justifyContent: 'center',
          letterSpacing: '0.1em',
        }}
      >
        {word.split('').map((char, idx) => (
          <span
            key={idx}
            className={idx === orpIndex ? 'text-red-600 dark:text-red-500 font-bold' : 'text-gray-800 dark:text-gray-100'}
            style={{
              display: 'inline-block',
              minWidth: '0.6em',
              textAlign: 'center',
            }}
          >
            {char}
          </span>
        ))}
      </div>
    </div>
  );
}
