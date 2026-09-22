<template>
  <header class="guest-header border-b">
    <div class="mx-auto flex min-h-16 max-w-5xl items-center justify-between gap-4 px-5 sm:px-8">
      <img :src="inverseLogo ? '/img/wedlune-logo-light-284.png' : '/img/wedlune-logo-dark-284.png'" alt="Wedlune" width="142" height="29" class="h-6 w-auto">
      <LanguageDropdown tone="guest" />
    </div>
  </header>
</template>

<script setup lang="ts">
defineProps<{ inverseLogo?: boolean }>();
</script>

<style scoped>
.guest-header { background: var(--rsvp-surface, var(--site-surface)); border-color: var(--rsvp-border, var(--site-border)); }
</style>
