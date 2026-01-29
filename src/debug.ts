import { LOGGING_PREFIX, SETTINGS_IDS } from "./constants";

/** Check if debug logging is enabled */
export function isDebugEnabled(): boolean {
  try {
    // Access app only if it exists (not in test environment)
    if (typeof globalThis !== "undefined" && "app" in globalThis) {
      const app = (
        globalThis as {
          app?: {
            extensionManager?: { setting?: { get: <T>(id: string) => T } };
          };
        }
      ).app;
      return (
        app?.extensionManager?.setting?.get<boolean>(
          SETTINGS_IDS.DEBUG_LOGGING
        ) ?? false
      );
    }
    return false;
  } catch {
    return false;
  }
}

/** Log message only if debug logging is enabled */
export function debugLog(message: string, ...args: unknown[]): void {
  if (isDebugEnabled()) {
    console.log(`${LOGGING_PREFIX} ${message}`, ...args);
  }
}
