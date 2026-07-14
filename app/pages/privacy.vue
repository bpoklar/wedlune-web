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
        <h2>1. Controller And Contact</h2>
        <p>
          Wedlune ("we", "our", or "us") provides the Wedlune mobile app and
          website. For privacy requests, contact us at
          <a
            href="mailto:hi@wedlune.com"
            class="text-champagne-gold hover:text-deep-gold"
            >hi@wedlune.com</a
          >. If a company address, data-protection officer, or EU
          representative is appointed before launch, those details will be
          published here.
        </p>
      </section>

      <section>
        <h2>2. Information We Collect</h2>
        <p>We collect information you provide or create in the app:</p>
        <ul>
          <li>
            <strong>Account information:</strong> email address, name, partner
            name, authentication identifiers, language, currency, theme,
            subscription status, and partner-invitation details.
          </li>
          <li>
            <strong>Wedding details:</strong> wedding date, venue style,
            location, ceremony preferences, budget range, guest count,
            questionnaire answers, notes, and recommendation preferences.
          </li>
          <li>
            <strong>Planning data:</strong> guests and RSVP details, meal and
            dietary notes, seating, budgets, vendors, venues, accommodation,
            transport, attire, legal documents, timelines, checklists, payment
            milestones, message templates, photos, and shared gallery links.
          </li>
          <li>
            <strong>Technical data:</strong> device/app metadata, local sync
            state, error logs, security logs, and timestamps needed to operate
            and protect the service.
          </li>
          <li>
            <strong>Optional analytics:</strong> limited usage events only if
            you explicitly enable analytics in the app's Settings.
          </li>
        </ul>
      </section>

      <section>
        <h2>3. How We Use Your Information</h2>
        <p>
          We use personal data to provide and secure the app, authenticate
          users, sync and back up planning data, enable partner collaboration,
          generate AI recommendations, process subscriptions, provide customer
          support, prevent abuse, comply with legal obligations, and improve the
          service when analytics are enabled.
        </p>
        <p>
          GDPR legal bases include contract performance for core app features,
          consent for optional analytics and device permissions, legitimate
          interests for security and service improvement, and legal obligations
          for tax, accounting, and compliance records. We do not sell your
          wedding-planning data.
        </p>
      </section>

      <section>
        <h2>4. Storage, Security, And Transfers</h2>
        <p>
          Cloud data is stored with Supabase using authentication, Row-Level
          Security, per-wedding access controls, and encrypted transport (TLS).
          Uploaded photos and documents are stored in Supabase Storage with
          access controls.
        </p>
        <p>
          Some providers may process data outside the EEA. Where GDPR requires
          it, transfers rely on adequacy decisions, Standard Contractual
          Clauses, or equivalent safeguards.
        </p>
      </section>

      <section>
        <h2>5. Local Data And Notifications</h2>
        <p>
          The app stores secure session tokens, "remember me" state,
          preferences, offline cache, pending offline changes, and local
          notification schedules on your device. Notifications are generated
          locally and may include task titles and due-date timing.
        </p>
      </section>

      <section>
        <h2>6. AI Features</h2>
        <p>
          When you use AI-powered features, relevant planning context such as
          questionnaire answers, budget range, venue type, country/city,
          preferences, and existing plan items is sent to secure Supabase Edge
          Functions. These functions may send necessary prompts to configured AI
          providers, currently including Google Gemini, to generate suggestions.
          We avoid sending email, passwords, payment details, and guest contact
          details unless a feature explicitly requires that context.
        </p>
        <p>
          AI output can be inaccurate. Always verify vendor, pricing, legal,
          and scheduling information before relying on it.
        </p>
      </section>

      <section>
        <h2>7. Third-Party Services</h2>
        <p>We use the following services:</p>
        <ul>
          <li><strong>Supabase:</strong> authentication, database, storage, and Edge Functions.</li>
          <li><strong>Google Play and RevenueCat:</strong> subscription status, product identifiers, expiry dates, and transaction metadata. We do not receive full payment-card details.</li>
          <li><strong>Google AdMob:</strong> free-tier banner ads, which may collect device identifiers, approximate location, ad interactions, and diagnostics under Google's policies. Premium users do not see ads.</li>
          <li><strong>AI providers:</strong> generation of recommendations and planning suggestions.</li>
        </ul>
      </section>

      <section>
        <h2>8. Partner Collaboration And Guest Data</h2>
        <p>
          Wedlune lets you invite a partner to a shared wedding plan. We store
          invitation emails, invitation status, partner permissions, and
          activity entries. Depending on the selected role, a partner may view
          or edit shared data such as guests, budget, vendors, timeline, photos,
          and documents.
        </p>
        <p>
          Do not add third-party personal data, including guest contact or
          dietary information, unless you have a lawful reason to do so and can
          share this privacy information with them if needed.
        </p>
      </section>

      <section>
        <h2>9. Usage Analytics</h2>
        <p>
          Usage analytics are off by default. If you turn them on in Settings,
          we collect limited in-app events such as sign-up, sign-in,
          questionnaire completion, recommendation generation, task actions, and
          aggregated screen/session counts. Events may be linked to your
          account so we can improve the product and understand feature adoption.
          You can turn analytics off at any time; doing so stops collection and
          clears locally queued analytics.
        </p>
        <p>We do not use an external crash-reporting SDK.</p>
      </section>

      <section>
        <h2>10. Retention And Deletion</h2>
        <p>
          We keep account and planning data while your account is active. You
          can delete your account in the app under Settings → Delete Account or
          through our
          <NuxtLink
            to="/delete-account"
            class="text-champagne-gold hover:text-deep-gold"
            >account deletion page</NuxtLink
          >. Deletion removes profile, questionnaire, planning, guest, vendor,
          budget, photos, legal documents, timelines, AI recommendations, and
          related storage where technically possible.
        </p>
        <p>
          We may retain limited records when required for security, fraud
          prevention, tax/accounting, dispute handling, or legal compliance.
        </p>
      </section>

      <section>
        <h2>11. Your Rights</h2>
        <p>
          If GDPR applies, you may request access, correction, deletion,
          restriction, portability, objection to processing based on legitimate
          interests, and withdrawal of consent where processing is based on
          consent. You may also lodge a complaint with your local EU/EEA
          data-protection authority.
        </p>
      </section>

      <section>
        <h2>12. Children</h2>
        <p>
          Wedlune is not intended for children. Users must be at least 16 years
          old, or the minimum digital-consent age in their country, to create an
          account.
        </p>
      </section>

      <section>
        <h2>13. Contact Us</h2>
        <p>
          For privacy-related questions or requests, contact
          <a
            href="mailto:hi@wedlune.com"
            class="text-champagne-gold hover:text-deep-gold"
            >hi@wedlune.com</a
          >.
        </p>
      </section>
    </article>
  </div>
</template>

<script setup lang="ts">
const lastUpdated = "July 14, 2026";

useSeoMeta({
  title: "Privacy Policy — Wedlune",
  description:
    "Wedlune Privacy Policy — how we collect, use, and protect your wedding planning data.",
  ogTitle: "Privacy Policy — Wedlune",
  ogDescription:
    "Wedlune Privacy Policy — how we collect, use, and protect your wedding planning data.",
});

useSchemaOrg([
  defineWebPage({
    name: "Privacy Policy — Wedlune",
    description:
      "Wedlune Privacy Policy — how we collect, use, and protect your wedding planning data.",
  }),
]);
</script>
