import { useEffect, useRef } from 'react';
import { ParsedWord } from '../utils/wordParser';

interface TextProgressionProps {
  words: ParsedWord[];
  currentIndex: number;
}

export function TextProgression({ words, currentIndex }: TextProgressionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const getVisibleSentences = () => {
    const text = words.map(w => w.text).join(' ');
    const sentences = text
      .split(/(?<=[.!?])\s+/)
      .map(s => s.trim())
      .filter(s => s.length > 0);

    const wordSequence = words.map(w => w.text);
    const currentWord = wordSequence[currentIndex] || '';

    let wordCount = 0;
    let currentSentenceIndex = 0;

    for (let i = 0; i < sentences.length; i++) {
      const sentenceWords = sentences[i].split(/\s+/);
      const sentenceWordCount = sentenceWords.length;

      for (const word of sentenceWords) {
        if (wordCount === currentIndex) {
          currentSentenceIndex = i;
          break;
        }
        if (wordSequence[wordCount] === word) {
          wordCount++;
        }
      }
    }

    const startIndex = Math.max(0, currentSentenceIndex - 2);
    const endIndex = Math.min(sentences.length, currentSentenceIndex + 4);

    return {
      sentences: sentences.slice(startIndex, endIndex),
      startSentenceIndex: startIndex,
      currentSentenceIndex,
    };
  };

  const { sentences, currentSentenceIndex, startSentenceIndex } = getVisibleSentences();

  const getCurrentWordPosition = () => {
    let position = 0;
    for (let i = startSentenceIndex; i < currentSentenceIndex; i++) {
      const sentenceWords = sentences[i - startSentenceIndex].split(/\s+/);
      position += sentenceWords.length + 1;
    }

    const currentSentenceWords = sentences[currentSentenceIndex - startSentenceIndex].split(/\s+/);
    for (let i = 0; i < currentSentenceWords.length; i++) {
      if (words[currentIndex]?.text === currentSentenceWords[i]) {
        return position + i;
      }
    }

    return position;
  };

  const textContent = sentences.join(' ');
  const allTextWords = textContent.split(/\s+/);
  const currentWordPos = getCurrentWordPosition();

  useEffect(() => {
    if (contentRef.current) {
      const wordElements = contentRef.current.querySelectorAll('span.word-token');
      const currentElement = wordElements[currentWordPos] as HTMLElement;

      if (currentElement && containerRef.current) {
        const containerTop = containerRef.current.getBoundingClientRect().top;
        const elementTop = currentElement.getBoundingClientRect().top;
        const offset = elementTop - containerTop;

        containerRef.current.scrollTop += offset - 60;
      }
    }
  }, [currentWordPos]);

  return (
    <div className="relative w-full h-48 px-6 py-4">
      <div
        ref={containerRef}
        className="relative h-full overflow-hidden"
        style={{
          background: 'linear-gradient(transparent, rgba(15, 23, 42, 0.8), transparent)',
        }}
      >
        <div
          ref={contentRef}
          className="text-base leading-relaxed text-gray-300 font-serif whitespace-normal"
          style={{
            paddingTop: '3rem',
            paddingBottom: '3rem',
          }}
        >
          {allTextWords.map((word, idx) => (
            <span
              key={idx}
              className={`word-token ${
                idx === currentWordPos
                  ? 'text-blue-400 font-semibold'
                  : idx < currentWordPos
                    ? 'text-gray-500'
                    : 'text-gray-400'
              }`}
              style={{
                transition: 'color 0.15s ease-out',
                marginRight: '0.25em',
              }}
            >
              {word}
            </span>
          ))}
        </div>
      </div>

      <div
        className="absolute top-0 left-0 right-0 h-16 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, rgb(15, 23, 42), transparent)',
        }}
      />
      <div
        className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none"
        style={{
          background: 'linear-gradient(to top, rgb(15, 23, 42), transparent)',
        }}
      />
    </div>
  );
}
