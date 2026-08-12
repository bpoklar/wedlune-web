<template>
  <picture class="block h-full w-full">
    <source
      type="image/avif"
      :srcset="`/img/editorial/${name}-720.avif 720w, /img/editorial/${name}-1440.avif 1440w`"
      :sizes="sizes"
    >
    <source
      type="image/webp"
      :srcset="`/img/editorial/${name}-720.webp 720w, /img/editorial/${name}-1440.webp 1440w`"
      :sizes="sizes"
    >
    <img
      :src="`/img/editorial/${name}-1440.jpg`"
      :alt="alt"
      :width="width"
      :height="height"
      :loading="eager ? 'eager' : 'lazy'"
      :fetchpriority="eager ? 'high' : 'auto'"
      decoding="async"
      class="h-full w-full object-cover"
    >
  </picture>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  name: "rings" | "roses";
  alt: string;
  width: number;
  height: number;
  sizes?: string;
  eager?: boolean;
}>(), {
  sizes: "(min-width: 1024px) 50vw, 100vw",
  eager: false,
});
</script>
