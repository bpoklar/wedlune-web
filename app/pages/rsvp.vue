<template>
  <div
    :class="[
      'soft-page-bg rsvp-themed relative mt-16 min-h-[calc(100vh-4rem)] overflow-hidden px-4 pb-8 pt-0 sm:px-6 sm:pb-12 lg:pb-16',
      `rsvp-template-${rsvpDesign.template}`,
    ]"
    :style="rsvpThemeStyle"
  >
    <div
      class="pointer-events-none absolute -left-20 top-28 h-56 w-56 rounded-full border border-blush-rose/20 sm:h-72 sm:w-72"
      aria-hidden="true"
    />
    <div
      class="pointer-events-none absolute -right-24 top-8 h-64 w-64 rounded-full border border-champagne-gold/20 sm:h-96 sm:w-96"
      aria-hidden="true"
    />

    <main class="relative mx-auto w-full max-w-3xl mt-6">
      <!-- Loading state -->
      <div
        v-if="loading"
        class="card-surface mx-auto max-w-lg px-6 py-12 text-center sm:px-10 sm:py-14"
        role="status"
      >
        <div
          class="mx-auto h-11 w-11 animate-spin rounded-full border-4 border-champagne-gold/25 border-t-champagne-gold"
        />
        <p class="mt-5 font-display text-xl text-charcoal">{{ $t("rsvp.opening") }}</p>
        <p class="mt-1 text-sm text-warm-gray">{{ $t("rsvp.openingDetail") }}</p>
      </div>

      <!-- Premium unavailable state -->
      <div
        v-else-if="premiumUnavailable"
        class="card-surface mx-auto max-w-lg px-6 py-10 text-center sm:p-12"
      >
        <div
          class="rsvp-muted-panel mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full text-3xl"
        >
          💌
        </div>
        <h1 class="mb-3 font-display text-2xl text-charcoal sm:text-3xl">
          {{ $t("rsvp.unavailableTitle") }}
        </h1>
        <p class="text-warm-gray text-sm leading-relaxed">
          {{ $t("rsvp.unavailableBody") }}
        </p>
      </div>

      <!-- Error state -->
      <div
        v-else-if="errorMessage"
        class="card-surface mx-auto max-w-lg px-6 py-10 text-center sm:p-12"
      >
        <div
          class="rsvp-muted-panel mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full text-3xl"
        >
          💌
        </div>
        <h1 class="mb-3 font-display text-2xl text-charcoal sm:text-3xl">
          {{ $t("rsvp.notFoundTitle") }}
        </h1>
        <p class="text-warm-gray text-sm leading-relaxed">
          {{ errorMessage }}
        </p>
        <NuxtLink
          :to="localePath('/')"
          class="inline-block mt-6 text-champagne-gold hover:text-deep-gold text-sm font-semibold"
        >
          {{ $t("common.goToWedlune") }}
        </NuxtLink>
      </div>

      <!-- Success state (after submission) -->
      <div
        v-else-if="submitted"
        class="card-surface mx-auto max-w-xl overflow-hidden text-center"
      >
        <div class="h-1.5 bg-champagne-gold" />
        <div class="px-6 py-9 sm:px-12 sm:py-12">
          <div
            class="rsvp-muted-panel mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full text-4xl shadow-inner"
          >
            {{ submittedStatus === "accepted" ? "🎉" : "💐" }}
          </div>
          <p
            class="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-champagne-gold"
          >
            {{ $t("rsvp.confirmed") }}
          </p>
          <h1 class="mb-3 font-display text-3xl text-charcoal sm:text-4xl">
            {{
              submittedStatus === "accepted" ? $t("rsvp.acceptedTitle") : $t("rsvp.declinedTitle")
            }}
          </h1>
          <p
            class="mx-auto max-w-md text-sm leading-relaxed text-warm-gray sm:text-base"
          >
            {{
              submittedStatus === "accepted"
                ? $t("rsvp.acceptedBody", { name: guestName })
                : $t("rsvp.declinedBody", { name: guestName })
            }}
          </p>
          <p
            v-if="rsvpDesign.confirmationMessage"
            class="mx-auto mt-3 max-w-md text-sm leading-relaxed text-warm-gray sm:text-base"
          >
            {{ rsvpDesign.confirmationMessage }}
          </p>
          <!-- +1 summary -->
          <div
            v-if="plusOneGuests.length > 0"
            class="rsvp-input-panel mx-auto mt-6 max-w-sm divide-y rounded-2xl border px-4"
          >
            <p
              v-for="po in plusOneGuests"
              :key="po.id"
              class="flex items-center justify-between gap-3 py-3 text-left text-sm text-warm-gray"
            >
              <span class="font-semibold text-charcoal">{{ po.name }}</span>
              <span
                :class="
                  po.rsvpStatus === 'accepted'
                    ? 'text-sage-green'
                    : 'text-blush-rose'
                "
              >
                {{
                  po.rsvpStatus === "accepted" ? $t("rsvp.attending") : $t("rsvp.notAttending")
                }}
              </span>
            </p>
          </div>
          <p
            v-if="coupleName"
            class="mt-6 font-accent text-2xl text-champagne-gold"
          >
            {{ $t("rsvp.withLove", { name: coupleName }) }}
          </p>
          <div
            class="rsvp-muted-panel mt-7 rounded-2xl border p-4 text-left sm:p-5"
          >
            <div class="flex gap-3">
              <span class="mt-0.5 text-lg" aria-hidden="true">🔗</span>
              <div>
                <p class="text-sm font-bold text-charcoal">{{ $t("rsvp.plansChanged") }}</p>
                <p class="mt-1 text-sm leading-relaxed text-warm-gray">
                  {{ $t("rsvp.plansChangedBody") }}
                </p>
              </div>
            </div>
          </div>
          <button
            type="button"
            class="rsvp-outline-button mt-5 min-h-12 w-full rounded-full border-2 px-6 text-sm font-bold transition-colors"
            @click="submitted = false"
          >
            {{ $t("rsvp.updateResponse") }}
          </button>
        </div>
      </div>

      <!-- RSVP Form -->
      <div v-else class="card-surface overflow-hidden">
        <!-- Header -->
        <div
          :class="[
            'rsvp-invitation-header rsvp-muted-panel relative overflow-hidden border-b px-5 pb-8 text-center sm:px-8 sm:pb-10',
            rsvpDesign.heroImageUrl ? 'pt-8 sm:pt-10' : 'pt-8 sm:pt-10',
            rsvpDesign.template === 'modern' && rsvpDesign.heroImageUrl
              ? 'rsvp-modern-has-hero'
              : '',
          ]"
        >
          <div class="absolute inset-x-0 top-0 h-1.5 bg-champagne-gold" />
          <div
            v-if="rsvpDesign.heroImageUrl"
            class="rsvp-hero-frame mx-auto mb-6 w-full overflow-hidden rounded-2xl"
          >
            <img
              :src="rsvpDesign.heroImageUrl"
              :style="rsvpHeroImageStyle"
              alt=""
              class="rsvp-hero-image h-full w-full object-cover"
            >
          </div>
          <p
            class="mb-1 wrap-break-word font-accent text-3xl leading-tight text-champagne-gold sm:text-4xl"
          >
            {{ rsvpDesign.invitationHeading }}
          </p>
          <h1
            class="mb-2 wrap-break-word font-display text-3xl leading-tight text-charcoal sm:text-4xl"
          >
            {{ guestName }}
          </h1>
          <p
            v-if="coupleName"
            class="mx-auto max-w-md text-sm leading-relaxed text-warm-gray sm:text-base"
          >
            {{
              rsvpDesign.welcomeMessage ||
              $t("rsvp.coupleWelcome", { name: coupleName })
            }}
          </p>
        </div>

        <form @submit="onSubmit" class="rsvp-form p-5 sm:p-8 md:p-10">
          <div
            v-if="hasExistingResponse"
            class="rsvp-muted-panel flex gap-3 rounded-2xl border p-4"
          >
            <span aria-hidden="true">✓</span>
            <p class="text-sm leading-relaxed text-warm-gray">
              {{ $t("rsvp.savedResponse") }}
            </p>
          </div>

          <!-- Main guest RSVP Status -->
          <fieldset>
            <legend class="mb-4 w-full">
              <span class="flex items-center gap-3">
                <span
                  class="rsvp-muted-panel flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-deep-gold"
                  >1</span
                >
                <span>
                  <span class="block text-base font-bold text-charcoal"
                    >{{ $t("rsvp.willYouAttend") }}
                    <span class="text-dusty-crimson">*</span></span
                  >
                  <span class="mt-0.5 block text-xs font-normal text-warm-gray"
                    >{{ $t("rsvp.chooseResponse") }}</span
                  >
                </span>
              </span>
            </legend>
            <div class="grid gap-3 sm:grid-cols-2">
              <label
                :class="[
                  'flex min-h-16 items-center justify-center gap-2 rounded-2xl border-2 px-4 py-3 text-center text-sm font-semibold cursor-pointer transition-all',
                  rsvpStatusField === 'accepted'
                    ? 'border-sage-green bg-sage-green/10 text-sage-green'
                    : 'border-linen text-warm-gray hover:border-sage-green/50',
                ]"
              >
                <input
                  v-model="rsvpStatusField"
                  type="radio"
                  name="rsvpStatus"
                  value="accepted"
                  class="sr-only"
                />
                <span>✓</span> {{ $t("rsvp.accept") }}
              </label>
              <label
                :class="[
                  'flex min-h-16 items-center justify-center gap-2 rounded-2xl border-2 px-4 py-3 text-center text-sm font-semibold cursor-pointer transition-all',
                  rsvpStatusField === 'declined'
                    ? 'border-blush-rose bg-blush-rose/10 text-blush-rose'
                    : 'border-linen text-warm-gray hover:border-blush-rose/50',
                ]"
              >
                <input
                  v-model="rsvpStatusField"
                  type="radio"
                  name="rsvpStatus"
                  value="declined"
                  class="sr-only"
                />
                <span>✗</span> {{ $t("rsvp.decline") }}
              </label>
            </div>
            <p
              v-if="rsvpStatusError"
              class="mt-2 text-xs text-dusty-crimson"
              role="alert"
            >
              {{ rsvpStatusError }}
            </p>
          </fieldset>

          <!-- Main guest meal / dietary (only if accepted) -->
          <div
            v-if="rsvpStatusField === 'accepted'"
            class="space-y-6 border-t border-linen pt-8"
          >
            <div class="flex items-center gap-3">
              <span
                class="rsvp-muted-panel flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-deep-gold"
                >2</span
              >
              <div>
                <h2 class="text-base font-bold text-charcoal">{{ $t("rsvp.detailsTitle") }}</h2>
                <p class="text-xs text-warm-gray">{{ $t("rsvp.detailsBody") }}</p>
              </div>
            </div>
            <div>
              <label
                id="menuSelectLabel"
                class="block text-charcoal font-semibold text-sm mb-2"
              >
                {{ $t("rsvp.mealPreference") }}
              </label>
              <template v-if="menus.length > 0">
                <div
                  id="menuSelect"
                  class="grid gap-3 sm:grid-cols-2"
                  role="radiogroup"
                  aria-labelledby="menuSelectLabel"
                >
                  <label
                    :class="[
                      'rsvp-input-panel flex min-h-24 items-center justify-center rounded-xl border-2 px-4 text-center cursor-pointer transition-all',
                      selectedMenuId === null
                        ? 'border-champagne-gold ring-2 ring-champagne-gold/20'
                        : 'border-linen hover:border-champagne-gold/50',
                    ]"
                  >
                    <input
                      v-model="selectedMenuId"
                      type="radio"
                      name="menuSelect"
                      :value="null"
                      class="sr-only"
                    />
                    <span class="text-warm-gray text-sm">{{ $t("rsvp.noPreference") }}</span>
                  </label>
                  <label
                    v-for="m in menus"
                    :key="m.id"
                    :class="[
                      'rsvp-input-panel overflow-hidden rounded-xl border-2 cursor-pointer transition-all',
                      selectedMenuId === m.id
                        ? 'border-champagne-gold ring-2 ring-champagne-gold/20'
                        : 'border-linen hover:border-champagne-gold/50',
                    ]"
                  >
                    <input
                      v-model="selectedMenuId"
                      type="radio"
                      name="menuSelect"
                      :value="m.id"
                      class="sr-only"
                    />
                    <div class="h-28 bg-soft-champagne/70">
                      <img
                        v-if="m.coverImageUrl"
                        :src="m.coverImageUrl"
                        :alt="m.label"
                        class="h-full w-full object-cover"
                      />
                      <div
                        v-else
                        class="flex h-full items-center justify-center text-3xl text-champagne-gold"
                        aria-hidden="true"
                      >
                        🍽️
                      </div>
                    </div>
                    <div class="p-3">
                      <p class="font-semibold text-charcoal text-sm">
                        {{ m.label }}
                      </p>
                      <p
                        v-if="m.category"
                        class="text-warm-gray text-xs mt-0.5"
                      >
                        {{ m.category }}
                      </p>
                      <div
                        v-if="hasMenuCourses(m.courses)"
                        class="mt-3 space-y-1 border-t border-linen pt-3 text-left"
                      >
                        <p
                          v-for="c in m.courses"
                          :key="c.id"
                          class="text-warm-gray text-xs"
                        >
                          {{ c.label }}
                        </p>
                      </div>
                      <p
                        v-else
                        class="mt-3 border-t border-linen pt-3 text-left text-xs italic text-warm-gray"
                      >
                        {{ $t("rsvp.noDishes") }}
                      </p>
                    </div>
                  </label>
                </div>
              </template>
              <template v-else>
                <p class="text-warm-gray text-sm italic">
                  {{ $t("rsvp.noMealOptions") }}
                </p>
                <p
                  v-if="mealPreferenceField && !selectedMenuId"
                  class="text-warm-gray text-xs mt-1"
                >
                  {{ $t("rsvp.previousSelection", { value: mealPreferenceField }) }}
                </p>
              </template>
            </div>

            <div>
              <label
                for="dietaryNotes"
                class="block text-charcoal font-semibold text-sm mb-2"
              >
                {{ $t("rsvp.dietaryRequirements") }}
              </label>
              <textarea
                id="dietaryNotes"
                v-model="dietaryNotesField"
                rows="3"
                :placeholder="$t('rsvp.dietaryPlaceholder')"
                maxlength="500"
                class="rsvp-input-panel w-full rounded-xl border px-4 py-3 text-sm transition-colors resize-none focus:outline-none focus:ring-2"
              />
              <p
                v-if="dietaryNotesError"
                class="text-dusty-crimson text-xs mt-1"
              >
                {{ dietaryNotesError }}
              </p>
            </div>
          </div>

          <!-- +1 Guest sections -->
          <template v-for="(po, idx) in plusOneGuests" :key="po.id">
            <div class="rsvp-input-panel rounded-3xl border p-4 sm:p-6">
              <h2 class="font-display text-xl text-charcoal mb-4">
                {{ po.name }}
              </h2>

              <!-- +1 RSVP Status -->
              <fieldset>
                <legend class="text-charcoal font-semibold text-sm mb-3">
                  {{ $t("rsvp.willGuestAttend", { name: po.name }) }}
                  <span class="text-dusty-crimson">*</span>
                </legend>
                <div class="grid gap-3 sm:grid-cols-2">
                  <label
                    :class="[
                      'flex min-h-14 items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 cursor-pointer transition-all text-sm font-semibold',
                      po.rsvpStatus === 'accepted'
                        ? 'border-sage-green bg-sage-green/10 text-sage-green'
                        : 'border-linen text-warm-gray hover:border-sage-green/50',
                    ]"
                  >
                    <input
                      v-model="po.rsvpStatus"
                      type="radio"
                      :name="`rsvpStatus_${idx}`"
                      value="accepted"
                      class="sr-only"
                    />
                    <span>✓</span> {{ $t("rsvp.attending") }}
                  </label>
                  <label
                    :class="[
                      'flex min-h-14 items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 cursor-pointer transition-all text-sm font-semibold',
                      po.rsvpStatus === 'declined'
                        ? 'border-blush-rose bg-blush-rose/10 text-blush-rose'
                        : 'border-linen text-warm-gray hover:border-blush-rose/50',
                    ]"
                  >
                    <input
                      v-model="po.rsvpStatus"
                      type="radio"
                      :name="`rsvpStatus_${idx}`"
                      value="declined"
                      class="sr-only"
                    />
                    <span>✗</span> {{ $t("rsvp.notAttending") }}
                  </label>
                </div>
              </fieldset>

              <!-- +1 meal / dietary (only if accepted) -->
              <div v-if="po.rsvpStatus === 'accepted'" class="space-y-4 mt-4">
                <div>
                  <label
                    :id="`meal_${idx}`"
                    class="block text-charcoal font-semibold text-sm mb-2"
                  >
                    {{ $t("rsvp.mealPreference") }}
                  </label>
                  <template v-if="menus.length > 0">
                    <div
                      :id="`menu_${idx}`"
                      class="grid gap-3 sm:grid-cols-2"
                      role="radiogroup"
                      :aria-labelledby="`meal_${idx}`"
                    >
                      <label
                        :class="[
                          'rsvp-surface-panel flex min-h-20 items-center justify-center rounded-xl border-2 px-3 text-center cursor-pointer transition-all',
                          po.menuId === null
                            ? 'border-champagne-gold ring-2 ring-champagne-gold/20'
                            : 'border-linen hover:border-champagne-gold/50',
                        ]"
                      >
                        <input
                          v-model="po.menuId"
                          type="radio"
                          :name="`menu_${idx}`"
                          :value="null"
                          class="sr-only"
                          @change="onPlusOneMenuChange(po)"
                        />
                        <span class="text-warm-gray text-sm"
                          >{{ $t("rsvp.noPreference") }}</span
                        >
                      </label>
                      <label
                        v-for="m in menus"
                        :key="m.id"
                        :class="[
                          'rsvp-surface-panel overflow-hidden rounded-xl border-2 cursor-pointer transition-all',
                          po.menuId === m.id
                            ? 'border-champagne-gold ring-2 ring-champagne-gold/20'
                            : 'border-linen hover:border-champagne-gold/50',
                        ]"
                      >
                        <input
                          v-model="po.menuId"
                          type="radio"
                          :name="`menu_${idx}`"
                          :value="m.id"
                          class="sr-only"
                          @change="onPlusOneMenuChange(po)"
                        />
                        <div class="flex min-h-20 items-center gap-3 p-3">
                          <img
                            v-if="m.coverImageUrl"
                            :src="m.coverImageUrl"
                            :alt="m.label"
                            class="h-16 w-20 shrink-0 rounded-lg object-cover"
                          />
                          <div
                            v-else
                            class="flex h-16 w-20 shrink-0 items-center justify-center rounded-lg bg-soft-champagne/70 text-2xl"
                            aria-hidden="true"
                          >
                            🍽️
                          </div>
                          <div class="min-w-0 grow text-left">
                            <p class="font-semibold text-charcoal text-sm">
                              {{ m.label }}
                            </p>
                            <p v-if="m.category" class="text-warm-gray text-xs">
                              {{ m.category }}
                            </p>
                            <div
                              v-if="hasMenuCourses(m.courses)"
                              class="mt-2 space-y-1 border-t border-linen pt-2"
                            >
                              <p
                                v-for="c in m.courses"
                                :key="c.id"
                                class="text-warm-gray text-xs"
                              >
                                {{ c.label }}
                              </p>
                            </div>
                            <p
                              v-else
                              class="mt-2 border-t border-linen pt-2 text-xs italic text-warm-gray"
                            >
                              {{ $t("rsvp.noDishes") }}
                            </p>
                          </div>
                        </div>
                      </label>
                    </div>
                  </template>
                  <template v-else>
                    <p class="text-warm-gray text-sm italic">
                      {{ $t("rsvp.noMealOptions") }}
                    </p>
                    <p
                      v-if="po.mealPreference"
                      class="text-warm-gray text-xs mt-1"
                    >
                      {{ $t("rsvp.previousSelection", { value: po.mealPreference }) }}
                    </p>
                  </template>
                </div>
                <div>
                  <label
                    :for="`dietary_${idx}`"
                    class="block text-charcoal font-semibold text-sm mb-2"
                  >
                    {{ $t("rsvp.dietaryRequirements") }}
                  </label>
                  <textarea
                    :id="`dietary_${idx}`"
                    v-model="po.dietaryNotes"
                    rows="2"
                    :placeholder="$t('rsvp.dietaryPlaceholder')"
                    maxlength="500"
                    class="rsvp-surface-panel w-full rounded-xl border px-4 py-3 text-sm transition-colors resize-none focus:outline-none focus:ring-2"
                  />
                </div>
              </div>
            </div>
          </template>

          <!-- Submit -->
          <button
            type="submit"
            :disabled="submitting"
            class="rsvp-accent-button min-h-14 w-full rounded-full bg-champagne-gold px-6 text-sm font-bold text-white shadow-lg shadow-champagne-gold/20 transition-all hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
          >
            {{ submitting ? $t("rsvp.sending") : $t("rsvp.send") }}
          </button>

          <p
            v-if="submitError"
            class="text-center text-xs text-dusty-crimson"
            role="alert"
          >
            {{ submitError }}
          </p>
        </form>
      </div>

      <WishlistSection
        v-if="!loading && !errorMessage && !submitted && wishlist && token"
        :token="token"
        :wishlist="wishlist"
      />

      <!-- Branding -->
      <p class="mt-7 text-center text-xs text-pearl-gray sm:mt-8">
        {{ $t("common.poweredBy") }}
        <NuxtLink :to="localePath('/')" class="text-champagne-gold hover:text-deep-gold">
          Wedlune
        </NuxtLink>
      </p>
    </main>
  </div>
