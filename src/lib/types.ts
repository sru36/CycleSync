export interface UserProfile {
  id: string;
  age: number;
  weight: number;
  cycleLength: number; // 28, 29, 30, 31, 32+ days
  periodLength: number; // 5-7+ days
  lastPeriodDate: Date;
  trackingGoal: "cycle_tracking" | "pregnancy_planning";
  email?: string;
  emailReminders?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CycleDay {
  date: Date;
  phase: "menstrual" | "follicular" | "ovulation" | "luteal";
  isPeriodDay: boolean;
  isOvulationDay: boolean;
  fertilityScore: number; // 0-100
  predictedMood: "high" | "medium" | "low" | "pms";
}

export interface MoodEntry {
  id: string;
  userId: string;
  date: Date;
  mood: "excellent" | "good" | "okay" | "low" | "terrible";
  symptoms: string[];
  crampsLevel: number; // 0-10
  energyLevel: number; // 0-10
  notes: string;
  createdAt: Date;
}

export interface PeriodPrediction {
  nextPeriodDate: Date;
  nextOvulationDate: Date;
  fertileDaysStart: Date;
  fertileDaysEnd: Date;
  cycleDay: number;
  phase: "menstrual" | "follicular" | "ovulation" | "luteal";
  daysUntilPeriod: number;
}

export interface Partner {
  id: string;
  name: string;
  email: string;
  relationshipType: "boyfriend" | "husband" | "partner";
  notificationsEnabled: boolean;
  connectedAt: Date;
}

export interface CycleStats {
  averageCycleLength: number;
  averagePeriodLength: number;
  totalCyclesTracked: number;
  cycleRegularity: "regular" | "irregular" | "unknown";
  lastSixCycles: number[];
}

export const SYMPTOMS = [
  "Cramps",
  "Headache",
  "Bloating",
  "Breast tenderness",
  "Mood swings",
  "Acne",
  "Fatigue",
  "Food cravings",
  "Back pain",
  "Nausea",
  "Irritability",
  "Anxiety",
] as const;

export type Symptom = (typeof SYMPTOMS)[number];

export const MOODS = [
  { value: "excellent", label: "Excellent", emoji: "😊", color: "#A8E6CF" },
  { value: "good", label: "Good", emoji: "🙂", color: "#FFD93D" },
  { value: "okay", label: "Okay", emoji: "😐", color: "#FF9F7A" },
  { value: "low", label: "Low", emoji: "😔", color: "#C4A3FF" },
  { value: "terrible", label: "Terrible", emoji: "😢", color: "#FF6B8A" },
] as const;

export interface IntercourseEntry {
  id: string;
  userId: string;
  date: Date;
  time: string;
  protectionUsed: "none" | "condom" | "withdrawal" | "other";
  notes: string;
  createdAt: Date;
}
