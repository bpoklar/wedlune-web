<template>
  <section class="py-20 bg-soft-champagne">
    <div class="max-w-4xl mx-auto px-6">
      <div class="text-center mb-12">
        <p class="font-accent text-champagne-gold text-2xl mb-2">
          Loved by couples
        </p>
        <h2 class="font-display text-3xl md:text-4xl text-charcoal">
          What Couples Say
        </h2>
      </div>

      <div class="grid md:grid-cols-2 gap-8">
        <blockquote
          v-for="testimonial in testimonials"
          :key="testimonial.name"
          class="bg-white rounded-2xl p-8 border border-linen"
        >
          <div class="flex gap-1 mb-4">
            <span v-for="n in 5" :key="n" class="text-champagne-gold text-lg"
              >★</span
            >
          </div>
          <p class="text-warm-gray text-sm leading-relaxed mb-6 italic">
            "{{ testimonial.quote }}"
          </p>
          <footer class="flex items-center gap-3">
            <div
              class="w-10 h-10 rounded-full bg-blush-rose/20 flex items-center justify-center text-blush-rose font-bold text-sm"
            >
              {{ testimonial.initials }}
            </div>
            <div>
              <p class="text-charcoal font-semibold text-sm">
                {{ testimonial.name }}
              </p>
              <p class="text-pearl-gray text-xs">{{ testimonial.detail }}</p>
            </div>
          </footer>
        </blockquote>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const testimonials = [
  {
    quote:
      "Wedlune made planning our wedding so much easier. The AI recommendations were spot-on and saved us weeks of research.",
    name: "Ana & Luka",
    initials: "AL",
    detail: "Married June 2025",
  },
  {
    quote:
      "The automatic timeline was a game changer. We always knew what to do next and never missed a deadline.",
    name: "Sara & Matic",
    initials: "SM",
    detail: "Married September 2025",
  },
];
</script>
