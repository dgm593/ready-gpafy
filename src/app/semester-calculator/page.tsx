
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Trash2, Save, Calculator, AlertCircle, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { 
  GradeLetter, 
  GRADE_LETTERS, 
  Course, 
  calculateGPA, 
  formatGPA,
  SavedSemester 
} from '@/app/lib/grade-utils';
import Link from 'next/link';

export default function SemesterCalculator() {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([
    { id: '1', creditHours: 3, grade: 'A' },
  ]);
  const [semesterName, setSemesterName] = useState('New Semester');
  const [isSaving, setIsSaving] = useState(false);

  const addCourse = () => {
    setCourses([...courses, { id: Math.random().toString(36).substr(2, 9), creditHours: 3, grade: 'A' }]);
  };

  const removeCourse = (id: string) => {
    if (courses.length > 1) {
      setCourses(courses.filter(c => c.id !== id));
    }
  };

  const updateCourse = (id: string, field: keyof Course, value: any) => {
    setCourses(courses.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  const gpa = calculateGPA(courses);
  const totalCredits = courses.reduce((sum, c) => sum + (Number(c.creditHours) || 0), 0);

  const handleSave = () => {
    setIsSaving(true);
    const saved: SavedSemester[] = JSON.parse(localStorage.getItem('ju_semesters') || '[]');
    
    const newRecord: SavedSemester = {
      id: Math.random().toString(36).substr(2, 9),
      name: semesterName,
      gpa,
      totalCredits: totalCredits,
      date: new Date().toISOString(),
    };

    localStorage.setItem('ju_semesters', JSON.stringify([newRecord, ...saved]));
    
    setTimeout(() => {
      setIsSaving(false);
      router.push('/cgpa'); // Navigate to CGPA summary as it's the main history view
    }, 600);
  };

  return (
    <div className="py-6 space-y-6 max-w-md mx-auto">
      <header className="flex items-center gap-4">
        <Link href="/">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ChevronLeft className="w-6 h-6" />
          </Button>
        </Link>
        <h1 className="text-xl font-bold font-headline">Grade Calculator</h1>
      </header>

      <section className="bg-primary/5 p-6 rounded-2xl border border-primary/10 text-center space-y-2">
        <div className="text-muted-foreground text-sm font-medium">Semester GPA</div>
        <div className="text-5xl font-black font-headline text-primary">{formatGPA(gpa)}</div>
        <div className="text-xs text-muted-foreground">Total Credits: {totalCredits}</div>
      </section>

      <div className="space-y-4">
        <div className="px-1">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Semester Label</label>
          <Input 
            value={semesterName} 
            onChange={(e) => setSemesterName(e.target.value)}
            className="mt-1 font-headline font-semibold text-lg border-none bg-transparent p-0 h-auto focus-visible:ring-0"
            placeholder="e.g. Year 1 Semester 2"
          />
        </div>

        <div className="space-y-3">
          {courses.map((course, index) => (
            <Card key={course.id} className="border-border/60 shadow-none overflow-hidden group">
              <CardContent className="p-3 flex items-center gap-3">
                <div className="flex-1 space-y-1">
                  <label className="text-[10px] font-bold text-muted-foreground block">CREDITS</label>
                  <Input 
                    type="number" 
                    min="1" 
                    max="10"
                    value={course.creditHours}
                    onChange={(e) => updateCourse(course.id, 'creditHours', parseInt(e.target.value) || 0)}
                    className="h-9 font-medium"
                  />
                </div>
                <div className="flex-1 space-y-1">
                  <label className="text-[10px] font-bold text-muted-foreground block">GRADE</label>
                  <Select 
                    value={course.grade} 
                    onValueChange={(val) => updateCourse(course.id, 'grade', val as GradeLetter)}
                  >
                    <SelectTrigger className="h-9 font-bold font-headline">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {GRADE_LETTERS.map(g => (
                        <SelectItem key={g} value={g} className="font-bold">{g}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="pt-5">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-9 w-9 text-destructive hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => removeCourse(course.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Button 
          variant="outline" 
          className="w-full border-dashed border-2 py-6 text-primary hover:bg-primary/5 gap-2"
          onClick={addCourse}
        >
          <Plus className="w-4 h-4" /> Add Course
        </Button>
      </div>

      <div className="sticky bottom-20 left-0 right-0 py-4 bg-background/80 backdrop-blur-sm px-1">
        <Button 
          className="w-full h-12 text-base font-bold font-headline shadow-lg"
          onClick={handleSave}
          disabled={isSaving}
        >
          {isSaving ? "Saving..." : <><Save className="w-4 h-4 mr-2" /> Save to History</>}
        </Button>
      </div>
    </div>
  );
}
