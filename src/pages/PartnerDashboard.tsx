import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Heart,
  Calendar as CalendarIcon,
  ArrowLeft,
  Gift,
  Coffee,
  Settings,
  Check,
  AlertCircle,
  Unlink,
  ExternalLink,
  ShoppingCart,
} from "lucide-react";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
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
import { ThemeToggle } from "../components/ThemeToggle";
import { Calendar } from "../components/Calendar";
import { toast } from "../components/ui/use-toast";
import type { UserProfile } from "../lib/types";
import { calculateNextPeriod } from "../lib/cycle-calculations";

const CARE_SUGGESTIONS = [
  "Buy her favorite chocolates 🍫",
  "Prepare a warm heating pad 🔥",
  "Get her favorite comfort snacks 🍿",
  "Plan a cozy movie night 🎬",
  "Surprise her with flowers 🌸",
  "Make her favorite tea ☕",
  "Give her extra hugs today 🤗",
  "Order her favorite takeout 🍕",
  "Run a warm bath for her 🛁",
  "Be extra patient and understanding 💝",
  "Bring home her favorite ice cream 🍦",
  "Let her choose tonight's activities 🎯",
];

const MOOD_SUGGESTIONS = [
  {
    phase: "pms",
    mood: "She might be feeling emotional",
    color: "bg-purple-100 dark:bg-purple-900/30",
    textColor: "text-purple-800 dark:text-purple-300",
  },
  {
    phase: "period",
    mood: "She might be experiencing discomfort",
    color: "bg-red-100 dark:bg-red-900/30",
    textColor: "text-red-800 dark:text-red-300",
  },
  {
    phase: "follicular",
    mood: "She's likely feeling energetic",
    color: "bg-green-100 dark:bg-green-900/30",
    textColor: "text-green-800 dark:text-green-300",
  },
  {
    phase: "ovulation",
    mood: "She's probably feeling confident",
    color: "bg-blue-100 dark:bg-blue-900/30",
    textColor: "text-blue-800 dark:text-blue-300",
  },
  {
    phase: "luteal",
    mood: "She might need extra support",
    color: "bg-orange-100 dark:bg-orange-900/30",
    textColor: "text-orange-800 dark:text-orange-300",
  },
];

