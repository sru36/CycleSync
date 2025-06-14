export interface User {
  id: string;
  email: string;
  isEmailVerified: boolean;
  wantsEmailReminders: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface SignupData {
  email: string;
  password: string;
  wantsEmailReminders: boolean;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface PartnerReminderSettings {
  partnerEmail: string;
  sendPeriodReminders: boolean;
  sendMoodReminders: boolean;
  reminderDaysBeforePeriod: number;
}

// Password validation
export const validatePassword = (
  password: string,
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push("Password must be at least 8 characters long");
  }

  if (!/\d/.test(password)) {
    errors.push("Password must contain at least one number");
  }

  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  }

  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Email validation
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Mock authentication functions (in real app, these would call your backend)
export const mockSignup = async (signupData: SignupData): Promise<User> => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const user: User = {
    id: "user-" + Date.now(),
    email: signupData.email,
    isEmailVerified: false,
    wantsEmailReminders: signupData.wantsEmailReminders,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  // Store in localStorage for demo
  localStorage.setItem("currentUser", JSON.stringify(user));

  return user;
};

export const mockLogin = async (loginData: LoginData): Promise<User> => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 800));

  // In real app, verify credentials with backend
  const storedUser = localStorage.getItem("currentUser");
  if (storedUser) {
    return JSON.parse(storedUser);
  }

  throw new Error("Invalid credentials");
};

export const mockLogout = async (): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  localStorage.removeItem("currentUser");
};

export const getCurrentUser = (): User | null => {
  const stored = localStorage.getItem("currentUser");
  return stored ? JSON.parse(stored) : null;
};
