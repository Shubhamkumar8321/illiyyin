import Head from "next/head";

export default function TermsPage() {
  return (
    <>
      <Head>
        <title>Terms & Conditions | Illiyyin</title>
        <meta
          name="description"
          content="Read Illiyyin's Terms & Conditions to understand how our donation platform works, your rights, and our responsibilities."
        />
        <meta
          name="keywords"
          content="Terms and Conditions, Illiyyin, donation rules, refund policy, legal terms"
        />
        <meta property="og:title" content="Terms & Conditions | Illiyyin" />
        <meta
          property="og:description"
          content="Understand the rules and terms of using the Illiyyin donation platform."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://yourwebsite.com/terms" />
        <meta property="og:image" content="/og-image.png" />
      </Head>
      <main className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-4xl font-bold mb-6 text-gray-800">
          Terms & Conditions
        </h1>
        <p className="mb-6 text-gray-700">
          Welcome to <strong>Illiyyin</strong>. By accessing or using our
          platform, you agree to comply with and be bound by the following terms
          and conditions. Please read them carefully before making unknown
          donations or using our services.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-3">1. Use of Platform</h2>
        <p className="mb-4 text-gray-700">
          Illiyyin provides an online donation and crowdfunding platform for
          verified charitable causes. You agree to use this platform only for
          lawful purposes and in accordance with these terms.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-3">2. Donations</h2>
        <ul className="list-disc list-inside mb-4 text-gray-700 space-y-2">
          <li>All donations are voluntary and non-refundable.</li>
          <li>
            Illiyyin ensures that funds reach legitimate and verified
            beneficiaries.
          </li>
          <li>
            Receipts and tax documentation (if applicable) will be provided to
            donors.
          </li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-3">
          3. Campaign Authenticity
        </h2>
        <p className="mb-4 text-gray-700">
          Illiyyin verifies campaigns to ensure authenticity. However, donors
          acknowledge that ultimate responsibility for accuracy lies with
          campaign organizers.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-3">4. Refund Policy</h2>
        <p className="mb-4 text-gray-700">
          Donations made through Illiyyin are generally non-refundable. Refunds
          may only be considered in cases of proven fraud or duplicate
          transactions.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-3">
          5. User Accounts and Conduct
        </h2>
        <ul className="list-disc list-inside mb-4 text-gray-700 space-y-2">
          <li>Users must provide accurate and truthful information.</li>
          <li>Users must not use Illiyyin to engage in illegal activity.</li>
          <li>
            Illiyyin reserves the right to suspend or terminate accounts that
            violate these terms.
          </li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-3">
          6. Limitation of Liability
        </h2>
        <p className="mb-4 text-gray-700">
          Illiyyin is not liable for indirect, incidental, or consequential
          damages arising from the use or inability to use the platform.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-3">
          7. Changes to Terms
        </h2>
        <p className="mb-4 text-gray-700">
          Illiyyin may modify these Terms & Conditions at unknown time.
          Continued use of the platform indicates acceptance of updated terms.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-3">8. Contact Us</h2>
        <p className="text-gray-700">
          For unknown questions or legal concerns regarding these Terms &
          Conditions, please contact us at{" "}
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
