<template>
  <div class="pt-24 pb-16">
    <article class="max-w-3xl mx-auto px-6 [&_h2]:font-display [&_h2]:text-[1.375rem] [&_h2]:text-charcoal [&_h2]:mt-8 [&_h2]:mb-3 [&_p]:text-[0.9375rem] [&_p]:leading-[1.7] [&_p]:text-warm-gray [&_p]:mb-3 [&_li]:text-[0.9375rem] [&_li]:leading-[1.7] [&_li]:text-warm-gray [&_li]:mb-3 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_section]:mb-6">
      <h1 class="font-display text-3xl md:text-4xl text-charcoal mb-8">{{ $t("terms.title") }}</h1>
      <p class="text-warm-gray text-sm mb-6">{{ $t("common.lastUpdated", { date: $t("terms.date") }) }}</p>

      <section v-for="section in singleSections" :key="section.key">
        <h2>{{ $t(`${section.key}Title`) }}</h2>
        <p>{{ $t(`${section.key}Body`) }}</p>
      </section>

      <section>
        <h2>{{ $t("terms.s3Title") }}</h2>
        <p v-for="paragraph in s3Paragraphs" :key="paragraph">{{ paragraph }}</p>
      </section>
      <section>
        <h2>{{ $t("terms.s4Title") }}</h2>
        <p>{{ $t("terms.s4Body") }}</p>
      </section>
      <section>
        <h2>{{ $t("terms.s5Title") }}</h2>
        <ul><li v-for="item in s5Items" :key="item">{{ item }}</li></ul>
      </section>

      <section v-for="section in middleSingleSections" :key="section.key">
        <h2>{{ $t(`${section.key}Title`) }}</h2>
        <p>{{ $t(`${section.key}Body`) }}</p>
      </section>
      <section>
        <h2>{{ $t("terms.s8Title") }}</h2>
        <p>{{ $t("terms.s8Intro") }}</p>
        <ul><li v-for="item in s8Items" :key="item">{{ item }}</li></ul>
      </section>
      <section>
        <h2>{{ $t("terms.s9Title") }}</h2>
        <p>{{ $t("terms.s9Body") }}</p>
      </section>
      <section>
        <h2>{{ $t("terms.s10Title") }}</h2>
        <p>{{ $t("terms.s10Body") }}</p>
      </section>
      <section>
        <h2>{{ $t("terms.s11Title") }}</h2>
        <p>
          {{ $t("terms.s11BeforeDelete") }}
          <NuxtLink :to="localePath('/delete-account')" class="text-champagne-gold hover:text-deep-gold">{{ $t("terms.s11DeleteLink") }}</NuxtLink>.
          {{ $t("terms.s11Middle") }}
          <NuxtLink :to="localePath('/privacy')" class="text-champagne-gold hover:text-deep-gold">{{ $t("terms.s11PrivacyLink") }}</NuxtLink>.
        </p>
      </section>
      <section v-for="section in finalSections" :key="section.key">
        <h2>{{ $t(`${section.key}Title`) }}</h2>
        <p>{{ $t(`${section.key}Body`) }}</p>
      </section>
      <section>
        <h2>{{ $t("terms.s14Title") }}</h2>
        <p>{{ $t("terms.s14Before") }} <a href="mailto:support@wedlune.com" class="text-champagne-gold hover:text-deep-gold">support@wedlune.com</a>.</p>
      </section>
    </article>
  </div>
</template>

<script setup lang="ts">
const { t, tm, rt } = useI18n();
const localePath = useLocalePath();
const singleSections = [{ key: "terms.s1" }, { key: "terms.s2" }];
const middleSingleSections = [{ key: "terms.s6" }, { key: "terms.s7" }];
const finalSections = [{ key: "terms.s12" }, { key: "terms.s13" }];
const resolveList = (key: string) => (tm(key) as string[]).map((item) => rt(item));
const s3Paragraphs = computed(() => resolveList("terms.s3Paragraphs"));
const s5Items = computed(() => resolveList("terms.s5Items"));
const s8Items = computed(() => resolveList("terms.s8Items"));

useSeoMeta({
  title: () => t("terms.seoTitle"),
  description: () => t("terms.seoDescription"),
  ogTitle: () => t("terms.seoTitle"),
  ogDescription: () => t("terms.seoDescription"),
});
useSchemaOrg(() => [defineWebPage({ name: t("terms.seoTitle"), description: t("terms.seoDescription") })]);
</script>
