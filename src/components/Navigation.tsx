"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Calculator, Target, History, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { label: 'Home', icon: Home, href: '/' },
  { label: 'Grades', icon: Calculator, href: '/calculator' },
  { label: 'Goals', icon: Target, href: '/planner' },
  { label: 'History', icon: History, href: '/history' },
  { label: 'Portal', icon: Globe, href: '/portal' },
];

export function Navigation() {
  const pathname = usePathname();

  if (pathname === '/onboarding') return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 liquid-glass px-4 pb-[calc(env(safe-area-inset-bottom)+12px)] pt-4 z-50">
      <div className="max-w-md mx-auto flex justify-between items-center">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1.5 transition-all duration-300 relative group",
                isActive ? "text-primary scale-110" : "text-muted-foreground/60 hover:text-muted-foreground/90"
              )}
            >
              <item.icon 
                className={cn(
                  "w-5 h-5 transition-all duration-300", 
                  isActive ? "stroke-[2.5]" : "stroke-[2]"
                )} 
              />
              <span className={cn(
                "text-[8px] font-black uppercase tracking-tighter transition-all duration-300",
                isActive ? "opacity-100 translate-y-0" : "opacity-60 translate-y-0"
              )}>
                {item.label}
              </span>
              {isActive && (
                <div className="absolute -top-1 w-1 h-1 rounded-full bg-primary animate-in fade-in zoom-in duration-300 shadow-[0_0_10px_rgba(184,134,11,0.5)]" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
