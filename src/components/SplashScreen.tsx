'use client';

import { useEffect, useState } from 'react';
import { GraduationCap } from 'lucide-react';

export function SplashScreen() {
  const [mounted, setMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    setMounted(true);
    const timer = setTimeout(() => setIsVisible(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // Prevent hydration mismatch by returning null until mounted
  if (!mounted || !isVisible) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-background flex items-center justify-center animate-out fade-out duration-300">
      <div className="flex flex-col items-center animate-in zoom-in-95 duration-500">
        <div className="relative">
          <div className="absolute inset-0 bg-primary blur-2xl opacity-10 animate-pulse"></div>
          <GraduationCap className="w-16 h-16 text-primary relative z-10" strokeWidth={1.5} />
        </div>
      </div>
    </div>
  );
}
