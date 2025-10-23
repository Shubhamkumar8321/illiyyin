// "use client";

// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { Menu, X } from "lucide-react";
// import { useState } from "react";

// const fundSidebarItems = [
//   { path: "/fundraiser", label: "Dashboard" },
//   { path: "/fundraiser/my-fundraiser", label: "My Fundraisers" },
//   { path: "/fundraiser/donations", label: "Donations" },
//   { path: "/fundraiser/profile", label: "Profile" },
// ];

// export default function FundSidebar({
//   profileName = "Fundraiser",
//   organization,
// }: {
//   profileName?: string;
//   organization?: string;
// }) {
//   const pathname = usePathname();
//   const [open, setOpen] = useState(false);

//   return (
//     <div className="flex min-h-screen">
//       {/* Sidebar */}
//       <aside
//         className={`z-40 w-64 bg-gray-800 text-white flex flex-col transform transition-transform duration-300 ease-in-out
//         fixed inset-y-0 left-0 sm:static
//         ${open ? "translate-x-0" : "-translate-x-full"} sm:translate-x-0`}
//       >
//         {/* Mobile Close Button */}
//         <div className="sm:hidden flex justify-end p-3 border-b border-gray-700">
//           <button
//             onClick={() => setOpen(false)}
//             className="p-2 rounded-md hover:bg-gray-700 transition"
//           >
//             <X className="h-5 w-5" />
//           </button>
//         </div>

//         {/* Profile Section */}
//         <div className="p-4 flex items-center gap-3 border-b border-gray-700">
//           <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center text-gray-700 text-xl">
//             👤
//           </div>
//           <div className="flex flex-col">
//             <p className="text-xs text-gray-400">Logged in as</p>
//             <p className="font-semibold text-white">{profileName}</p>
//             {organization && (
//               <p className="text-xs text-gray-400">{organization}</p>
//             )}
//           </div>
//         </div>

//         {/* Navigation */}
//         <nav className="flex-1 flex flex-col overflow-y-auto">
//           {fundSidebarItems.map((item) => (
//             <Link
//               key={item.path}
//               href={item.path}
//               onClick={() => setOpen(false)}
//               className={`block px-4 py-3 transition-colors duration-200 hover:bg-gray-700 ${
//                 pathname === item.path ? "bg-gray-700 font-semibold" : ""
//               }`}
//             >
//               {item.label}
//             </Link>
//           ))}
//         </nav>
//       </aside>

//       {/* Main Content Placeholder (Sidebar ke right me space ke liye) */}
//       <div className="flex-1">
//         {/* Yaha apna page ka content render hoga */}
//       </div>

//       {/* Mobile Menu Button (Top Right) */}
//       <button
//         onClick={() => setOpen(true)}
//         className="sm:hidden fixed top-4 right-4 z-50 p-2 rounded-md bg-gray-800 text-white hover:bg-gray-700 transition"
//       >
//         <Menu className="h-6 w-6" />
//       </button>

//       {/* Mobile Overlay */}
//       {open && (
//         <div
//           onClick={() => setOpen(false)}
//           className="sm:hidden fixed inset-0 bg-black/40 z-30 transition-opacity"
//         />
//       )}
//     </div>
//   );
// }
