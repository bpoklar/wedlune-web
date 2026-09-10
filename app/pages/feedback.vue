<template>
  <section class="feedback-page section-shell" aria-labelledby="feedback-title">
    <div class="feedback-intro">
      <p class="feedback-kicker">{{ t('feedback.kicker') }}</p>
      <h1 id="feedback-title">{{ t('feedback.title') }}</h1>
      <p>{{ t('feedback.subtitle') }}</p>
    </div>

    <div v-if="submitted" class="feedback-card feedback-success" role="status">
      <span class="feedback-success-mark" aria-hidden="true">✓</span>
      <h2 ref="successHeading" tabindex="-1">{{ t('feedback.successTitle') }}</h2>
      <p>{{ t('feedback.success') }}</p>
      <button type="button" class="btn-primary" @click="startAgain">{{ t('feedback.sendAnother') }}</button>
      <NuxtLink :to="localePath('/')" class="feedback-text-link">{{ t('feedback.backHome') }}</NuxtLink>
    </div>

    <form v-else class="feedback-card" method="post" novalidate :aria-busy="submitting" @submit.prevent="submitFeedback">
      <fieldset :disabled="!ready || submitting" class="feedback-fields">
        <fieldset class="feedback-field">
          <legend>{{ t('feedback.category') }}</legend>
          <div class="feedback-categories">
            <label v-for="category in feedbackCategories" :key="category" class="feedback-chip">
              <input v-model="form.category" type="radio" name="category" :value="category">
              <span>{{ t(`feedback.categories.${category}`) }}</span>
            </label>
          </div>
        </fieldset>

        <div class="feedback-field">
          <label for="feedback-message">{{ t('feedback.message') }} <span aria-hidden="true">*</span></label>
          <textarea id="feedback-message" v-model="form.message" rows="6" required maxlength="2000"
            :placeholder="t('feedback.messageHint')" :aria-invalid="Boolean(errors.message)"
            :aria-describedby="errors.message ? 'feedback-message-error feedback-count' : 'feedback-count'"
            @blur="validateField('message')" @input="revalidate('message')" />
          <div class="feedback-message-meta">
            <p v-if="errors.message" id="feedback-message-error" class="feedback-error">{{ t(errors.message) }}</p>
            <p id="feedback-count" class="feedback-count">{{ t('feedback.messageCount', { count: form.message.length }) }}</p>
          </div>
        </div>

        <fieldset class="feedback-field">
          <legend>{{ t('feedback.rating') }}</legend>
          <div class="feedback-rating">
            <button v-for="star in 5" :key="star" type="button" class="feedback-star"
              :class="{ 'is-filled': form.rating !== null && star <= form.rating }"
              :aria-label="t('feedback.ratingStar', { count: star })" :aria-pressed="form.rating === star"
              @click="form.rating = form.rating === star ? null : star">
              <svg aria-hidden="true" viewBox="0 0 24 24"><path d="m12 2.5 2.94 5.96 6.58.96-4.76 4.64 1.12 6.55L12 17.52l-5.88 3.09 1.12-6.55-4.76-4.64 6.58-.96L12 2.5Z" /></svg>
            </button>
            <button v-if="form.rating !== null" type="button" class="feedback-clear" @click="form.rating = null">{{ t('feedback.clearRating') }}</button>
          </div>
        </fieldset>

        <div class="feedback-field">
          <label for="feedback-email">{{ t('feedback.email') }}</label>
          <input id="feedback-email" v-model="form.email" type="email" autocomplete="email" maxlength="254"
            :placeholder="t('feedback.emailHint')" :aria-invalid="Boolean(errors.email)"
            :aria-describedby="errors.email ? 'feedback-email-error feedback-email-help' : 'feedback-email-help'"
            @blur="validateField('email')" @input="revalidate('email')">
          <p id="feedback-email-help" class="feedback-help">{{ t('feedback.emailHelp') }}</p>
          <p v-if="errors.email" id="feedback-email-error" class="feedback-error">{{ t(errors.email) }}</p>
        </div>

        <div class="feedback-honeypot" aria-hidden="true" inert>
          <label for="feedback-website">{{ t('feedback.website') }}</label>
          <input id="feedback-website" v-model="form.website" name="website" type="text" tabindex="-1" autocomplete="off">
        </div>

        <p class="feedback-help feedback-privacy">{{ t('feedback.privacyBefore') }} <NuxtLink :to="localePath('/privacy')">{{ t('feedback.privacyLink') }}</NuxtLink>{{ t('feedback.privacyAfter') }}</p>
        <p v-if="submitError" class="feedback-error feedback-submit-error" role="alert">{{ t(submitError) }}</p>
        <button type="submit" class="btn-primary feedback-submit" :disabled="!ready || submitting">
          {{ t(submitting ? 'feedback.submitting' : 'feedback.submit') }}
        </button>
      </fieldset>
    </form>
  </section>
