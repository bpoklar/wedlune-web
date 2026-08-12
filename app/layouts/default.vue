<template>
  <div class="flex min-h-screen flex-col">
    <a href="#main-content" class="skip-link">{{ $t("common.skipToContent") }}</a>
    <SiteHeader />
    <main id="main-content" tabindex="-1" class="flex-1">
      <slot />
    </main>
    <SiteFooter />
  </div>
</template>
