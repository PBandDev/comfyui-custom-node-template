from pathlib import Path

from conftest import load_package_from_path


REPO_ROOT = Path(__file__).resolve().parents[2]
BACKEND_INIT_PATH = REPO_ROOT / "backend" / "__init__.py"


def test_backend_package_exports_example_node_mappings():
    module = load_package_from_path(
        "backend_package",
        BACKEND_INIT_PATH,
        repo_root=REPO_ROOT,
    )

    example_node = module.ExampleNormalizeTextNode

    assert module.NODE_CLASS_MAPPINGS == {
        "TemplateExampleNormalizeText": example_node,
    }
    assert module.NODE_DISPLAY_NAME_MAPPINGS == {
        "TemplateExampleNormalizeText": "Template Example Normalize Text",
    }
    assert module.__all__ == [
        "ExampleNormalizeTextNode",
        "NODE_CLASS_MAPPINGS",
        "NODE_DISPLAY_NAME_MAPPINGS",
    ]
