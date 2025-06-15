import { Resend } from 'resend';
import { format, addDays } from 'date-fns';
import type { UserProfile } from './types';

// Initialize Resend with API key
if (!process.env.RESEND_API_KEY) {
  throw new Error('Missing Resend API key');
}
const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendPeriodReminder(user: UserProfile) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'CycleSync < notifications@cyclesync.app>',
      to: user.email,
      subject: 'Your period is coming soon!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #ec4899;">Period Reminder</h1>
          <p>Hi ${user.name},</p>
          <p>Your period is expected to start in 2 days. Here are some tips to help you prepare:</p>
          <ul>
            <li>Keep track of your symptoms</li>
            <li>Stay hydrated</li>
            <li>Get plenty of rest</li>
          </ul>
          <p>You can log your symptoms and mood in the CycleSync app.</p>
          <p>Best regards,<br>CycleSync Team</p>
        </div>
      `,
    });

    if (error) {
      console.error('Error sending period reminder:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error sending period reminder:', error);
    throw error;
  }
}

export async function sendOvulationReminder(user: UserProfile) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'CycleSync <notifications@cyclesync.app>',
      to: user.email,
      subject: 'Your fertile window is approaching!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #10b981;">Fertility Window Reminder</h1>
          <p>Hi ${user.name},</p>
          <p>Your fertile window is approaching! This is the optimal time for conception if you're trying to get pregnant.</p>
          <p>Key points to remember:</p>
          <ul>
            <li>Track your basal body temperature</li>
            <li>Monitor cervical mucus changes</li>
            <li>Use ovulation predictor kits if desired</li>
          </ul>
          <p>You can log your symptoms and track your fertility in the CycleSync app.</p>
          <p>Best regards,<br>CycleSync Team</p>
        </div>
      `,
    });

    if (error) {
      console.error('Error sending ovulation reminder:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error sending ovulation reminder:', error);
    throw error;
  }
}

export async function sendWelcomeEmail(user: UserProfile) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'CycleSync <welcome@cyclesync.app>',
      to: user.email,
      subject: 'Welcome to CycleSync!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #ec4899;">Welcome to CycleSync!</h1>
          <p>Hi ${user.name},</p>
          <p>Thank you for joining CycleSync! We're excited to help you track your cycle and achieve your health goals.</p>
          <p>Here's what you can do with CycleSync:</p>
          <ul>
            <li>Track your period and cycle phases</li>
            <li>Log your mood and symptoms</li>
            <li>Get personalized insights</li>
            <li>Receive timely reminders</li>
          </ul>
          <p>If you have any questions, feel free to reach out to our support team.</p>
          <p>Best regards,<br>CycleSync Team</p>
        </div>
      `,
    });

    if (error) {
      console.error('Error sending welcome email:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error sending welcome email:', error);
    throw error;
  }
}

export async function sendPartnerInvite(user: UserProfile, partnerEmail: string) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'CycleSync <partner@cyclesync.app>',
      to: partnerEmail,
      subject: `${user.name} invited you to sync cycles on CycleSync`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #ec4899;">Partner Invitation</h1>
          <p>Hi there,</p>
          <p>${user.name} has invited you to sync cycles on CycleSync!</p>
          <p>Join them to:</p>
          <ul>
            <li>Track cycles together</li>
            <li>Share insights</li>
            <li>Support each other's health goals</li>
          </ul>
          <p>Click the button below to accept the invitation:</p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/partner-sync?code=${user.partnerCode}" 
             style="display: inline-block; background-color: #ec4899; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">
            Accept Invitation
          </a>
          <p>Best regards,<br>CycleSync Team</p>
        </div>
      `,
    });

    if (error) {
      console.error('Error sending partner invite:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error sending partner invite:', error);
    throw error;
  }
} 