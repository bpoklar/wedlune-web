<template>
  <section id="wishlist-section" class="mt-8 card-surface overflow-hidden sm:mt-10" aria-labelledby="wishlist-heading">
    <header class="rsvp-muted-panel border-b px-5 py-7 text-center sm:px-8 sm:py-8">
      <p class="font-accent text-champagne-gold text-2xl mb-1">{{ $t("wishlist.gifts") }}</p>
      <h2 id="wishlist-heading" class="font-display text-2xl text-charcoal">
        {{ wishlist.title }}
      </h2>
      <p v-if="wishlist.message" class="text-warm-gray text-sm mt-2 max-w-xl mx-auto">
        {{ wishlist.message }}
      </p>
    </header>

    <div class="grid gap-4 p-4 sm:grid-cols-2 sm:gap-5 sm:p-6">
      <article
        v-for="item in wishlist.items"
        :key="item.id"
        :id="`wishlist-item-${item.id}`"
        class="rsvp-input-panel flex flex-col overflow-hidden rounded-2xl border"
      >
        <div v-if="item.imageUrl" class="aspect-4/3 bg-soft-champagne overflow-hidden">
          <img :src="item.imageUrl" :alt="item.title" class="h-full w-full object-cover" loading="lazy" />
        </div>
        <div class="flex grow flex-col p-4 sm:p-5">
          <div class="flex items-start gap-2">
            <span v-if="item.isPriority" class="text-cocoa-brown" :aria-label="$t('wishlist.mostWanted')">♥</span>
            <h3 class="font-display text-xl text-charcoal leading-tight">{{ item.title }}</h3>
          </div>
          <p v-if="item.description" class="text-warm-gray text-sm leading-relaxed mt-2">
            {{ item.description }}
          </p>
          <p v-if="item.priceAmount != null" class="text-champagne-gold font-semibold mt-3">
            {{ formatPrice(item.priceAmount, item.currency) }}
          </p>
          <p class="text-xs text-warm-gray mt-2">
            <template v-if="item.remainingQuantity > 0">
              {{ $t("wishlist.available", { remaining: item.remainingQuantity, desired: item.desiredQuantity }) }}
            </template>
            <template v-else>{{ $t("wishlist.fullyReserved") }}</template>
          </p>

          <div class="mt-auto pt-5 space-y-3">
            <a
              v-if="item.productUrl"
              :href="item.productUrl"
              target="_blank"
              rel="noopener noreferrer"
              referrerpolicy="no-referrer"
              class="rsvp-outline-button flex min-h-12 items-center justify-center rounded-xl border font-semibold text-sm transition-colors"
            >
              {{ $t("wishlist.openShop") }}
            </a>

            <div v-if="item.reservedByYou > 0" class="space-y-2">
              <p class="text-sage-green text-sm font-semibold text-center">
                {{ $t("wishlist.reservedByYou", { count: item.reservedByYou }) }}
              </p>
              <button
                :id="`wishlist-cancel-${item.id}`"
                type="button"
                class="rsvp-surface-panel min-h-12 w-full rounded-xl border text-sm font-semibold disabled:opacity-50"
                :disabled="savingItemId === item.id"
                @click="setReservation(item, 0)"
              >
                {{ savingItemId === item.id ? $t("wishlist.updating") : $t("wishlist.cancel") }}
              </button>
            </div>
            <div v-else-if="item.remainingQuantity > 0" class="flex gap-2">
              <select
                v-if="item.remainingQuantity > 1"
                v-model.number="quantities[item.id]"
                :aria-label="$t('wishlist.quantityFor', { title: item.title })"
                class="rsvp-surface-panel min-h-12 rounded-xl border px-3"
              >
                <option v-for="quantity in item.remainingQuantity" :key="quantity" :value="quantity">
                  {{ quantity }}
                </option>
              </select>
              <button
                :id="`wishlist-reserve-${item.id}`"
                type="button"
                class="rsvp-accent-button min-h-12 grow rounded-xl text-sm font-semibold disabled:opacity-50"
                :disabled="savingItemId === item.id"
                @click="setReservation(item, quantities[item.id] || 1)"
              >
                {{ savingItemId === item.id ? $t("wishlist.reserving") : $t("wishlist.reserve") }}
              </button>
            </div>
            <p v-else class="text-center text-warm-gray text-sm py-2">{{ $t("wishlist.unavailable") }}</p>
            <p v-if="errors[item.id]" class="text-cocoa-brown text-xs text-center" role="alert">
              {{ errors[item.id] }}
            </p>
          </div>
        </div>
      </article>
    </div>
    <p class="sr-only" aria-live="polite">{{ liveMessage }}</p>
  </section>
</template>

<script setup lang="ts">
export interface WishlistItem {
  id: string;
  title: string;
  description: string | null;
  productUrl: string | null;
  priceAmount: number | string | null;
  currency: string | null;
  category: string | null;
  desiredQuantity: number;
  reservedQuantity: number;
  remainingQuantity: number;
  isPriority: boolean;
  imageUrl: string | null;
  reservedByYou: number;
}

export interface Wishlist {
  title: string;
  message: string | null;
  items: WishlistItem[];
}

const props = defineProps<{ token: string; wishlist: Wishlist }>();
const config = useRuntimeConfig();
const { t, locale } = useI18n();
const savingItemId = ref<string | null>(null);
const quantities = reactive<Record<string, number>>({});
const errors = reactive<Record<string, string>>({});
const liveMessage = ref("");

for (const item of props.wishlist.items) quantities[item.id] = 1;

function formatPrice(value: number | string, currency: string | null) {
  const amount = typeof value === "number" ? value : Number(value);
  try {
    return new Intl.NumberFormat(locale.value, {
      style: "currency",
      currency: currency || "EUR",
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${amount.toFixed(2)} ${currency || "EUR"}`;
  }
}

async function setReservation(item: WishlistItem, quantity: number) {
  savingItemId.value = item.id;
  errors[item.id] = "";
  try {
    const response = await $fetch<{
      reservedQuantity: number;
      remainingQuantity: number;
      reservedByYou: number;
    }>(`${config.public.supabaseUrl}/functions/v1/handle-wishlist-reservation`, {
      method: "POST",
      headers: {
        apikey: config.public.supabaseAnonKey as string,
        "Content-Type": "application/json",
        "x-rsvp-token": props.token,
      },
      body: { itemId: item.id, quantity },
    });
    item.reservedQuantity = response.reservedQuantity;
    item.remainingQuantity = response.remainingQuantity;
    item.reservedByYou = response.reservedByYou;
    quantities[item.id] = 1;
    liveMessage.value = quantity === 0
      ? t("wishlist.cancelled", { title: item.title })
      : t("wishlist.success", { title: item.title });
  } catch (error: unknown) {
    const fetchError = error as { data?: { error?: string } };
    errors[item.id] = fetchError.data?.error || t("wishlist.error");
  } finally {
    savingItemId.value = null;
  }
}
</script>
