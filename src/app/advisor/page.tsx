"use client";

import { useState, useEffect } from 'react';
import { 
  BrainCircuit, 
  ChevronLeft, 
  Target, 
  TrendingUp, 
  RefreshCw,
  AlertCircle,
  Bot,
  Sparkles,
  Lightbulb
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { 
  predictiveGpaAdvisor, 
  PredictiveGpaAdvisorOutput 
} from '@/ai/flows/predictive-gpa-advisor-flow';
import { SavedSemester, calculateCGPA } from '@/app/lib/grade-utils';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

export default function AdvisorPage() {
  const { toast } = useToast();
  const [currentCgpa, setCurrentCgpa] = useState<number>(0);
  const [totalCredits, setTotalCredits] = useState<number>(0);
  const [targetCgpa, setTargetCgpa] = useState<string>('');
  const [nextCredits, setNextCredits] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<PredictiveGpaAdvisorOutput | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('ju_semesters');
    if (saved) {
      const parsed = JSON.parse(saved);
      setCurrentCgpa(calculateCGPA(parsed));
      setTotalCredits(parsed.reduce((acc: number, curr: SavedSemester) => acc + curr.totalCredits, 0));
    }
  }, []);

  const handlePredict = async () => {
    if (!targetCgpa || !nextCredits) {
      toast({
        variant: "destructive",
        title: "Input Required",
        description: "Please enter both your target GPA and expected credits."
      });
      return;
    }

    if (isLoading) return;
    setIsLoading(true);
    setResult(null);
    try {
      const response = await predictiveGpaAdvisor({
        currentCgpa,
        currentTotalCreditHours: totalCredits,
        targetCgpa: parseFloat(targetCgpa),
        nextSemesterCreditHours: parseInt(nextCredits),
      });
      setResult(response);
    } catch (error) {
      console.error(error);
      setResult({ type: 'error', message: 'A network error occurred. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="py-6 space-y-6 pb-24 max-w-md mx-auto">
      <header className="flex items-center gap-4 px-2">
        <Link href="/">
          <Button variant="ghost" size="icon" className="rounded-full active-scale bg-white dark:bg-card shadow-sm border border-border/50">
            <ChevronLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-black tracking-tight text-primary">AI Advisor</h1>
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-60">Intelligent Academic Insight</p>
        </div>
      </header>

      <section className="px-1 space-y-4">
        <Card className="border-none bg-primary/5 shadow-none rounded-[2rem]">
          <CardHeader className="p-6 pb-2">
            <CardTitle className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2 opacity-60 text-primary">
              <Bot className="w-4 h-4" /> Current Academic Standing
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-0 grid grid-cols-2 gap-4">
            <div className="bg-white dark:bg-card p-4 rounded-2xl shadow-sm border border-primary/10">
              <Label className="text-[8px] text-muted-foreground uppercase font-black tracking-widest">Cumulative GPA</Label>
              <div className="text-2xl font-black text-foreground mt-1">{currentCgpa.toFixed(2)}</div>
            </div>
            <div className="bg-white dark:bg-card p-4 rounded-2xl shadow-sm border border-primary/10">
              <Label className="text-[8px] text-muted-foreground uppercase font-black tracking-widest">Earned Credits</Label>
              <div className="text-2xl font-black text-foreground mt-1">{totalCredits}</div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-2xl border-none bg-white dark:bg-card rounded-[2.5rem] overflow-hidden">
          <CardHeader className="p-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <BrainCircuit className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-lg font-black uppercase tracking-tight">AI Strategy</CardTitle>
                <CardDescription className="text-xs font-medium">Define your goals for smart analysis.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8 pt-0 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="target" className="text-[10px] font-black uppercase text-muted-foreground pl-1">Target Cumulative GPA</Label>
              <div className="relative">
                <Target className="absolute left-4 top-4 w-5 h-5 text-muted-foreground/30" />
                <Input 
                  id="target" 
                  type="number" 
                  step="0.01" 
                  min="0" 
                  max="4"
                  placeholder="e.g. 3.50"
                  value={targetCgpa} 
                  onChange={(e) => setTargetCgpa(e.target.value)}
                  className="pl-12 font-black text-2xl h-14 rounded-2xl bg-muted/20 border-border/50"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="credits" className="text-[10px] font-black uppercase text-muted-foreground pl-1">Credits in Next Term</Label>
              <div className="relative">
                <TrendingUp className="absolute left-4 top-4 w-5 h-5 text-muted-foreground/30" />
                <Input 
                  id="credits" 
                  type="number" 
                  placeholder="e.g. 18"
                  value={nextCredits} 
                  onChange={(e) => setNextCredits(e.target.value)}
                  className="pl-12 font-black text-2xl h-14 rounded-2xl bg-muted/20 border-border/50"
                />
              </div>
            </div>

            <Button 
              className="w-full h-16 rounded-2xl font-black text-lg bg-secondary text-secondary-foreground shadow-xl shadow-secondary/20 active-scale flex items-center justify-center gap-3"
              onClick={handlePredict}
              disabled={isLoading}
            >
              {isLoading ? (
                <RefreshCw className="w-6 h-6 animate-spin" />
              ) : (
                <>
                  <Sparkles className="w-6 h-6" />
                  Analyze with AI
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </section>

      {result && (
        <section className="px-1 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <Card className={`border-none ${result.type === 'error' ? 'bg-destructive/10 text-destructive' : 'bg-primary text-primary-foreground shadow-2xl rounded-[2.5rem] overflow-hidden'}`}>
            <CardContent className="p-10 text-center space-y-6 relative">
              {result.type === 'requiredGpaCalculation' && (
                <>
                  <div className="absolute top-6 left-6 opacity-20">
                    <Lightbulb className="w-12 h-12" />
                  </div>
                  <Badge className="bg-white/20 text-white font-black uppercase tracking-[0.2em] text-[8px] border-none px-4 py-1">Advisor Insights</Badge>
                  
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Required Term GPA</p>
                    <div className="text-7xl font-black font-headline tracking-tighter leading-none">
                      {result.requiredGpaForNextSemester > 4 ? "N/A" : result.requiredGpaForNextSemester.toFixed(2)}
                    </div>
                  </div>

                  <p className="text-sm font-bold leading-relaxed opacity-90 italic px-4">
                    "{result.message}"
                  </p>

                  {result.requiredGpaForNextSemester > 4 && (
                    <div className="flex items-center justify-center gap-2 p-4 bg-black/10 rounded-2xl text-[10px] font-black uppercase tracking-tight">
                      <AlertCircle className="w-4 h-4" />
                      Advice: Target too high for this term.
                    </div>
                  )}
                </>
              )}

              {result.type === 'cgpaPrediction' && (
                <>
                  <Badge className="bg-white/20 text-white font-black uppercase tracking-[0.2em] text-[8px] border-none px-4 py-1">Prediction</Badge>
                  <div className="text-7xl font-black font-headline tracking-tighter leading-none">
                    {result.predictedCgpa.toFixed(2)}
                  </div>
                  <p className="text-sm font-bold leading-relaxed opacity-90 italic px-4">
                    "{result.message}"
                  </p>
                </>
              )}

              {result.type === 'error' && (
                <div className="space-y-4 p-4">
                  <AlertCircle className="w-12 h-12 mx-auto" />
                  <p className="font-black text-lg">Advisor Unavailable</p>
                  <p className="text-xs font-medium">{result.message}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </section>
      )}

      {!result && !isLoading && (
        <div className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground/20 space-y-4 animate-in fade-in duration-1000">
          <Bot className="w-16 h-16 opacity-50" />
          <p className="text-[10px] font-black uppercase tracking-[0.3em]">Awaiting Analysis</p>
        </div>
      )}
    </div>
  );
}