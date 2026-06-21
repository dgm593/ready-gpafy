"use client";

import { useState, useEffect, useMemo } from 'react';
import { 
  Target, 
  Sparkles, 
  LineChart, 
  GraduationCap,
  Trophy,
  ChevronLeft,
  CalendarDays,
  Award,
  AlertCircle,
  CheckCircle2,
  TrendingDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { 
  formatGPA, 
  SavedSemester, 
  calculateCGPA, 
  calculateRequiredGpa,
  getRiskLevel,
  getStrategyText,
  RiskLevel
} from '@/app/lib/grade-utils';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';

export default function GoalTrackerPage() {
  const [history, setHistory] = useState<SavedSemester[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  
  const [targetNextCgpa, setTargetNextCgpa] = useState('');
  const [upcomingCredits, setUpcomingCredits] = useState('');
  
  const [targetGradCgpa, setTargetGradCgpa] = useState('');
  const [totalGradCredits, setTotalGradCredits] = useState('');

  const [testGpa, setTestGpa] = useState([3.50]);

  useEffect(() => {
    setIsMounted(true);
    const saved = localStorage.getItem('ju_semesters');
    if (saved) setHistory(JSON.parse(saved));
    
    const degCredits = localStorage.getItem('ju_total_degree_credits');
    if (degCredits) setTotalGradCredits(degCredits);
  }, []);

  const currentStandings = useMemo(() => {
    const cgpa = calculateCGPA(history);
    const credits = history.reduce((acc, s) => acc + s.totalCredits, 0);
    return { cgpa, credits };
  }, [history]);

  const nextSemResult = useMemo(() => {
    if (!targetNextCgpa || !upcomingCredits) return null;
    const target = parseFloat(targetNextCgpa) || 0;
    const upcoming = parseInt(upcomingCredits) || 0;
    const reqGpa = calculateRequiredGpa(currentStandings.cgpa, currentStandings.credits, target, upcoming);
    const risk = getRiskLevel(reqGpa);
    return { reqGpa, risk, strategy: getStrategyText(risk), target, upcoming };
  }, [currentStandings, targetNextCgpa, upcomingCredits]);

  const gradResult = useMemo(() => {
    if (!targetGradCgpa || !totalGradCredits) return null;
    const target = parseFloat(targetGradCgpa) || 0;
    const total = parseInt(totalGradCredits) || 0;
    const remaining = total - currentStandings.credits;
    const reqGpa = calculateRequiredGpa(currentStandings.cgpa, currentStandings.credits, target, Math.max(0, remaining));
    const risk = getRiskLevel(reqGpa);
    return { reqGpa, risk, strategy: getStrategyText(risk), target, total, remaining };
  }, [currentStandings, targetGradCgpa, totalGradCredits]);

  const calculateOutcomeCgpa = (testGpaValue: number, additionalCredits: number) => {
    const totalPoints = (currentStandings.cgpa * currentStandings.credits) + (testGpaValue * additionalCredits);
    const totalCredits = currentStandings.credits + additionalCredits;
    return totalCredits === 0 ? 0 : totalPoints / totalCredits;
  };

  const getStatusUI = (reqGpa: number, risk: RiskLevel) => {
    if (risk === 'Achieved') {
      return {
        cardClass: 'bg-emerald-500 text-white shadow-emerald-200',
        icon: <Trophy className="w-12 h-12" />,
        status: 'Target Already Achieved',
        message: 'Your current CGPA is already above your target. Keep it up!',
        gpaDisplay: '0.00'
      };
    }
    if (risk === 'Impossible') {
      return {
        cardClass: 'bg-destructive text-destructive-foreground shadow-destructive/20',
        icon: <AlertCircle className="w-12 h-12" />,
        status: 'Impossible',
        message: 'The target cannot be reached with the remaining credits. Try a lower target.',
        gpaDisplay: 'N/A'
      };
    }
    
    let colorClass = 'bg-primary text-white shadow-primary/20';
    if (risk === 'High Pressure') colorClass = 'bg-orange-500 text-white shadow-orange-200';
    
    return {
      cardClass: colorClass,
      icon: <Sparkles className="w-12 h-12" />,
      status: risk,
      message: getStrategyText(risk),
      gpaDisplay: formatGPA(reqGpa)
    };
  };

  if (!isMounted) return null;

  return (
    <div className="py-6 space-y-8 max-w-md mx-auto pb-32 px-1">
      <header className="flex items-center gap-4 px-2">
        <Link href="/">
          <Button variant="ghost" size="icon" className="rounded-full active-scale bg-white dark:bg-card shadow-sm border border-border/50">
            <ChevronLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-black tracking-tight">Academic Advisor</h1>
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-60">Strategic Planning & Goals</p>
        </div>
      </header>

      <section className="px-1">
        <Card className="border-none shadow-xl bg-white dark:bg-card rounded-[2.5rem] overflow-hidden">
          <CardContent className="p-8 space-y-6">
            <div className="flex justify-between items-center">
              <div className="space-y-0.5">
                <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest leading-none">Current Standing</p>
                <div className="text-5xl font-black text-foreground">{formatGPA(currentStandings.cgpa)}</div>
                <p className="text-[8px] font-bold text-primary uppercase">{currentStandings.credits} Credits Earned</p>
              </div>
              <div className="text-right space-y-0.5">
                <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest leading-none">Goal</p>
                <div className="text-3xl font-black text-secondary">{targetNextCgpa || '—'}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <Tabs defaultValue="next" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-muted/30 p-1 h-14 rounded-2xl mb-8">
          <TabsTrigger value="next" className="rounded-xl font-black text-xs uppercase tracking-widest data-[state=active]:bg-white dark:data-[state=active]:bg-card data-[state=active]:text-primary data-[state=active]:shadow-sm">
            Next Term
          </TabsTrigger>
          <TabsTrigger value="grad" className="rounded-xl font-black text-xs uppercase tracking-widest data-[state=active]:bg-white dark:data-[state=active]:bg-card data-[state=active]:text-primary data-[state=active]:shadow-sm">
            Graduation
          </TabsTrigger>
        </TabsList>

        <TabsContent value="next" className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Card className="border-border/40 shadow-md rounded-[2.5rem] bg-white dark:bg-card overflow-hidden">
            <CardHeader className="p-8 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center">
                  <CalendarDays className="w-5 h-5 text-primary" />
                </div>
                <CardTitle className="text-lg font-black uppercase tracking-tight">Semester Goal</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-8 pt-4 space-y-8">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-muted-foreground pl-1">Target CGPA</Label>
                  <Input 
                    type="number" 
                    step="0.01" 
                    placeholder="e.g. 3.50"
                    value={targetNextCgpa} 
                    onChange={e => setTargetNextCgpa(e.target.value)} 
                    className="font-black h-14 text-xl rounded-2xl bg-muted/20 border-border/50 text-center" 
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-muted-foreground pl-1">Next Credits</Label>
                  <Input 
                    type="number" 
                    min="1"
                    placeholder="e.g. 18"
                    value={upcomingCredits} 
                    onChange={e => {
                      const val = e.target.value;
                      if (val === '' || parseInt(val) >= 0) {
                        setUpcomingCredits(val);
                      }
                    }} 
                    className="font-black h-14 text-xl rounded-2xl bg-muted/20 border-border/50 text-center" 
                  />
                </div>
              </div>

              {nextSemResult ? (
                (() => {
                  const ui = getStatusUI(nextSemResult.reqGpa, nextSemResult.risk);
                  return (
                    <Card className={`border-none shadow-2xl p-8 rounded-[2rem] text-center space-y-4 transition-all duration-500 ${ui.cardClass}`}>
                      <div className="flex flex-col items-center space-y-2">
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-70 leading-none">Required GPA</p>
                        <h2 className="text-7xl font-black tracking-tighter leading-none">{ui.gpaDisplay}</h2>
                      </div>
                      <div className="pt-4 border-t border-white/20">
                        <div className="flex items-center justify-center gap-2 mb-2">
                          {nextSemResult.risk === 'Achieved' ? <CheckCircle2 className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                          <p className="font-black uppercase text-xs tracking-tight">{ui.status}</p>
                        </div>
                        <p className="text-xs font-bold opacity-90 italic">"{ui.message}"</p>
                      </div>
                    </Card>
                  );
                })()
              ) : (
                <div className="p-12 text-center text-muted-foreground/30 border-2 border-dashed border-border/50 rounded-[2rem]">
                  <Target className="w-12 h-12 mx-auto mb-4 opacity-20" />
                  <p className="text-xs font-black uppercase tracking-widest">Enter goals to see analysis</p>
                </div>
              )}
            </CardContent>
          </Card>

          <WhatIfCard 
            label="Hypothetical Semester Performance"
            additionalCredits={parseInt(upcomingCredits) || 0} 
            testGpa={testGpa} 
            setTestGpa={setTestGpa} 
            outcomeCgpa={calculateOutcomeCgpa(testGpa[0], parseInt(upcomingCredits) || 0)}
          />
        </TabsContent>

        <TabsContent value="grad" className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Card className="border-border/40 shadow-md rounded-[2.5rem] bg-white dark:bg-card overflow-hidden">
            <CardHeader className="p-8 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-primary" />
                </div>
                <CardTitle className="text-lg font-black uppercase tracking-tight">Degree Target</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-8 pt-4 space-y-8">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-muted-foreground pl-1">Final CGPA Goal</Label>
                  <Input 
                    type="number" 
                    step="0.01" 
                    placeholder="e.g. 3.75"
                    value={targetGradCgpa} 
                    onChange={e => setTargetGradCgpa(e.target.value)} 
                    className="font-black h-14 text-xl rounded-2xl bg-muted/20 border-border/50 text-center" 
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-muted-foreground pl-1">Degree Total Credits</Label>
                  <Input 
                    type="number" 
                    min="1"
                    placeholder="e.g. 144"
                    value={totalGradCredits} 
                    onChange={e => {
                      const val = e.target.value;
                      if (val === '' || parseInt(val) >= 0) {
                        setTotalGradCredits(val);
                        localStorage.setItem('ju_total_degree_credits', val);
                      }
                    }} 
                    className="font-black h-14 text-xl rounded-2xl bg-muted/20 border-border/50 text-center" 
                  />
                </div>
              </div>

              {gradResult ? (
                (() => {
                  const ui = getStatusUI(gradResult.reqGpa, gradResult.risk);
                  return (
                    <Card className={`border-none shadow-2xl p-8 rounded-[2rem] text-center space-y-4 transition-all duration-500 ${ui.cardClass}`}>
                      <div className="flex flex-col items-center space-y-2">
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-70 leading-none">Required Future Avg</p>
                        <h2 className="text-7xl font-black tracking-tighter leading-none">{ui.gpaDisplay}</h2>
                      </div>
                      <div className="pt-4 border-t border-white/20">
                        <p className="font-black uppercase text-xs tracking-tight mb-2">{ui.status}</p>
                        <p className="text-xs font-bold opacity-90 italic">"{ui.message}"</p>
                      </div>
                      {gradResult.remaining > 0 && (
                        <p className="text-[8px] font-black uppercase tracking-widest opacity-60">Over {gradResult.remaining} remaining credits</p>
                      )}
                    </Card>
                  );
                })()
              ) : (
                <div className="p-12 text-center text-muted-foreground/30 border-2 border-dashed border-border/50 rounded-[2rem]">
                  <GraduationCap className="w-12 h-12 mx-auto mb-4 opacity-20" />
                  <p className="text-xs font-black uppercase tracking-widest">Define degree goals for analysis</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function WhatIfCard({ 
  label,
  additionalCredits, 
  testGpa, 
  setTestGpa, 
  outcomeCgpa 
}: any) {
  return (
    <Card className="shadow-2xl border-none rounded-[2.5rem] overflow-hidden bg-white dark:bg-card animate-in zoom-in-95 duration-700">
      <CardHeader className="p-8 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center">
            <LineChart className="w-5 h-5 text-primary" />
          </div>
          <CardTitle className="text-lg font-black uppercase tracking-tight">Scenario Simulator</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-8 space-y-10">
        <div className="space-y-6">
          <div className="flex justify-between items-end">
            <div className="space-y-1">
              <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest leading-none">{label}</Label>
              <p className="text-[8px] font-bold text-primary/60 uppercase">FOR {additionalCredits} CREDITS</p>
            </div>
            <span className="text-4xl font-black text-primary tabular-nums">{formatGPA(testGpa[0])}</span>
          </div>
          <Slider 
            value={testGpa} 
            onValueChange={setTestGpa} 
            max={4} 
            step={0.01} 
            className="py-4 cursor-pointer"
          />
        </div>

        <div className="bg-primary p-8 rounded-[2.5rem] text-primary-foreground space-y-6 shadow-2xl shadow-primary/20 relative overflow-hidden group active-scale transition-all">
          <div className="relative z-10">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-secondary animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest opacity-80">Predicted Outcome</span>
            </div>
            <div className="flex justify-between items-end mt-6">
              <div className="space-y-1">
                <div className="text-[5.5rem] font-black tracking-tighter tabular-nums leading-none">
                  {formatGPA(outcomeCgpa)}
                </div>
                <p className="text-[10px] font-black opacity-60 uppercase tracking-widest">New Cumulative GPA</p>
              </div>
            </div>
          </div>
          <Trophy className="absolute -bottom-6 -right-6 w-32 h-32 opacity-10 rotate-12" />
        </div>
      </CardContent>
    </Card>
  );
}