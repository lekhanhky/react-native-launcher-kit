/**
 * Battery-related type definitions.
 *
 * @author Louay Sleman
 * @contact louayakram12@hotmail.com
 * @linkedin https://www.linkedin.com/in/louay-sleman
 * @version 2.1.0
 * @website https://louaysleman.com
 * @copyright Copyright (c) 2024 Louay Sleman. All rights reserved.
 */

/** Represents the current battery state of the device. */
export interface BatteryStatus {
  /** Battery level as a percentage (0-100). */
  level: number;
  /** Whether the device is currently charging. */
  isCharging: boolean;
}
