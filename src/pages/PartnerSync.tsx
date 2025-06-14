import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Copy, Users, ArrowLeft, Check } from "lucide-react";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { ThemeToggle } from "../components/ThemeToggle";

export default function PartnerSync() {
  const navigate = useNavigate();
  const [uniqueCode] = useState(() =>
    Math.random().toString(36).substring(2, 8).toUpperCase(),
  );
  const [partnerCode, setPartnerCode] = useState("");
  const [copied, setCopied] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<
    "disconnected" | "connecting" | "connected"
  >("disconnected");

  const copyToClipboard = async () => {
    // Check if we're in a secure context and clipboard is available
    const canUseClipboard =
      navigator.clipboard &&
      window.isSecureContext &&
      typeof navigator.clipboard.writeText === "function";

    if (canUseClipboard) {
      try {
        // Test if clipboard access is actually allowed
        await navigator.clipboard.writeText(uniqueCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        return;
      } catch (err) {
        console.warn("Clipboard API failed, using fallback:", err);
        // Fall through to fallback method
      }
    }

    // Use fallback method for all other cases
    fallbackCopyTextToClipboard(uniqueCode);
  };

  const fallbackCopyTextToClipboard = (text: string) => {
    try {
      // Create a temporary textarea element
      const textArea = document.createElement("textarea");
      textArea.value = text;

      // Make it invisible but accessible
      textArea.style.position = "fixed";
      textArea.style.left = "-9999px";
      textArea.style.top = "-9999px";
      textArea.style.opacity = "0";
      textArea.style.pointerEvents = "none";
      textArea.setAttribute("readonly", "");
      textArea.setAttribute("aria-hidden", "true");

      document.body.appendChild(textArea);

      // Select the text
      textArea.select();
      textArea.setSelectionRange(0, 99999); // For mobile devices

      // Try to copy using execCommand
      let successful = false;
      try {
        successful = document.execCommand("copy");
      } catch (execErr) {
        console.warn("execCommand failed:", execErr);
        successful = false;
      }

      // Clean up
      document.body.removeChild(textArea);

      if (successful) {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } else {
        // If execCommand also fails, provide manual copy instructions
        showManualCopyInstructions(text);
      }
    } catch (err) {
      console.error("Fallback copy failed:", err);
      showManualCopyInstructions(text);
    }
  };

  const showManualCopyInstructions = (text: string) => {
    // Create a better user experience for manual copying
    const message = `Copy this code manually:\n\n${text}\n\nThe code has been selected above for easy copying.`;

    // Show in a more user-friendly way
    if (window.confirm(message + "\n\nClick OK to continue.")) {
      // User acknowledged the manual copy instructions
      console.log("Manual copy instructions shown to user");
    }
  };

  const handleConnect = () => {
    if (partnerCode.length === 6) {
      setConnectionStatus("connecting");
      // Simulate connection process
      setTimeout(() => {
        setConnectionStatus("connected");
        // Store partner connection
        localStorage.setItem("partnerConnected", "true");
        localStorage.setItem("partnerCode", partnerCode);
        setTimeout(() => {
          navigate("/partner-dashboard");
        }, 2000);
      }, 1500);
    }
  };

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
                onClick={() => navigate("/dashboard")}
                className="p-2"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-period rounded-lg flex items-center justify-center">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-period bg-clip-text text-transparent">
                  CycleSync
                </span>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Partner Sync
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Connect with your partner to share cycle information and receive
              helpful reminders
            </p>
          </div>

          {connectionStatus === "disconnected" && (
            <div className="space-y-8">
              {/* Your Code Section */}
              <Card className="floating-card dark:bg-gray-800/80 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="w-5 h-5 text-pink-500" />
                    Your Unique Code
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600 dark:text-gray-400">
                    Share this code with your partner so they can connect to
                    your cycle tracking
                  </p>

                  <div className="flex items-center gap-3">
                    <div
                      className="flex-1 p-4 bg-gradient-to-r from-pink-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 rounded-xl border-2 border-dashed border-pink-200 dark:border-gray-500 cursor-pointer hover:bg-gradient-to-r hover:from-pink-100 hover:to-purple-100 dark:hover:from-gray-600 dark:hover:to-gray-500 transition-colors"
                      onClick={copyToClipboard}
                      title="Click to copy"
                    >
                      <div className="text-center">
                        <div className="text-3xl font-mono font-bold tracking-wider text-pink-600 dark:text-pink-400 select-all">
                          {uniqueCode}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Click to copy
                        </div>
                      </div>
                    </div>
                    <Button
                      onClick={copyToClipboard}
                      variant="outline"
                      size="lg"
                      className="px-6"
                    >
                      {copied ? (
                        <>
                          <Check className="w-4 h-4 mr-2" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 mr-2" />
                          Copy
                        </>
                      )}
                    </Button>
                  </div>

                  <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                    💡 Tip: You can also manually select and copy the code above
                    if the copy button doesn't work
                  </p>

                  <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                    <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">
                      How it works:
                    </h4>
                    <ol className="text-sm text-blue-700 dark:text-blue-400 space-y-1 list-decimal list-inside">
                      <li>Share your unique code with your partner</li>
                      <li>They enter the code in their CycleSync app</li>
                      <li>They'll receive helpful reminders and insights</li>
                      <li>You both stay connected and informed</li>
                    </ol>
                  </div>
                </CardContent>
              </Card>

              {/* Connect to Partner Section */}
              <Card className="floating-card dark:bg-gray-800/80 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-purple-500" />
                    Connect to Your Partner
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600 dark:text-gray-400">
                    If your partner already has CycleSync, enter their code to
                    connect
                  </p>

                  <div className="space-y-3">
                    <Label htmlFor="partnerCode">Partner's Code</Label>
                    <div className="flex gap-3">
                      <Input
                        id="partnerCode"
                        placeholder="ABC123"
                        value={partnerCode}
                        onChange={(e) =>
                          setPartnerCode(e.target.value.toUpperCase())
                        }
                        className="text-center text-lg font-mono tracking-wider"
                        maxLength={6}
                      />
                      <Button
                        onClick={handleConnect}
                        disabled={partnerCode.length !== 6}
                        className="bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 text-white"
                      >
                        Connect
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {connectionStatus === "connecting" && (
            <Card className="floating-card dark:bg-gray-800/80 dark:border-gray-700 text-center">
              <CardContent className="py-12">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Connecting to your partner...
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Please wait while we establish the connection
                </p>
                <div className="mt-4">
                  <div className="w-8 h-8 border-4 border-pink-200 dark:border-pink-800 border-t-pink-500 rounded-full animate-spin mx-auto"></div>
                </div>
              </CardContent>
            </Card>
          )}

          {connectionStatus === "connected" && (
            <Card className="floating-card dark:bg-gray-800/80 dark:border-gray-700 text-center">
              <CardContent className="py-12">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Successfully Connected! 🎉
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  You're now connected with your partner. Redirecting to partner
                  dashboard...
                </p>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full animate-pulse w-full"></div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Benefits Section */}
          {connectionStatus === "disconnected" && (
            <Card className="floating-card dark:bg-gray-800/80 dark:border-gray-700 mt-8">
              <CardHeader>
                <CardTitle>Benefits of Partner Sync</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-pink-100 dark:bg-pink-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-pink-600 dark:text-pink-400 text-lg">
                        📱
                      </span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-gray-100">
                        Period Reminders
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Get notified 2 days before periods start
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-purple-600 dark:text-purple-400 text-lg">
                        💝
                      </span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-gray-100">
                        Care Suggestions
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Thoughtful tips to support your partner
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-600 dark:text-blue-400 text-lg">
                        😊
                      </span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-gray-100">
                        Mood Insights
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Understand mood patterns and PMS
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-green-600 dark:text-green-400 text-lg">
                        🔒
                      </span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-gray-100">
                        Privacy First
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Only essential information is shared
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
