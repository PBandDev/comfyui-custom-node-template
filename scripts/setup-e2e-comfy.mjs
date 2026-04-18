import { execFileSync } from "node:child_process";
import {
  existsSync,
  lstatSync,
  mkdirSync,
  readFileSync,
  readlinkSync,
  rmSync,
  symlinkSync,
} from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { e2eConfig } from "../e2e.config.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, "..");
const workspaceDir = resolve(projectRoot, e2eConfig.workspaceDir);
const comfyDir = resolve(projectRoot, e2eConfig.comfyDir);
const workspaceVenvDir = resolve(projectRoot, e2eConfig.venvDir);
const customNodesDir = resolve(comfyDir, "custom_nodes");
const packageJsonPath = resolve(projectRoot, "package.json");
const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf8"));
const mountedNodeDir = resolve(customNodesDir, packageJson.name);
const pythonBinary =
  process.platform === "win32"
    ? resolve(workspaceVenvDir, "Scripts", "python.exe")
    : resolve(workspaceVenvDir, "bin", "python");
const comfyBinary =
  process.platform === "win32"
    ? resolve(workspaceVenvDir, "Scripts", "comfy.exe")
    : resolve(workspaceVenvDir, "bin", "comfy");

function run(command, args, label, options = {}) {
  console.log(`[setup:e2e] ${label}`);
  console.log(`[setup:e2e] $ ${command} ${args.join(" ")}`);
  execFileSync(command, args, {
    cwd: options.cwd ?? projectRoot,
    stdio: "inherit",
  });
}

function ensureWorkspaceVenv() {
  if (existsSync(pythonBinary)) {
    return;
  }

  mkdirSync(resolve(projectRoot, e2eConfig.workspaceDir, ".."), { recursive: true });
  run("uv", ["venv", workspaceVenvDir], "Create repo-local E2E virtual environment");
}

function ensureComfyCli() {
  if (existsSync(comfyBinary)) {
    return;
  }

  run(
    "uv",
    [
      "pip",
      "install",
      "--python",
      pythonBinary,
      `comfy-cli==${e2eConfig.comfyCliVersion}`,
    ],
    "Install comfy-cli into the E2E virtual environment",
  );
}

function ensurePinnedComfyInstall() {
  const mainPyPath = resolve(comfyDir, "main.py");
  if (existsSync(mainPyPath)) {
    return;
  }

  mkdirSync(dirname(comfyDir), { recursive: true });
  run(
    comfyBinary,
    [
      "--skip-prompt",
      `--workspace=${workspaceDir}`,
      "install",
      "--skip-manager",
      "--fast-deps",
      "--cpu",
      "--url",
      `https://github.com/comfyanonymous/ComfyUI.git@${e2eConfig.comfyRevision}`,
    ],
    "Install pinned ComfyUI workspace",
    { cwd: dirname(comfyDir) },
  );
}

function ensureMountedCustomNode() {
  mkdirSync(customNodesDir, { recursive: true });

  if (!existsSync(mountedNodeDir)) {
    symlinkSync(projectRoot, mountedNodeDir, process.platform === "win32" ? "junction" : "dir");
    return;
  }

  try {
    const stats = lstatSync(mountedNodeDir);
    if (!stats.isSymbolicLink()) {
      throw new Error("Mounted custom node path already exists and is not a symlink");
    }

    const currentTarget = resolve(customNodesDir, readlinkSync(mountedNodeDir));
    if (currentTarget !== projectRoot) {
      rmSync(mountedNodeDir, { recursive: true, force: true });
      symlinkSync(projectRoot, mountedNodeDir, process.platform === "win32" ? "junction" : "dir");
    }
  } catch (error) {
    rmSync(mountedNodeDir, { recursive: true, force: true });
    symlinkSync(projectRoot, mountedNodeDir, process.platform === "win32" ? "junction" : "dir");
  }
}

ensureWorkspaceVenv();
ensureComfyCli();
ensurePinnedComfyInstall();
ensureMountedCustomNode();
