import { useState, useEffect } from 'react'

/**
 * Returns a debounced version of the value that only updates
 * after `delay` milliseconds have passed since the last change.
 */
export function useDebouncedValue<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState<T>(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debounced
}
