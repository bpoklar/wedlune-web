<template>
  <LegalPageShell :title="$t('deleteAccount.title')" :date="$t('deleteAccount.date')" :toc="toc">
    <section id="delete-1"><h2>{{ $t("deleteAccount.appTitle") }}</h2><p>{{ $t("deleteAccount.appIntro") }}</p><ol><li v-for="step in deletionSteps" :key="step">{{ step }}</li></ol></section>
    <section id="delete-2"><h2>{{ $t("deleteAccount.emailTitle") }}</h2><p>{{ $t("deleteAccount.emailBefore") }} <a :href="deletionEmail">support@wedlune.com</a> {{ $t("deleteAccount.emailAfter") }}</p></section>
    <section id="delete-3"><h2>{{ $t("deleteAccount.deletedTitle") }}</h2><p>{{ $t("deleteAccount.deletedBody") }}</p></section>
    <section id="delete-4"><h2>{{ $t("deleteAccount.retainedTitle") }}</h2><p>{{ $t("deleteAccount.retainedBody") }}</p></section>
    <section id="delete-5"><h2>{{ $t("deleteAccount.privacyTitle") }}</h2><p>{{ $t("deleteAccount.privacyBefore") }} <NuxtLink :to="localePath('/privacy')">{{ $t("deleteAccount.privacyLink") }}</NuxtLink> {{ $t("deleteAccount.privacyAfter") }}</p></section>
  </LegalPageShell>
</template>

<script setup lang="ts">
definePageMeta({ layout: "legal" });
const { t, tm, rt } = useI18n();
const localePath = useLocalePath();
const deletionSteps = computed(() => (tm("deleteAccount.steps") as string[]).map((step) => rt(step)));
const deletionEmail = computed(() => `mailto:support@wedlune.com?subject=${encodeURIComponent(t("deleteAccount.emailSubject"))}`);
const toc = computed(() => [
  { id: "delete-1", label: t("deleteAccount.appTitle") },
  { id: "delete-2", label: t("deleteAccount.emailTitle") },
  { id: "delete-3", label: t("deleteAccount.deletedTitle") },
  { id: "delete-4", label: t("deleteAccount.retainedTitle") },
  { id: "delete-5", label: t("deleteAccount.privacyTitle") },
]);
useLocalizedSeo({ title: () => t("deleteAccount.seoTitle"), description: () => t("deleteAccount.seoDescription"), path: "/delete-account" });
useStructuredData("delete-account", () => [{
  "@type": "WebPage",
  name: t("deleteAccount.seoTitle"),
  description: t("deleteAccount.seoDescription"),
  url: `https://wedlune.com${localePath("/delete-account")}`,
}]);
</script>
