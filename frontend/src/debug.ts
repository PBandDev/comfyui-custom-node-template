import { LOGGING_PREFIX, SETTINGS_IDS } from "./constants";

export type DebugSettingReader = (id: string) => boolean;

export function isDebugEnabled(reader: DebugSettingReader | undefined): boolean {
  try {
    return reader?.(SETTINGS_IDS.DEBUG_LOGGING) ?? false;
  } catch {
    return false;
  }
}

export function debugLog(
  reader: DebugSettingReader | undefined,
  message: string,
  ...args: readonly unknown[]
): void {
  if (isDebugEnabled(reader)) {
    console.log(`${LOGGING_PREFIX} ${message}`, ...args);
  }
}
