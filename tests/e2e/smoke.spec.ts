import { expect, test } from "@playwright/test";

test("custom node pack loads in ComfyUI", async ({ page, request }) => {
  await page.goto("/");

  await page.waitForFunction(() => {
    const comfyWindow = window as {
      app?: {
        extensionManager?: {
          setting?: {
            get: (id: string) => boolean | undefined;
          };
        };
      };
    };

    return (
      comfyWindow.app?.extensionManager?.setting?.get("My Custom Node.Debug Logging") === false
    );
  });

  const objectInfoResponse = await request.get("/api/object_info");
  expect(objectInfoResponse.ok()).toBe(true);

  const objectInfo = (await objectInfoResponse.json()) as Record<string, object>;
  expect(objectInfo.TemplateExampleNormalizeText).toBeDefined();
});
