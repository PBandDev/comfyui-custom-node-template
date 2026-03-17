from importlib.util import module_from_spec, spec_from_file_location
from pathlib import Path


FIXTURE_PATH = Path(__file__).resolve().parent / "fixtures" / "example_node.py"


def load_fixture_module():
    spec = spec_from_file_location("example_node_fixture", FIXTURE_PATH)
    assert spec is not None
    assert spec.loader is not None

    module = module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def test_example_node_shows_how_to_unit_test_pure_python_logic():
    module = load_fixture_module()
    node = module.ExampleNormalizeTextNode()

    assert module.NODE_CLASS_MAPPINGS == {
        "ExampleNormalizeText": module.ExampleNormalizeTextNode
    }
    assert module.NODE_DISPLAY_NAME_MAPPINGS == {
        "ExampleNormalizeText": "Example Normalize Text"
    }
    assert node.normalize_text("  alpha \n\n beta  \n gamma ") == ("alpha beta gamma",)
