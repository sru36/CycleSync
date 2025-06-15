import React, { useState } from "react";
import { format } from "date-fns";
import { Heart, Save } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { cn } from "../lib/utils";
import type { MoodEntry } from "../lib/types";

const MOODS = [
  { value: "excellent", label: "Excellent", emoji: "😊" },
  { value: "good", label: "Good", emoji: "🙂" },
  { value: "okay", label: "Okay", emoji: "😐" },
  { value: "low", label: "Low", emoji: "😔" },
  { value: "terrible", label: "Terrible", emoji: "😢" },
] as const;

interface MoodTrackerProps {
  date?: Date;
  onSave?: (entry: Partial<MoodEntry>) => void;
  existingEntry?: Partial<MoodEntry>;
  className?: string;
}

export function MoodTracker({
  date = new Date(),
  onSave,
  existingEntry,
  className,
}: MoodTrackerProps) {
  const [selectedMood, setSelectedMood] = useState<MoodEntry['mood']>(
    existingEntry?.mood || "okay"
  );
  const [painLevel, setPainLevel] = useState(
    existingEntry?.pain_level || 0
  );
  const [notes, setNotes] = useState(existingEntry?.notes || "");

  const handleSave = () => {
    const entry: Partial<MoodEntry> = {
      date,
      mood: selectedMood,
      pain_level: painLevel,
      notes,
    };
    onSave?.(entry);
  };

  const isComplete = selectedMood && (painLevel > 0 || notes);

  return (
    <Card
      className={cn(
        "w-full max-w-2xl mx-auto dark:bg-gray-800 dark:border-gray-700",
        className,
      )}
    >
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2 text-xl">
          <Heart className="w-5 h-5 text-rose-500" />
          How are you feeling today?
        </CardTitle>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {format(date, "EEEE, MMMM d, yyyy")}
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Mood Selection */}
        <div className="space-y-3">
          <Label className="text-base font-medium">Your mood</Label>
          <div className="grid grid-cols-5 gap-3">
            {MOODS.map((mood) => (
              <button
                key={mood.value}
                onClick={() => setSelectedMood(mood.value)}
                className={cn(
                  "flex flex-col items-center p-3 rounded-xl border-2 transition-all duration-200 hover:scale-105",
                  selectedMood === mood.value
                    ? "border-primary bg-primary/10 dark:bg-primary/20"
                    : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500",
                )}
              >
                <span className="text-2xl mb-1">{mood.emoji}</span>
                <span className="text-xs font-medium">{mood.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Pain Level */}
        <div className="space-y-3">
          <Label className="text-base font-medium">
            Pain level: {painLevel}/10
          </Label>
          <div className="flex gap-2">
            {[...Array(11)].map((_, i) => (
              <button
                key={i}
                onClick={() => setPainLevel(i)}
                className={cn(
                  "w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-medium transition-all duration-200",
                  i <= painLevel
                    ? "bg-period text-white border-period"
                    : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 dark:text-gray-300",
                )}
              >
                {i}
              </button>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div className="space-y-3">
          <Label htmlFor="notes" className="text-base font-medium">
            Additional notes (optional)
          </Label>
          <Textarea
            id="notes"
            placeholder="How are you feeling? Any additional symptoms or thoughts..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="min-h-[100px]"
          />
        </div>

        {/* Save Button */}
        <Button
          onClick={handleSave}
          className="w-full"
          size="lg"
          disabled={!selectedMood}
        >
          <Save className="w-4 h-4 mr-2" />
          Save Today's Entry
        </Button>

        {isComplete && (
          <p className="text-center text-sm text-green-600">
            ✓ Your mood has been tracked for today
          </p>
        )}
      </CardContent>
    </Card>
  );
}
