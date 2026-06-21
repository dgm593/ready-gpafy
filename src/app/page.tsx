"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Calculator, 
  Target, 
  Globe,
  User,
  BarChart3
} from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { SavedSemester, calculateCGPA, formatGPA } from '@/app/lib/grade-utils';

export default function Dashboard() {
  const router = useRouter();
  const [stats, setStats] = useState({ cgpa: 0, credits: 0, semesters: 0 });
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('ju_semesters');
    if (!saved) {
      router.push('/onboarding');
      return;
    }
    
    try {
      const semesters: SavedSemester[] = JSON.parse(saved);
      if (semesters.length === 0) {
        router.push('/onboarding');
        return;
      }
      setStats({
        cgpa: calculateCGPA(semesters),
        credits: semesters.reduce((acc, s) => acc + s.totalCredits, 0),
        semesters: semesters.length
      });
      setIsLoaded(true);
    } catch (e) {
      localStorage.removeItem('ju_semesters');
      router.push('/onboarding');
    }
  }, [router]);

  if (!isLoaded) return null;

  const features = [
    { 
      title: 'Calculator', 
      desc: 'Quick GPA', 
      icon: Calculator, 
      href: '/calculator',
      color: 'text-primary'
    },
    { 
      title: 'Goal Planner', 
      desc: 'Simulations', 
      icon: Target, 
      href: '/planner',
      color: 'text-secondary'
    },
    { 
      title: 'Portal', 
      desc: 'University', 
      icon: Globe, 
      href: '/portal',
      color: 'text-slate-600'
    },
  ];

  return (
    <div className="py-8 space-y-10 animate-in fade-in duration-700 max-w-md mx-auto">
      <header className="flex items-center justify-between px-2">
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tight text-foreground">GPAfy</h1>
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest opacity-60">Academic Intelligence</p>
          </div>
        </div>
        <Link href="/settings">
          <div className="w-12 h-12 rounded-2xl bg-white dark:bg-card border border-border shadow-sm flex items-center justify-center text-primary active-scale cursor-pointer hover:bg-primary/5 transition-colors">
            <User className="w-6 h-6" strokeWidth={1.5} />
          </div>
        </Link>
      </header>

      <section className="px-1">
        <Card className="border-none shadow-[0_20px_50px_rgba(184,134,11,0.05)] bg-white dark:bg-card rounded-[2.5rem] overflow-hidden">
          <CardContent className="p-10 space-y-8 text-center relative">
            <div className="absolute top-6 right-6 opacity-5">
              <BarChart3 className="w-24 h-24 text-primary" />
            </div>
            
            <div className="space-y-1 relative z-10">
              <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Cumulative Standing</p>
              <div className="text-[5.5rem] font-black tracking-tighter text-foreground leading-none">
                {formatGPA(stats.cgpa)}
              </div>
            </div>

            <div className="flex justify-center gap-10 border-t border-border/50 pt-8 relative z-10">
              <div className="text-center space-y-1">
                <div className="text-2xl font-black text-primary">{stats.credits}</div>
                <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">Credits</p>
              </div>
              <div className="text-center space-y-1">
                <div className="text-2xl font-black text-primary">{stats.semesters}</div>
                <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">Semesters</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-4 px-1 pb-10">
        <div className="flex justify-between items-center px-2">
          <h2 className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Academic Tools</h2>
          <div className="h-px flex-1 bg-border/40 mx-4" />
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          {features.map((f) => (
            <Link key={f.title} href={f.href} className="block group active-scale">
              <Card className="border-border/50 shadow-sm bg-white dark:bg-card hover:border-primary/20 transition-all rounded-[1.5rem] overflow-hidden aspect-[4/3] flex items-center justify-center">
                <CardContent className="p-4 flex flex-col items-center text-center space-y-2">
                  <div className={`w-10 h-10 rounded-xl bg-slate-50 dark:bg-white/5 flex items-center justify-center transition-transform group-hover:scale-110`}>
                    <f.icon className={`w-5 h-5 ${f.color}`} strokeWidth={2} />
                  </div>
                  <div className="space-y-0">
                    <h3 className="font-black text-[10px] text-foreground uppercase tracking-tight">{f.title}</h3>
                    <p className="text-[8px] text-muted-foreground/80 font-bold uppercase tracking-tighter leading-none">{f.desc}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
