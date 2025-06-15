import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Heart,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  Check,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Checkbox } from "../components/ui/checkbox";
import { ThemeToggle } from "../components/ThemeToggle";
import {
  validatePassword,
  validateEmail,
  mockSignup,
  mockLogin,
  type SignupData,
  type LoginData,
} from "../lib/auth-types";
import { auth } from "../lib/auth";
import { useToast } from "../components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";

export default function Auth() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [mode, setMode] = useState<"login" | "signup">("signup");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  const [showReminderOptIn, setShowReminderOptIn] = useState(false);

  // Form data
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [wantsEmailReminders, setWantsEmailReminders] = useState(true);
  const [errors, setErrors] = useState<string[]>([]);

  // Validation states
  const [emailError, setEmailError] = useState("");
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);

  const validateForm = (): boolean => {
    const newErrors: string[] = [];

    // Email validation
    if (!email) {
      setEmailError("Email is required");
      newErrors.push("Email is required");
    } else if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      newErrors.push("Invalid email format");
    } else {
      setEmailError("");
    }

    // Password validation (for signup or if password entered for login)
    if (!password) {
      setPasswordErrors(["Password is required"]);
      newErrors.push("Password is required");
    } else if (mode === "signup") {
      const passwordValidation = validatePassword(password);
      setPasswordErrors(passwordValidation.errors);
      newErrors.push(...passwordValidation.errors);
    } else {
      setPasswordErrors([]);
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      const { user } = await auth.signUp(email, password);
      if (user) {
        toast({
          title: "Success!",
          description: "Please check your email to verify your account.",
        });
        setShowEmailVerification(true);
        // Do not navigate to onboarding until verified
      }
    } catch (error: any) {
      if (error?.message?.toLowerCase().includes("user already registered") || error?.message?.toLowerCase().includes("duplicate")) {
        toast({
          title: "Error",
          description: "This email is already registered. Please log in or use a different email.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to sign up",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      const { user } = await auth.signIn(email, password);
      if (user) {
        // Always fetch the latest user object
        const currentUser = await auth.getCurrentUser();
        if (!currentUser?.email_confirmed_at && !currentUser?.confirmed_at) {
          toast({
            title: "Email Not Verified",
            description: "Please verify your email before continuing.",
            variant: "destructive",
          });
          setShowEmailVerification(true);
          return;
        }
        toast({
          title: "Welcome back!",
          description: "Successfully logged in.",
        });
        navigate("/dashboard");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to log in",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailVerification = async () => {
    setIsLoading(true);
    try {
      // Poll for verification status
      const poll = async (retries = 10) => {
        for (let i = 0; i < retries; i++) {
          const user = await auth.getCurrentUser();
          if (user?.email_confirmed_at || user?.confirmed_at) {
            setShowEmailVerification(false);
            setShowReminderOptIn(true);
            toast({
              title: "Email Verified!",
              description: "Your email has been verified. You can continue.",
            });
            return;
          }
          await new Promise((res) => setTimeout(res, 2000));
        }
        toast({
          title: "Still Not Verified",
          description: "We couldn't verify your email yet. Please try again.",
          variant: "destructive",
        });
      };
      await poll();
    } finally {
      setIsLoading(false);
    }
  };

  const handleReminderOptIn = (optIn: boolean) => {
    // Update user preferences
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
    currentUser.wantsEmailReminders = optIn;
    currentUser.isEmailVerified = true;
    localStorage.setItem("currentUser", JSON.stringify(currentUser));

    // Navigate to onboarding or dashboard
    const hasProfile = localStorage.getItem("userProfile");
    navigate(hasProfile ? "/dashboard" : "/onboarding");
  };

  // Add resend verification handler
  const handleResendVerification = async () => {
    try {
      await auth.resendVerificationEmail(email);
      toast({
        title: "Verification Email Sent",
        description: "A new verification email has been sent. Please check your inbox.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to resend verification email.",
        variant: "destructive",
      });
    }
  };

  if (showEmailVerification) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md mx-auto dark:bg-gray-800 dark:border-gray-700">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-gradient-period rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl">Check Your Email</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center space-y-4">
              <p className="text-gray-600 dark:text-gray-400">
                We've sent a verification link to:
              </p>
              <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                <p className="font-medium text-blue-900 dark:text-blue-300">
                  {email}
                </p>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Click the link in your email to verify your account
              </p>
            </div>

            <div className="space-y-3">
              <Button
                onClick={handleEmailVerification}
                className="w-full bg-gradient-period hover:opacity-90 text-white"
              >
                I've Verified My Email
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setShowEmailVerification(false)}
              >
                Back to Signup
              </Button>
            </div>

            <div className="text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Didn't receive the email? Check your spam folder or{" "}
                <button type="button" className="text-primary hover:underline" onClick={handleResendVerification}>
                  resend verification
                </button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (showReminderOptIn) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md mx-auto dark:bg-gray-800 dark:border-gray-700">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl">Stay Connected</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center space-y-4">
              <p className="text-gray-600 dark:text-gray-400">
                Would you like us to send you helpful reminders?
              </p>

              <div className="space-y-4 text-left">
                <div className="p-4 bg-pink-50 dark:bg-pink-900/20 rounded-lg border-l-4 border-pink-400">
                  <h4 className="font-medium text-pink-800 dark:text-pink-300 mb-2">
                    Email Reminders Include:
                  </h4>
                  <ul className="text-sm text-pink-700 dark:text-pink-400 space-y-1">
                    <li>• Period arrival notifications (2 days before)</li>
                    <li>• Ovulation window alerts</li>
                    <li>• Health tips and cycle insights</li>
                    <li>• Partner notification options</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Button
                onClick={() => handleReminderOptIn(true)}
                className="w-full bg-gradient-period hover:opacity-90 text-white"
              >
                <Check className="w-4 h-4 mr-2" />
                Yes, Send Me Reminders
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => handleReminderOptIn(false)}
              >
                Skip for Now
              </Button>
            </div>

            <div className="text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                You can change your email preferences anytime in settings
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm border-b border-white/20 dark:border-gray-700/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/")}
                className="p-2"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div className="flex items-center space-x-2">
                <Heart className="w-5 h-5 text-white bg-gradient-period rounded-lg p-1" />
                <span className="text-xl font-bold bg-gradient-period bg-clip-text text-transparent">
                  CycleSync
                </span>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[calc(100vh-80px)]">
        <Card className="w-full max-w-md mx-auto dark:bg-gray-800 dark:border-gray-700">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">
              {mode === "login" ? "Welcome Back" : "Create Account"}
            </CardTitle>
            <p className="text-gray-600 dark:text-gray-400">
              {mode === "login"
                ? "Sign in to your CycleSync account"
                : "Start tracking your cycle today"}
            </p>
          </CardHeader>

          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={`pl-10 ${emailError ? "border-red-500" : ""}`}
                        required
                      />
                    </div>
                    {emailError && (
                      <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {emailError}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={`pl-10 pr-10 ${passwordErrors.length > 0 ? "border-red-500" : ""}`}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>

                    {passwordErrors.length > 0 && (
                      <div className="space-y-1">
                        {passwordErrors.map((error, index) => (
                          <p
                            key={index}
                            className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1"
                          >
                            <AlertCircle className="w-3 h-3" />
                            {error}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-period hover:opacity-90 text-white"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Logging in...
                      </>
                    ) : "Login"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Enter your name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={`pl-10 ${emailError ? "border-red-500" : ""}`}
                        required
                      />
                    </div>
                    {emailError && (
                      <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {emailError}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={`pl-10 pr-10 ${passwordErrors.length > 0 ? "border-red-500" : ""}`}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>

                    {/* Password Requirements (for signup) */}
                    {mode === "signup" && (
                      <div className="space-y-1">
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          Password must contain:
                        </p>
                        <div className="space-y-1">
                          <div
                            className={`text-xs flex items-center gap-2 ${password.length >= 8 ? "text-green-600 dark:text-green-400" : "text-gray-500 dark:text-gray-400"}`}
                          >
                            {password.length >= 8 ? (
                              <Check className="w-3 h-3" />
                            ) : (
                              <div className="w-3 h-3 border border-current rounded-full" />
                            )}
                            At least 8 characters
                          </div>
                          <div
                            className={`text-xs flex items-center gap-2 ${/\d/.test(password) ? "text-green-600 dark:text-green-400" : "text-gray-500 dark:text-gray-400"}`}
                          >
                            {/\d/.test(password) ? (
                              <Check className="w-3 h-3" />
                            ) : (
                              <div className="w-3 h-3 border border-current rounded-full" />
                            )}
                            At least one number
                          </div>
                          <div
                            className={`text-xs flex items-center gap-2 ${/[a-z]/.test(password) ? "text-green-600 dark:text-green-400" : "text-gray-500 dark:text-gray-400"}`}
                          >
                            {/[a-z]/.test(password) ? (
                              <Check className="w-3 h-3" />
                            ) : (
                              <div className="w-3 h-3 border border-current rounded-full" />
                            )}
                            One lowercase letter
                          </div>
                          <div
                            className={`text-xs flex items-center gap-2 ${/[A-Z]/.test(password) ? "text-green-600 dark:text-green-400" : "text-gray-500 dark:text-gray-400"}`}
                          >
                            {/[A-Z]/.test(password) ? (
                              <Check className="w-3 h-3" />
                            ) : (
                              <div className="w-3 h-3 border border-current rounded-full" />
                            )}
                            One uppercase letter
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-period hover:opacity-90 text-white"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Creating account...
                      </>
                    ) : "Create Account"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            {/* Mode Toggle */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {mode === "login"
                  ? "Don't have an account?"
                  : "Already have an account?"}{" "}
                <button
                  type="button"
                  onClick={() => {
                    setMode(mode === "login" ? "signup" : "login");
                    setErrors([]);
                    setEmailError("");
                    setPasswordErrors([]);
                  }}
                  className="text-primary hover:underline font-medium"
                >
                  {mode === "login" ? "Sign up" : "Sign in"}
                </button>
              </p>
            </div>

            {/* Terms for Signup */}
            {mode === "signup" && (
              <div className="mt-4 text-center">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  By creating an account, you agree to our{" "}
                  <button className="text-primary hover:underline">
                    Terms of Service
                  </button>{" "}
                  and{" "}
                  <button className="text-primary hover:underline">
                    Privacy Policy
                  </button>
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
