import { useEffect, useRef, useMemo } from 'react';
import { ParsedWord } from '../utils/wordParser';

interface TextProgressionProps {
  words: ParsedWord[];
  currentIndex: number;
}

export function TextProgression({ words, currentIndex }: TextProgressionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const activeWordRef = useRef<HTMLSpanElement>(null);

  const currentWord = words[currentIndex];
  const currentSentenceIndex = currentWord?.sentenceIndex ?? 0;

  // Calculate the sliding window of sentences (6 sentences: 2 before, 1 current, 3 after)
  // or (2 before, 4 including current to make it 6 total as requested)
  // Request: "6-sentence dynamically scrolling Text"
  // Let's do: current sentence index - 2 to current sentence index + 3 (total 6)
  const windowRange = useMemo(() => {
    const start = Math.max(0, currentSentenceIndex - 2);
    const end = start + 5; // 0,1,2,3,4,5 = 6 sentences
    return { start, end };
  }, [currentSentenceIndex]);

  // Filter words that belong to the visible sentences
  const visibleWords = useMemo(() => {
    return words.filter(
      (w) => w.sentenceIndex >= windowRange.start && w.sentenceIndex <= windowRange.end
    );
  }, [words, windowRange]);

  useEffect(() => {
    if (activeWordRef.current && containerRef.current) {
      const container = containerRef.current;
      const element = activeWordRef.current;

      const containerRect = container.getBoundingClientRect();
      const elementRect = element.getBoundingClientRect();

      // Calculate position relative to container
      const relativeTop = elementRect.top - containerRect.top;
      const targetScrollTop = container.scrollTop + relativeTop - (container.clientHeight / 2) + (element.offsetHeight / 2);

      container.scrollTo({
        top: targetScrollTop,
        behavior: 'smooth'
      });
    }
  }, [currentIndex]);

  if (words.length === 0) return null;

  return (
    <div className="relative w-full h-40 px-6 py-4 overflow-hidden border-t border-b border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-950/50">
      <div
        ref={containerRef}
        className="h-full overflow-y-auto no-scrollbar mask-fade-edge"
      >
        <div className="text-lg leading-relaxed text-gray-400 dark:text-gray-500 font-mono whitespace-normal py-10 text-center">
          {visibleWords.map((word, idx) => {
            const isCurrent = words.indexOf(word) === currentIndex;
            const isPast = words.indexOf(word) < currentIndex;

            return (
              <span
                key={`${word.text}-${idx}`}
                ref={isCurrent ? activeWordRef : null}
                className={`inline-block transition-all duration-200 px-1 rounded ${isCurrent
                  ? 'text-blue-500 dark:text-blue-400 font-bold bg-blue-50/50 dark:bg-blue-900/20'
                  : isPast
                    ? 'text-gray-300 dark:text-gray-700'
                    : 'text-gray-500 dark:text-gray-400'
                  }`}
                style={{
                  marginRight: '0.25em',
                }}
              >
                {word.text}
              </span>
            );
          })}
        </div>
      </div>

      {/* Overlays for smooth fading at top and bottom */}
      <div className="absolute top-0 left-0 right-0 h-10 bg-gradient-to-b from-gray-50 dark:from-gray-950 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-gray-50 dark:from-gray-950 to-transparent pointer-events-none" />
    </div>
  );
}
