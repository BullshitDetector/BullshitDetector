// src/pages/HomePage.tsx
import { useNavigate } from 'react-router-dom';

interface Props {
  onNavigate: (page: string) => void;
}

export function HomePage({ onNavigate }: Props) {
  const navigate = useNavigate();

  const go = (path: string) => {
    navigate(path);
    onNavigate(path.slice(1) || 'home'); // keep old API happy if needed
  };

  return (
    <div className="flex flex-col items-center justify-center h-full space-y-6">
      <h1 className="text-4xl font-bold">Bullshit Detector</h1>
      <p className="text-lg text-muted-foreground">
        Detect spin, jargon, and nonsense in real time.
      </p>

      <div className="flex gap-4">
        <button onClick={() => go('/analyzer')} className="btn btn-primary">
          Start Analyzing
        </button>
        <button onClick={() => go('/sentiment')} className="btn btn-outline">
          View Sentiment
        </button>
      </div>
    </div>
  );
}
