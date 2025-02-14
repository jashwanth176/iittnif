'use client';

import { useEffect, useState } from 'react';

export default function LoadingSpinner() {
  const [, setDots] = useState<string>('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        <p className="mt-4 text-primary text-lg font-medium text-center min-w-[80px]">
          {/* Loading{dots} */}
        </p>
      </div>
    </div>
  );
} 