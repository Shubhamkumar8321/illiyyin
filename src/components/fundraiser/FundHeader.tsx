"use client";

import { usePathname } from "next/navigation";

type FundHeaderProps = {
  notificationsCount?: number;
};

const fundSidebarItems = [
  { path: "/fundraiser", label: "Dashboard" },
  { path: "/fundraiser/campaigns", label: "My Campaigns" },
  { path: "/fundraiser/create-campaigns", label: "Create Campaigns" },
  { path: "/fundraiser/documents", label: "Documents" },
  { path: "/fundraiser/profile", label: "Profile" },
];

export default function FundHeader({ notificationsCount }: FundHeaderProps) {
  const pathname = usePathname() || "";

  // Handle dynamic campaign edit route
  let title: string;
  if (/^\/fundraiser\/campaigns\/\d+\/edit$/.test(pathname)) {
    title = "My Campaign Edit";
  } else {
    const currentItem =
      fundSidebarItems.find((item) => item.path === pathname) || null;
    title = currentItem ? currentItem.label : "Fundraiser Dashboard";
  }

  return (
    <header className="sticky top-0 bg-white border-b p-4 flex justify-between items-center shadow">
      <h1 className="text-xl font-bold">{title}</h1>
      {notificationsCount !== undefined && (
        <div className="bg-blue-500 text-white text-sm px-3 py-1 rounded-full">
          {notificationsCount}
        </div>
      )}
    </header>
  );
}
