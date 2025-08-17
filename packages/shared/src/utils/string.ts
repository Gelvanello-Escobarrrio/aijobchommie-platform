/**
 * String utility functions for AI Job Chommie platform
 */

/**
 * Capitalize first letter of a string
 */
export const capitalize = (str: string): string => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Convert string to title case
 */
export const toTitleCase = (str: string): string => {
  if (!str) return '';
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Convert string to kebab-case (URL friendly)
 */
export const toKebabCase = (str: string): string => {
  if (!str) return '';
  return str
    .replace(/[^a-zA-Z0-9\s]/g, '') // Remove special characters
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .toLowerCase();
};

/**
 * Convert string to camelCase
 */
export const toCamelCase = (str: string): string => {
  if (!str) return '';
  return str
    .replace(/[^a-zA-Z0-9\s]/g, '') // Remove special characters
    .trim()
    .split(/\s+/)
    .map((word, index) => 
      index === 0 ? word.toLowerCase() : capitalize(word)
    )
    .join('');
};

/**
 * Generate URL-friendly slug from string
 */
export const generateSlug = (str: string): string => {
  if (!str) return '';
  return str
    .normalize('NFD') // Normalize unicode characters
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove non-alphanumeric except spaces and hyphens
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
};

/**
 * Truncate string to specified length with ellipsis
 */
export const truncate = (str: string, length: number, suffix = '...'): string => {
  if (!str || str.length <= length) return str;
  return str.substring(0, length - suffix.length) + suffix;
};

/**
 * Truncate string to specified number of words
 */
export const truncateWords = (str: string, wordCount: number, suffix = '...'): string => {
  if (!str) return '';
  const words = str.trim().split(/\s+/);
  if (words.length <= wordCount) return str;
  return words.slice(0, wordCount).join(' ') + suffix;
};

/**
 * Extract initials from full name
 */
export const getInitials = (name: string, maxInitials = 2): string => {
  if (!name) return '';
  
  const words = name
    .trim()
    .split(/\s+/)
    .filter(word => word.length > 0)
    .slice(0, maxInitials);
    
  return words
    .map(word => word.charAt(0).toUpperCase())
    .join('');
};

/**
 * Remove extra whitespace and normalize spacing
 */
export const normalizeWhitespace = (str: string): string => {
  if (!str) return '';
  return str.replace(/\s+/g, ' ').trim();
};

/**
 * Strip HTML tags from string
 */
export const stripHtml = (str: string): string => {
  if (!str) return '';
  return str.replace(/<[^>]*>/g, '');
};

/**
 * Extract plain text from HTML and normalize
 */
export const htmlToPlainText = (html: string): string => {
  if (!html) return '';
  return normalizeWhitespace(stripHtml(html));
};

/**
 * Generate random string
 */
export const generateRandomString = (
  length: number, 
  chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
): string => {
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

/**
 * Generate random alphanumeric ID
 */
export const generateId = (length = 12): string => {
  return generateRandomString(length, 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789');
};

/**
 * Mask sensitive information (email, phone, etc.)
 */
export const maskEmail = (email: string): string => {
  if (!email || !email.includes('@')) return email;
  
  const [username, domain] = email.split('@');
  if (username.length <= 2) return email;
  
  const maskedUsername = username.charAt(0) + '*'.repeat(username.length - 2) + username.charAt(username.length - 1);
  return `${maskedUsername}@${domain}`;
};

/**
 * Mask phone number
 */
export const maskPhone = (phone: string): string => {
  if (!phone) return phone;
  
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length < 4) return phone;
  
  const lastFour = cleaned.slice(-4);
  const masked = '*'.repeat(cleaned.length - 4);
  return `${masked}${lastFour}`;
};

/**
 * Format file size in human readable format
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const k = 1024;
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const size = bytes / Math.pow(k, i);
  
  return `${size.toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
};

/**
 * Format currency (South African Rand)
 */
export const formatCurrency = (
  amount: number,
  currency = 'ZAR',
  locale = 'en-ZA'
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(amount);
};

/**
 * Format number with separators
 */
export const formatNumber = (
  num: number,
  locale = 'en-ZA',
  options?: Intl.NumberFormatOptions
): string => {
  return new Intl.NumberFormat(locale, options).format(num);
};

/**
 * Pluralize word based on count
 */
export const pluralize = (count: number, singular: string, plural?: string): string => {
  if (count === 1) return singular;
  return plural || `${singular}s`;
};

/**
 * Count words in text
 */
export const countWords = (text: string): number => {
  if (!text) return 0;
  return text.trim().split(/\s+/).filter(word => word.length > 0).length;
};

/**
 * Estimate reading time in minutes
 */
export const estimateReadingTime = (text: string, wordsPerMinute = 200): number => {
  const wordCount = countWords(text);
  return Math.ceil(wordCount / wordsPerMinute);
};

/**
 * Highlight search terms in text
 */
export const highlightText = (
  text: string,
  searchTerm: string,
  highlightClass = 'highlight'
): string => {
  if (!text || !searchTerm) return text;
  
  const regex = new RegExp(`(${searchTerm})`, 'gi');
  return text.replace(regex, `<span class="${highlightClass}">$1</span>`);
};

/**
 * Create excerpt from text
 */
export const createExcerpt = (
  text: string,
  maxLength = 160,
  searchTerm?: string
): string => {
  if (!text) return '';
  
  const plainText = htmlToPlainText(text);
  
  // If there's a search term, try to create excerpt around it
  if (searchTerm) {
    const lowerText = plainText.toLowerCase();
    const lowerTerm = searchTerm.toLowerCase();
    const termIndex = lowerText.indexOf(lowerTerm);
    
    if (termIndex !== -1) {
      const start = Math.max(0, termIndex - Math.floor(maxLength / 2));
      const excerpt = plainText.substring(start, start + maxLength);
      return start > 0 ? `...${excerpt}...` : `${excerpt}...`;
    }
  }
  
  return truncate(plainText, maxLength);
};

/**
 * Clean and normalize user input
 */
export const sanitizeInput = (input: string): string => {
  if (!input) return '';
  
  return input
    .trim()
    .replace(/[\x00-\x1F\x7F]/g, '') // Remove control characters
    .replace(/\s+/g, ' ') // Normalize whitespace
    .substring(0, 1000); // Limit length
};

/**
 * Check if string contains only whitespace
 */
export const isBlank = (str: string): boolean => {
  return !str || str.trim().length === 0;
};

/**
 * Check if string is empty or null/undefined
 */
export const isEmpty = (str?: string | null): boolean => {
  return str == null || str === '';
};

/**
 * Pad string with zeros
 */
export const padWithZeros = (num: number, length: number): string => {
  return num.toString().padStart(length, '0');
};

/**
 * Compare strings ignoring case and whitespace
 */
export const fuzzyMatch = (str1: string, str2: string): boolean => {
  if (!str1 || !str2) return false;
  
  const normalize = (s: string) => s.toLowerCase().replace(/\s+/g, '');
  return normalize(str1) === normalize(str2);
};

/**
 * Calculate string similarity (Levenshtein distance)
 */
export const calculateSimilarity = (str1: string, str2: string): number => {
  if (str1 === str2) return 1;
  if (!str1 || !str2) return 0;
  
  const matrix = [];
  const len1 = str1.length;
  const len2 = str2.length;
  
  // Initialize matrix
  for (let i = 0; i <= len1; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= len2; j++) {
    matrix[0][j] = j;
  }
  
  // Calculate distances
  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,      // deletion
        matrix[i][j - 1] + 1,      // insertion
        matrix[i - 1][j - 1] + cost // substitution
      );
    }
  }
  
  const maxLen = Math.max(len1, len2);
  return (maxLen - matrix[len1][len2]) / maxLen;
};
