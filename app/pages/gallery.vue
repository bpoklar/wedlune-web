<template>
  <div class="min-h-screen px-4 py-12 md:py-16">
    <div class="mx-auto max-w-4xl">
      <!-- Loading state -->
      <div v-if="loading" class="flex flex-col items-center justify-center py-24 space-y-4">
        <div class="w-12 h-12 border-4 border-champagne-gold/30 border-t-champagne-gold rounded-full animate-spin" />
        <p class="text-warm-gray text-sm">Loading gallery...</p>
      </div>

      <!-- Error state -->
      <div
        v-else-if="errorMessage"
        class="bg-white rounded-2xl border border-linen p-10 text-center shadow-sm max-w-lg mx-auto"
      >
        <div class="text-5xl mb-4">📷</div>
        <h1 class="font-display text-2xl text-charcoal mb-3">
          Gallery Not Found
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

      <!-- Gallery content -->
      <template v-else-if="data">
        <!-- Header -->
        <div class="text-center mb-10">
          <h1 class="font-display text-3xl md:text-4xl text-charcoal mb-2">
            {{ data.coupleName }}'s Wedding Gallery
          </h1>
          <p v-if="data.weddingDate" class="font-accent text-champagne-gold text-2xl">
            {{ formatDate(data.weddingDate) }}
          </p>
        </div>

        <!-- Shot List Section -->
        <section v-if="data.shotList?.length" class="mb-12">
          <div class="bg-white rounded-2xl border border-linen p-6 md:p-8 shadow-sm">
            <h2 class="font-display text-xl text-charcoal mb-6">Shot List</h2>

            <div v-for="group in data.shotList" :key="group.category" class="mb-6 last:mb-0">
              <h3 class="font-accent text-champagne-gold text-lg mb-2">
                {{ categoryLabel(group.category) }}
              </h3>
              <ul class="space-y-1.5">
                <li
                  v-for="item in group.items"
                  :key="item.title"
                  class="flex items-start gap-2 text-sm"
                  :class="item.isMustHave ? 'text-charcoal' : 'text-warm-gray'"
                >
                  <span
                    v-if="item.isMustHave"
                    class="text-champagne-gold shrink-0 mt-0.5"
                    aria-label="Must have"
                  >★</span>
                  <span v-else class="w-4 shrink-0" />
                  {{ item.title }}
                </li>
              </ul>
            </div>

            <p v-if="data.shotList.every((g) => g.items.length === 0)" class="text-warm-gray text-sm italic">
              No shots have been added to this list yet.
            </p>
          </div>
        </section>

        <!-- Photo Gallery Section -->
        <section v-if="data.photos?.length" class="mb-12">
          <div class="bg-white rounded-2xl border border-linen p-6 md:p-8 shadow-sm">
            <h2 class="font-display text-xl text-charcoal mb-6">
              Photos
              <span class="text-warm-gray text-sm font-body font-normal">
                ({{ data.photos.length }})
              </span>
            </h2>

            <div
              :id="galleryId"
              class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 md:gap-3"
            >
              <a
                v-for="(photo, index) in data.photos"
                :key="photo.id"
                :href="photo.src"
                :data-pswp-width="photo.width || 1200"
                :data-pswp-height="photo.height || 900"
                data-cropped="true"
                target="_blank"
                class="group relative block overflow-hidden rounded-lg bg-linen aspect-square"
                @click.prevent="openPhoto(index)"
              >
                <NuxtImg
                  :src="photo.src"
                  :alt="photo.caption || 'Wedding photo'"
                  class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                  format="webp"
                  densities="1x"
                />
                <div
                  v-if="photo.caption"
                  class="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/60 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                >
                  <p class="text-white text-xs truncate">{{ photo.caption }}</p>
                </div>
              </a>
            </div>
          </div>
        </section>

        <!-- Both empty -->
        <div
          v-if="(!data.shotList?.length || data.shotList.every((g) => g.items.length === 0)) && !data.photos?.length"
          class="bg-white rounded-2xl border border-linen p-10 text-center shadow-sm max-w-lg mx-auto"
        >
          <div class="text-5xl mb-4">✨</div>
          <h2 class="font-display text-xl text-charcoal mb-2">
            Nothing here yet
          </h2>
          <p class="text-warm-gray text-sm">
            The gallery is empty. Check back later!
          </p>
        </div>

        <!-- Branding -->
        <p class="text-center text-pearl-gray text-xs mt-8">
          Powered by
          <NuxtLink to="/" class="text-champagne-gold hover:text-deep-gold">
            Wedlune
          </NuxtLink>
        </p>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PhotoSwipeImage } from "~/composables/usePhotoSwipe";

