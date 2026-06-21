
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ChevronLeft, 
  Trash2, 
  History as HistoryIcon, 
  Calendar, 
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  SavedSemester, 
  formatGPA, 
  calculateCGPA 
} from '@/app/lib/grade-utils';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function HistoryPage() {
  const [history, setHistory] = useState<SavedSemester[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('ju_semesters');
    if (saved) {
      setHistory(JSON.parse(saved));
    }
  }, []);

  const deleteSemester = (id: string) => {
    const updated = history.filter(s => s.id !== id);
    setHistory(updated);
    localStorage.setItem('ju_semesters', JSON.stringify(updated));
  };

  const clearAll = () => {
    setHistory([]);
    localStorage.removeItem('ju_semesters');
  };

  const cgpa = calculateCGPA(history);
  const totalCredits = history.reduce((acc, curr) => acc + curr.totalCredits, 0);

  return (
    <div className="py-6 space-y-6 pb-24">
      <header className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ChevronLeft className="w-6 h-6" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold font-headline text-primary">History</h1>
        </div>
        {history.length > 0 && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="sm" className="text-destructive font-bold text-xs hover:bg-destructive/10">
                CLEAR ALL
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="w-[90%] rounded-2xl">
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete all your academic history. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={clearAll} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  Delete Everything
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </header>

      {history.length > 0 && (
        <section className="bg-primary p-6 rounded-[2rem] text-primary-foreground flex justify-between items-center shadow-lg">
          <div>
            <div className="text-[10px] uppercase font-bold opacity-70">Current CGPA</div>
            <div className="text-4xl font-black font-headline">{formatGPA(cgpa)}</div>
          </div>
          <div className="text-right">
            <div className="text-[10px] uppercase font-bold opacity-70">Total Credits</div>
            <div className="text-xl font-bold font-headline">{totalCredits}</div>
          </div>
        </section>
      )}

      <div className="space-y-4">
        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-16 bg-muted/30 rounded-3xl border border-dashed border-border text-center">
            <div className="bg-muted p-4 rounded-full mb-4">
              <HistoryIcon className="w-8 h-8 text-muted-foreground/40" />
            </div>
            <h3 className="font-headline font-bold text-lg">No history yet</h3>
            <p className="text-sm text-muted-foreground mb-6">Start by calculating your first semester GPA.</p>
            <Link href="/calculator">
              <Button className="rounded-full font-bold bg-primary">Start Calculating</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {history.map((sem) => (
              <Card key={sem.id} className="border-border/50 shadow-sm overflow-hidden animate-in fade-in slide-in-from-right-2">
                <CardContent className="p-4 flex justify-between items-center">
                  <div className="space-y-1">
                    <h3 className="font-bold text-base leading-none">Semester {sem.semesterNumber}</h3>
                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-bold uppercase">
                      <Calendar className="w-3 h-3" />
                      {new Date(sem.date).toLocaleDateString()}
                      <span>•</span>
                      {sem.totalCredits} Credits
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-[8px] font-black uppercase text-primary">GPA</div>
                      <div className="text-xl font-black font-headline">{formatGPA(sem.gpa)}</div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                      onClick={() => deleteSemester(sem.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <div className="fixed bottom-24 left-0 right-0 p-4 max-w-md mx-auto z-40">
        <Link href="/calculator">
          <Button className="w-full h-14 rounded-2xl font-black font-headline text-lg shadow-2xl bg-primary gap-2">
            Add New Semester <ArrowRight className="w-5 h-5" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
