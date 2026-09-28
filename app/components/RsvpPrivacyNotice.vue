<template>
  <p :id="id" class="rsvp-text-secondary text-sm leading-relaxed break-words">
    {{ $t(dietary ? "rsvp.dietaryPrivacyBefore" : "rsvp.privacyNoticeBefore") }}
    <a
      :href="localePath('/privacy')"
      target="_blank"
      rel="noopener noreferrer"
      referrerpolicy="no-referrer"
      class="rsvp-link underline decoration-current underline-offset-2"
    >{{ $t("rsvp.privacyLink") }}</a>.
  </p>
</template>

<script setup lang="ts">
defineProps<{ id?: string; dietary?: boolean }>();
const localePath = useLocalePath();
// A plain localized path and no referrer keep the private RSVP token out of
// the legal-page URL/request. A new tab preserves the unfinished response.
</script>
