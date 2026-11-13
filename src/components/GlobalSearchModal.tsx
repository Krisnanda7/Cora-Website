'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Search,
  Sparkles,
  X,
} from 'lucide-react';
import { useCora } from '@/context/CoraContext';

interface SearchResultItem {
  id: string;
  title: string;
  subtitle: string;
  category: 'Produk CORA' | 'Resep' | 'Artikel Edukasi' | 'Informasi CORA';
  href: string;
}

const STATIC_INFO_ITEMS: SearchResultItem[] = [
  {
    id: 'info-story',
    title: 'Our Story & Latar Belakang CORA',
    subtitle: 'Kisah transformasi limbah ampas kelapa menjadi produk pangan sirkular bernutrisi tinggi.',
    category: 'Informasi CORA',
    href: '/about',
  },
  {
    id: 'info-vision',
    title: 'Visi dan Misi Berkelanjutan',
    subtitle: 'Komitmen CORA dalam mewujudkan zero food waste dan pemberdayaan pemasok lokal.',
    category: 'Informasi CORA',
    href: '/about#vision',
  },
  {
    id: 'info-team',
    title: 'Profil Tim Inovasi CORA',
    subtitle: 'Para inovator muda di balik riset dan pengembangan pangan sirkular.',
    category: 'Informasi CORA',
    href: '/about#team',
  },
  {
    id: 'info-contact',
    title: 'Kontak & Formulir Kerja Sama',
    subtitle: 'Email, WhatsApp, dan kemitraan pasokan ampas kelapa di Denpasar, Bali.',
    category: 'Informasi CORA',
    href: '/about#contact',
  },
  {
    id: 'edu-upcycling',
    title: 'Edukasi: Apa itu Upcycling Pangan?',
    subtitle: 'Memahami ekonomi sirkular dan optimalisasi hasil samping perasan santan kelapa.',
    category: 'Artikel Edukasi',
    href: '/#impact',
  },
  {
    id: 'edu-baking',
    title: 'Edukasi: Panduan Baking dengan Tepung Kelapa',
    subtitle: 'Tips takaran substitusi, rasio cairan, dan rekayasa adonan bebas gluten.',
    category: 'Artikel Edukasi',
    href: '/ecosystem',
  },
  {
    id: 'pickup-system',
    title: 'Coconut Pickup: Layanan Penjemputan Ampas',
    subtitle: 'Alur penjemputan gratis dan kompensasi ekonomis bagi pedagang santan pasar.',
    category: 'Informasi CORA',
    href: '/pickup',
  },
];

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GlobalSearchModal({
  isOpen,
  onClose,
}: GlobalSearchModalProps) {
  const { products, recipes } = useCora();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const searchResults = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return [];

    const productResults: SearchResultItem[] = products
      .filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.subtitle.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      )
      .map((p) => ({
        id: p.id,
        title: p.name,
        subtitle: `${p.subtitle} • Rp ${p.price.toLocaleString('id-ID')}`,
        category: 'Produk CORA',
        href: '/products',
      }));

    const recipeResults: SearchResultItem[] = recipes
      .filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.summary.toLowerCase().includes(q) ||
          r.category.toLowerCase().includes(q)
      )
      .map((r) => ({
        id: r.id,
        title: r.title,
        subtitle: `${r.category} • ${r.prepTime} • ${r.difficulty}`,
        category: 'Resep',
        href: '/ecosystem',
      }));

    const infoResults = STATIC_INFO_ITEMS.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.subtitle.toLowerCase().includes(q)
    );

    return [...productResults, ...recipeResults, ...infoResults];
  }, [searchTerm, products, recipes]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 pt-16 sm:pt-24 p-4 backdrop-blur-xs animate-cora-fade-in"
    >
      <div className="relative w-full max-w-xl overflow-hidden rounded-3xl bg-white border border-[#E5DEC9] shadow-2xl">
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 border-b border-[#F0EAE0] px-4 py-3.5">
          <Search className="h-5 w-5 text-[#8C7A6B] shrink-0" />
          <input
            type="text"
            autoFocus
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari produk CORA, resep, artikel edukasi, atau info..."
            className="flex-1 bg-transparent text-sm text-[#2C1E18] placeholder-[#9C8A7B] focus:outline-none"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              className="p-1 rounded-full text-[#8C7A6B] hover:bg-[#FAF8F5]"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-[#FAF8F5] px-2 py-1 text-xs font-semibold text-[#6E5C52] border border-[#E5DEC9] hover:bg-[#EAE4D6]"
          >
            Esc
          </button>
        </div>

        {/* Results Area */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-2">
          {!searchTerm.trim() ? (
            <div className="py-8 text-center">
              <Sparkles className="mx-auto h-8 w-8 text-[#3B5B3D]/50" />
              <p className="mt-2 text-xs font-semibold text-[#2C1E18]">
                Pencarian Terpusat CORA
              </p>
              <p className="mt-1 text-[11px] text-[#6E5C52]">
                Ketik &ldquo;brownies&rdquo;, &ldquo;pancake&rdquo;, &ldquo;pickup&rdquo;, atau &ldquo;edukasi&rdquo;.
              </p>
            </div>
          ) : searchResults.length === 0 ? (
            <div className="py-8 text-center text-xs text-[#6E5C52]">
              Tidak ada hasil yang cocok dengan &ldquo;{searchTerm}&rdquo;.
            </div>
          ) : (
            <div className="space-y-1.5">
              {searchResults.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={onClose}
                  className="flex items-center justify-between rounded-2xl p-3 hover:bg-[#FAF8F5] transition group border border-transparent hover:border-[#E5DEC9]"
                >
                  <div className="space-y-0.5">
                    <span className="inline-block rounded-md bg-[#3B5B3D]/10 px-2 py-0.5 text-[10px] font-bold text-[#3B5B3D]">
                      {item.category}
                    </span>
                    <h4 className="text-sm font-bold text-[#2C1E18] group-hover:text-[#3B5B3D] transition-colors">
                      {item.title}
                    </h4>
                    <p className="text-xs text-[#6E5C52] line-clamp-1">
                      {item.subtitle}
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-[#8C7A6B] group-hover:text-[#3B5B3D] transition-transform group-hover:translate-x-1 shrink-0 ml-2" />
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
