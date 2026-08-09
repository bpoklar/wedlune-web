<template>
  <div
    :class="['soft-page-bg rsvp-themed relative min-h-screen overflow-hidden px-4 pb-8 pt-0 sm:px-6 sm:pb-12 lg:pb-16', `rsvp-template-${rsvpDesign.template}`]"
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

    <main class="relative mx-auto w-full max-w-3xl">
      <!-- Loading state -->
      <div v-if="loading" class="card-surface mx-auto max-w-lg px-6 py-14 text-center sm:px-10">
        <div
          class="mx-auto h-11 w-11 animate-spin rounded-full border-4 border-champagne-gold/25 border-t-champagne-gold"
        />
        <p class="mt-5 font-display text-xl text-charcoal">Opening your invitation</p>
        <p class="mt-1 text-sm text-warm-gray">Just a moment while we gather the details…</p>
      </div>

      <!-- Premium unavailable state -->
      <div
        v-else-if="premiumUnavailable"
        class="card-surface mx-auto max-w-lg px-6 py-10 text-center sm:p-12"
      >
        <div class="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-soft-champagne text-3xl">💌</div>
        <h1 class="mb-3 font-display text-2xl text-charcoal sm:text-3xl">
          RSVP Currently Unavailable
        </h1>
        <p class="text-warm-gray text-sm leading-relaxed">
          This invitation cannot accept responses right now. Please contact the couple directly.
        </p>
      </div>

      <!-- Error state -->
      <div
        v-else-if="errorMessage"
        class="card-surface mx-auto max-w-lg px-6 py-10 text-center sm:p-12"
      >
        <div class="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-soft-champagne text-3xl">💌</div>
        <h1 class="mb-3 font-display text-2xl text-charcoal sm:text-3xl">
          Invitation Not Found
        </h1>
        <p class="text-warm-gray text-sm leading-relaxed">
          {{ errorMessage }}
        </p>
        <NuxtLink
          to="/"
          class="inline-block mt-6 text-champagne-gold hover:text-deep-gold text-sm font-semibold"
        >
          Go to Wedlune &rarr;
        </NuxtLink>
      </div>

      <!-- Success state (after submission) -->
      <div v-else-if="submitted" class="card-surface mx-auto max-w-xl overflow-hidden text-center">
        <div class="h-1.5 bg-champagne-gold" />
        <div class="px-6 py-9 sm:px-12 sm:py-12">
        <div class="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-soft-champagne text-4xl shadow-inner">
          {{ submittedStatus === "accepted" ? "🎉" : "💐" }}
        </div>
        <p class="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-champagne-gold">
          RSVP confirmed
        </p>
        <h1 class="mb-3 font-display text-3xl text-charcoal sm:text-4xl">
          {{ submittedStatus === "accepted" ? "See You There!" : "Thank You" }}
        </h1>
        <p class="mx-auto max-w-md text-sm leading-relaxed text-warm-gray sm:text-base">
          {{
            submittedStatus === "accepted"
              ? `Thank you, ${guestName}! Your RSVP has been recorded. We can't wait to celebrate with you.`
              : `Thank you for letting us know, ${guestName}. We'll miss you!`
          }}
        </p>
        <p
          v-if="rsvpDesign.confirmationMessage"
          class="mx-auto mt-3 max-w-md text-sm leading-relaxed text-warm-gray sm:text-base"
        >
          {{ rsvpDesign.confirmationMessage }}
        </p>
        <!-- +1 summary -->
        <div v-if="plusOneGuests.length > 0" class="mx-auto mt-6 max-w-sm divide-y divide-linen rounded-2xl border border-linen bg-ivory-cream/70 px-4">
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
              {{ po.rsvpStatus === "accepted" ? "Attending" : "Not attending" }}
            </span>
          </p>
        </div>
        <p
          v-if="coupleName"
          class="mt-6 font-accent text-2xl text-champagne-gold"
        >
          With love, {{ coupleName }}
        </p>
        <div class="mt-7 rounded-2xl border border-linen bg-soft-champagne/60 p-4 text-left sm:p-5">
          <div class="flex gap-3">
            <span class="mt-0.5 text-lg" aria-hidden="true">🔗</span>
            <div>
              <p class="text-sm font-bold text-charcoal">Plans changed?</p>
              <p class="mt-1 text-sm leading-relaxed text-warm-gray">
                Keep this private link. You can return at any time to review or update your RSVP.
              </p>
            </div>
          </div>
        </div>
        <button
          type="button"
          class="mt-5 min-h-12 w-full rounded-full border-2 border-deep-gold px-6 text-sm font-bold text-deep-gold transition-colors hover:bg-deep-gold hover:text-white"
          @click="submitted = false"
        >
          Update my response
        </button>
        </div>
      </div>

      <!-- RSVP Form -->
      <div
        v-else
        class="card-surface overflow-hidden"
      >
        <!-- Header -->
        <div
          :class="[
            'rsvp-invitation-header relative overflow-hidden border-b border-linen bg-soft-champagne px-5 pb-8 text-center sm:px-8 sm:pb-11',
            rsvpDesign.heroImageUrl ? 'pt-8 sm:pt-11' : 'pt-2',
          ]"
        >
          <div class="absolute inset-x-0 top-0 h-1.5 bg-champagne-gold" />
          <img
            v-if="rsvpDesign.heroImageUrl"
            :src="rsvpDesign.heroImageUrl"
            alt=""
            class="rsvp-hero-image mx-auto mb-6 h-52 w-full rounded-2xl object-cover sm:h-72"
          />
          <p class="mb-1 font-accent text-3xl text-champagne-gold sm:text-4xl">
            {{ rsvpDesign.invitationHeading }}
          </p>
          <h1 class="mb-2 font-display text-3xl text-charcoal sm:text-4xl">
            {{ guestName }}
          </h1>
          <p v-if="coupleName" class="mx-auto max-w-md text-sm leading-relaxed text-warm-gray sm:text-base">
            {{ rsvpDesign.welcomeMessage || `${coupleName} would love for you to celebrate with them` }}
          </p>
        </div>

        <form @submit="onSubmit" class="space-y-8 p-5 sm:p-8 md:p-10">
          <div
            v-if="hasExistingResponse"
            class="flex gap-3 rounded-2xl border border-champagne-gold/30 bg-soft-champagne/55 p-4"
          >
            <span aria-hidden="true">✓</span>
            <p class="text-sm leading-relaxed text-warm-gray">
              Your saved response is shown below. You can update it and submit again whenever your plans change.
            </p>
          </div>

          <!-- Main guest RSVP Status -->
          <fieldset>
            <legend class="mb-4 w-full">
              <span class="flex items-center gap-3">
                <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-soft-champagne text-xs font-bold text-deep-gold">1</span>
                <span>
                  <span class="block text-base font-bold text-charcoal">Will you attend? <span class="text-dusty-crimson">*</span></span>
                  <span class="mt-0.5 block text-xs font-normal text-warm-gray">Choose the response that feels right for you.</span>
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
                <span>✓</span> Joyfully Accept
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
                <span>✗</span> Regretfully Decline
              </label>
            </div>
            <p v-if="rsvpStatusError" class="text-dusty-crimson text-xs mt-1">
              {{ rsvpStatusError }}
            </p>
          </fieldset>

          <!-- Main guest meal / dietary (only if accepted) -->
          <div v-if="rsvpStatusField === 'accepted'" class="space-y-6 border-t border-linen pt-8">
            <div class="flex items-center gap-3">
              <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-soft-champagne text-xs font-bold text-deep-gold">2</span>
              <div>
                <h2 class="text-base font-bold text-charcoal">Your details</h2>
                <p class="text-xs text-warm-gray">Tell the couple what you’ll need on the day.</p>
              </div>
            </div>
            <div>
              <label
                id="menuSelectLabel"
                class="block text-charcoal font-semibold text-sm mb-2"
              >
                Meal Preference
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
                      'flex min-h-24 items-center justify-center rounded-xl border-2 bg-ivory-cream px-4 text-center cursor-pointer transition-all',
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
                    <span class="text-warm-gray text-sm">No preference</span>
                  </label>
                  <label
                    v-for="m in menus"
                    :key="m.id"
                    :class="[
                      'overflow-hidden rounded-xl border-2 bg-ivory-cream cursor-pointer transition-all',
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
                      <p v-if="m.category" class="text-warm-gray text-xs mt-0.5">
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
                        No dishes have been provided for this menu.
                      </p>
                    </div>
                  </label>
                </div>
              </template>
              <template v-else>
                <p class="text-warm-gray text-sm italic">
                  No meal options have been added yet.
                </p>
                <p
                  v-if="mealPreferenceField && !selectedMenuId"
                  class="text-warm-gray text-xs mt-1"
                >
                  Previous selection: {{ mealPreferenceField }}
                </p>
              </template>
            </div>

            <div>
              <label
                for="dietaryNotes"
                class="block text-charcoal font-semibold text-sm mb-2"
              >
                Dietary Requirements
              </label>
              <textarea
                id="dietaryNotes"
                v-model="dietaryNotesField"
                rows="3"
                placeholder="Allergies, intolerances, or special requests"
                maxlength="500"
                class="w-full px-4 py-3 rounded-xl border border-linen bg-ivory-cream text-charcoal text-sm placeholder:text-pearl-gray focus:outline-none focus:border-champagne-gold focus:ring-1 focus:ring-champagne-gold/30 transition-colors resize-none"
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
            <div class="rounded-3xl border border-linen bg-ivory-cream/70 p-4 sm:p-6">
              <h2 class="font-display text-xl text-charcoal mb-4">
                {{ po.name }}
              </h2>

              <!-- +1 RSVP Status -->
              <fieldset>
                <legend class="text-charcoal font-semibold text-sm mb-3">
                  Will {{ po.name }} attend?
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
                    <span>✓</span> Attending
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
                    <span>✗</span> Not Attending
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
                    Meal Preference
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
                          'flex min-h-20 items-center justify-center rounded-xl border-2 bg-white px-3 text-center cursor-pointer transition-all',
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
                        <span class="text-warm-gray text-sm">No preference</span>
                      </label>
                      <label
                        v-for="m in menus"
                        :key="m.id"
                        :class="[
                          'overflow-hidden rounded-xl border-2 bg-white cursor-pointer transition-all',
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
                              No dishes have been provided for this menu.
                            </p>
                          </div>
                        </div>
                      </label>
                    </div>
                  </template>
                  <template v-else>
                    <p class="text-warm-gray text-sm italic">
                      No meal options have been added yet.
                    </p>
                    <p
                      v-if="po.mealPreference"
                      class="text-warm-gray text-xs mt-1"
                    >
                      Previous selection: {{ po.mealPreference }}
                    </p>
                  </template>
                </div>
                <div>
                  <label
                    :for="`dietary_${idx}`"
                    class="block text-charcoal font-semibold text-sm mb-2"
                  >
                    Dietary Requirements
                  </label>
                  <textarea
                    :id="`dietary_${idx}`"
                    v-model="po.dietaryNotes"
                    rows="2"
                    placeholder="Allergies, intolerances, or special requests"
                    maxlength="500"
                    class="w-full px-4 py-3 rounded-xl border border-linen bg-ivory-cream text-charcoal text-sm placeholder:text-pearl-gray focus:outline-none focus:border-champagne-gold focus:ring-1 focus:ring-champagne-gold/30 transition-colors resize-none"
                  />
                </div>
              </div>
            </div>
          </template>

          <!-- Submit -->
          <button
            type="submit"
            :disabled="submitting"
            class="min-h-14 w-full rounded-full bg-champagne-gold px-6 text-sm font-bold text-white shadow-lg shadow-champagne-gold/20 transition-all hover:-translate-y-0.5 hover:bg-deep-gold disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
          >
            {{ submitting ? "Sending..." : "Send RSVP" }}
          </button>

          <p v-if="submitError" class="text-dusty-crimson text-xs text-center">
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
        Powered by
        <NuxtLink to="/" class="text-champagne-gold hover:text-deep-gold">
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
  defaultRsvpDesign,
  readableTextColor,
  resolveRsvpDesign,
  type RsvpDesign,
} from "~/utils/rsvpDesign";

