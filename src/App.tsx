import { useState, useEffect, useRef } from 'react';
import { TextInput } from './components/TextInput';
import { SpeedReader } from './components/SpeedReader';
import { ThemeToggle } from './components/ThemeToggle';

function App() {
  const [currentText, setCurrentText] = useState('');
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme === 'light' || savedTheme === 'dark') return savedTheme as 'light' | 'dark';
      return 'dark';
    }
    return 'dark';
  });
  const [showControls, setShowControls] = useState(true);
  const hideTimerRef = useRef<number>();

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  useEffect(() => {
    const handleInteraction = () => {
      setShowControls(true);
      if (hideTimerRef.current) window.clearTimeout(hideTimerRef.current);
      hideTimerRef.current = window.setTimeout(() => {
        setShowControls(false);
      }, 3000);
    };

    window.addEventListener('mousemove', handleInteraction);
    window.addEventListener('keydown', handleInteraction);
    window.addEventListener('mousedown', handleInteraction);
    window.addEventListener('touchstart', handleInteraction);

    handleInteraction();

    return () => {
      window.removeEventListener('mousemove', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
      window.removeEventListener('mousedown', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
      if (hideTimerRef.current) window.clearTimeout(hideTimerRef.current);
    };
  }, []);

  const handleTextSubmit = (text: string) => {
    setCurrentText(text);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <div className="container mx-auto py-4 sm:py-8 px-4 min-h-screen flex flex-col gap-6 sm:gap-8 max-w-4xl relative">
        <header
          className="flex justify-between items-start sm:items-center mb-2 sm:mb-4 transition-opacity duration-300"
          style={{ opacity: showControls ? 1 : 0.25 }}
        >
          <div className="flex flex-col pr-4">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
              FlashRead
            </h1>
            <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">Master Speed Reading</p>
          </div>
          <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
        </header>

        <section className="flex-1 flex flex-col min-h-[400px]">
          <SpeedReader
            text={currentText}
            onComplete={() => { }}
            showControls={showControls}
          />
        </section>

        <section className="mt-auto border-t border-gray-200 dark:border-gray-800 pt-8 pb-12">
          <TextInput
            onTextSubmit={handleTextSubmit}
            showControls={showControls}
          />
        </section>
      </div>
    </div>
  );
}

export default App;
