import Hero from "@/components/HomePage/hero";
import PartnerLogos from "@/components/HomePage/patenr";
import RecentCampaigns from "@/components/HomePage/recentcampaign";
import Campaigncard from "@/components/HomePage/campaigncard";
import Featurecard from "@/components/HomePage/feature";
import Categories from "@/components/HomePage/categories";
import Individual from "@/components/HomePage/individual";
import Fundraise from "@/components/HomePage/fundraiseOptions";
import Special from "@/components/HomePage/specialcard"; //

export default function Home() {
  return (
    <div className="font-sans w-full">
      <Hero />
      <Campaigncard />
      <Featurecard />
      <RecentCampaigns />
      <Categories />
      <Individual />
      <PartnerLogos />
      <Fundraise />
      <Special />
    </div>
  );
}
