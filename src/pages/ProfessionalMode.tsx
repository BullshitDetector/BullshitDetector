// src/pages/ProfessionalMode.tsx
import { useState } from 'react';
import { useModel } from '../contexts/ModelContext';

interface AnalysisResult {
  score: number;
  verdict: 'bullshit' | 'mostly true' | 'neutral';
  explanation: string;
  sources?: { title: string; url: string }[];
}

export default function ProfessionalMode() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);

  const { apiKey, model } = useModel();

  const analyze = async () => {
    if (!input.trim()) return;

    setLoading(true);
    setResult(null);

    if (!apiKey) {
      setResult({
        score: 0,
        verdict: 'neutral',
        explanation: 'Please add your xAI API key in Settings to enable real analysis.',
      });
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('https://api.x.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          messages: [
            {
              role: 'system',
              content: `You are a professional fact-checker. Analyze the claim for accuracy, bias, and evidence.
              Respond **only** with valid JSON:
              {
                "score": 0.0-1.0,
                "verdict": "bullshit" | "mostly true" | "neutral",
                "explanation": "Detailed 2-3 sentence analysis",
                "sources": [{"title": "Source Name", "url": "https://..."}]
              }
              No markdown, no extra text.`,
            },
            { role: 'user', content: input },
          ],
          max_tokens: 300,
          temperature: 0.1,
        }),
      });

      if (!response.ok) throw new Error(`API error: ${response.status}`);

      const data = await response.json();
      const content = data.choices[0].message.content.trim();

      let parsed: AnalysisResult;
      try {
        parsed = JSON.parse(content);
      } catch {
        throw new Error('Invalid JSON from model');
      }

      setResult(parsed);
    } catch (error) {
      console.error('Analysis failed:', error);
      setResult({
        score: 0,
        verdict: 'neutral',
        explanation: `Analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}.`,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-5xl">
      <h1 className="text-3xl font-bold mb-2">Professional Mode</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        In-depth fact-checking with sources and citations.
      </p>

      <div className="space-y-6">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g., The government spent $10 trillion on climate research last year..."
          className="w-full h-40 p-4 border rounded-lg resize-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-800 dark:border-gray-700"
          disabled={loading}
        />

        <button
          onClick={analyze}
          disabled={loading || !input.trim()}
          className="px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-2"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" className="opacity-25" />
                <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" className="opacity-75" />
              </svg>
              Analyzing with Grok...
            </>
          ) : (
            'Fact-Check Claim'
          )}
        </button>

        {result && (
          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg border shadow-sm">
            <div className="flex items-center gap-4 mb-4">
              <span className="text-2xl font-bold">
                {result.verdict === 'bullshit' ? 'Bullshit' : result.verdict === 'mostly true' ? 'Mostly True' : 'Neutral'}
              </span>
              <div className="flex-1 h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all ${
                    result.score > 0.7 ? 'bg-red-500' : result.score > 0.4 ? 'bg-yellow-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${result.score * 100}%` }}
                />
              </div>
              <span className="text-sm font-medium">{(result.score * 100).toFixed(0)}%</span>
            </div>

            <p className="text-gray-700 dark:text-gray-300 mb-4">{result.explanation}</p>

            {result.sources && result.sources.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Sources:</h3>
                <ul className="space-y-2">
                  {result.sources.map((src, i) => (
                    <li key={i}>
                      <a
                        href={src.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-600 hover:underline text-sm"
                      >
                        {src.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mt-8 text-sm text-gray-500 dark:text-gray-400">
        Using model: <strong>{model === 'grok-3' ? 'Grok 3' : 'Grok 4'}</strong>
        {apiKey ? ' | API Key Connected' : ' | Add API Key in Settings'}
      </div>
    </div>
  );
}