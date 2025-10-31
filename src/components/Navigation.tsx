// "use client";

// import React, { useState, useEffect, useRef } from "react";
// import { Menu, Search, X, Globe, User as UserIcon } from "lucide-react";
// import { motion, AnimatePresence } from "framer-motion";
// import CenteredLoginSignupModal, { User } from "./LoginModel";

// const Navbar: React.FC = () => {
//   const [modalOpen, setModalOpen] = useState(false);
//   const [user, setUser] = useState<User | null>(null);
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [hydrated, setHydrated] = useState(false);

//   const dropdownRef = useRef<HTMLDivElement>(null);

//   const placeholders = [
//     "Search campaigns...",
//     "Find fundraisers...",
//     "Look for causes...",
//     "Discover projects...",
//   ];
//   const [placeholderIndex, setPlaceholderIndex] = useState(0);

//   // Ensure component is hydrated before rendering user info
//   useEffect(() => setHydrated(true), []);

//   // Load user data from localStorage (client only)
//   useEffect(() => {
//     try {
//       const storedUser = localStorage.getItem("user");
//       if (storedUser) {
//         setUser(JSON.parse(storedUser) as User);
//       }
//     } catch {
//       setUser(null);
//     }
//   }, []);

//   // Rotate placeholder text every 2 seconds
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
//     }, 2000);
//     return () => clearInterval(interval);
//   }, []);

//   // Close dropdown if clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (
//         dropdownRef.current &&
//         !dropdownRef.current.contains(event.target as Node)
//       ) {
//         setDropdownOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   const handleLoginSuccess = (userData: User) => {
//     setUser(userData);
//     localStorage.setItem("user", JSON.stringify(userData));
//   };

//   const handleLogout = () => {
//     setUser(null);
//     localStorage.removeItem("user");
//     localStorage.removeItem("token");
//     setDropdownOpen(false);
//     setMobileMenuOpen(false);
//   };

//   const dashboardLink =
//     user?.role === "admin"
//       ? "/admin"
//       : user?.role === "fundraiser"
//       ? "/fundraiser"
//       : "/";

//   return (
//     <header className="fixed top-0 left-0 w-full z-50 backdrop-blur-[5px] bg-white/60">
//       <nav className="flex items-center justify-between px-4 md:px-24 py-4 relative">
//         {/* Left Side - Login/User */}
//         <div className="hidden md:flex items-center gap-4 flex-1">
//           {!hydrated ? null : !user ? (
//             <button
//               onClick={() => setModalOpen(true)}
//               className="border border-[#094C3B] text-[#094C3B] px-4 py-1 font-bold rounded-full hover:bg-[#094C3B] hover:text-white transition text-xm"
//             >
//               Login
//             </button>
//           ) : (
//             <div className="relative" ref={dropdownRef}>
//               <button
//                 onClick={() => setDropdownOpen((prev) => !prev)}
//                 className="w-10 h-10 rounded-full bg-[#094C3B] text-white flex items-center justify-center font-semibold text-lg hover:brightness-110 transition"
//               >
//                 {user.name?.charAt(0).toUpperCase()}
//               </button>

//               <AnimatePresence>
//                 {dropdownOpen && (
//                   <motion.div
//                     initial={{ opacity: 0, scale: 0.95, y: -5 }}
//                     animate={{ opacity: 1, scale: 1, y: 0 }}
//                     exit={{ opacity: 0, scale: 0.95, y: -5 }}
//                     transition={{ duration: 0.2 }}
//                     className="absolute mt-3 w-64 sm:w-72 bg-white shadow-2xl rounded-2xl border p-4 z-50 "
//                   >
//                     <div className="flex items-center gap-3 mb-3">
//                       <div className="w-12 h-12 rounded-full bg-[#094C3B] text-white flex items-center justify-center font-bold text-lg">
//                         {user.name?.charAt(0).toUpperCase()}
//                       </div>
//                       <div>
//                         <p className="text-black font-semibold text-lg">
//                           {user.name}
//                         </p>
//                         <p className="text-gray-500 text-sm">
//                           Role: {user.role}
//                         </p>
//                       </div>
//                     </div>