</template>

<script setup lang="ts">
import { z } from "zod";
import { toTypedSchema } from "@vee-validate/zod";
import { useForm, useField } from "vee-validate";
import { hasMenuCourses } from "~/utils/rsvpMenu";
import {
  createHeroImageStyle,
  createRsvpTheme,
  defaultRsvpDesign,
  resolveRsvpDesign,
  type RsvpDesign,
} from "~/utils/rsvpDesign";

const { t } = useI18n();
const localePath = useLocalePath();

useSeoMeta({
  title: () => t("rsvp.seoTitle"),
  description: () => t("rsvp.seoDescription"),
  robots: "noindex, nofollow",
  ogTitle: () => t("rsvp.seoTitle"),
  ogDescription: () => t("rsvp.seoDescription"),
});

// RSVP URLs contain bearer capability tokens. Never send the full page URL as
// a referrer when a guest follows an external link.
useHead({
  meta: [{ name: "referrer", content: "no-referrer" }],
});

const route = useRoute();
const config = useRuntimeConfig();

const token = computed(() =>
  typeof route.query.token === "string" ? route.query.token : undefined,
);

// UI state
const loading = ref(true);
const errorMessage = ref<string | null>(null);
const submitted = ref(false);
const submittedStatus = ref<string>("");
const hasExistingResponse = ref(false);
const submitting = ref(false);
const submitError = ref<string | null>(null);
const premiumUnavailable = ref(false);

