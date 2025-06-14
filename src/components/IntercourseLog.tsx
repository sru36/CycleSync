import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { Heart, Plus, Calendar, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { toast } from "./ui/use-toast";
import { cn } from "../lib/utils";

export interface IntercourseEntry {
  id: string;
  userId: string;
  date: Date;
  time: string;
  protectionUsed: "none" | "condom" | "withdrawal" | "other";
  notes: string;
  createdAt: Date;
}

interface IntercourseLogProps {
  userId: string;
  className?: string;
}

export function IntercourseLog({ userId, className }: IntercourseLogProps) {
  const [entries, setEntries] = useState<IntercourseEntry[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    date: format(new Date(), "yyyy-MM-dd"),
    time: format(new Date(), "HH:mm"),
    protectionUsed: "none" as const,
    notes: "",
  });

  useEffect(() => {
    loadEntries();
  }, [userId]);

  const loadEntries = () => {
    const stored = localStorage.getItem("intercourseEntries");
    if (stored) {
      const allEntries = JSON.parse(stored).map((entry: any) => ({
        ...entry,
        date: new Date(entry.date),
        createdAt: new Date(entry.createdAt),
      }));
      const userEntries = allEntries.filter(
        (entry: IntercourseEntry) => entry.userId === userId,
      );
      setEntries(
        userEntries.sort((a, b) => b.date.getTime() - a.date.getTime()),
      );
    }
  };

  const saveEntries = (newEntries: IntercourseEntry[]) => {
    // Load all entries, update user's entries, and save back
    const stored = localStorage.getItem("intercourseEntries");
    let allEntries: IntercourseEntry[] = stored
      ? JSON.parse(stored).map((entry: any) => ({
          ...entry,
          date: new Date(entry.date),
          createdAt: new Date(entry.createdAt),
        }))
      : [];

    // Remove existing entries for this user
    allEntries = allEntries.filter((entry) => entry.userId !== userId);

    // Add updated entries
    allEntries.push(...newEntries);

    localStorage.setItem("intercourseEntries", JSON.stringify(allEntries));
    setEntries(newEntries.sort((a, b) => b.date.getTime() - a.date.getTime()));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newEntry: IntercourseEntry = {
      id: "intercourse-" + Date.now(),
      userId,
      date: new Date(formData.date),
      time: formData.time,
      protectionUsed: formData.protectionUsed,
      notes: formData.notes,
      createdAt: new Date(),
    };

    const updatedEntries = [...entries, newEntry];
    saveEntries(updatedEntries);

    // Reset form
    setFormData({
      date: format(new Date(), "yyyy-MM-dd"),
      time: format(new Date(), "HH:mm"),
      protectionUsed: "none",
      notes: "",
    });
    setIsDialogOpen(false);

    toast({
      title: "Entry added",
      description: "Intercourse entry has been logged successfully.",
    });
  };

  const handleDelete = (entryId: string) => {
    const updatedEntries = entries.filter((entry) => entry.id !== entryId);
    saveEntries(updatedEntries);

    toast({
      title: "Entry deleted",
      description: "Intercourse entry has been removed.",
    });
  };

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const getProtectionLabel = (protection: string) => {
    switch (protection) {
      case "none":
        return "None";
      case "condom":
        return "Condom";
      case "withdrawal":
        return "Withdrawal";
      case "other":
        return "Other";
      default:
        return "Unknown";
    }
  };

  const getProtectionColor = (protection: string) => {
    switch (protection) {
      case "none":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "condom":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "withdrawal":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "other":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  return (
    <Card
      className={cn(
        "floating-card dark:bg-gray-800/80 dark:border-gray-700",
        className,
      )}
    >
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-fertile" />
            <span className="hidden sm:inline">Intercourse Log</span>
            <span className="sm:hidden">Log</span>
          </CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                size="sm"
                className="bg-fertile hover:bg-fertile/80 text-white text-xs sm:text-sm px-2 sm:px-3"
              >
                <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Add Entry</span>
                <span className="sm:hidden">Add</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="mx-4 sm:mx-auto max-w-md">
              <DialogHeader>
                <DialogTitle className="text-base sm:text-lg">
                  Add Intercourse Entry
                </DialogTitle>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="intercourse-date">Date</Label>
                  <Input
                    id="intercourse-date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => updateFormData("date", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="intercourse-time">Time</Label>
                  <Input
                    id="intercourse-time"
                    type="time"
                    value={formData.time}
                    onChange={(e) => updateFormData("time", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="protection">Protection Used</Label>
                  <Select
                    value={formData.protectionUsed}
                    onValueChange={(value) =>
                      updateFormData("protectionUsed", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select protection method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="condom">Condom</SelectItem>
                      <SelectItem value="withdrawal">Withdrawal</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="intercourse-notes">Notes (optional)</Label>
                  <Textarea
                    id="intercourse-notes"
                    placeholder="Any additional notes..."
                    value={formData.notes}
                    onChange={(e) => updateFormData("notes", e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-fertile hover:bg-fertile/80 text-white"
                  >
                    Add Entry
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>

      <CardContent>
        {entries.length === 0 ? (
          <div className="text-center py-8">
            <Heart className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              No entries logged yet
            </p>
            <p className="text-sm text-gray-400 dark:text-gray-500">
              Start tracking to optimize your fertility window
            </p>
          </div>
        ) : (
          <div className="space-y-2 sm:space-y-3 max-h-48 sm:max-h-64 overflow-y-auto">
            {entries.map((entry) => (
              <div
                key={entry.id}
                className="p-2 sm:p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-100 dark:border-gray-600"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <div>
                      <div className="font-medium text-sm">
                        {format(entry.date, "MMM d, yyyy")} at {entry.time}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span
                          className={cn(
                            "px-2 py-1 rounded-full text-xs font-medium",
                            getProtectionColor(entry.protectionUsed),
                          )}
                        >
                          {getProtectionLabel(entry.protectionUsed)}
                        </span>
                      </div>
                      {entry.notes && (
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                          {entry.notes}
                        </p>
                      )}
                    </div>
                  </div>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Entry</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this intercourse
                          entry? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(entry.id)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
