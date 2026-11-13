'use client';

import React, { useMemo, useState } from 'react';
import Image from 'next/image';
import {
  Check,
  CheckCircle2,
  Clock,
  ExternalLink,
  Phone,
  ShieldCheck,
  Truck,
  Users,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useCora } from '@/context/CoraContext';
import type { PickupRequestStatus } from '@/types/cora';

function getPickupBadge(status: PickupRequestStatus): {
  label: string;
  className: string;
} {
  switch (status) {
    case 'REQUEST_SUBMITTED':
    case 'PENDING':
      return {
        label: 'Request Submitted',
        className: 'bg-amber-50 text-amber-800 ring-1 ring-amber-200',
      };
    case 'REQUEST_CONFIRMED':
    case 'SCHEDULED':
      return {
        label: 'Request Confirmed',
        className: 'bg-sky-50 text-sky-800 ring-1 ring-sky-200',
      };
    case 'ON_THE_WAY':
      return {
        label: 'Driver On the Way',
        className: 'bg-purple-50 text-purple-800 ring-1 ring-purple-200',
      };
    case 'PICKED_UP':
      return {
        label: 'Residue Picked Up',
        className: 'bg-teal-50 text-teal-800 ring-1 ring-teal-200',
      };
    case 'COMPLETED':
    default:
      return {
        label: 'Completed & Upcycled',
        className: 'bg-[#3B5B3D]/12 text-[#3B5B3D] ring-1 ring-[#3B5B3D]/25',
      };
  }
}

