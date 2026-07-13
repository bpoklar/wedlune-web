<template>
  <section class="py-20 bg-ivory-cream">
    <div class="section-shell">
      <div class="grid lg:grid-cols-[0.85fr_1.15fr] gap-10 items-center">
        <div>
          <p class="section-kicker">Why couples choose it</p>
          <h2 class="section-title">
            Less spreadsheet chaos. More calm decisions.
          </h2>
          <p class="section-subtitle mt-4">
            Wedlune brings the moving parts of wedding planning into one shared
            place, so both partners can see what matters next.
          </p>
        </div>

        <div class="grid sm:grid-cols-3 gap-4">
          <article
            v-for="item in trustItems"
            :key="item.title"
            class="card-surface p-6"
          >
            <div class="text-champagne-gold mb-4" aria-hidden="true">
              <component :is="item.icon" class="w-7 h-7" />
            </div>
            <h3 class="font-display text-lg text-charcoal mb-2">
              {{ item.title }}
            </h3>
            <p class="text-warm-gray text-sm leading-relaxed">
              {{ item.description }}
            </p>
          </article>
        </div>
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

const CalendarIcon = makeIcon(
  "M8 7V3m8 4V3M4 11h16M5 5h14a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z",
);

const UsersIcon = makeIcon(
  "M16 11a4 4 0 1 0-8 0m8 0a4 4 0 0 1-8 0m8 0c2.5.8 4 2.5 4 5v1H4v-1c0-2.5 1.5-4.2 4-5m10-3a3 3 0 0 1 0 6M6 8a3 3 0 0 0 0 6",
);

const ShieldIcon = makeIcon(
  "M12 3 5 6v5c0 4.5 2.8 8.4 7 10 4.2-1.6 7-5.5 7-10V6l-7-3Zm-3 9 2 2 4-4",
);

const trustItems = [
  {
    icon: CalendarIcon,
    title: "Clear next steps",
    description:
      "Your timeline turns a big plan into manageable tasks and deadlines.",
  },
  {
    icon: UsersIcon,
    title: "Built for two",
    description:
      "Plan together with shared guests, budgets, vendors, and decisions.",
  },
  {
    icon: ShieldIcon,
    title: "Private by design",
    description:
      "Guest-facing RSVP and gallery links are token-based and noindexed.",
  },
];
</script>
