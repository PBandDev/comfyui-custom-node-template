import sys
from importlib.util import module_from_spec, spec_from_file_location
from pathlib import Path


ROOT_INIT_PATH = Path(__file__).resolve().parent / "__init__.py"


def _preload_root_entrypoint_for_pytest() -> None:
    # Keep pytest collection on the supported package-style loading path.
    spec = spec_from_file_location(
        "__init__",
        ROOT_INIT_PATH,
        submodule_search_locations=[str(ROOT_INIT_PATH.parent)],
    )
    assert spec is not None
    assert spec.loader is not None

    module = module_from_spec(spec)
    sys.modules["__init__"] = module
    spec.loader.exec_module(module)


_preload_root_entrypoint_for_pytest()
