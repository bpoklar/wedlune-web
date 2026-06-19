<template>
  <div class="min-h-screen px-4 pt-24 pb-16">
    <div class="mx-auto max-w-4xl px-6">
      <!-- Loading state -->
      <div v-if="loading" class="flex flex-col items-center justify-center py-24 space-y-4">
        <div class="w-12 h-12 border-4 border-champagne-gold/30 border-t-champagne-gold rounded-full animate-spin" />
        <p class="text-warm-gray text-sm">Loading shoot list...</p>
      </div>

      <!-- Error state -->
      <div
        v-else-if="errorMessage"
        class="bg-white rounded-2xl border border-linen p-10 text-center shadow-sm max-w-lg mx-auto"
      >
        <div class="text-5xl mb-4">📷</div>
        <h1 class="font-display text-2xl text-charcoal mb-3">
          Shoot List Not Found
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
            {{ data.coupleName }}'s Shoot List
          </h1>
          <p v-if="data.weddingDate" class="font-accent text-champagne-gold text-2xl">
            {{ formatDate(data.weddingDate) }}
          </p>
        </div>

        <!-- Shot List Section -->
        <section v-if="data.shotList?.length" class="mb-12">
          <div class="bg-white rounded-2xl border border-linen p-6 md:p-8 shadow-sm">
            <h2 class="font-display text-xl text-charcoal mb-6">Shoot List</h2>

            <!-- Single gallery container for all images — PhotoSwipe picks up <a> children -->
            <div id="gallery">
              <div v-for="group in data.shotList" :key="group.category" class="mb-8 last:mb-0">
                <h3 class="font-accent text-champagne-gold text-lg mb-3">
                  {{ categoryLabel(group.category) }}
                </h3>

                <div class="space-y-3">
                  <template v-for="item in group.items" :key="item.title">
                    <a
                      v-if="item.src"
                      :href="item.src"
                      target="_blank"
                      class="flex items-start gap-3 no-underline text-inherit"
                    >
                      <img
                        :src="item.src"
                        :alt="item.title"
                        class="shrink-0 w-16 h-16 rounded-lg object-cover"
                        loading="lazy"
                      />
                      <div class="min-w-0 flex-1 pt-1">
                        <p
                          class="text-sm"
                          :class="item.isMustHave ? 'text-charcoal font-semibold' : 'text-warm-gray'"
                        >
                          <span
                            v-if="item.isMustHave"
                            class="text-champagne-gold mr-1"
                            aria-label="Must have"
                          >★</span>
                          {{ item.title }}
                        </p>
                      </div>
                    </a>
                    <div
                      v-else
                      class="flex items-start gap-3 px-2 py-1"
                    >
                      <div class="min-w-0 flex-1 pt-1">
                        <p
                          class="text-sm"
                          :class="item.isMustHave ? 'text-charcoal font-semibold' : 'text-warm-gray'"
                        >
                          <span
                            v-if="item.isMustHave"
                            class="text-champagne-gold mr-1"
                            aria-label="Must have"
                          >★</span>
                          {{ item.title }}
                        </p>
                      </div>
                    </div>
                  </template>
                </div>
              </div>
            </div>

            <p v-if="data.shotList.every((g) => g.items.length === 0)" class="text-warm-gray text-sm italic">
              No shots have been added to this list yet.
            </p>
          </div>
        </section>

        <!-- No content at all -->
        <div
          v-if="!data.shotList?.length || data.shotList.every((g) => g.items.length === 0)"
          class="bg-white rounded-2xl border border-linen p-10 text-center shadow-sm max-w-lg mx-auto"
        >
          <div class="text-5xl mb-4">✨</div>
          <h2 class="font-display text-xl text-charcoal mb-2">
            Nothing here yet
          </h2>
          <p class="text-warm-gray text-sm">
            The shoot list is empty. Check back later!
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
useSeoMeta({
  title: "Wedding Shoot List — Wedlune",
  description: "View a shared wedding shoot list with photos.",
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
  src: string | null;
}

interface ShotListGroup {
  category: string;
  items: ShotListItem[];
}

interface GalleryData {
  coupleName: string;
  weddingDate: string | null;
  shotList: ShotListGroup[];
}

const data = ref<GalleryData | null>(null);

// Build Edge Function URL
const edgeFunctionUrl = computed(() => {
  const supabaseUrl = config.public.supabaseUrl as string;
  return `${supabaseUrl}/functions/v1/serve-gallery`;
});

const { init: initPhotoSwipe, destroy: destroyPhotoSwipe } = usePhotoSwipe();

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

// Initialize PhotoSwipe — preload images to get natural dimensions
watch(
  () => data.value?.shotList,
  async (shotList) => {
    if (!shotList || shotList.length === 0) return;
    const hasImages = shotList.some((g) => g.items.some((i) => i.src));
    if (!hasImages) return;

    const loaded: { src: string; w: number; h: number; title?: string }[] = [];
    for (const group of shotList) {
      for (const item of group.items) {
        if (item.src) {
          const img = new Image();
          img.src = item.src;
          try {
            await img.decode();
            loaded.push({
              src: item.src,
              w: img.naturalWidth,
              h: img.naturalHeight,
              title: item.title,
            });
          } catch {
            loaded.push({ src: item.src, w: 1200, h: 900, title: item.title });
          }
        }
      }
    }

    nextTick(() => {
      if (loaded.length > 0) {
        initPhotoSwipe("#gallery", loaded);
      }
    });
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
