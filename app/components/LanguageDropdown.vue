<template>
  <div
    class="language-dropdown"
    :class="[`language-dropdown-${size}`, `language-dropdown-${tone}`]"
  >
    <select
      data-language-select
      class="language-dropdown-control"
      :value="locale"
      :aria-label="$t('nav.language')"
      @change="selectLocale"
    >
      <option
        v-for="option in localeOptions"
        :key="option.code"
        data-language-option
        :value="option.code"
        :lang="option.code"
      >
        {{ option.label }}
      </option>
    </select>

    <svg class="language-dropdown-chevron" aria-hidden="true" viewBox="0 0 16 16" fill="none">
      <path d="m4 6 4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
  </div>
</template>

<script setup lang="ts">
type LocaleOption = string | { code: string; name?: string };

withDefaults(defineProps<{
  size?: "compact" | "utility";
  tone?: "light" | "dark" | "guest";
}>(), {
  size: "compact",
  tone: "light",
});

const emit = defineEmits<{
  change: [code: string];
}>();

const route = useRoute();
const switchLocalePath = useSwitchLocalePath();
const { locale, locales } = useI18n();

const localeOptions = computed(() => (locales.value as LocaleOption[]).map((option) => {
  if (typeof option === "string") {
    return { code: option, label: option.toUpperCase() };
  }

  return {
    code: option.code,
    label: option.name || option.code.toUpperCase(),
  };
}));

const selectLocale = async (event: Event) => {
  const code = (event.target as HTMLSelectElement).value;
  if (code === locale.value) return;

  const destination = switchLocalePath(code);
  if (!destination) return;

  emit("change", code);
  await navigateTo({
    path: destination.split(/[?#]/)[0],
    query: route.query,
    hash: route.hash,
  });
};
</script>

<style scoped>
.language-dropdown {
  position: relative;
  display: inline-flex;
  max-width: 100%;
  align-items: center;
}

.language-dropdown-control {
  width: 100%;
  min-height: 2.75rem;
  appearance: none;
  border: 1px solid var(--site-control-border);
  border-radius: 9999px;
  padding: 0.65rem 2.6rem 0.65rem 1rem;
  color: var(--site-text-muted);
  background-color: color-mix(in srgb, var(--site-bg-soft) 42%, transparent);
  cursor: pointer;
  font-size: 0.78rem;
  font-weight: 800;
  line-height: 1;
  transition: border-color 160ms ease, color 160ms ease, background-color 160ms ease, box-shadow 160ms ease;
}

.language-dropdown-control:hover {
  border-color: color-mix(in srgb, var(--site-accent) 55%, transparent);
  color: var(--site-accent-strong);
  background-color: color-mix(in srgb, var(--site-bg-soft) 62%, transparent);
}

.language-dropdown-chevron {
  position: absolute;
  right: 0.9rem;
  width: 0.9rem;
  height: 0.9rem;
  color: var(--site-accent-strong);
  pointer-events: none;
}

.language-dropdown-compact {
  min-width: 7.25rem;
}

.language-dropdown-utility {
  min-width: 6.75rem;
}

.language-dropdown-utility .language-dropdown-control {
  min-height: 2.35rem;
  padding: 0.5rem 2.25rem 0.5rem 0.85rem;
  font-size: 0.75rem;
}

.language-dropdown-utility .language-dropdown-chevron {
  right: 0.75rem;
  width: 0.8rem;
  height: 0.8rem;
}

.language-dropdown-dark .language-dropdown-control {
  border-color: color-mix(in srgb, var(--site-surface) 16%, transparent);
  color: var(--site-inverse-muted);
  background-color: color-mix(in srgb, var(--site-surface) 6%, transparent);
}

.language-dropdown-dark .language-dropdown-control:hover {
  border-color: color-mix(in srgb, var(--site-accent) 50%, transparent);
  color: var(--site-inverse-text);
  background-color: color-mix(in srgb, var(--site-surface) 10%, transparent);
}

.language-dropdown-dark .language-dropdown-chevron {
  color: var(--site-accent);
}

.language-dropdown-control option {
  color: var(--site-text);
  background: var(--site-bg);
}

.language-dropdown-guest .language-dropdown-control,
.language-dropdown-guest .language-dropdown-control option {
  color: var(--rsvp-input-text, var(--site-text));
  background: var(--rsvp-input-surface, var(--site-surface));
  border-color: var(--rsvp-input-border, var(--site-control-border));
}
.language-dropdown-guest .language-dropdown-control:hover {
  color: var(--rsvp-selection-text, var(--site-text));
  background: var(--rsvp-selection, var(--site-selection));
}
.language-dropdown-guest .language-dropdown-chevron {
  color: var(--rsvp-input-text, var(--site-text));
}

@media (prefers-reduced-motion: reduce) {
  .language-dropdown-control {
    transition: none;
  }
}
</style>
