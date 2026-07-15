<template>
  <section id="features" class="py-20 bg-soft-champagne">
    <div class="section-shell">
      <div class="text-center mb-16">
        <p class="section-kicker">One calm planning space</p>
        <h2 class="section-title">
          Everything that used to live in tabs, notes, chats, and spreadsheets.
        </h2>
        <p class="section-subtitle mx-auto mt-4">
          Wedlune keeps every moving part connected, so one decision never gets
          lost from the rest of your wedding.
        </p>
      </div>

      <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <article
          v-for="feature in features"
          :key="feature.title"
          class="card-surface p-8 hover:shadow-md hover:-translate-y-1 transition-all duration-300"
        >
          <div
            class="w-12 h-12 rounded-2xl flex items-center justify-center mb-5"
            :class="feature.bgClass"
          >
            <component :is="feature.icon" class="w-6 h-6" />
          </div>
          <h3 class="font-display text-xl text-charcoal mb-3">
            {{ feature.title }}
          </h3>
          <p class="text-warm-gray text-sm leading-relaxed">
            {{ feature.description }}
          </p>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { defineComponent, h } from "vue";

const makeIcon = (path: string) =>
  defineComponent({
    inheritAttrs: false,
    setup(_, { attrs }) {
      return () =>
        h(
          "svg",
          {
            ...attrs,
            fill: "none",
            stroke: "currentColor",
            viewBox: "0 0 24 24",
            "aria-hidden": "true",
          },
          [
            h("path", {
              "stroke-linecap": "round",
              "stroke-linejoin": "round",
              "stroke-width": "1.8",
              d: path,
            }),
          ],
        );
    },
  });

const SparkleIcon = makeIcon(
  "m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Zm6 11 .9 2.6 2.6.9-2.6.9L18 21l-.9-2.6-2.6-.9 2.6-.9L18 14Z",
);
const CalendarIcon = makeIcon(
  "M8 7V3m8 4V3M4 11h16M5 5h14a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z",
);
const GuestsIcon = makeIcon(
  "M16 11a4 4 0 1 0-8 0m8 0a4 4 0 0 1-8 0m8 0c2.5.8 4 2.5 4 5v1H4v-1c0-2.5 1.5-4.2 4-5",
);
const BudgetIcon = makeIcon(
  "M12 6v12m4-8c0-1.7-1.8-3-4-3s-4 1.3-4 3 1.8 2.4 4 2.4 4 .7 4 2.3-1.8 3-4 3-4-1.3-4-3",
);
const VendorIcon = makeIcon("M7 8h10M7 12h10M9 16h6M5 4h14v16H5z");
const CameraIcon = makeIcon(
  "M4 8h4l1.5-2h5L16 8h4v11H4V8Zm8 8a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z",
);

const features = [
  {
    icon: SparkleIcon,
    title: "AI Recommendations",
    description:
      "Get next-step suggestions based on your date, budget, guest count, style, and what is still missing.",
    bgClass: "bg-champagne-gold/10",
  },
  {
    icon: CalendarIcon,
    title: "Smart Timeline",
    description:
      "Turn a huge wedding plan into a clear sequence of tasks, dates, reminders, and decisions.",
    bgClass: "bg-blush-rose/15",
  },
  {
    icon: GuestsIcon,
    title: "Guest Management",
    description:
      "Track RSVPs, dietary needs, meal choices, plus-ones, and table details without losing context.",
    bgClass: "bg-sage-green/15",
  },
  {
    icon: BudgetIcon,
    title: "Budget Tracker",
    description:
      "See where money is going, compare quotes, track payments, and spot overspending before it grows.",
    bgClass: "bg-champagne-gold/10",
  },
  {
    icon: VendorIcon,
    title: "Vendor Hub",
    description:
      "Keep quotes, booking status, contacts, and notes together while you choose the right people.",
    bgClass: "bg-blush-rose/15",
  },
  {
    icon: CameraIcon,
    title: "Photo Gallery",
    description:
      "Save inspiration, venue photos, fitting shots, and gallery links beside the plan they belong to.",
    bgClass: "bg-sage-green/15",
  },
];
</script>