export default function PartnerDashboard() {
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [currentSuggestion, setCurrentSuggestion] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [showReminderSettings, setShowReminderSettings] = useState(false);
  const [showUnlinkDialog, setShowUnlinkDialog] = useState(false);
  const [showFoodOrderDialog, setShowFoodOrderDialog] = useState(false);
  const [partnerEmail, setPartnerEmail] = useState("");
  const [reminderSettings, setReminderSettings] = useState({
    sendPeriodReminders: true,
    sendMoodReminders: true,
    reminderDaysBeforePeriod: 2,
  });
  const [emailSaved, setEmailSaved] = useState(false);

  useEffect(() => {
    // Check if partner is connected
    const partnerConnected = localStorage.getItem("partnerConnected");
    if (!partnerConnected) {
      navigate("/partner-sync");
      return;
    }

    // Load user profile
    const stored = localStorage.getItem("userProfile");
    if (stored) {
      const profile = JSON.parse(stored);
      profile.lastPeriodDate = new Date(profile.lastPeriodDate);
      setUserProfile(profile);
    }

    // Load partner reminder settings
    const savedSettings = localStorage.getItem("partnerReminderSettings");
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      setPartnerEmail(settings.partnerEmail || "");
      setReminderSettings({
        sendPeriodReminders: settings.sendPeriodReminders ?? true,
        sendMoodReminders: settings.sendMoodReminders ?? true,
        reminderDaysBeforePeriod: settings.reminderDaysBeforePeriod ?? 2,
      });
    }
  }, [navigate]);

  const handleSaveReminderSettings = () => {
    const settings = {
      partnerEmail,
      ...reminderSettings,
    };

    localStorage.setItem("partnerReminderSettings", JSON.stringify(settings));
    setEmailSaved(true);
    setTimeout(() => setEmailSaved(false), 3000);
    setShowReminderSettings(false);

    toast({
      title: "Settings saved",
      description: "Email reminder settings have been updated.",
    });
  };

  const handleUnlinkPartner = () => {
    localStorage.removeItem("partnerConnected");
    localStorage.removeItem("partnerReminderSettings");
    toast({
      title: "Partner unlinked",
      description: "You have been disconnected from the partner dashboard.",
    });
    navigate("/partner-sync");
  };

  const handleOrderFood = (platform: "swiggy" | "zomato") => {
    const urls = {
      swiggy: "https://www.swiggy.com",
      zomato: "https://www.zomato.com",
    };

    window.open(urls[platform], "_blank");
    setShowFoodOrderDialog(false);

    toast({
      title: "Opening food delivery app",
      description: `Redirecting to ${platform} to order comfort food.`,
    });
  };

  const handleSendChocolates = () => {
    window.open("https://blinkit.com/search?q=chocolates", "_blank");
    toast({
      title: "Opening Blinkit",
      description: "Redirecting to Blinkit to order chocolates.",
    });
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  useEffect(() => {
    // Animate care suggestions
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentSuggestion((prev) => (prev + 1) % CARE_SUGGESTIONS.length);
        setIsVisible(true);
      }, 300);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  if (!userProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading partner dashboard...</p>
        </div>
      </div>
    );
  }

  const prediction = calculateNextPeriod(userProfile);
  const isPeriodSoon = prediction.daysUntilPeriod <= 2;
  const isPeriodNow = prediction.daysUntilPeriod <= 0;

  const currentMoodSuggestion =
    MOOD_SUGGESTIONS.find((s) => s.phase === prediction.phase) ||
    MOOD_SUGGESTIONS[0];

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm border-b border-white/20 dark:border-gray-700/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/partner-sync")}
                className="p-2"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-purple-500">
                  Partner Dashboard
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowUnlinkDialog(true)}
                className="text-red-500 hover:text-red-700"
              >
                <Settings className="w-4 h-4" />
              </Button>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </nav>

      {/* Animated Care Suggestions Banner */}
      {(isPeriodSoon || isPeriodNow) && (
        <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 text-white py-4 shadow-lg">
          <div className="container mx-auto px-4 text-center">
            <div
              className={`transition-opacity duration-300 ${isVisible ? "opacity-100" : "opacity-0"}`}
            >
              <div className="flex items-center justify-center gap-3">
                <Gift className="w-6 h-6 animate-bounce" />
                <span className="text-lg font-medium">
                  {CARE_SUGGESTIONS[currentSuggestion]}
                </span>
                <Gift className="w-6 h-6 animate-bounce" />
              </div>
            </div>
            <p className="text-pink-100 text-sm mt-1">
              {isPeriodNow
                ? "Her period started today"
                : `Her period starts in ${prediction.daysUntilPeriod} days`}
            </p>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Welcome Section */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Welcome, Partner! 💜
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            Here's what you need to know to support your partner
          </p>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {/* Current Status */}
          <Card className="floating-card dark:bg-gray-800/80 dark:border-gray-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <CalendarIcon className="w-5 h-5" />
                Current Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Cycle Day
                  </span>
                  <Badge variant="outline">{prediction.cycleDay}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Current Phase
                  </span>
                  <Badge
                    className="capitalize"
                    style={{
                      backgroundColor:
                        prediction.phase === "menstrual"
                          ? "#FF6B8A"
                          : prediction.phase === "follicular"
                            ? "#A8E6CF"
                            : prediction.phase === "ovulation"
                              ? "#3B82F6"
                              : "#C4A3FF",
                      color: "white",
                    }}
                  >
                    {prediction.phase}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Period in
                  </span>
                  <span className="font-semibold text-period">
                    {prediction.daysUntilPeriod} days
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Mood Insights */}
          <Card className="floating-card dark:bg-gray-800/80 dark:border-gray-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Heart className="w-5 h-5" />
                Mood Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className={`p-4 rounded-lg ${currentMoodSuggestion.color} border-l-4 border-current`}
              >
                <div
                  className={`font-medium ${currentMoodSuggestion.textColor} mb-2`}
                >
                  Today's Insight
                </div>
                <p className={`text-sm ${currentMoodSuggestion.textColor}`}>
                  {currentMoodSuggestion.mood}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="floating-card dark:bg-gray-800/80 dark:border-gray-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Gift className="w-5 h-5" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                className="w-full justify-start text-left"
                variant="outline"
                size="sm"
                onClick={() => setShowFoodOrderDialog(true)}
              >
                <Coffee className="w-4 h-4 mr-2" />
                Order comfort food
              </Button>
              <Button
                className="w-full justify-start text-left"
                variant="outline"
                size="sm"
                onClick={handleSendChocolates}
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Send chocolates
              </Button>
              <Button
                className="w-full justify-start text-left"
                variant="outline"
                size="sm"
                onClick={() => setShowReminderSettings(true)}
              >
                <CalendarIcon className="w-4 h-4 mr-2" />
                Email Reminders
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Calendar */}
          <div className="lg:col-span-2">
            <Calendar userProfile={userProfile} selectedDate={new Date()} />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Care Tips */}
            <Card className="floating-card dark:bg-gray-800/80 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-lg">Care Tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isPeriodSoon || isPeriodNow ? (
                  <div className="space-y-3">
                    <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border-l-4 border-red-400">
                      <h4 className="font-medium text-red-800 dark:text-red-300 mb-1">
                        Period Care
                      </h4>
                      <ul className="text-sm text-red-700 dark:text-red-400 space-y-1">
                        <li>• Keep heating pads ready</li>
                        <li>• Stock up on comfort snacks</li>
                        <li>• Be extra patient</li>
                        <li>• Offer warm drinks</li>
                      </ul>
                    </div>
                  </div>
                ) : prediction.phase === "ovulation" ? (
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-400">
                    <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-1">
                      Ovulation Phase
                    </h4>
                    <p className="text-sm text-blue-700 dark:text-blue-400">
                      She's likely feeling confident and energetic. Great time
                      for activities together!
                    </p>
                  </div>
                ) : prediction.phase === "follicular" ? (
                  <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border-l-4 border-green-400">
                    <h4 className="font-medium text-green-800 dark:text-green-300 mb-1">
                      Follicular Phase
                    </h4>
                    <p className="text-sm text-green-700 dark:text-green-400">
                      High energy time! She might enjoy trying new activities or
                      being more social.
                    </p>
                  </div>
                ) : (
                  <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border-l-4 border-purple-400">
                    <h4 className="font-medium text-purple-800 dark:text-purple-300 mb-1">
                      Luteal Phase
                    </h4>
                    <p className="text-sm text-purple-700 dark:text-purple-400">
                      She might need extra emotional support. PMS symptoms may
                      start appearing.
                    </p>
                  </div>
                )}

                <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                  <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                    General Tips
                  </h4>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <li>• Listen without trying to "fix" everything</li>
                    <li>• Ask how you can help</li>
                    <li>• Respect her need for space when needed</li>
                    <li>• Celebrate the good days together</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Events */}
            <Card className="floating-card dark:bg-gray-800/80 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-lg">Upcoming</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <div>
                    <div className="font-medium text-red-800 dark:text-red-300">
                      Next Period
                    </div>
                    <div className="text-sm text-red-600 dark:text-red-400">
                      {new Intl.DateTimeFormat("en-US", {
                        month: "long",
                        day: "numeric",
                      }).format(prediction.nextPeriodDate)}
                    </div>
                  </div>
                  <Badge className="bg-red-500 text-white">
                    {prediction.daysUntilPeriod} days
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div>
                    <div className="font-medium text-blue-800 dark:text-blue-300">
                      Next Ovulation
                    </div>
                    <div className="text-sm text-blue-600 dark:text-blue-400">
                      {new Intl.DateTimeFormat("en-US", {
                        month: "long",
                        day: "numeric",
                      }).format(prediction.nextOvulationDate)}
                    </div>
                  </div>
                  <Badge className="bg-blue-500 text-white">
                    {Math.ceil(
                      (prediction.nextOvulationDate.getTime() -
                        new Date().getTime()) /
                        (1000 * 60 * 60 * 24),
                    )}{" "}
                    days
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Food Order Dialog */}
      <Dialog open={showFoodOrderDialog} onOpenChange={setShowFoodOrderDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Coffee className="w-5 h-5 text-orange-500" />
              Order Comfort Food
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-gray-600 dark:text-gray-400">
              Choose your preferred food delivery platform:
            </p>
            <div className="grid grid-cols-2 gap-4">
              <Button
                onClick={() => handleOrderFood("swiggy")}
                className="h-20 bg-orange-500 hover:bg-orange-600 text-white flex flex-col items-center gap-2"
              >
                <Coffee className="w-6 h-6" />
                <span>Swiggy</span>
                <ExternalLink className="w-3 h-3" />
              </Button>
              <Button
                onClick={() => handleOrderFood("zomato")}
                className="h-20 bg-red-500 hover:bg-red-600 text-white flex flex-col items-center gap-2"
              >
                <Coffee className="w-6 h-6" />
                <span>Zomato</span>
                <ExternalLink className="w-3 h-3" />
              </Button>
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFoodOrderDialog(false)}
              className="w-full"
            >
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Unlink Partner Dialog */}
      <AlertDialog open={showUnlinkDialog} onOpenChange={setShowUnlinkDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Unlink className="w-5 h-5 text-red-500" />
              Unlink Partner Dashboard
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to disconnect from the partner dashboard?
              This will remove your access to cycle information and disable
              email reminders.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleUnlinkPartner}
              className="bg-red-600 hover:bg-red-700"
            >
              Yes, Unlink
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Email Reminder Settings Modal */}
      {showReminderSettings && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-lg dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5 text-blue-500" />
                  Email Reminder Settings
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowReminderSettings(false)}
                  className="p-1"
                >
                  ×
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Partner Email Input */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  Your Email Address
                </label>
                <div className="relative">
                  <CalendarIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="email"
                    placeholder="your.email@example.com"
                    value={partnerEmail}
                    onChange={(e) => setPartnerEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  We'll send reminders to this email address
                </p>
              </div>

              {/* Reminder Types */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900 dark:text-gray-100">
                  What would you like to be reminded about?
                </h4>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900 dark:text-gray-100">
                        Period Reminders
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Get notified before her period starts
                      </div>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={reminderSettings.sendPeriodReminders}
                        onChange={(e) =>
                          setReminderSettings((prev) => ({
                            ...prev,
                            sendPeriodReminders: e.target.checked,
                          }))
                        }
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900 dark:text-gray-100">
                        Mood Insights
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Tips based on her current cycle phase
                      </div>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={reminderSettings.sendMoodReminders}
                        onChange={(e) =>
                          setReminderSettings((prev) => ({
                            ...prev,
                            sendMoodReminders: e.target.checked,
                          }))
                        }
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Timing Settings */}
              {reminderSettings.sendPeriodReminders && (
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    Send period reminders
                  </label>
                  <select
                    value={reminderSettings.reminderDaysBeforePeriod}
                    onChange={(e) =>
                      setReminderSettings((prev) => ({
                        ...prev,
                        reminderDaysBeforePeriod: parseInt(e.target.value),
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value={1}>1 day before</option>
                    <option value={2}>2 days before</option>
                    <option value={3}>3 days before</option>
                  </select>
                </div>
              )}

              {/* Example Email Preview */}
              {partnerEmail && validateEmail(partnerEmail) && (
                <div className="p-4 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <h5 className="font-medium text-blue-900 dark:text-blue-300 mb-2">
                    📧 Example Email Preview:
                  </h5>
                  <div className="text-sm text-blue-700 dark:text-blue-400 space-y-1">
                    <p>
                      <strong>Subject:</strong> 💝 Her period starts in 2 days
                    </p>
                    <p>
                      <strong>Preview:</strong> "Hey! Just a friendly reminder
                      that it's time to stock up on chocolates and heating
                      pads..."
                    </p>
                  </div>
                </div>
              )}

              {/* Save Button */}
              <div className="flex gap-3">
                <Button
                  onClick={() => setShowReminderSettings(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveReminderSettings}
                  disabled={!partnerEmail || !validateEmail(partnerEmail)}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:opacity-90 text-white"
                >
                  {emailSaved ? (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Saved!
                    </>
                  ) : (
                    "Save Settings"
                  )}
                </Button>
              </div>

              {/* Privacy Note */}
              <div className="text-center">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  🔒 Your email is secure and only used for cycle reminders
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