</template>

<script setup lang="ts">
import { feedbackCategories, feedbackSchema, type FeedbackInput } from '~/utils/feedback';

definePageMeta({ layout: 'legal' });
const { t } = useI18n();
const localePath = useLocalePath();
const config = useRuntimeConfig();
useLocalizedSeo({ title: () => t('feedback.seoTitle'), description: () => t('feedback.seoDescription'), path: '/feedback' });

const initialForm = () => ({ category: 'general' as FeedbackInput['category'], message: '', rating: null as number | null, email: '', website: '' });
const form = reactive(initialForm());
const errors = reactive<Record<string, string>>({});
const ready = ref(false);
onMounted(() => { ready.value = true; });
const submitting = ref(false);
const submitted = ref(false);
const submitError = ref('');
const successHeading = ref<HTMLElement | null>(null);

function validateField(field: string) {
  delete errors[field];
  const result = feedbackSchema.safeParse(form);
  if (result.success && submitError.value === 'feedback.errors.invalid') submitError.value = '';
  if (!result.success) {
    const issue = result.error.issues.find((issue) => issue.path[0] === field);
    if (issue) errors[field] = issue.message;
  }
}

function revalidate(field: string) {
  if (errors[field]) nextTick(() => validateField(field));
}

function startAgain() {
  Object.assign(form, initialForm());
  submitted.value = false;
  submitError.value = '';
  for (const key of Object.keys(errors)) delete errors[key];
  nextTick(() => document.getElementById('feedback-message')?.focus());
}

async function submitFeedback() {
  if (submitting.value) return;
  submitError.value = '';
  for (const key of Object.keys(errors)) delete errors[key];
  const result = feedbackSchema.safeParse(form);
  if (!result.success) {
    for (const issue of result.error.issues) {
      const field = String(issue.path[0]);
      if (!errors[field]) errors[field] = issue.message;
    }
    submitError.value = 'feedback.errors.invalid';
    await nextTick();
    document.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
    return;
  }
  if (!navigator.onLine) {
    submitError.value = 'feedback.errors.offline';
    return;
  }
  if (!config.public.supabaseUrl || !config.public.supabaseAnonKey) {
    submitError.value = 'feedback.errors.unavailable';
    return;
  }
  submitting.value = true;
  try {
    const response = await $fetch<{ success: boolean }>(`${config.public.supabaseUrl}/functions/v1/submit-feedback`, {
      method: 'POST',
      headers: { apikey: String(config.public.supabaseAnonKey) },
      body: result.data,
      retry: 0,
      timeout: 20_000,
    });
    if (response.success !== true) throw new Error('Invalid feedback response');
    submitted.value = true;
    Object.assign(form, initialForm());
    await nextTick();
    successHeading.value?.focus();
  } catch (error) {
    const code = (error as { data?: { code?: string } }).data?.code;
    submitError.value = !navigator.onLine ? 'feedback.errors.offline'
      : code === 'rate_limited' ? 'feedback.errors.rateLimited'
      : code === 'invalid_request' ? 'feedback.errors.invalid'
      : 'feedback.errors.unavailable';
  } finally {
    submitting.value = false;
  }
}
</script>

