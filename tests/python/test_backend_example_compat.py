from pathlib import Path

from conftest import load_package_from_path


REPO_ROOT = Path(__file__).resolve().parents[2]
ENTRYPOINT_PATH = REPO_ROOT / "__init__.py"


def test_python_lane_can_exercise_promoted_backend_example_via_entrypoint():
    module = load_package_from_path(
        "template_entrypoint_backend_compat",
        ENTRYPOINT_PATH,
        repo_root=REPO_ROOT,
    )
    node_class = module.NODE_CLASS_MAPPINGS["TemplateExampleNormalizeText"]
    node = node_class()

    assert node.normalize_text(" one \n\n two \n three ") == ("one two three",)
