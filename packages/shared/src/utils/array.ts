/**
 * Array utility functions for AI Job Chommie platform
 */

/**
 * Remove duplicates from array
 */
export const unique = <T>(array: T[]): T[] => {
  return Array.from(new Set(array));
};

/**
 * Remove duplicates from array of objects by key
 */
export const uniqueBy = <T>(array: T[], key: keyof T): T[] => {
  const seen = new Set();
  return array.filter(item => {
    const value = item[key];
    if (seen.has(value)) {
      return false;
    }
    seen.add(value);
    return true;
  });
};

/**
 * Group array of objects by key
 */
export const groupBy = <T, K extends keyof T>(
  array: T[],
  key: K
): Record<string, T[]> => {
  return array.reduce((groups, item) => {
    const groupKey = String(item[key]);
    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    groups[groupKey].push(item);
    return groups;
  }, {} as Record<string, T[]>);
};

/**
 * Sort array of objects by key
 */
export const sortBy = <T>(
  array: T[],
  key: keyof T,
  order: 'asc' | 'desc' = 'asc'
): T[] => {
  return [...array].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];
    
    if (aVal < bVal) return order === 'asc' ? -1 : 1;
    if (aVal > bVal) return order === 'asc' ? 1 : -1;
    return 0;
  });
};

/**
 * Sort array by multiple keys
 */
export const sortByMultiple = <T>(
  array: T[],
  keys: Array<{ key: keyof T; order?: 'asc' | 'desc' }>
): T[] => {
  return [...array].sort((a, b) => {
    for (const { key, order = 'asc' } of keys) {
      const aVal = a[key];
      const bVal = b[key];
      
      if (aVal < bVal) return order === 'asc' ? -1 : 1;
      if (aVal > bVal) return order === 'asc' ? 1 : -1;
    }
    return 0;
  });
};

/**
 * Paginate array
 */
export const paginate = <T>(
  array: T[],
  page: number,
  limit: number
): {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
} => {
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const data = array.slice(startIndex, endIndex);
  const total = array.length;
  const totalPages = Math.ceil(total / limit);

  return {
    data,
    total,
    page,
    limit,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1
  };
};

/**
 * Chunk array into smaller arrays
 */
export const chunk = <T>(array: T[], size: number): T[][] => {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
};

/**
 * Shuffle array randomly
 */
export const shuffle = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

/**
 * Get random element from array
 */
export const sample = <T>(array: T[]): T | undefined => {
  if (array.length === 0) return undefined;
  return array[Math.floor(Math.random() * array.length)];
};

/**
 * Get multiple random elements from array
 */
export const sampleSize = <T>(array: T[], size: number): T[] => {
  if (size >= array.length) return shuffle(array);
  
  const shuffled = shuffle(array);
  return shuffled.slice(0, size);
};

/**
 * Flatten nested arrays
 */
export const flatten = <T>(array: (T | T[])[]): T[] => {
  return array.reduce<T[]>((flat, item) => {
    return flat.concat(Array.isArray(item) ? flatten(item) : item);
  }, []);
};

/**
 * Zip arrays together
 */
export const zip = <T, U>(array1: T[], array2: U[]): Array<[T, U]> => {
  const length = Math.min(array1.length, array2.length);
  const result: Array<[T, U]> = [];
  
  for (let i = 0; i < length; i++) {
    result.push([array1[i], array2[i]]);
  }
  
  return result;
};

/**
 * Find difference between arrays
 */
export const difference = <T>(array1: T[], array2: T[]): T[] => {
  const set2 = new Set(array2);
  return array1.filter(item => !set2.has(item));
};

/**
 * Find intersection of arrays
 */
export const intersection = <T>(array1: T[], array2: T[]): T[] => {
  const set2 = new Set(array2);
  return array1.filter(item => set2.has(item));
};

/**
 * Find union of arrays
 */
export const union = <T>(...arrays: T[][]): T[] => {
  return unique(flatten(arrays));
};

/**
 * Check if arrays are equal
 */
export const isEqual = <T>(array1: T[], array2: T[]): boolean => {
  if (array1.length !== array2.length) return false;
  
  return array1.every((item, index) => item === array2[index]);
};

/**
 * Check if array includes all items
 */
export const includesAll = <T>(array: T[], items: T[]): boolean => {
  return items.every(item => array.includes(item));
};

/**
 * Check if array includes any items
 */
