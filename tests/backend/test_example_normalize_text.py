from importlib.util import module_from_spec, spec_from_file_location
from pathlib import Path


REPO_ROOT = Path(__file__).resolve().parents[2]
NODE_PATH = REPO_ROOT / "backend" / "nodes" / "example_normalize_text.py"


def load_module_from_path(module_name: str, module_path: Path):
    assert module_path.exists(), f"Expected module at {module_path}"

    spec = spec_from_file_location(module_name, module_path)
    assert spec is not None
    assert spec.loader is not None

    module = module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def test_example_normalize_text_node_normalizes_multiline_input():
    module = load_module_from_path("example_normalize_text_node", NODE_PATH)
    node = module.ExampleNormalizeTextNode()

    assert module.ExampleNormalizeTextNode.CATEGORY == "examples/testing"
    assert module.ExampleNormalizeTextNode.FUNCTION == "normalize_text"
    assert module.ExampleNormalizeTextNode.RETURN_TYPES == ("STRING",)
    assert node.normalize_text("  alpha \n\n beta  \n gamma ") == ("alpha beta gamma",)


def test_example_normalize_text_node_declares_multiline_text_input():
    module = load_module_from_path("example_normalize_text_node_inputs", NODE_PATH)

    assert module.ExampleNormalizeTextNode.INPUT_TYPES() == {
        "required": {
            "text": (
                "STRING",
                {
                    "default": "",
                    "multiline": True,
                },
            )
        }
    }
