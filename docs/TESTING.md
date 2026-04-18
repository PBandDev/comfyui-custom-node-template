# Testing

## Commands

```bash
pnpm test
pnpm test:unit
pnpm test:e2e
pnpm test:frontend
pnpm test:backend
pnpm setup:e2e
```

## Coverage

- `pnpm test` runs frontend unit tests, backend Python tests, and repo-local ComfyUI E2E.
- `pnpm test:unit` runs the fast frontend and backend test lanes only.
- `pnpm test:e2e` builds `dist/`, runs `pnpm setup:e2e`, starts scoped ComfyUI, and runs Playwright.
- `pnpm setup:e2e` provisions Chromium plus ComfyUI under `.e2e/`.

## E2E Harness

- ComfyUI is pinned to `v0.18.1`.
- `comfy-cli` is pinned inside `.e2e/venv`.
- The ComfyUI checkout and Python runtime live under `.e2e/comfyui`.
- The template repo is mounted into `.e2e/comfyui/custom_nodes/comfyui-custom-node`.
- The harness is CPU-only so local and CI behavior are predictable.

If the pin changes or the scoped install gets stale, delete `.e2e/` and rerun `pnpm setup:e2e`.
