export const e2eConfig = {
  comfyRevision: "v0.18.1",
  comfyCliVersion: "1.7.2",
  port: 8199,
  workspaceDir: ".e2e/comfyui",
  comfyDir: ".e2e/comfyui",
  venvDir: ".e2e/venv",
  pidFile: ".e2e/comfy.pid",
  logFile: ".e2e/comfy.log",
  timeouts: {
    startupMs: 120_000,
    pageLoadMs: 30_000,
  },
  get baseUrl() {
    return `http://127.0.0.1:${this.port}`;
  },
};
