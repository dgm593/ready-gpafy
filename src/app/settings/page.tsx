"use client";

import { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  ShieldCheck, 
  Moon, 
  Sun, 
  User,
  ChevronRight,
  Info,
  LogOut,
  GraduationCap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

export default function SettingsPage() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [degreeCredits, setDegreeCredits] = useState('');

  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    setTheme(isDark ? 'dark' : 'light');
    
    const saved = localStorage.getItem('ju_total_degree_credits');
    if (saved) setDegreeCredits(saved);
  }, []);

  const toggleTheme = (value: 'light' | 'dark') => {
    setTheme(value);
    if (value === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const updateDegreeCredits = (val: string) => {
    if (val === '' || parseInt(val) >= 0) {
      setDegreeCredits(val);
      localStorage.setItem('ju_total_degree_credits', val);
    }
  };

  return (
    <div className="py-6 space-y-6 max-w-md mx-auto pb-24">
      <header className="flex items-center gap-4 px-2">
        <Link href="/">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ChevronLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-xl font-bold font-headline text-primary">Profile & Settings</h1>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight">App Preferences</p>
        </div>
      </header>

      <section className="px-2 space-y-6">
        <Card className="border-none shadow-sm bg-white dark:bg-card rounded-[2rem] overflow-hidden">
          <CardHeader className="p-6 bg-primary/5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white dark:bg-primary/10 flex items-center justify-center text-primary shadow-sm">
                <User className="w-6 h-6" />
              </div>
              <div>
                <CardTitle className="text-lg font-black">Academic Profile</CardTitle>
                <CardDescription className="text-xs font-medium">Local Data Profile</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="space-y-4">
              <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest flex items-center gap-2">
                <GraduationCap className="w-3 h-3" /> Degree Requirements
              </Label>
              <div className="space-y-2">
                <p className="text-[8px] font-bold text-muted-foreground uppercase">Total Required Credits</p>
                <Input 
                  type="number" 
                  min="1"
                  placeholder="e.g. 144"
                  value={degreeCredits} 
                  onChange={(e) => updateDegreeCredits(e.target.value)}
                  className="h-12 rounded-xl font-black text-lg bg-muted/20 border-none"
                />
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-border/50">
              <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Appearance</Label>
              <RadioGroup value={theme} onValueChange={(val) => toggleTheme(val as 'light' | 'dark')} className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <RadioGroupItem value="light" id="light" className="peer sr-only" />
                  <Label
                    htmlFor="light"
                    className="flex flex-col items-center justify-between rounded-2xl border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer transition-all"
                  >
                    <Sun className="mb-2 h-6 w-6" />
                    <span className="text-xs font-bold uppercase tracking-widest">Light</span>
                  </Label>
                </div>
                <div className="relative">
                  <RadioGroupItem value="dark" id="dark" className="peer sr-only" />
                  <Label
                    htmlFor="dark"
                    className="flex flex-col items-center justify-between rounded-2xl border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer transition-all"
                  >
                    <Moon className="mb-2 h-6 w-6" />
                    <span className="text-xs font-bold uppercase tracking-widest">Dark</span>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="pt-4 space-y-2 border-t border-border/50">
              <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">App Security</Label>
              <Link href="/settings/security">
                <div className="flex items-center justify-between p-4 bg-primary/5 rounded-2xl border border-primary/10 active-scale cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="w-5 h-5 text-primary" />
                    <span className="text-sm font-bold">Privacy Lock (PIN)</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-primary/30 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-white dark:bg-card rounded-[2rem] overflow-hidden">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-3 p-2">
              <Info className="w-5 h-5 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-sm font-bold">About GPAfy</p>
                <p className="text-[10px] text-muted-foreground">Version 1.2.0 (Academic Advisor Edition)</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="px-2">
          <Link href="/onboarding">
            <Button variant="outline" className="w-full h-12 rounded-xl text-destructive border-destructive/20 hover:bg-destructive/5 font-bold">
              <LogOut className="w-4 h-4 mr-2" /> Reset Application
            </Button>
          </Link>
          <div className="mt-8 space-y-1 text-center">
            <p className="text-[8px] text-muted-foreground uppercase tracking-[0.2em] font-black opacity-60">
              Optimized for University Students
            </p>
            <p className="text-[10px] text-primary font-black uppercase tracking-[0.15em]">
              Architected by Dagim F
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
