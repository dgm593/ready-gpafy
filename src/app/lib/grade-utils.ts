export type GradeLetter = 'A' | 'A-' | 'B+' | 'B' | 'B-' | 'C+' | 'C' | 'D' | 'F';

export const GRADE_LETTERS: GradeLetter[] = ['A', 'A-', 'B+', 'B', 'B-' | 'C+', 'C', 'D', 'F'];

export const GRADE_POINTS: Record<string, number> = {
  'A': 4.0,
  'A-': 3.75,
  'B+': 3.5,
  'B': 3.0,
  'B-': 2.75,
  'C+': 2.5,
  'C': 2.0,
  'D': 1.0,
  'F': 0.0,
};

export function scoreToGrade(score: number): GradeLetter {
  if (score >= 85) return 'A';
  if (score >= 80) return 'A-';
  if (score >= 75) return 'B+';
  if (score >= 70) return 'B';
  if (score >= 65) return 'B-';
  if (score >= 60) return 'C+';
  if (score >= 50) return 'C';
  if (score >= 45) return 'D';
  return 'F';
}

export interface Course {
  id: string;
  score: string;
  creditHours: string;
}

export interface SavedSemester {
  id: string;
  semesterNumber: number;
  gpa: number;
  totalCredits: number;
  courses: { score: number; creditHours: number }[];
  date: string;
}

export function calculateGPA(courses: { score: number; creditHours: number }[]): number {
  if (courses.length === 0) return 0;
  
  let totalQualityPoints = 0;
  let totalCreditHours = 0;

  for (const course of courses) {
    const grade = scoreToGrade(course.score);
    const points = GRADE_POINTS[grade] || 0;
    totalQualityPoints += points * course.creditHours;
    totalCreditHours += course.creditHours;
  }
  
  return totalCreditHours === 0 ? 0 : totalQualityPoints / totalCreditHours;
}

export function calculateCGPA(semesters: SavedSemester[]): number {
  if (semesters.length === 0) return 0;
  
  const totalQualityPoints = semesters.reduce((sum, sem) => sum + (sem.gpa * sem.totalCredits), 0);
  const totalCreditHours = semesters.reduce((sum, sem) => sum + sem.totalCredits, 0);
  
  return totalCreditHours === 0 ? 0 : totalQualityPoints / totalCreditHours;
}

export function formatGPA(gpa: number): string {
  if (isNaN(gpa) || !isFinite(gpa)) return '0.00';
  return gpa.toFixed(2);
}

export type RiskLevel = 'High Pressure' | 'Balanced' | 'Stable' | 'Low Risk' | 'Impossible' | 'Achieved';

export interface PlannerResult {
  requiredGpa: number;
  riskLevel: RiskLevel;
  strategy: string;
}

export function getRiskLevel(requiredGpa: number): RiskLevel {
  if (requiredGpa > 4.0) return 'Impossible';
  if (requiredGpa <= 0) return 'Achieved';
  if (requiredGpa >= 3.75) return 'High Pressure';
  if (requiredGpa >= 3.30) return 'Balanced';
  if (requiredGpa >= 3.00) return 'Stable';
  return 'Low Risk';
}

export function getStrategyText(risk: RiskLevel): string {
  switch (risk) {
    case 'High Pressure':
      return 'Aim mostly for A and A-. Consistent study required.';
    case 'Balanced':
      return 'Aim for A-, B+, and B grades.';
    case 'Stable':
      return 'B+ and B grades are sufficient.';
    case 'Low Risk':
      return 'Target is comfortably achievable. Keep up your current pace.';
    case 'Impossible':
      return 'The target cannot be reached with the remaining credits.';
    case 'Achieved':
      return 'Your current CGPA is already above your target.';
    default:
      return '';
  }
}

export function calculateRequiredGpa(
  currentCgpa: number,
  completedCredits: number,
  targetCgpa: number,
  additionalCredits: number
): number {
  if (additionalCredits <= 0) return 0;
  const totalFinalCredits = completedCredits + additionalCredits;
  const targetQualityPoints = targetCgpa * totalFinalCredits;
  const currentQualityPoints = currentCgpa * completedCredits;
  return (targetQualityPoints - currentQualityPoints) / additionalCredits;
}

export function syncAcademicStats() {
  const saved = localStorage.getItem('ju_semesters');
  if (!saved) return;
  const semesters: SavedSemester[] = JSON.parse(saved);
  const cgpa = calculateCGPA(semesters);
  const credits = semesters.reduce((acc, s) => acc + s.totalCredits, 0);
  localStorage.setItem('ju_current_cgpa', cgpa.toFixed(4));
  localStorage.setItem('ju_completed_credits', credits.toString());
}