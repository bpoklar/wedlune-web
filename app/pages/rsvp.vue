<template>
  <div>
  <NuxtLayout name="guest" :theme="rsvpThemeStyle" :inverse-logo="rsvpInverseLogo">
  <div
    id="rsvp-page"
    :class="[
      'soft-page-bg rsvp-themed relative min-h-[calc(100vh-4rem)] overflow-hidden px-4 pb-8 pt-0 sm:px-6 sm:pb-12 lg:pb-16',
      `rsvp-template-${rsvpDesign.template}`,
    ]"
  >
    <div
      class="pointer-events-none absolute -left-20 top-28 h-56 w-56 rounded-full border rsvp-decoration sm:h-72 sm:w-72"
      aria-hidden="true"
    />
    <div
      class="pointer-events-none absolute -right-24 top-8 h-64 w-64 rounded-full border rsvp-decoration sm:h-96 sm:w-96"
      aria-hidden="true"
    />

    <main id="main-content" v-reveal tabindex="-1" class="motion-reveal relative mx-auto mt-6 w-full max-w-3xl">
      <!-- Loading state -->
      <div
        v-if="loading"
        id="rsvp-loading"
        class="card-surface rsvp-surface-panel mx-auto max-w-lg px-6 py-12 text-center sm:px-10 sm:py-14"
        role="status"
        aria-live="polite"
      >
        <div
          aria-hidden="true"
          class="mx-auto h-11 w-11 animate-spin rounded-full border-4 rsvp-spinner"
        />
        <p class="mt-5 font-display text-xl rsvp-text">{{ $t("rsvp.opening") }}</p>
        <p class="mt-1 text-sm rsvp-text-secondary">{{ $t("rsvp.openingDetail") }}</p>
      </div>

      <!-- Premium unavailable state -->
      <div
        v-else-if="premiumUnavailable"
        id="rsvp-premium-unavailable"
        class="card-surface rsvp-surface-panel mx-auto max-w-lg px-6 py-10 text-center sm:p-12"
        role="status"
      >
        <div
          class="rsvp-muted-panel mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full text-3xl"
        >
          💌
        </div>
        <h1 class="mb-3 font-display text-2xl rsvp-text sm:text-3xl">
          {{ $t("rsvp.unavailableTitle") }}
        </h1>
        <p class="rsvp-text-secondary text-sm leading-relaxed">
          {{ $t("rsvp.unavailableBody") }}
        </p>
      </div>

      <!-- Error state -->
      <div
        v-else-if="errorMessage"
        id="rsvp-error"
        class="card-surface rsvp-surface-panel mx-auto max-w-lg px-6 py-10 text-center sm:p-12"
        role="alert"
      >
        <div
          class="rsvp-muted-panel mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full text-3xl"
        >
          💌
        </div>
        <h1 class="mb-3 font-display text-2xl rsvp-text sm:text-3xl">
          {{ $t("rsvp.notFoundTitle") }}
        </h1>
        <p class="rsvp-text-secondary text-sm leading-relaxed">
          {{ errorMessage }}
        </p>
        <NuxtLink
          :to="localePath('/')"
          class="inline-block mt-6 rsvp-link  text-sm font-semibold"
        >
          {{ $t("common.goToWedlune") }}
        </NuxtLink>
      </div>

      <!-- Success state (after submission) -->
      <div
        v-else-if="submitted"
        id="rsvp-confirmation"
        ref="confirmationPanel"
        tabindex="-1"
        class="card-surface rsvp-surface-panel mx-auto max-w-xl overflow-hidden text-center"
        role="status"
      >
        <div class="h-1.5 rsvp-accent-fill" />
        <div class="px-6 py-9 sm:px-12 sm:py-12">
          <div
            class="rsvp-muted-panel mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full text-4xl shadow-inner"
          >
            {{ isCouple ? "✓" : submittedStatus === "accepted" ? "🎉" : "💐" }}
          </div>
          <p
            v-if="!isCouple"
            class="mb-2 text-xs font-bold uppercase tracking-[0.22em] rsvp-text"
          >
            {{ $t("rsvp.confirmed") }}
          </p>
          <h1 class="mb-3 font-display text-3xl rsvp-text sm:text-4xl">
            {{
              isCouple
                ? $t("rsvp.detailsSaved")
                : submittedStatus === "accepted" ? $t("rsvp.acceptedTitle") : $t("rsvp.declinedTitle")
            }}
          </h1>
          <p
            class="mx-auto max-w-md text-sm leading-relaxed rsvp-text-secondary sm:text-base"
          >
            {{
              isCouple
                ? $t("rsvp.detailsSavedBody")
                : submittedStatus === "accepted"
                  ? $t("rsvp.acceptedBody", { name: guestName })
                  : $t("rsvp.declinedBody", { name: guestName })
            }}
          </p>
          <p
            v-if="rsvpDesign.confirmationMessage"
            class="mx-auto mt-3 max-w-md text-sm leading-relaxed rsvp-text-secondary sm:text-base"
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
              class="flex items-center justify-between gap-3 py-3 text-left text-sm rsvp-text-secondary"
            >
              <span class="font-semibold rsvp-text">{{ po.name }}</span>
              <span class="rsvp-text-secondary">
                {{
                  po.rsvpStatus === "accepted" ? $t("rsvp.attending") : $t("rsvp.notAttending")
                }}
              </span>
            </p>
          </div>
          <p
            v-if="coupleName"
            class="mt-6 font-accent text-2xl rsvp-text"
          >
            {{ $t("rsvp.withLove", { name: coupleName }) }}
          </p>
          <div
            class="rsvp-muted-panel mt-7 rounded-2xl border p-4 text-left sm:p-5"
          >
            <div class="flex gap-3">
              <span class="mt-0.5 text-lg" aria-hidden="true">🔗</span>
              <div>
                <p class="text-sm font-bold rsvp-text">{{ $t("rsvp.plansChanged") }}</p>
                <p class="mt-1 text-sm leading-relaxed rsvp-text-secondary">
                  {{ $t(isCouple ? "rsvp.detailsReturnBody" : "rsvp.plansChangedBody") }}
                </p>
              </div>
            </div>
          </div>
          <button
            type="button"
            class="rsvp-outline-button mt-5 min-h-12 w-full rounded-full px-6"
            @click="submitted = false"
          >
            {{ $t(isCouple ? "rsvp.updateDetails" : "rsvp.updateResponse") }}
          </button>
        </div>
      </div>

      <!-- RSVP Form -->
      <div v-else class="card-surface rsvp-surface-panel overflow-hidden">
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
          <div class="absolute inset-x-0 top-0 h-1.5 rsvp-accent-fill" />
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
            class="mb-1 wrap-break-word font-accent text-3xl leading-tight rsvp-text sm:text-4xl"
          >
            {{ rsvpDesign.invitationHeading }}
          </p>
          <h1
            class="mb-2 wrap-break-word font-display text-3xl leading-tight rsvp-text sm:text-4xl"
          >
            {{ guestName }}
          </h1>
          <p
            v-if="coupleName"
            class="mx-auto max-w-md text-sm leading-relaxed rsvp-text-secondary sm:text-base"
          >
            {{
              rsvpDesign.welcomeMessage ||
              $t("rsvp.coupleWelcome", { name: coupleName })
            }}
          </p>
        </div>

        <form class="rsvp-form p-5 sm:p-8 md:p-10" :aria-busy="submitting" @submit="onSubmit">
          <div
            v-if="hasExistingResponse && !isCouple"
            class="rsvp-muted-panel flex gap-3 rounded-2xl border p-4"
          >
            <span aria-hidden="true">✓</span>
            <p class="text-sm leading-relaxed rsvp-text-secondary">
              {{ $t("rsvp.savedResponse") }}
            </p>
          </div>

          <!-- Main guest RSVP Status -->
          <fieldset v-if="!isCouple">
            <legend class="mb-4 w-full">
              <span class="flex items-center gap-3">
                <span
                  class="rsvp-muted-panel flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold rsvp-text"
                  >1</span
                >
                <span>
                  <span class="block text-base font-bold rsvp-text"
                    >{{ $t("rsvp.willYouAttend") }}
                    <span class="rsvp-error">*</span></span
                  >
                  <span class="mt-0.5 block text-xs font-normal rsvp-text-secondary"
                    >{{ $t("rsvp.chooseResponse") }}</span
                  >
                </span>
              </span>
            </legend>
            <div class="grid gap-3 sm:grid-cols-2">
              <label
                class="rsvp-choice rsvp-choice-accept flex min-h-16 items-center justify-center gap-2 rounded-2xl px-4 py-3 text-center text-sm font-semibold cursor-pointer"
              >
                <input
                  id="rsvp-accept"
                  v-model="rsvpStatusField"
                  type="radio"
                  name="rsvpStatus"
                  value="accepted"
                  class="sr-only"
                />
                <span>✓</span> {{ $t("rsvp.accept") }}
              </label>
              <label
                class="rsvp-choice rsvp-choice-decline flex min-h-16 items-center justify-center gap-2 rounded-2xl px-4 py-3 text-center text-sm font-semibold cursor-pointer"
              >
                <input
                  id="rsvp-decline"
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
              class="mt-2 text-xs rsvp-error"
              role="alert"
            >
              {{ rsvpStatusError }}
            </p>
          </fieldset>
          <!-- Main guest meal / dietary (only if accepted) -->
          <div
            v-if="rsvpStatusField === 'accepted'"
            class="space-y-6"
            :class="{ 'border-t rsvp-divider pt-8': !isCouple }"
          >
            <div class="flex items-center gap-3">
              <span
                class="rsvp-muted-panel flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold rsvp-text"
                >{{ isCouple ? 1 : 2 }}</span
              >
              <div>
                <h2 class="text-base font-bold rsvp-text">{{ $t("rsvp.detailsTitle") }}</h2>
                <p class="text-xs rsvp-text-secondary">{{ $t(isCouple ? "rsvp.coupleDetailsBody" : "rsvp.detailsBody") }}</p>
              </div>
            </div>
            <div>
              <label
                id="menuSelectLabel"
                class="block rsvp-text font-semibold text-sm mb-2"
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
                    class="rsvp-choice rsvp-menu-choice rsvp-input-panel flex min-h-24 items-center justify-center rounded-xl px-4 text-center cursor-pointer"
                  >
                    <input
                      v-model="selectedMenuId"
                      type="radio"
                      name="menuSelect"
                      :value="null"
                      class="sr-only"
                    />
                    <span class="rsvp-text-secondary text-sm">{{ $t("rsvp.noPreference") }}</span>
                  </label>
                  <label
                    v-for="m in menus"
                    :key="m.id"
                    class="rsvp-choice rsvp-menu-choice rsvp-input-panel overflow-hidden rounded-xl cursor-pointer"
                  >
                    <input
                      v-model="selectedMenuId"
                      type="radio"
                      name="menuSelect"
                      :value="m.id"
                      class="sr-only"
                    />
                    <div class="h-28 rsvp-muted-panel">
                      <img
                        v-if="m.coverImageUrl"
                        :src="m.coverImageUrl"
                        :alt="m.label"
                        class="h-full w-full object-cover"
                      />
                      <div
                        v-else
                        class="flex h-full items-center justify-center text-3xl rsvp-text"
                        aria-hidden="true"
                      >
                        🍽️
                      </div>
                    </div>
                    <div class="p-3">
                      <p class="font-semibold rsvp-text text-sm">
                        {{ m.label }}
                      </p>
                      <p
                        v-if="m.category"
                        class="rsvp-text-secondary text-xs mt-0.5"
                      >
                        {{ m.category }}
                      </p>
                      <div
                        v-if="hasMenuCourses(m.courses)"
                        class="mt-3 space-y-1 border-t rsvp-divider pt-3 text-left"
                      >
                        <p
                          v-for="c in m.courses"
                          :key="c.id"
                          class="rsvp-text-secondary text-xs"
                        >
                          {{ c.label }}
                        </p>
                      </div>
                      <p
                        v-else
                        class="mt-3 border-t rsvp-divider pt-3 text-left text-xs italic rsvp-text-secondary"
                      >
                        {{ $t("rsvp.noDishes") }}
                      </p>
                    </div>
                  </label>
                </div>
              </template>
              <template v-else>
                <p class="rsvp-text-secondary text-sm italic">
                  {{ $t("rsvp.noMealOptions") }}
                </p>
                <p
                  v-if="mealPreferenceField && !selectedMenuId"
                  class="rsvp-text-secondary text-xs mt-1"
                >
                  {{ $t("rsvp.previousSelection", { value: mealPreferenceField }) }}
                </p>
              </template>
            </div>

            <div>
              <label
                for="dietaryNotes"
                class="block rsvp-text font-semibold text-sm mb-2"
              >
                {{ $t("rsvp.dietaryRequirements") }}
              </label>
              <textarea
                id="dietaryNotes"
                v-model="dietaryNotesField"
                rows="3"
                :placeholder="$t('rsvp.dietaryPlaceholder')"
                maxlength="500"
                class="rsvp-input-panel w-full rounded-xl border px-4 py-3 text-sm transition-colors resize-none "
              />
              <p
                v-if="dietaryNotesError"
                class="rsvp-error text-xs mt-1"
              >
                {{ dietaryNotesError }}
              </p>
            </div>
          </div>

          <!-- +1 Guest sections -->
          <template v-for="(po, idx) in plusOneGuests" :key="po.id">
            <div class="rsvp-input-panel rounded-3xl border p-4 sm:p-6">
              <h2 class="font-display text-xl rsvp-text mb-4">
                {{ po.name }}
              </h2>

              <!-- +1 RSVP Status -->
              <fieldset>
                <legend class="rsvp-text font-semibold text-sm mb-3">
                  {{ $t("rsvp.willGuestAttend", { name: po.name }) }}
                  <span class="rsvp-error">*</span>
                </legend>
                <div class="grid gap-3 sm:grid-cols-2">
                  <label
                    class="rsvp-choice rsvp-choice-accept flex min-h-14 items-center justify-center gap-2 px-4 py-3 rounded-xl cursor-pointer text-sm font-semibold"
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
                    class="rsvp-choice rsvp-choice-decline flex min-h-14 items-center justify-center gap-2 px-4 py-3 rounded-xl cursor-pointer text-sm font-semibold"
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
                    class="block rsvp-text font-semibold text-sm mb-2"
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
                        class="rsvp-choice rsvp-menu-choice rsvp-surface-panel flex min-h-20 items-center justify-center rounded-xl px-3 text-center cursor-pointer"
                      >
                        <input
                          v-model="po.menuId"
                          type="radio"
                          :name="`menu_${idx}`"
                          :value="null"
                          class="sr-only"
                          @change="onPlusOneMenuChange(po)"
                        />
                        <span class="rsvp-text-secondary text-sm"
                          >{{ $t("rsvp.noPreference") }}</span
                        >
                      </label>
                      <label
                        v-for="m in menus"
                        :key="m.id"
                        class="rsvp-choice rsvp-menu-choice rsvp-surface-panel overflow-hidden rounded-xl cursor-pointer"
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
                            class="flex h-16 w-20 shrink-0 items-center justify-center rounded-lg rsvp-muted-panel text-2xl"
                            aria-hidden="true"
                          >
                            🍽️
                          </div>
                          <div class="min-w-0 grow text-left">
                            <p class="font-semibold rsvp-text text-sm">
                              {{ m.label }}
                            </p>
                            <p v-if="m.category" class="rsvp-text-secondary text-xs">
                              {{ m.category }}
                            </p>
                            <div
                              v-if="hasMenuCourses(m.courses)"
                              class="mt-2 space-y-1 border-t rsvp-divider pt-2"
                            >
                              <p
                                v-for="c in m.courses"
                                :key="c.id"
                                class="rsvp-text-secondary text-xs"
                              >
                                {{ c.label }}
                              </p>
                            </div>
                            <p
                              v-else
                              class="mt-2 border-t rsvp-divider pt-2 text-xs italic rsvp-text-secondary"
                            >
                              {{ $t("rsvp.noDishes") }}
                            </p>
                          </div>
                        </div>
                      </label>
                    </div>
                  </template>
                  <template v-else>
                    <p class="rsvp-text-secondary text-sm italic">
                      {{ $t("rsvp.noMealOptions") }}
                    </p>
                    <p
                      v-if="po.mealPreference"
                      class="rsvp-text-secondary text-xs mt-1"
                    >
                      {{ $t("rsvp.previousSelection", { value: po.mealPreference }) }}
                    </p>
                  </template>
                </div>
                <div>
                  <label
                    :for="`dietary_${idx}`"
                    class="block rsvp-text font-semibold text-sm mb-2"
                  >
                    {{ $t("rsvp.dietaryRequirements") }}
                  </label>
                  <textarea
                    :id="`dietary_${idx}`"
                    v-model="po.dietaryNotes"
                    rows="2"
                    :placeholder="$t('rsvp.dietaryPlaceholder')"
                    maxlength="500"
                    class="rsvp-surface-panel w-full rounded-xl border px-4 py-3 text-sm transition-colors resize-none "
                  />
                </div>
              </div>
            </div>
          </template>

          <!-- Submit -->
          <button
            id="rsvp-submit"
            type="submit"
            :disabled="submitting"
            class="rsvp-accent-button min-h-14 w-full rounded-full px-6"
          >
            {{ submitting ? $t("rsvp.sending") : $t(isCouple ? "rsvp.saveDetails" : "rsvp.send") }}
          </button>

          <p
            v-if="submitError"
            ref="submitErrorPanel"
            tabindex="-1"
            class="text-center text-xs rsvp-error"
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
      <p class="mt-7 text-center text-xs rsvp-text-secondary sm:mt-8">
        {{ $t("common.poweredBy") }}
        <NuxtLink
          :to="localePath('/')"
          class="rsvp-link underline decoration-current underline-offset-2 "
        >
          Wedlune
        </NuxtLink>
      </p>
    </main>
  </div>
  </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import { readableTextColor } from "~/utils/colorTheme";
