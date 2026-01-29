# SwiftRead RSVP Engine

A modern, feature-rich speed-reading application built with React, TypeScript, and Vite. SwiftRead uses Rapid Serial Visual Presentation (RSVP) technology to help users dramatically increase their reading speed while maintaining comprehension.

## Features

### 1. WPM Control
- Adjustable reading speed from 100 to 1000 words per minute
- Real-time speed adjustment via intuitive slider
- Formula: `Interval (ms) = 60000 / WPM`

### 2. Focal Alignment / Optimal Recognition Point (ORP)
- **Smart character highlighting**: Each word displays with the ORP (approximately 30% into the word) highlighted in red
- **Monospaced font**: Ensures consistent character alignment
- **Visual guides**: Horizontal blue markers at the center help maintain focus
- **Minimizes eye movement**: By centering text on the focal point, your eyes stay fixed while words change

### 3. Smart Slowing
Context-aware timing adjustments for improved comprehension:
- **Sentence endings** (`.`, `!`, `?`): 2.0x base interval
- **Clause endings** (`,`, `;`, `:`): 1.5x base interval
- **Long words** (>10 characters): 1.2x base interval
- **Paragraph breaks**: 3.0x base interval

### 4. Input Management
- **Paste text**: Direct text input via textarea
- **File upload**: Support for `.txt` files
- **Sample text**: Built-in demo content to try the app immediately

### 5. Playback Controls
- **Play/Pause**: Click button or press spacebar
- **Step back**: Jump back approximately 5 seconds
- **Restart**: Return to the beginning instantly
- **Keyboard shortcuts**: Spacebar for play/pause

### 6. Progress Tracking
- **Visual progress bar**: Shows completion percentage
- **Elapsed time**: Displays time spent reading
- **Remaining time**: Estimates time to completion
- **Real-time updates**: All metrics update dynamically

### 7. Smart Control Interface
- **Dynamic fade behavior**: Progress bar, speed slider, and playback controls fade to 50% opacity by default for a clean, immersive reading experience
- **Smart reveal**: Controls automatically become fully visible (100% opacity) on hover or click
- **Auto-fade timer**: Controls return to 50% opacity after 6 seconds of inactivity
- **Unobtrusive design**: Minimizes visual clutter while keeping controls easily accessible

## Technology Stack

- **React 18**: Modern component-based UI
- **TypeScript**: Type-safe development
- **Vite**: Fast build tool and dev server
- **Tailwind CSS**: Utility-first styling
- **Lucide React**: Beautiful icon library

## Project Structure

```
src/
├── components/
│   ├── WordDisplay.tsx      # RSVP display with ORP highlighting
│   ├── SpeedReader.tsx       # Main reading engine with controls
│   └── TextInput.tsx         # Text input and file upload interface
├── utils/
│   └── wordParser.ts         # Word parsing and smart slowing logic
├── App.tsx                   # Root application component
├── main.tsx                  # Application entry point
└── index.css                 # Global styles and animations
```

## Core Algorithm

### Word Parsing with Smart Slowing

```typescript
// Calculate ORP position (30% into word)
function calculateORP(word: string): number {
  const length = word.length;
  if (length <= 1) return 0;
  return Math.floor(length * 0.3);
}

// Calculate delay multiplier based on context
function calculateDelay(word: string, isParaBreak: boolean): number {
  let multiplier = 1.0;

  if (isParaBreak) multiplier *= 3.0;

  const lastChar = word.slice(-1);
  if (['.', '!', '?'].includes(lastChar)) {
    multiplier *= 2.0;
  } else if ([',', ';', ':'].includes(lastChar)) {
    multiplier *= 1.5;
  }

  if (word.length > 10) multiplier *= 1.2;

  return multiplier;
}
```

### Timing Engine

The reader uses a recursive setTimeout approach with dynamic delays:

```typescript
const baseInterval = 60000 / wpm;
const delay = baseInterval * word.delayMultiplier;

setTimeout(() => {
  displayNextWord();
}, delay);
```

## ORP Focal Alignment