<style scoped>
.feedback-page { max-width: 52rem; padding-block: clamp(3rem, 7vw, 6rem); }
.feedback-intro { max-width: 38rem; margin: 0 auto 2.5rem; text-align: center; }
.feedback-kicker { color: var(--site-accent-strong); font-size: .75rem; font-weight: 800; letter-spacing: .16em; text-transform: uppercase; }
.feedback-intro h1 { margin: .75rem 0 1rem; font-family: var(--font-display); font-size: clamp(2.25rem, 6vw, 3.5rem); line-height: 1.15; }
.feedback-intro > p:last-child { color: var(--site-text-muted); line-height: 1.8; }
.feedback-card { padding: clamp(1.25rem, 4vw, 3rem); border: 1px solid var(--site-border); border-radius: 1.5rem; background: var(--site-surface); box-shadow: var(--site-shadow-soft); }
.feedback-fields { display: grid; gap: 1.75rem; min-width: 0; }
.feedback-field { display: grid; gap: .6rem; min-width: 0; }
.feedback-field > label, legend { font-weight: 800; font-size: .9rem; }
legend { margin-bottom: .75rem; }
.feedback-categories { display: flex; flex-wrap: wrap; gap: .6rem; }
.feedback-chip { position: relative; cursor: pointer; }
.feedback-chip input { position: absolute; opacity: 0; width: 1px; height: 1px; }
.feedback-chip span { display: inline-flex; align-items: center; min-height: 2.75rem; padding: .5rem 1rem; border: 1px solid var(--site-border); border-radius: 2rem; color: var(--site-text-muted); font-size: .875rem; font-weight: 700; }
.feedback-chip input:checked + span { color: var(--site-accent-strong); background: var(--site-bg-soft); border-color: var(--site-accent); }
.feedback-chip input:focus-visible + span { outline: 3px solid var(--site-focus); outline-offset: 3px; }
textarea, input[type='email'] { width: 100%; min-width: 0; padding: .9rem 1rem; border: 1px solid var(--site-border); border-radius: .75rem; background: var(--site-bg); font-size: 1rem; line-height: 1.6; }
textarea { resize: vertical; min-height: 10rem; }
textarea::placeholder, input::placeholder { color: var(--site-text-muted); }
[aria-invalid='true'] { border-color: var(--site-error); }
.feedback-message-meta { display: flex; flex-wrap: wrap; gap: .4rem 1rem; justify-content: space-between; }
.feedback-count { margin-left: auto; white-space: nowrap; color: var(--site-text-muted); font-size: .75rem; }
.feedback-help { color: var(--site-text-muted); font-size: .825rem; line-height: 1.7; }
.feedback-rating { display: flex; flex-wrap: wrap; align-items: center; gap: .2rem; }
.feedback-star { display: grid; place-items: center; width: 2.75rem; height: 2.75rem; border-radius: .5rem; color: var(--site-text-muted); cursor: pointer; }
.feedback-star svg { width: 1.8rem; height: 1.8rem; fill: none; stroke: currentColor; stroke-width: 1.5; }
.feedback-star.is-filled { color: var(--site-accent); }
.feedback-star.is-filled svg { fill: currentColor; }
.feedback-clear { min-height: 2.75rem; margin-left: .5rem; color: var(--site-text-muted); font-size: .825rem; text-decoration: underline; cursor: pointer; }
.feedback-error { color: var(--site-error); font-size: .875rem; font-weight: 700; }
.feedback-submit-error { padding: .9rem; border-radius: .75rem; background: var(--site-bg-soft); }
.feedback-submit { width: 100%; min-height: 3rem; }
:disabled { cursor: wait; opacity: .7; }
.feedback-honeypot { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); }
.feedback-privacy a, .feedback-text-link { text-decoration: underline; text-underline-offset: .2em; }
.feedback-success { display: grid; justify-items: center; gap: 1.5rem; text-align: center; }
.feedback-success h2 { font-family: var(--font-display); font-size: 2rem; line-height: 1.25; }
.feedback-success p { max-width: 30rem; color: var(--site-text-muted); line-height: 1.8; }
.feedback-success-mark { display: grid; place-items: center; width: 3.5rem; height: 3.5rem; border: 1px solid var(--site-success); border-radius: 50%; color: var(--site-success); font-size: 1.8rem; }
.feedback-text-link { font-size: .875rem; color: var(--site-text-muted); }
</style>
