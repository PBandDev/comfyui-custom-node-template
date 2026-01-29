import type { ComfyApp } from "@comfyorg/comfyui-frontend-types";
import { SETTINGS_IDS } from "./constants";

declare global {
  const app: ComfyApp;

  interface Window {
    app: ComfyApp;
  }
}

app.registerExtension({
  name: "ComfyUI My Custom Node",
  settings: [
    {
      id: SETTINGS_IDS.VERSION,
      name: "Version 1.0.0",
      type: () => {
        const spanEl = document.createElement("span");
        spanEl.insertAdjacentHTML(
          "beforeend",
          `<a href="https://github.com/your-username/comfyui-custom-node" target="_blank" style="padding-right: 12px;">Homepage</a>`
        );

        return spanEl;
      },
      defaultValue: undefined,
    },
    {
      id: SETTINGS_IDS.DEBUG_LOGGING,
      name: "Enable Debug Logging",
      type: "boolean",
      tooltip:
        "Show detailed debug logs in browser console during operation",
      defaultValue: false,
    },
  ]
});
