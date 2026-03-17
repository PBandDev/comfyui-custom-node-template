from importlib.util import module_from_spec, spec_from_file_location
from pathlib import Path


REPO_ROOT = Path(__file__).resolve().parents[2]
ENTRYPOINT_PATH = REPO_ROOT / "__init__.py"


def load_module_from_path(module_name: str, module_path: Path):
    spec = spec_from_file_location(module_name, module_path)
    assert spec is not None
    assert spec.loader is not None

    module = module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def test_template_entrypoint_exports_expected_symbols():
    module = load_module_from_path("template_entrypoint", ENTRYPOINT_PATH)

    assert module.WEB_DIRECTORY == "./dist"
    assert module.NODE_CLASS_MAPPINGS == {}
    assert module.NODE_DISPLAY_NAME_MAPPINGS == {}
    assert module.__all__ == [
        "NODE_CLASS_MAPPINGS",
        "NODE_DISPLAY_NAME_MAPPINGS",
        "WEB_DIRECTORY",
    ]
