import { test as setup } from "@playwright/test";
import { execFileSync, spawn } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  openSync,
  readFileSync,
  rmSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { e2eConfig } from "../../e2e.config.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, "..", "..");
const workspaceDir = resolve(projectRoot, e2eConfig.workspaceDir);
const pidFile = resolve(projectRoot, e2eConfig.pidFile);
const logFile = resolve(projectRoot, e2eConfig.logFile);
const comfyBinary =
  process.platform === "win32"
    ? resolve(projectRoot, e2eConfig.venvDir, "Scripts", "comfy.exe")
    : resolve(projectRoot, e2eConfig.venvDir, "bin", "comfy");

async function isReady() {
  try {
    const response = await fetch(`${e2eConfig.baseUrl}/api/object_info`);
    return response.ok;
  } catch {
    return false;
  }
}

function stopExistingServer() {
  if (!existsSync(pidFile)) {
    return;
  }

  const pid = Number.parseInt(readFileSync(pidFile, "utf8").trim(), 10);
  if (Number.isNaN(pid)) {
    unlinkSync(pidFile);
    return;
  }

  try {
    if (process.platform === "win32") {
      execFileSync("taskkill", ["/F", "/T", "/PID", String(pid)], { stdio: "ignore" });
    } else {
      process.kill(-pid, "SIGTERM");
    }
  } catch {
    // Ignore already-exited processes and continue with a fresh launch.
  }

  if (existsSync(pidFile)) {
    unlinkSync(pidFile);
  }
}

async function waitForReady() {
  const startedAt = Date.now();

  while (Date.now() - startedAt < e2eConfig.timeouts.startupMs) {
    if (await isReady()) {
      return;
    }

    await new Promise((resolvePromise) => setTimeout(resolvePromise, 1_000));
  }

  const logOutput = existsSync(logFile) ? readFileSync(logFile, "utf8") : "No ComfyUI log output.";
  throw new Error(
    `ComfyUI did not become ready within ${e2eConfig.timeouts.startupMs}ms.\n${logOutput}`,
  );
}

setup("start repo-local ComfyUI for e2e", async () => {
  if (!existsSync(comfyBinary)) {
    throw new Error(
      "Missing repo-local comfy-cli. Run `pnpm setup:e2e` before Playwright starts.",
    );
  }

  stopExistingServer();
  mkdirSync(resolve(projectRoot, e2eConfig.workspaceDir), { recursive: true });
  mkdirSync(dirname(logFile), { recursive: true });
  rmSync(logFile, { force: true });

  const logFd = openSync(logFile, "a");
  const child = spawn(
    comfyBinary,
    [
      "--skip-prompt",
      `--workspace=${workspaceDir}`,
      "launch",
      "--",
      "--cpu",
      "--port",
      String(e2eConfig.port),
    ],
    {
      cwd: projectRoot,
      detached: true,
      stdio: ["ignore", logFd, logFd],
      windowsHide: true,
    },
  );

  if (child.pid === undefined) {
    throw new Error("Failed to start ComfyUI for E2E tests.");
  }

  writeFileSync(pidFile, String(child.pid), "utf8");
  child.unref();
  await waitForReady();
});
