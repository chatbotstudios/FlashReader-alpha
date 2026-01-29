export interface ParsedWord {
  text: string;
  delay: number;
  orpIndex: number;
  sentenceIndex: number;
}

export interface SmartSlowingConfig {
  sentenceEndMultiplier: number;
  clauseEndMultiplier: number;
  longWordMultiplier: number;
  paragraphBreakMultiplier: number;
  longWordThreshold: number;
}

const DEFAULT_CONFIG: SmartSlowingConfig = {
  sentenceEndMultiplier: 3.0,
  clauseEndMultiplier: 1.5,
  longWordMultiplier: 2.0,
  paragraphBreakMultiplier: 3.0,
  longWordThreshold: 12,
};

export function calculateORP(word: string): number {
  const length = word.length;
  if (length <= 1) return 0;
  return Math.floor(length * 0.3);
}

export function calculateDelay(
  word: string,
  isParaBreak: boolean,
  config: SmartSlowingConfig = DEFAULT_CONFIG
): number {
  let multiplier = 1.0;

  if (isParaBreak) {
    multiplier *= config.paragraphBreakMultiplier;
  }

  const lastChar = word.slice(-1);
  if (['.', '!', '?'].includes(lastChar)) {
    multiplier *= config.sentenceEndMultiplier;
  } else if ([',', ';', ':'].includes(lastChar)) {
    multiplier *= config.clauseEndMultiplier;
  }

  if (word.length > config.longWordThreshold) {
    multiplier *= config.longWordMultiplier;
  }

  return multiplier;
}

export function parseText(text: string, config?: SmartSlowingConfig): ParsedWord[] {
  const paragraphs = text.split(/\n\n+/);
  const words: ParsedWord[] = [];
  let globalSentenceIndex = 0;

  paragraphs.forEach((paragraph, paraIndex) => {
    // Split paragraph into sentences
    const sentences = paragraph.split(/(?<=[.!?])\s+/).filter(s => s.trim().length > 0);

    sentences.forEach((sentence, sentIndex) => {
      const sentenceWords = sentence.split(/\s+/).filter(w => w.trim().length > 0);

      sentenceWords.forEach((word, wordIndex) => {
        const isParaBreak = paraIndex > 0 && sentIndex === 0 && wordIndex === 0;
        const delay = calculateDelay(word, isParaBreak, config);
        const orpIndex = calculateORP(word);

        words.push({
          text: word,
          delay,
          orpIndex,
          sentenceIndex: globalSentenceIndex,
        });
      });
      globalSentenceIndex++;
    });
  });

  return words;
}

export function calculateTotalTime(words: ParsedWord[], wpm: number): number {
  const baseInterval = 60000 / wpm;
  const totalMs = words.reduce((sum, word) => sum + baseInterval * word.delay, 0);
  return totalMs / 1000;
}
