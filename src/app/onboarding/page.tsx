"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  GraduationCap, 
  Globe, 
  ChevronRight, 
  ShieldCheck, 
  Loader2, 
  Save,
  ArrowRight,
  CheckCircle2,
  Info
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { SavedSemester, syncAcademicStats } from '@/app/lib/grade-utils';
import { Badge } from '@/components/ui/badge';

type OnboardingStep = 'CHOICE' | 'DEGREE_CONFIG' | 'PORTAL_LOGIN' | 'MANUAL_COUNT' | 'MANUAL_ENTRIES';

export default function OnboardingPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [step, setStep] = useState<OnboardingStep>('CHOICE');
  const [isLoading, setIsLoading] = useState(false);
  
  const [degreeCredits, setDegreeCredits] = useState('');
  const [portalCreds, setPortalCreds] = useState({ id: '', password: '' });
  const [manualCount, setManualCount] = useState<number>(1);
  const [manualSemesters, setManualSemesters] = useState<{ gpa: string; credits: string }[]>([
    { gpa: '', credits: '' }
  ]);

  useEffect(() => {
    const saved = localStorage.getItem('ju_semesters');
    if (saved && JSON.parse(saved).length > 0) {
      router.push('/');
    }
  }, [router]);

  const handlePortalImport = async () => {
    if (!portalCreds.id || !portalCreds.password) {
      toast({ variant: "destructive", title: "Missing Credentials", description: "Please enter your portal ID and password." });
      return;
    }
    
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    setIsLoading(false);
    toast({ 
      variant: "destructive", 
      title: "Import Unavailable", 
      description: "Automatic import unavailable. Please enter your profile manually." 
    });
    setStep('MANUAL_COUNT');
  };

  const startManualEntry = () => {
    const count = Math.max(1, manualCount);
    const existing = manualSemesters.slice(0, count);
    const needed = count - existing.length;
    const additional = Array.from({ length: Math.max(0, needed) }, () => ({ gpa: '', credits: '' }));
    
    setManualSemesters([...existing, ...additional]);
    setStep('MANUAL_ENTRIES');
  };

  const saveManualData = () => {
    if (!degreeCredits) {
      toast({ variant: "destructive", title: "Missing Data", description: "Please enter your required degree credits." });
      return;
    }

    const isValid = manualSemesters.every(s => 
      s.gpa && s.credits && 
      parseFloat(s.gpa) >= 0 && parseFloat(s.gpa) <= 4 &&
      parseInt(s.credits) > 0
    );

    if (!isValid) {
      toast({ 
        variant: "destructive", 
        title: "Invalid Input", 
        description: "Please ensure all GPAs (0-4) and credits are filled correctly." 
      });
      return;
    }

    const formatted: SavedSemester[] = manualSemesters.map((s, i) => ({
      id: Math.random().toString(36).substr(2, 9),
      semesterNumber: i + 1,
      gpa: parseFloat(s.gpa),
      totalCredits: parseInt(s.credits),
      courses: [],
      date: new Date().toISOString(),
    }));

    localStorage.setItem('ju_total_degree_credits', degreeCredits);
    localStorage.setItem('ju_semesters', JSON.stringify(formatted));
    syncAcademicStats();
    
    toast({ title: "Profile Ready!", description: "Academic history saved successfully." });
    router.push('/');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md space-y-6">
        <header className="text-center space-y-2 mb-4">
          <div className="mx-auto w-16 h-16 bg-white border-2 border-primary/20 rounded-full flex items-center justify-center shadow-sm">
            <GraduationCap className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-3xl font-black text-primary tracking-tighter">GPAfy Setup</h1>
          <p className="text-muted-foreground text-sm font-medium">Initialize your academic standing.</p>
        </header>

        {step === 'CHOICE' && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Card 
              className="group cursor-pointer hover:border-primary transition-all active:scale-[0.98] border rounded-2xl"
              onClick={() => setStep('DEGREE_CONFIG')}
            >
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-4 bg-primary/5 rounded-2xl text-primary group-hover:bg-primary/10 transition-colors">
                  <Info className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg">Start Setup</h3>
                  <p className="text-xs text-muted-foreground font-medium">Configure degree and history.</p>
                </div>
                <ChevronRight className="text-muted-foreground/30 group-hover:translate-x-1 transition-transform" />
              </CardContent>
            </Card>
          </div>
        )}

        {step === 'DEGREE_CONFIG' && (
          <Card className="animate-in zoom-in-95 duration-300 rounded-2xl border-none shadow-sm">
            <CardHeader>
              <CardTitle className="font-bold text-lg text-primary">Degree Requirement</CardTitle>
              <CardDescription className="text-xs font-medium">How many total credit hours are required for your degree?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="deg_credits" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Total Degree Credits</Label>
                <Input 
                  id="deg_credits" 
                  type="number"
                  min="1"
                  placeholder="e.g. 144" 
                  value={degreeCredits}
                  className="h-14 rounded-xl font-black text-2xl text-center"
                  onChange={e => {
                    const val = e.target.value;
                    if (val === '' || parseInt(val) >= 0) {
                      setDegreeCredits(val);
                    }
                  }}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Card className="bg-muted/30 border-none p-4 text-center">
                  <p className="text-[8px] font-bold text-muted-foreground uppercase mb-1">Eng/Science</p>
                  <p className="text-sm font-black">140-160</p>
                </Card>
                <Card className="bg-muted/30 border-none p-4 text-center">
                  <p className="text-[8px] font-bold text-muted-foreground uppercase mb-1">Medicine</p>
                  <p className="text-sm font-black">200+</p>
                </Card>
              </div>
              <Button 
                className="w-full h-12 rounded-xl font-bold bg-secondary text-secondary-foreground" 
                onClick={() => degreeCredits ? setStep('PORTAL_LOGIN') : toast({variant: "destructive", title: "Entry Required", description: "Please enter your required degree credits."})}
              >
                Continue <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        )}

        {step === 'PORTAL_LOGIN' && (
          <Card className="animate-in zoom-in-95 duration-300 rounded-2xl border-none shadow-sm">
            <CardHeader>
              <CardTitle className="font-bold flex items-center gap-2 text-lg">
                <Globe className="w-5 h-5 text-primary" /> JU Portal (Beta)
              </CardTitle>
              <CardDescription className="text-xs font-medium">Sync your official academic records.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-2 text-[8px] font-black uppercase mb-2">
                <div className="flex items-center gap-1 text-primary/60"><CheckCircle2 className="w-3 h-3" /> Semester GPA</div>
                <div className="flex items-center gap-1 text-primary/60"><CheckCircle2 className="w-3 h-3" /> Credit Hours</div>
                <div className="flex items-center gap-1 text-primary/60"><CheckCircle2 className="w-3 h-3" /> Current CGPA</div>
                <div className="flex items-center gap-1 text-amber-600"><Info className="w-3 h-3" /> Experimental</div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="id" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">User ID</Label>
                <Input 
                  id="id" 
                  placeholder="Student ID" 
                  value={portalCreds.id}
                  className="h-12 rounded-xl font-bold"
                  onChange={e => setPortalCreds({...portalCreds, id: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pass" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Password</Label>
                <Input 
                  id="pass" 
                  type="password" 
                  value={portalCreds.password}
                  className="h-12 rounded-xl font-bold"
                  onChange={e => setPortalCreds({...portalCreds, password: e.target.value})}
                />
              </div>
              <div className="flex gap-2 pt-2">
                <Button variant="ghost" className="flex-1 rounded-xl h-10 font-bold" onClick={() => setStep('DEGREE_CONFIG')}>
                  Back
                </Button>
                <Button className="flex-[2] rounded-xl h-10 font-bold bg-secondary text-secondary-foreground" onClick={handlePortalImport} disabled={isLoading}>
                  {isLoading ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                  Import
                </Button>
              </div>
              <Button variant="link" className="w-full text-[10px] text-muted-foreground uppercase font-black" onClick={() => setStep('MANUAL_COUNT')}>
                Skip to Manual Entry
              </Button>
            </CardContent>
          </Card>
        )}

        {step === 'MANUAL_COUNT' && (
          <Card className="animate-in zoom-in-95 rounded-2xl border-none shadow-sm">
            <CardHeader className="text-center p-6">
              <CardTitle className="font-black text-2xl">History</CardTitle>
              <CardDescription className="text-xs font-medium uppercase tracking-tight">How many semesters have you completed?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8 p-6">
              <div className="space-y-4 text-center">
                <div className="flex items-center justify-center gap-8">
                  <Button 
                    variant="outline" 
                    className="h-12 w-12 rounded-xl text-2xl font-black border-2"
                    onClick={() => setManualCount(Math.max(1, manualCount - 1))}
                  >
                    -
                  </Button>
                  <span className="text-6xl font-black text-primary tabular-nums">{manualCount}</span>
                  <Button 
                    variant="outline" 
                    className="h-12 w-12 rounded-xl text-2xl font-black border-2"
                    onClick={() => setManualCount(Math.min(20, manualCount + 1))}
                  >
                    +
                  </Button>
                </div>
              </div>
              <div className="flex gap-3">
                <Button variant="ghost" className="flex-1 rounded-xl h-10 font-bold" onClick={() => setStep('PORTAL_LOGIN')}>
                   Back
                </Button>
                <Button className="flex-[2] rounded-xl h-10 font-bold bg-secondary text-secondary-foreground" onClick={startManualEntry}>
                  Next <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 'MANUAL_ENTRIES' && (
          <div className="space-y-4 animate-in fade-in duration-500 w-full pb-32">
            <div className="flex justify-between items-center px-2">
              <h2 className="font-black text-xl text-primary">Results</h2>
              <Badge variant="secondary" className="font-bold bg-primary/5 text-primary border-none">
                {manualSemesters.length} Semesters
              </Badge>
            </div>
            
            <div className="space-y-4">
              {manualSemesters.map((sem, idx) => (
                <Card key={idx} className="border-border/50 shadow-sm rounded-2xl overflow-hidden bg-white">
                  <div className="bg-primary/5 px-4 py-2 border-b border-primary/10 flex justify-between items-center">
                    <span className="text-[10px] font-black uppercase text-primary tracking-widest">Semester {idx + 1}</span>
                  </div>
                  <CardContent className="p-4 grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <Label className="text-[10px] font-black uppercase opacity-60">GPA</Label>
                      <Input 
                        type="number" 
                        step="0.01" 
                        min="0"
                        max="4"
                        placeholder="3.50"
                        value={sem.gpa}
                        onChange={e => {
                          const updated = [...manualSemesters];
                          updated[idx].gpa = e.target.value;
                          setManualSemesters(updated);
                        }}
                        className="font-bold text-lg h-12 rounded-xl"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[10px] font-black uppercase opacity-60">Credits</Label>
                      <Input 
                        type="number" 
                        min="1"
                        placeholder="18"
                        value={sem.credits}
                        onChange={e => {
                          const val = e.target.value;
                          if (val === '' || parseInt(val) >= 0) {
                            const updated = [...manualSemesters];
                            updated[idx].credits = val;
                            setManualSemesters(updated);
                          }
                        }}
                        className="font-bold text-lg h-12 rounded-xl"
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="fixed bottom-0 left-0 right-0 p-4 max-w-md mx-auto z-[60] bg-gradient-to-t from-background via-background/95 to-transparent flex flex-col items-center">
              <div className="flex gap-3 w-full">
                <Button variant="outline" className="flex-1 h-12 rounded-xl font-bold bg-white shadow-sm" onClick={() => setStep('MANUAL_COUNT')}>
                  Back
                </Button>
                <Button className="flex-[2] h-12 rounded-xl font-bold text-lg shadow-xl bg-secondary text-secondary-foreground" onClick={saveManualData}>
                  <Save className="w-4 h-4 mr-2" /> Save Profile
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
