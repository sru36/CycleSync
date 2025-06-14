import React from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, Heart, TrendingUp, Users, Mail, Shield } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { ThemeToggle } from "../components/ThemeToggle";

export default function Index() {
  const navigate = useNavigate();

  const features = [
    {
      icon: Calendar,
      title: "Smart Period Tracking",
      description:
        "Track your cycle with intelligent predictions and personalized insights.",
      color: "bg-period",
    },
    {
      icon: Heart,
      title: "Mood & Symptom Monitoring",
      description: "Log daily moods, symptoms, and track patterns over time.",
      color: "bg-ovulation",
    },
    {
      icon: TrendingUp,
      title: "Fertility Insights",
      description:
        "Get accurate ovulation predictions and fertility window tracking.",
      color: "bg-follicular",
    },
    {
      icon: Users,
      title: "Partner Sync",
      description:
        "Connect with your partner to share cycle information and reminders.",
      color: "bg-luteal",
    },
    {
      icon: Mail,
      title: "Smart Reminders",
      description:
        "Receive personalized email reminders before your period starts.",
      color: "bg-fertile",
    },
    {
      icon: Shield,
      title: "Privacy First",
      description:
        "Your personal health data is encrypted and completely private.",
      color: "bg-purple-500",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-period rounded-lg flex items-center justify-center">
              <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <span className="text-xl sm:text-2xl font-bold gradient-text-brand">
              CycleSync
            </span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle />
            <Button
              onClick={() => navigate("/onboarding")}
              className="btn-gradient-pink text-white text-sm sm:text-base px-3 sm:px-4 font-semibold"
              size="sm"
            >
              <span className="hidden sm:inline">Get Started</span>
              <span className="sm:hidden">Start</span>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 text-center">
        <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
            <span className="gradient-text-hero">Track your cycle.</span>
            <br />
            <span className="text-gray-900 dark:text-white">
              Understand your body.
            </span>
          </h1>

          <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto px-4">
            The most comprehensive period tracking app with intelligent
            predictions, mood monitoring, and partner sync features. Take
            control of your reproductive health.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
            <Button
              size="lg"
              onClick={() => navigate("/onboarding")}
              className="btn-gradient-pink text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg w-full sm:w-auto font-semibold"
            >
              Start Tracking Free
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("/dashboard")}
              className="border-primary text-primary hover:bg-primary/10 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg w-full sm:w-auto"
            >
              View Demo
            </Button>
          </div>
        </div>

        {/* Hero Image/Illustration */}
        <div className="mt-8 sm:mt-12 lg:mt-16 relative px-4">
          <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-2xl border border-white/20 dark:border-gray-700/20 max-w-4xl mx-auto">
            <div className="grid grid-cols-7 gap-1 sm:gap-2 lg:gap-4 mb-4 sm:mb-6">
              {/* Calendar preview */}
              {[...Array(7)].map((_, i) => (
                <div
                  key={i}
                  className="text-center text-sm font-medium text-gray-500 py-2"
                >
                  {["S", "M", "T", "W", "T", "F", "S"][i]}
                </div>
              ))}
              {[...Array(35)].map((_, i) => {
                const day = i + 1;
                let bgColor = "bg-gray-50 dark:bg-gray-700";
                let textColor = "text-gray-900 dark:text-gray-100";
                if ([5, 6, 7, 8, 9].includes(day)) {
                  bgColor = "bg-period";
                  textColor = "text-white";
                } else if ([18, 19, 20].includes(day)) {
                  bgColor = "bg-ovulation";
                  textColor = "text-white";
                } else if ([15, 16, 17, 21, 22].includes(day)) {
                  bgColor = "bg-fertile/40";
                  textColor = "text-gray-900 dark:text-gray-800";
                }

                return (
                  <div
                    key={i}
                    className={`w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 rounded-md lg:rounded-lg flex items-center justify-center text-xs sm:text-sm ${bgColor} ${textColor}`}
                  >
                    {day <= 31 ? day : ""}
                  </div>
                );
              })}
            </div>
            <div className="flex justify-center space-x-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-period rounded-full"></div>
                <span>Period</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-ovulation rounded-full"></div>
                <span>Ovulation</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-fertile rounded-full"></div>
                <span>Fertile</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Everything you need to track your cycle
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto px-4">
            From basic period tracking to advanced fertility insights and
            partner coordination.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="floating-card hover:scale-105 transition-transform duration-300"
            >
              <CardContent className="p-6 text-center">
                <div
                  className={`w-12 h-12 ${feature.color} rounded-xl flex items-center justify-center mx-auto mb-4`}
                >
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Tracking Goals Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Choose your tracking goal
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 px-4">
            Whether you're tracking for health or planning for pregnancy, we've
            got you covered.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto">
          <Card className="floating-card p-8 text-center">
            <div className="w-16 h-16 bg-gradient-period rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Just here to track my cycle
            </h3>
            <p className="text-gray-600 mb-6">
              Track your periods, mood swings, and symptoms. Get insights into
              your cycle patterns and receive helpful reminders.
            </p>
            <ul className="text-left space-y-2 text-gray-600 mb-6">
              <li>• Period and ovulation tracking</li>
              <li>• Daily mood and symptom logging</li>
              <li>• Cycle pattern analysis</li>
              <li>• Smart period reminders</li>
            </ul>
            <Button
              onClick={() => navigate("/onboarding")}
              className="w-full btn-gradient-pink text-white font-semibold"
            >
              Start Cycle Tracking
            </Button>
          </Card>

          <Card className="floating-card p-8 text-center">
            <div className="w-16 h-16 bg-gradient-ovulation rounded-2xl flex items-center justify-center mx-auto mb-6">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Planning to get pregnant
            </h3>
            <p className="text-gray-600 mb-6">
              Get fertility insights, optimal intercourse timing suggestions,
              and personalized diet recommendations for conception.
            </p>
            <ul className="text-left space-y-2 text-gray-600 mb-6">
              <li>• Fertility window predictions</li>
              <li>• Intercourse timing suggestions</li>
              <li>• Diet and nutrition guidance</li>
              <li>• Conception probability tracking</li>
            </ul>
            <Button
              onClick={() => navigate("/onboarding")}
              className="w-full btn-gradient-blue text-white font-semibold"
            >
              Start Pregnancy Planning
            </Button>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-t border-white/20 dark:border-gray-700/20 py-8 sm:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-gradient-period rounded-lg flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text-brand">
              CycleSync
            </span>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Empowering women with intelligent period tracking and reproductive
            health insights.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            © 2025 CycleSync. Your health data is private and secure.
          </p>
        </div>
      </footer>
    </div>
  );
}
