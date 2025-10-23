import Navbar from "@/components/Navigation";
import Footer from "@/components/Footer";
import Head from "next/head";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
}

interface MainLayoutProps {
  children: React.ReactNode;
  seo?: SEOProps; // optional SEO info
}

export default function MainLayout({ children, seo }: MainLayoutProps) {
  // Default SEO values
  const defaultSEO: Required<SEOProps> = {
    title: "Illiyyin - Donate & Support Causes",
    description:
      "Support causes and make donations easily with Illiyyin. Join thousands of donors making a difference!",
    keywords: "donate, charity, fundraising, Illiyyin, support causes, help",
    image: "/og-image.png", // default Open Graph image
    url: "https://yourwebsite.com", // replace with your site URL
  };

  // Merge defaultSEO with passed seo props
  const { title, description, keywords, image, url } = {
    ...defaultSEO,
    ...seo,
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Head>
        <title>{title}</title>
        <meta name="description" content={description || ""} />
        <meta name="keywords" content={keywords || ""} />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        {/* Open Graph / Facebook */}
        <meta property="og:title" content={title || ""} />
        <meta property="og:description" content={description || ""} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={image || ""} />
        <meta property="og:url" content={url || ""} />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title || ""} />
        <meta name="twitter:description" content={description || ""} />
        <meta name="twitter:image" content={image || ""} />
      </Head>

      <Navbar />
      <main className="flex-1 container mx-auto py-8">{children}</main>
      <Footer />
    </div>
  );
}
