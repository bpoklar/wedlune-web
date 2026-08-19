export default defineEventHandler((event) => {
  if (!getRequestURL(event).pathname.startsWith("/auth/callback/")) return;

  // Apply these at request time so SEO-module defaults cannot overwrite the
  // private one-time callback response headers during production rendering.
  setResponseHeaders(event, {
    "Cache-Control": "no-store",
    "Referrer-Policy": "no-referrer",
    "X-Robots-Tag": "noindex, nofollow",
  });
});
