/**
 * Utility functions for error handling, JSON parsing, and event management.
 *
 * @author Louay Sleman
 * @contact louayakram12@hotmail.com
 * @linkedin https://www.linkedin.com/in/louay-sleman
 * @version 2.0.0
 * @website https://louaysleman.com
 * @copyright Copyright (c) 2024 Louay Sleman. All rights reserved.
 */
import { ErrorMessages } from '../constants';
import { DeviceEventEmitter } from 'react-native';

/**
 * Logs an error in development mode and returns a fallback value.
 *
 * @param error - The caught error object.
 * @param errorMessage - A human-readable description of the failure.
 * @param fallback - The value to return when an error occurs.
 * @param additionalInfo - Optional context to include in the log.
 * @returns The fallback value.
 */
export const handleError = <T>(
  error: unknown,
  errorMessage: string,
  fallback: T,
  additionalInfo?: Record<string, unknown>
): T => {
  if (__DEV__) {
    console.error(
      errorMessage,
      additionalInfo ? `\nAdditional Info: ${additionalInfo}` : '',
      '\nError:',
      error
    );
  }
  return fallback;
};

/**
 * Safely parses a JSON string, returning a fallback on failure or null/undefined input.
 *
 * @param jsonString - The JSON string to parse.
 * @param fallback - The value to return if parsing fails.
 * @returns The parsed value or the fallback.
 *
 * @example
 * ```ts
 * const apps = safeJsonParse<AppDetail[]>(rawJson, []);
 * ```
 */
export const safeJsonParse = <T>(
  jsonString: string | null | undefined,
  fallback: T
): T => {
  if (!jsonString) return fallback;
  try {
    return JSON.parse(jsonString) as T;
  } catch {
    return handleError(
      new Error(ErrorMessages.JSON_PARSE_ERROR),
      ErrorMessages.JSON_PARSE_ERROR,
      fallback
    );
  }
};

/**
 * Creates a DeviceEventEmitter listener and returns an unsubscribe function.
 *
 * @param eventName - The native event name to listen for.
 * @param callback - The function invoked when the event fires.
 * @returns A cleanup function that removes the listener.
 */
export const createEventListener = <T = string>(
  eventName: string,
  callback: (data: T) => void
): (() => void) => {
  const subscription = DeviceEventEmitter.addListener(eventName, callback);
  return () => subscription.remove();
};
