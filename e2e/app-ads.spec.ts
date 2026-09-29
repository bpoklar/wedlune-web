import { expect, test } from "@playwright/test";

test("AdMob can fetch the publisher declaration as plain text at the domain root", async ({ request }) => {
  const response = await request.get("/app-ads.txt", {
    headers: { "User-Agent": "Google-adstxt" },
    maxRedirects: 0,
  });

  expect(response.status()).toBe(200);
  expect(response.headers()["content-type"]).toMatch(/^text\/plain\b/);
  expect((await response.text()).trim()).toBe(
    "google.com, pub-9811782137473595, DIRECT, f08c47fec0942fa0",
  );
});
