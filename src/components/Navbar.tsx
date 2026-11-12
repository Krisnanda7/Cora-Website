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
      <header className="sticky top-0 z-40 border-b border-[#E5DEC9]/90 bg-[#FAF8F5]/92 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6 lg:px-8">
          {/* Left: Brand Logo */}
          <Link
            href="/"
            className="group flex items-center gap-3 focus:outline-none"
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

          {/* Center: Editorial Underline Nav Links */}
          <nav
            aria-label="Navigasi utama"
            className="hidden items-center gap-6 lg:flex"
          >
            {NAV_LINKS.map((link) => {
              const active = isActiveLink(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative py-1.5 text-[13px] tracking-wide transition-colors whitespace-nowrap after:absolute after:right-0 after:bottom-0 after:left-0 after:h-[1.5px] after:origin-left after:bg-[#3B5B3D] after:transition-transform after:duration-300 ${
                    active
                      ? 'font-semibold text-[#2C1E18] after:scale-x-100'
                      : 'font-medium text-[#5C4B42] hover:text-[#2C1E18] after:scale-x-0 hover:after:scale-x-100'
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
              className="relative inline-flex items-center gap-2 rounded-full border border-[#DDD4C1] bg-white px-4 py-2 text-xs font-semibold text-[#2C1E18] transition hover:border-[#3B5B3D]/50 hover:bg-[#FAF8F5]"
            >
              <ShoppingBag className="h-3.5 w-3.5 text-[#3B5B3D]" />
              <span className="hidden sm:inline">Keranjang</span>
              {cartCount > 0 && (
                <span className="inline-flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-[#3B5B3D] px-1.5 text-[10px] font-bold tabular-nums text-white">
                  {cartCount}
                </span>
              )}
            </button>

            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 rounded-full border border-[#2C1E18]/18 bg-transparent px-3.5 py-2 text-xs font-semibold text-[#2C1E18] transition hover:border-[#3B5B3D] hover:bg-[#3B5B3D] hover:text-white"
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Admin</span>
            </Link>

            <button
              type="button"
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              aria-label="Toggle menu navigasi"
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
            aria-label="Navigasi mobile"
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