// Guest data from API
const guestName = ref("");
const coupleName = ref<string | null>(null);

// +1 guest data (reactive array)
interface MenuCourse {
  id: string;
  label: string;
  description: string | null;
  sortOrder: number;
}

interface Menu {
  id: string;
  label: string;
  category: string;
  coverImageUrl: string | null;
  courses: MenuCourse[];
}

interface PlusOneGuest {
  id: string;
  name: string;
  rsvpStatus: string;
  mealPreference: string;
  dietaryNotes: string;
  menuId: string | null;
}

interface WishlistItem {
  id: string;
  title: string;
  description: string | null;
  productUrl: string | null;
  priceAmount: number | string | null;
  currency: string | null;
  category: string | null;
  desiredQuantity: number;
  reservedQuantity: number;
  remainingQuantity: number;
  isPriority: boolean;
  imageUrl: string | null;
  reservedByYou: number;
}

interface Wishlist {
  title: string;
  message: string | null;
  items: WishlistItem[];
}
const rsvpDesign = ref<RsvpDesign>({ ...defaultRsvpDesign });
const rsvpThemeStyle = computed(() => createRsvpTheme(rsvpDesign.value));
const rsvpHeroImageStyle = computed(() => createHeroImageStyle(rsvpDesign.value));
const plusOneGuests = ref<PlusOneGuest[]>([]);
const wishlist = ref<Wishlist | null>(null);

