import { test as teardown } from "@playwright/test";
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, unlinkSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { e2eConfig } from "../../e2e.config.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, "..", "..");
const pidFile = resolve(projectRoot, e2eConfig.pidFile);

teardown("stop repo-local ComfyUI after e2e", async () => {
  if (!existsSync(pidFile)) {
    return;
  }

  const pid = Number.parseInt(readFileSync(pidFile, "utf8").trim(), 10);
  if (!Number.isNaN(pid)) {
    try {
      if (process.platform === "win32") {
        execFileSync("taskkill", ["/F", "/T", "/PID", String(pid)], { stdio: "ignore" });
      } else {
        process.kill(-pid, "SIGTERM");
      }
    } catch {
      // Ignore already-exited processes during teardown.
    }
  }

  unlinkSync(pidFile);
});
