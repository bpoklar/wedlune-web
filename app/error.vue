<template>
  <NuxtLayout>
    <section class="soft-page-bg flex min-h-[42rem] items-center px-5 pb-20 pt-28 sm:pt-32">
      <div class="mx-auto w-full max-w-2xl text-center">
        <p class="section-kicker">{{ error?.statusCode === 404 ? "404" : $t("error.oops") }}</p>
        <h1 class="font-display text-5xl leading-tight text-charcoal sm:text-6xl">
          {{ error?.statusCode === 404 ? $t("error.notFound") : $t("error.title") }}
        </h1>
        <p class="mx-auto mt-6 max-w-lg text-base leading-8 text-warm-gray">
          {{ error?.statusCode === 404 ? $t("error.notFoundBody") : (error?.statusMessage || $t("error.body")) }}
        </p>
        <NuxtLink :to="localePath('/')" class="btn-primary mt-9">{{ $t("common.goHome") }}</NuxtLink>
      </div>
    </section>
  </NuxtLayout>
</template>

<script setup lang="ts">
const error = useError();
const { t } = useI18n();
const localePath = useLocalePath();
useSeoMeta({ title: () => error.value?.statusCode === 404 ? t("error.notFoundSeo") : t("error.seo"), robots: "noindex, nofollow" });
</script>
