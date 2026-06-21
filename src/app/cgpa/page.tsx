"use client";

import { useState, useEffect } from 'react';
import { TrendingUp, Trash2, History, ChevronLeft, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { SavedSemester, calculateCGPA, formatGPA } from '@/app/lib/grade-utils';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

export default function CGPATracker() {
  const { toast } = useToast();
  const [semesters, setSemesters] = useState<SavedSemester[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('ju_semesters');
    if (saved) setSemesters(JSON.parse(saved));
  }, []);

  const deleteSem = (id: string) => {
    const updated = semesters.filter(s => s.id !== id);
    setSemesters(updated);
    localStorage.setItem('ju_semesters', JSON.stringify(updated));
    toast({ title: "Removed", description: "Semester data removed." });
  };

  const cgpa = calculateCGPA(semesters);
  const totalCr = semesters.reduce((acc, curr) => acc + curr.totalCredits, 0);

  return (
    <div className="py-6 space-y-8 max-w-md mx-auto pb-24">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/">
            <Button variant="ghost" size="icon" className="rounded-full"><ChevronLeft className="w-5 h-5" /></Button>
          </Link>
          <h1 className="text-xl font-bold">Academic Tracker</h1>
        </div>
      </header>

      <section className="bg-card border border-border/50 p-10 rounded-3xl shadow-sm text-center space-y-4">
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Overall Performance</p>
        <div className="text-7xl font-black tracking-tighter">{formatGPA(cgpa)}</div>
        <div className="flex justify-center gap-4 text-xs font-medium text-muted-foreground">
          <span>{totalCr} Credits</span>
          <span className="opacity-20">|</span>
          <span>{semesters.length} Semesters</span>
        </div>
      </section>

      <div className="space-y-4">
        <h2 className="text-sm font-bold flex items-center gap-2 px-1">
          <History className="w-4 h-4 text-primary" /> History
        </h2>

        {semesters.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground/40 font-medium">No records found.</div>
        ) : (
          <div className="space-y-3">
            {semesters.map((sem) => (
              <Card key={sem.id} className="border-border/50 shadow-none bg-card">
                <CardContent className="p-5 flex items-center justify-between">
                  <div className="space-y-1">
                    <h3 className="font-bold text-sm">Semester {sem.semesterNumber}</h3>
                    <p className="text-[10px] font-medium text-muted-foreground uppercase">{sem.totalCredits} Credits • {new Date(sem.date).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <div className="text-xl font-bold">{formatGPA(sem.gpa)}</div>
                      <div className="text-[8px] font-bold text-muted-foreground uppercase">GPA</div>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground/30 hover:text-destructive" onClick={() => deleteSem(sem.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
