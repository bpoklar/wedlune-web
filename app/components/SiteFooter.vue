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

    <div class="section-shell footer-main" :class="showCta ? '' : 'footer-main-standalone'">
      <div class="footer-grid">
        <div class="footer-brand">
          <NuxtLink :to="localePath('/')" class="inline-flex rounded-sm" :aria-label="$t('nav.homeLabel')">
            <img src="/img/wedlune-logo-dark-284.png" alt="" width="142" height="29" class="h-6 w-auto">
          </NuxtLink>
          <p class="footer-tagline">{{ $t("footer.tagline") }}</p>
          <a href="mailto:support@wedlune.com" class="footer-email">support@wedlune.com</a>
        </div>

        <nav class="footer-links" :aria-label="$t('footer.navigation')">
          <div>
            <h2 class="footer-heading">{{ $t("footer.product") }}</h2>
            <ul class="footer-list">
              <li><NuxtLink :to="homeLink('features')" class="footer-link">{{ $t("nav.features") }}</NuxtLink></li>
              <li><NuxtLink :to="homeLink('how-it-works')" class="footer-link">{{ $t("nav.howItWorks") }}</NuxtLink></li>
              <li><NuxtLink :to="homeLink('pricing')" class="footer-link">{{ $t("nav.pricing") }}</NuxtLink></li>
              <li><NuxtLink :to="homeLink('faq')" class="footer-link">{{ $t("nav.faq") }}</NuxtLink></li>
            </ul>
          </div>

          <div>
            <h2 class="footer-heading">{{ $t("footer.legal") }}</h2>
            <ul class="footer-list">
              <li><NuxtLink :to="localePath('/privacy')" class="footer-link">{{ $t("footer.privacyPolicy") }}</NuxtLink></li>
              <li><NuxtLink :to="localePath('/terms')" class="footer-link">{{ $t("footer.terms") }}</NuxtLink></li>
              <li><NuxtLink :to="localePath('/delete-account')" class="footer-link">{{ $t("footer.deleteAccount") }}</NuxtLink></li>
            </ul>
          </div>

          <div>
            <h2 class="footer-heading">{{ $t("nav.language") }}</h2>
            <ul class="footer-list" :aria-label="$t('nav.language')">
              <li>
                <NuxtLink :to="switchTo('en')" class="footer-link" :aria-current="locale === 'en' ? 'page' : undefined">
                  English
                </NuxtLink>
              </li>
              <li>
                <NuxtLink :to="switchTo('sl')" class="footer-link" :aria-current="locale === 'sl' ? 'page' : undefined">
                  Slovenščina
                </NuxtLink>
              </li>
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
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ showCta?: boolean }>(), { showCta: true });

const localePath = useLocalePath();
const switchLocalePath = useSwitchLocalePath();
const { locale } = useI18n();
const ctaTitleId = useId();

type SupportedLocale = "en" | "sl";

const homeLink = (id: string) => localePath({ path: "/", hash: `#${id}` });
const switchTo = (code: SupportedLocale) => switchLocalePath(code) || localePath("/");
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

.footer-main {
  padding-top: 4.5rem;
  padding-bottom: 2rem;
}

.footer-main-standalone {
  padding-top: 4rem;
}

.footer-grid {
  display: grid;
  gap: 3.5rem;
}

.footer-brand {
  max-width: 24rem;
}

.footer-tagline {
  margin-top: 1.25rem;
  font-size: 0.9375rem;
  line-height: 1.8;
  color: var(--site-text-muted);
}

.footer-email {
  display: inline-flex;
  min-height: 2.75rem;
  align-items: center;
  margin-top: 1rem;
  font-size: 0.875rem;
  font-weight: 800;
  color: var(--site-accent-strong);
  text-underline-offset: 0.25rem;
}

.footer-email:hover {
  text-decoration: underline;
}

.footer-links {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 2.5rem 1.5rem;
}

.footer-heading {
  margin-bottom: 0.75rem;
  font-size: 0.72rem;
  font-weight: 900;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--site-text);
}

.footer-list {
  display: grid;
  gap: 0.05rem;
}

.footer-link {
  display: inline-flex;
  min-height: 2.75rem;
  align-items: center;
  overflow-wrap: anywhere;
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--site-text-muted);
  transition: color 180ms ease;
}

.footer-link:hover,
.footer-link[aria-current="page"] {
  color: var(--site-accent-strong);
}

.footer-link[aria-current="page"]::after {
  width: 0.3rem;
  height: 0.3rem;
  margin-left: 0.45rem;
  border-radius: 999px;
  content: "";
  background: var(--site-accent);
}

.footer-meta {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  margin-top: 3.5rem;
  border-top: 1px solid var(--site-border);
  padding-top: 1.5rem;
  font-size: 0.75rem;
  line-height: 1.6;
  color: var(--site-text-muted);
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
  color: var(--site-success);
}

@media (min-width: 48rem) {
  .footer-cta {
    padding: 3.5rem;
  }

  .footer-links {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .footer-meta {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
}

@media (min-width: 64rem) {
  .footer-cta {
    grid-template-columns: minmax(0, 1fr) minmax(25rem, 0.78fr);
    gap: 5rem;
    padding: 4.5rem;
  }

  .footer-grid {
    grid-template-columns: minmax(18rem, 1.2fr) minmax(28rem, 1fr);
    gap: 6rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .footer-link {
    transition: none;
  }
}
</style>