//                     <hr className="my-2" />

//                     <a
//                       href={dashboardLink}
//                       onClick={() => setDropdownOpen(false)}
//                       className="block px-3 py-2 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-100 transition"
//                     >
//                       Dashboard
//                     </a>

//                     <button
//                       onClick={handleLogout}
//                       className="w-full text-left px-3 py-2 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-100 transition"
//                     >
//                       Logout
//                     </button>
//                   </motion.div>
//                 )}
//               </AnimatePresence>
//             </div>
//           )}
//         </div>

//         {/* Logo */}
//         <h1 className="text-black font-bold text-lg md:text-xl mx-auto md:mx-0">
//           ILLIYY<span className="relative">IN</span>
//         </h1>

//         {/* Right - Search */}
//         <div className="flex items-center gap-2 md:gap-4 flex-1 justify-end">
//           <div className="hidden md:flex relative items-center border border-[#094C3B] rounded-full overflow-hidden max-w-xs flex-grow">
//             <input
//               type="text"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               placeholder={placeholders[placeholderIndex]}
//               className="bg-transparent px-4 py-1 w-full focus:outline-none"
//             />
//             <Search className="absolute right-2 text-[#094C3B] cursor-pointer" />
//           </div>
//         </div>

//         {/* Mobile Menu Button */}
//         <button
//           onClick={() => setMobileMenuOpen((prev) => !prev)}
//           className="border border-[#094C3B] text-[#094C3B] rounded-full p-2 hover:bg-[#094C3B] hover:text-white transition ml-8"
//         >
//           {mobileMenuOpen ? (
//             <X className="w-5 h-5" />
//           ) : (
//             <Menu className="w-5 h-5" />
//           )}
//         </button>

//         {/* Mobile Dropdown */}
//         <AnimatePresence>
//           {mobileMenuOpen && (
//             <motion.div
//               initial={{ opacity: 0, y: -10 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -10 }}
//               transition={{ duration: 0.2 }}
//               className="absolute top-full right-4 w-64 bg-white/90 backdrop-blur-md shadow-xl rounded-2xl border mt-2 py-3 z-40"
//             >
//               <ul className="flex flex-col gap-2">
//                 <li>
//                   <a
//                     href="/campaigns"
//                     className="flex items-center gap-3 px-4 py-2 text-gray-800 hover:bg-gray-100 rounded-md"
//                   >
//                     <Globe size={18} /> Discover Campaigns
//                   </a>
//                 </li>
//                 <li>
//                   {!user ? (
//                     <button
//                       onClick={() => {
//                         setModalOpen(true);
//                         setMobileMenuOpen(false);
//                       }}
//                       className="flex items-center gap-3 px-4 py-2 text-gray-800 hover:bg-gray-100 rounded-md w-full text-left"
//                     >
//                       <UserIcon size={18} /> Sign In
//                     </button>
//                   ) : (
//                     <button
//                       onClick={handleLogout}
//                       className="flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-gray-100 rounded-md w-full text-left"
//                     >
//                       <UserIcon size={18} /> Logout
//                     </button>
//                   )}
//                 </li>
//               </ul>
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </nav>

//       {/* Login Modal */}
//       <CenteredLoginSignupModal
//         isOpen={modalOpen}
//         onClose={() => setModalOpen(false)}
//         onLoginSuccess={handleLoginSuccess}
//       />
//     </header>
//   );
// };

// export default Navbar;
"use client";

