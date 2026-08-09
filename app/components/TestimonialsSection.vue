<template>
  <section class="py-20 bg-soft-champagne">
    <div class="max-w-4xl mx-auto px-6">
      <div class="text-center mb-12">
        <p class="section-kicker">
          {{ $t("home.couples.kicker") }}
        </p>
        <h2 class="font-display text-3xl md:text-4xl text-charcoal">
          {{ $t("home.couples.title") }}
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
const { tm } = useI18n();
const coupleNeeds = computed(() => tm("home.couples.items") as Array<{
  title: string;
  initials: string;
  detail: string;
  description: string;
}>);
</script>