import { z } from "zod";
import { toTypedSchema } from "@vee-validate/zod";
import { useForm, useField } from "vee-validate";
import { hasMenuCourses } from "~/utils/rsvpMenu";
import {
  resolveRsvpColorMode,
  createHeroImageStyle,
  createRsvpTheme,
  defaultRsvpDesign,
  resolveRsvpDesign,
  type RsvpDesign,
} from "~/utils/rsvpDesign";

definePageMeta({ layout: false });

const { t } = useI18n();
const localePath = useLocalePath();

useLocalizedSeo({
  title: () => t("rsvp.seoTitle"),
  description: () => t("rsvp.seoDescription"),
  path: "/rsvp",
  robots: "noindex, nofollow",
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
const confirmationPanel = ref<HTMLElement>();
const submitErrorPanel = ref<HTMLElement>();

watch(submitted, async (isSubmitted) => {
  if (!isSubmitted) return;
  await nextTick();
  confirmationPanel.value?.focus();
});

watch(submitError, async (message) => {
  if (!message) return;
  await nextTick();
  submitErrorPanel.value?.focus();
});

// Guest data from API
const guestName = ref("");
const coupleName = ref<string | null>(null);
const isCouple = ref(false);

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
const rsvpInverseLogo = computed(() => resolveRsvpColorMode(rsvpDesign.value) === "custom" && readableTextColor(rsvpDesign.value.surfaceColor) === "#FFFFFF");
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
      isCouple: boolean;
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
    isCouple.value = data.isCouple;
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

    // Couple attendance is fixed, but their RSVP details remain editable.
    const effectiveStatus = data.isCouple ? "accepted" : data.rsvpStatus;
    if (effectiveStatus !== "pending") {
      hasExistingResponse.value = true;
      selectedMenuId.value = data.menuId ?? null;
      const matched = data.menuId
        ? (data.menus ?? []).find((m) => m.id === data.menuId)
        : null;
      const label = matched ? matched.label : (data.mealPreference ?? "");
      resetForm({
        values: {
          rsvpStatus: effectiveStatus as "accepted" | "declined",
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
      (fetchError.data?.code === "premium_required" ||
        fetchError.data?.code === "free_guest_limit_exceeded")
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
        rsvpStatus: isCouple.value ? "accepted" : values.rsvpStatus,
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

    submittedStatus.value = isCouple.value ? "accepted" : values.rsvpStatus;
    hasExistingResponse.value = true;
    submitted.value = true;
  } catch (err: unknown) {
    const fetchError = err as { data?: { code?: string }; status?: number };
    if (
      fetchError.status === 403 &&
      (fetchError.data?.code === "premium_required" ||
        fetchError.data?.code === "free_guest_limit_exceeded")
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
