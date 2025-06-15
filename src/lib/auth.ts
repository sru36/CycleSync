import { supabase } from './supabase';
import type { UserProfile } from './types';

export const auth = {
  async signUp(email: string, password: string) {
    if (!email || !password) {
      throw new Error('Email and password are required');
    }
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) throw error;
    return data;
  },

  async signIn(email: string, password: string) {
    if (!email || !password) {
      throw new Error('Email and password are required');
    }
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  },

  async updateProfile(userId: string, profile: Partial<UserProfile>) {
    const { data, error } = await supabase
      .from('profiles')
      .update({
        email: profile.email,
        name: profile.name,
        age: profile.age,
        weight: profile.weight,
        last_period_date: profile.lastPeriodDate ? profile.lastPeriodDate.toISOString().split('T')[0] : undefined,
        cycle_length: profile.cycleLength,
        period_length: profile.periodLength,
        tracking_goal: profile.trackingGoal,
        partner_code: profile.partnerCode,
        partner_id: profile.partnerId,
        email_notifications: profile.emailNotifications,
        created_at: profile.createdAt ? profile.createdAt.toISOString() : undefined,
        updated_at: profile.updatedAt ? profile.updatedAt.toISOString() : undefined,
      })
      .eq('id', userId)
      .select()
      .single();
    
    if (error) throw error;
    return {
      ...data,
      lastPeriodDate: new Date(data.last_period_date),
      cycleLength: data.cycle_length,
      periodLength: data.period_length,
      trackingGoal: data.tracking_goal,
      partnerCode: data.partner_code,
      partnerId: data.partner_id,
      emailNotifications: data.email_notifications,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    };
  },

  async getProfile(userId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) throw error;
    return {
      ...data,
      lastPeriodDate: new Date(data.last_period_date),
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    };
  },

  async createProfile(userId: string, profile: Partial<UserProfile>) {
    const { data, error } = await supabase
      .from('profiles')
      .insert({
        id: userId,
        email: profile.email,
        name: profile.name,
        age: profile.age,
        weight: profile.weight,
        last_period_date: profile.lastPeriodDate ? profile.lastPeriodDate.toISOString().split('T')[0] : undefined,
        cycle_length: profile.cycleLength,
        period_length: profile.periodLength,
        tracking_goal: profile.trackingGoal,
        partner_code: profile.partnerCode,
        partner_id: profile.partnerId,
        email_notifications: profile.emailNotifications,
        created_at: profile.createdAt ? profile.createdAt.toISOString() : undefined,
        updated_at: profile.updatedAt ? profile.updatedAt.toISOString() : undefined,
      })
      .select()
      .single();
    if (error) throw error;
    return {
      ...data,
      lastPeriodDate: new Date(data.last_period_date),
      cycleLength: data.cycle_length,
      periodLength: data.period_length,
      trackingGoal: data.tracking_goal,
      partnerCode: data.partner_code,
      partnerId: data.partner_id,
      emailNotifications: data.email_notifications,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    };
  },

  async resendVerificationEmail(email: string) {
    const { error } = await supabase.auth.resend({ type: 'signup', email });
    if (error) throw error;
    return true;
  }
}; 