// Menus data for dropdown
const menus = ref<Menu[]>([]);
const selectedMenuId = ref<string | null>(null);

// Zod schema
const rsvpSchema = toTypedSchema(
  z.object({
    rsvpStatus: z.enum(["accepted", "declined"], {
      message: t("rsvp.validationResponse"),
    }),
    mealPreference: z.string().max(500).optional(),
    dietaryNotes: z.string().max(500).optional(),
  }),
);

const { handleSubmit, resetForm } = useForm({
  validationSchema: rsvpSchema,
});

const { value: rsvpStatusField, errorMessage: rsvpStatusError } =
  useField<string>("rsvpStatus");
const { value: mealPreferenceField, errorMessage: mealPreferenceError } =
  useField<string>("mealPreference");
const { value: dietaryNotesField, errorMessage: dietaryNotesError } =
  useField<string>("dietaryNotes");

// Build the Edge Function URL from Supabase URL
const edgeFunctionUrl = computed(() => {
  const supabaseUrl = config.public.supabaseUrl as string;
  return `${supabaseUrl}/functions/v1/handle-guest-rsvp`;
});

// Auto-fill mealPreference when a plus-one menu changes
function onPlusOneMenuChange(po: PlusOneGuest) {
  if (po.menuId) {
    const matched = menus.value.find((m) => m.id === po.menuId);
    if (matched) {
      po.mealPreference = matched.label;
    }
  } else {
    po.mealPreference = "";
  }
}

