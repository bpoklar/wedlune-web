import { buildAppleAssociation } from "../../utils/mobileAssociations";

export default defineEventHandler((event) => {
  const config = useRuntimeConfig(event);
  const association = buildAppleAssociation(config.appleTeamId);
  if (!association) {
    throw createError({
      statusCode: 503,
      statusMessage: "Apple association is not configured",
    });
  }
  setResponseHeaders(event, {
    "Cache-Control": "public, max-age=3600",
    "Content-Type": "application/json; charset=utf-8",
  });
  return association;
});
