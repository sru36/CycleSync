import React from "react";
import { useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";
import { OnboardingForm } from "../components/OnboardingForm";
import type { UserProfile } from "../lib/types";
import { auth } from "../lib/auth";
import { toast } from "../components/ui/use-toast";

export default function Onboarding() {
  const navigate = useNavigate();
  const [isVerified, setIsVerified] = React.useState<boolean | null>(null);

  const handleComplete = async (
    profile: Omit<UserProfile, "id" | "createdAt" | "updatedAt">,
  ) => {
    try {
      const user = await auth.getCurrentUser();
      if (!user) {
        navigate("/auth");
        return;
      }

      const userProfile: UserProfile = {
        id: user.id,
        email: user.email,
        ...profile,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await auth.createProfile(user.id, userProfile);
      toast({
        title: "Profile created",
        description: "Your profile has been created successfully.",
      });

      navigate("/dashboard");
    } catch (error: any) {
      if (error?.message?.toLowerCase().includes("duplicate") || error?.message?.toLowerCase().includes("already exists")) {
        toast({
          title: "Profile Exists",
          description: "A profile for this user already exists. Please log in.",
          variant: "destructive",
        });
      } else {
        console.error("Error creating profile:", error);
        toast({
          title: "Error",
          description: "Failed to create your profile. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  React.useEffect(() => {
    (async () => {
      const user = await auth.getCurrentUser();
      if (!user || (!user.email_confirmed_at && !user.confirmed_at)) {
        toast({
          title: "Email Not Verified",
          description: "Please verify your email before continuing onboarding.",
          variant: "destructive",
        });
        setIsVerified(false);
        navigate("/auth");
      } else {
        setIsVerified(true);
      }
    })();
  }, [navigate]);

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

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-period rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Welcome to CycleSync</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Let's set up your profile to get started
          </p>
        </div>

        <OnboardingForm onComplete={handleComplete} />
      </div>
    </div>
  );
}
