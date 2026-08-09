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
  titleTemplate: "%s",
  htmlAttrs: i18nHead.value.htmlAttrs,
  link: i18nHead.value.link,
  meta: i18nHead.value.meta,
}));

useSchemaOrg(() => [
  defineOrganization({
    name: "Wedlune",
    url: "https://wedlune.com",
    description: t("home.organizationDescription"),
  }),
]);
</script>
