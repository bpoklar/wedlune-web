<template>
  <div class="flex flex-wrap gap-3" :class="centered ? 'justify-center' : ''" :aria-label="$t('store.groupLabel')">
    <component
      :is="store.url ? 'a' : 'span'"
      v-for="store in stores"
      :key="store.platform"
      v-bind="store.url ? externalLinkProps(store.url) : { 'aria-disabled': 'true' }"
      class="store-badge"
      :class="[
        compact ? 'store-badge-compact' : '',
        store.url ? 'store-badge-active' : 'store-badge-unavailable',
      ]"
    >
      <svg v-if="store.platform === 'ios'" aria-hidden="true" viewBox="0 0 24 24" class="h-7 w-7 shrink-0" fill="currentColor">
        <path d="M16.7 12.7c0-2.4 2-3.6 2.1-3.7-1.1-1.6-2.9-1.8-3.5-1.8-1.5-.2-2.9.9-3.6.9-.8 0-1.9-.9-3.1-.9-1.6 0-3.1.9-3.9 2.4-1.7 2.9-.4 7.2 1.2 9.6.8 1.2 1.8 2.5 3.1 2.4 1.2 0 1.7-.8 3.2-.8s1.9.8 3.2.8c1.3 0 2.2-1.2 3-2.4.9-1.4 1.3-2.7 1.3-2.8-.1 0-2.5-1-2.5-3.7ZM14.3 5.6c.7-.9 1.2-2.1 1.1-3.3-1.1 0-2.4.7-3.2 1.6-.7.8-1.3 2-1.1 3.2 1.2.1 2.4-.6 3.2-1.5Z" />
      </svg>
      <svg v-else aria-hidden="true" viewBox="0 0 24 24" class="h-7 w-7 shrink-0" fill="currentColor">
        <path d="M3.4 2.8a2 2 0 0 0-.4 1.3v15.8c0 .5.1.9.4 1.3l9.1-9.2-9.1-9.2Zm10.4 10.5-2 2 6.6 3.8c.8.5 1.8.2 2.3-.5.1-.2.2-.4.2-.6l-7.1-4.7ZM18.4 4.9l-6.6 3.8 2 2 7.1-4.7c-.2-1-1.3-1.7-2.5-1.1ZM4.7 2.1l8 8 1.7-1.7-8.8-5.1c-.3-.2-.6-.3-.9-.2Z" />
      </svg>
      <span class="min-w-0 text-left leading-none">
        <span class="block text-[0.62rem] font-bold uppercase tracking-[0.08em] text-white/70">
          {{ store.url ? store.eyebrow : $t('store.comingSoon') }}
        </span>
        <span class="mt-1 block whitespace-nowrap text-sm font-extrabold text-white sm:text-base">
          {{ store.name }}
        </span>
      </span>
    </component>
  </div>
</template>

<script setup lang="ts">
import { normalizeStoreUrl } from "~/utils/storeLinks";

withDefaults(defineProps<{ compact?: boolean; centered?: boolean }>(), {
  compact: false,
  centered: false,
});

const config = useRuntimeConfig();
const { t } = useI18n();

const stores = computed(() => [
  {
    platform: "ios",
    name: t("store.appStore"),
    eyebrow: t("store.downloadOn"),
    url: normalizeStoreUrl(config.public.appStoreUrl, "ios"),
  },
  {
    platform: "android",
    name: t("store.googlePlay"),
    eyebrow: t("store.getItOn"),
    url: normalizeStoreUrl(config.public.googlePlayUrl, "android"),
  },
]);

const externalLinkProps = (url: string) => ({
  href: url,
  target: "_blank",
  rel: "noopener noreferrer",
});
</script>

<style scoped>
.store-badge {
  display: inline-flex;
  min-height: 3.65rem;
  min-width: 11.5rem;
  align-items: center;
  gap: 0.7rem;
  border: 1px solid rgb(255 255 255 / 0.18);
  border-radius: 0.9rem;
  padding: 0.7rem 1rem;
  color: white;
  background: #241f1b;
}

.store-badge-compact {
  min-height: 3.3rem;
  min-width: 10.5rem;
  padding-block: 0.55rem;
}

.store-badge-active {
  box-shadow: 0 12px 30px rgb(36 31 27 / 0.18);
  transition: transform 180ms ease, background-color 180ms ease;
}

.store-badge-active:hover {
  transform: translateY(-2px);
  background: var(--site-accent-strong);
}

.store-badge-unavailable {
  cursor: not-allowed;
  background: #4c4540;
  opacity: 0.78;
}
</style>
