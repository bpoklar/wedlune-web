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
      <div class="section-shell footer-main" :class="showCta ? '' : 'footer-main-standalone'">
        <div class="footer-intro">
          <div class="footer-brand">
            <NuxtLink :to="localePath('/')" class="inline-flex rounded-sm" :aria-label="$t('nav.homeLabel')">
              <img src="/img/wedlune-logo-light-284.png" alt="" width="142" height="29" class="h-7 w-auto">
            </NuxtLink>
            <p class="footer-tagline">{{ $t("footer.tagline") }}</p>
          </div>
        </div>

        <div class="footer-divider" aria-hidden="true"><span>✦</span></div>

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
            <RingsMotif size="large" class="footer-rings" />
            <h2 class="footer-heading">{{ $t("footer.support") }}</h2>
            <a href="mailto:support@wedlune.com" class="footer-support-email">
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
                <path d="M4 6.5h16v11H4v-11Z" stroke="currentColor" stroke-width="1.6" />
                <path d="m5 7.5 7 5 7-5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              support@wedlune.com
            </a>
            <div class="footer-language-field">
              <span class="footer-language-label">{{ $t("nav.language") }}</span>
              <LanguageDropdown size="utility" tone="dark" />
            </div>
          </div>
        </nav>

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

.footer-main-standalone {
  padding-top: 3.5rem;
}

.footer-intro {
  position: relative;
  z-index: 1;
}

.footer-brand {
  max-width: 34rem;
}

.footer-tagline {
  max-width: 30rem;
  margin-top: 1rem;
  font-size: 0.9375rem;
  line-height: 1.75;
  color: rgb(255 255 255 / 0.64);
}

.footer-support-email {
  display: inline-flex;
  min-height: 2.5rem;
  width: fit-content;
  align-items: center;
  gap: 0.55rem;
  font-size: 0.875rem;
  font-weight: 700;
  color: rgb(255 255 255 / 0.68);
  transition: color 180ms ease;
}

.footer-support-email svg {
  width: 1rem;
  height: 1rem;
  flex: 0 0 auto;
  color: #e2c18b;
}

.footer-support-email:hover {
  color: white;
}

.footer-support-group {
  position: relative;
  isolation: isolate;
}

.footer-support-group > :not(.footer-rings) {
  position: relative;
  z-index: 1;
}

.footer-language-field {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.6rem 0.8rem;
  margin-top: 0.65rem;
}

.footer-language-label {
  font-size: 0.72rem;
  font-weight: 700;
  color: rgb(255 255 255 / 0.48);
}

.footer-rings {
  position: absolute;
  right: -1rem;
  top: -1.75rem;
  z-index: -1;
  color: rgb(226 193 139 / 0.15);
  transform: rotate(-7deg);
}

.footer-divider {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-block: 2.5rem;
  color: rgb(226 193 139 / 0.72);
}

.footer-divider::before,
.footer-divider::after {
  height: 1px;
  flex: 1 1 auto;
  content: "";
  background: rgb(255 255 255 / 0.1);
}

.footer-divider::after {
  flex-grow: 0.08;
}

.footer-links {
  position: relative;
  z-index: 1;
  display: grid;
  gap: 2rem;
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
  display: flex;
  flex-wrap: wrap;
  gap: 0 1.4rem;
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

.footer-link[aria-current="page"]::after {
  width: 0.3rem;
  height: 0.3rem;
  margin-left: 0.45rem;
  border-radius: 999px;
  content: "";
  background: #e2c18b;
}

.footer-meta {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
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

@media (min-width: 48rem) {
  .footer-cta {
    padding: 3.5rem;
  }

  .footer-links {
    grid-template-columns: minmax(0, 1.2fr) minmax(0, 1.2fr) minmax(15rem, 0.8fr);
    gap: 2rem 3rem;
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

}

@media (prefers-reduced-motion: reduce) {
  .footer-link {
    transition: none;
  }
}
</style>
