<template>
  <LegalPageShell :title="$t('privacy.title')" :date="$t('privacy.date')" :toc="toc">
    <section id="privacy-1">
      <h2>{{ $t("privacy.s1Title") }}</h2>
      <p>{{ $t("privacy.s1Before") }} <a href="mailto:support@wedlune.com">support@wedlune.com</a>. {{ $t("privacy.s1After") }}</p>
    </section>
    <section id="privacy-2">
      <h2>{{ $t("privacy.s2Title") }}</h2>
      <p>{{ $t("privacy.s2Intro") }}</p>
      <ul><li v-for="item in s2Items" :key="item">{{ item }}</li></ul>
    </section>
    <section v-for="section in paragraphSections" :id="section.id" :key="section.key">
      <h2>{{ $t(`${section.key}Title`) }}</h2>
      <p v-for="paragraph in section.paragraphs" :key="paragraph">{{ paragraph }}</p>
    </section>
    <section id="privacy-5"><h2>{{ $t("privacy.s5Title") }}</h2><p>{{ $t("privacy.s5Body") }}</p></section>
    <section id="privacy-6">
      <h2>{{ $t("privacy.s6Title") }}</h2><p v-for="paragraph in s6Paragraphs" :key="paragraph">{{ paragraph }}</p>
      <p><a href="https://ai.google.dev/gemini-api/terms" rel="noopener noreferrer">{{ $t("legal.geminiTerms") }}</a> · <a href="https://cloud.google.com/maps-platform/terms" rel="noopener noreferrer">{{ $t("legal.googleMapsTerms") }}</a> · <a href="https://policies.google.com/privacy" rel="noopener noreferrer">{{ $t("legal.googlePrivacy") }}</a></p>
    </section>
    <section id="privacy-7">
      <h2>{{ $t("privacy.s7Title") }}</h2><p>{{ $t("privacy.s7Intro") }}</p>
      <ul><li v-for="item in s7Items" :key="item">{{ item }}</li></ul>
    </section>
    <section v-for="section in laterParagraphSections" :id="section.id" :key="section.key">
      <h2>{{ $t(`${section.key}Title`) }}</h2><p v-for="paragraph in section.paragraphs" :key="paragraph">{{ paragraph }}</p>
    </section>
    <section id="privacy-10">
      <h2>{{ $t("privacy.s10Title") }}</h2>
      <p>{{ $t("privacy.s10Before") }} <NuxtLink :to="localePath('/delete-account')">{{ $t("privacy.s10Link") }}</NuxtLink>. {{ $t("privacy.s10After") }}</p>
      <p>{{ $t("privacy.s10Retained") }}</p>
    </section>
    <section id="privacy-11"><h2>{{ $t("privacy.s11Title") }}</h2><p>{{ $t("privacy.s11Body") }}</p></section>
    <section id="privacy-12"><h2>{{ $t("privacy.s12Title") }}</h2><p>{{ $t("privacy.s12Body") }}</p></section>
    <section id="privacy-13"><h2>{{ $t("privacy.s13Title") }}</h2><p>{{ $t("privacy.s13Before") }} <a href="mailto:support@wedlune.com">support@wedlune.com</a>.</p></section>
  </LegalPageShell>
</template>

<script setup lang="ts">
definePageMeta({ layout: "legal" });
const { t, tm, rt } = useI18n();
const localePath = useLocalePath();
const resolveList = (key: string) => (tm(key) as string[]).map((item) => rt(item));
const s2Items = computed(() => resolveList("privacy.s2Items"));
const s7Items = computed(() => resolveList("privacy.s7Items"));
const paragraphSections = computed(() => [
  { id: "privacy-3", key: "privacy.s3", paragraphs: resolveList("privacy.s3Paragraphs") },
  { id: "privacy-4", key: "privacy.s4", paragraphs: resolveList("privacy.s4Paragraphs") },
]);
const s6Paragraphs = computed(() => resolveList("privacy.s6Paragraphs"));
const laterParagraphSections = computed(() => [
  { id: "privacy-8", key: "privacy.s8", paragraphs: resolveList("privacy.s8Paragraphs") },
  { id: "privacy-9", key: "privacy.s9", paragraphs: resolveList("privacy.s9Paragraphs") },
]);
const toc = computed(() => Array.from({ length: 13 }, (_, index) => ({ id: `privacy-${index + 1}`, label: t(`privacy.s${index + 1}Title`) })));

useLocalizedSeo({ title: () => t("privacy.seoTitle"), description: () => t("privacy.seoDescription"), path: "/privacy" });
useStructuredData("privacy", () => [{
  "@type": "WebPage",
  name: t("privacy.seoTitle"),
  description: t("privacy.seoDescription"),
  url: `https://wedlune.com${localePath("/privacy")}`,
}]);
</script>
