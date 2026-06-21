"use client";

import { useState, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  Save, 
  GraduationCap, 
  ChevronLeft, 
  ArrowRight,
  Calculator,
  Hash,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';
import { 
  Course, 
  calculateGPA, 
  formatGPA, 
  SavedSemester,
  scoreToGrade,
  calculateCGPA,
  syncAcademicStats,
  GRADE_POINTS
} from '@/app/lib/grade-utils';

export default function CalculatorPage() {
  const { toast } = useToast();
  const [courses, setCourses] = useState<Course[]>([]);
  const [result, setResult] = useState<{ gpa: number, credits: number, predictedCgpa: number } | null>(null);
  const [singleScore, setSingleScore] = useState('');

  useEffect(() => {
    setCourses([
      { id: Math.random().toString(36).substring(2, 9), score: '', creditHours: '3' },
      { id: Math.random().toString(36).substring(2, 9), score: '', creditHours: '3' },
    ]);
  }, []);

  const addCourse = () => {
    setCourses([...courses, { id: Math.random().toString(36).substring(2, 9), score: '', creditHours: '3' }]);
  };

  const removeCourse = (id: string) => {
    if (courses.length > 1) {
      setCourses(courses.filter(c => c.id !== id));
    }
  };

  const updateCourse = (id: string, field: keyof Course, value: string) => {
    // Prevent negative credit hours
    if (field === 'creditHours' && value !== '' && parseInt(value) < 0) {
      return;
    }
    setCourses(courses.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  const handleCalculate = () => {
    const formatted = courses
      .filter(c => c.score !== '' && c.creditHours !== '')
      .map(c => ({
        score: parseFloat(c.score) || 0,
        creditHours: Math.max(0, parseInt(c.creditHours) || 0)
      }));
    
    if (formatted.length === 0) {
      toast({ variant: "destructive", title: "Empty Fields", description: "Please enter at least one course grade." });
      return;
    }

    const semGpa = calculateGPA(formatted);
    const semCredits = formatted.reduce((s, c) => s + c.creditHours, 0);

    const saved: SavedSemester[] = JSON.parse(localStorage.getItem('ju_semesters') || '[]');
    const tempSemester: SavedSemester = {
      id: 'temp',
      semesterNumber: saved.length + 1,
      gpa: semGpa,
      totalCredits: semCredits,
      courses: [],
      date: new Date().toISOString()
    };
    
    const predictedCgpa = calculateCGPA([...saved, tempSemester]);

    setResult({
      gpa: semGpa,
      credits: semCredits,
      predictedCgpa: predictedCgpa
    });
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSave = () => {
    if (!result) return;
    const saved: SavedSemester[] = JSON.parse(localStorage.getItem('ju_semesters') || '[]');
    const nextSem = saved.length + 1;
    const newRecord: SavedSemester = {
      id: Math.random().toString(36).substring(2, 9),
      semesterNumber: nextSem,
      gpa: result.gpa,
      totalCredits: result.credits,
      courses: courses.map(c => ({ score: parseFloat(c.score), creditHours: parseInt(c.creditHours) })),
      date: new Date().toISOString(),
    };
    
    const updated = [...saved, newRecord];
    localStorage.setItem('ju_semesters', JSON.stringify(updated));
    syncAcademicStats();
    
    toast({ title: "Semester Saved", description: `Added as Semester ${nextSem}` });
    setResult(null);
  };

  return (
    <div className="py-6 space-y-6 pb-40 max-w-md mx-auto">
      <header className="flex items-center gap-4 px-2">
        <Link href="/">
          <Button variant="ghost" size="icon" className="rounded-full active-scale bg-white dark:bg-card shadow-sm border border-border/50">
            <ChevronLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-black tracking-tight">GPA Calculator</h1>
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-60">Academic Utility</p>
        </div>
      </header>

      <Tabs defaultValue="semester" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-muted/30 p-1 h-14 rounded-2xl mb-6">
          <TabsTrigger value="semester" className="rounded-xl font-black text-xs uppercase tracking-widest data-[state=active]:bg-white dark:data-[state=active]:bg-card data-[state=active]:text-primary data-[state=active]:shadow-sm">
            Semester GPA
          </TabsTrigger>
          <TabsTrigger value="course" className="rounded-xl font-black text-xs uppercase tracking-widest data-[state=active]:bg-white dark:data-[state=active]:bg-card data-[state=active]:text-primary data-[state=active]:shadow-sm">
            Course GPA
          </TabsTrigger>
        </TabsList>

        <TabsContent value="semester" className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          {result && (
            <Card className="border-none shadow-2xl bg-white dark:bg-card rounded-[2.5rem] animate-in zoom-in-95 duration-500 overflow-hidden mb-8">
              <CardContent className="p-10 text-center space-y-8">
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest opacity-60">Semester Result</p>
                  <h2 className="text-7xl font-black tracking-tighter leading-none text-foreground">{formatGPA(result.gpa)}</h2>
                </div>

                <div className="flex items-center justify-center gap-4 py-4 border-y border-border/50">
                  <div className="text-center px-4">
                    <p className="text-[8px] font-black uppercase text-muted-foreground tracking-widest">Credits</p>
                    <p className="text-xl font-black text-primary">{result.credits}</p>
                  </div>
                  <div className="w-px h-8 bg-border/50" />
                  <div className="text-center px-4">
                    <p className="text-[8px] font-black uppercase text-primary tracking-widest">New CGPA</p>
                    <p className="text-xl font-black text-secondary">{formatGPA(result.predictedCgpa)}</p>
                  </div>
                </div>

                <Button 
                  onClick={handleSave} 
                  className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90 h-14 font-black text-lg rounded-2xl active-scale shadow-lg shadow-secondary/20"
                >
                  <Save className="w-5 h-5 mr-2" /> Save Semester
                </Button>
              </CardContent>
            </Card>
          )}

          <div className="space-y-4 px-1">
            {courses.map((course, idx) => (
              <Card key={course.id} className="border-border/40 shadow-sm bg-white dark:bg-card rounded-[2rem] overflow-hidden group">
                <div className="p-6 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] opacity-40">Course {idx + 1}</span>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-muted-foreground/30 hover:text-destructive hover:bg-destructive/5 rounded-full" 
                      onClick={() => removeCourse(course.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase text-muted-foreground pl-1">Score (0-100)</Label>
                      <Input 
                        type="number" 
                        placeholder="85"
                        min="0"
                        max="100"
                        value={course.score}
                        onChange={e => updateCourse(course.id, 'score', e.target.value)}
                        className="h-14 rounded-2xl border-border/50 bg-muted/20 text-lg font-black text-center"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase text-muted-foreground pl-1">Credits</Label>
                      <Input 
                        type="number" 
                        placeholder="3"
                        min="1"
                        value={course.creditHours}
                        onChange={e => updateCourse(course.id, 'creditHours', e.target.value)}
                        className="h-14 rounded-2xl border-border/50 bg-muted/20 text-lg font-black text-center"
                      />
                    </div>
                  </div>
                  {course.score && (
                    <div className="text-[10px] font-black text-primary flex items-center justify-center gap-2 bg-primary/5 px-3 py-3 rounded-xl w-full border border-primary/10">
                      <GraduationCap className="w-4 h-4" />
                      GRADE: {scoreToGrade(parseFloat(course.score))} (Points: {GRADE_POINTS[scoreToGrade(parseFloat(course.score))].toFixed(2)})
                    </div>
                  )}
                </div>
              </Card>
            ))}

            <Button 
              variant="outline" 
              className="w-full h-16 border-dashed border-2 rounded-[2rem] text-muted-foreground font-black uppercase tracking-widest text-xs hover:bg-primary/5 active-scale mb-12"
              onClick={addCourse}
            >
              <Plus className="w-5 h-5 mr-2" /> Add Course
            </Button>
          </div>

          <div className="fixed bottom-[calc(90px+env(safe-area-inset-bottom))] left-0 right-0 px-4 z-40 max-w-md mx-auto">
            <div className="bg-white/80 dark:bg-card/80 backdrop-blur-xl p-3 rounded-3xl border border-border/50 shadow-2xl">
              <Button 
                className="w-full h-16 rounded-2xl font-black text-lg bg-secondary text-secondary-foreground shadow-xl shadow-secondary/20 active-scale flex items-center justify-between px-8"
                onClick={handleCalculate}
              >
                <span>Calculate Semester</span>
                <ArrowRight className="w-6 h-6" />
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="course" className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300 px-1">
          <Card className="border-none shadow-xl bg-white dark:bg-card rounded-[2.5rem] overflow-hidden">
            <CardContent className="p-8 space-y-8">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary mx-auto mb-2">
                  <Calculator className="w-6 h-6" />
                </div>
                <h3 className="font-black text-lg">Single Course Tool</h3>
                <p className="text-xs text-muted-foreground font-medium">Quickly convert your score to GPA points.</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-muted-foreground pl-1">Course Score (0-100)</Label>
                  <div className="relative">
                    <Hash className="absolute left-4 top-4 w-6 h-6 text-muted-foreground/30" />
                    <Input 
                      type="number"
                      placeholder="e.g. 85"
                      min="0"
                      max="100"
                      value={singleScore}
                      onChange={(e) => setSingleScore(e.target.value)}
                      className="h-14 rounded-2xl border-border/50 bg-muted/20 text-2xl font-black pl-12"
                    />
                  </div>
                </div>

                {singleScore && parseFloat(singleScore) >= 0 && (
                  <div className="space-y-6 animate-in zoom-in-95 duration-300 pt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-primary/5 border border-primary/10 rounded-2xl p-4 text-center space-y-1">
                        <p className="text-[8px] font-black uppercase text-muted-foreground tracking-widest">Letter Grade</p>
                        <p className="text-3xl font-black text-primary">{scoreToGrade(parseFloat(singleScore))}</p>
                      </div>
                      <div className="bg-secondary/5 border border-secondary/10 rounded-2xl p-4 text-center space-y-1">
                        <p className="text-[8px] font-black uppercase text-muted-foreground tracking-widest">Grade Points</p>
                        <p className="text-3xl font-black text-secondary">{GRADE_POINTS[scoreToGrade(parseFloat(singleScore))].toFixed(2)}</p>
                      </div>
                    </div>

                    <Card className="bg-primary text-primary-foreground border-none rounded-2xl shadow-lg overflow-hidden">
                      <CardContent className="p-6 flex items-center gap-4 relative">
                        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                          <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-[8px] font-bold uppercase opacity-60">Advisor Note</p>
                          <p className="text-xs font-bold leading-tight">
                            {parseFloat(singleScore) >= 85 ? "Excellent work! Keep maintaining this standard." : 
                             parseFloat(singleScore) >= 70 ? "Good standing. Aim for the 85+ range next time." :
                             "Focus on study strategies to boost this score."}
                          </p>
                        </div>
                        <div className="absolute -right-4 -bottom-4 opacity-10">
                          <GraduationCap className="w-24 h-24" />
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}