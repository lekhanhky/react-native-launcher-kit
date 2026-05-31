/** Application-wide configuration constants. */
export const AppConfig = {
  /** Default options used when fetching installed apps. */
  DEFAULT_OPTIONS: {
    includeVersion: false,
    includeAccentColor: false,
  },
  /** The registered name of the native module. */
  MODULE_NAME: 'LauncherKit',
} as const;
