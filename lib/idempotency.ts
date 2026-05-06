/**
 * Idempotency Key Utilities
 * 
 * Generates and manages idempotency keys for API requests
 * to prevent duplicate operations (especially payments)
 */

/**
 * Generate a unique idempotency key
 * 
 * Format: idem_{userId}_{orderId}_{timestamp}_{random}
 * Example: idem_user123_order456_1234567890_abc123
 * 
 * @param userId - Current user ID
 * @param orderId - Order ID for the payment
 * @returns Unique idempotency key
 */
export function generateIdempotencyKey(
  userId: string,
  orderId: string,
): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 9);
  return `idem_${userId}_${orderId}_${timestamp}_${random}`;
}

/**
 * Generate a simple idempotency key (without user/order context)
 * 
 * Format: idem_{timestamp}_{random}
 * Example: idem_1234567890_abc123xyz
 * 
 * @returns Unique idempotency key
 */
export function generateSimpleIdempotencyKey(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 15);
  return `idem_${timestamp}_${random}`;
}

/**
 * Validate idempotency key format
 * 
 * @param key - Idempotency key to validate
 * @returns True if valid, false otherwise
 */
export function isValidIdempotencyKey(key: string): boolean {
  // Must start with 'idem_' and contain only alphanumeric, underscore, hyphen
  // Max length: 255 characters
  return /^idem_[a-zA-Z0-9_-]{1,240}$/.test(key);
}

/**
 * Extract timestamp from idempotency key
 * 
 * @param key - Idempotency key
 * @returns Timestamp in milliseconds, or null if not found
 */
export function extractTimestamp(key: string): number | null {
  const parts = key.split('_');
  
  // Try to find timestamp (should be a number)
  for (const part of parts) {
    const num = parseInt(part, 10);
    if (!isNaN(num) && num > 1000000000000) { // Valid timestamp
      return num;
    }
  }
  
  return null;
}

/**
 * Check if idempotency key is expired
 * 
 * @param key - Idempotency key
 * @param maxAgeMs - Maximum age in milliseconds (default: 24 hours)
 * @returns True if expired, false otherwise
 */
export function isIdempotencyKeyExpired(
  key: string,
  maxAgeMs: number = 24 * 60 * 60 * 1000, // 24 hours
): boolean {
  const timestamp = extractTimestamp(key);
  
  if (!timestamp) {
    return false; // Can't determine age, assume not expired
  }
  
  const age = Date.now() - timestamp;
  return age > maxAgeMs;
}

/**
 * Idempotency Key Manager
 * 
 * Manages idempotency keys with localStorage persistence
 * for retry scenarios
 */
export class IdempotencyKeyManager {
  private static readonly STORAGE_KEY = 'idempotency_keys';
  private static readonly MAX_KEYS = 100; // Keep last 100 keys
  
  /**
   * Store idempotency key for later retrieval
   * 
   * @param context - Context identifier (e.g., orderId)
   * @param key - Idempotency key to store
   */
  static store(context: string, key: string): void {
    try {
      const keys = this.getAll();
      keys[context] = {
        key,
        timestamp: Date.now(),
      };
      
      // Limit storage size
      const entries = Object.entries(keys);
      if (entries.length > this.MAX_KEYS) {
        // Keep only most recent keys
        const sorted = entries.sort((a, b) => b[1].timestamp - a[1].timestamp);
        const limited = Object.fromEntries(sorted.slice(0, this.MAX_KEYS));
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(limited));
      } else {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(keys));
      }
    } catch (error) {
      console.error('Failed to store idempotency key:', error);
    }
  }
  
  /**
   * Retrieve stored idempotency key
   * 
   * @param context - Context identifier (e.g., orderId)
   * @returns Stored key or null if not found
   */
  static retrieve(context: string): string | null {
    try {
      const keys = this.getAll();
      const entry = keys[context];
      
      if (!entry) {
        return null;
      }
      
      // Check if expired (24 hours)
      if (isIdempotencyKeyExpired(entry.key)) {
        this.remove(context);
        return null;
      }
      
      return entry.key;
    } catch (error) {
      console.error('Failed to retrieve idempotency key:', error);
      return null;
    }
  }
  
  /**
   * Remove stored idempotency key
   * 
   * @param context - Context identifier (e.g., orderId)
   */
  static remove(context: string): void {
    try {
      const keys = this.getAll();
      delete keys[context];
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(keys));
    } catch (error) {
      console.error('Failed to remove idempotency key:', error);
    }
  }
  
  /**
   * Clear all stored idempotency keys
   */
  static clear(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear idempotency keys:', error);
    }
  }
  
  /**
   * Get all stored idempotency keys
   * 
   * @returns Object with context as key and {key, timestamp} as value
   */
  private static getAll(): Record<string, { key: string; timestamp: number }> {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      console.error('Failed to get idempotency keys:', error);
      return {};
    }
  }
}
