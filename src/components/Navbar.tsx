'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, ShieldCheck, ShoppingBag, X } from 'lucide-react';
import { useCora } from '@/context/CoraContext';
import CartDrawer from '@/components/CartDrawer';

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Our Impact', href: '/#impact' },
  { label: 'Our Product', href: '/products' },
  { label: 'Recipe & AI', href: '/ecosystem' },
  { label: 'Coconut Pickup', href: '/ecosystem#pickup' },
  { label: 'Cek Pesanan', href: '/orders' },
] as const;

function CoconutLogoMark() {
  return (
    <svg
      viewBox="0 0 48 48"
      className="h-10 w-10 shrink-0"
      fill="none"
      aria-hidden="true"
    >
      {/* Back whole coconut */}
      <circle cx="29" cy="18" r="12" fill="#5B3826" />
      <path
        d="M22 10C26 8 33 9 37 14"
        stroke="#7D523A"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Front split coconut */}
      <circle cx="19" cy="29" r="13" fill="#4B2D1E" />
      <circle cx="19" cy="29" r="10.2" fill="#FAF8F5" />
      <circle cx="19" cy="29" r="6.8" fill="#E6E3D8" />
      {/* Subtle organic leaf accent */}
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
      <header className="sticky top-0 z-40 border-b border-[#E5DEC9] bg-[#FAF8F5]/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          {/* Left: Brand Logo */}
          <Link
            href="/"
            className="group flex items-center gap-2.5 focus:outline-none"
          >
            <CoconutLogoMark />
            <div className="leading-tight">
              <span className="block font-serif text-lg font-bold tracking-tight text-[#2C1E18] group-hover:text-[#3B5B3D] transition-colors sm:text-xl">
                CORA
              </span>
              <span className="block text-[11px] font-medium tracking-wide text-[#6E5C52]">
                Circular Food Innovation
              </span>
            </div>
          </Link>

          {/* Center: Navigation Links (Desktop) */}
          <nav
            aria-label="Navigasi utama"
            className="hidden items-center gap-1 lg:flex"
          >
            {NAV_LINKS.map((link) => {
              const active = isActiveLink(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded-full px-3.5 py-2 text-sm font-medium transition-colors whitespace-nowrap ${
                    active
                      ? 'bg-[#3B5B3D]/10 text-[#3B5B3D] font-semibold'
                      : 'text-[#2C1E18]/80 hover:bg-[#E6E3D8]/60 hover:text-[#2C1E18]'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right: Cart & Admin */}
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              aria-label="Buka keranjang belanja"
              className="relative inline-flex items-center gap-2 rounded-full border border-[#E5DEC9] bg-white px-3.5 py-2 text-sm font-medium text-[#2C1E18] shadow-xs transition hover:border-[#3B5B3D]/40 hover:bg-[#FAF8F5]"
            >
              <ShoppingBag className="h-4 w-4 text-[#3B5B3D]" />
              <span className="hidden sm:inline">Cart</span>
              {cartCount > 0 && (
                <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[#3B5B3D] px-1.5 text-[11px] font-bold text-white">
                  {cartCount}
                </span>
              )}
            </button>

            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 rounded-full border border-[#3B5B3D]/25 bg-[#3B5B3D]/8 px-3.5 py-2 text-xs font-semibold text-[#3B5B3D] transition hover:bg-[#3B5B3D] hover:text-white"
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Admin</span>
            </Link>

            {/* Mobile Hamburger */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              aria-label="Toggle menu navigasi"
              aria-expanded={isMobileMenuOpen}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#E5DEC9] bg-white text-[#2C1E18] transition hover:bg-[#E6E3D8]/60 lg:hidden"
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
            aria-label="Navigasi mobile"
            className="border-t border-[#E5DEC9] bg-[#FAF8F5] px-4 py-3 lg:hidden"
          >
            <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">
              {NAV_LINKS.map((link) => {
                const active = isActiveLink(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`rounded-xl px-3 py-2 text-sm font-medium transition ${
                      active
                        ? 'bg-[#3B5B3D]/12 text-[#3B5B3D] font-semibold'
                        : 'text-[#2C1E18]/85 hover:bg-[#E6E3D8]/70'
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

