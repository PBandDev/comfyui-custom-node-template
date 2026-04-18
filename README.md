# ComfyUI Custom Node Template

Starter template for ComfyUI custom nodes with a TypeScript frontend and optional Python node code. Example use: [ComfyUI Node Organizer](https://github.com/PBandDev/comfyui-node-organizer)

Use it for:

- frontend-only extensions
- Python-backed custom nodes
- nodepacks that ship both

## Quick start

1. Create a repo from this template.
2. Clone it locally.
3. Link or symlink it into ComfyUI's `custom_nodes/` directory.
4. Replace the template placeholders before you publish anything.

PowerShell example:

```powershell
New-Item -ItemType SymbolicLink `
  -Path C:\path\to\ComfyUI\custom_nodes\comfyui-my-node `
  -Target C:\path\to\your\repo
```

macOS / Linux example:

```bash
ln -s /path/to/your/repo /path/to/ComfyUI/custom_nodes/comfyui-my-node
```

## Development

Install dependencies:

```bash
pnpm install
uv sync --locked --group dev
```

Frontend commands:

```bash
pnpm dev
pnpm typecheck
pnpm test
pnpm build
```

Python tests:

```bash
uv run pytest tests/python -q
```

Reload the ComfyUI browser tab after frontend changes. Restart the ComfyUI server after Python changes.

## Python test examples

If your nodepack includes Python code, start with these files:

- `tests/python/test_entrypoint_smoke.py` checks that `__init__.py` imports cleanly and exposes the expected entrypoint symbols.
- `tests/python/fixtures/example_node.py` and `tests/python/test_example_node_pattern.py` show a small unit-test pattern for backend node logic.

If you are shipping a frontend-only extension, keep the smoke test anyway. It still catches broken entrypoint changes in CI.

## CI and release

GitHub CI runs:

- `uv sync --locked --group dev`
- `uv run pytest tests/python -q`
- `pnpm typecheck`
- `pnpm test`
- `pnpm build`

The publish workflow runs the same checks, bumps the version, regenerates `uv.lock`, tags the release, and then publishes to the ComfyUI registry.

## Publishing to the ComfyUI registry

1. Make sure the metadata and branding are no longer template defaults.
2. Confirm `pnpm test`, `pnpm build`, and `uv run pytest tests/python -q` pass locally.
3. Add the `REGISTRY_ACCESS_TOKEN` repository secret.
4. Run the `Publish to Comfy registry` workflow in GitHub Actions.
5. Choose the version bump type.

## Replace these placeholders

| Search for | Replace with |
|------------|--------------|
| `comfyui-custom-node` | Your package slug |
| `My Custom Node` | Your display name |
| `A ComfyUI custom node` | Your description |
| `Your Name` | Your name or org |
| `your-username` | Your GitHub or registry username |

Update these files before release:

- `package.json`
- `pyproject.toml`
- `frontend/src/constants.ts`
- `frontend/src/index.ts`
- `LICENSE`
- `assets/icon.svg`

## Pre-publish checklist

- Replace the default icon in `assets/icon.svg`
- Replace the placeholder homepage URL in `frontend/src/index.ts`
- Replace the placeholder settings prefix in `frontend/src/constants.ts`
- Replace package metadata in `package.json` and `pyproject.toml`
- Replace `Your Name` in `LICENSE`
- Re-read the rendered README once with your real project name

## License

MIT
