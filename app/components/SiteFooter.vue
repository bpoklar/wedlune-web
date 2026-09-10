<template>
  <footer id="download" class="site-footer">
    <div v-if="showCta" class="section-shell footer-cta-wrap">
      <section v-reveal class="motion-reveal footer-cta" :aria-labelledby="ctaTitleId">
        <div class="footer-cta-copy">
          <p class="footer-kicker">{{ $t("footer.kicker") }}</p>
          <h2 :id="ctaTitleId" class="footer-title">{{ $t("footer.title") }}</h2>
        </div>

        <div class="footer-cta-action">
          <p class="footer-body">{{ $t("footer.body") }}</p>
          <AppStoreCtas />
        </div>

        <span class="footer-ornament" aria-hidden="true">W</span>
      </section>
    </div>

    <div class="footer-lower" :class="{ 'footer-lower-standalone': !showCta }">
      <div class="section-shell footer-main">
        <div class="footer-content">
          <div class="footer-brand">
            <NuxtLink :to="localePath('/')" class="inline-flex rounded-sm" :aria-label="$t('nav.homeLabel')">
              <img src="/img/wedlune-logo-light-284.png" alt="" width="142" height="29" class="h-7 w-auto">
            </NuxtLink>
            <p class="footer-tagline">{{ $t("footer.tagline") }}</p>
          </div>
          <nav class="footer-links" :aria-label="$t('footer.navigation')">
            <div class="footer-link-group">
              <h2 class="footer-heading">{{ $t("footer.product") }}</h2>
              <ul class="footer-list">
                <li><NuxtLink :to="homeLink('features')" class="footer-link">{{ $t("nav.features") }}</NuxtLink></li>
                <li><NuxtLink :to="homeLink('how-it-works')" class="footer-link">{{ $t("nav.howItWorks") }}</NuxtLink></li>
                <li><NuxtLink :to="homeLink('pricing')" class="footer-link">{{ $t("nav.pricing") }}</NuxtLink></li>
                <li><NuxtLink :to="homeLink('faq')" class="footer-link">{{ $t("nav.faq") }}</NuxtLink></li>
              </ul>
            </div>

            <div class="footer-link-group">
              <h2 class="footer-heading">{{ $t("footer.legal") }}</h2>
              <ul class="footer-list">
                <li><NuxtLink :to="localePath('/privacy')" class="footer-link">{{ $t("footer.privacyPolicy") }}</NuxtLink></li>
                <li><NuxtLink :to="localePath('/terms')" class="footer-link">{{ $t("footer.terms") }}</NuxtLink></li>
                <li><NuxtLink :to="localePath('/delete-account')" class="footer-link">{{ $t("footer.deleteAccount") }}</NuxtLink></li>
              </ul>
            </div>

            <div class="footer-link-group footer-support-group" data-footer-support>
              <h2 class="footer-heading">{{ $t("footer.support") }}</h2>
              <ul class="footer-list">
                <li><NuxtLink :to="localePath('/feedback')" class="footer-link">{{ $t("footer.feedback") }}</NuxtLink></li>
                <li><a href="mailto:support@wedlune.com" class="footer-link">support@wedlune.com</a></li>
              </ul>
            </div>
          </nav>
        </div>

        <div class="footer-meta">
          <p>{{ $t("footer.rights", { year: new Date().getFullYear() }) }}</p>
          <p class="footer-privacy-note">
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
              <path d="M12 3 5.5 5.8v5.7c0 4.1 2.6 7.8 6.5 9.5 3.9-1.7 6.5-5.4 6.5-9.5V5.8L12 3Z" stroke="currentColor" stroke-width="1.7" />
              <path d="m9.2 12 1.8 1.8 3.9-4" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            {{ $t("footer.noTracking") }}
          </p>
          <div class="footer-language-field">
            <span class="footer-language-label">{{ $t("nav.language") }}</span>
            <LanguageDropdown size="utility" tone="dark" />
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ showCta?: boolean }>(), { showCta: true });

const localePath = useLocalePath();
const ctaTitleId = useId();

const homeLink = (id: string) => localePath({ path: "/", hash: `#${id}` });
</script>

<style scoped>
.site-footer {
  overflow: hidden;
  border-top: 1px solid var(--site-border);
  color: var(--site-text);
  background: var(--site-bg-soft);
}

.footer-cta-wrap {
  padding-top: 5rem;
}

