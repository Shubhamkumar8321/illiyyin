import FundSidebar from "@/components/fundraiser/FundSidebar";
import FundHeader from "@/components/fundraiser/FundHeader";

export default function FundLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <FundSidebar />
      <div className="flex-1 flex flex-col">
        <FundHeader />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