// Auto-fill mealPreference when guest selects a menu
watch(selectedMenuId, (newVal) => {
  if (newVal) {
    const matched = menus.value.find((m) => m.id === newVal);
    if (matched) {
      mealPreferenceField.value = matched.label;
    }
  } else {
    mealPreferenceField.value = "";
  }
});

// Fetch guest data on mount
onMounted(async () => {
  const rsvpToken = token.value;
  if (!rsvpToken) {
    errorMessage.value = t("rsvp.missingToken");
    loading.value = false;
    return;
  }

  try {
    const data = await $fetch<{
      name: string;
      rsvpStatus: string;
      mealPreference: string | null;
      dietaryNotes: string | null;
      menuId: string | null;
      coupleName: string | null;
      menus: Array<{
        id: string;
        label: string;
        category: string;
        coverImageUrl: string | null;
        courses: Array<{
          id: string;
          label: string;
          description: string | null;
          sortOrder: number;
        }>;
      }>;
      plusOnes?: Array<{
        id: string;
        name: string;
        rsvpStatus: string;
        mealPreference: string | null;
        dietaryNotes: string | null;
        menuId: string | null;
      }>;
      wishlist?: Wishlist | null;
      rsvpDesign?: RsvpDesign | null;
    }>(edgeFunctionUrl.value, {
      cache: "no-store",
      headers: {
        apikey: config.public.supabaseAnonKey as string,
        "x-rsvp-token": rsvpToken,
      },
    });

    guestName.value = data.name;
    coupleName.value = data.coupleName;
    wishlist.value = data.wishlist ?? null;
    rsvpDesign.value = resolveRsvpDesign(data.rsvpDesign);
    menus.value = data.menus ?? [];
    selectedMenuId.value = data.menuId ?? null;

    // Populate +1 guests
    if (data.plusOnes && data.plusOnes.length > 0) {
      plusOneGuests.value = data.plusOnes.map((po) => ({
        id: po.id,
        name: po.name,
        rsvpStatus: po.rsvpStatus === "pending" ? "" : po.rsvpStatus,
        mealPreference: po.mealPreference ?? "",
        dietaryNotes: po.dietaryNotes ?? "",
        menuId: po.menuId ?? null,
      }));
    }

    // Pre-fill form if guest already responded
    if (data.rsvpStatus !== "pending") {
      hasExistingResponse.value = true;
      selectedMenuId.value = data.menuId ?? null;
      const matched = data.menuId
        ? (data.menus ?? []).find((m) => m.id === data.menuId)
        : null;
      const label = matched ? matched.label : (data.mealPreference ?? "");
      resetForm({
        values: {
          rsvpStatus: data.rsvpStatus as "accepted" | "declined",
          mealPreference: label,
          dietaryNotes: data.dietaryNotes ?? "",
        },
      });
    }
  } catch (err: unknown) {
    const fetchError = err as {
      data?: { error?: string; code?: string };
      status?: number;
    };
    if (
      fetchError.status === 403 &&
      fetchError.data?.code === "premium_required"
    ) {
      premiumUnavailable.value = true;
    } else if (fetchError.status === 404) {
      errorMessage.value = t("rsvp.invalidToken");
    } else {
      errorMessage.value = t("rsvp.loadError");
    }
  } finally {
    loading.value = false;
  }
});

