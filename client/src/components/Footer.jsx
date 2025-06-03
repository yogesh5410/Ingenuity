import React from "react";
import { Github, Linkedin, Instagram, Mail, ArrowUp } from "lucide-react";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative bg-gradient-to-r from-[#0f2027] via-[#203a43] to-[#2c5364] dark:from-[#111827] dark:via-[#1f2937] dark:to-[#111827] text-white py-4 px-6 shadow-inner transition-all duration-300 ease-in-out">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">

        {/* Club Info */}
        <div className="text-center md:text-left">
          <h2 className="text-2xl font-bold tracking-wide text-cyan-300 dark:text-cyan-400">Ingenuity</h2>
          <p className="text-base text-gray-300 dark:text-gray-400">Coding Club • IIT Bhilai</p>
        </div>

        {/* Email */}
        <div className="flex items-center gap-2 text-gray-300 dark:text-gray-400 text-base">
          <Mail size={18} />
          <a
            href="mailto:ingenuity@iitbhilai.ac.in"
            className="hover:text-cyan-400 dark:hover:text-cyan-300 transition text-base"
          >
            ingenuity@iitbhilai.ac.in
          </a>
        </div>

        {/* Social Links */}
        <div className="flex gap-6">
          <a
            href="https://linkedin.com/in/your-profile"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-400 dark:hover:text-blue-500 transition duration-200 transform hover:scale-110"
          >
            <Linkedin size={24} />
          </a>
          <a
            href="https://github.com/your-org"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-300 dark:hover:text-gray-200 transition duration-200 transform hover:scale-110"
          >
            <Github size={24} />
          </a>
          <a
            href="https://instagram.com/your-page"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-pink-400 dark:hover:text-pink-500 transition duration-200 transform hover:scale-110"
          >
            <Instagram size={24} />
          </a>
        </div>
      </div>

      {/* Bottom Note */}
      <div className="mt-3 text-center text-sm text-gray-400 dark:text-gray-500">
        Made with <span className="text-red-400 dark:text-red-500">❤️</span> by Ingenuity Team
      </div>
      <div className="text-center text-sm text-gray-400 dark:text-gray-500">
        © {new Date().getFullYear()} Ingenuity, IIT Bhilai. All rights reserved.
      </div>

      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className="absolute right-4 bottom-4 p-3 rounded-full bg-cyan-500 dark:bg-cyan-600 text-white hover:bg-cyan-400 dark:hover:bg-cyan-500 transition duration-300 shadow-md hover:scale-105"
        title="Scroll to top"
      >
        <ArrowUp size={20} />
      </button>
    </footer>
  );
}
