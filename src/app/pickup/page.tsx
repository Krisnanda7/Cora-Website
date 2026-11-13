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
  const [pickupTime, setPickupTime] = useState('08:00 - 10:00 WITA (Morning)');
  const [pickupNotes, setPickupNotes] = useState('');
  const [pickupSuccessMsg, setPickupSuccessMsg] = useState<string | null>(null);

  // Tab 2: Register Supplier Form
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regLocation, setRegLocation] = useState('');
  const [regBusinessType, setRegBusinessType] = useState('Traditional Coconut Milk Stall');
  const [regEstimatedKg, setRegEstimatedKg] = useState('');
  const [regFrequency, setRegFrequency] = useState('Daily');
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
      `Pickup request for ${pickupKg} kg of coconut residue has been successfully submitted! Our team will contact you via WhatsApp.`
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
      `Congratulations! "${regName}" has been successfully registered as an official CORA supplier partner.`
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
                  An integrated circular logistics solution for coconut milk producers,
                  grated coconut vendors, and local food makers. We transform fresh coconut
                  residues—often discarded as waste—into high-nutrition upcycled flour with
                  tangible circular economic value.
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
                    Request a Pickup
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
                    Become Our Supplier
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
                    Track Pickup Status
                  </button>
                </div>
              </div>

              {/* Right Column: Hero KPI Pill Cards */}
              <div className="lg:col-span-5 grid grid-cols-2 gap-3.5">
                <div className="rounded-2xl border border-white/15 bg-white/10 p-4.5 backdrop-blur-md">
                  <p className="text-[11px] font-semibold text-[#86C975] uppercase tracking-wider">
                    Registered Partners
                  </p>
                  <p className="mt-1 font-serif text-3xl font-extrabold text-white">
                    {suppliers.length}
                  </p>
                  <p className="mt-1 text-[11px] text-[#D0C5B5]">
                    Active stalls &amp; vendors
                  </p>
                </div>

                <div className="rounded-2xl border border-white/15 bg-white/10 p-4.5 backdrop-blur-md">
                  <p className="text-[11px] font-semibold text-[#86C975] uppercase tracking-wider">
                    Residue Upcycled
                  </p>
                  <p className="mt-1 font-serif text-3xl font-extrabold text-white">
                    {totalCompletedKg + 280}{' '}
                    <span className="text-sm font-sans font-medium text-[#D0C5B5]">
                      kg
                    </span>
                  </p>
                  <p className="mt-1 text-[11px] text-[#D0C5B5]">
                    Diverted from landfills
                  </p>
                </div>

                <div className="rounded-2xl border border-white/15 bg-white/10 p-4.5 backdrop-blur-md">
                  <p className="text-[11px] font-semibold text-[#86C975] uppercase tracking-wider">
                    Route Coverage
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
                    Pickup Service
                  </p>
                  <p className="mt-1 font-serif text-2xl font-bold text-[#86C975]">
                    Free + Reward
                  </p>
                  <p className="mt-1 text-[11px] text-[#D0C5B5]">
                    Cash incentive per kg residue
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            2. 4-STEP LOGISTICS WORKFLOW (HOW IT WORKS)
           ========================================================================= */}
        <section className="border-b border-[#E5DEC9] bg-[#F2EFE8]/70 py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#3B5B3D]">
                Simple Workflow
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#2C1E18]">
                How Does the Coconut Pickup System Work?
              </h2>
              <p className="text-xs sm:text-sm text-[#6E5C52]">
                A hygienic, reliable, and transparent collection process in 4 clear steps.
              </p>
            </div>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="rounded-2xl border border-[#E5DEC9] bg-white p-5 shadow-2xs space-y-2">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-[#3B5B3D] text-white text-xs font-bold font-mono">
                  01
                </span>
                <h3 className="text-sm font-bold text-[#2C1E18]">
                  Submit Request
                </h3>
                <p className="text-xs leading-relaxed text-[#6E5C52]">
                  Suppliers enter estimated residue weight, facility location, and
                  preferred pickup date and time window online.
                </p>
              </div>

              <div className="rounded-2xl border border-[#E5DEC9] bg-white p-5 shadow-2xs space-y-2">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-[#3B5B3D] text-white text-xs font-bold font-mono">
                  02
                </span>
                <h3 className="text-sm font-bold text-[#2C1E18]">
                  Schedule Confirmation
                </h3>
                <p className="text-xs leading-relaxed text-[#6E5C52]">
                  CORA operations team verifies the request and optimizes the courier
                  dispatch route directly to your stall.
                </p>
              </div>

              <div className="rounded-2xl border border-[#E5DEC9] bg-white p-5 shadow-2xs space-y-2">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-[#3B5B3D] text-white text-xs font-bold font-mono">
                  03
                </span>
                <h3 className="text-sm font-bold text-[#2C1E18]">
                  Hygienic Collection
                </h3>
                <p className="text-xs leading-relaxed text-[#6E5C52]">
                  CORA courier arrives with clean food-grade containers, transparently
                  weighs the residue, and issues a digital receipt.
                </p>
              </div>

              <div className="rounded-2xl border border-[#E5DEC9] bg-white p-5 shadow-2xs space-y-2">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-[#3B5B3D] text-white text-xs font-bold font-mono">
                  04
                </span>
                <h3 className="text-sm font-bold text-[#2C1E18]">
                  Upcycled into Flour
                </h3>
                <p className="text-xs leading-relaxed text-[#6E5C52]">
                  Residue is brought to CORA processing hub for hygienic drying,
                  milling, and refinement into wholesome gluten-free flour.
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
              { id: 'request', label: 'Request a Pickup', icon: Truck },
              { id: 'register', label: 'Become Our Supplier', icon: Users },
              {
                id: 'tracking',
                label: 'Supplier Dashboard & Tracking',
                icon: Clock,
              },
              {
                id: 'guidelines',
                label: 'Quality & Hygiene Guidelines',
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
                    Pickup Request Form
                  </h3>
                  <p className="text-xs text-[#6E5C52]">
                    Schedule a fresh coconut residue collection. Our logistics team
                    will confirm your arrival window via WhatsApp.
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
                    Supplier / Stall Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={pickupSupplierName}
                    onChange={(e) => setPickupSupplierName(e.target.value)}
                    placeholder="e.g., Barokah Coconut Stall / Pak Wayan"
                    className="mt-1 w-full rounded-xl border border-[#E5DEC9] bg-[#FAF8F5] p-3 text-xs text-[#2C1E18] focus:border-[#3B5B3D] focus:bg-white focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#2C1E18]">
                      WhatsApp Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={pickupPhone}
                      onChange={(e) => setPickupPhone(e.target.value)}
                      placeholder="+62 812-3456-7890"
                      className="mt-1 w-full rounded-xl border border-[#E5DEC9] bg-[#FAF8F5] p-3 text-xs text-[#2C1E18] focus:border-[#3B5B3D] focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#2C1E18]">
                      Residue Weight (kg) *
                    </label>
                    <input
                      type="number"
                      required
                      min={10}
                      value={pickupKg}
                      onChange={(e) => setPickupKg(e.target.value)}
                      placeholder="Minimum 10 kg"
                      className="mt-1 w-full rounded-xl border border-[#E5DEC9] bg-[#FAF8F5] p-3 text-xs text-[#2C1E18] focus:border-[#3B5B3D] focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#2C1E18]">
                    Pickup Location / Complete Address *
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={pickupLocation}
                    onChange={(e) => setPickupLocation(e.target.value)}
                    placeholder="Complete stall/market address with nearby landmarks..."
                    className="mt-1 w-full rounded-xl border border-[#E5DEC9] bg-[#FAF8F5] p-3 text-xs text-[#2C1E18] focus:border-[#3B5B3D] focus:bg-white focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#2C1E18]">
                      Pickup Date *
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
                      Preferred Time Window
                    </label>
                    <select
                      value={pickupTime}
                      onChange={(e) => setPickupTime(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-[#E5DEC9] bg-[#FAF8F5] p-3 text-xs text-[#2C1E18] focus:border-[#3B5B3D] focus:bg-white focus:outline-none"
                    >
                      <option>08:00 - 10:00 WITA (Morning)</option>
                      <option>11:00 - 13:00 WITA (Noon)</option>
                      <option>15:00 - 17:00 WITA (Afternoon)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#2C1E18]">
                    Special Courier Notes (Optional)
                  </label>
                  <input
                    type="text"
                    value={pickupNotes}
                    onChange={(e) => setPickupNotes(e.target.value)}
                    placeholder="e.g., Blue storage drum near the pressing machine"
                    className="mt-1 w-full rounded-xl border border-[#E5DEC9] bg-[#FAF8F5] p-3 text-xs text-[#2C1E18] focus:border-[#3B5B3D] focus:bg-white focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-full bg-[#3B5B3D] py-3.5 text-xs font-bold text-white shadow-sm hover:bg-[#2F4A31] transition"
                >
                  Submit Residue Pickup Request
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
                    Register as an Official Supplier Partner
                  </h3>
                  <p className="text-xs text-[#6E5C52]">
                    Enjoy hassle-free recurring pickups, supplemental financial revenue,
                    and circular supplier partner certification.
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
                      Owner / Contact Person *
                    </label>
                    <input
                      type="text"
                      required
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="e.g., Pak Wayan / Bu Dewi"
                      className="mt-1 w-full rounded-xl border border-[#E5DEC9] bg-[#FAF8F5] p-3 text-xs text-[#2C1E18] focus:border-[#3B5B3D] focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#2C1E18]">
                      Active WhatsApp Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      placeholder="+62 812-3456-7890"
                      className="mt-1 w-full rounded-xl border border-[#E5DEC9] bg-[#FAF8F5] p-3 text-xs text-[#2C1E18] focus:border-[#3B5B3D] focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#2C1E18]">
                    Stall / Facility Location Address *
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={regLocation}
                    onChange={(e) => setRegLocation(e.target.value)}
                    placeholder="e.g., Kumbasari Traditional Market Stall No. 12, Gajah Mada St, Denpasar"
                    className="mt-1 w-full rounded-xl border border-[#E5DEC9] bg-[#FAF8F5] p-3 text-xs text-[#2C1E18] focus:border-[#3B5B3D] focus:bg-white focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#2C1E18]">
                      Business Type
                    </label>
                    <select
                      value={regBusinessType}
                      onChange={(e) => setRegBusinessType(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-[#E5DEC9] bg-[#FAF8F5] p-3 text-xs text-[#2C1E18] focus:border-[#3B5B3D] focus:bg-white focus:outline-none"
                    >
                      <option>Traditional Coconut Milk Stall</option>
                      <option>Grated Coconut Processing</option>
                      <option>Bakery &amp; Coconut Confectionery</option>
                      <option>Restaurant / Catering</option>
                      <option>Coffee Shop / Cafe</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#2C1E18]">
                      Estimated Residue (kg/week) *
                    </label>
                    <input
                      type="number"
                      required
                      min={10}
                      value={regEstimatedKg}
                      onChange={(e) => setRegEstimatedKg(e.target.value)}
                      placeholder="e.g., 80"
                      className="mt-1 w-full rounded-xl border border-[#E5DEC9] bg-[#FAF8F5] p-3 text-xs text-[#2C1E18] focus:border-[#3B5B3D] focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#2C1E18]">
                      Production Frequency
                    </label>
                    <select
                      value={regFrequency}
                      onChange={(e) => setRegFrequency(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-[#E5DEC9] bg-[#FAF8F5] p-3 text-xs text-[#2C1E18] focus:border-[#3B5B3D] focus:bg-white focus:outline-none"
                    >
                      <option>Daily</option>
                      <option>3-4x a Week</option>
                      <option>1-2x a Week</option>
                      <option>On-Demand / By Order</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full rounded-full bg-[#4E9A34] py-3.5 text-xs font-bold text-white shadow-sm hover:bg-[#3F8129] transition"
                >
                  Register Business as Supplier Partner
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
                    Registered Partners
                  </span>
                  <p className="mt-2 font-serif text-3xl font-bold text-[#2C1E18]">
                    {suppliers.length}{' '}
                    <span className="text-xs font-normal text-[#6E5C52]">
                      stalls/businesses
                    </span>
                  </p>
                  <p className="mt-1 text-[11px] text-[#8C7A6B]">
                    Active across CORA circular network
                  </p>
                </div>

                <div className="rounded-2xl bg-white p-5 border border-[#E5DEC9] shadow-2xs">
                  <span className="text-[11px] font-bold text-[#3B5B3D] uppercase">
                    Total Residue Collected
                  </span>
                  <p className="mt-2 font-serif text-3xl font-bold text-[#2C1E18]">
                    {totalCompletedKg + 280}{' '}
                    <span className="text-xs font-normal text-[#6E5C52]">kg</span>
                  </p>
                  <p className="mt-1 text-[11px] text-[#8C7A6B]">
                    Collected &amp; upcycled into flour
                  </p>
                </div>

                <div className="rounded-2xl bg-white p-5 border border-[#E5DEC9] shadow-2xs">
                  <span className="text-[11px] font-bold text-[#3B5B3D] uppercase">
                    Carbon Emission Reduction
                  </span>
                  <p className="mt-2 font-serif text-3xl font-bold text-[#2C1E18]">
                    ~{((totalCompletedKg + 280) * 2.38).toFixed(0)}{' '}
                    <span className="text-xs font-normal text-[#6E5C52]">
                      kg CO₂e
                    </span>
                  </p>
                  <p className="mt-1 text-[11px] text-[#8C7A6B]">
                    Methane gas diverted from landfills
                  </p>
                </div>
              </div>

              {/* 5-Status Alur Tracker Card */}
              <div className="rounded-3xl border border-[#E5DEC9] bg-white p-6 sm:p-8 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#F0EAE0] pb-3">
                  <div>
                    <h4 className="font-serif text-xl font-bold text-[#2C1E18]">
                      5-Stage Pickup Workflow Tracking
                    </h4>
                    <p className="text-xs text-[#6E5C52]">
                      Every request is tracked transparently from initial dispatch to completed upcycling.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
                  <div className="rounded-xl bg-amber-50 p-2.5 border border-amber-200">
                    <p className="font-bold text-amber-900">1. Submitted</p>
                    <p className="text-[10px] text-amber-700">Request Logged</p>
                  </div>
                  <div className="rounded-xl bg-sky-50 p-2.5 border border-sky-200">
                    <p className="font-bold text-sky-900">2. Confirmed</p>
                    <p className="text-[10px] text-sky-700">Schedule Approved</p>
                  </div>
                  <div className="rounded-xl bg-purple-50 p-2.5 border border-purple-200">
                    <p className="font-bold text-purple-900">3. On the Way</p>
                    <p className="text-[10px] text-purple-700">Driver En Route</p>
                  </div>
                  <div className="rounded-xl bg-teal-50 p-2.5 border border-teal-200">
                    <p className="font-bold text-teal-900">4. Picked Up</p>
                    <p className="text-[10px] text-teal-700">Residue Collected</p>
                  </div>
                  <div className="rounded-xl bg-emerald-50 p-2.5 border border-emerald-200 col-span-2 sm:col-span-1">
                    <p className="font-bold text-emerald-900">5. Completed</p>
                    <p className="text-[10px] text-emerald-700">Milled into Flour</p>
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
                            Schedule: {req.preferredDate} (
                            {req.preferredTime || 'Morning'}) • Estimate:{' '}
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
                    Coconut Residue Quality &amp; Hygiene Guidelines
                  </h3>
                  <p className="text-xs text-[#6E5C52]">
                    Eligibility criteria to ensure residue can be safely processed into
                    high-nutrition, food-grade flour for human consumption.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                    Accepted Residue Criteria (Approved ✓)
                  </h4>
                  <ul className="mt-2.5 space-y-2 text-xs text-emerald-900">
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 shrink-0 mt-0.5 text-emerald-700" />
                      <span>
                        <strong>Fresh Coconut Residue:</strong> Produced within 24 hours
                        prior to scheduled courier pickup.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 shrink-0 mt-0.5 text-emerald-700" />
                      <span>
                        <strong>Pure Extraction:</strong> Sourced purely from fresh coconut milk
                        pressing without added chemicals, table salt, or artificial preservatives.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 shrink-0 mt-0.5 text-emerald-700" />
                      <span>
                        <strong>Clean &amp; Sealed Containers:</strong> Kept in clean food-grade
                        plastic drums or sacks protected from pests, soil, and dust.
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="rounded-2xl border border-rose-200 bg-rose-50/60 p-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-rose-800">
                    Rejected Criteria (Not Eligible ✕)
                  </h4>
                  <ul className="mt-2.5 space-y-2 text-xs text-rose-900">
                    <li className="flex items-start gap-2">
                      <span className="text-rose-600 font-bold mt-0.5">•</span>
                      <span>Sour odor, rancid smell, visible mold growth, or unusual discoloration.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-rose-600 font-bold mt-0.5">•</span>
                      <span>Contaminated with dishwashing soap, chemical cleaners, animal fat, or food scraps.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-rose-600 font-bold mt-0.5">•</span>
                      <span>Wet residue sitting out open in ambient temperature for more than 36 hours.</span>
                    </li>
                  </ul>
                </div>

                <div className="rounded-2xl border border-[#E5DEC9] bg-[#FAF8F5] p-4 text-xs text-[#5C4B42] space-y-1">
                  <p className="font-bold text-[#2C1E18]">
                    💡 Stall Storage Tip:
                  </p>
                  <p>
                    After pressing coconut milk, promptly drain excess water and seal the residue
                    in a clean container stored in a shaded, well-ventilated area away from direct sunlight.
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
              Logistics Hotline Support
            </span>
            <h3 className="font-serif text-2xl font-bold text-[#2C1E18]">
              Have Questions About Residue Pickup in Your Area?
            </h3>
            <p className="text-xs sm:text-sm text-[#6E5C52] max-w-xl mx-auto">
              CORA logistics team is ready to coordinate pickup routes, provide storage drums,
              and assist with supplier partner compensation terms.
            </p>
            <div className="pt-2">
              <a
                href="https://wa.me/6285858687329?text=Hello%20CORA%20Logistics%20Team,%20I%20would%20like%20to%20inquire%20about%20coconut%20residue%20pickup%20partnership."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-[#3B5B3D] px-6 py-3 text-xs font-bold text-white shadow-sm transition hover:bg-[#2F4A31]"
              >
                <span>Contact via WhatsApp</span>
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
