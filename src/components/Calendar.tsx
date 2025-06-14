import React, { useState } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "../lib/utils";
import type { CycleDay, UserProfile } from "../lib/types";
import {
  generateCycleCalendar,
  getPhaseColor,
} from "../lib/cycle-calculations";

interface CalendarProps {
  userProfile: UserProfile;
  selectedDate?: Date;
  onDateSelect?: (date: Date) => void;
  className?: string;
}

export function Calendar({
  userProfile,
  selectedDate,
  onDateSelect,
  className,
}: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const cycleDays = generateCycleCalendar(userProfile, monthStart, monthEnd);
  const cycleDayMap = new Map(
    cycleDays.map((day) => [format(day.date, "yyyy-MM-dd"), day]),
  );

  // Debug logging to check cycle phases
  if (cycleDays.length > 0) {
    console.log(
      "Sample cycle days:",
      cycleDays.slice(0, 10).map((day) => ({
        date: format(day.date, "MMM d"),
        phase: day.phase,
        isPeriod: day.isPeriodDay,
        isOvulation: day.isOvulationDay,
        fertility: day.fertilityScore,
      })),
    );
  }

  const navigateToPreviousMonth = () =>
    setCurrentMonth(subMonths(currentMonth, 1));
  const navigateToNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  const getDayInfo = (date: Date): CycleDay | undefined => {
    return cycleDayMap.get(format(date, "yyyy-MM-dd"));
  };

  const renderDay = (date: Date) => {
    const dayInfo = getDayInfo(date);
    const isSelected = selectedDate && isSameDay(date, selectedDate);
    const isCurrentMonth = isSameMonth(date, currentMonth);
    const isToday = isSameDay(date, new Date());

    let dayClasses = cn(
      "relative w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-xs sm:text-sm rounded-md sm:rounded-lg cursor-pointer transition-all duration-200 hover:scale-105",
      {
        "opacity-40": !isCurrentMonth,
        "ring-2 ring-primary ring-offset-2 dark:ring-offset-gray-800":
          isSelected,
        "ring-2 ring-gray-900 dark:ring-gray-100 ring-offset-2 dark:ring-offset-gray-800":
          isToday && !isSelected,
      },
    );

    let backgroundColor =
      "bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700";
    let textColor = "text-gray-900 dark:text-gray-100";
    let indicators: React.ReactNode[] = [];

    if (dayInfo && isCurrentMonth) {
      // Priority 1: Period days (red boxed background)
      if (dayInfo.isPeriodDay) {
        backgroundColor =
          "bg-period hover:bg-period/80 dark:bg-period dark:hover:bg-period/80";
        textColor = "text-white dark:text-white";
      }
      // Priority 2: Ovulation days (blue boxed background)
      else if (dayInfo.isOvulationDay) {
        backgroundColor =
          "bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700";
        textColor = "text-white dark:text-white";
      }
      // Priority 3: High fertility days for pregnancy planning (yellow background)
      else if (
        dayInfo.fertilityScore > 50 &&
        userProfile.trackingGoal === "pregnancy_planning"
      ) {
        backgroundColor =
          "bg-yellow-200 hover:bg-yellow-300 dark:bg-yellow-600 dark:hover:bg-yellow-500";
        textColor = "text-yellow-900 dark:text-yellow-100 font-semibold";
      }
      // Priority 4: Other phases - improved colors for dark mode
      else {
        backgroundColor =
          "bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700";

        switch (dayInfo.phase) {
          case "follicular":
            textColor = "text-green-600 dark:text-green-400 font-semibold";
            break;
          case "luteal":
            textColor = "text-purple-600 dark:text-purple-400 font-semibold";
            break;
          default:
            textColor = "text-gray-900 dark:text-gray-100";
        }
      }

      // Add fertility indicator for basic tracking (small green dot)
      if (
        dayInfo.fertilityScore > 50 &&
        !dayInfo.isPeriodDay &&
        !dayInfo.isOvulationDay &&
        userProfile.trackingGoal === "cycle_tracking"
      ) {
        indicators.push(
          <div
            key="fertility"
            className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 dark:bg-green-400 rounded-full border border-white dark:border-gray-800"
          />,
        );
      }

      // Add PMS mood indicator (purple dot for luteal phase near period)
      if (dayInfo.predictedMood === "pms") {
        indicators.push(
          <div
            key="mood"
            className="absolute -bottom-1 -left-1 w-2 h-2 bg-purple-500 dark:bg-purple-400 rounded-full border border-white dark:border-gray-800"
          />,
        );
      }

      // Add symptom indicators based on cycle day
      if (dayInfo.phase === "luteal" && dayInfo.fertilityScore < 25) {
        indicators.push(
          <div
            key="symptoms"
            className="absolute bottom-0 right-0 w-1.5 h-1.5 bg-orange-500 dark:bg-orange-400 rounded-full"
            title="Possible PMS symptoms"
          />,
        );
      }
    }
    return (
      <div
        key={format(date, "yyyy-MM-dd")}
        className={cn(dayClasses, backgroundColor, textColor)}
        onClick={() => onDateSelect?.(date)}
      >
        <span className="relative z-10">{format(date, "d")}</span>
        {indicators}
      </div>
    );
  };

  return (
    <div
      className={cn(
        "p-4 sm:p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700",
        className,
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100">
          {format(currentMonth, "MMMM yyyy")}
        </h2>
        <div className="flex gap-1 sm:gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={navigateToPreviousMonth}
            className="p-2"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={navigateToNextMonth}
            className="p-2"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-3 sm:mb-4">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div
            key={day}
            className="text-center text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 py-1 sm:py-2"
          >
            <span className="hidden sm:inline">{day}</span>
            <span className="sm:hidden">{day.charAt(0)}</span>
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1 sm:gap-2">
        {calendarDays.map(renderDay)}
      </div>

      {/* Legend */}
      <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-gray-100 dark:border-gray-700">
        <h4 className="text-xs sm:text-sm font-medium text-gray-900 dark:text-gray-100 mb-2 sm:mb-3">
          Calendar Legend
        </h4>
        <div
          className={cn(
            "grid gap-2 sm:gap-3 text-xs",
            userProfile.trackingGoal === "pregnancy_planning"
              ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-3"
              : "grid-cols-2 sm:grid-cols-2",
          )}
        >
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-period rounded-full"></div>
            <span className="text-gray-600 dark:text-gray-300">
              Period Days
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-gray-600 dark:text-gray-300">Ovulation</span>
          </div>
          {userProfile.trackingGoal === "pregnancy_planning" && (
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-300 dark:bg-yellow-600 rounded-full"></div>
              <span className="text-gray-600 dark:text-gray-300">
                High Fertility
              </span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 border-2 border-green-500 dark:border-green-400 rounded-full"></div>
            <span className="text-gray-600 dark:text-gray-300">
              Follicular Phase
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 border-2 border-purple-500 dark:border-purple-400 rounded-full"></div>
            <span className="text-gray-600 dark:text-gray-300">
              Luteal Phase
            </span>
          </div>
        </div>

        {/* Indicator dots explanation */}
        <div className="mt-3 sm:mt-4 pt-2 sm:pt-3 border-t border-gray-100 dark:border-gray-600">
          <h5 className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
            Indicators
          </h5>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-2 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 dark:bg-green-400 rounded-full"></div>
              <span className="text-gray-500 dark:text-gray-400">
                Fertile window
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 dark:bg-purple-400 rounded-full"></div>
              <span className="text-gray-500 dark:text-gray-400">
                PMS likely
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-orange-500 dark:bg-orange-400 rounded-full"></div>
              <span className="text-gray-500 dark:text-gray-400">
                Symptoms possible
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
