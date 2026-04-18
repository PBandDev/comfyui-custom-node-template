import { afterEach, describe, expect, it, vi } from "vitest";
import { debugLog, isDebugEnabled } from "../src/debug";
import { LOGGING_PREFIX, SETTINGS_IDS } from "../src/constants";

describe("debug helpers", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns false when no debug setting reader is provided", () => {
    expect(isDebugEnabled(undefined)).toBe(false);
  });

  it("uses stable ComfyUI setting ids", () => {
    expect(SETTINGS_IDS.VERSION).toBe("My Custom Node.Version");
    expect(SETTINGS_IDS.DEBUG_LOGGING).toBe("My Custom Node.Debug Logging");
  });

  it("reads the debug logging setting from the provided reader", () => {
    const get = vi.fn<(id: string) => boolean>().mockReturnValue(true);

    expect(isDebugEnabled(get)).toBe(true);
    expect(get).toHaveBeenCalledWith(SETTINGS_IDS.DEBUG_LOGGING);
  });

  it("prefixes debug logs only when debug logging is enabled", () => {
    const consoleLog = vi.spyOn(console, "log").mockImplementation(() => {});

    debugLog(() => true, "hello", { scope: "test" });

    expect(consoleLog).toHaveBeenCalledWith(
      `${LOGGING_PREFIX} hello`,
      { scope: "test" },
    );
  });

  it("does not write debug logs when debug logging is disabled", () => {
    const consoleLog = vi.spyOn(console, "log").mockImplementation(() => {});

    debugLog(() => false, "hello");

    expect(consoleLog).not.toHaveBeenCalled();
  });

  it("returns false when the provided reader throws", () => {
    const get = () => {
      throw new Error("boom");
    };

    expect(isDebugEnabled(get)).toBe(false);
  });
});
