export interface UserProfile {
  id: string;
  email: string;
  name: string;
  age: number;
  weight: number;
  lastPeriodDate: Date;
  cycleLength: number;
  periodLength: number;
  trackingGoal: "period_tracking" | "pregnancy_planning";
  partnerCode?: string;
  partnerId?: string;
  emailNotifications: boolean;
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
  pain_level: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
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
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}
