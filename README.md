# ComfyUI Custom Node Template

Starter template for one publishable ComfyUI custom node pack with:

- TypeScript/Vite frontend code in `frontend/`
- Python node code in `backend/`
- repo-local ComfyUI E2E testing under `.e2e/`

## Install

```bash
pnpm install
uv sync --locked --group dev
```

## Development

```bash
pnpm dev
pnpm typecheck
pnpm test
pnpm test:unit
pnpm test:e2e
```

`pnpm test:e2e` builds the frontend, provisions a scoped ComfyUI install, and runs the Playwright smoke suite.

## Docs

- [Testing](docs/TESTING.md)

## Publishing

Replace the template metadata in `package.json`, `pyproject.toml`, `frontend/src/constants.ts`, and `frontend/src/index.ts`, then run the `Publish to Comfy registry` GitHub Actions workflow.

## License

MIT
