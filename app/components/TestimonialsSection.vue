<template>
  <section class="py-20 bg-soft-champagne">
    <div class="max-w-4xl mx-auto px-6">
      <div class="text-center mb-12">
        <p class="section-kicker">
          Designed for couples
        </p>
        <h2 class="font-display text-3xl md:text-4xl text-charcoal">
          When planning starts to feel bigger than the wedding.
        </h2>
      </div>

      <div class="grid md:grid-cols-2 gap-8">
        <article
          v-for="item in coupleNeeds"
          :key="item.title"
          class="card-surface p-8"
        >
          <div class="flex items-center gap-3 mb-5">
            <div
              class="w-10 h-10 rounded-full bg-blush-rose/20 flex items-center justify-center text-blush-rose font-bold text-sm"
            >
              {{ item.initials }}
            </div>
            <div>
              <p class="text-charcoal font-semibold text-sm">
                {{ item.title }}
              </p>
              <p class="text-pearl-gray text-xs">{{ item.detail }}</p>
            </div>
          </div>
          <p class="text-warm-gray text-sm leading-relaxed">
            {{ item.description }}
          </p>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const coupleNeeds = [
  {
    title: "The plan lives in too many places",
    initials: "01",
    detail: "Notes, chats, tabs, and spreadsheets",
    description:
      "Bring scattered research, costs, guests, RSVPs, and deadlines into one shared view before details start slipping.",
  },
  {
    title: "Nobody knows what to do next",
    initials: "02",
    detail: "Too many decisions, not enough clarity",
    description:
      "Let Wedlune surface the next useful action, from vendor follow-ups to RSVP reminders and budget checks.",
  },
];
</script>
