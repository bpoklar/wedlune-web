<template>
  <div class="flex min-h-screen flex-col bg-warm-white">
    <a href="#main-content" class="skip-link">{{ $t("common.skipToContent") }}</a>
    <SiteHeader />
    <main id="main-content" tabindex="-1" class="flex-1 pt-16">
      <slot />
    </main>
    <SiteFooter :show-cta="false" />
  </div>
</template>