export default function CoconutPickupPage() {
  const {
    suppliers,
    pickupRequests,
    userProfile,
    submitPickupRequest,
    registerSupplier,
  } = useCora();

  // Active Tab
  const [activeTab, setActiveTab] = useState<
    'request' | 'register' | 'tracking' | 'guidelines'
  >('request');

  // Tab 1: Request Form
  const [pickupSupplierName, setPickupSupplierName] = useState(
    userProfile.name || ''
  );
  const [pickupPhone, setPickupPhone] = useState(userProfile.phone || '');
  const [pickupLocation, setPickupLocation] = useState('');
  const [pickupKg, setPickupKg] = useState('');
  const [pickupDate, setPickupDate] = useState('');
  const [pickupTime, setPickupTime] = useState('08:00 - 10:00 WITA (Pagi)');
  const [pickupNotes, setPickupNotes] = useState('');
  const [pickupSuccessMsg, setPickupSuccessMsg] = useState<string | null>(null);

  // Tab 2: Register Supplier Form
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regLocation, setRegLocation] = useState('');
  const [regBusinessType, setRegBusinessType] = useState('Kios Santan Pasar');
  const [regEstimatedKg, setRegEstimatedKg] = useState('');
  const [regFrequency, setRegFrequency] = useState('Setiap Hari');
  const [regSuccessMsg, setRegSuccessMsg] = useState<string | null>(null);

  // Total Residue Picked Up
  const totalCompletedKg = useMemo(
    () =>
      pickupRequests
        .filter((r) => r.status === 'COMPLETED')
        .reduce((sum, r) => sum + r.estimatedKg, 0),
    [pickupRequests]
  );

  const handlePickupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pickupSupplierName || !pickupPhone || !pickupLocation || !pickupKg || !pickupDate) {
      return;
    }

    submitPickupRequest({
      supplierName: pickupSupplierName.trim(),
      phone: pickupPhone.trim(),
      location: pickupLocation.trim(),
      estimatedKg: Number(pickupKg) || 10,
      preferredDate: pickupDate,
      preferredTime: pickupTime,
      notes: pickupNotes.trim() || undefined,
    });

    setPickupSuccessMsg(
      `Permintaan penjemputan ${pickupKg} kg ampas kelapa berhasil diajukan! Tim CORA akan menghubungi via WhatsApp.`
    );
    setPickupKg('');
    setPickupNotes('');
    setActiveTab('tracking');

    window.setTimeout(() => {
      setPickupSuccessMsg(null);
    }, 6000);
  };

  const handleRegisterSupplierSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName || !regPhone || !regLocation || !regEstimatedKg) {
      return;
    }

    registerSupplier({
      name: regName.trim(),
      phone: regPhone.trim(),
      businessLocation: regLocation.trim(),
      businessType: regBusinessType,
      estimatedKg: Number(regEstimatedKg) || 20,
      productionFrequency: regFrequency,
    });

    setRegSuccessMsg(
      `Selamat! Usaha "${regName}" berhasil didaftarkan sebagai mitra pemasok CORA.`
    );
    setRegName('');
    setRegPhone('');
    setRegLocation('');
    setRegEstimatedKg('');
    setActiveTab('tracking');

    window.setTimeout(() => {
      setRegSuccessMsg(null);
    }, 6000);
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#FAF8F5] text-[#2C1E18]">
      <Navbar />

      <main className="flex-1">
        {/* =========================================================================
            1. HERO SECTION WITH NATURAL COCONUT BG & DARK GRADIENT OVERLAY
           ========================================================================= */}
        <section className="relative overflow-hidden bg-[#121B13] text-[#FAF8F5]">
          <div className="pointer-events-none absolute inset-0 z-0 select-none transform-gpu">
            <Image
              src="/images/hero/hero.jpg"
              alt="Natural raw coconut background"
              fill
              priority
              className="object-cover object-center brightness-35 contrast-100"
            />
          </div>

          <div
            className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-r from-black/85 via-black/60 to-black/35"
            aria-hidden="true"
          />

          <div className="relative z-20 mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
            <div className="animate-cora-fade-up grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center">
              {/* Left Column: Heading & Tagline */}
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center gap-2.5">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#3B5B3D]/30 border border-[#86C975]/40 px-3 py-1 text-xs font-semibold text-[#86C975]">
                    <Truck className="h-3.5 w-3.5" />
                    Circular Logistics Network
                  </span>
                  <span className="text-xs text-[#E2DACF] font-medium hidden sm:inline">
                    • 100% Zero Food Waste
                  </span>
                </div>

                <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#FAF8F5] leading-tight">
                  Coconut Pickup &amp; Supplier Ecosystem
                </h1>

                <p className="text-sm sm:text-base leading-relaxed text-[#E2DACF] max-w-2xl">
                  Solusi penjemputan logistik terpadu untuk produsen santan,
                  pedagang kelapa parut, dan industri kuliner lokal. Kami
                  mengubah ampas kelapa segar yang biasanya terbuang menjadi
                  tepung bernutrisi tinggi dan bernilai ekonomi sirkular.
                </p>

                {/* Hero Action CTA Buttons */}
                <div className="flex flex-wrap items-center gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('request');
                      const el = document.getElementById('pickup-hub');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="inline-flex items-center gap-2 rounded-full bg-[#4E9A34] px-5 py-3 text-xs font-bold text-white shadow-sm transition hover:bg-[#3F8129]"
                  >
                    <Truck className="h-4 w-4" />
                    Ajukan Penjemputan
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('register');
                      const el = document.getElementById('pickup-hub');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-5 py-3 text-xs font-bold text-white backdrop-blur-md transition hover:bg-white/20"
                  >
                    <Users className="h-4 w-4 text-[#86C975]" />
                    Daftar Jadi Mitra
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('tracking');
                      const el = document.getElementById('pickup-hub');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/30 px-4 py-3 text-xs font-semibold text-[#E2DACF] hover:text-white transition"
                  >
                    <Clock className="h-4 w-4" />
                    Lacak Status Penjemputan
                  </button>
                </div>
              </div>

              {/* Right Column: Hero KPI Pill Cards */}
              <div className="lg:col-span-5 grid grid-cols-2 gap-3.5">
                <div className="rounded-2xl border border-white/15 bg-white/10 p-4.5 backdrop-blur-md">
                  <p className="text-[11px] font-semibold text-[#86C975] uppercase tracking-wider">
                    Mitra Terdaftar
                  </p>
                  <p className="mt-1 font-serif text-3xl font-extrabold text-white">
                    {suppliers.length}
                  </p>
                  <p className="mt-1 text-[11px] text-[#D0C5B5]">
                    Kios santan &amp; pedagang aktif
                  </p>
                </div>

                <div className="rounded-2xl border border-white/15 bg-white/10 p-4.5 backdrop-blur-md">
                  <p className="text-[11px] font-semibold text-[#86C975] uppercase tracking-wider">
                    Ampas Terolah
                  </p>
                  <p className="mt-1 font-serif text-3xl font-extrabold text-white">
                    {totalCompletedKg + 280}{' '}
                    <span className="text-sm font-sans font-medium text-[#D0C5B5]">
                      kg
                    </span>
                  </p>
                  <p className="mt-1 text-[11px] text-[#D0C5B5]">
                    Diselamatkan dari pembuangan
                  </p>
                </div>

                <div className="rounded-2xl border border-white/15 bg-white/10 p-4.5 backdrop-blur-md">
                  <p className="text-[11px] font-semibold text-[#86C975] uppercase tracking-wider">
                    Jangkauan Rute
                  </p>
                  <p className="mt-1 font-serif text-2xl font-bold text-white">
                    Bali Area
                  </p>
                  <p className="mt-1 text-[11px] text-[#D0C5B5]">
                    Denpasar, Badung, Gianyar
                  </p>
                </div>

                <div className="rounded-2xl border border-white/15 bg-white/10 p-4.5 backdrop-blur-md">
                  <p className="text-[11px] font-semibold text-[#86C975] uppercase tracking-wider">
                    Biaya Penjemputan
                  </p>
                  <p className="mt-1 font-serif text-2xl font-bold text-[#86C975]">
                    Gratis + Reward
                  </p>
                  <p className="mt-1 text-[11px] text-[#D0C5B5]">
                    Insentif rupiah per kg ampas
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            2. 4-STEP ALUR LOGISTIK PENJEMPUTAN (HOW IT WORKS)
           ========================================================================= */}
        <section className="border-b border-[#E5DEC9] bg-[#F2EFE8]/70 py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#3B5B3D]">
                Alur Kerja Mudah
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#2C1E18]">
                Bagaimana Sistem Coconut Pickup Bekerja?
              </h2>
              <p className="text-xs sm:text-sm text-[#6E5C52]">
                Proses penjemputan higienis dan transparan dalam 4 tahap teratur.
              </p>
            </div>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="rounded-2xl border border-[#E5DEC9] bg-white p-5 shadow-2xs space-y-2">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-[#3B5B3D] text-white text-xs font-bold font-mono">
                  01
                </span>
                <h3 className="text-sm font-bold text-[#2C1E18]">
                  Ajukan Permintaan
                </h3>
                <p className="text-xs leading-relaxed text-[#6E5C52]">
                  Mitra memasukkan estimasi berat ampas kelapa, lokasi usaha, dan
                  pilihan tanggal serta waktu penjemputan melalui website.
                </p>
              </div>

              <div className="rounded-2xl border border-[#E5DEC9] bg-white p-5 shadow-2xs space-y-2">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-[#3B5B3D] text-white text-xs font-bold font-mono">
                  02
                </span>
                <h3 className="text-sm font-bold text-[#2C1E18]">
                  Konfirmasi Jadwal
                </h3>
                <p className="text-xs leading-relaxed text-[#6E5C52]">
                  Tim operasional CORA memverifikasi pengajuan dan menjadwalkan
                  rute kurir penjemputan terdekat ke lokasi kios Anda.
                </p>
              </div>

              <div className="rounded-2xl border border-[#E5DEC9] bg-white p-5 shadow-2xs space-y-2">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-[#3B5B3D] text-white text-xs font-bold font-mono">
                  03
                </span>
                <h3 className="text-sm font-bold text-[#2C1E18]">
                  Penjemputan Higienis
                </h3>
                <p className="text-xs leading-relaxed text-[#6E5C52]">
                  Driver CORA tiba di lokasi dengan wadah tertutup food-grade,
                  menimbang ampas secara transparan, dan memberikan tanda terima.
                </p>
              </div>

              <div className="rounded-2xl border border-[#E5DEC9] bg-white p-5 shadow-2xs space-y-2">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-[#3B5B3D] text-white text-xs font-bold font-mono">
                  04
                </span>
                <h3 className="text-sm font-bold text-[#2C1E18]">
                  Diolah Menjadi Tepung
                </h3>
                <p className="text-xs leading-relaxed text-[#6E5C52]">
                  Ampas dibawa ke fasilitas pengolahan CORA untuk proses
                  pengeringan higienis dan penggilingan menjadi tepung bernutrisi.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            3. MAIN INTERACTIVE HUB (4 TABS)
           ========================================================================= */}
        <section id="pickup-hub" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          {/* Tabs Navigation Switcher */}
          <div className="flex flex-wrap justify-center gap-2">
            {[
              { id: 'request', label: 'Ajukan Penjemputan', icon: Truck },
              { id: 'register', label: 'Daftar Mitra Pemasok', icon: Users },
              {
                id: 'tracking',
                label: 'Status & Dashboard Pemasok',
                icon: Clock,
              },
              {
                id: 'guidelines',
                label: 'Panduan & Standar Mutu',
                icon: ShieldCheck,
              },
            ].map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() =>
                    setActiveTab(
                      tab.id as
                        | 'request'
                        | 'register'
                        | 'tracking'
                        | 'guidelines'
                    )
                  }
                  className={`inline-flex items-center gap-2 rounded-full px-5 py-3 text-xs font-bold transition ${
                    active
                      ? 'bg-[#3B5B3D] text-white shadow-sm'
                      : 'bg-white border border-[#E5DEC9] text-[#5C4B42] hover:bg-[#FAF8F5]'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* TAB 1: PICKUP REQUEST FORM */}
          {activeTab === 'request' && (
            <div className="mt-10 rounded-3xl border border-[#E5DEC9] bg-white p-6 sm:p-10 shadow-xs max-w-2xl mx-auto">
              <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#3B5B3D]/10 text-[#3B5B3D]">
                  <Truck className="h-4 w-4" />
                </span>
                <div>
                  <h3 className="font-serif text-2xl font-bold text-[#2C1E18]">
                    Formulir Permintaan Penjemputan (Pickup Request)
                  </h3>
                  <p className="text-xs text-[#6E5C52]">
                    Ajukan jadwal penjemputan ampas kelapa. Tim logistik CORA
                    akan menghubungi Anda via WhatsApp untuk konfirmasi kedatangan.
                  </p>
                </div>
              </div>

              {pickupSuccessMsg && (
                <div className="mt-5 rounded-2xl bg-[#4E9A34]/10 border border-[#4E9A34]/30 p-4 text-xs font-medium text-[#2F611F] flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  <span>{pickupSuccessMsg}</span>
                </div>
              )}

              <form onSubmit={handlePickupSubmit} className="mt-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#2C1E18]">
                    Nama Pemasok / Usaha *
                  </label>
                  <input
                    type="text"
                    required
                    value={pickupSupplierName}
                    onChange={(e) => setPickupSupplierName(e.target.value)}
                    placeholder="misal: Kelapa Segar Barokah / Pak Wayan"
                    className="mt-1 w-full rounded-xl border border-[#E5DEC9] bg-[#FAF8F5] p-3 text-xs text-[#2C1E18] focus:border-[#3B5B3D] focus:bg-white focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#2C1E18]">
                      Nomor WhatsApp *
                    </label>
                    <input
                      type="tel"
                      required
                      value={pickupPhone}
                      onChange={(e) => setPickupPhone(e.target.value)}
                      placeholder="081234567890"
                      className="mt-1 w-full rounded-xl border border-[#E5DEC9] bg-[#FAF8F5] p-3 text-xs text-[#2C1E18] focus:border-[#3B5B3D] focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#2C1E18]">
                      Jumlah Ampas Kelapa (kg) *
                    </label>
                    <input
                      type="number"
                      required
                      min={10}
                      value={pickupKg}
                      onChange={(e) => setPickupKg(e.target.value)}
                      placeholder="Minimal 10 kg"
                      className="mt-1 w-full rounded-xl border border-[#E5DEC9] bg-[#FAF8F5] p-3 text-xs text-[#2C1E18] focus:border-[#3B5B3D] focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#2C1E18]">
                    Lokasi / Alamat Lengkap Penjemputan *
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={pickupLocation}
                    onChange={(e) => setPickupLocation(e.target.value)}
                    placeholder="Alamat kios/pabrik santan lengkap beserta patokan..."
                    className="mt-1 w-full rounded-xl border border-[#E5DEC9] bg-[#FAF8F5] p-3 text-xs text-[#2C1E18] focus:border-[#3B5B3D] focus:bg-white focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#2C1E18]">
                      Tanggal Penjemputan *
                    </label>
                    <input
                      type="date"
                      required
                      value={pickupDate}
                      onChange={(e) => setPickupDate(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-[#E5DEC9] bg-[#FAF8F5] p-3 text-xs text-[#2C1E18] focus:border-[#3B5B3D] focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#2C1E18]">
                      Pilihan Waktu Penjemputan
                    </label>
                    <select
                      value={pickupTime}
                      onChange={(e) => setPickupTime(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-[#E5DEC9] bg-[#FAF8F5] p-3 text-xs text-[#2C1E18] focus:border-[#3B5B3D] focus:bg-white focus:outline-none"
                    >
                      <option>08:00 - 10:00 WITA (Pagi)</option>
                      <option>11:00 - 13:00 WITA (Siang)</option>
                      <option>15:00 - 17:00 WITA (Sore)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#2C1E18]">
                    Catatan Khusus untuk Kurir (Opsional)
                  </label>
                  <input
                    type="text"
                    value={pickupNotes}
                    onChange={(e) => setPickupNotes(e.target.value)}
                    placeholder="misal: Tong ampas warna biru di dekat mesin peras"
                    className="mt-1 w-full rounded-xl border border-[#E5DEC9] bg-[#FAF8F5] p-3 text-xs text-[#2C1E18] focus:border-[#3B5B3D] focus:bg-white focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-full bg-[#3B5B3D] py-3.5 text-xs font-bold text-white shadow-sm hover:bg-[#2F4A31] transition"
                >
                  Kirim Permintaan Penjemputan Ampas
                </button>
              </form>
            </div>
          )}

          {/* TAB 2: BECOME OUR SUPPLIER FORM */}
          {activeTab === 'register' && (
            <div className="mt-10 rounded-3xl border border-[#E5DEC9] bg-white p-6 sm:p-10 shadow-xs max-w-2xl mx-auto">
              <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#4E9A34]/15 text-[#4E9A34]">
                  <Users className="h-4 w-4" />
                </span>
                <div>
                  <h3 className="font-serif text-2xl font-bold text-[#2C1E18]">
                    Daftar Menjadi Mitra Pemasok Resmi
                  </h3>
                  <p className="text-xs text-[#6E5C52]">
                    Dapatkan jadwal penjemputan berkala tanpa repot, kompensasi
                    finansial tambahan, dan sertifikat kemitraan sirkular.
                  </p>
                </div>
              </div>

              {regSuccessMsg && (
                <div className="mt-5 rounded-2xl bg-[#4E9A34]/10 border border-[#4E9A34]/30 p-4 text-xs font-medium text-[#2F611F] flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  <span>{regSuccessMsg}</span>
                </div>
              )}

              <form onSubmit={handleRegisterSupplierSubmit} className="mt-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#2C1E18]">
                      Nama Pemilik / Penanggung Jawab *
                    </label>
                    <input
                      type="text"
                      required
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="misal: Pak Wayan / Bu Dewi"
                      className="mt-1 w-full rounded-xl border border-[#E5DEC9] bg-[#FAF8F5] p-3 text-xs text-[#2C1E18] focus:border-[#3B5B3D] focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#2C1E18]">
                      Nomor WhatsApp Aktif *
                    </label>
                    <input
                      type="tel"
                      required
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      placeholder="081234567890"
                      className="mt-1 w-full rounded-xl border border-[#E5DEC9] bg-[#FAF8F5] p-3 text-xs text-[#2C1E18] focus:border-[#3B5B3D] focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#2C1E18]">
                    Alamat Lengkap Kios / Pabrik Usaha *
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={regLocation}
                    onChange={(e) => setRegLocation(e.target.value)}
                    placeholder="misal: Pasar Kumbasari Kios No. 12, Jl. Gajah Mada, Denpasar"
                    className="mt-1 w-full rounded-xl border border-[#E5DEC9] bg-[#FAF8F5] p-3 text-xs text-[#2C1E18] focus:border-[#3B5B3D] focus:bg-white focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#2C1E18]">
                      Jenis Usaha
                    </label>
                    <select
                      value={regBusinessType}
                      onChange={(e) => setRegBusinessType(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-[#E5DEC9] bg-[#FAF8F5] p-3 text-xs text-[#2C1E18] focus:border-[#3B5B3D] focus:bg-white focus:outline-none"
                    >
                      <option>Kios Santan Pasar</option>
                      <option>Pengolahan Kelapa Parut</option>
                      <option>Industri Kue &amp; Santan</option>
                      <option>Rumah Makan / Katering</option>
                      <option>Kedai Kopi / Kafe</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#2C1E18]">
                      Estimasi Ampas (kg/minggu) *
                    </label>
                    <input
                      type="number"
                      required
                      min={10}
                      value={regEstimatedKg}
                      onChange={(e) => setRegEstimatedKg(e.target.value)}
                      placeholder="misal: 80"
                      className="mt-1 w-full rounded-xl border border-[#E5DEC9] bg-[#FAF8F5] p-3 text-xs text-[#2C1E18] focus:border-[#3B5B3D] focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#2C1E18]">
                      Frekuensi Produksi
                    </label>
                    <select
                      value={regFrequency}
                      onChange={(e) => setRegFrequency(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-[#E5DEC9] bg-[#FAF8F5] p-3 text-xs text-[#2C1E18] focus:border-[#3B5B3D] focus:bg-white focus:outline-none"
                    >
                      <option>Setiap Hari</option>
                      <option>3-4x Seminggu</option>
                      <option>1-2x Seminggu</option>
                      <option>Berdasarkan Pesanan</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full rounded-full bg-[#4E9A34] py-3.5 text-xs font-bold text-white shadow-sm hover:bg-[#3F8129] transition"
                >
                  Daftarkan Usaha Sebagai Mitra Pemasok
                </button>
              </form>
            </div>
          )}

          {/* TAB 3: SUPPLIER DASHBOARD & LIVE TRACKING */}
          {activeTab === 'tracking' && (
            <div className="mt-10 space-y-6 max-w-4xl mx-auto">
              {/* Dashboard Metrics Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="rounded-2xl bg-white p-5 border border-[#E5DEC9] shadow-2xs">
                  <span className="text-[11px] font-bold text-[#3B5B3D] uppercase">
                    Mitra Terdaftar
                  </span>
                  <p className="mt-2 font-serif text-3xl font-bold text-[#2C1E18]">
                    {suppliers.length}{' '}
                    <span className="text-xs font-normal text-[#6E5C52]">
                      kios/usaha
                    </span>
                  </p>
                  <p className="mt-1 text-[11px] text-[#8C7A6B]">
                    Aktif bermitra dalam jaringan CORA
                  </p>
                </div>

                <div className="rounded-2xl bg-white p-5 border border-[#E5DEC9] shadow-2xs">
                  <span className="text-[11px] font-bold text-[#3B5B3D] uppercase">
                    Total Ampas Diserahkan
                  </span>
                  <p className="mt-2 font-serif text-3xl font-bold text-[#2C1E18]">
                    {totalCompletedKg + 280}{' '}
                    <span className="text-xs font-normal text-[#6E5C52]">kg</span>
                  </p>
                  <p className="mt-1 text-[11px] text-[#8C7A6B]">
                    Telah dijemput dan diproses jadi tepung
                  </p>
                </div>

                <div className="rounded-2xl bg-white p-5 border border-[#E5DEC9] shadow-2xs">
                  <span className="text-[11px] font-bold text-[#3B5B3D] uppercase">
                    Pengurangan Emisi Karbon
                  </span>
                  <p className="mt-2 font-serif text-3xl font-bold text-[#2C1E18]">
                    ~{((totalCompletedKg + 280) * 2.38).toFixed(0)}{' '}
                    <span className="text-xs font-normal text-[#6E5C52]">
                      kg CO₂e
                    </span>
                  </p>
                  <p className="mt-1 text-[11px] text-[#8C7A6B]">
                    Mitigasi gas metana dari TPA
                  </p>
                </div>
              </div>

              {/* 5-Status Alur Tracker Card */}
              <div className="rounded-3xl border border-[#E5DEC9] bg-white p-6 sm:p-8 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#F0EAE0] pb-3">
                  <div>
                    <h4 className="font-serif text-xl font-bold text-[#2C1E18]">
                      Pelacakan Status 5 Tahap (Pickup Workflow)
                    </h4>
                    <p className="text-xs text-[#6E5C52]">
                      Setiap permintaan dipantau transparan dari pengajuan awal
                      hingga selesai diolah.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
                  <div className="rounded-xl bg-amber-50 p-2.5 border border-amber-200">
                    <p className="font-bold text-amber-900">1. Submitted</p>
                    <p className="text-[10px] text-amber-700">Pengajuan Masuk</p>
                  </div>
                  <div className="rounded-xl bg-sky-50 p-2.5 border border-sky-200">
                    <p className="font-bold text-sky-900">2. Confirmed</p>
                    <p className="text-[10px] text-sky-700">Jadwal Disetujui</p>
                  </div>
                  <div className="rounded-xl bg-purple-50 p-2.5 border border-purple-200">
                    <p className="font-bold text-purple-900">3. On the Way</p>
                    <p className="text-[10px] text-purple-700">Driver Menuju Lokasi</p>
                  </div>
                  <div className="rounded-xl bg-teal-50 p-2.5 border border-teal-200">
                    <p className="font-bold text-teal-900">4. Picked Up</p>
                    <p className="text-[10px] text-teal-700">Ampas Diambil</p>
                  </div>
                  <div className="rounded-xl bg-emerald-50 p-2.5 border border-emerald-200 col-span-2 sm:col-span-1">
                    <p className="font-bold text-emerald-900">5. Completed</p>
                    <p className="text-[10px] text-emerald-700">Diolah Jadi Tepung</p>
                  </div>
                </div>

                {/* Pickup Requests List */}
                <div className="mt-4 divide-y divide-[#F0EAE0]">
                  {pickupRequests.map((req) => {
                    const badge = getPickupBadge(req.status);
                    return (
                      <div
                        key={req.id}
                        className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h5 className="text-sm font-bold text-[#2C1E18]">
                              {req.supplierName}
                            </h5>
                            <span
                              className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${badge.className}`}
                            >
                              {badge.label}
                            </span>
                          </div>
                          <p className="text-xs text-[#6E5C52]">
                            📍 {req.location} • 📞 {req.phone}
                          </p>
                          <p className="text-[11px] text-[#8C7A6B]">
                            Jadwal: {req.preferredDate} (
                            {req.preferredTime || 'Pagi'}) • Estimasi:{' '}
                            <strong>{req.estimatedKg} kg</strong>
                          </p>
                          {req.notes && (
                            <p className="text-[11px] italic text-[#6E5C52]">
                              &ldquo;{req.notes}&rdquo;
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-2 text-xs font-semibold">
                          <span className="rounded-lg bg-[#FAF8F5] border border-[#E5DEC9] px-3 py-1.5 text-[#3B5B3D]">
                            ID: #{req.id}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: SUPPLIER GUIDELINES */}
          {activeTab === 'guidelines' && (
            <div className="mt-10 rounded-3xl border border-[#E5DEC9] bg-white p-6 sm:p-10 shadow-xs max-w-3xl mx-auto space-y-6">
              <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#3B5B3D]/10 text-[#3B5B3D]">
                  <ShieldCheck className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="font-serif text-2xl font-bold text-[#2C1E18]">
                    Panduan &amp; Standar Mutu Ampas Kelapa
                  </h3>
                  <p className="text-xs text-[#6E5C52]">
                    Kriteria kelayakan ampas kelapa agar dapat diolah menjadi tepung
                    berkualitas tinggi dan higienis.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                    Kriteria Ampas Diterima (Disetujui ✓)
                  </h4>
                  <ul className="mt-2.5 space-y-2 text-xs text-emerald-900">
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 shrink-0 mt-0.5 text-emerald-700" />
                      <span>
                        <strong>Ampas Kelapa Segar:</strong> Dihasilkan maksimal
                        24 jam sebelum jadwal penjemputan kurir.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 shrink-0 mt-0.5 text-emerald-700" />
                      <span>
                        <strong>Perasan Murni:</strong> Hanya berasal dari proses
                        pemerasan santan segar tanpa campuran kimia, garam, atau pengawet.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 shrink-0 mt-0.5 text-emerald-700" />
                      <span>
                        <strong>Wadah Bersih &amp; Kering:</strong> Disimpan pada
                        tong atau karung plastik bersih yang tidak terkena kotoran tanah atau hewan.
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="rounded-2xl border border-rose-200 bg-rose-50/60 p-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-rose-800">
                    Kriteria yang Ditolak (Tidak Layak ✕)
                  </h4>
                  <ul className="mt-2.5 space-y-2 text-xs text-rose-900">
                    <li className="flex items-start gap-2">
                      <span className="text-rose-600 font-bold mt-0.5">•</span>
                      <span>Ampas berbau asam, tengik, berjamur, atau berubah warna.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-rose-600 font-bold mt-0.5">•</span>
                      <span>Terkontaminasi sabun pembersih, minyak hewani, atau sisa makanan lain.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-rose-600 font-bold mt-0.5">•</span>
                      <span>Ampas basah yang telah mengendap lebih dari 36 jam di udara terbuka.</span>
                    </li>
                  </ul>
                </div>

                <div className="rounded-2xl border border-[#E5DEC9] bg-[#FAF8F5] p-4 text-xs text-[#5C4B42] space-y-1">
                  <p className="font-bold text-[#2C1E18]">
                    💡 Tips Penyimpanan di Kios:
                  </p>
                  <p>
                    Setelah santan diperas, tiriskan ampas dan segera simpan dalam wadah
                    tertutup di tempat yang sejuk dan terlindung dari sinar matahari langsung.
                  </p>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* =========================================================================
            4. BOTTOM WHATSAPP SUPPORT BANNER
           ========================================================================= */}
        <section className="border-t border-[#E5DEC9] bg-white py-12">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center space-y-4">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#3B5B3D]/10 px-3 py-1 text-xs font-semibold text-[#3B5B3D]">
              <Phone className="h-3.5 w-3.5" />
              Layanan Hotline Logistik
            </span>
            <h3 className="font-serif text-2xl font-bold text-[#2C1E18]">
              Ada Pertanyaan Seputar Jadwal Penjemputan di Wilayah Anda?
            </h3>
            <p className="text-xs sm:text-sm text-[#6E5C52] max-w-xl mx-auto">
              Tim logistik CORA siap membantu koordinasi rute jemput, penyediaan
              tong penampung ampas, dan skema kemitraan UMKM.
            </p>
            <div className="pt-2">
              <a
                href="https://wa.me/6281234567890?text=Halo%20Tim%20Logistik%20CORA,%20saya%20ingin%20berkonsultasi%20mengenai%20penjemputan%20ampas%20kelapa."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-[#3B5B3D] px-6 py-3 text-xs font-bold text-white shadow-sm transition hover:bg-[#2F4A31]"
              >
                <span>Hubungi via WhatsApp</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
