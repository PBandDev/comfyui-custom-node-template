class ExampleNormalizeTextNode:
    @classmethod
    def INPUT_TYPES(cls):
        return {
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

    RETURN_TYPES = ("STRING",)
    FUNCTION = "normalize_text"
    CATEGORY = "examples/testing"

    def normalize_text(self, text: str):
        normalized_parts = [part.strip() for part in text.splitlines() if part.strip()]
        return (" ".join(normalized_parts),)


NODE_CLASS_MAPPINGS = {"ExampleNormalizeText": ExampleNormalizeTextNode}
NODE_DISPLAY_NAME_MAPPINGS = {"ExampleNormalizeText": "Example Normalize Text"}
