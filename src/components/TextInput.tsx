import { useState } from 'react';
import { FileText, Upload } from 'lucide-react';

interface TextInputProps {
  onTextSubmit: (text: string) => void;
}

export function TextInput({ onTextSubmit }: TextInputProps) {
  const [inputText, setInputText] = useState('');

  const handleSubmit = () => {
    if (inputText.trim()) {
      onTextSubmit(inputText);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const text = await file.text();
    setInputText(text);
    onTextSubmit(text);
  };

  const loadSampleText = () => {
    const sample = `Speed reading is the process of rapidly recognizing and absorbing phrases or sentences on a page all at once, rather than identifying individual words.

The amount of information we process seems to be growing by the day. Whether it's emails, reports and websites at work or social media, books and magazines at home, we're all constantly taking in written content.

Most people read at an average rate of 250 words per minute, though some are naturally faster than others. However, the ability to speed read could mean that you double this rate.

With some practice and the right technique, you can significantly increase your reading speed while maintaining comprehension. The key is to minimize subvocalization, reduce regression, and use visual recognition patterns.

This speed reading application uses the RSVP technique: Rapid Serial Visual Presentation. Each word flashes on screen one at a time, with the optimal recognition point highlighted in red. This minimizes eye movement and allows your brain to process words more efficiently.`;

    setInputText(sample);
    onTextSubmit(sample);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 space-y-4 border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 mb-2">
          <FileText size={20} />
          <h2 className="font-semibold text-lg">Input Your Text</h2>
        </div>

        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Paste your text here or upload a file..."
          className="w-full h-48 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-lg p-4 border border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none resize-none font-mono text-sm transition-colors duration-200"
        />

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleSubmit}
            disabled={!inputText.trim()}
            className="w-full sm:flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-200 dark:disabled:bg-gray-700 disabled:text-gray-400 dark:disabled:text-gray-500 disabled:cursor-not-allowed rounded-lg transition-all duration-200 font-medium text-white shadow-sm"
          >
            Start Reading
          </button>

          <label className="w-full sm:flex-1 px-6 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg transition-all duration-200 font-medium cursor-pointer flex items-center justify-center gap-2 border border-gray-200 dark:border-gray-600 shadow-sm">
            <Upload size={20} />
            Upload .txt
            <input
              type="file"
              accept=".txt"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>

          <button
            onClick={loadSampleText}
            className="w-full sm:flex-1 px-6 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg transition-all duration-200 font-medium border border-gray-200 dark:border-gray-600 shadow-sm"
          >
            Load Sample
          </button>
        </div>

        <div className="pt-4 border-t border-gray-100 dark:border-gray-700 space-y-2 text-sm text-gray-500 dark:text-gray-400">
          <h3 className="font-semibold text-gray-700 dark:text-gray-300">How It Works:</h3>
          <ul className="space-y-1 list-disc list-inside">
            <li>Words appear one at a time with the ORP (Optimal Recognition Point) highlighted in red</li>
            <li>Adjust speed from 100-1000 WPM using the slider</li>
            <li>Smart slowing automatically pauses longer at punctuation and complex words</li>
            <li>Use spacebar to play/pause, or click the controls</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
