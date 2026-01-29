# ComfyUI Custom Node Template

Starter template for building ComfyUI custom nodes with TypeScript frontend. Example use: [ComfyUI Node Organizer](https://github.com/PBandDev/comfyui-node-organizer)

## Quick Start

1. Click **"Use this template"** > **"Create a new repository"**
2. Clone your new repository
3. Update the placeholders below
4. Run `pnpm install`
5. Run `pnpm dev` to start development

## Required Updates

After creating from template, search and replace these values:

| Search for | Replace with |
|------------|--------------|
| `comfyui-custom-node` | Your package slug (e.g., `comfyui-my-feature`) |
| `My Custom Node` | Your display name (e.g., `My Feature`) |
| `A ComfyUI custom node` | Your description |
| `Your Name` | Your name |
| `your-username` | Your GitHub/ComfyUI registry username |

### Files to update

- `package.json` - name, description, author
- `pyproject.toml` - name, description, URLs, PublisherId, DisplayName, Icon
- `src/constants.ts` - SETTINGS_PREFIX
- `src/index.ts` - extension name, homepage URL
- `assets/icon.svg` - replace with your icon
- `LICENSE` - update copyright holder

## Development

1. Clone/symlink this folder into ComfyUI's `custom_nodes/` directory
2. Run `pnpm install`
3. Run `pnpm dev` to watch for changes and rebuild `dist/`

```bash
pnpm install    # Install dependencies
pnpm dev        # Watch mode - rebuilds dist/ on change
pnpm build      # Build for production
pnpm test       # Run tests
```

**Note:** Reload ComfyUI frontend (browser refresh) for JS changes. Restart ComfyUI server for Python changes.

## Publishing to ComfyUI Registry

1. Ensure all fields in `pyproject.toml` are correct
2. Add `REGISTRY_ACCESS_TOKEN` secret to your repo (from ComfyUI registry)
3. Go to Actions → "Publish to Comfy registry" → Run workflow
4. Select version bump type (patch/minor/major)

## License

MIT
