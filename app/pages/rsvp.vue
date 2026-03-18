<template>
  <div class="min-h-screen flex items-center justify-center px-4 py-16">
    <div class="w-full max-w-lg">
      <!-- Loading state -->
      <div v-if="loading" class="text-center space-y-4">
        <div
          class="w-12 h-12 border-4 border-champagne-gold/30 border-t-champagne-gold rounded-full animate-spin mx-auto"
        />
        <p class="text-warm-gray text-sm">Loading your invitation...</p>
      </div>

      <!-- Error state -->
      <div
        v-else-if="errorMessage"
        class="bg-white rounded-2xl border border-linen p-10 text-center shadow-sm"
      >
        <div class="text-5xl mb-4">💌</div>
        <h1 class="font-display text-2xl text-charcoal mb-3">
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
      <div
        v-else-if="submitted"
        class="bg-white rounded-2xl border border-linen p-10 text-center shadow-sm"
      >
        <div class="text-5xl mb-4">
          {{ submittedStatus === "accepted" ? "🎉" : "💐" }}
        </div>
        <h1 class="font-display text-2xl text-charcoal mb-3">
          {{ submittedStatus === "accepted" ? "See You There!" : "Thank You" }}
        </h1>
        <p class="text-warm-gray text-sm leading-relaxed">
          {{
            submittedStatus === "accepted"
              ? `Thank you, ${guestName}! Your RSVP has been recorded. We can't wait to celebrate with you.`
              : `Thank you for letting us know, ${guestName}. We'll miss you!`
          }}
        </p>
        <p
          v-if="coupleName"
          class="text-champagne-gold font-accent text-xl mt-4"
        >
          With love, {{ coupleName }}
        </p>
      </div>

      <!-- RSVP Form -->
      <div
        v-else
        class="bg-white rounded-2xl border border-linen p-8 md:p-10 shadow-sm"
      >
        <!-- Header -->
        <div class="text-center mb-8">
          <p class="font-accent text-champagne-gold text-2xl mb-1">
            You're Invited
          </p>
          <h1 class="font-display text-3xl text-charcoal mb-2">
            {{ guestName }}
          </h1>
          <p v-if="coupleName" class="text-warm-gray text-sm">
            {{ coupleName }} would love for you to celebrate with them
          </p>
        </div>

        <form @submit="onSubmit" class="space-y-6">
          <!-- RSVP Status -->
          <fieldset>
            <legend class="text-charcoal font-semibold text-sm mb-3">
              Will you attend? <span class="text-dusty-crimson">*</span>
            </legend>
            <div class="grid grid-cols-2 gap-3">
              <label
                :class="[
                  'flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 cursor-pointer transition-all text-sm font-semibold',
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
                  'flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 cursor-pointer transition-all text-sm font-semibold',
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

          <!-- Meal preference (only if accepted) -->
          <div v-if="rsvpStatusField === 'accepted'" class="space-y-6">
            <div>
              <label
                for="mealPreference"
                class="block text-charcoal font-semibold text-sm mb-2"
              >
                Meal Preference
              </label>
              <input
                id="mealPreference"
                v-model="mealPreferenceField"
                type="text"
                placeholder="e.g., Chicken, Fish, Vegetarian"
                maxlength="500"
                class="w-full px-4 py-3 rounded-xl border border-linen bg-ivory-cream text-charcoal text-sm placeholder:text-pearl-gray focus:outline-none focus:border-champagne-gold focus:ring-1 focus:ring-champagne-gold/30 transition-colors"
              />
              <p
                v-if="mealPreferenceError"
                class="text-dusty-crimson text-xs mt-1"
              >
                {{ mealPreferenceError }}
              </p>
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

          <!-- Submit -->
          <button
            type="submit"
            :disabled="submitting"
            class="w-full bg-champagne-gold text-white py-3 rounded-xl font-bold text-sm hover:bg-deep-gold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ submitting ? "Sending..." : "Send RSVP" }}
          </button>

          <p v-if="submitError" class="text-dusty-crimson text-xs text-center">
            {{ submitError }}
          </p>
        </form>
      </div>

      <!-- Branding -->
      <p class="text-center text-pearl-gray text-xs mt-8">
        Powered by
        <NuxtLink to="/" class="text-champagne-gold hover:text-deep-gold">
          Wedlune
        </NuxtLink>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { z } from "zod";
import { toTypedSchema } from "@vee-validate/zod";
import { useForm, useField } from "vee-validate";

useHead({
  title: "RSVP — Wedlune",
  meta: [
    {
      name: "description",
      content:
        "Respond to your wedding invitation. Let the couple know if you can attend.",
    },
    { name: "robots", content: "noindex, nofollow" },
  ],
});

const route = useRoute();
const config = useRuntimeConfig();

const token = computed(() => route.query.token as string | undefined);

// UI state
const loading = ref(true);
const errorMessage = ref<string | null>(null);
const submitted = ref(false);
const submittedStatus = ref<string>("");
const submitting = ref(false);
const submitError = ref<string | null>(null);

// Guest data from API
const guestName = ref("");
const coupleName = ref<string | null>(null);

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

// Fetch guest data on mount
onMounted(async () => {
  if (!token.value) {
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
      coupleName: string | null;
    }>(edgeFunctionUrl.value, {
      params: { token: token.value },
      headers: {
        apikey: config.public.supabaseAnonKey as string,
      },
    });

    guestName.value = data.name;
    coupleName.value = data.coupleName;

    // Pre-fill form if guest already responded
    if (data.rsvpStatus !== "pending") {
      resetForm({
        values: {
          rsvpStatus: data.rsvpStatus as "accepted" | "declined",
          mealPreference: data.mealPreference ?? "",
          dietaryNotes: data.dietaryNotes ?? "",
        },
      });
    }
  } catch (err: unknown) {
    const fetchError = err as { data?: { error?: string }; status?: number };
    if (fetchError.status === 404) {
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
  submitting.value = true;
  submitError.value = null;

  try {
    await $fetch(edgeFunctionUrl.value, {
      method: "POST",
      headers: {
        apikey: config.public.supabaseAnonKey as string,
        "Content-Type": "application/json",
      },
      body: {
        token: token.value,
        rsvpStatus: values.rsvpStatus,
        mealPreference: values.mealPreference || null,
        dietaryNotes: values.dietaryNotes || null,
      },
    });

    submittedStatus.value = values.rsvpStatus;
    submitted.value = true;
  } catch {
    submitError.value =
      "Failed to send your RSVP. Please check your connection and try again.";
  } finally {
    submitting.value = false;
  }
});
</script>
