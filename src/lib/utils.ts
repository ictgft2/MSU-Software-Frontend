import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


// You can place this in a utils/password.js file
export const checkPasswordStrength = (password: string) => {
  let score = 0;
  const analysis = {
    label: '',
    score: 0,
  };

  // Criteria for scoring
  const checks = {
    length: password.length >= 6,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    specialChar: /[^A-Za-z0-9]/.test(password),
  };

  // Increase score for each met criterion
  if (checks.length) score++;
  if (checks.uppercase) score++;
  if (checks.lowercase) score++;
  if (checks.number) score++;
  if (checks.specialChar) score++;

  // Adjust score if password is too short
  if (password.length > 0 && password.length < 8) {
    score = 1;
  }

  // Determine label based on score
  switch (score) {
    case 0:
      analysis.label = ''; // Or 'Too short' if you prefer
      break;
    case 1:
      analysis.label = 'Weak';
      break;
    case 2:
      analysis.label = 'Medium';
      break;
    case 3:
      analysis.label = 'Strong';
      break;
    case 4:
    case 5: // Catches all criteria met
      analysis.label = 'Very Strong';
      break;
    default:
      analysis.label = '';
  }

  analysis.score = score;
  return analysis;
};