import { supabase } from './supabase';

export const notificationScheduler = {
  async checkAndSendNotifications() {
    try {
      // Get all users who have enabled notifications
      const { data: users, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('email_notifications', true);

      if (error) throw error;

      if (!users || users.length === 0) {
        console.log('No users with notifications enabled');
        return;
      }

      // Process each user - now just log the reminder instead of sending email
      for (const user of users) {
        console.log(`Period reminder for user: ${user.email}`);
        console.log(`Ovulation reminder for user: ${user.email}`);
        
        // You can add other notification methods here in the future
        // such as push notifications, in-app notifications, etc.
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