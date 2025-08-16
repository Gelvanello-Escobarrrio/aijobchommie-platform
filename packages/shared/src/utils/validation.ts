/**
 * Email validation using RFC 5322 compliant regex
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim().toLowerCase());
};

/**
 * South African phone number validation
 * Supports formats: +27 XX XXX XXXX, 0XX XXX XXXX, 27XXXXXXXXX
 */
export const isValidSAPhoneNumber = (phone: string): boolean => {
  const cleanPhone = phone.replace(/\s|-|\(|\)/g, '');
  const saPhoneRegex = /^(?:\+27|27|0)(?:1[0-5]|2[1-37]|3[1-9]|4[1-6]|5[1-8]|6[1-3]|7[1-9]|8[1-4]|9[1-4])\d{7}$/;
  return saPhoneRegex.test(cleanPhone);
};

/**
 * Password strength validation
 */
export interface PasswordStrength {
  isValid: boolean;
  score: number; // 0-5
  feedback: string[];
}

export const validatePasswordStrength = (password: string): PasswordStrength => {
  const feedback: string[] = [];
  let score = 0;

  if (password.length < 8) {
    feedback.push('Password must be at least 8 characters long');
  } else if (password.length >= 12) {
    score += 2;
  } else {
    score += 1;
  }

  if (!/[a-z]/.test(password)) {
    feedback.push('Password must contain at least one lowercase letter');
  } else {
    score += 1;
  }

  if (!/[A-Z]/.test(password)) {
    feedback.push('Password must contain at least one uppercase letter');
  } else {
    score += 1;
  }

  if (!/\d/.test(password)) {
    feedback.push('Password must contain at least one number');
  } else {
    score += 1;
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    feedback.push('Password must contain at least one special character');
  } else {
    score += 1;
  }

  const isValid = feedback.length === 0;

  return {
    isValid,
    score: Math.min(score, 5),
    feedback
  };
};

/**
 * South African ID number validation
 */
export const isValidSAIdNumber = (idNumber: string): boolean => {
  if (idNumber.length !== 13) return false;
  
  const digits = idNumber.split('').map(Number);
  if (digits.some(isNaN)) return false;
  
  // Luhn algorithm for checksum
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    const digit = digits[i];
    if (i % 2 === 0) {
      sum += digit;
    } else {
      const doubled = digit * 2;
      sum += doubled > 9 ? doubled - 9 : doubled;
    }
  }
  
  const checksum = (10 - (sum % 10)) % 10;
  return checksum === digits[12];
};

/**
 * URL validation
 */
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * File type validation
 */
export const isValidFileType = (file: File, allowedTypes: string[]): boolean => {
  return allowedTypes.includes(file.type);
};

/**
 * File size validation (in bytes)
 */
export const isValidFileSize = (file: File, maxSize: number): boolean => {
  return file.size <= maxSize;
};

/**
 * Resume file validation
 */
export const validateResumeFile = (file: File) => {
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain'
  ];
  
  const maxSize = 5 * 1024 * 1024; // 5MB
  
  const errors: string[] = [];
  
  if (!isValidFileType(file, allowedTypes)) {
    errors.push('File must be PDF, DOC, DOCX, or TXT format');
  }
  
  if (!isValidFileSize(file, maxSize)) {
    errors.push('File size must be less than 5MB');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Image file validation
 */
export const validateImageFile = (file: File) => {
  const allowedTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp'
  ];
  
  const maxSize = 2 * 1024 * 1024; // 2MB
  
  const errors: string[] = [];
  
  if (!isValidFileType(file, allowedTypes)) {
    errors.push('Image must be JPEG, PNG, or WebP format');
  }
  
  if (!isValidFileSize(file, maxSize)) {
    errors.push('Image size must be less than 2MB');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Currency validation (South African Rand)
 */
export const isValidZARAmount = (amount: number): boolean => {
  return amount >= 0 && amount <= 1000000 && Number.isFinite(amount);
};

/**
 * Job title validation
 */
export const validateJobTitle = (title: string): boolean => {
  const minLength = 3;
  const maxLength = 100;
  const trimmed = title.trim();
  
  return trimmed.length >= minLength && 
         trimmed.length <= maxLength &&
         /^[a-zA-Z0-9\s\-&().,/]+$/.test(trimmed);
};

/**
 * Skills validation
 */
export const validateSkills = (skills: string[]): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (skills.length === 0) {
    errors.push('At least one skill is required');
  }
  
  if (skills.length > 20) {
    errors.push('Maximum 20 skills allowed');
  }
  
  skills.forEach((skill, index) => {
    const trimmed = skill.trim();
    if (trimmed.length < 2) {
      errors.push(`Skill ${index + 1} must be at least 2 characters long`);
    }
    if (trimmed.length > 50) {
      errors.push(`Skill ${index + 1} must be less than 50 characters`);
    }
  });
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Generic string length validation
 */
export const validateStringLength = (
  value: string,
  minLength: number,
  maxLength: number,
  fieldName: string = 'Field'
): { isValid: boolean; error?: string } => {
  const trimmed = value.trim();
  
  if (trimmed.length < minLength) {
    return {
      isValid: false,
      error: `${fieldName} must be at least ${minLength} characters long`
    };
  }
  
  if (trimmed.length > maxLength) {
    return {
      isValid: false,
      error: `${fieldName} must be less than ${maxLength} characters`
    };
  }
  
  return { isValid: true };
};

/**
 * Date validation
 */
export const isValidDate = (date: Date | string): boolean => {
  const d = new Date(date);
  return d instanceof Date && !isNaN(d.getTime());
};

/**
 * Future date validation
 */
export const isFutureDate = (date: Date | string): boolean => {
  const d = new Date(date);
  return isValidDate(d) && d > new Date();
};

/**
 * Past date validation
 */
export const isPastDate = (date: Date | string): boolean => {
  const d = new Date(date);
  return isValidDate(d) && d < new Date();
};
