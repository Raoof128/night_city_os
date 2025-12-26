import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility to merge tailwind classes with logical priority.
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a date according to Persian/Gregorian calendars.
 */
export const formatPersianDate = (date = new Date()) => {
  try {
    return new Intl.DateTimeFormat('fa-IR', {
      calendar: 'persian',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  } catch (e) {
    console.warn('[System] Persian calendar not available, falling back to locale.');
    return date.toLocaleDateString();
  }
};
