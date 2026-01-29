export interface ParsedWord {
  text: string;
  delay: number;
  orpIndex: number;
}

export interface SmartSlowingConfig {
  sentenceEndMultiplier: number;
  clauseEndMultiplier: number;
  longWordMultiplier: number;
  paragraphBreakMultiplier: number;
  longWordThreshold: number;
}

const DEFAULT_CONFIG: SmartSlowingConfig = {
  sentenceEndMultiplier: 4.0,
  clauseEndMultiplier: 1.5,
  longWordMultiplier: 1.2,
  paragraphBreakMultiplier: 3.0,
  longWordThreshold: 10,
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

  paragraphs.forEach((paragraph, paraIndex) => {
    const paraWords = paragraph
      .split(/\s+/)
      .filter((w) => w.trim().length > 0);

    paraWords.forEach((word, wordIndex) => {
      const isParaBreak = wordIndex === 0 && paraIndex > 0;
      const delay = calculateDelay(word, isParaBreak, config);
      const orpIndex = calculateORP(word);

      words.push({
        text: word,
        delay,
        orpIndex,
      });
    });
  });

  return words;
}

export function calculateTotalTime(words: ParsedWord[], wpm: number): number {
  const baseInterval = 60000 / wpm;
  const totalMs = words.reduce((sum, word) => sum + baseInterval * word.delay, 0);
  return totalMs / 1000;
}