useSeoMeta({
  title: "RSVP — Wedlune",
  description:
    "Respond to your wedding invitation. Let the couple know if you can attend.",
  robots: "noindex, nofollow",
  ogTitle: "RSVP — Wedlune",
  ogDescription:
    "Respond to your wedding invitation. Let the couple know if you can attend.",
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
const rsvpThemeStyle = computed(() => ({
  "--rsvp-accent": rsvpDesign.value.accentColor,
  "--rsvp-background": rsvpDesign.value.backgroundColor,
  "--rsvp-surface": rsvpDesign.value.surfaceColor,
  "--rsvp-text": readableTextColor(rsvpDesign.value.surfaceColor),
  "--rsvp-on-accent": readableTextColor(rsvpDesign.value.accentColor),
}));
const plusOneGuests = ref<PlusOneGuest[]>([]);
const wishlist = ref<Wishlist | null>(null);

// Menus data for dropdown
const menus = ref<Menu[]>([]);
const selectedMenuId = ref<string | null>(null);

// Zod schema
const rsvpSchema = toTypedSchema(
  z.object({
    rsvpStatus: z.enum(["accepted", "declined"], {
      message: "Please select your response",
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
    errorMessage.value =
      "This RSVP link is missing a token. Please check the link you received.";
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
    const fetchError = err as { data?: { error?: string; code?: string }; status?: number };
    if (fetchError.status === 403 && fetchError.data?.code === "premium_required") {
      premiumUnavailable.value = true;
    } else if (fetchError.status === 404) {
      errorMessage.value =
        "This RSVP link is invalid or has expired. Please contact the couple for a new link.";
    } else {
      errorMessage.value =
        "Something went wrong loading your invitation. Please try again later.";
    }
  } finally {
    loading.value = false;
  }
});

const onSubmit = handleSubmit(async (values) => {
  const rsvpToken = token.value;
  if (!rsvpToken) {
    submitError.value =
      "This RSVP link is missing a token. Please check the link you received.";
    return;
  }

  // Validate +1 guests have a response selected
  const missingPlusOne = plusOneGuests.value.find(
    (po) => !po.rsvpStatus || !["accepted", "declined"].includes(po.rsvpStatus),
  );
  if (missingPlusOne) {
    submitError.value = `Please select a response for ${missingPlusOne.name}.`;
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
    if (fetchError.status === 403 && fetchError.data?.code === "premium_required") {
      premiumUnavailable.value = true;
      submitted.value = false;
    } else {
      submitError.value =
        "Failed to send your RSVP. Please check your connection and try again.";
    }
  } finally {
    submitting.value = false;
  }
});
</script>

<style scoped>
.rsvp-themed {
  background: var(--rsvp-background);
}

.rsvp-themed :deep(.card-surface) {
  background-color: var(--rsvp-surface);
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

.rsvp-themed :deep(.bg-champagne-gold.text-white) {
  color: var(--rsvp-on-accent);
}

.rsvp-themed :deep(.border-champagne-gold),
.rsvp-themed :deep(.border-deep-gold) {
  border-color: var(--rsvp-accent);
}

.rsvp-template-botanical .rsvp-invitation-header {
  border-radius: 0 0 45% 45% / 0 0 10% 10%;
}

.rsvp-template-botanical .rsvp-hero-image {
  border-radius: 999px 999px 1.5rem 1.5rem;
}

@media (min-width: 640px) {
  .rsvp-template-modern .rsvp-invitation-header {
    display: grid;
    grid-template-columns: minmax(0, 1.15fr) minmax(0, 1fr);
    align-items: center;
    gap: 2rem;
    text-align: left;
  }

  .rsvp-template-modern .rsvp-hero-image {
    grid-row: 1 / span 3;
    height: 20rem;
    margin: 0;
  }
}
</style>
