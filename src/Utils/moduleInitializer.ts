/**
 * Module initialization utility.
 * Resolves the LauncherKit native module using TurboModules (new arch)
 * or NativeModules (legacy), with a fallback proxy that throws a helpful
 * linking error.
 *
 * @module utils/moduleInitializer
 */
import { TurboModuleRegistry, NativeModules } from 'react-native';
import { AppConfig, ErrorMessages } from '../constants';
import type { LauncherKitSpec } from '../interfaces/turboModule';

/**
 * Initializes and returns the LauncherKit native module.
 *
 * Resolution order:
 * 1. TurboModule (new architecture) if available
 * 2. NativeModules (legacy bridge)
 * 3. Proxy that throws a linking error on any access
 *
 * @returns The resolved native module instance.
 */
export const initializeModule = (): LauncherKitSpec => {
  if ((global as any).__turboModuleProxy) {
    try {
      return TurboModuleRegistry.getEnforcing<LauncherKitSpec>(
        AppConfig.MODULE_NAME
      );
    } catch (_) {
      // Fall through to NativeModules
    }
  }

  if (NativeModules[AppConfig.MODULE_NAME]) {
    return NativeModules[AppConfig.MODULE_NAME];
  }

  return new Proxy({} as LauncherKitSpec, {
    get() {
      throw new Error(ErrorMessages.LINKING_ERROR);
    },
  });
};
