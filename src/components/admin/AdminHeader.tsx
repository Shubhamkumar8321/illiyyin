"use client";

import { usePathname } from "next/navigation";

type AdminHeaderProps = {
  pendingCount?: number;
};

const adminSidebarItems = [
  { path: "", label: "Dashboard" },
  { path: "users", label: "Users" },
  { path: "fundraisers", label: "Fundraisers" },
  { path: "campaigns", label: "Campaigns" },
  { path: "settings", label: "Settings" },
];

export default function AdminHeader({ pendingCount }: AdminHeaderProps) {
  const pathname = usePathname() || "";
  const currentPath = pathname.replace(/^\/admin\/?|\/$/g, "");

  // Handle dynamic edit routes for campaigns
  let title: string;
  if (/^campaigns\/\d+\/edit$/.test(currentPath)) {
    title = "Campaign Edit";
  } else {
    const currentItem =
      adminSidebarItems.find((item) => item.path === currentPath) || null;
    title = currentItem ? currentItem.label : "Admin Panel";
  }

  return (
    <header className="sticky top-0 bg-white border-b p-4 flex justify-between items-center shadow">
      <h1 className="text-xl font-bold">{title}</h1>
      {pendingCount !== undefined && (
        <div className="bg-red-500 text-white text-sm px-3 py-1 rounded-full">
          {pendingCount}
        </div>
      )}
    </header>
  );
}
