import React, { useState } from "react";
import { Calendar, Heart, Target, User, Mail } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { cn } from "../lib/utils";
import type { UserProfile } from "../lib/types";

interface OnboardingFormProps {
  onComplete: (
    profile: Omit<UserProfile, "id" | "createdAt" | "updatedAt">,
  ) => void;
  className?: string;
}

export function OnboardingForm({ onComplete, className }: OnboardingFormProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    age: "",
    weight: "",
    cycleLength: "",
    periodLength: "",
    lastPeriodDate: "",
    trackingGoal: "" as "cycle_tracking" | "pregnancy_planning" | "",
    email: "",
    emailReminders: false,
  });

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const isStepValid = (stepNumber: number): boolean => {
    switch (stepNumber) {
      case 1:
        return !!formData.trackingGoal;
      case 2:
        return !!(formData.age && formData.weight);
      case 3:
        return !!(formData.cycleLength && formData.periodLength);
      case 4:
        return !!formData.lastPeriodDate;
      case 5:
        return true; // Email is optional
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (step < 5) {
      setStep(step + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    const profile: Omit<UserProfile, "id" | "createdAt" | "updatedAt"> = {
      age: parseInt(formData.age),
      weight: parseFloat(formData.weight),
      cycleLength: parseInt(formData.cycleLength),
      periodLength: parseInt(formData.periodLength),
      lastPeriodDate: new Date(formData.lastPeriodDate),
      trackingGoal: formData.trackingGoal,
      email: formData.email,
      emailReminders: formData.emailReminders,
    };
    onComplete(profile);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <Target className="w-12 h-12 text-primary dark:text-white mx-auto" />
              <h2 className="text-xl sm:text-2xl font-bold dark:text-gray-100">
                What's your goal?
              </h2>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                Choose what you'd like to track
              </p>
            </div>

            <RadioGroup
              value={formData.trackingGoal}
              onValueChange={(value) => updateFormData("trackingGoal", value)}
              className="space-y-4"
            >
              <div className="flex items-center space-x-3 p-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl hover:border-primary transition-colors dark:hover:border-primary">
                <RadioGroupItem value="cycle_tracking" id="cycle_tracking" />
                <Label
                  htmlFor="cycle_tracking"
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

              <div className="flex items-center space-x-3 p-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl hover:border-primary transition-colors dark:hover:border-primary">
                <RadioGroupItem
                  value="pregnancy_planning"
                  id="pregnancy_planning"
                />
                <Label
                  htmlFor="pregnancy_planning"
                  className="flex-1 cursor-pointer"
                >
                  <div className="font-medium dark:text-gray-100">
                    Planning to get pregnant
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Get fertility insights, intercourse log, and highlighted
                    fertile windows
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <User className="w-12 h-12 text-primary dark:text-white mx-auto" />
              <h2 className="text-2xl font-bold dark:text-gray-100">
                Tell us about yourself
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                This helps us provide better predictions
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="25"
                  value={formData.age}
                  onChange={(e) => updateFormData("age", e.target.value)}
                  className="text-center text-lg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  placeholder="60"
                  value={formData.weight}
                  onChange={(e) => updateFormData("weight", e.target.value)}
                  className="text-center text-lg"
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <Heart className="w-12 h-12 text-primary dark:text-white mx-auto" />
              <h2 className="text-2xl font-bold dark:text-gray-100">
                Your cycle details
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Help us understand your typical cycle
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cycleLength">Typical cycle length (days)</Label>
                <Select
                  value={formData.cycleLength}
                  onValueChange={(value) =>
                    updateFormData("cycleLength", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select cycle length" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="26">26 days</SelectItem>
                    <SelectItem value="27">27 days</SelectItem>
                    <SelectItem value="28">28 days (average)</SelectItem>
                    <SelectItem value="29">29 days</SelectItem>
                    <SelectItem value="30">30 days</SelectItem>
                    <SelectItem value="31">31 days</SelectItem>
                    <SelectItem value="32">32 days</SelectItem>
                    <SelectItem value="35">35+ days</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="periodLength">Period length (days)</Label>
                <Select
                  value={formData.periodLength}
                  onValueChange={(value) =>
                    updateFormData("periodLength", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select period length" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3">3 days</SelectItem>
                    <SelectItem value="4">4 days</SelectItem>
                    <SelectItem value="5">5 days (average)</SelectItem>
                    <SelectItem value="6">6 days</SelectItem>
                    <SelectItem value="7">7 days</SelectItem>
                    <SelectItem value="8">8+ days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <Calendar className="w-12 h-12 text-primary dark:text-white mx-auto" />
              <h2 className="text-2xl font-bold dark:text-gray-100">
                When was your last period?
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                First day of your most recent period
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastPeriodDate">Last period start date</Label>
              <Input
                id="lastPeriodDate"
                type="date"
                value={formData.lastPeriodDate}
                onChange={(e) =>
                  updateFormData("lastPeriodDate", e.target.value)
                }
                className="text-center text-lg"
              />
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <Mail className="w-12 h-12 text-primary dark:text-white mx-auto" />
              <h2 className="text-2xl font-bold dark:text-gray-100">
                Email Reminders
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Get helpful notifications about your cycle (optional)
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address (Optional)</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={formData.email}
                  onChange={(e) => updateFormData("email", e.target.value)}
                  className="text-center text-lg"
                />
              </div>

              {formData.email && (
                <div className="flex items-center space-x-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                  <input
                    type="checkbox"
                    id="emailReminders"
                    checked={formData.emailReminders}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        emailReminders: e.target.checked,
                      }))
                    }
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                  />
                  <Label
                    htmlFor="emailReminders"
                    className="flex-1 cursor-pointer"
                  >
                    <div className="font-medium text-blue-900 dark:text-blue-100">
                      Enable Email Reminders
                    </div>
                    <div className="text-sm text-blue-700 dark:text-blue-300">
                      Period predictions, ovulation alerts, and helpful tips
                    </div>
                  </Label>
                </div>
              )}

              <div className="text-center text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                🔒 Your email is secure and will only be used for cycle
                notifications. You can change these settings anytime.
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card
      className={cn(
        "w-full max-w-md mx-auto dark:bg-gray-800 dark:border-gray-700 mx-4 sm:mx-auto",
        className,
      )}
    >
      <CardHeader className="text-center">
        <div className="flex justify-center space-x-1 sm:space-x-2 mb-3 sm:mb-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className={cn(
                "w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300",
                i <= step ? "bg-primary" : "bg-gray-200 dark:bg-gray-600",
              )}
            />
          ))}
        </div>
        <CardTitle className="text-base sm:text-lg">Step {step} of 5</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4 sm:space-y-6 p-4 sm:p-6">
        {renderStep()}

        <div className="flex gap-2 sm:gap-3 pt-2 sm:pt-4">
          {step > 1 && (
            <Button
              variant="outline"
              onClick={() => setStep(step - 1)}
              className="flex-1"
            >
              Back
            </Button>
          )}
          <Button
            onClick={handleNext}
            disabled={!isStepValid(step)}
            className={cn(
              "flex-1 font-semibold",
              !isStepValid(step)
                ? "bg-gray-300 hover:bg-gray-300 text-gray-500 cursor-not-allowed"
                : "btn-gradient-pink text-white",
            )}
          >
            {step === 5 ? "Complete" : "Next"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
