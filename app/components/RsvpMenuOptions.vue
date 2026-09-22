<script setup lang="ts">
import { hasMenuCourses } from "~/utils/rsvpMenu";

defineProps<{
  id: string;
  labelledby: string;
  menus: Array<{
    id: string;
    label: string;
    category: string | null;
    coverImageUrl: string | null;
    courses: Array<{ id: string; label: string }>;
  }>;
}>();
const selectedMenu = defineModel<string | null>({ default: null });
const emit = defineEmits<{ change: [] }>();
</script>

<template>
  <div
    :id="id"
    class="grid auto-rows-fr gap-3 sm:grid-cols-2"
    role="radiogroup"
    :aria-labelledby="labelledby"
  >
    <label
      class="rsvp-choice rsvp-menu-choice rsvp-input-panel flex min-h-24 items-center justify-center rounded-xl px-4 text-center cursor-pointer"
    >
      <input
        v-model="selectedMenu"
        type="radio"
        :name="id"
        :value="null"
        class="sr-only"
        @change="emit('change')"
      />
      <RsvpSelectionMark />
      <span class="rsvp-text-secondary text-sm">{{ $t("rsvp.noPreference") }}</span>
    </label>
    <label
      v-for="m in menus"
      :key="m.id"
      class="rsvp-choice rsvp-menu-choice rsvp-input-panel overflow-hidden rounded-xl cursor-pointer"
    >
      <input
        v-model="selectedMenu"
        type="radio"
        :name="id"
        :value="m.id"
        class="sr-only"
        @change="emit('change')"
      />
      <RsvpSelectionMark />
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
