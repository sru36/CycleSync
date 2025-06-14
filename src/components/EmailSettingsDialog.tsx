import React, { useState, useEffect } from "react";
import { Mail, Check, X, Bell, BellOff } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { toast } from "./ui/use-toast";

interface EmailSettingsDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function EmailSettingsDialog({
  isOpen,
  onClose,
}: EmailSettingsDialogProps) {
  const [emailSettings, setEmailSettings] = useState({
    isSetup: false,
    email: "",
    periodReminders: true,
    ovulationReminders: true,
    moodReminders: false,
    partnerNotifications: false,
    reminderDays: 2,
  });

  useEffect(() => {
    // Load email settings from localStorage
    const stored = localStorage.getItem("emailSettings");
    if (stored) {
      const settings = JSON.parse(stored);
      setEmailSettings(settings);
    } else {
      // Check if email was set during onboarding
      const userProfile = localStorage.getItem("userProfile");
      if (userProfile) {
        const profile = JSON.parse(userProfile);
        setEmailSettings((prev) => ({
          ...prev,
          isSetup: !!profile.email,
          email: profile.email || "",
        }));
      }
    }
  }, [isOpen]);

  const handleSaveSettings = () => {
    localStorage.setItem("emailSettings", JSON.stringify(emailSettings));
    toast({
      title: "Settings saved",
      description: "Your email notification preferences have been updated.",
    });
    onClose();
  };

  const handleToggleSetting = (key: keyof typeof emailSettings) => {
    setEmailSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-4 sm:mx-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
            Email Settings
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 sm:space-y-6">
          {/* Setup Status */}
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center gap-3">
              {emailSettings.isSetup ? (
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                  <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
              ) : (
                <div className="w-10 h-10 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
                  <X className="w-5 h-5 text-red-600 dark:text-red-400" />
                </div>
              )}
              <div>
                <h3 className="font-medium text-gray-900 dark:text-gray-100">
                  Email Reminders
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {emailSettings.isSetup
                    ? `Set up for ${emailSettings.email}`
                    : "Not set up yet"}
                </p>
              </div>
            </div>
            {emailSettings.isSetup ? (
              <Bell className="w-5 h-5 text-green-500" />
            ) : (
              <BellOff className="w-5 h-5 text-gray-400" />
            )}
          </div>

          {!emailSettings.isSetup ? (
            /* Setup Email */
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={emailSettings.email}
                  onChange={(e) =>
                    setEmailSettings((prev) => ({
                      ...prev,
                      email: e.target.value,
                      isSetup: !!e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                We'll send you helpful reminders about your cycle
              </p>
            </div>
          ) : (
            /* Email Notification Preferences */
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900 dark:text-gray-100">
                Notification Preferences
              </h4>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="period-reminders">Period Reminders</Label>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Get notified 2 days before your period
                    </p>
                  </div>
                  <Switch
                    id="period-reminders"
                    checked={emailSettings.periodReminders}
                    onCheckedChange={() =>
                      handleToggleSetting("periodReminders")
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="ovulation-reminders">
                      Ovulation Reminders
                    </Label>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Get notified during your fertile window
                    </p>
                  </div>
                  <Switch
                    id="ovulation-reminders"
                    checked={emailSettings.ovulationReminders}
                    onCheckedChange={() =>
                      handleToggleSetting("ovulationReminders")
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="mood-reminders">Mood Check-ins</Label>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Weekly mood tracking reminders
                    </p>
                  </div>
                  <Switch
                    id="mood-reminders"
                    checked={emailSettings.moodReminders}
                    onCheckedChange={() => handleToggleSetting("moodReminders")}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="partner-notifications">
                      Partner Notifications
                    </Label>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Share updates with connected partner
                    </p>
                  </div>
                  <Switch
                    id="partner-notifications"
                    checked={emailSettings.partnerNotifications}
                    onCheckedChange={() =>
                      handleToggleSetting("partnerNotifications")
                    }
                  />
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button
              onClick={handleSaveSettings}
              className="flex-1 bg-gradient-period hover:opacity-90 text-white"
            >
              Save Settings
            </Button>
          </div>

          {/* Privacy Note */}
          <p className="text-xs text-center text-gray-500 dark:text-gray-400">
            🔒 Your email is secure and only used for cycle notifications
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
