import React from "react";
import { format, addDays } from "date-fns";
import {
  TrendingUp,
  Calendar,
  Heart,
  Target,
  Lightbulb,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Progress } from "./ui/progress";
import type { UserProfile, PeriodPrediction } from "../lib/types";

interface FertilityInsightsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  prediction: PeriodPrediction;
}

export function FertilityInsightsDialog({
  isOpen,
  onClose,
  userProfile,
  prediction,
}: FertilityInsightsDialogProps) {
  const isPregnancyPlanning = userProfile.trackingGoal === "pregnancy_planning";

  // Calculate fertility insights
  const daysToOvulation = Math.ceil(
    (prediction.nextOvulationDate.getTime() - new Date().getTime()) /
      (1000 * 60 * 60 * 24),
  );

  const fertilityScore = Math.max(0, 100 - Math.abs(daysToOvulation) * 20);

  const getFertilityPhase = () => {
    if (daysToOvulation <= 0 && daysToOvulation >= -1) return "peak";
    if (daysToOvulation <= 2 && daysToOvulation >= -2) return "high";
    if (daysToOvulation <= 5 && daysToOvulation >= -3) return "moderate";
    return "low";
  };

  const fertilityPhase = getFertilityPhase();

  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case "peak":
        return "text-red-600 dark:text-red-400";
      case "high":
        return "text-orange-600 dark:text-orange-400";
      case "moderate":
        return "text-yellow-600 dark:text-yellow-400";
      default:
        return "text-green-600 dark:text-green-400";
    }
  };

  const getPhaseBackground = (phase: string) => {
    switch (phase) {
      case "peak":
        return "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800";
      case "high":
        return "bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800";
      case "moderate":
        return "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800";
      default:
        return "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800";
    }
  };

  const getFertilityTips = () => {
    if (!isPregnancyPlanning) {
      return [
        "Track your mood and symptoms for better cycle understanding",
        "Maintain a healthy diet rich in vitamins and minerals",
        "Stay hydrated and get adequate sleep",
        "Exercise regularly but avoid overexertion during your period",
      ];
    }

    switch (fertilityPhase) {
      case "peak":
        return [
          "This is your most fertile time! Consider intimate moments today",
          "Eat antioxidant-rich foods like berries and leafy greens",
          "Stay hydrated and maintain a healthy BMI",
          "Avoid excessive stress and get quality sleep",
        ];
      case "high":
        return [
          "Your fertility window is open - great time for conception",
          "Take folic acid supplements if trying to conceive",
          "Limit caffeine and alcohol consumption",
          "Consider using ovulation predictor kits for precise timing",
        ];
      case "moderate":
        return [
          "Fertility is moderate - still a good time to try",
          "Focus on a balanced diet with protein and healthy fats",
          "Light exercise like yoga can help with circulation",
          "Track cervical mucus changes for better timing",
        ];
      default:
        return [
          "Low fertility period - focus on overall health",
          "Take prenatal vitamins if planning pregnancy",
          "Plan romantic activities for your upcoming fertile window",
          "Use this time to reduce stress and practice self-care",
        ];
    }
  };

  const getRecommendations = () => {
    const baseRecommendations = [
      {
        title: "Nutrition",
        icon: <Heart className="w-4 h-4" />,
        items: [
          "Eat folate-rich foods",
          "Take prenatal vitamins",
          "Stay hydrated",
        ],
      },
      {
        title: "Lifestyle",
        icon: <Target className="w-4 h-4" />,
        items: ["Regular exercise", "Adequate sleep", "Stress management"],
      },
      {
        title: "Timing",
        icon: <Calendar className="w-4 h-4" />,
        items: [
          "Track ovulation",
          "Monitor cervical mucus",
          "Use fertility apps",
        ],
      },
    ];

    if (isPregnancyPlanning) {
      baseRecommendations.push({
        title: "Conception",
        icon: <CheckCircle className="w-4 h-4" />,
        items: [
          "Regular intimate moments",
          "Avoid smoking/alcohol",
          "Consult healthcare provider",
        ],
      });
    }

    return baseRecommendations;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl mx-4 sm:mx-auto max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base sm:text-lg">
            <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
            Fertility Insights
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 sm:space-y-6">
          {/* Current Fertility Status */}
          <Card className={`border-2 ${getPhaseBackground(fertilityPhase)}`}>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between">
                <span className={`text-lg ${getPhaseColor(fertilityPhase)}`}>
                  Current Fertility: {fertilityPhase.toUpperCase()}
                </span>
                <Badge
                  variant="outline"
                  className={getPhaseColor(fertilityPhase)}
                >
                  {fertilityScore}% Score
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Progress value={fertilityScore} className="h-3" />
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">
                      Days to Ovulation:
                    </span>
                    <div className="font-semibold">
                      {daysToOvulation > 0
                        ? `${daysToOvulation} days`
                        : daysToOvulation === 0
                          ? "Today!"
                          : `${Math.abs(daysToOvulation)} days ago`}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">
                      Cycle Day:
                    </span>
                    <div className="font-semibold">{prediction.cycleDay}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Fertility Calendar */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Fertility Window
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <div>
                    <div className="font-medium text-red-800 dark:text-red-300">
                      Peak Fertility
                    </div>
                    <div className="text-sm text-red-600 dark:text-red-400">
                      {format(prediction.nextOvulationDate, "EEEE, MMM d")}
                    </div>
                  </div>
                  <div className="text-2xl">🎯</div>
                </div>

                <div className="flex justify-between items-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                  <div>
                    <div className="font-medium text-orange-800 dark:text-orange-300">
                      Fertile Window
                    </div>
                    <div className="text-sm text-orange-600 dark:text-orange-400">
                      {format(prediction.fertileDaysStart, "MMM d")} -{" "}
                      {format(prediction.fertileDaysEnd, "MMM d")}
                    </div>
                  </div>
                  <div className="text-2xl">🌟</div>
                </div>

                <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div>
                    <div className="font-medium text-blue-800 dark:text-blue-300">
                      Next Period
                    </div>
                    <div className="text-sm text-blue-600 dark:text-blue-400">
                      {format(prediction.nextPeriodDate, "EEEE, MMM d")}
                    </div>
                  </div>
                  <div className="text-2xl">📅</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Personalized Tips */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-yellow-500" />
                Personalized Tips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {getFertilityTips().map((tip, index) => (
                  <div key={index} className="flex items-start gap-3 p-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {tip}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recommendations */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {getRecommendations().map((category, index) => (
              <Card key={index}>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    {category.icon}
                    {category.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {category.items.map((item, itemIndex) => (
                      <li
                        key={itemIndex}
                        className="flex items-center gap-2 text-sm"
                      >
                        <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />
                        <span className="text-gray-700 dark:text-gray-300">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Disclaimer */}
          <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <AlertCircle className="w-5 h-5 text-gray-500 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <p className="font-medium mb-1">Important Note:</p>
              <p>
                These insights are based on general cycle patterns and should
                not replace medical advice. Consult with a healthcare provider
                for personalized fertility guidance.
              </p>
            </div>
          </div>

          {/* Close Button */}
          <Button onClick={onClose} className="w-full">
            Close Insights
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