.footer-cta {
  position: relative;
  isolation: isolate;
  display: grid;
  gap: 2.5rem;
  overflow: hidden;
  border-radius: 1.5rem;
  padding: 2.5rem 1.5rem;
  color: white;
  background: var(--site-surface-strong);
  box-shadow: var(--site-shadow);
}

.footer-cta::before {
  position: absolute;
  inset: 0 auto 0 0;
  width: 0.3rem;
  content: "";
  background: var(--site-accent);
}

.footer-cta-copy,
.footer-cta-action {
  position: relative;
  z-index: 1;
}

.footer-kicker {
  margin-bottom: 1rem;
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--color-soft-champagne);
}

.footer-title {
  max-width: 12ch;
  font-family: var(--font-display);
  font-size: clamp(2.25rem, 5vw, 4.25rem);
  line-height: 1.04;
  text-wrap: balance;
}

.footer-cta-action {
  align-self: end;
}

.footer-body {
  max-width: 34rem;
  margin-bottom: 1.5rem;
  font-size: 1rem;
  line-height: 1.8;
  color: rgb(255 255 255 / 0.74);
}

.footer-ornament {
  position: absolute;
  right: -0.03em;
  bottom: -0.26em;
  z-index: 0;
  font-family: var(--font-display);
  font-size: clamp(12rem, 28vw, 24rem);
  font-style: italic;
  line-height: 1;
  color: rgb(255 255 255 / 0.035);
  pointer-events: none;
  user-select: none;
}

.footer-lower {
  position: relative;
  overflow: hidden;
  margin-top: 4rem;
  color: white;
  background:
    radial-gradient(circle at 88% -45%, rgb(181 150 114 / 0.2), transparent 28rem),
    var(--site-surface-strong);
}

.footer-lower-standalone {
  margin-top: 0;
}

.footer-main {
  padding-top: 3.5rem;
  padding-bottom: 1.75rem;
}

.footer-content {
  display: grid;
  gap: 2.5rem;
}

.footer-brand {
  max-width: 34rem;
}

.footer-tagline {
  max-width: 25ch;
  margin-top: 1rem;
  font-size: 0.9375rem;
  line-height: 1.75;
  color: rgb(255 255 255 / 0.64);
}

.footer-support-group {
  grid-column: 1 / -1;
}

.footer-language-field {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.6rem 0.8rem;
}

.footer-language-label {
  font-size: 0.72rem;
  font-weight: 700;
  color: rgb(255 255 255 / 0.48);
}

.footer-links {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 2rem 1.5rem;
}

.footer-heading {
  margin-bottom: 0.65rem;
  font-size: 0.68rem;
  font-weight: 900;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #e2c18b;
}

.footer-list {
  display: grid;
}

.footer-link {
  display: inline-flex;
  min-height: 2.5rem;
  align-items: center;
  overflow-wrap: anywhere;
  font-size: 0.875rem;
  font-weight: 700;
  color: rgb(255 255 255 / 0.62);
  transition: color 180ms ease;
}

.footer-link:hover,
.footer-link[aria-current="page"] {
  color: white;
}

.footer-meta {
  display: flex;
  flex-direction: column;
  gap: 1rem 1.5rem;
  margin-top: 2.5rem;
  border-top: 1px solid rgb(255 255 255 / 0.1);
  padding-top: 1.4rem;
  font-size: 0.72rem;
  line-height: 1.6;
  color: rgb(255 255 255 / 0.45);
}

.footer-privacy-note {
  display: flex;
  align-items: center;
  gap: 0.45rem;
}

.footer-privacy-note svg {
  width: 1rem;
  height: 1rem;
  flex: 0 0 auto;
  color: #8bb599;
}

@media (max-width: 23.99rem) {
  .footer-link-group:not(.footer-support-group) .footer-heading {
    min-height: 3em;
  }
}

@media (min-width: 48rem) {
  .footer-cta {
    padding: 3.5rem;
  }

  .footer-links {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 2rem;
  }

  .footer-support-group {
    grid-column: auto;
  }

  .footer-meta {
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
  }

}

@media (min-width: 64rem) {
  .footer-content {
    grid-template-columns: minmax(0, 1fr) minmax(0, 2fr);
    gap: 4rem;
  }

  .footer-cta {
    grid-template-columns: minmax(0, 1fr) minmax(25rem, 0.78fr);
    gap: 5rem;
    padding: 4.5rem;
  }

}

@media (prefers-reduced-motion: reduce) {
  .footer-link {
    transition: none;
  }
}
</style>
