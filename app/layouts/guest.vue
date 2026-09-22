<template>
  <div class="guest-shell min-h-screen" :class="{ 'rsvp-theme': theme }" :style="theme">
    <a href="#main-content" class="skip-link">{{ $t("common.skipToContent") }}</a>
    <GuestHeader :inverse-logo="inverseLogo" />
    <slot />
  </div>
</template>

<script setup lang="ts">
defineProps<{ theme?: Record<string, string>; inverseLogo?: boolean }>();
</script>

<style scoped>
.guest-shell { background: var(--rsvp-background, var(--site-bg)); color: var(--rsvp-background-text, var(--site-text)); }
</style>
