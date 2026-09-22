<template>
  <section v-reveal class="proof-strip motion-reveal" :aria-label="$t('home.proof.label')">
    <div class="section-shell grid grid-cols-2 lg:grid-cols-4">
      <div v-for="item in items" :key="item" class="flex min-h-22 items-center gap-3 px-2 py-5 sm:px-6">
        <span class="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface/8 text-subtle ring-1 ring-on-inverse/10" aria-hidden="true">
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="m5 12 4 4L19 6" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.25" />
          </svg>
        </span>
        <p class="text-xs font-extrabold leading-5 text-on-inverse sm:text-sm">{{ item }}</p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const { tm, rt } = useI18n();
const items = computed(() => (tm("home.proof.items") as string[]).map((item) => rt(item)));
</script>

<style scoped>
.proof-strip {
  border-block: 1px solid color-mix(in srgb, var(--site-surface) 8%, transparent);
  color: var(--site-inverse-text);
  background:
    radial-gradient(circle at 11% 0%, color-mix(in srgb, var(--site-accent) 18%, transparent), transparent 18rem),
    linear-gradient(105deg, var(--site-surface-strong), var(--site-surface-strong) 56%, var(--site-surface-strong));
}

</style>
