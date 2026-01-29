import { useState, useEffect } from 'react';
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

  const handleTextSubmit = (text: string) => {
    setCurrentText(text);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <div className="container mx-auto py-4 sm:py-8 px-4 min-h-screen flex flex-col gap-6 sm:gap-8 max-w-4xl relative">
        <header className="flex justify-between items-start sm:items-center mb-2 sm:mb-4">
          <div className="flex flex-col pr-4">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
              SwiftRead
            </h1>
            <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">Master speed reading with RSVP</p>
          </div>
          <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
        </header>

        <section className="flex-1 flex flex-col min-h-[400px]">
          <SpeedReader text={currentText} onComplete={() => { }} />
        </section>

        <section className="mt-auto border-t border-gray-200 dark:border-gray-800 pt-8 pb-12">
          <TextInput onTextSubmit={handleTextSubmit} />
        </section>
      </div>
    </div>
  );
}

export default App;
