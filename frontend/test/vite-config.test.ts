import path from "node:path";
import { describe, expect, it } from "vitest";
import viteConfig, {
  FRONTEND_ENTRY,
  FRONTEND_ROOT,
  createComfyAppImportPlugin,
  prependComfyAppImport,
} from "../vite.config";

describe("vite config", () => {
  it("uses the frontend directory as the Vite root and repo-root dist as output", () => {
    expect(viteConfig.root).toBe(path.resolve(process.cwd(), "frontend"));
    expect(viteConfig.build?.outDir).toBe(path.resolve(process.cwd(), "dist"));
  });

  it("prepends the documented ComfyUI app import", () => {
    expect(prependComfyAppImport('console.log("hello");')).toBe(
      'import { app } from "/scripts/app.js";\nconsole.log("hello");',
    );
  });

  it("injects the ComfyUI app import only for the frontend entry module", () => {
    const plugin = createComfyAppImportPlugin();

    expect(plugin.transform?.('console.log("entry");', FRONTEND_ENTRY)).toBe(
      'import { app } from "/scripts/app.js";\nconsole.log("entry");',
    );
    expect(
      plugin.transform?.('console.log("chunk");', path.resolve(FRONTEND_ROOT, "src/debug.ts")),
    ).toBeUndefined();
  });
});
