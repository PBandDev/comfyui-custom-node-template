# AGENTS.md

For ComfyUI work in this repository, start with the `comfyui-api`, `comfyui-inventory`, `comfyui-node-basics`, `comfyui-node-packaging`, `comfyui-node-advanced`, and `comfyui-node-frontend` skills.

Repository-specific notes:
- This template bundles frontend code with TypeScript/Vite and exposes `WEB_DIRECTORY = "./dist"` in `__init__.py`; do not assume the older plain `js/` layout from generic ComfyUI examples.
- Treat `.agents/skills` as starting guidance, not source of truth. Verify ComfyUI frontend and backend API behavior against current official docs before making architectural changes or using advanced patterns.
- Be cautious with `comfy_api.latest` and prototype hijacking in frontend extensions; prefer stable/versioned APIs and official extension hooks when possible.
