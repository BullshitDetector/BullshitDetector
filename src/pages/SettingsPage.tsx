// src/pages/SettingsPage.tsx
import { useTheme } from '../contexts/ThemeContext';
import { useUserMode } from '../contexts/UserModeContext';
import { useModel } from '../contexts/ModelContext';

export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme();
  const { mode, setMode } = useUserMode();
  const { model, setModel } = useModel();

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-2">Settings</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Customize your Bullshit Detector experience.
      </p>

      <div className="space-y-8">
        {/* Theme */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border">
          <h2 className="text-xl font-semibold mb-4">Appearance</h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Dark Mode</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Toggle between light and dark themes.
              </p>
            </div>
            <button
              onClick={toggleTheme}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                theme === 'dark' ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  theme === 'dark' ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* User Mode */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border">
          <h2 className="text-xl font-semibold mb-4">Analysis Mode</h2>
          <div className="space-y-3">
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <p className="font-medium">Voter Mode</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Simple, fast verdicts for everyday use.
                </p>
              </div>
              <input
                type="radio"
                name="mode"
                checked={mode === 'voter'}
                onChange={() => setMode('voter')}
                className="h-5 w-5 text-blue-600"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <p className="font-medium">Professional Mode</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  In-depth analysis with sources and citations.
                </p>
              </div>
              <input
                type="radio"
                name="mode"
                checked={mode === 'professional'}
                onChange={() => setMode('professional')}
                className="h-5 w-5 text-blue-600"
              />
            </label>
          </div>
        </div>

        {/* AI Model */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border">
          <h2 className="text-xl font-semibold mb-4">AI Model</h2>
          <div className="space-y-3">
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <p className="font-medium">Grok (xAI)</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Fast, witty, and truth-seeking.
                </p>
              </div>
              <input
                type="radio"
                name="model"
                checked={model === 'grok'}
                onChange={() => setModel('grok')}
                className="h-5 w-5 text-blue-600"
              />
            </label>
          </div>
        </div>

        {/* About */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border">
          <h2 className="text-xl font-semibold mb-4">About</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Bullshit Detector v1.0 — Built with React, Vite, Tailwind, and xAI.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
            Open source. MIT License.
          </p>
        </div>
      </div>
    </div>
  );
}