<template>
  <div class="pt-24 pb-16">
    <article
      class="max-w-3xl mx-auto px-6 [&_h2]:font-display [&_h2]:text-[1.375rem] [&_h2]:text-charcoal [&_h2]:mt-8 [&_h2]:mb-3 [&_p]:text-[0.9375rem] [&_p]:leading-[1.7] [&_p]:text-warm-gray [&_p]:mb-3 [&_li]:text-[0.9375rem] [&_li]:leading-[1.7] [&_li]:text-warm-gray [&_li]:mb-3 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4 [&_section]:mb-6"
    >
      <h1 class="font-display text-3xl md:text-4xl text-charcoal mb-8">
        Delete Your Wedlune Account
      </h1>
      <p class="text-warm-gray text-sm mb-6">Last updated: {{ lastUpdated }}</p>

      <section>
        <h2>Delete In The App</h2>
        <p>
          The fastest way to delete your account is inside Wedlune:
        </p>
        <ol>
          <li>Open the Wedlune app and sign in.</li>
          <li>Go to Settings.</li>
          <li>Select Delete Account.</li>
          <li>Confirm your password when prompted.</li>
        </ol>
      </section>

      <section>
        <h2>Request Deletion By Email</h2>
        <p>
          If you cannot access the app, email
          <a
            href="mailto:hi@wedlune.com?subject=Wedlune%20account%20deletion%20request"
            class="text-champagne-gold hover:text-deep-gold"
            >hi@wedlune.com</a
          >
          from the email address used for your Wedlune account and include
          "Account deletion request" in the subject. We may ask you to verify
          account ownership before completing the request.
        </p>
      </section>

      <section>
        <h2>What Is Deleted</h2>
        <p>
          Account deletion removes your profile, questionnaire answers,
          planning data, guest lists, vendor contacts, budgets, uploaded photos,
          legal documents, timeline tasks, AI recommendations, and related
          storage where technically possible.
        </p>
      </section>

      <section>
        <h2>What May Be Retained</h2>
        <p>
          We may retain limited records when required for security, fraud
          prevention, tax/accounting, dispute handling, or legal compliance.
          Deleting your Wedlune account does not by itself cancel a Google Play
          subscription; manage active subscriptions through Google Play.
        </p>
      </section>

      <section>
        <h2>Privacy Policy</h2>
        <p>
          Read the
          <NuxtLink
            to="/privacy"
            class="text-champagne-gold hover:text-deep-gold"
            >Wedlune Privacy Policy</NuxtLink
          >
          for more details about deletion, retention, and your privacy rights.
        </p>
      </section>
    </article>
  </div>
</template>

<script setup lang="ts">
const lastUpdated = "July 14, 2026";

useSeoMeta({
  title: "Delete Your Account — Wedlune",
  description:
    "How to delete your Wedlune account and associated wedding planning data.",
  ogTitle: "Delete Your Account — Wedlune",
  ogDescription:
    "How to delete your Wedlune account and associated wedding planning data.",
});

useSchemaOrg([
  defineWebPage({
    name: "Delete Your Account — Wedlune",
    description:
      "How to delete your Wedlune account and associated wedding planning data.",
  }),
]);
</script>
