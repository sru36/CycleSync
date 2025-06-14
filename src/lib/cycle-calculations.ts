import { addDays, differenceInDays, format, startOfDay } from "date-fns";
import type { CycleDay, PeriodPrediction, UserProfile } from "./types";

export function calculateCycleDay(
  lastPeriodDate: Date,
  currentDate: Date,
): number {
  const daysSinceLastPeriod = differenceInDays(currentDate, lastPeriodDate);
  return daysSinceLastPeriod + 1;
}

export function calculatePhase(
  cycleDay: number,
  cycleLength: number,
  periodLength: number,
): "menstrual" | "follicular" | "ovulation" | "luteal" {
  if (cycleDay <= periodLength) {
    return "menstrual";
  }

  const ovulationDay = cycleLength - 14;
  const follicularEnd = ovulationDay - 2;
  const ovulationEnd = ovulationDay + 2;

  if (cycleDay <= follicularEnd) {
    return "follicular";
  } else if (cycleDay <= ovulationEnd) {
    return "ovulation";
  } else {
    return "luteal";
  }
}

export function calculateOvulationDate(
  lastPeriodDate: Date,
  cycleLength: number,
): Date {
  // Ovulation typically occurs 14 days before the next period
  const ovulationDay = cycleLength - 14;
  return addDays(lastPeriodDate, ovulationDay - 1);
}

export function calculateFertileWindow(ovulationDate: Date): {
  start: Date;
  end: Date;
} {
  // Fertile window: 5 days before ovulation + ovulation day + 1 day after
  return {
    start: addDays(ovulationDate, -5),
    end: addDays(ovulationDate, 1),
  };
}

export function calculateFertilityScore(
  cycleDay: number,
  cycleLength: number,
): number {
  const ovulationDay = cycleLength - 14;
  const distanceFromOvulation = Math.abs(cycleDay - ovulationDay);

  if (distanceFromOvulation === 0) return 100; // Ovulation day
  if (distanceFromOvulation <= 1) return 90; // 1 day from ovulation
  if (distanceFromOvulation <= 2) return 75; // 2 days from ovulation
  if (distanceFromOvulation <= 3) return 50; // 3 days from ovulation
  if (distanceFromOvulation <= 5) return 25; // 5 days from ovulation

  return 0; // Not fertile
}

export function predictMood(
  phase: string,
  cycleDay: number,
  cycleLength: number,
): "high" | "medium" | "low" | "pms" {
  switch (phase) {
    case "menstrual":
      return cycleDay <= 2 ? "low" : "medium";
    case "follicular":
      return "high";
    case "ovulation":
      return "high";
    case "luteal":
      const daysBeforePeriod = cycleLength - cycleDay;
      return daysBeforePeriod <= 5 ? "pms" : "medium";
    default:
      return "medium";
  }
}

export function generateCycleCalendar(
  userProfile: UserProfile,
  startDate: Date,
  endDate: Date,
): CycleDay[] {
  const days: CycleDay[] = [];
  const current = startOfDay(startDate);
  const end = startOfDay(endDate);

  while (current <= end) {
    const daysSinceLastPeriod = differenceInDays(
      current,
      userProfile.lastPeriodDate,
    );

    // Handle negative days (before last period) and cycle through multiple cycles
    let adjustedCycleDay: number;
    if (daysSinceLastPeriod < 0) {
      // For dates before the last period, calculate backwards
      const cyclesBack = Math.ceil(
        Math.abs(daysSinceLastPeriod) / userProfile.cycleLength,
      );
      adjustedCycleDay =
        userProfile.cycleLength -
        (Math.abs(daysSinceLastPeriod) % userProfile.cycleLength);
      if (adjustedCycleDay === userProfile.cycleLength)
        adjustedCycleDay = userProfile.cycleLength;
    } else {
      // For dates after last period
      adjustedCycleDay = (daysSinceLastPeriod % userProfile.cycleLength) + 1;
    }

    const phase = calculatePhase(
      adjustedCycleDay,
      userProfile.cycleLength,
      userProfile.periodLength,
    );

    const isPeriodDay = adjustedCycleDay <= userProfile.periodLength;
    const ovulationDay = userProfile.cycleLength - 14;
    const isOvulationDay =
      adjustedCycleDay >= ovulationDay - 1 &&
      adjustedCycleDay <= ovulationDay + 1;
    const fertilityScore = calculateFertilityScore(
      adjustedCycleDay,
      userProfile.cycleLength,
    );
    const predictedMood = predictMood(
      phase,
      adjustedCycleDay,
      userProfile.cycleLength,
    );

    days.push({
      date: new Date(current),
      phase,
      isPeriodDay,
      isOvulationDay,
      fertilityScore,
      predictedMood,
    });

    current.setDate(current.getDate() + 1);
  }

  return days;
}

export function calculateNextPeriod(
  userProfile: UserProfile,
): PeriodPrediction {
  const cycleDay = calculateCycleDay(userProfile.lastPeriodDate, new Date());
  const adjustedCycleDay = ((cycleDay - 1) % userProfile.cycleLength) + 1;

  const daysUntilNextPeriod = userProfile.cycleLength - adjustedCycleDay + 1;
  const nextPeriodDate = addDays(new Date(), daysUntilNextPeriod);
  const nextOvulationDate = calculateOvulationDate(
    userProfile.lastPeriodDate,
    userProfile.cycleLength,
  );
  const { start: fertileDaysStart, end: fertileDaysEnd } =
    calculateFertileWindow(nextOvulationDate);
  const phase = calculatePhase(
    adjustedCycleDay,
    userProfile.cycleLength,
    userProfile.periodLength,
  );

  return {
    nextPeriodDate,
    nextOvulationDate,
    fertileDaysStart,
    fertileDaysEnd,
    cycleDay: adjustedCycleDay,
    phase,
    daysUntilPeriod: daysUntilNextPeriod,
  };
}

export function getPhaseColor(phase: string): string {
  switch (phase) {
    case "menstrual":
      return "#FF6B8A";
    case "follicular":
      return "#A8E6CF";
    case "ovulation":
      return "#FF9F7A";
    case "luteal":
      return "#C4A3FF";
    default:
      return "#E5E7EB";
  }
}

export function getPhaseLabel(phase: string): string {
  switch (phase) {
    case "menstrual":
      return "Period";
    case "follicular":
      return "Follicular";
    case "ovulation":
      return "Ovulation";
    case "luteal":
      return "Luteal";
    default:
      return "Unknown";
  }
}
