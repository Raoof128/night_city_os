import { useState, useEffect } from 'react';

/**
 * Custom hook for persisting React state in localStorage.
 * Includes error handling and safe fallbacks for production environments.
 *
 * @param {string} key - The key under which to store the state in localStorage.
 * @param {any} initialValue - The initial value if no stored state exists.
 * @returns {[any, Function]} - The current state and a setter function.
 */
export const usePersistentState = (key, initialValue) => {
  const [state, setState] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`[Storage Error] Failed to read key "${key}":`, error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(state));
    } catch (error) {
      console.error(`[Storage Error] Failed to write key "${key}":`, error);
    }
  }, [key, state]);

  return [state, setState];
};
