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
import { auth } from "../lib/auth";
import { cycle } from "../lib/cycle";
import { toast } from "../components/ui/use-toast";

export default function Dashboard() {
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showEmailSettings, setShowEmailSettings] = useState(false);
  const [showFertilityInsights, setShowFertilityInsights] = useState(false);
  const [isVerified, setIsVerified] = useState<boolean | null>(null);

  useEffect(() => {
    (async () => {
      const user = await auth.getCurrentUser();
      if (!user || (!user.email_confirmed_at && !user.confirmed_at)) {
        toast({
          title: "Email Not Verified",
          description: "Please verify your email before accessing the dashboard.",
          variant: "destructive",
        });
        setIsVerified(false);
        navigate("/auth");
      } else {
        setIsVerified(true);
      }
    })();
  }, [navigate]);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      setIsLoading(true);
      const user = await auth.getCurrentUser();
      if (!user) {
        navigate("/auth");
        return;
      }

      const profile = await auth.getProfile(user.id);
      setUserProfile(profile);

      const entries = await cycle.getMoodEntries(user.id);
      setMoodEntries(entries);
    } catch (error) {
      console.error("Error loading user data:", error);
      toast({
        title: "Error",
        description: "Failed to load your data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleMoodSave = async (entry: Partial<MoodEntry>) => {
    try {
      const user = await auth.getCurrentUser();
      if (!user) return;

      const newEntry = await cycle.addMoodEntry(
        user.id,
        entry.mood!,
        entry.pain_level!,
        entry.notes
      );
      setMoodEntries((prev) => [...prev, newEntry]);
      toast({
        title: "Success",
        description: "Mood entry saved successfully",
      });
    } catch (error) {
      console.error("Error saving mood entry:", error);
      toast({
        title: "Error",
        description: "Failed to save mood entry. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isVerified === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Checking verification status...</p>
        </div>
      </div>
    );
  }
  if (!isVerified) return null;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="mb-4">No profile found. Please complete onboarding.</p>
          <Button onClick={() => navigate("/onboarding")}>
            Complete Onboarding
          </Button>
        </div>
      </div>
    );
  }

  const prediction = calculateNextPeriod(userProfile);
  const isPeriodSoon = prediction.daysUntilPeriod <= 2;
  const isPeriodNow = prediction.daysUntilPeriod <= 0;

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm border-b border-white/20 dark:border-gray-700/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-period rounded-lg flex items-center justify-center">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-period bg-clip-text text-transparent">
                  CycleSync
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowEmailSettings(true)}
              >
                <Mail className="w-4 h-4 mr-2" />
                Email Settings
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/partner-sync")}
              >
                <Users className="w-4 h-4 mr-2" />
                Partner Sync
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/settings")}
              >
                <Settings className="w-4 h-4" />
              </Button>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Period Status */}
          <Card className="md:col-span-2 lg:col-span-3">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Cycle Status</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowFertilityInsights(true)}
                >
                  <TrendingUp className="w-4 h-4 mr-2" />
                  View Insights
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold mb-2">
                    {isPeriodNow
                      ? "Your period has started"
                      : isPeriodSoon
                      ? `Period in ${prediction.daysUntilPeriod} days`
                      : `${prediction.daysUntilPeriod} days until next period`}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Current phase: {getPhaseLabel(prediction.phase)}
                  </p>
                </div>
                <Badge
                  className={`text-lg px-4 py-2 ${getPhaseColor(
                    prediction.phase
                  )}`}
                >
                  {prediction.phase.toUpperCase()}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Calendar */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Calendar</CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar userProfile={userProfile} />
            </CardContent>
          </Card>

          {/* Mood Tracker */}
          <Card>
            <CardHeader>
              <CardTitle>Mood Tracker</CardTitle>
            </CardHeader>
            <CardContent>
              <MoodTracker
                date={new Date()}
                onSave={handleMoodSave}
                existingEntry={moodEntries.find((entry) =>
                  isSameDay(new Date(entry.createdAt), new Date())
                )}
              />
            </CardContent>
          </Card>

          {/* Intercourse Log */}
          <Card>
            <CardHeader>
              <CardTitle>Intercourse Log</CardTitle>
            </CardHeader>
            <CardContent>
              <IntercourseLog userId={userProfile.id} />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Email Settings Dialog */}
      <EmailSettingsDialog
        isOpen={showEmailSettings}
        onClose={() => setShowEmailSettings(false)}
      />

      {/* Fertility Insights Dialog */}
      <FertilityInsightsDialog
        isOpen={showFertilityInsights}
        onClose={() => setShowFertilityInsights(false)}
        userProfile={userProfile}
        prediction={prediction}
      />
    </div>
  );
}
