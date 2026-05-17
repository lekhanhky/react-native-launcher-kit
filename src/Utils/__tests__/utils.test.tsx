import { NativeModules, DeviceEventEmitter } from 'react-native';

// Mock react-native
jest.mock('react-native', () => ({
  NativeModules: {
    LauncherKit: {
      getApps: jest.fn(),
      launchApplication: jest.fn(),
      isPackageInstalled: jest.fn(),
      getDefaultLauncherPackageName: jest.fn(),
      openAlarmApp: jest.fn(),
      getBatteryStatus: jest.fn(),
      openSetDefaultLauncher: jest.fn(),
      startListeningForBatteryChanges: jest.fn(),
      stopListeningForBatteryChanges: jest.fn(),
      startListeningForAppInstallations: jest.fn(),
      stopListeningForAppInstallations: jest.fn(),
      startListeningForAppRemovals: jest.fn(),
      stopListeningForAppRemovals: jest.fn(),
      requestDefaultLauncher: jest.fn(),
      goToSettings: jest.fn(),
    },
  },
  DeviceEventEmitter: {
    addListener: jest.fn(() => ({ remove: jest.fn() })),
    removeAllListeners: jest.fn(),
  },
  TurboModuleRegistry: {
    getEnforcing: jest.fn(),
  },
  Platform: {
    select: jest.fn((obj) => obj.default),
    OS: 'android',
  },
}));

import { handleError, safeJsonParse, createEventListener } from '../helper';
import { initializeModule } from '../moduleInitializer';

describe('handleError', () => {
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it('should return the fallback value', () => {
    const result = handleError(new Error('test'), 'Something failed', 'fallback');
    expect(result).toBe('fallback');
  });

  it('should return a numeric fallback', () => {
    const result = handleError(new Error('test'), 'Something failed', 42);
    expect(result).toBe(42);
  });

  it('should return a boolean fallback', () => {
    const result = handleError(new Error('test'), 'Something failed', false);
    expect(result).toBe(false);
  });

  it('should return an object fallback', () => {
    const fallback = { level: 0, isCharging: false };
    const result = handleError(new Error('test'), 'Something failed', fallback);
    expect(result).toEqual(fallback);
  });

  it('should log error in __DEV__ mode', () => {
    handleError(new Error('test error'), 'Operation failed', null);
    expect(consoleSpy).toHaveBeenCalledWith(
      'Operation failed',
      '',
      '\nError:',
      expect.any(Error)
    );
  });

  it('should log additional info when provided', () => {
    handleError(
      new Error('test error'),
      'Operation failed',
      null,
      { key: 'value' }
    );
    expect(consoleSpy).toHaveBeenCalledWith(
      'Operation failed',
      expect.stringContaining('Additional Info:'),
      '\nError:',
      expect.any(Error)
    );
  });
});

describe('safeJsonParse', () => {
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it('should parse valid JSON', () => {
    const data = [{ label: 'App', packageName: 'com.app' }];
    const result = safeJsonParse(JSON.stringify(data), []);
    expect(result).toEqual(data);
  });

  it('should return fallback for null input', () => {
    const result = safeJsonParse(null, []);
    expect(result).toEqual([]);
  });

  it('should return fallback for undefined input', () => {
    const result = safeJsonParse(undefined, 'default');
    expect(result).toBe('default');
  });

  it('should return fallback for empty string', () => {
    const result = safeJsonParse('', 'fallback');
    expect(result).toBe('fallback');
  });

  it('should return fallback for invalid JSON', () => {
    const result = safeJsonParse('not valid json {{{', []);
    expect(result).toEqual([]);
  });

  it('should parse a simple string value', () => {
    const result = safeJsonParse('"hello"', '');
    expect(result).toBe('hello');
  });

  it('should parse a number', () => {
    const result = safeJsonParse('123', 0);
    expect(result).toBe(123);
  });

  it('should parse a boolean', () => {
    const result = safeJsonParse('true', false);
    expect(result).toBe(true);
  });
});

describe('createEventListener', () => {
  let mockRemove: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockRemove = jest.fn();
    (DeviceEventEmitter.addListener as jest.Mock).mockReturnValue({
      remove: mockRemove,
    });
  });

  it('should register an event listener with DeviceEventEmitter', () => {
    const callback = jest.fn();
    createEventListener('testEvent', callback);

    expect(DeviceEventEmitter.addListener).toHaveBeenCalledWith(
      'testEvent',
      callback
    );
  });

  it('should return an unsubscribe function', () => {
    const callback = jest.fn();
    const unsubscribe = createEventListener('testEvent', callback);

    expect(typeof unsubscribe).toBe('function');
  });

  it('should remove listener when unsubscribe is called', () => {
    const callback = jest.fn();
    const unsubscribe = createEventListener('testEvent', callback);

    unsubscribe();

    expect(mockRemove).toHaveBeenCalled();
  });

  it('should pass event data to the callback', () => {
    const callback = jest.fn();
    (DeviceEventEmitter.addListener as jest.Mock).mockImplementation(
      (_event, cb) => {
        cb('event-data');
        return { remove: jest.fn() };
      }
    );

    createEventListener('testEvent', callback);

    expect(callback).toHaveBeenCalledWith('event-data');
  });
});

describe('initializeModule', () => {
  it('should return NativeModules.LauncherKit when available', () => {
    const module = initializeModule();
    expect(module).toBe(NativeModules.LauncherKit);
  });

  it('should return TurboModule when __turboModuleProxy is available', () => {
    const mockTurboModule = { getApps: jest.fn() };
    (global as any).__turboModuleProxy = true;

    const { TurboModuleRegistry } = require('react-native');
    TurboModuleRegistry.getEnforcing.mockReturnValue(mockTurboModule);

    const module = initializeModule();
    expect(module).toBe(mockTurboModule);

    delete (global as any).__turboModuleProxy;
  });

  it('should fall through to NativeModules if TurboModule throws', () => {
    (global as any).__turboModuleProxy = true;

    const { TurboModuleRegistry } = require('react-native');
    TurboModuleRegistry.getEnforcing.mockImplementation(() => {
      throw new Error('Not available');
    });

    const module = initializeModule();
    expect(module).toBe(NativeModules.LauncherKit);

    delete (global as any).__turboModuleProxy;
  });

  it('should return a proxy that throws when module is not available', () => {
    (global as any).__turboModuleProxy = false;
    const originalModule = NativeModules.LauncherKit;
    (NativeModules as any).LauncherKit = undefined;

    const module = initializeModule();
    expect(() => (module as any).anyMethod).toThrow(
      /doesn't seem to be linked/
    );

    (NativeModules as any).LauncherKit = originalModule;
  });
});