import React, { useState, useEffect, useRef } from "react";
import { Menu, Search, X, Globe, User as UserIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import CenteredLoginSignupModal, { User } from "./LoginModel";

const Navbar: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [hydrated, setHydrated] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const placeholders = [
    "Search campaigns...",
    "Find fundraisers...",
    "Look for causes...",
    "Discover projects...",
  ];
  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  // ✅ Hydration ready
  useEffect(() => {
    setHydrated(true);
  }, []);

  // ✅ Load user from localStorage (only client)
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const stored = localStorage.getItem("user");
      if (stored) {
        setUser(JSON.parse(stored) as User);
      }
    } catch {
      setUser(null);
    }
  }, []);

  // ✅ Placeholder animation
  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // ✅ Close profile dropdown when clicking outside
  useEffect(() => {
    const handler = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ✅ After login
  const handleLoginSuccess = (userData: User) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  // ✅ Logout
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setMobileMenuOpen(false);
    setDropdownOpen(false);
  };

  // ✅ Dashboard redirect
  const dashboardLink =
    user?.role === "admin"
      ? "/admin"
      : user?.role === "fundraiser"
      ? "/fundraiser"
      : "/";

  return (
    <header className="fixed top-0 left-0 w-full z-50 backdrop-blur-lg bg-white/60">
      <nav className="flex items-center justify-between px-4 md:px-24 py-4 relative">
        {/* ======= Left: Login / User ======= */}
        <div className="hidden md:flex items-center gap-4 flex-1">
          {!hydrated ? null : !user ? (
            <button
              onClick={() => setModalOpen(true)}
              className="border border-[#094C3B] text-[#094C3B] px-4 py-1 font-bold rounded-full hover:bg-[#094C3B] hover:text-white transition"
            >
              Login
            </button>
          ) : (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen((prev) => !prev)}
                className="w-10 h-10 rounded-full bg-[#094C3B] text-white flex items-center justify-center font-semibold text-lg"
              >
                {user.name?.charAt(0).toUpperCase()}
              </button>

              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -5 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -5 }}
                    transition={{ duration: 0.2 }}
                    className="absolute mt-3 w-64 bg-white shadow-2xl rounded-2xl border p-4 z-50"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 rounded-full bg-[#094C3B] text-white flex items-center justify-center font-bold text-lg">
                        {user.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-lg">{user.name}</p>
                        <p className="text-gray-500 text-sm">
                          Role: {user.role}
                        </p>
                      </div>
                    </div>

                    <a
                      href={dashboardLink}
                      className="block px-3 py-2 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-100"
                    >
                      Dashboard
                    </a>

                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-3 py-2 text-gray-700 text-sm rounded-lg hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* ===== Logo ===== */}
        <h1 className="font-bold text-lg md:text-xl mx-auto md:mx-0">
          ILLIYY<span>IN</span>
        </h1>

        {/* ===== Search (Desktop) ===== */}
        <div className="flex items-center gap-2 md:gap-4 flex-1 justify-end">
          <div className="hidden md:flex relative items-center border border-[#094C3B] rounded-full overflow-hidden max-w-xs">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={placeholders[placeholderIndex]}
              className="bg-transparent px-4 py-1 w-full focus:outline-none"
            />
            <Search className="absolute right-2 text-[#094C3B] cursor-pointer" />
          </div>
        </div>

        {/* ===== Mobile Menu Button ===== */}
        <button
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          className="border border-[#094C3B] text-[#094C3B] rounded-full p-2 ml-8 hover:bg-[#094C3B] hover:text-white"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        {/* ===== Mobile Dropdown ===== */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full right-4 w-64 bg-white/95 shadow-xl rounded-2xl border mt-2 py-3 z-40"
            >
              <ul className="flex flex-col gap-2">
                <li>
                  <a
                    href="/campaigns"
                    className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 rounded-md"
                  >
                    <Globe size={18} /> Discover Campaigns
                  </a>
                </li>

                {!user ? (
                  <li>
                    <button
                      onClick={() => {
                        setModalOpen(true);
                        setMobileMenuOpen(false);
                      }}
                      className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 rounded-md w-full text-left"
                    >
                      <UserIcon size={18} /> Sign In
                    </button>
                  </li>
                ) : (
                  <>
                    <li>
                      <a
                        href={dashboardLink}
                        className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 rounded-md"
                      >
                        Dashboard
                      </a>
                    </li>
                    <li>
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-gray-100 rounded-md w-full text-left"
                      >
                        <UserIcon size={18} /> Logout
                      </button>
                    </li>
                  </>
                )}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ✅ Login Modal */}
      <CenteredLoginSignupModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </header>
  );
};

export default Navbar;