const onSubmit = handleSubmit(async (values) => {
  const rsvpToken = token.value;
  if (!rsvpToken) {
    submitError.value = t("rsvp.missingToken");
    return;
  }

  // Validate +1 guests have a response selected
  const missingPlusOne = plusOneGuests.value.find(
    (po) => !po.rsvpStatus || !["accepted", "declined"].includes(po.rsvpStatus),
  );
  if (missingPlusOne) {
    submitError.value = t("rsvp.missingGuestResponse", {
      name: missingPlusOne.name,
    });
    return;
  }

  submitting.value = true;
  submitError.value = null;

  try {
    await $fetch(edgeFunctionUrl.value, {
      method: "POST",
      headers: {
        apikey: config.public.supabaseAnonKey as string,
        "Content-Type": "application/json",
        "x-rsvp-token": rsvpToken,
      },
      body: {
        rsvpStatus: values.rsvpStatus,
        menuId: selectedMenuId.value,
        mealPreference: values.mealPreference || null,
        dietaryNotes: values.dietaryNotes || null,
        guests: plusOneGuests.value.map((po) => ({
          id: po.id,
          rsvpStatus: po.rsvpStatus,
          menuId: po.menuId || null,
          mealPreference: po.mealPreference || null,
          dietaryNotes: po.dietaryNotes || null,
        })),
      },
    });

    submittedStatus.value = values.rsvpStatus;
    hasExistingResponse.value = true;
    submitted.value = true;
  } catch (err: unknown) {
    const fetchError = err as { data?: { code?: string }; status?: number };
    if (
      fetchError.status === 403 &&
      fetchError.data?.code === "premium_required"
    ) {
      premiumUnavailable.value = true;
      submitted.value = false;
    } else {
      submitError.value = t("rsvp.submitError");
    }
  } finally {
    submitting.value = false;
  }
});
</script>

