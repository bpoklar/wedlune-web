<template>
  <section id="wedding-information" class="rsvp-surface-panel my-5 rounded-2xl border p-5 sm:p-7" :aria-label="t('rsvp.information.title')">
    <h2 class="font-display text-2xl rsvp-text">{{ t('rsvp.information.title') }}</h2>
    <p class="mt-2 text-sm rsvp-text-secondary">{{ t('rsvp.information.localTime') }}</p>
    <dl class="mt-5 space-y-4">
      <div v-for="field in visibleFields" :key="field">
        <dt class="font-semibold rsvp-text">{{ t(`rsvp.information.${field}`) }}</dt>
        <dd class="mt-1 whitespace-pre-line wrap-break-word rsvp-text-secondary">
          <a v-if="field === 'travelLink'" :href="information[field]" target="_blank" rel="noopener noreferrer" referrerpolicy="no-referrer" class="rsvp-link underline">{{ information[field] }}</a>
          <template v-else>{{ information[field] }}</template>
        </dd>
      </div>
    </dl>
    <div v-if="information.faq?.length" class="mt-6">
      <h3 class="font-semibold rsvp-text">{{ t('rsvp.information.faq') }}</h3>
      <details v-for="(entry,index) in information.faq" :key="index" class="mt-3 rsvp-text-secondary">
        <summary class="cursor-pointer font-semibold rsvp-text">{{ entry.question }}</summary>
        <p class="mt-2 whitespace-pre-line wrap-break-word">{{ entry.answer }}</p>
      </details>
    </div>
  </section>
</template>
<script setup lang="ts">
import { informationFields, type RsvpInformationConfig } from '~/utils/rsvpInformation';
const props = defineProps<{ information: RsvpInformationConfig }>();
const { t } = useI18n();
const visibleFields = computed(() => informationFields.filter(field => props.information[field]?.trim()));
</script>
