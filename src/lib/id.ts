let counter = 0

/**
 * Generates a simple unique ID combining timestamp + counter + random.
 */
export function generateId(): string {
  counter += 1
  return `${Date.now().toString(36)}-${counter.toString(36)}-${Math.random().toString(36).slice(2, 7)}`
}