<style scoped>
.rsvp-themed {
  background: var(--rsvp-background);
  --rsvp-section-gap: clamp(1.5rem, 3vw, 2rem);
  --rsvp-card-gap: clamp(1rem, 2vw, 1.5rem);
}

.rsvp-themed :deep(.card-surface) {
  background-color: var(--rsvp-surface);
  border-color: var(--rsvp-border);
}

.rsvp-form {
  display: flex;
  flex-direction: column;
  gap: var(--rsvp-section-gap);
}

.rsvp-muted-panel,
.rsvp-themed :deep(.rsvp-muted-panel),
.rsvp-themed :deep([class*="bg-soft-champagne"]) {
  color: var(--rsvp-muted-text);
  background-color: var(--rsvp-muted-surface);
  border-color: var(--rsvp-border);
}

.rsvp-input-panel,
.rsvp-themed :deep(.rsvp-input-panel),
.rsvp-themed :deep([class*="bg-ivory-cream"]) {
  color: var(--rsvp-input-text);
  background-color: var(--rsvp-input-surface);
  border-color: var(--rsvp-border);
}

.rsvp-surface-panel,
.rsvp-themed :deep(.rsvp-surface-panel) {
  color: var(--rsvp-text);
  background-color: var(--rsvp-surface);
  border-color: var(--rsvp-border);
}

.rsvp-themed :deep(.border-linen) {
  border-color: var(--rsvp-border);
}

.rsvp-themed :deep(.divide-linen > :not(:last-child)) {
  border-color: var(--rsvp-border);
}

.rsvp-themed :deep(.bg-champagne-gold) {
  background-color: var(--rsvp-accent);
}

