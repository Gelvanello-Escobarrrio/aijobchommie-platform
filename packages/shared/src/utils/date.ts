/**
 * Date utility functions for AI Job Chommie platform
 */

/**
 * Format date for display
 */
export const formatDate = (
  date: Date | string,
  options?: Intl.DateTimeFormatOptions
): string => {
  const d = new Date(date);
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'Africa/Johannesburg'
  };
  
  return d.toLocaleDateString('en-ZA', { ...defaultOptions, ...options });
};

/**
 * Format date and time for display
 */
export const formatDateTime = (
  date: Date | string,
  options?: Intl.DateTimeFormatOptions
): string => {
  const d = new Date(date);
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Africa/Johannesburg'
  };
  
  return d.toLocaleDateString('en-ZA', { ...defaultOptions, ...options });
};

/**
 * Format relative time (e.g., "2 hours ago", "3 days ago")
 */
export const formatRelativeTime = (date: Date | string): string => {
  const now = new Date();
  const target = new Date(date);
  const diffMs = now.getTime() - target.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);

  if (diffSeconds < 60) {
    return 'just now';
  } else if (diffMinutes < 60) {
    return `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} ago`;
  } else if (diffHours < 24) {
    return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
  } else if (diffDays < 7) {
    return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
  } else if (diffWeeks < 4) {
    return `${diffWeeks} week${diffWeeks !== 1 ? 's' : ''} ago`;
  } else if (diffMonths < 12) {
    return `${diffMonths} month${diffMonths !== 1 ? 's' : ''} ago`;
  } else {
    return `${diffYears} year${diffYears !== 1 ? 's' : ''} ago`;
  }
};

/**
 * Get South African timezone date
 */
export const getSATime = (): Date => {
  return new Date(new Date().toLocaleString('en-US', { timeZone: 'Africa/Johannesburg' }));
};

/**
 * Check if date is today
 */
export const isToday = (date: Date | string): boolean => {
  const today = getSATime();
  const target = new Date(date);
  
  return today.toDateString() === target.toDateString();
};

/**
 * Check if date is this week
 */
export const isThisWeek = (date: Date | string): boolean => {
  const today = getSATime();
  const target = new Date(date);
  const todayWeekStart = new Date(today);
  todayWeekStart.setDate(today.getDate() - today.getDay());
  todayWeekStart.setHours(0, 0, 0, 0);
  
  const todayWeekEnd = new Date(todayWeekStart);
  todayWeekEnd.setDate(todayWeekStart.getDate() + 6);
  todayWeekEnd.setHours(23, 59, 59, 999);
  
  return target >= todayWeekStart && target <= todayWeekEnd;
};

/**
 * Check if date is this month
 */
export const isThisMonth = (date: Date | string): boolean => {
  const today = getSATime();
  const target = new Date(date);
  
  return today.getFullYear() === target.getFullYear() && 
         today.getMonth() === target.getMonth();
};

/**
 * Add days to date
 */
export const addDays = (date: Date | string, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

/**
 * Add months to date
 */
export const addMonths = (date: Date | string, months: number): Date => {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
};

/**
 * Get start of day
 */
export const startOfDay = (date: Date | string): Date => {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
};

/**
 * Get end of day
 */
export const endOfDay = (date: Date | string): Date => {
  const result = new Date(date);
  result.setHours(23, 59, 59, 999);
  return result;
};

/**
 * Get age from date of birth
 */
export const calculateAge = (dateOfBirth: Date | string): number => {
  const today = getSATime();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
};

/**
 * Check if date is a business day (Monday-Friday)
 */
export const isBusinessDay = (date: Date | string): boolean => {
  const d = new Date(date);
  const dayOfWeek = d.getDay();
  return dayOfWeek >= 1 && dayOfWeek <= 5;
};

/**
 * Get next business day
 */
export const getNextBusinessDay = (date: Date | string): Date => {
  let result = new Date(date);
  
  do {
    result = addDays(result, 1);
  } while (!isBusinessDay(result));
  
  return result;
};

/**
 * Format duration in milliseconds to human readable
 */
export const formatDuration = (milliseconds: number): string => {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days}d ${hours % 24}h ${minutes % 60}m`;
  } else if (hours > 0) {
    return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  } else {
    return `${seconds}s`;
  }
};

/**
 * Parse flexible date input
 */
export const parseDate = (input: string | Date | number): Date | null => {
  if (input instanceof Date) {
    return isNaN(input.getTime()) ? null : input;
  }

  if (typeof input === 'number') {
    const date = new Date(input);
    return isNaN(date.getTime()) ? null : date;
  }

  if (typeof input === 'string') {
    // Handle common SA date formats
    const saFormats = [
      /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/, // DD/MM/YYYY or D/M/YYYY
      /^(\d{4})-(\d{1,2})-(\d{1,2})$/, // YYYY-MM-DD or YYYY-M-D
      /^(\d{1,2})-(\d{1,2})-(\d{4})$/, // DD-MM-YYYY or D-M-YYYY
    ];

    for (const format of saFormats) {
      const match = input.match(format);
      if (match) {
        let day: number, month: number, year: number;
        
        if (format === saFormats[0] || format === saFormats[2]) {
          // DD/MM/YYYY or DD-MM-YYYY format
          [, day, month, year] = match.map(Number);
        } else {
          // YYYY-MM-DD format
          [, year, month, day] = match.map(Number);
        }
        
        const date = new Date(year, month - 1, day);
        return isNaN(date.getTime()) ? null : date;
      }
    }

    // Fallback to native Date parsing
    const date = new Date(input);
    return isNaN(date.getTime()) ? null : date;
  }

  return null;
};
