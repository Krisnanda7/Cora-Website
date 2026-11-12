'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, ShoppingBag, User, X } from 'lucide-react';
import { useCora } from '@/context/CoraContext';
import CartDrawer from '@/components/CartDrawer';

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Our Impact', href: '/#impact' },
  { label: 'Our Product', href: '/products' },
  { label: 'Recipe & AI', href: '/ecosystem' },
  { label: 'Coconut Pickup', href: '/ecosystem#pickup' },
] as const;

function CoconutLogoMark() {
  return (
    <svg
      viewBox="0 0 48 48"
      className="h-9 w-9 shrink-0 transition-transform duration-300 group-hover:scale-105"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="29" cy="18" r="11.5" fill="#5B3826" />
      <path
        d="M22 10.5C26 8.5 32.5 9.5 36.5 14"
        stroke="#7D523A"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <circle cx="19" cy="29" r="12.5" fill="#4B2D1E" />
      <circle cx="19" cy="29" r="9.8" fill="#FAF8F5" />
      <circle cx="19" cy="29" r="6.4" fill="#E6E3D8" />
      <path
        d="M35 28C39 24 44 25 45 30C41 33 36 32 35 28Z"
        fill="#3B5B3D"
      />
    </svg>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const { cartCount } = useCora();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleOpenCart = () => setIsCartOpen(true);
    window.addEventListener('cora:open-cart', handleOpenCart);
    return () => window.removeEventListener('cora:open-cart', handleOpenCart);
  }, []);

  const isActiveLink = (href: string) => {
    if (href === '/') return pathname === '/';
    if (href.startsWith('/#')) return false;
    const baseHref = href.split('#')[0];
    return pathname === baseHref || pathname.startsWith(`${baseHref}/`);
  };

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-[#E5DEC9] bg-[#FAF8F5] transform-gpu">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 md:px-12 lg:px-16 py-3.5">
          {/* Left: Brand Logo with generous spacing to links */}
          <div className="flex items-center gap-10 lg:gap-14">
            <Link
              href="/"
              className="group flex items-center gap-3 shrink-0 focus:outline-none"
            >
              <CoconutLogoMark />
              <div className="leading-none">
                <span className="block font-serif text-xl font-semibold tracking-tight text-[#2C1E18] transition-colors group-hover:text-[#3B5B3D]">
                  CORA
                </span>
                <span className="mt-1 block text-[10px] font-medium uppercase tracking-[0.14em] text-[#6E5C52]">
                  Circular Food Innovation
                </span>
              </div>
            </Link>

            {/* Center: Editorial Nav Links with Centered Active Pill */}
            <nav
              aria-label="Main navigation"
              className="hidden items-center gap-7 lg:flex"
            >
              {NAV_LINKS.map((link) => {
                const active = isActiveLink(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative py-1 text-[13px] tracking-wide transition-colors whitespace-nowrap ${
                      active
                        ? 'font-semibold text-[#2C1E18]'
                        : 'font-medium text-[#5C4B42] hover:text-[#2C1E18]'
                    }`}
                  >
                    <span>{link.label}</span>
                    {active && (
                      <span className="absolute -bottom-1.5 left-1/2 h-[2.5px] w-6 -translate-x-1/2 rounded-full bg-[#3B5B3D]" />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right: Cart as Primary Action & Discrete Admin */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Primary Action: Contrasting Solid Cart Pill */}
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              aria-label="Open shopping cart"
              className="relative inline-flex items-center gap-2 rounded-full bg-[#3B5B3D] px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-[#2F4A31]"
            >
              <ShoppingBag className="h-3.5 w-3.5 text-white" />
              <span>Cart</span>
              {cartCount > 0 && (
                <span className="inline-flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-white px-1.5 text-[10px] font-bold tabular-nums text-[#3B5B3D]">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Discrete Admin Icon Button */}
            <Link
              href="/admin"
              aria-label="Admin Portal"
              title="Admin Portal"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#DDD4C1] bg-white text-[#5C4B42] transition hover:border-[#3B5B3D] hover:bg-[#FAF8F5] hover:text-[#2C1E18]"
            >
              <User className="h-4 w-4" />
            </Link>

            {/* Mobile Menu Trigger */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              aria-label="Toggle navigation menu"
              aria-expanded={isMobileMenuOpen}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#DDD4C1] bg-white text-[#2C1E18] transition hover:bg-[#E6E3D8]/60 lg:hidden"
            >
              {isMobileMenuOpen ? (
                <X className="h-4 w-4" />
              ) : (
                <Menu className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <nav
            aria-label="Mobile navigation"
            className="animate-cora-fade-in border-t border-[#E5DEC9] bg-[#FAF8F5] px-4 py-3 lg:hidden"
          >
            <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">
              {NAV_LINKS.map((link) => {
                const active = isActiveLink(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`rounded-lg px-3 py-2 text-xs font-medium transition ${
                      active
                        ? 'bg-[#3B5B3D]/10 text-[#3B5B3D] font-semibold'
                        : 'text-[#5C4B42] hover:bg-[#E6E3D8]/60 hover:text-[#2C1E18]'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </nav>
        )}
      </header>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
