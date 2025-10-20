/**
 * Client-safe utilities to prevent SSR/hydration issues
 */

export const isBrowser = typeof window !== 'undefined';

export function safeLocalStorage() {
  if (!isBrowser) {
    return {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {},
      clear: () => {},
    };
  }
  return localStorage;
}

export function safeSessionStorage() {
  if (!isBrowser) {
    return {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {},
      clear: () => {},
    };
  }
  return sessionStorage;
}

export function safeDocument() {
  if (!isBrowser) {
    return null;
  }
  return document;
}

export function safeWindow() {
  if (!isBrowser) {
    return null;
  }
  return window;
}

/**
 * Safe fetch with timeout and error handling
 */
export async function safeFetch(
  url: string,
  options: RequestInit & { timeout?: number } = {}
): Promise<Response | null> {
  const { timeout = 10000, ...fetchOptions } = options;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    console.error(`Fetch error for ${url}:`, error);
    return null;
  }
}

/**
 * Safe JSON parse with fallback
 */
export function safeJsonParse<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json);
  } catch {
    return fallback;
  }
}

/**
 * Check if code is running on client after mount
 */
export function useClientSafe() {
  if (!isBrowser) return false;
  
  try {
    return document.readyState === 'complete' || document.readyState === 'interactive';
  } catch {
    return false;
  }
}