export const includesAny = <T>(array: T[], items: T[]): boolean => {
  return items.some(item => array.includes(item));
};

/**
 * Remove items from array
 */
export const remove = <T>(array: T[], ...items: T[]): T[] => {
  const itemsSet = new Set(items);
  return array.filter(item => !itemsSet.has(item));
};

/**
 * Remove items from array by predicate
 */
export const removeBy = <T>(
  array: T[],
  predicate: (item: T, index: number, array: T[]) => boolean
): T[] => {
  return array.filter((item, index, arr) => !predicate(item, index, arr));
};

/**
 * Move item in array
 */
export const move = <T>(array: T[], fromIndex: number, toIndex: number): T[] => {
  const result = [...array];
  const [removed] = result.splice(fromIndex, 1);
  result.splice(toIndex, 0, removed);
  return result;
};

/**
 * Insert item at index
 */
export const insert = <T>(array: T[], index: number, ...items: T[]): T[] => {
  const result = [...array];
  result.splice(index, 0, ...items);
  return result;
};

/**
 * Update item in array by index
 */
export const updateAt = <T>(array: T[], index: number, item: T): T[] => {
  if (index < 0 || index >= array.length) return array;
  
  const result = [...array];
  result[index] = item;
  return result;
};

/**
 * Update items in array by predicate
 */
export const updateWhere = <T>(
  array: T[],
  predicate: (item: T, index: number, array: T[]) => boolean,
  updater: (item: T, index: number, array: T[]) => T
): T[] => {
  return array.map((item, index, arr) => {
    return predicate(item, index, arr) ? updater(item, index, arr) : item;
  });
};

/**
 * Get min/max values from array of objects
 */
export const minBy = <T>(array: T[], key: keyof T): T | undefined => {
  if (array.length === 0) return undefined;
  
  return array.reduce((min, item) => {
    return item[key] < min[key] ? item : min;
  });
};

export const maxBy = <T>(array: T[], key: keyof T): T | undefined => {
  if (array.length === 0) return undefined;
  
  return array.reduce((max, item) => {
    return item[key] > max[key] ? item : max;
  });
};

/**
 * Sum values in array of objects
 */
export const sumBy = <T>(array: T[], key: keyof T): number => {
  return array.reduce((sum, item) => {
    const value = item[key];
    return sum + (typeof value === 'number' ? value : 0);
  }, 0);
};

/**
 * Average values in array of objects
 */
export const avgBy = <T>(array: T[], key: keyof T): number => {
  if (array.length === 0) return 0;
  return sumBy(array, key) / array.length;
};

/**
 * Count occurrences in array
 */
export const countBy = <T, K extends keyof T>(
  array: T[],
  key: K
): Record<string, number> => {
  return array.reduce((counts, item) => {
    const value = String(item[key]);
    counts[value] = (counts[value] || 0) + 1;
    return counts;
  }, {} as Record<string, number>);
};

/**
 * Compact array (remove falsy values)
 */
export const compact = <T>(array: (T | null | undefined | false | 0 | '')[]): T[] => {
  return array.filter(Boolean) as T[];
};

/**
 * Create range of numbers
 */
export const range = (start: number, end?: number, step = 1): number[] => {
  if (end === undefined) {
    end = start;
    start = 0;
  }
  
  const result: number[] = [];
  const actualStep = step || 1;
  
  if (actualStep > 0) {
    for (let i = start; i < end; i += actualStep) {
      result.push(i);
    }
  } else {
    for (let i = start; i > end; i += actualStep) {
      result.push(i);
    }
  }
  
  return result;
};

/**
 * Create array with repeated value
 */
export const repeat = <T>(value: T, count: number): T[] => {
  return Array(count).fill(value);
};

/**
 * Check if array is empty
 */
export const isEmpty = <T>(array: T[] | null | undefined): boolean => {
  return !array || array.length === 0;
};

/**
 * Get first n elements
 */
export const take = <T>(array: T[], count: number): T[] => {
  return array.slice(0, Math.max(0, count));
};

/**
 * Get last n elements
 */
export const takeLast = <T>(array: T[], count: number): T[] => {
  return array.slice(-Math.max(0, count));
};

/**
 * Skip first n elements
 */
export const drop = <T>(array: T[], count: number): T[] => {
  return array.slice(Math.max(0, count));
};

/**
 * Skip last n elements
 */
export const dropLast = <T>(array: T[], count: number): T[] => {
  return array.slice(0, -Math.max(0, count));
};
