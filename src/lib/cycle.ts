import { supabase } from './supabase';
import { addDays, format } from 'date-fns';
import type { MoodEntry } from './types';

export const cycle = {
  async addMoodEntry(userId: string, mood: MoodEntry['mood'], painLevel: number, notes?: string) {
    const { data, error } = await supabase
      .from('mood_entries')
      .insert({
        user_id: userId,
        mood,
        pain_level: painLevel,
        notes,
        date: new Date().toISOString(),
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getMoodEntries(userId: string) {
    const { data, error } = await supabase
      .from('mood_entries')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true });
    
    if (error) throw error;
    return data.map(entry => ({
      ...entry,
      date: new Date(entry.date),
      createdAt: new Date(entry.created_at),
      updatedAt: new Date(entry.updated_at),
    }));
  },

  async updateLastPeriodStart(userId: string, startDate: Date) {
    const { data, error } = await supabase
      .from('profiles')
      .update({ last_period_start: format(startDate, 'yyyy-MM-dd') })
      .eq('id', userId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  calculateNextPeriod(lastPeriodStart: Date, cycleLength: number) {
    return addDays(lastPeriodStart, cycleLength);
  },

  calculateOvulationPeriod(lastPeriodStart: Date, cycleLength: number) {
    const ovulationDay = addDays(lastPeriodStart, cycleLength - 14);
    return {
      start: addDays(ovulationDay, -2),
      end: addDays(ovulationDay, 2),
    };
  },

  calculatePhases(lastPeriodStart: Date, cycleLength: number) {
    const ovulationDay = addDays(lastPeriodStart, cycleLength - 14);
    return {
      follicular: {
        start: lastPeriodStart,
        end: ovulationDay,
      },
      luteal: {
        start: ovulationDay,
        end: addDays(lastPeriodStart, cycleLength),
      },
    };
  }
}; 