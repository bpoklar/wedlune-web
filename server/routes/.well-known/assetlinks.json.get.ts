import { buildAndroidAssetLinks } from "../../utils/mobileAssociations";

export default defineEventHandler((event) => {
  const config = useRuntimeConfig(event);
  setResponseHeaders(event, {
    "Cache-Control": "public, max-age=3600",
    "Content-Type": "application/json; charset=utf-8",
  });
  return buildAndroidAssetLinks(config.androidAppLinkSha256);
});
