import React from "react";
import { Facebook, Instagram, Twitter, Linkedin } from "lucide-react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-br from-[#094C3B] via-[#128b6c] to-[#08655b] text-white">
      {/* Top Section */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {/* Logo + About */}
        <div>
          <h1 className="text-white font-bold text-2xl mb-3">
            Illiyy<span className="text-[#094C3B]-400">in</span>
          </h1>
          <p className="text-gray-100 text-sm leading-relaxed">
            Building digital solutions with passion, creativity, and innovation.
            Empowering businesses for a better tomorrow.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-white font-semibold text-lg mb-3">Quick Links</h3>
          <ul className="space-y-2">
            <li>
              <a href="#" className="hover:text-[#094C3B]-400 transition">
                About Us
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-[#094C3B]-400 transition">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-[#094C3B]-400 transition">
                Terms & Conditions
              </a>
            </li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="text-white font-semibold text-lg mb-3">Support</h3>
          <ul className="space-y-2">
            <li>
              <a href="#" className="hover:text-[#094C3B]-400 transition">
                FAQs
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-[#094C3B]-400 transition">
                Help Center
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-[#094C3B]-400 transition">
                Contact Us
              </a>
            </li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="text-white font-semibold text-lg mb-3">Follow Us</h3>
          <div className="flex space-x-4">
            <a
              href="#"
              className="hover:text-[#094C3B]-400 transition"
              aria-label="Facebook"
            >
              <Facebook size={20} />
            </a>
            <a
              href="#"
              className="hover:text-[#094C3B]-400 transition"
              aria-label="Instagram"
            >
              <Instagram size={20} />
            </a>
            <a
              href="#"
              className="hover:text-[#094C3B]-400 transition"
              aria-label="Twitter"
            >
              <Twitter size={20} />
            </a>
            <a
              href="#"
              className="hover:text-[#094C3B]-400 transition"
              aria-label="LinkedIn"
            >
              <Linkedin size={20} />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700 py-6">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-3 text-sm text-gray-100">
          <p>© {new Date().getFullYear()} Illiyyin. All rights reserved.</p>
          <p>
            Designed & Developed by{" "}
            <span className="text-[#094C3B]-400 font-medium">Webspecia</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
