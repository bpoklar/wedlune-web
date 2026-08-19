export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook("beforeResponse", (event) => {
    if (!getRequestURL(event).pathname.startsWith("/auth/callback/")) return;

    setResponseHeaders(event, {
      "Cache-Control": "no-store",
      "Referrer-Policy": "no-referrer",
      "X-Robots-Tag": "noindex, nofollow",
    });
  });
});
