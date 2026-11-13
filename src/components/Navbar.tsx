'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Menu, Search, ShoppingBag, Truck, User, X } from 'lucide-react';
import { useCora } from '@/context/CoraContext';
import CartDrawer from '@/components/CartDrawer';
import GlobalSearchModal from '@/components/GlobalSearchModal';

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Our Impact', href: '/#impact' },
  { label: 'Our Product', href: '/products' },
  { label: 'Recipe & AI', href: '/ecosystem' },
  { label: 'Coconut Pickup', href: '/pickup' },
  { label: 'About Us', href: '/about' },
] as const;

function CoconutLogoMark() {
  return (
    <svg
      viewBox="0 0 48 48"
      className="h-8 w-8 sm:h-9 sm:w-9 shrink-0 transition-transform duration-300 group-hover:scale-105"
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
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [prevPathname, setPrevPathname] = useState(pathname);

  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setIsMobileMenuOpen(false);
  }

  useEffect(() => {
    const handleOpenCart = () => setIsCartOpen(true);
    window.addEventListener('cora:open-cart', handleOpenCart);
    return () => window.removeEventListener('cora:open-cart', handleOpenCart);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setIsMobileMenuOpen(false);
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
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
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 md:px-12 lg:px-16 py-3 sm:py-3.5">
          {/* Left: Brand Logo with generous spacing to links */}
          <div className="flex items-center gap-6 lg:gap-14">
            <Link
              href="/"
              className="group flex items-center gap-2.5 sm:gap-3 shrink-0 focus:outline-none"
            >
              <CoconutLogoMark />
              <div className="flex flex-col justify-center leading-tight">
                <span className="font-serif text-lg sm:text-xl font-bold tracking-tight text-[#2C1E18] transition-colors group-hover:text-[#3B5B3D]">
                  CORA
                </span>
                <span className="hidden text-[9.5px] font-semibold uppercase tracking-[0.14em] text-[#6E5C52] sm:block">
                  Circular Food Innovation
                </span>
              </div>
            </Link>

            {/* Center: Editorial Nav Links with Centered Active Pill */}
            <nav
              aria-label="Main navigation"
              className="hidden items-center gap-6 lg:flex"
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

          {/* Right: Search, Track Order, Cart, User Profile, and Mobile Menu Trigger */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            {/* Global Search Button */}
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              aria-label="Cari produk, resep, atau artikel (Cmd+K)"
              title="Pencarian Terpusat (Cmd+K)"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#DDD4C1] bg-white text-[#5C4B42] transition hover:border-[#3B5B3D] hover:bg-[#FAF8F5] hover:text-[#2C1E18] focus:outline-none active:scale-95"
            >
              <Search className="h-4 w-4" />
            </button>

            {/* Quick Action: Lacak Pesanan */}
            <Link
              href="/track"
              title="Lacak Status Pesanan &amp; Resi Pengiriman"
              aria-label="Lacak Status Pesanan &amp; Resi Pengiriman"
              className={`inline-flex h-9 w-9 sm:w-auto sm:px-3.5 items-center justify-center gap-1.5 rounded-full border text-xs font-semibold transition active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#3B5B3D]/30 ${
                pathname === '/track'
                  ? 'border-[#3B5B3D] bg-[#3B5B3D]/10 text-[#3B5B3D]'
                  : 'border-[#DDD4C1] bg-white text-[#5C4B42] hover:border-[#3B5B3D] hover:bg-[#FAF8F5] hover:text-[#2C1E18]'
              }`}
            >
              <Truck className="h-4 w-4 shrink-0 text-[#3B5B3D]" />
              <span className="hidden sm:inline">Lacak Pesanan</span>
            </Link>

            {/* Primary Action: Responsive Cart (compact circle on mobile, pill on desktop) */}
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              aria-label={`Open shopping cart${cartCount > 0 ? `, ${cartCount} items` : ''}`}
              className="relative inline-flex h-9 w-9 sm:w-auto sm:px-4 items-center justify-center gap-2 rounded-full bg-[#3B5B3D] text-xs font-semibold text-white shadow-xs transition hover:bg-[#2F4A31] focus:outline-none focus:ring-2 focus:ring-[#3B5B3D] focus:ring-offset-2 active:scale-95"
            >
              <ShoppingBag className="h-4 w-4 shrink-0 text-white" />
              <span className="hidden sm:inline">Cart</span>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-white px-1 text-[10px] font-bold text-[#3B5B3D] border border-[#3B5B3D] shadow-xs sm:static sm:top-auto sm:right-auto sm:border-0 sm:px-1.5">
                  {cartCount}
                </span>
              )}
            </button>

            {/* User Profile Button */}
            <Link
              href="/profile"
              aria-label="User Profile & Akun Demo"
              title="Profil Pengguna"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#DDD4C1] bg-white text-[#5C4B42] transition hover:border-[#3B5B3D] hover:bg-[#FAF8F5] hover:text-[#2C1E18] focus:outline-none focus:ring-2 focus:ring-[#3B5B3D]/30 active:scale-95"
            >
              <User className="h-4 w-4" />
            </Link>

            {/* Mobile Menu Trigger */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={isMobileMenuOpen}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#DDD4C1] bg-white text-[#2C1E18] transition hover:bg-[#E6E3D8]/60 focus:outline-none focus:ring-2 focus:ring-[#3B5B3D]/30 active:scale-95 lg:hidden"
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
            className="border-t border-[#E5DEC9] bg-[#FAF8F5] shadow-lg lg:hidden"
          >
            <div className="mx-auto max-w-7xl px-4 py-3 space-y-1">
              {/* Highlighted Mobile Track Order Card */}
              <Link
                href="/track"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center justify-between rounded-xl px-4 py-2.5 text-sm transition border mb-2 ${
                  pathname === '/track'
                    ? 'border-[#3B5B3D] bg-[#3B5B3D] font-semibold text-white shadow-xs'
                    : 'border-[#3B5B3D]/25 bg-[#3B5B3D]/8 font-semibold text-[#3B5B3D] hover:bg-[#3B5B3D]/15'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Truck className="h-4 w-4" />
                  <span>Lacak Status Pesanan</span>
                </div>
                <span
                  className={`text-[11px] rounded-full px-2 py-0.5 font-bold shadow-2xs ${
                    pathname === '/track'
                      ? 'bg-white/20 text-white'
                      : 'bg-white text-[#3B5B3D]'
                  }`}
                >
                  Cek Resi →
                </span>
              </Link>

              {NAV_LINKS.map((link) => {
                const active = isActiveLink(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center justify-between rounded-xl px-4 py-2.5 text-sm transition ${
                      active
                        ? 'bg-[#3B5B3D] font-semibold text-white shadow-xs'
                        : 'font-medium text-[#5C4B42] hover:bg-[#E6E3D8]/50 hover:text-[#2C1E18] active:bg-[#E6E3D8]'
                    }`}
                  >
                    <span>{link.label}</span>
                    <ChevronRight
                      className={`h-4 w-4 transition-transform ${
                        active ? 'text-white' : 'text-[#8C7A6B]'
                      }`}
                    />
                  </Link>
                );
              })}

              {/* Mobile Menu Footer Actions */}
              <div className="pt-2.5 mt-2 border-t border-[#E5DEC9]/80 flex items-center justify-between text-xs text-[#6E5C52] px-1">
                <Link
                  href="/profile"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="inline-flex items-center gap-1.5 rounded-lg py-1.5 px-2 font-medium hover:text-[#2C1E18] transition"
                >
                  <User className="h-3.5 w-3.5 text-[#3B5B3D]" />
                  <span>Profil &amp; Akun</span>
                </Link>
                <Link
                  href="/admin"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="inline-flex items-center gap-1.5 rounded-lg py-1.5 px-2 font-medium text-[#3B5B3D] hover:underline transition"
                >
                  <span>Admin Portal →</span>
                </Link>
              </div>
            </div>
          </nav>
        )}
      </header>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <GlobalSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
