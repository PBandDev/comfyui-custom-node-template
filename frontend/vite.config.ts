import path from "node:path";
import { defineConfig } from "vite";

export const COMFY_APP_IMPORT = 'import { app } from "/scripts/app.js";';
export const FRONTEND_ROOT = __dirname;
export const FRONTEND_ENTRY = path.resolve(FRONTEND_ROOT, "src/index.ts");

export function prependComfyAppImport(code: string): string {
  return `${COMFY_APP_IMPORT}\n${code}`;
}

function stripViteModuleSuffix(id: string): string {
  return id.split("?", 1)[0];
}

export function shouldInjectComfyAppImport(id: string): boolean {
  return path.normalize(stripViteModuleSuffix(id)) === path.normalize(FRONTEND_ENTRY);
}

export function createComfyAppImportPlugin() {
  return {
  name: "insert-comfyui-custom-import",
  transform(code: string, id: string) {
    if (!shouldInjectComfyAppImport(id)) {
      return undefined;
    }

    return prependComfyAppImport(code);
  },
  };
}

export default defineConfig({
  root: FRONTEND_ROOT,
  plugins: [createComfyAppImportPlugin()],
  build: {
    emptyOutDir: true,
    outDir: path.resolve(__dirname, "..", "dist"),
    rollupOptions: {
      external: ["/scripts/app.js", "/scripts/api.js"],
      input: {
        index: path.resolve(__dirname, "src/index.ts"),
      },
      output: {
        entryFileNames: "[name].js",
        chunkFileNames: "[name]-[hash].js",
        assetFileNames: "[name][extname]",
      },
    },
  },
});
