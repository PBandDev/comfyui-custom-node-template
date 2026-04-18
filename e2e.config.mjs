function readPort() {
  const rawPort = process.env.COMFYUI_E2E_PORT;
  if (rawPort === undefined || rawPort === "") {
    return 8199;
  }

  const port = Number.parseInt(rawPort, 10);
  if (!Number.isInteger(port) || port < 1 || port > 65_535) {
    throw new Error(`COMFYUI_E2E_PORT must be an integer from 1 to 65535, got "${rawPort}".`);
  }

  return port;
}

const port = readPort();

export const e2eConfig = {
  comfyRevision: "v0.18.1",
  comfyCliVersion: "1.7.2",
  port,
  workspaceDir: ".e2e/comfyui",
  comfyDir: ".e2e/comfyui",
  venvDir: ".e2e/venv",
  pidFile: `.e2e/comfy-${port}.pid`,
  logFile: `.e2e/comfy-${port}.log`,
  timeouts: {
    startupMs: 120_000,
    pageLoadMs: 30_000,
  },
  baseUrl: `http://127.0.0.1:${port}`,
};
