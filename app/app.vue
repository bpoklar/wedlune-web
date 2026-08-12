<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n();
const i18nHead = useLocaleHead();

useHead(() => ({
  titleTemplate: "%s | Wedlune",
  htmlAttrs: i18nHead.value.htmlAttrs,
  link: i18nHead.value.link,
  meta: i18nHead.value.meta,
}));

useStructuredData("organization", () => [{
  "@type": "Organization",
  "@id": "https://wedlune.com/#organization",
  name: "Wedlune",
  url: "https://wedlune.com",
  description: t("home.organizationDescription"),
  logo: {
    "@type": "ImageObject",
    url: "https://wedlune.com/img/wedlune-logo-dark-284.png",
  },
  email: "support@wedlune.com",
}]);
</script>
