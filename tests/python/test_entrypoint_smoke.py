import json
import tomllib
from pathlib import Path

from conftest import load_package_from_path


REPO_ROOT = Path(__file__).resolve().parents[2]
ENTRYPOINT_PATH = REPO_ROOT / "__init__.py"
PACKAGE_JSON_PATH = REPO_ROOT / "package.json"
PYPROJECT_PATH = REPO_ROOT / "pyproject.toml"
GITIGNORE_PATH = REPO_ROOT / ".gitignore"
PNPM_WORKSPACE_PATH = REPO_ROOT / "pnpm-workspace.yaml"
E2E_CONFIG_PATH = REPO_ROOT / "e2e.config.mjs"
SETUP_E2E_SCRIPT_PATH = REPO_ROOT / "scripts" / "setup-e2e-comfy.mjs"
PLAYWRIGHT_CONFIG_PATH = REPO_ROOT / "playwright.config.ts"
E2E_SETUP_PATH = REPO_ROOT / "tests" / "e2e" / "global.setup.ts"
E2E_TEARDOWN_PATH = REPO_ROOT / "tests" / "e2e" / "global.teardown.ts"
E2E_SMOKE_SPEC_PATH = REPO_ROOT / "tests" / "e2e" / "smoke.spec.ts"


def test_template_entrypoint_exports_expected_symbols_via_package_loader():
    module = load_package_from_path(
        "template_entrypoint",
        ENTRYPOINT_PATH,
        repo_root=REPO_ROOT,
    )

    assert module.WEB_DIRECTORY == "./dist"
    assert module.NODE_CLASS_MAPPINGS == {
        "TemplateExampleNormalizeText": module.ExampleNormalizeTextNode,
    }
    assert module.NODE_DISPLAY_NAME_MAPPINGS == {
        "TemplateExampleNormalizeText": "Template Example Normalize Text",
    }
    assert module.__all__ == [
        "ExampleNormalizeTextNode",
        "NODE_CLASS_MAPPINGS",
        "NODE_DISPLAY_NAME_MAPPINGS",
        "WEB_DIRECTORY",
    ]


def test_root_package_surface_matches_frontend_backend_split():
    package_json = json.loads(PACKAGE_JSON_PATH.read_text(encoding="utf-8"))
    scripts = package_json["scripts"]

    assert scripts["dev"] == (
        "tsc --noEmit -p frontend/tsconfig.json && "
        "vite build --watch --config frontend/vite.config.ts"
    )
    assert scripts["build"] == (
        "tsc --noEmit -p frontend/tsconfig.json && "
        "vite build --config frontend/vite.config.ts"
    )
    assert scripts["typecheck"] == "tsc --noEmit -p frontend/tsconfig.json"
    assert scripts["test"] == "pnpm test:unit && pnpm test:e2e"
    assert scripts["test:frontend"] == "vitest run --config frontend/vitest.config.ts"
    assert scripts["test:backend"] == "uv run pytest tests/python tests/backend -q"
    assert scripts["test:unit"] == "pnpm test:frontend && pnpm test:backend"
    assert scripts["setup:e2e"] == "playwright install chromium && node scripts/setup-e2e-comfy.mjs"
    assert scripts["test:e2e"] == "pnpm build && pnpm setup:e2e && playwright test"


def test_root_packaging_metadata_matches_layout():
    pyproject = tomllib.loads(PYPROJECT_PATH.read_text(encoding="utf-8"))
    tool_comfy = pyproject["tool"]["comfy"]
    bump_files = pyproject["tool"]["bumpversion"]["files"]

    assert tool_comfy["includes"] == ["dist"]
    assert any(file_config["filename"] == "frontend/src/index.ts" for file_config in bump_files)


def test_root_gitignore_and_workspace_surface_match_harness_expectations():
    gitignore = GITIGNORE_PATH.read_text(encoding="utf-8")

    assert ".e2e/" in gitignore
    assert "test-results/" in gitignore
    assert "playwright-report/" in gitignore
    assert not PNPM_WORKSPACE_PATH.exists()


def test_e2e_harness_files_exist():
    assert E2E_CONFIG_PATH.is_file()
    assert SETUP_E2E_SCRIPT_PATH.is_file()
    assert PLAYWRIGHT_CONFIG_PATH.is_file()
    assert E2E_SETUP_PATH.is_file()
    assert E2E_TEARDOWN_PATH.is_file()
    assert E2E_SMOKE_SPEC_PATH.is_file()
