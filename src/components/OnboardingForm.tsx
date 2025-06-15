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
    name: "",
    age: "",
    weight: "",
    cycleLength: "",
    periodLength: "",
    lastPeriodDate: "",
    trackingGoal: "" as "period_tracking" | "pregnancy_planning" | "",
    emailNotifications: true,
  });

  const updateFormData = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const isStepValid = (stepNumber: number): boolean => {
    switch (stepNumber) {
      case 1:
        return !!formData.name;
      case 2:
        return !!formData.trackingGoal;
      case 3:
        return !!(formData.age && formData.weight);
      case 4:
        return !!(formData.cycleLength && formData.periodLength);
      case 5:
        return !!formData.lastPeriodDate;
      case 6:
        return true; // Email notifications are optional
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (step < 6) {
      setStep(step + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    const profile: Omit<UserProfile, "id" | "createdAt" | "updatedAt"> = {
      name: formData.name,
      email: "", // Placeholder, will be overwritten in Onboarding.tsx
      age: parseInt(formData.age),
      weight: parseInt(formData.weight),
      cycleLength: parseInt(formData.cycleLength),
      periodLength: parseInt(formData.periodLength),
      lastPeriodDate: new Date(formData.lastPeriodDate),
      trackingGoal: formData.trackingGoal as "period_tracking" | "pregnancy_planning",
      emailNotifications: formData.emailNotifications,
    };
    onComplete(profile);
  };

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle className="text-center">
          {step === 1 && "What's your name?"}
          {step === 2 && "What's your goal?"}
          {step === 3 && "Tell us about your cycle"}
          {step === 4 && "When was your last period?"}
          {step === 5 && "Email notifications"}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Step 1: Name */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="flex items-center justify-center mb-6">
              <User className="w-12 h-12 text-primary" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Your name</Label>
              <Input
                id="name"
                placeholder="Enter your name"
                value={formData.name}
                onChange={(e) => updateFormData("name", e.target.value)}
              />
            </div>
          </div>
        )}

        {/* Step 2: Tracking Goal */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="flex items-center justify-center mb-6">
              <Target className="w-12 h-12 text-primary" />
            </div>
            <div className="space-y-4">
              <Label>What's your main goal?</Label>
              <RadioGroup
                value={formData.trackingGoal}
                onValueChange={(value) =>
                  updateFormData("trackingGoal", value)
                }
                className="space-y-3"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="period_tracking" id="period" />
                  <Label htmlFor="period">Track my period and cycle</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="pregnancy_planning" id="pregnancy" />
                  <Label htmlFor="pregnancy">Plan for pregnancy</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        )}

        {/* Step 3: Age and Weight */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="flex items-center justify-center mb-6">
              <User className="w-12 h-12 text-primary" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  min="10"
                  max="100"
                  placeholder="Enter your age"
                  value={formData.age}
                  onChange={(e) => updateFormData("age", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  min="20"
                  max="200"
                  placeholder="Enter your weight"
                  value={formData.weight}
                  onChange={(e) => updateFormData("weight", e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Cycle Details */}
        {step === 4 && (
          <div className="space-y-4">
            <div className="flex items-center justify-center mb-6">
              <Calendar className="w-12 h-12 text-primary" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cycleLength">Cycle length (days)</Label>
                <Select
                  value={formData.cycleLength}
                  onValueChange={(value) =>
                    updateFormData("cycleLength", value)
                  }
                >
                  <SelectTrigger id="cycleLength">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 10 }, (_, i) => i + 21).map((days) => (
                      <SelectItem key={days} value={days.toString()}>
                        {days} days
                      </SelectItem>
                    ))}
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
                  <SelectTrigger id="periodLength">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 10 }, (_, i) => i + 1).map((days) => (
                      <SelectItem key={days} value={days.toString()}>
                        {days} days
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Last Period */}
        {step === 5 && (
          <div className="space-y-4">
            <div className="flex items-center justify-center mb-6">
              <Calendar className="w-12 h-12 text-primary" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastPeriodDate">When did your last period start?</Label>
              <Input
                id="lastPeriodDate"
                type="date"
                value={formData.lastPeriodDate}
                onChange={(e) => updateFormData("lastPeriodDate", e.target.value)}
              />
            </div>
          </div>
        )}

        {/* Step 6: Email Notifications */}
        {step === 6 && (
          <div className="space-y-4">
            <div className="flex items-center justify-center mb-6">
              <Mail className="w-12 h-12 text-primary" />
            </div>
            <div className="space-y-4">
              <Label>Would you like to receive email notifications?</Label>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="emailNotifications"
                  checked={formData.emailNotifications}
                  onChange={(e) =>
                    updateFormData("emailNotifications", e.target.checked)
                  }
                  className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary"
                />
                <Label htmlFor="emailNotifications">
                  Send me reminders about my period and cycle
                </Label>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between pt-4">
          {step > 1 && (
            <Button
              variant="outline"
              onClick={() => setStep(step - 1)}
            >
              Back
            </Button>
          )}
          <Button
            onClick={handleNext}
            disabled={!isStepValid(step)}
            className={step === 1 ? "w-full" : ""}
          >
            {step === 6 ? "Complete" : "Next"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
