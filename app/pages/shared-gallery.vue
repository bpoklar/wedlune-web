<template>
  <div class="soft-page-bg min-h-screen px-4 pt-24 pb-16">
    <div class="mx-auto max-w-4xl px-6">
      <!-- Loading state -->
      <div v-if="loading" class="flex flex-col items-center justify-center py-24 space-y-4">
        <div class="w-12 h-12 border-4 border-champagne-gold/30 border-t-champagne-gold rounded-full animate-spin" />
        <p class="text-warm-gray text-sm">Loading shot list...</p>
      </div>

      <!-- Error state -->
      <div
        v-else-if="errorMessage"
        class="card-surface p-10 text-center max-w-lg mx-auto"
      >
        <div class="text-5xl mb-4">📷</div>
        <h1 class="font-display text-2xl text-charcoal mb-3">
          Shot List Not Found
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
          <p class="section-kicker">Wedding photography</p>
          <h1 class="font-display text-3xl md:text-4xl text-charcoal mb-2">
            {{ data.coupleName }}'s Shot List
          </h1>
          <p v-if="data.weddingDate" class="font-accent text-champagne-gold text-2xl">
            {{ formatDate(data.weddingDate) }}
          </p>
          <div
            v-if="totalShots > 0"
            class="mt-6 grid grid-cols-3 gap-3 max-w-md mx-auto"
          >
            <div class="card-surface p-3">
              <p class="font-display text-2xl text-charcoal">{{ totalShots }}</p>
              <p class="text-xs text-warm-gray">shots</p>
            </div>
            <div class="card-surface p-3">
              <p class="font-display text-2xl text-charcoal">
                {{ mustHaveShots }}
              </p>
              <p class="text-xs text-warm-gray">must-have</p>
            </div>
            <div class="card-surface p-3">
              <p class="font-display text-2xl text-charcoal">
                {{ data.shotList.length }}
              </p>
              <p class="text-xs text-warm-gray">groups</p>
            </div>
          </div>
        </div>

        <!-- Shot List Section -->
        <section v-if="data.shotList?.length" class="mb-12">
          <div class="card-surface p-6 md:p-8">
            <h2 class="font-display text-xl text-charcoal mb-6">Shot List</h2>

            <!-- Single gallery container for all images — PhotoSwipe picks up <a> children -->
            <div id="gallery">
              <div
                v-for="group in data.shotList"
                :key="group.category"
                class="mb-6 last:mb-0 rounded-2xl border border-linen bg-ivory-cream/70 p-4"
              >
                <div class="mb-4 flex items-center justify-between gap-3">
                  <h3 class="font-display text-lg text-charcoal">
                    {{ categoryLabel(group.category) }}
                  </h3>
                  <span class="rounded-full bg-warm-white px-3 py-1 text-xs font-bold text-warm-gray">
                    {{ group.items.length }} shots
                  </span>
                </div>

                <div class="space-y-3">
                  <template v-for="item in group.items" :key="item.title">
                    <a
                      v-if="item.src"
                      :href="item.src"
                      target="_blank"
                      class="flex items-start gap-4 rounded-xl bg-warm-white p-3 no-underline text-inherit transition-shadow hover:shadow-sm"
                    >
                      <img
                        :src="item.src"
                        :alt="item.title"
                        class="shrink-0 w-20 h-20 rounded-xl object-cover"
                        loading="lazy"
                      />
                      <div class="min-w-0 flex-1 pt-1">
                        <p
                          class="text-sm"
                          :class="item.isMustHave ? 'text-charcoal font-semibold' : 'text-warm-gray'"
                        >
                          <span
                            v-if="item.isMustHave"
                            class="mr-2 rounded-full bg-champagne-gold/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-deep-gold"
                            aria-label="Must have"
                          >Must-have</span>
                          {{ item.title }}
                        </p>
                      </div>
                    </a>
                    <div
                      v-else
                      class="flex items-start gap-3 rounded-xl bg-warm-white/80 px-3 py-3"
                    >
                      <div
                        class="mt-0.5 h-5 w-5 shrink-0 rounded-full border border-champagne-gold/60"
                        aria-hidden="true"
                      />
                      <div class="min-w-0 flex-1 pt-1">
                        <p
                          class="text-sm"
                          :class="item.isMustHave ? 'text-charcoal font-semibold' : 'text-warm-gray'"
                        >
                          <span
                            v-if="item.isMustHave"
                            class="mr-2 rounded-full bg-champagne-gold/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-deep-gold"
                            aria-label="Must have"
                          >Must-have</span>
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
          class="card-surface p-10 text-center max-w-lg mx-auto"
        >
          <div class="text-5xl mb-4">✨</div>
          <h2 class="font-display text-xl text-charcoal mb-2">
            Nothing here yet
          </h2>
          <p class="text-warm-gray text-sm">
            The shot list is empty. Check back later!
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
  title: "Wedding Shot List — Wedlune",
  description: "View a shared wedding shot list with photos.",
  robots: "noindex, nofollow",
});

useHead({
  meta: [{ name: "referrer", content: "no-referrer" }],
});

const route = useRoute();
const config = useRuntimeConfig();

const token = computed(() =>
  typeof route.query.token === "string" ? route.query.token : undefined,
);

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

const totalShots = computed(
  () =>
    data.value?.shotList.reduce((sum, group) => sum + group.items.length, 0) ??
    0,
);

const mustHaveShots = computed(
  () =>
    data.value?.shotList.reduce(
      (sum, group) =>
        sum + group.items.filter((item) => item.isMustHave).length,
      0,
    ) ?? 0,
);

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
  const shareToken = token.value;
  if (!shareToken) {
    errorMessage.value =
      "This gallery link is missing a token. Please check the link you received.";
    loading.value = false;
    return;
  }

  try {
    const result = await $fetch<GalleryData>(edgeFunctionUrl.value, {
      cache: "no-store",
      headers: {
        apikey: config.public.supabaseAnonKey as string,
        "x-share-token": shareToken,
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
