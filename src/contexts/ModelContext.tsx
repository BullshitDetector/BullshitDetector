// src/contexts/ModelContext.tsx
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Model = 'grok-3' | 'grok-4';

interface ModelContextType {
  model: Model;
  setModel: (model: Model) => void;
  apiKey: string;
  setApiKey: (key: string) => void;
  isValidKey: boolean | null;
  testApiKey: () => Promise<void>;
}

const ModelContext = createContext<ModelContextType | undefined>(undefined);

export function ModelProvider({ children }: { children: ReactNode }) {
  // Load API key from localStorage on mount
  const [apiKey, setApiKeyState] = useState(() => {
    return localStorage.getItem('xai-api-key') || '';
  });

  const [model, setModel] = useState<Model>('grok-3');
  const [isValidKey, setIsValidKey] = useState<boolean | null>(null);

  // Save API key to localStorage whenever it changes
  const setApiKey = (key: string) => {
    const trimmed = key.trim();
    setApiKeyState(trimmed);
    if (trimmed) {
      localStorage.setItem('xai-api-key', trimmed);
    } else {
      localStorage.removeItem('xai-api-key');
    }
    setIsValidKey(null); // Reset validation
  };

  const testApiKey = async () => {
    if (!apiKey) {
      setIsValidKey(false);
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
          messages: [{ role: 'user', content: 'Hello' }],
          max_tokens: 5,
        }),
      });

      if (response.ok) {
        setIsValidKey(true);
      } else {
        setIsValidKey(false);
      }
    } catch (error) {
      console.error('API Key test failed:', error);
      setIsValidKey(false);
    }
  };

  return (
    <ModelContext.Provider value={{ model, setModel, apiKey, setApiKey, isValidKey, testApiKey }}>
      {children}
    </ModelContext.Provider>
  );
}

export const useModel = (): ModelContextType => {
  const context = useContext(ModelContext);
  if (!context) throw new Error('useModel must be used within ModelProvider');
  return context;
};