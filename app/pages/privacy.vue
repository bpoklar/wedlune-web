<template>
  <div class="pt-24 pb-16">
    <article class="max-w-3xl mx-auto px-6 [&_h2]:font-display [&_h2]:text-[1.375rem] [&_h2]:text-charcoal [&_h2]:mt-8 [&_h2]:mb-3 [&_p]:text-[0.9375rem] [&_p]:leading-[1.7] [&_p]:text-warm-gray [&_p]:mb-3 [&_li]:text-[0.9375rem] [&_li]:leading-[1.7] [&_li]:text-warm-gray [&_li]:mb-3 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_section]:mb-6">
      <h1 class="font-display text-3xl md:text-4xl text-charcoal mb-8">{{ $t("privacy.title") }}</h1>
      <p class="text-warm-gray text-sm mb-6">{{ $t("common.lastUpdated", { date: $t("privacy.date") }) }}</p>

      <section>
        <h2>{{ $t("privacy.s1Title") }}</h2>
        <p>
          {{ $t("privacy.s1Before") }}
          <a href="mailto:support@wedlune.com" class="text-champagne-gold hover:text-deep-gold">support@wedlune.com</a>.
          {{ $t("privacy.s1After") }}
        </p>
      </section>

      <section>
        <h2>{{ $t("privacy.s2Title") }}</h2>
        <p>{{ $t("privacy.s2Intro") }}</p>
        <ul><li v-for="item in s2Items" :key="item">{{ item }}</li></ul>
      </section>

      <section v-for="section in paragraphSections" :key="section.key">
        <h2>{{ $t(`${section.key}Title`) }}</h2>
        <p v-for="paragraph in section.paragraphs" :key="paragraph">{{ paragraph }}</p>
      </section>

      <section>
        <h2>{{ $t("privacy.s5Title") }}</h2>
        <p>{{ $t("privacy.s5Body") }}</p>
      </section>

      <section>
        <h2>{{ $t("privacy.s6Title") }}</h2>
        <p v-for="paragraph in s6Paragraphs" :key="paragraph">{{ paragraph }}</p>
      </section>

      <section>
        <h2>{{ $t("privacy.s7Title") }}</h2>
        <p>{{ $t("privacy.s7Intro") }}</p>
        <ul><li v-for="item in s7Items" :key="item">{{ item }}</li></ul>
      </section>

      <section v-for="section in laterParagraphSections" :key="section.key">
        <h2>{{ $t(`${section.key}Title`) }}</h2>
        <p v-for="paragraph in section.paragraphs" :key="paragraph">{{ paragraph }}</p>
      </section>

      <section>
        <h2>{{ $t("privacy.s10Title") }}</h2>
        <p>
          {{ $t("privacy.s10Before") }}
          <NuxtLink :to="localePath('/delete-account')" class="text-champagne-gold hover:text-deep-gold">{{ $t("privacy.s10Link") }}</NuxtLink>.
          {{ $t("privacy.s10After") }}
        </p>
        <p>{{ $t("privacy.s10Retained") }}</p>
      </section>

      <section>
        <h2>{{ $t("privacy.s11Title") }}</h2>
        <p>{{ $t("privacy.s11Body") }}</p>
      </section>
      <section>
        <h2>{{ $t("privacy.s12Title") }}</h2>
        <p>{{ $t("privacy.s12Body") }}</p>
      </section>
      <section>
        <h2>{{ $t("privacy.s13Title") }}</h2>
        <p>{{ $t("privacy.s13Before") }} <a href="mailto:support@wedlune.com" class="text-champagne-gold hover:text-deep-gold">support@wedlune.com</a>.</p>
      </section>
    </article>
  </div>
</template>

<script setup lang="ts">
const { t, tm, rt } = useI18n();
const localePath = useLocalePath();
const resolveList = (key: string) => (tm(key) as string[]).map((item) => rt(item));
const stringArray = (key: string) => computed(() => resolveList(key));
const s2Items = stringArray("privacy.s2Items");
const s7Items = stringArray("privacy.s7Items");
const paragraphSections = computed(() => [
  { key: "privacy.s3", paragraphs: resolveList("privacy.s3Paragraphs") },
  { key: "privacy.s4", paragraphs: resolveList("privacy.s4Paragraphs") },
]);
const s6Paragraphs = computed(() => resolveList("privacy.s6Paragraphs"));
const laterParagraphSections = computed(() => [
  { key: "privacy.s8", paragraphs: resolveList("privacy.s8Paragraphs") },
  { key: "privacy.s9", paragraphs: resolveList("privacy.s9Paragraphs") },
]);

useSeoMeta({
  title: () => t("privacy.seoTitle"),
  description: () => t("privacy.seoDescription"),
  ogTitle: () => t("privacy.seoTitle"),
  ogDescription: () => t("privacy.seoDescription"),
});
useSchemaOrg(() => [defineWebPage({ name: t("privacy.seoTitle"), description: t("privacy.seoDescription") })]);
</script>
