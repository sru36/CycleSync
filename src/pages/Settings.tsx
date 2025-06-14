import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Settings as SettingsIcon,
  LogOut,
  Calendar,
  Target,
  Heart,
  ArrowLeft,
  Save,
} from "lucide-react";
import { ThemeToggle } from "../components/ThemeToggle";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
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
} from "../components/ui/alert-dialog";
import { Separator } from "../components/ui/separator";
import { toast } from "../components/ui/use-toast";
import type { UserProfile } from "../lib/types";

export default function Settings() {
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    lastPeriodDate: "",
    trackingGoal: "" as "cycle_tracking" | "pregnancy_planning",
  });

  useEffect(() => {
    // Load user profile from localStorage
    const stored = localStorage.getItem("userProfile");
    if (stored) {
      const profile = JSON.parse(stored);
      profile.lastPeriodDate = new Date(profile.lastPeriodDate);
      setUserProfile(profile);
      setFormData({
        lastPeriodDate: profile.lastPeriodDate.toISOString().split("T")[0],
        trackingGoal: profile.trackingGoal,
      });
    } else {
      navigate("/onboarding");
    }
  }, [navigate]);

  const handleLogout = () => {
    // Clear all stored data
    localStorage.removeItem("userProfile");
    localStorage.removeItem("moodEntries");
    localStorage.removeItem("intercourseEntries");

    // Navigate to home page
    navigate("/");

    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account.",
    });
  };

  const handleSaveChanges = async () => {
    if (!userProfile) return;

    setIsLoading(true);

    try {
      const updatedProfile: UserProfile = {
        ...userProfile,
        lastPeriodDate: new Date(formData.lastPeriodDate),
        trackingGoal: formData.trackingGoal,
        updatedAt: new Date(),
      };

      // Save to localStorage (in real app, this would be API call)
      localStorage.setItem("userProfile", JSON.stringify(updatedProfile));
      setUserProfile(updatedProfile);

      toast({
        title: "Settings saved",
        description: "Your settings have been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  if (!userProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm border-b border-white/20 dark:border-gray-700/20 sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/dashboard")}
                className="text-xs sm:text-sm"
              >
                <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Back to Dashboard</span>
                <span className="sm:hidden">Back</span>
              </Button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-pink-500 rounded-lg flex items-center justify-center">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl sm:text-2xl font-bold gradient-text-brand">
                  CycleSync
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 max-w-2xl">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center space-x-2 sm:space-x-3 mb-3 sm:mb-4">
            <SettingsIcon className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
              Settings
            </h1>
          </div>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            Manage your account preferences and tracking settings.
          </p>
        </div>

        <div className="space-y-4 sm:space-y-6">
          {/* Dashboard Type Settings */}
          <Card className="floating-card dark:bg-gray-800/80 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Dashboard Type
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Choose what type of tracking dashboard you prefer.
              </p>

              <RadioGroup
                value={formData.trackingGoal}
                onValueChange={(value) => updateFormData("trackingGoal", value)}
                className="space-y-4"
              >
                <div className="flex items-center space-x-3 p-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl hover:border-primary transition-colors">
                  <RadioGroupItem
                    value="cycle_tracking"
                    id="cycle_tracking_settings"
                  />
                  <Label
                    htmlFor="cycle_tracking_settings"
                    className="flex-1 cursor-pointer"
                  >
                    <div className="font-medium dark:text-gray-100">
                      Basic Cycle Tracking
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Track your periods, mood, and symptoms only
                    </div>
                  </Label>
                </div>

                <div className="flex items-center space-x-3 p-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl hover:border-primary transition-colors">
                  <RadioGroupItem
                    value="pregnancy_planning"
                    id="pregnancy_planning_settings"
                  />
                  <Label
                    htmlFor="pregnancy_planning_settings"
                    className="flex-1 cursor-pointer"
                  >
                    <div className="font-medium dark:text-gray-100">
                      Pregnancy Planning
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Includes fertility insights, intercourse log, and fertile
                      window tracking
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Period Date Settings */}
          <Card className="floating-card dark:bg-gray-800/80 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Period Date
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Update the start date of your last period to improve
                predictions.
              </p>

              <div className="space-y-2">
                <Label htmlFor="lastPeriodDate">Last period start date</Label>
                <Input
                  id="lastPeriodDate"
                  type="date"
                  value={formData.lastPeriodDate}
                  onChange={(e) =>
                    updateFormData("lastPeriodDate", e.target.value)
                  }
                  className="max-w-xs"
                />
              </div>
            </CardContent>
          </Card>

          {/* Save Changes */}
          <Card className="floating-card dark:bg-gray-800/80 dark:border-gray-700">
            <CardContent className="pt-6">
              <Button
                onClick={handleSaveChanges}
                disabled={isLoading}
                className="w-full bg-pink-500 hover:bg-pink-600 text-white"
              >
                <Save className="w-4 h-4 mr-2" />
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </CardContent>
          </Card>

          <Separator className="my-8" />

          {/* Account Actions */}
          <Card className="floating-card border-red-200 dark:border-red-800">
            <CardHeader>
              <CardTitle className="text-red-600 dark:text-red-400">
                Account Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="w-full">
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will log you out of your account. You'll need to log
                      back in to access your data.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleLogout}>
                      Yes, logout
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
