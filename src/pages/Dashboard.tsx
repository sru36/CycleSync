import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { format, addDays, isSameDay } from "date-fns";
import {
  Heart,
  Calendar as CalendarIcon,
  TrendingUp,
  Users,
  Settings,
  Mail,
} from "lucide-react";
import { ThemeToggle } from "../components/ThemeToggle";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Calendar } from "../components/Calendar";
import { MoodTracker } from "../components/MoodTracker";
import { IntercourseLog } from "../components/IntercourseLog";
import { EmailSettingsDialog } from "../components/EmailSettingsDialog";
import { FertilityInsightsDialog } from "../components/FertilityInsightsDialog";
import type { UserProfile, MoodEntry } from "../lib/types";
import {
  calculateNextPeriod,
  getPhaseLabel,
  getPhaseColor,
} from "../lib/cycle-calculations";

export default function Dashboard() {
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showMoodTracker, setShowMoodTracker] = useState(false);
  const [showEmailSettings, setShowEmailSettings] = useState(false);
  const [showFertilityInsights, setShowFertilityInsights] = useState(false);
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);

  useEffect(() => {
    // Load user profile from localStorage (in a real app, this would come from your backend)
    const stored = localStorage.getItem("userProfile");
    if (stored) {
      const profile = JSON.parse(stored);
      profile.lastPeriodDate = new Date(profile.lastPeriodDate);
      setUserProfile(profile);
    } else {
      navigate("/onboarding");
    }

    // Load mood entries
    const storedMoods = localStorage.getItem("moodEntries");
    if (storedMoods) {
      const entries = JSON.parse(storedMoods).map((entry: any) => ({
        ...entry,
        date: new Date(entry.date),
        createdAt: new Date(entry.createdAt),
      }));
      setMoodEntries(entries);
    }
  }, [navigate]);

  const handleMoodSave = (entry: Partial<MoodEntry>) => {
    if (!userProfile) return;

    const newEntry: MoodEntry = {
      id: "mood-" + Date.now(),
      userId: userProfile.id,
      date: entry.date!,
      mood: entry.mood!,
      symptoms: entry.symptoms || [],
      crampsLevel: entry.crampsLevel || 0,
      energyLevel: entry.energyLevel || 5,
      notes: entry.notes || "",
      createdAt: new Date(),
    };

    const updatedEntries = [
      ...moodEntries.filter((e) => !isSameDay(e.date, newEntry.date)),
      newEntry,
    ];
    setMoodEntries(updatedEntries);
    localStorage.setItem("moodEntries", JSON.stringify(updatedEntries));
    setShowMoodTracker(false);
  };

  const getTodaysMoodEntry = (): Partial<MoodEntry> | undefined => {
    return moodEntries.find((entry) => isSameDay(entry.date, new Date()));
  };

  if (!userProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading your profile...</p>
        </div>
      </div>
    );
  }

  const prediction = calculateNextPeriod(userProfile);
  const todaysMood = getTodaysMoodEntry();

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm border-b border-white/20 dark:border-gray-700/20 sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-pink-500 rounded-lg flex items-center justify-center">
                <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <span className="text-xl sm:text-2xl font-bold gradient-text-brand">
                CycleSync
              </span>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/partner-sync")}
              >
                <Users className="w-4 h-4 mr-2" />
                Partner Sync
              </Button>
              <ThemeToggle />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/settings")}
              >
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Welcome Section */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Welcome back! 👋
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            Track your cycle, log your mood, and get personalized insights.
          </p>
        </div>

        {/* Current Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Card className="floating-card dark:bg-gray-800/80 dark:border-gray-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <CalendarIcon className="w-5 h-5" />
                Current Cycle
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Phase</span>
                  <Badge
                    className="text-white"
                    style={{ backgroundColor: getPhaseColor(prediction.phase) }}
                  >
                    {getPhaseLabel(prediction.phase)}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Cycle Day</span>
                  <span className="font-semibold">{prediction.cycleDay}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    Days until period
                  </span>
                  <span className="font-semibold text-period">
                    {prediction.daysUntilPeriod}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="floating-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Next Predictions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Next Period</span>
                  <span className="font-semibold">
                    {format(prediction.nextPeriodDate, "MMM d")}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Next Ovulation</span>
                  <span className="font-semibold">
                    {format(prediction.nextOvulationDate, "MMM d")}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Fertile Window</span>
                  <span className="font-semibold text-fertile">
                    {format(prediction.fertileDaysStart, "MMM d")} -{" "}
                    {format(prediction.fertileDaysEnd, "MMM d")}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="floating-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Heart className="w-5 h-5" />
                Today's Mood
              </CardTitle>
            </CardHeader>
            <CardContent>
              {todaysMood ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">
                      {todaysMood.mood === "excellent"
                        ? "😊"
                        : todaysMood.mood === "good"
                          ? "🙂"
                          : todaysMood.mood === "okay"
                            ? "😐"
                            : todaysMood.mood === "low"
                              ? "😔"
                              : "😢"}
                    </span>
                    <span className="font-semibold capitalize">
                      {todaysMood.mood}
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowMoodTracker(true)}
                    className="w-full"
                  >
                    Update Mood
                  </Button>
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-3">
                    How are you feeling today?
                  </p>
                  <Button
                    onClick={() => setShowMoodTracker(true)}
                    className="w-full bg-pink-500 hover:bg-pink-600 text-white"
                  >
                    Log Mood
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Calendar */}
          <div className="lg:col-span-2">
            <Calendar
              userProfile={userProfile}
              selectedDate={selectedDate}
              onDateSelect={setSelectedDate}
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-4 sm:space-y-6">
            {/* Quick Actions */}
            <Card className="floating-card">
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  onClick={() => setShowMoodTracker(true)}
                  className="w-full justify-start"
                  variant="outline"
                >
                  <Heart className="w-4 h-4 mr-2" />
                  Log Today's Mood
                </Button>

                {userProfile.trackingGoal === "pregnancy_planning" && (
                  <Button
                    className="w-full justify-start"
                    variant="outline"
                    onClick={() => setShowFertilityInsights(true)}
                  >
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Fertility Insights
                  </Button>
                )}

                <Button
                  className="w-full justify-start"
                  variant="outline"
                  onClick={() => setShowEmailSettings(true)}
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Email Settings
                </Button>
              </CardContent>
            </Card>

            {/* Intercourse Log - Only for pregnancy planning */}
            {userProfile.trackingGoal === "pregnancy_planning" && (
              <IntercourseLog userId={userProfile.id} />
            )}

            {/* Recent Insights */}
            <Card className="floating-card">
              <CardHeader>
                <CardTitle className="text-lg">Insights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 bg-period/10 rounded-lg">
                  <p className="text-sm font-medium text-period">
                    Period Reminder
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    Your period is expected in {prediction.daysUntilPeriod}{" "}
                    days. We'll send you a reminder 2 days before.
                  </p>
                </div>

                {userProfile.trackingGoal === "pregnancy_planning" &&
                  prediction.phase === "ovulation" && (
                    <div className="p-3 bg-fertile/10 rounded-lg">
                      <p className="text-sm font-medium text-fertile">
                        Fertility Window
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        You're in your fertile window! This is an optimal time
                        for conception.
                      </p>
                    </div>
                  )}

                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-700">
                    Cycle Pattern
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    Your cycles have been regular with an average length of{" "}
                    {userProfile.cycleLength} days.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Mood Tracker Modal */}
      {showMoodTracker && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto mx-4 sm:mx-auto">
            <div className="p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100">
                Track Your Mood
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowMoodTracker(false)}
              >
                ×
              </Button>
            </div>
            <div className="p-3 sm:p-4">
              <MoodTracker
                date={new Date()}
                onSave={handleMoodSave}
                existingEntry={todaysMood}
              />
            </div>
          </div>
        </div>
      )}

      {/* Email Settings Dialog */}
      <EmailSettingsDialog
        isOpen={showEmailSettings}
        onClose={() => setShowEmailSettings(false)}
      />

      {/* Fertility Insights Dialog */}
      {userProfile && (
        <FertilityInsightsDialog
          isOpen={showFertilityInsights}
          onClose={() => setShowFertilityInsights(false)}
          userProfile={userProfile}
          prediction={prediction}
        />
      )}
    </div>
  );
}
