import { Resend } from 'resend';
import { config } from 'dotenv';

// Load environment variables
config();

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendTestEmail() {
  try {
    const { data, error } = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'ni.sweet.y2@gmail.com',
      subject: 'Test Email from CycleSync',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #ec4899;">Test Email</h1>
          <p>This is a test email from CycleSync to verify the email functionality is working correctly.</p>
          <p>If you're receiving this email, it means the Resend API integration is working properly!</p>
          <p>Best regards,<br>CycleSync Team</p>
        </div>
      `,
    });

    if (error) {
      console.error('Error sending email:', error);
      return;
    }

    console.log('Email sent successfully:', data);
  } catch (error) {
    console.error('Error:', error);
  }
}

// Check if Resend API key is set
if (!process.env.RESEND_API_KEY) {
  console.error('Error: RESEND_API_KEY is not set in .env file');
  process.exit(1);
}

sendTestEmail().catch(console.error); 