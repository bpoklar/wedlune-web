<template>
  <div class="pt-24 pb-16">
    <article
      class="max-w-3xl mx-auto px-6 [&_h2]:font-display [&_h2]:text-[1.375rem] [&_h2]:text-charcoal [&_h2]:mt-8 [&_h2]:mb-3 [&_p]:text-[0.9375rem] [&_p]:leading-[1.7] [&_p]:text-warm-gray [&_p]:mb-3 [&_li]:text-[0.9375rem] [&_li]:leading-[1.7] [&_li]:text-warm-gray [&_li]:mb-3 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_section]:mb-6"
    >
      <h1 class="font-display text-3xl md:text-4xl text-charcoal mb-8">
        Terms of Service
      </h1>
      <p class="text-warm-gray text-sm mb-6">Last updated: {{ lastUpdated }}</p>

      <section>
        <h2>1. Acceptance of Terms</h2>
        <p>
          By downloading, installing, or using Wedlune ("the App"), you agree to
          be bound by these Terms of Service. If you do not agree to these
          terms, please do not use the App.
        </p>
      </section>

      <section>
        <h2>2. Description of Service</h2>
        <p>
          Wedlune is an AI-powered wedding planning assistant that helps couples
          organize their wedding. Features include personalized recommendations,
          timeline management, budget tracking, guest list management, and
          vendor discovery.
        </p>
      </section>

      <section>
        <h2>3. User Accounts</h2>
        <ul>
          <li>
            You must provide accurate information when creating an account.
          </li>
          <li>
            You are responsible for maintaining the security of your account
            credentials.
          </li>
          <li>You must be at least 16 years of age to use the App.</li>
          <li>
            One account is intended for use by one couple planning their
            wedding.
          </li>
        </ul>
      </section>

      <section>
        <h2>4. Acceptable Use</h2>
        <p>You agree not to:</p>
        <ul>
          <li>Use the App for any unlawful purpose.</li>
          <li>
            Attempt to reverse-engineer, decompile, or disassemble the App.
          </li>
          <li>Interfere with or disrupt the App's infrastructure.</li>
          <li>Use automated tools to scrape data from the App.</li>
        </ul>
      </section>

      <section>
        <h2>5. AI Recommendations</h2>
        <p>
          The App provides AI-generated recommendations for wedding planning.
          These suggestions are for informational purposes only. We do not
          guarantee the accuracy, availability, or pricing of recommended
          vendors or services. Always verify details directly with vendors
          before making commitments.
        </p>
      </section>

      <section>
        <h2>6. Intellectual Property</h2>
        <p>
          The App, including its design, code, and content, is owned by Wedlune.
          Your wedding planning data remains yours. You grant us a limited
          license to process your data solely for providing the service.
        </p>
      </section>

      <section>
        <h2>7. Limitation of Liability</h2>
        <p>
          Wedlune is provided "as is" without warranties of any kind. We are not
          liable for any damages arising from your use of the App, including but
          not limited to issues with vendor recommendations, AI-generated
          content, or data loss.
        </p>
      </section>

      <section>
        <h2>8. Termination</h2>
        <p>
          You may delete your account at any time. We reserve the right to
          suspend or terminate accounts that violate these terms. Upon
          termination, your data will be deleted in accordance with our
          <NuxtLink
            to="/privacy"
            class="text-champagne-gold hover:text-deep-gold"
            >Privacy Policy</NuxtLink
          >.
        </p>
      </section>

      <section>
        <h2>9. Changes to Terms</h2>
        <p>
          We may update these Terms of Service from time to time. Continued use
          of the App after changes constitutes acceptance of the updated terms.
        </p>
      </section>

      <section>
        <h2>10. Contact</h2>
        <p>
          For questions about these terms, please contact us at
          <a
            href="mailto:hello@wedlune.com"
            class="text-champagne-gold hover:text-deep-gold"
            >hello@wedlune.com</a
          >.
        </p>
      </section>
    </article>
  </div>
</template>

<script setup lang="ts">
const lastUpdated = "March 18, 2026";

useHead({
  title: "Terms of Service — Wedlune",
  meta: [
    {
      name: "description",
      content:
        "Wedlune Terms of Service — rules and guidelines for using our AI wedding planning app.",
    },
  ],
});
</script>
