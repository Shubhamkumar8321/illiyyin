import Head from "next/head";

export default function AboutPage() {
  return (
    <>
      <Head>
        <title>About Us | Illiyyin</title>
        <meta
          name="description"
          content="Learn about Illiyyin, our mission, and how we help people and causes worldwide."
        />
        <meta
          name="keywords"
          content="about us, Illiyyin, mission, donations, charity"
        />
        <meta property="og:title" content="About Us | Illiyyin" />
        <meta
          property="og:description"
          content="Learn about Illiyyin, our mission, and how we help people and causes worldwide."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://yourwebsite.com/about" />
        <meta property="og:image" content="/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="About Us | Illiyyin" />
        <meta
          name="twitter:description"
          content="Learn about Illiyyin, our mission, and how we help people and causes worldwide."
        />
        <meta name="twitter:image" content="/og-image.png" />
      </Head>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">About Us</h1>
        <p className="mb-4">
          Illiyyin is dedicated to helping people by supporting charitable
          causes worldwide. Our mission is to make donating easy, transparent,
          and impactful.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-3">Our Mission</h2>
        <p className="mb-4">
          To empower donors and organizations to create positive change in the
          world.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-3">Our Values</h2>
        <ul className="list-disc list-inside mb-4">
          <li>Transparency</li>
          <li>Integrity</li>
          <li>Community Focus</li>
          <li>Empowerment</li>
        </ul>
      </main>
    </>
  );
}
