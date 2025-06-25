// File: src/components/EmployerHeader.tsx

import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

const navLinks = [
  { href: "/post-job", label: "Post a Job" },
  { href: "/products", label: "Products" },
  { href: "/resources", label: "Resources" },
];

const EmployerHeader = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <header className="bg-[#2d2d2d] text-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex-shrink-0">
              <Link to="/" className="text-2xl font-bold tracking-wider">
                TeacherConnect
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`px-4 py-2 text-sm rounded-full transition-colors ${
                    currentPath === link.href
                      ? "font-semibold text-white bg-white/10"
                      : "font-medium text-gray-300 hover:bg-white/10"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="hidden md:flex items-center">
              {/* FIX: Using <Link> component for "For Jobseekers" */}
              <Link
                to="/"
                className="text-sm font-medium text-gray-300 hover:text-white"
              >
                For Jobseekers
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-300 hover:text-white p-2"
              >
                {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-[#2d2d2d] z-40 flex flex-col items-center justify-center pt-16">
          <nav className="flex flex-col items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setIsMenuOpen(false)}
                className={`text-2xl rounded-full transition-colors ${
                  currentPath === link.href
                    ? "font-bold text-white"
                    : "font-medium text-gray-400 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <hr className="w-24 border-gray-700 my-4" />
            {/* FIX: Using <Link> component for mobile "For Jobseekers" */}
            <Link
              to="/"
              onClick={() => setIsMenuOpen(false)}
              className="text-lg font-medium text-gray-300 hover:text-white"
            >
              For Jobseekers
            </Link>
          </nav>
        </div>
      )}
    </>
  );
};

export default EmployerHeader;
