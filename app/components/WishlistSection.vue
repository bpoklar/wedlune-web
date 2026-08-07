<template>
  <section class="mt-8 card-surface overflow-hidden" aria-labelledby="wishlist-heading">
    <header class="bg-soft-champagne px-6 py-7 text-center border-b border-linen">
      <p class="font-accent text-champagne-gold text-2xl mb-1">Gifts</p>
      <h2 id="wishlist-heading" class="font-display text-2xl text-charcoal">
        {{ wishlist.title }}
      </h2>
      <p v-if="wishlist.message" class="text-warm-gray text-sm mt-2 max-w-xl mx-auto">
        {{ wishlist.message }}
      </p>
    </header>

    <div class="grid gap-5 p-6 sm:grid-cols-2">
      <article
        v-for="item in wishlist.items"
        :key="item.id"
        class="rounded-2xl border border-linen bg-ivory-cream overflow-hidden flex flex-col"
      >
        <div v-if="item.imageUrl" class="aspect-[4/3] bg-soft-champagne overflow-hidden">
          <img :src="item.imageUrl" :alt="item.title" class="h-full w-full object-cover" loading="lazy" />
        </div>
        <div class="p-5 flex flex-col grow">
          <div class="flex items-start gap-2">
            <span v-if="item.isPriority" class="text-dusty-crimson" aria-label="Most wanted">♥</span>
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
              {{ item.remainingQuantity }} of {{ item.desiredQuantity }} available
            </template>
            <template v-else>Fully reserved</template>
          </p>

          <div class="mt-auto pt-5 space-y-3">
            <a
              v-if="item.productUrl"
              :href="item.productUrl"
              target="_blank"
              rel="noopener noreferrer"
              referrerpolicy="no-referrer"
              class="flex min-h-11 items-center justify-center rounded-xl border border-champagne-gold text-champagne-gold font-semibold text-sm hover:bg-soft-champagne transition-colors"
            >
              Open shop ↗
            </a>

            <div v-if="item.reservedByYou > 0" class="space-y-2">
              <p class="text-sage-green text-sm font-semibold text-center">
                You reserved {{ item.reservedByYou }}
              </p>
              <button
                type="button"
                class="w-full min-h-11 rounded-xl border border-linen text-warm-gray text-sm font-semibold hover:border-blush-rose disabled:opacity-50"
                :disabled="savingItemId === item.id"
                @click="setReservation(item, 0)"
              >
                {{ savingItemId === item.id ? "Updating..." : "Cancel reservation" }}
              </button>
            </div>
            <div v-else-if="item.remainingQuantity > 0" class="flex gap-2">
              <select
                v-if="item.remainingQuantity > 1"
                v-model.number="quantities[item.id]"
                :aria-label="`Quantity for ${item.title}`"
                class="min-h-11 rounded-xl border border-linen bg-white px-3 text-charcoal"
              >
                <option v-for="quantity in item.remainingQuantity" :key="quantity" :value="quantity">
                  {{ quantity }}
                </option>
              </select>
              <button
                type="button"
                class="grow min-h-11 rounded-xl bg-champagne-gold text-white text-sm font-semibold hover:bg-deep-gold disabled:opacity-50"
                :disabled="savingItemId === item.id"
                @click="setReservation(item, quantities[item.id] || 1)"
              >
                {{ savingItemId === item.id ? "Reserving..." : "Reserve gift" }}
              </button>
            </div>
            <p v-else class="text-center text-warm-gray text-sm py-2">No longer available</p>
            <p v-if="errors[item.id]" class="text-dusty-crimson text-xs text-center" role="alert">
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
const savingItemId = ref<string | null>(null);
const quantities = reactive<Record<string, number>>({});
const errors = reactive<Record<string, string>>({});
const liveMessage = ref("");

for (const item of props.wishlist.items) quantities[item.id] = 1;

function formatPrice(value: number | string, currency: string | null) {
  const amount = typeof value === "number" ? value : Number(value);
  try {
    return new Intl.NumberFormat(undefined, {
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
      ? `Reservation cancelled for ${item.title}.`
      : `${item.title} reserved successfully.`;
  } catch (error: unknown) {
    const fetchError = error as { data?: { error?: string } };
    errors[item.id] = fetchError.data?.error || "Could not update this reservation. Please try again.";
  } finally {
    savingItemId.value = null;
  }
}
</script>

