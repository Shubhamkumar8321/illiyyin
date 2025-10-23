import Head from "next/head";

export default function PrivacyPage() {
  return (
    <>
      <Head>
        <title>Privacy Policy | Illiyyin</title>
        <meta
          name="description"
          content="Read Illiyyin's Privacy Policy to learn how we protect your personal information, secure donations, and handle user data responsibly."
        />
        <meta
          name="keywords"
          content="Privacy Policy, Illiyyin, donation privacy, data security, GDPR, personal information"
        />
        <meta property="og:title" content="Privacy Policy | Illiyyin" />
        <meta
          property="og:description"
          content="Learn how Illiyyin protects your data, ensures donation security, and maintains user trust."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://yourwebsite.com/privacy" />
        <meta property="og:image" content="/og-image.png" />
      </Head>

      <main className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-4xl font-bold mb-6 text-gray-800">
          Privacy Policy
        </h1>
        <p className="mb-6 text-gray-700">
          At <strong>Illiyyin</strong>, we are committed to protecting your
          privacy. This Privacy Policy explains how we collect, use, disclose,
          and safeguard your personal information when you visit our platform or
          make donations.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-3">
          1. Information We Collect
        </h2>
        <p className="mb-4 text-gray-700">
          We may collect the following types of information from users:
        </p>
        <ul className="list-disc list-inside mb-4 text-gray-700 space-y-2">
          <li>
            <strong>Personal Information:</strong> Name, email address, phone
            number, billing address, and payment details.
          </li>
          <li>
            <strong>Donation Details:</strong> Amounts donated, campaigns
            supported, and donation frequency.
          </li>
          <li>
            <strong>Technical Data:</strong> IP address, browser type, operating
            system, device information, and location data (if enabled).
          </li>
          <li>
            <strong>Cookies:</strong> We use cookies to improve your experience
            and analyze traffic patterns.
          </li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-3">
          2. How We Use Your Information
        </h2>
        <ul className="list-disc list-inside mb-4 text-gray-700 space-y-2">
          <li>To process your donations securely and efficiently.</li>
          <li>
            To send you receipts, confirmations, and updates about campaigns.
          </li>
          <li>To personalize your experience on our website.</li>
          <li>
            To comply with legal obligations or prevent fraudulent activity.
          </li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-3">
          3. How We Protect Your Data
        </h2>
        <p className="mb-4 text-gray-700">
          We use encryption (SSL), secure servers, and strict access controls to
          protect your personal data. Payment information is processed only by
          trusted third-party payment gateways (e.g., Stripe, PayPal) and never
          stored on our servers.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-3">
          4. Sharing of Information
        </h2>
        <p className="mb-4 text-gray-700">
          We do not sell or rent your personal data. However, we may share
          limited information with:
        </p>
        <ul className="list-disc list-inside mb-4 text-gray-700 space-y-2">
          <li>Payment processors for secure transaction handling.</li>
          <li>
            Verified campaign organizers to acknowledge your contribution.
          </li>
          <li>Law enforcement or regulators if required by law.</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-3">
          5. Cookies and Tracking
        </h2>
        <p className="mb-4 text-gray-700">
          We use cookies and analytics tools (such as Google Analytics) to
          analyze user behavior, improve our platform, and personalize content.
          You can disable cookies in your browser settings.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-3">6. Your Rights</h2>
        <ul className="list-disc list-inside mb-4 text-gray-700 space-y-2">
          <li>Request access to your personal data.</li>
          <li>Request correction or deletion of your data.</li>
          <li>Withdraw consent to receive emails or newsletters.</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-3">
          7. Third-Party Links
        </h2>
        <p className="mb-4 text-gray-700">
          Our website may contain links to third-party websites. We are not
          responsible for their privacy policies or content.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-3">
          8. Changes to This Policy
        </h2>
        <p className="mb-4 text-gray-700">
          Illiyyin may update this Privacy Policy from time to time. Any changes
          will be reflected on this page with an updated effective date.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-3">9. Contact Us</h2>
        <p className="text-gray-700">
          If you have any questions about this Privacy Policy or how we handle
          your data, please contact us at{" "}
          <a
            href="mailto:support@illiyyin.org"
            className="text-green-600 font-medium"
          >
            support@illiyyin.org
          </a>
          .
        </p>
      </main>
    </>
  );
}
