import { config } from 'dotenv';
import { emailService } from './src/lib/email-service';

// Load environment variables
config({ path: '.env' });

async function testEmailService() {
  // Test user with all required fields
  const testUser = {
    id: 'test-user',
    email: 'sruu36@gmail.com', // Replace with your email
    name: 'Test User',
    age: 25,
    weight: 60,
    cycleLength: 28,
    periodLength: 5,
    lastPeriodDate: new Date(),
    trackingGoal: 'cycle_tracking' as const,
    emailReminders: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    partnerCode: 'TEST123', // Required for partner invite test
  };

  try {
    console.log('Testing welcome email...');
    const welcomeResult = await emailService.sendWelcomeEmail(testUser);
    console.log('Welcome email test result:', welcomeResult);

    console.log('\nTesting period reminder...');
    const periodResult = await emailService.sendPeriodReminder(testUser);
    console.log('Period reminder test result:', periodResult);

    console.log('\nTesting ovulation reminder...');
    const ovulationResult = await emailService.sendOvulationReminder(testUser);
    console.log('Ovulation reminder test result:', ovulationResult);

    console.log('\nTesting partner invite...');
    const partnerResult = await emailService.sendPartnerInvite(testUser, 'partner@example.com');
    console.log('Partner invite test result:', partnerResult);
  } catch (error) {
    console.error('Error during email testing:', error);
  }
}

// Check if Resend API key is set
if (!process.env.RESEND_API_KEY) {
  console.error('Error: RESEND_API_KEY is not set in .env file');
  process.exit(1);
}

testEmailService().catch(console.error); 