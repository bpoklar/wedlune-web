<template>
  <div class="pt-24 pb-16">
    <article
      class="max-w-3xl mx-auto px-6 [&_h2]:font-display [&_h2]:text-[1.375rem] [&_h2]:text-charcoal [&_h2]:mt-8 [&_h2]:mb-3 [&_p]:text-[0.9375rem] [&_p]:leading-[1.7] [&_p]:text-warm-gray [&_p]:mb-3 [&_li]:text-[0.9375rem] [&_li]:leading-[1.7] [&_li]:text-warm-gray [&_li]:mb-3 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_section]:mb-6"
    >
      <h1 class="font-display text-3xl md:text-4xl text-charcoal mb-8">
        Privacy Policy
      </h1>
      <p class="text-warm-gray text-sm mb-6">Last updated: {{ lastUpdated }}</p>

      <section>
        <h2>1. Introduction</h2>
        <p>
          Wedlune ("we", "our", or "us") is committed to protecting your
          personal data. This Privacy Policy explains how we collect, use, and
          safeguard your information when you use our mobile application and
          website.
        </p>
      </section>

      <section>
        <h2>2. Information We Collect</h2>
        <p>We collect the following types of information:</p>
        <ul>
          <li>
            <strong>Account information:</strong> Email address and name when
            you register.
          </li>
          <li>
            <strong>Wedding planning data:</strong> Questionnaire answers,
            preferences, guest lists, budget entries, vendor contacts, and
            timeline tasks you create within the app.
          </li>
          <li>
            <strong>Usage data:</strong> Anonymous analytics about app
            interactions to improve our service.
          </li>
          <li>
            <strong>Device information:</strong> Device type, operating system,
            and app version for compatibility purposes.
          </li>
        </ul>
      </section>

      <section>
        <h2>3. How We Use Your Information</h2>
        <ul>
          <li>To provide personalized AI wedding planning recommendations.</li>
          <li>
            To generate and manage your wedding timeline, budget, and guest
            list.
          </li>
          <li>To improve our app and develop new features.</li>
          <li>
            To send essential service communications (e.g., password resets).
          </li>
        </ul>
      </section>

      <section>
        <h2>4. Data Storage &amp; Security</h2>
        <p>
          Your data is stored securely using Supabase infrastructure with
          row-level security (RLS) policies. All data is encrypted in transit
          via TLS. Only you can access your wedding planning data through your
          authenticated account.
        </p>
      </section>

      <section>
        <h2>5. AI Processing</h2>
        <p>
          When you request AI recommendations, your questionnaire answers and
          preferences are sent to our AI processing service to generate
          personalized suggestions. This data is not used to train AI models and
          is not shared with third parties beyond what is necessary for
          generating your recommendations.
        </p>
      </section>

      <section>
        <h2>6. Third-Party Services</h2>
        <p>We use the following third-party services:</p>
        <ul>
          <li>
            <strong>Supabase:</strong> Authentication and database hosting.
          </li>
          <li>
            <strong>AI providers:</strong> For generating wedding
            recommendations (data is processed, not stored).
          </li>
        </ul>
      </section>

      <section>
        <h2>7. Your Rights</h2>
        <p>You have the right to:</p>
        <ul>
          <li>Access your personal data.</li>
          <li>Request correction of inaccurate data.</li>
          <li>Request deletion of your account and all associated data.</li>
          <li>Export your wedding planning data.</li>
        </ul>
      </section>

      <section>
        <h2>8. Data Retention</h2>
        <p>
          We retain your data for as long as your account is active. When you
          delete your account, all personal data and wedding planning
          information is permanently removed within 30 days.
        </p>
      </section>

      <section>
        <h2>9. Contact Us</h2>
        <p>
          For privacy-related questions, please contact us at
          <a
            href="mailto:privacy@wedlune.com"
            class="text-champagne-gold hover:text-deep-gold"
            >privacy@wedlune.com</a
          >.
        </p>
      </section>
    </article>
  </div>
</template>

<script setup lang="ts">
const lastUpdated = "March 18, 2026";

useHead({
  title: "Privacy Policy — Wedlune",
  meta: [
    {
      name: "description",
      content:
        "Wedlune Privacy Policy — how we collect, use, and protect your wedding planning data.",
    },
  ],
});
</script>
