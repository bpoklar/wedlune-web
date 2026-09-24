<script setup lang="ts">
import {
  authCallbackPath,
  resolveCallbackLocale,
  buildLegacyAuthCallback,
  parseAuthCallbackFlow,
} from "~/utils/authCallback";

definePageMeta({ layout: false });

const route = useRoute();
const flow = parseAuthCallbackFlow(route.params.flow);
const ready = ref(false);
const invalid = ref(!flow);
const appCallback = ref<string | null>(null);

// Authentication callback URLs remain unprefixed and credential-safe.
defineI18nRoute(false);
const { t, locale, loadLocaleMessages } = useI18n();
const callbackLocale = import.meta.client
  ? resolveCallbackLocale(navigator.languages)
  : "en";
await loadLocaleMessages(callbackLocale);
locale.value = callbackLocale;
const copy = computed(() => ({
  title: t("authCallback.title", {}, { locale: callbackLocale }),
  body: t("authCallback.body", {}, { locale: callbackLocale }),
  button: t("authCallback.button", {}, { locale: callbackLocale }),
  invalid: t("authCallback.invalid", {}, { locale: callbackLocale }),
}));

useHead(() => ({
  title: copy.value.title,
  titleTemplate: null,
  htmlAttrs: { lang: callbackLocale },
  meta: [
    { name: "robots", content: "noindex, nofollow" },
    { name: "referrer", content: "no-referrer" },
  ],
}));

onMounted(() => {
  if (!flow) {
    ready.value = true;
    return;
  }

  const callback = buildLegacyAuthCallback(window.location.href, flow);
  appCallback.value = callback;
  invalid.value = !callback;

  // Remove one-time credentials from the visible browser URL before any user
  // interaction. The in-memory callback remains available to the button.
  window.history.replaceState(null, document.title, authCallbackPath(flow));

  if (callback) {
    window.location.assign(callback);
  }
  window.setTimeout(() => {
    ready.value = true;
  }, 900);
});

const openApp = () => {
  if (appCallback.value) window.location.assign(appCallback.value);
};
</script>

<template>
  <main class="callback-shell">
    <section class="callback-card" aria-labelledby="callback-title">
      <img
        class="callback-logo"
        src="/img/wedlune-logo-dark-284.png"
        alt="Wedlune"
        width="142"
        height="142"
      >
      <h1 id="callback-title">{{ copy.title }}</h1>
      <p v-if="flow && !invalid">{{ copy.body }}</p>
      <p v-else role="alert">{{ copy.invalid }}</p>
      <p v-if="flow && !invalid && !ready" class="callback-status" role="status" aria-live="polite">
        {{ copy.button }}…
      </p>
      <button
        v-if="flow && !invalid && ready"
        id="open-wedlune"
        class="btn-primary"
        type="button"
        :disabled="!appCallback"
        @click="openApp"
      >
        {{ copy.button }}
      </button>
    </section>
  </main>
</template>

<style scoped>
.callback-shell {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 24px;
  color: var(--site-text);
  background: radial-gradient(circle at top, var(--site-bg) 0%, var(--site-blush) 100%);
  font-family: var(--font-body);
}

.callback-card {
  width: min(100%, 440px);
  padding: 40px 28px;
  border: 1px solid color-mix(in srgb, var(--site-text) 14%, transparent);
  border-radius: 24px;
  background: color-mix(in srgb, var(--site-bg) 94%, transparent);
  box-shadow: 0 20px 60px color-mix(in srgb, var(--site-text) 10%, transparent);
  text-align: center;
}

.callback-logo {
  width: 96px;
  height: 96px;
  object-fit: contain;
}

h1 {
  margin: 12px 0;
  font-family: var(--font-display);
  font-size: clamp(1.8rem, 7vw, 2.4rem);
  font-weight: 500;
}

p {
  margin: 0 auto 24px;
  max-width: 34ch;
  color: var(--site-text-muted);
  line-height: 1.6;
}

.callback-status {
  margin-bottom: 0;
}

button {
  min-height: 48px;
  padding: 12px 24px;
  border: 0;
  border-radius: 999px;
  color: var(--site-on-accent);
  background: var(--site-accent);
  font: inherit;
  font-weight: 700;
  cursor: pointer;
}

button:hover:not(:disabled) { background: var(--site-accent-hover); }

button:active:not(:disabled) { background: var(--site-accent-pressed); }

button:focus-visible {
  outline: 3px solid var(--site-focus);
  outline-offset: 3px;
}

button:disabled {
  cursor: not-allowed;
  opacity: 0.55;
}
</style>
