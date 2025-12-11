import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

/**
 * Service for managing browser storage (localStorage)
 * Provides a centralized, type-safe way to access stored data
 * Includes error handling and JSON serialization/deserialization
 */
@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private readonly storageKeys = environment.storage;

  constructor() {}

  /**
   * Save data to localStorage with automatic JSON serialization
   * @param key - Storage key identifier
   * @param value - Data to store (will be JSON stringified)
   * @throws Error if localStorage is unavailable or quota exceeded
   */
  setItem<T>(key: keyof typeof this.storageKeys, value: T): void {
    try {
      const storageKey = this.storageKeys[key];
      const serialized = JSON.stringify(value);
      localStorage.setItem(storageKey, serialized);
    } catch (error) {
      console.error(`Failed to save data to localStorage for key "${key}":`, error);
      throw new Error(`Storage error: Unable to save ${key}`);
    }
  }

  /**
   * Retrieve data from localStorage with automatic JSON deserialization
   * @param key - Storage key identifier
   * @param defaultValue - Value to return if key doesn't exist
   * @returns Parsed data or defaultValue
   * @throws Error if JSON parsing fails
   */
  getItem<T>(key: keyof typeof this.storageKeys, defaultValue: T): T {
    try {
      const storageKey = this.storageKeys[key];
      const item = localStorage.getItem(storageKey);
      
      if (item === null) {
        return defaultValue;
      }
      
      return JSON.parse(item) as T;
    } catch (error) {
      console.error(`Failed to retrieve data from localStorage for key "${key}":`, error);
      return defaultValue;
    }
  }

  /**
   * Remove data from localStorage
   * @param key - Storage key identifier
   */
  removeItem(key: keyof typeof this.storageKeys): void {
    try {
      const storageKey = this.storageKeys[key];
      localStorage.removeItem(storageKey);
    } catch (error) {
      console.error(`Failed to remove data from localStorage for key "${key}":`, error);
    }
  }

  /**
   * Check if a key exists in localStorage
   * @param key - Storage key identifier
   * @returns True if key exists, false otherwise
   */
  hasItem(key: keyof typeof this.storageKeys): boolean {
    try {
      const storageKey = this.storageKeys[key];
      return localStorage.getItem(storageKey) !== null;
    } catch (error) {
      console.error(`Failed to check localStorage for key "${key}":`, error);
      return false;
    }
  }

  /**
   * Clear all stored data (use with caution)
   */
  clear(): void {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Failed to clear localStorage:', error);
    }
  }

  /**
   * Get all storage keys for debugging
   * @returns Array of storage key values
   */
  getStorageKeys(): string[] {
    return Object.values(this.storageKeys) as string[];
  }
}
