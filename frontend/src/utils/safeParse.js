/**
 * Safely parses JSON from localStorage.
 * Returns null if key doesn't exist or JSON is corrupted (prevents white-screen crashes).
 */
export function safeParse(key) {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return null;
    return JSON.parse(raw);
  } catch {
    console.warn(`[safeParse] Corrupted data in localStorage key "${key}", removing it.`);
    localStorage.removeItem(key);
    return null;
  }
}
