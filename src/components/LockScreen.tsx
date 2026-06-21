
"use client";

import { useState, useEffect } from 'react';
import { Lock, Delete, Fingerprint, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function LockScreen({ children }: { children: React.ReactNode }) {
  const [isLocked, setIsLocked] = useState(true);
  const [pin, setPin] = useState('');
  const [storedPin, setStoredPin] = useState<string | null>(null);
  const [error, setError] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedPin = localStorage.getItem('gpafy_pin');
    if (!savedPin) {
      setIsLocked(false);
    } else {
      setStoredPin(savedPin);
    }
  }, []);

  useEffect(() => {
    if (pin.length === 4) {
      if (pin === storedPin) {
        setIsLocked(false);
        setError(false);
      } else {
        setError(true);
        setTimeout(() => {
          setPin('');
          setError(false);
        }, 500);
      }
    }
  }, [pin, storedPin]);

  if (!mounted) return null;
  if (!isLocked) return <>{children}</>;

  const handleKeyPress = (num: string) => {
    if (pin.length < 4) {
      setPin(prev => prev + num);
    }
  };

  const handleBackspace = () => {
    setPin(prev => prev.slice(0, -1));
  };

  return (
    <div className="fixed inset-0 z-[200] bg-background flex flex-col items-center justify-center p-8 animate-in fade-in duration-500">
      <div className="w-full max-w-xs space-y-12 text-center">
        <div className="space-y-4">
          <div className="mx-auto w-16 h-16 bg-primary/5 rounded-2xl flex items-center justify-center text-primary border border-primary/10">
            <GraduationCap className="w-10 h-10" />
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-black tracking-tight">Enter PIN</h1>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest opacity-60">Secure Access</p>
          </div>
        </div>

        <div className="flex justify-center gap-4">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={cn(
                "w-4 h-4 rounded-full border-2 transition-all duration-200",
                pin.length > i ? "bg-primary border-primary scale-110" : "border-muted-foreground/20",
                error && "border-destructive bg-destructive animate-bounce"
              )}
            />
          ))}
        </div>

        <div className="grid grid-cols-3 gap-6 w-full px-4">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
            <button
              key={num}
              onClick={() => handleKeyPress(num)}
              className="w-16 h-16 rounded-full bg-white dark:bg-card border border-border/50 text-2xl font-black active-scale shadow-sm flex items-center justify-center"
            >
              {num}
            </button>
          ))}
          <div className="w-16 h-16" />
          <button
            onClick={() => handleKeyPress('0')}
            className="w-16 h-16 rounded-full bg-white dark:bg-card border border-border/50 text-2xl font-black active-scale shadow-sm flex items-center justify-center"
          >
            0
          </button>
          <button
            onClick={handleBackspace}
            className="w-16 h-16 rounded-full text-muted-foreground active-scale flex items-center justify-center"
          >
            <Delete className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
}
