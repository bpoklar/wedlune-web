<template>
  <LegalPageShell :title="$t('terms.title')" :date="$t('terms.date')" :toc="toc">
    <section v-for="section in singleSections" :id="section.id" :key="section.key">
      <h2>{{ $t(`${section.key}Title`) }}</h2><p>{{ $t(`${section.key}Body`) }}</p>
    </section>
    <section id="terms-3"><h2>{{ $t("terms.s3Title") }}</h2><p v-for="paragraph in s3Paragraphs" :key="paragraph">{{ paragraph }}</p></section>
    <section id="terms-4"><h2>{{ $t("terms.s4Title") }}</h2><p>{{ $t("terms.s4Body") }}</p></section>
    <section id="terms-5"><h2>{{ $t("terms.s5Title") }}</h2><ul><li v-for="item in s5Items" :key="item">{{ item }}</li></ul></section>
    <section v-for="section in middleSingleSections" :id="section.id" :key="section.key">
      <h2>{{ $t(`${section.key}Title`) }}</h2><p>{{ $t(`${section.key}Body`) }}</p>
    </section>
    <section id="terms-7">
      <h2>{{ $t("terms.s7Title") }}</h2><p>{{ $t("terms.s7Body") }}</p>
      <p><a href="https://openrouter.ai/terms" rel="noopener noreferrer">{{ $t("legal.openRouterTerms") }}</a> · <a href="https://openrouter.ai/privacy" rel="noopener noreferrer">{{ $t("legal.openRouterPrivacy") }}</a> · <a href="https://openrouter.ai/data-processing-agreement" rel="noopener noreferrer">{{ $t("legal.openRouterDpa") }}</a> · <a href="https://openrouter.ai/docs/guides/privacy/provider-logging/" rel="noopener noreferrer">{{ $t("legal.openRouterProviderPolicies") }}</a> · <a href="https://openai.com/policies/services-agreement/" rel="noopener noreferrer">{{ $t("legal.openAiTerms") }}</a> · <a href="https://openai.com/policies/privacy-policy/" rel="noopener noreferrer">{{ $t("legal.openAiPrivacy") }}</a> · <a href="https://ai.google.dev/gemini-api/terms" rel="noopener noreferrer">{{ $t("legal.geminiTerms") }}</a> · <a href="https://cloud.google.com/maps-platform/terms" rel="noopener noreferrer">{{ $t("legal.googleMapsTerms") }}</a> · <a href="https://policies.google.com/privacy" rel="noopener noreferrer">{{ $t("legal.googlePrivacy") }}</a> · <a href="https://www.anthropic.com/legal/commercial-terms" rel="noopener noreferrer">{{ $t("legal.anthropicTerms") }}</a> · <a href="https://www.anthropic.com/legal/privacy" rel="noopener noreferrer">{{ $t("legal.anthropicPrivacy") }}</a></p>
    </section>
    <section id="terms-8"><h2>{{ $t("terms.s8Title") }}</h2><p>{{ $t("terms.s8Intro") }}</p><ul><li v-for="item in s8Items" :key="item">{{ item }}</li></ul></section>
    <section id="terms-9"><h2>{{ $t("terms.s9Title") }}</h2><p>{{ $t("terms.s9Body") }}</p></section>
    <section id="terms-10"><h2>{{ $t("terms.s10Title") }}</h2><p>{{ $t("terms.s10Body") }}</p></section>
    <section id="terms-11">
      <h2>{{ $t("terms.s11Title") }}</h2>
      <p>{{ $t("terms.s11BeforeDelete") }} <NuxtLink :to="localePath('/delete-account')">{{ $t("terms.s11DeleteLink") }}</NuxtLink>. {{ $t("terms.s11Middle") }} <NuxtLink :to="localePath('/privacy')">{{ $t("terms.s11PrivacyLink") }}</NuxtLink>.</p>
    </section>
    <section v-for="section in finalSections" :id="section.id" :key="section.key"><h2>{{ $t(`${section.key}Title`) }}</h2><p>{{ $t(`${section.key}Body`) }}</p></section>
    <section id="terms-14"><h2>{{ $t("terms.s14Title") }}</h2><p>{{ $t("terms.s14Before") }} <a href="mailto:support@wedlune.com">support@wedlune.com</a>.</p></section>
  </LegalPageShell>
</template>

<script setup lang="ts">
definePageMeta({ layout: "legal" });
const { t, tm, rt } = useI18n();
const localePath = useLocalePath();
const singleSections = [{ id: "terms-1", key: "terms.s1" }, { id: "terms-2", key: "terms.s2" }];
const middleSingleSections = [{ id: "terms-6", key: "terms.s6" }];
const finalSections = [{ id: "terms-12", key: "terms.s12" }, { id: "terms-13", key: "terms.s13" }];
const resolveList = (key: string) => (tm(key) as string[]).map((item) => rt(item));
const s3Paragraphs = computed(() => resolveList("terms.s3Paragraphs"));
const s5Items = computed(() => resolveList("terms.s5Items"));
const s8Items = computed(() => resolveList("terms.s8Items"));
const toc = computed(() => Array.from({ length: 14 }, (_, index) => ({ id: `terms-${index + 1}`, label: t(`terms.s${index + 1}Title`) })));

useLocalizedSeo({ title: () => t("terms.seoTitle"), description: () => t("terms.seoDescription"), path: "/terms" });
useStructuredData("terms", () => [{
  "@type": "WebPage",
  name: t("terms.seoTitle"),
  description: t("terms.seoDescription"),
  url: `https://wedlune.com${localePath("/terms")}`,
}]);
</script>
