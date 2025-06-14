import React from "react";
import { useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";
import { OnboardingForm } from "../components/OnboardingForm";
import type { UserProfile } from "../lib/types";

export default function Onboarding() {
  const navigate = useNavigate();

  const handleComplete = (
    profile: Omit<UserProfile, "id" | "createdAt" | "updatedAt">,
  ) => {
    // In a real app, you would save this to your backend/database
    const userProfile: UserProfile = {
      id: "user-" + Date.now(),
      ...profile,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Store in localStorage for demo purposes
    localStorage.setItem("userProfile", JSON.stringify(userProfile));

    // Navigate to dashboard
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="text-center mb-6 sm:mb-8">
        <div className="flex items-center justify-center space-x-2 mb-3 sm:mb-4">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-period rounded-xl flex items-center justify-center">
            <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <span className="text-xl sm:text-2xl font-bold gradient-text-brand">
            CycleSync
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Let's get you set up
        </h1>
        <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 px-4">
          Tell us about yourself so we can provide personalized insights
        </p>
      </div>

      {/* Onboarding Form */}
      <OnboardingForm onComplete={handleComplete} />

      {/* Privacy Note */}
      <div className="mt-6 sm:mt-8 text-center text-xs sm:text-sm text-gray-500 dark:text-gray-400 max-w-md px-4">
        <p>
          🔒 Your personal health information is encrypted and completely
          private. We never share your data with third parties.
        </p>
      </div>
    </div>
  );
}
