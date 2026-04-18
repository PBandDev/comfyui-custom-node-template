import sys
from importlib.util import module_from_spec, spec_from_file_location
from pathlib import Path

import pytest


MISSING = object()


def load_package_from_path(
    module_name: str,
    module_path: Path,
    *,
    repo_root: Path,
    blocked_top_levels: tuple[str, ...] = ("backend",),
):
    assert module_path.exists(), f"Expected module at {module_path}"

    spec = spec_from_file_location(
        module_name,
        module_path,
        submodule_search_locations=[str(module_path.parent)],
    )
    assert spec is not None
    assert spec.loader is not None

    module = module_from_spec(spec)
    original_sys_path = sys.path[:]
    original_modules = {
        name: sys.modules.get(name, MISSING)
        for name in tuple(sys.modules)
        if any(
            name == top_level or name.startswith(f"{top_level}.")
            for top_level in blocked_top_levels
        )
    }
    sys.modules[module_name] = module
    for name in original_modules:
        sys.modules.pop(name, None)
    for top_level in blocked_top_levels:
        sys.modules[top_level] = None

    try:
        sys.path = [
            entry
            for entry in original_sys_path
            if Path(entry or ".").resolve() != repo_root
        ]
        try:
            spec.loader.exec_module(module)
        except ModuleNotFoundError as exc:
            pytest.fail(f"Package import failed: {exc}")
    finally:
        sys.path = original_sys_path
        for top_level in blocked_top_levels:
            sys.modules.pop(top_level, None)
        for name, original_module in original_modules.items():
            if original_module is MISSING:
                sys.modules.pop(name, None)
            else:
                sys.modules[name] = original_module

    return module