.rsvp-themed :deep(.text-champagne-gold),
.rsvp-themed :deep(.text-deep-gold) {
  color: var(--rsvp-accent);
}

.rsvp-themed :deep(.text-charcoal),
.rsvp-themed :deep(.text-warm-gray),
.rsvp-themed :deep(.text-pearl-gray) {
  color: var(--rsvp-text);
}

.rsvp-muted-panel :deep(.text-charcoal),
.rsvp-muted-panel :deep(.text-warm-gray),
.rsvp-muted-panel :deep(.text-pearl-gray),
.rsvp-themed :deep(.rsvp-muted-panel .text-charcoal),
.rsvp-themed :deep(.rsvp-muted-panel .text-warm-gray),
.rsvp-themed :deep(.rsvp-muted-panel .text-pearl-gray),
.rsvp-themed :deep([class*="bg-soft-champagne"] .text-charcoal),
.rsvp-themed :deep([class*="bg-soft-champagne"] .text-warm-gray),
.rsvp-themed :deep([class*="bg-soft-champagne"] .text-pearl-gray) {
  color: var(--rsvp-muted-text);
}

.rsvp-input-panel :deep(.text-charcoal),
.rsvp-input-panel :deep(.text-warm-gray),
.rsvp-input-panel :deep(.text-pearl-gray),
.rsvp-themed :deep(.rsvp-input-panel .text-charcoal),
.rsvp-themed :deep(.rsvp-input-panel .text-warm-gray),
.rsvp-themed :deep(.rsvp-input-panel .text-pearl-gray),
.rsvp-themed :deep([class*="bg-ivory-cream"] .text-charcoal),
.rsvp-themed :deep([class*="bg-ivory-cream"] .text-warm-gray),
.rsvp-themed :deep([class*="bg-ivory-cream"] .text-pearl-gray) {
  color: var(--rsvp-input-text);
}

.rsvp-input-panel::placeholder,
.rsvp-surface-panel::placeholder {
  color: color-mix(in srgb, currentColor 55%, transparent);
}

.rsvp-input-panel:focus,
.rsvp-surface-panel:focus {
  border-color: var(--rsvp-accent);
  --tw-ring-color: color-mix(in srgb, var(--rsvp-accent) 32%, transparent);
}

.rsvp-themed :deep(.bg-champagne-gold.text-white) {
  color: var(--rsvp-on-accent);
}

.rsvp-accent-button,
.rsvp-themed :deep(.rsvp-accent-button) {
  color: var(--rsvp-on-accent);
  background-color: var(--rsvp-accent);
}

.rsvp-accent-button:hover,
.rsvp-themed :deep(.rsvp-accent-button:hover) {
  background-color: var(--rsvp-accent);
  filter: brightness(0.93);
}

.rsvp-outline-button,
.rsvp-themed :deep(.rsvp-outline-button) {
  color: var(--rsvp-accent);
  border-color: var(--rsvp-accent);
}

.rsvp-outline-button:hover,
.rsvp-themed :deep(.rsvp-outline-button:hover) {
  color: var(--rsvp-on-accent);
  background-color: var(--rsvp-accent);
}

.rsvp-themed :deep(.border-champagne-gold),
.rsvp-themed :deep(.border-deep-gold) {
  border-color: var(--rsvp-accent);
}

.rsvp-template-botanical .rsvp-invitation-header {
  border-radius: 0 0 45% 45% / 0 0 8% 8%;
}

.rsvp-hero-frame {
  aspect-ratio: 16 / 9;
}

.rsvp-template-botanical .rsvp-hero-frame {
  aspect-ratio: 4 / 3;
  border-radius: 999px 999px 1.5rem 1.5rem;
}

.rsvp-template-modern .rsvp-hero-frame {
  aspect-ratio: 4 / 3;
}

@media (min-width: 640px) {
  .rsvp-template-modern .rsvp-invitation-header.rsvp-modern-has-hero {
    display: grid;
    grid-template-columns: minmax(0, 1.15fr) minmax(0, 1fr);
    align-items: center;
    column-gap: clamp(1.5rem, 4vw, 2.5rem);
    row-gap: 0.35rem;
    text-align: left;
  }

  .rsvp-template-modern .rsvp-modern-has-hero .rsvp-hero-frame {
    grid-row: 1 / span 3;
    aspect-ratio: 6 / 5;
    margin: 0;
  }

  .rsvp-template-modern .rsvp-modern-has-hero > :not(.rsvp-hero-frame) {
    margin-left: 0;
    margin-right: 0;
    text-align: left;
  }
}

@media (prefers-reduced-motion: reduce) {
  .rsvp-themed *,
  .rsvp-themed *::before,
  .rsvp-themed *::after {
    scroll-behavior: auto !important;
    transition-duration: 0.01ms !important;
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
  }
}
</style>
