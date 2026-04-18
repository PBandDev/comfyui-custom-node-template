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

## Customize This Template

Replace the template placeholders before publishing:

| File | Replace |
| --- | --- |
| `package.json` | `name`, `description`, `author` |
| `pyproject.toml` | project `name`, `description`, `Repository`, `PublisherId`, `DisplayName`, `Icon` |
| `LICENSE` | `Your Name` |
| `assets/icon.svg` | default icon artwork |
| `frontend/src/constants.ts` | `SETTINGS_PREFIX` |
| `frontend/src/index.ts` | extension `name`, homepage URL, version label if needed |
| `backend/__init__.py` | `TemplateExampleNormalizeText`, display name, exported node mappings |
| `backend/nodes/example_normalize_text.py` | example node class, category, inputs, execution logic |
| `tests/backend/*` and `tests/python/*` | example node ids and expected display names |
| `tests/e2e/smoke.spec.ts` | `EXAMPLE_NODE_ID` if you rename or remove the example backend node |
| `docs/TESTING.md` | mounted custom node path if you change the package slug |

After changing package metadata, run:

```bash
uv lock
pnpm install
pnpm test
```

## Publishing

After customization passes locally, add `REGISTRY_ACCESS_TOKEN` in GitHub and run the `Publish to Comfy registry` workflow.

## License

MIT
