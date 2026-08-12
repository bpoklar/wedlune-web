<template>
  <div class="min-h-screen bg-ivory-cream">
    <a href="#main-content" class="skip-link">{{ $t("common.skipToContent") }}</a>
    <GuestHeader />
    <slot />
  </div>
</template>
