"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  // Toggle states for mobile submenus
  const [mobileMoviesOpen, setMobileMoviesOpen] = useState(false);
  const [mobileTvOpen, setMobileTvOpen] = useState(false);
  const pathname = usePathname();

  const subOptions = [
    { name: "Popular", slug: "popular" },
    { name: "Now Playing", slug: "now-playing" },
    { name: "Upcoming", slug: "upcoming" },
    { name: "Top Rated", slug: "top-rated" },
  ];

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Movies", href: "/movie", subMenu: subOptions },
    { name: "TV Shows", href: "/tv-shows", subMenu: subOptions },
    { name: "Wishlist", href: "/wishlist" },
    { name: "Favourites", href: "/favourites" },
  ];

  return (
    <nav className="bg-slate-900 text-white sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo / Name */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-xl font-bold tracking-wide bg-gradient-to-r from-red-500 to-amber-500 bg-clip-text text-transparent">
              Movies&Shows
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              {navLinks.map((link) => {
                const isActive = pathname === link.href || (link.subMenu && pathname.startsWith(link.href));
                
                if (link.subMenu) {
                  return (
                    <div key={link.name} className="relative group py-2">
                      <Link
                        href={link.href}
                        className={`px-3 py-2 rounded-md text-sm font-medium inline-flex items-center space-x-1 transition-colors duration-200 ${
                          isActive
                            ? "text-amber-500 font-semibold"
                            : "text-gray-300 hover:text-white"
                        }`}
                      >
                        <span>{link.name}</span>
                        <svg className="w-4 h-4 ml-0.5 mt-0.5 transition-transform duration-200 group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </Link>

                      {/* Dropdown Menu Overlay Panel */}
                      <div className="absolute left-0 top-full mt-1 w-48 bg-white text-slate-900 rounded-md shadow-xl opacity-0 scale-95 pointer-events-none group-hover:opacity-100 group-hover:scale-100 group-hover:pointer-events-auto transition-all duration-200 ease-out z-50 border border-slate-100 origin-top-left">
                        <div className="py-1">
                          {link.subMenu.map((sub) => {
                            const subHref = `${link.href}/${sub.slug}`;
                            const isSubActive = pathname === subHref;
                            return (
                              <Link
                                key={sub.slug}
                                href={subHref}
                                className={`block px-4 py-2.5 text-sm font-medium transition-colors ${
                                  isSubActive 
                                    ? "bg-slate-100 text-amber-600 font-semibold" 
                                    : "hover:bg-slate-50 text-slate-700 hover:text-slate-900"
                                }`}
                              >
                                {sub.name}
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  );
                }

                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                      isActive
                        ? "text-amber-500 font-semibold"
                        : "text-gray-300 hover:text-white hover:bg-slate-800"
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-slate-800 focus:outline-none"
              aria-label="Toggle Menu"
            >
              <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isOpen && (
        <div className="md:hidden bg-slate-900 border-t border-slate-800 transition-all">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;

              if (link.subMenu) {
                const isMovies = link.name === "Movies";
                const isSubMenuOpen = isMovies ? mobileMoviesOpen : mobileTvOpen;
                const setSubMenuOpen = isMovies ? setMobileMoviesOpen : setMobileTvOpen;

                return (
                  <div key={link.name} className="space-y-1">
                    <button
                      onClick={() => setSubMenuOpen(!isSubMenuOpen)}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-slate-800 hover:text-white"
                    >
                      <span>{link.name}</span>
                      <svg className={`w-4 h-4 transition-transform duration-200 ${isSubMenuOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    
                    {/* Collapsible Mobile Sublinks Container */}
                    {isSubMenuOpen && (
                      <div className="pl-4 space-y-1 bg-slate-950/40 rounded-md py-1">
                        {link.subMenu.map((sub) => {
                          const subHref = `${link.href}/${sub.slug}`;
                          const isSubActive = pathname === subHref;
                          return (
                            <Link
                              key={sub.slug}
                              href={subHref}
                              onClick={() => setIsOpen(false)}
                              className={`block px-3 py-2 rounded-md text-sm font-medium ${
                                isSubActive
                                  ? "text-amber-500 font-semibold"
                                  : "text-gray-400 hover:text-white hover:bg-slate-800"
                              }`}
                            >
                              {sub.name}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    isActive
                      ? "bg-slate-800 text-amber-500"
                      : "text-gray-300 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
}