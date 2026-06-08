<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
useSchemaOrg([
  defineOrganization({
    name: "Wedlune",
    url: "https://wedlune.com",
    description:
      "AI-powered wedding planning assistant that helps couples find venues, manage vendors, track budgets, and build smart timelines.",
  }),
]);
</script>
