<script setup lang="ts">
import {
  authCallbackPath,
  buildLegacyAuthCallback,
  parseAuthCallbackFlow,
} from "~/utils/authCallback";

definePageMeta({ layout: false });

const route = useRoute();
const flow = parseAuthCallbackFlow(route.params.flow);
const ready = ref(false);
const invalid = ref(!flow);
const appCallback = ref<string | null>(null);

const copy = computed(() => {
  const slovenian = import.meta.client && navigator.language.toLowerCase().startsWith("sl");
  if (slovenian) {
    return {
      title: "Odpri Wedlune",
      body: "Za dokončanje varnega postopka odpri povezavo v aplikaciji Wedlune.",
      button: "Odpri Wedlune",
      invalid: "Povezava za prijavo ni veljavna ali je potekla.",
    };
  }
  return {
    title: "Open Wedlune",
    body: "Open this link in the Wedlune app to finish the secure account flow.",
    button: "Open Wedlune",
    invalid: "This authentication link is invalid or has expired.",
  };
});

useHead({
  title: "Open Wedlune",
  meta: [
    { name: "robots", content: "noindex, nofollow" },
    { name: "referrer", content: "no-referrer" },
  ],
});

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
  color: #34272b;
  background: radial-gradient(circle at top, #fffdf9 0%, #f7eee8 100%);
  font-family: Arial, sans-serif;
}

.callback-card {
  width: min(100%, 440px);
  padding: 40px 28px;
  border: 1px solid rgb(99 75 62 / 14%);
  border-radius: 24px;
  background: rgb(255 253 249 / 94%);
  box-shadow: 0 20px 60px rgb(72 48 50 / 10%);
  text-align: center;
}

.callback-logo {
  width: 96px;
  height: 96px;
  object-fit: contain;
}

h1 {
  margin: 12px 0;
  font-family: Georgia, serif;
  font-size: clamp(1.8rem, 7vw, 2.4rem);
  font-weight: 500;
}

p {
  margin: 0 auto 24px;
  max-width: 34ch;
  color: #6f5b62;
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
  color: #fff;
  background: #74565e;
  font: inherit;
  font-weight: 700;
  cursor: pointer;
}

button:focus-visible {
  outline: 3px solid #c69b62;
  outline-offset: 3px;
}

button:disabled {
  cursor: not-allowed;
  opacity: 0.55;
}
</style>
