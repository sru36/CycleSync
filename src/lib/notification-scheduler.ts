import { supabase } from './supabase';
import { emailService } from './email-service';
import type { UserProfile } from './types';

export const notificationScheduler = {
  async checkAndSendNotifications() {
    try {
      // Get all users who have enabled email reminders
      const { data: users, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('email_reminders', true);

      if (error) throw error;

      if (!users || users.length === 0) {
        console.log('No users with email reminders enabled');
        return;
      }

      // Process each user
      for (const user of users) {
        const userProfile: UserProfile = {
          ...user,
          lastPeriodDate: new Date(user.last_period_start),
          createdAt: new Date(user.created_at),
          updatedAt: new Date(user.updated_at),
        };

        // Send period reminder
        await emailService.sendPeriodReminder(userProfile);

        // Send ovulation reminder
        await emailService.sendOvulationReminder(userProfile);
      }

      console.log('Notification check completed successfully');
    } catch (error) {
      console.error('Error in notification scheduler:', error);
    }
  },

  // Start the scheduler
  startScheduler(intervalMinutes = 60) {
    // Run immediately on start
    this.checkAndSendNotifications();

    // Then run every hour (or specified interval)
    setInterval(() => {
      this.checkAndSendNotifications();
    }, intervalMinutes * 60 * 1000);
  }
}; 