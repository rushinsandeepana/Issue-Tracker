import { useState, useEffect } from 'react';

/**
 * Debounce hook for optimizing search/filter API calls
 * Prevents API calls on every keystroke
 * 
 * @param value - The value to debounce (search term)
 * @param delay - Delay in milliseconds (default: 500ms)
 * @returns Debounced value
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}