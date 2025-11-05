// src/pages/SettingsPage.tsx (xAI Section Only — Replace This Block)
{/* xAI API Key */}
<div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border">
  <h2 className="text-xl font-semibold mb-4">xAI API Configuration</h2>
  <div className="space-y-4">
    <div>
      <label className="block text-sm font-medium mb-2">API Key</label>
      <input
        type="password"
        value={apiKey}
        onChange={(e) => setApiKey(e.target.value)}
        placeholder="xai-..."
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
      />
      <p className="text-xs text-gray-500 mt-1">
        Get your key at{' '}
        <a href="https://console.x.ai" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
          console.x.ai
        </a>
        . Saved locally.
      </p>
    </div>

    <button
      onClick={testApiKey}
      disabled={!apiKey}
      className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
    >
      Test API Key
    </button>

    {isValidKey !== null && (
      <div className={`p-3 rounded-md flex items-center gap-2 ${
        isValidKey
          ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400'
          : 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400'
      }`}>
        {isValidKey ? (
          <>
            Valid API Key
          </>
        ) : (
          <>
            Invalid API Key
          </>
        )}
      </div>
    )}
  </div>
</div>