useSeoMeta({
  title: "Wedding Gallery — Wedlune",
  description: "View a shared wedding gallery with shot list and photos.",
  robots: "noindex, nofollow",
});

const route = useRoute();
const config = useRuntimeConfig();

const token = computed(() => route.query.token as string | undefined);

// UI state
const loading = ref(true);
const errorMessage = ref<string | null>(null);

// Data from API
interface ShotListItem {
  title: string;
  isMustHave: boolean;
  sortOrder: number;
}

interface ShotListGroup {
  category: string;
  items: ShotListItem[];
}

interface GalleryPhoto {
  id: string;
  src: string;
  width: number | null;
  height: number | null;
  caption: string | null;
  category: string | null;
}

interface GalleryData {
  coupleName: string;
  weddingDate: string | null;
  shotList: ShotListGroup[];
  photos: GalleryPhoto[];
}

const data = ref<GalleryData | null>(null);

// Build Edge Function URL
const edgeFunctionUrl = computed(() => {
  const supabaseUrl = config.public.supabaseUrl as string;
  return `${supabaseUrl}/functions/v1/serve-gallery`;
});

// Unique gallery ID for PhotoSwipe
const galleryId = `gallery-${Math.random().toString(36).slice(2, 8)}`;

const { init: initPhotoSwipe, destroy: destroyPhotoSwipe, open: openPhotoSwipe } = usePhotoSwipe();

// Open photo at index
function openPhoto(index: number) {
  openPhotoSwipe(index);
}

// Category labels
const categoryLabels: Record<string, string> = {
  details: "Details",
  getting_ready: "Getting Ready",
  ceremony: "Ceremony",
  family: "Family",
  reception: "Reception",
};

function categoryLabel(cat: string): string {
  return categoryLabels[cat] ?? cat;
}

// Date formatting
function formatDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return dateStr;
  }
}

// Initialize PhotoSwipe when photos are ready
watch(
  () => data.value?.photos,
  (photos) => {
    if (photos && photos.length > 0) {
      nextTick(() => {
        const images: PhotoSwipeImage[] = photos.map((p) => ({
          id: p.id,
          src: p.src,
          width: p.width,
          height: p.height,
          caption: p.caption,
          category: p.category,
        }));
        initPhotoSwipe(`#${galleryId}`, images);
      });
    }
  },
  { immediate: true },
);

onUnmounted(() => destroyPhotoSwipe());

// Fetch gallery data on mount
onMounted(async () => {
  if (!token.value) {
    errorMessage.value =
      "This gallery link is missing a token. Please check the link you received.";
    loading.value = false;
    return;
  }

  try {
    const result = await $fetch<GalleryData>(edgeFunctionUrl.value, {
      params: { token: token.value },
      headers: {
        apikey: config.public.supabaseAnonKey as string,
      },
    });

    data.value = result;
  } catch (err: unknown) {
    const fetchError = err as { data?: { error?: string }; status?: number };
    if (fetchError.status === 403) {
      errorMessage.value =
        "This gallery link is no longer active. The couple may have disabled sharing or regenerated the link.";
    } else if (fetchError.status === 400) {
      errorMessage.value = "Invalid gallery link.";
    } else {
      errorMessage.value =
        "Something went wrong loading the gallery. Please try again later.";
    }
  } finally {
    loading.value = false;
  }
});
</script>