The Optimal Recognition Point is the character position where the eye naturally focuses for fastest word recognition. By highlighting this position in red and centering the display around it, SwiftRead minimizes eye movement and maximizes reading efficiency.

**Implementation**:
- Each character is rendered in a flex container with fixed width
- The ORP character (at ~30% position) is colored red
- Visual guide markers appear above and below center
- Monospaced font ensures consistent spacing

## UI/UX Effects & Animations

### Control Panel Fade Behavior
The control interface uses an intelligent fade system to reduce visual clutter during reading:

- **Default state**: Controls display at 50% opacity
- **Interaction**: Hovering over or clicking on controls reveals them at full opacity
- **Auto-return**: After 6 seconds of inactivity, controls fade back to 50%
- **Smooth transitions**: 300ms fade duration for fluid visual feedback

This design provides a minimalist aesthetic while maintaining immediate access to controls.

### Word Display Animations
Each word transition features a subtle animation:

- **Flash animation**: 0.1s fade-in and scale-up for each new word
- **Smooth entry**: Words appear with a slight zoom effect for visual continuity
- **Consistent pacing**: Animation completes well before the next word displays

## CSS Animations

```css
@keyframes flash {
  0% {
    opacity: 0;
    transform: scale(0.95);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

.word-flash {
  animation: flash 0.1s ease-out;
}
```

Each word transition includes a subtle fade-in and scale animation for smooth visual flow.

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

The app will start at `http://localhost:5173`

## Build

```bash
npm run build
```

## Usage Guide

1. **Load text**: Paste content, upload a `.txt` file, or click "Load Sample"
2. **Start reading**: Click "Start Reading" to enter the reader view
3. **Adjust speed**: Use the WPM slider to find your comfortable pace (start at 250-300 WPM)
4. **Control playback**:
   - Press spacebar or click Play/Pause
   - Use "Step Back" if you missed something
   - Click "Restart" to begin again
5. **Monitor progress**: Watch the progress bar and time estimates at the bottom

### Control Panel Behavior

The control panel (progress bar, speed slider, and playback buttons) is designed to stay out of your way:

- **Faded by default**: Controls display at 50% opacity to minimize visual distraction
- **Reveal on demand**: Move your mouse over the controls or click them to reveal at full opacity
- **Auto-fade**: After 6 seconds without interaction, controls fade back to 50%
- **Always functional**: All controls remain fully interactive, regardless of opacity level

## Tips for Effective Speed Reading

- **Start slow**: Begin at 250-300 WPM and gradually increase
- **Eliminate subvocalization**: Resist the urge to "speak" words in your mind
- **Trust the ORP**: Keep your eyes fixed on the red character
- **Practice regularly**: Speed reading is a skill that improves with use
- **Check comprehension**: Periodically pause and reflect on what you've read

## Dark Mode

SwiftRead uses a dark theme by default to reduce eye strain during extended reading sessions. The color palette uses:
- Background: `gray-950`
- Cards/panels: `gray-800`
- Accent: `blue-500`
- Text: `gray-100`
- ORP highlight: `red-500`

## Browser Compatibility

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support
- Mobile browsers: Optimized for touch

## Performance

- Lightweight bundle size
- No external API calls
- Efficient rendering with React
- Smooth 60fps animations
- Minimal memory footprint

## Future Enhancements

Potential features for future versions:
- **Live text progression**: Real-time view of the surrounding text with dynamic scrolling and word highlighting (code already implemented, awaiting UI integration)
- **EPUB file support**: Better parsing for eBook formats
- **Reading statistics**: Track reading speed improvements and sessions over time
- **Customizable color themes**: User-selectable color schemes for different preferences
- **Multiple ORP highlighting styles**: Alternative focal point visualization options
- **Comprehension tests**: Built-in comprehension quizzes after reading sessions
- **Cloud sync**: Save reading progress and settings across devices
- **Mobile app version**: Native mobile application with touch-optimized controls
- **Advanced smart slowing**: Machine learning-based difficulty detection
- **Dictionary integration**: Quick word definitions on hover/click

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

---

Built with React, TypeScript, and Vite. Designed for readers who want to consume more content in less time.
