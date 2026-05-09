/** Human-readable error messages used throughout the library. */
export const ErrorMessages = {
  /** Shown when the native module is not properly linked. */
  LINKING_ERROR:
    "The package 'launcher-kit' doesn't seem to be linked. Make sure: \n\n" +
    '• You rebuilt the app after installing the package\n' +
    '• You are not using Expo Go\n',
  JSON_PARSE_ERROR: 'Failed to parse JSON data',
  BUNDLE_ID_REQUIRED: 'Bundle ID is required',
  MODULE_NOT_FOUND: 'Native module not found',
  /** Generates an error message for a failed app launch. */
  LAUNCH_APP_ERROR: (bundleId: string) =>
    `Failed to launch application: ${bundleId}`,
  DEFAULT_LAUNCHER_ERROR: 'Error getting default launcher package name:',
  SET_DEFAULT_LAUNCHER_ERROR: 'Error opening set default launcher:',
};
