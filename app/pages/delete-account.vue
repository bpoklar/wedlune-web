<template>
  <div class="pt-24 pb-16">
    <article
      class="max-w-3xl mx-auto px-6 [&_h2]:font-display [&_h2]:text-[1.375rem] [&_h2]:text-charcoal [&_h2]:mt-8 [&_h2]:mb-3 [&_p]:text-[0.9375rem] [&_p]:leading-[1.7] [&_p]:text-warm-gray [&_p]:mb-3 [&_li]:text-[0.9375rem] [&_li]:leading-[1.7] [&_li]:text-warm-gray [&_li]:mb-3 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4 [&_section]:mb-6"
    >
      <h1 class="font-display text-3xl md:text-4xl text-charcoal mb-8">
        {{ $t("deleteAccount.title") }}
      </h1>
      <p class="text-warm-gray text-sm mb-6">{{ $t("common.lastUpdated", { date: $t("deleteAccount.date") }) }}</p>

      <section>
        <h2>{{ $t("deleteAccount.appTitle") }}</h2>
        <p>{{ $t("deleteAccount.appIntro") }}</p>
        <ol>
          <li v-for="step in deletionSteps" :key="step">{{ step }}</li>
        </ol>
      </section>

      <section>
        <h2>{{ $t("deleteAccount.emailTitle") }}</h2>
        <p>
          {{ $t("deleteAccount.emailBefore") }}
          <a
            :href="deletionEmail"
            class="text-champagne-gold hover:text-deep-gold"
            >support@wedlune.com</a
          >
          {{ $t("deleteAccount.emailAfter") }}
        </p>
      </section>

      <section>
        <h2>{{ $t("deleteAccount.deletedTitle") }}</h2>
        <p>{{ $t("deleteAccount.deletedBody") }}</p>
      </section>

      <section>
        <h2>{{ $t("deleteAccount.retainedTitle") }}</h2>
        <p>{{ $t("deleteAccount.retainedBody") }}</p>
      </section>

      <section>
        <h2>{{ $t("deleteAccount.privacyTitle") }}</h2>
        <p>
          {{ $t("deleteAccount.privacyBefore") }}
          <NuxtLink
            :to="localePath('/privacy')"
            class="text-champagne-gold hover:text-deep-gold"
            >{{ $t("deleteAccount.privacyLink") }}</NuxtLink
          >
          {{ $t("deleteAccount.privacyAfter") }}
        </p>
      </section>
    </article>
  </div>
</template>

<script setup lang="ts">
const { t, tm, rt } = useI18n();
const localePath = useLocalePath();
const deletionSteps = computed(() =>
  (tm("deleteAccount.steps") as string[]).map((step) => rt(step)),
);
const deletionEmail = computed(
  () => `mailto:support@wedlune.com?subject=${encodeURIComponent(t("deleteAccount.emailSubject"))}`,
);

useSeoMeta({
  title: () => t("deleteAccount.seoTitle"),
  description: () => t("deleteAccount.seoDescription"),
  ogTitle: () => t("deleteAccount.seoTitle"),
  ogDescription: () => t("deleteAccount.seoDescription"),
});

useSchemaOrg(() => [
  defineWebPage({
    name: t("deleteAccount.seoTitle"),
    description: t("deleteAccount.seoDescription"),
  }),
]);
</script>
