from .nodes.example_normalize_text import ExampleNormalizeTextNode


NODE_CLASS_MAPPINGS = {"TemplateExampleNormalizeText": ExampleNormalizeTextNode}
NODE_DISPLAY_NAME_MAPPINGS = {
    "TemplateExampleNormalizeText": "Template Example Normalize Text"
}

__all__ = [
    "ExampleNormalizeTextNode",
    "NODE_CLASS_MAPPINGS",
    "NODE_DISPLAY_NAME_MAPPINGS",
]
