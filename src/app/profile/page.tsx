'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Bot,
  CheckCircle2,
  Heart,
  MapPin,
  Package,
  Save,
  Truck,
  User,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useCora } from '@/context/CoraContext';

function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function UserProfilePage() {
  const { userProfile, updateUserProfile, orders, recipes } = useCora();

  const [activeTab, setActiveTab] = useState<
    'profile' | 'orders' | 'favorites' | 'aiHistory'
  >('profile');

  // Edit profile form state
  const [name, setName] = useState(userProfile.name);
  const [email, setEmail] = useState(userProfile.email);
  const [phone, setPhone] = useState(userProfile.phone);
  const [address, setAddress] = useState(userProfile.address);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const favoriteRecipes = recipes.filter((r) =>
    userProfile.favoriteRecipeIds.includes(r.id)
  );

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      address: address.trim(),
    });
    setSavedSuccess(true);
    window.setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#FAF8F5] text-[#2C1E18]">
      <Navbar />

      <main className="flex-1 py-10 sm:py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          {/* Header Banner */}
          <div className="rounded-3xl border border-[#E5DEC9] bg-white p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#3B5B3D] text-white font-serif text-2xl font-bold shadow-md">
                {userProfile.name.charAt(0) || 'U'}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-serif text-2xl font-bold text-[#2C1E18]">
                    {userProfile.name}
                  </h1>
                  <span className="rounded-full bg-[#3B5B3D]/10 px-2.5 py-0.5 text-[10px] font-bold text-[#3B5B3D]">
                    Demo User
                  </span>
                </div>
                <p className="text-xs text-[#6E5C52]">
                  {userProfile.email} • {userProfile.phone}
                </p>
                <p className="mt-1 text-[11px] text-[#8C7A6B] flex items-center gap-1">
                  <MapPin className="h-3 w-3 text-[#3B5B3D]" />
                  {userProfile.address}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/admin"
                className="rounded-full border border-[#D6CCBA] bg-[#FAF8F5] px-4 py-2 text-xs font-bold text-[#5C4B42] hover:bg-[#EAE4D6] transition"
              >
                Open Admin Portal
              </Link>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="mt-6 flex flex-wrap gap-2 border-b border-[#E5DEC9] pb-3">
            {[
              { id: 'profile', label: 'Account & Address', icon: User },
              { id: 'orders', label: `Order History (${orders.length})`, icon: Package },
              { id: 'favorites', label: `Favorite Recipes (${favoriteRecipes.length})`, icon: Heart },
              { id: 'aiHistory', label: 'CoraBlend AI History', icon: Bot },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() =>
                    setActiveTab(
                      tab.id as 'profile' | 'orders' | 'favorites' | 'aiHistory'
                    )
                  }
                  className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
                    activeTab === tab.id
                      ? 'bg-[#3B5B3D] text-white shadow-xs'
                      : 'text-[#6E5C52] hover:bg-white hover:text-[#2C1E18]'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* TAB 1: ACCOUNT & SHIPPING INFO */}
          {activeTab === 'profile' && (
            <div className="mt-6 rounded-3xl border border-[#E5DEC9] bg-white p-6 sm:p-8 shadow-xs max-w-2xl">
              <h2 className="font-serif text-xl font-bold text-[#2C1E18]">
                Account &amp; Shipping Settings
              </h2>
              <p className="mt-1 text-xs text-[#6E5C52]">
                Manage your name, contact details, and primary delivery address for CORA orders.
              </p>

              {savedSuccess && (
                <div className="mt-4 rounded-2xl bg-[#4E9A34]/15 border border-[#4E9A34]/30 p-3 text-xs font-semibold text-[#2F611F] flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  <span>Profile information and shipping address successfully updated!</span>
                </div>
              )}

              <form onSubmit={handleSaveProfile} className="mt-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#2C1E18]">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-[#D6CCBA] bg-[#FAF8F5] p-3 text-xs text-[#2C1E18] focus:border-[#3B5B3D] focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#2C1E18]">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-[#D6CCBA] bg-[#FAF8F5] p-3 text-xs text-[#2C1E18] focus:border-[#3B5B3D] focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#2C1E18]">
                    WhatsApp / Phone Number
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-[#D6CCBA] bg-[#FAF8F5] p-3 text-xs text-[#2C1E18] focus:border-[#3B5B3D] focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#2C1E18]">
                    Primary Shipping Address
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-[#D6CCBA] bg-[#FAF8F5] p-3 text-xs text-[#2C1E18] focus:border-[#3B5B3D] focus:bg-white focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-full bg-[#3B5B3D] px-6 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#2F4A31] transition"
                >
                  <Save className="h-3.5 w-3.5" />
                  <span>Save Profile Changes</span>
                </button>
              </form>
            </div>
          )}

          {/* TAB 2: ORDER HISTORY & STATUS */}
          {activeTab === 'orders' && (
            <div className="mt-6 space-y-4">
              {orders.map((o) => (
                <div
                  key={o.id}
                  className="rounded-3xl border border-[#E5DEC9] bg-white p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-[#2C1E18]">
                        #{o.orderNumber}
                      </h3>
                      <span className="rounded-full bg-[#3B5B3D]/10 px-2.5 py-0.5 text-[10px] font-bold text-[#3B5B3D]">
                        {o.status.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-xs text-[#6E5C52]">
                      {new Date(o.createdAt).toLocaleDateString('en-US', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}{' '}
                      • {o.items.length} items • Total: <strong>{formatRupiah(o.totalAmount)}</strong>
                    </p>
                    <p className="text-[11px] text-[#8C7A6B]">
                      Recipient: {o.customerName} | Address: {o.shippingAddress}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/track`}
                      className="inline-flex items-center gap-1.5 rounded-full bg-[#3B5B3D] px-4 py-2 text-xs font-bold text-white hover:bg-[#2F4A31] transition"
                    >
                      <Truck className="h-3.5 w-3.5" />
                      <span>Track Order</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: FAVORITE RECIPES */}
          {activeTab === 'favorites' && (
            <div className="mt-6">
              {favoriteRecipes.length === 0 ? (
                <div className="rounded-3xl border border-[#E5DEC9] bg-white p-10 text-center shadow-xs">
                  <Heart className="mx-auto h-10 w-10 text-[#8C7A6B]/50" />
                  <h3 className="mt-3 font-serif text-lg font-bold text-[#2C1E18]">
                    No Favorite Recipes Yet
                  </h3>
                  <p className="mt-1 text-xs text-[#6E5C52]">
                    Visit RecipeHub and tap the heart icon on recipes you love to save them here.
                  </p>
                  <Link
                    href="/ecosystem"
                    className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-[#3B5B3D] px-5 py-2 text-xs font-bold text-white"
                  >
                    Explore RecipeHub
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {favoriteRecipes.map((r) => (
                    <div
                      key={r.id}
                      className="rounded-2xl border border-[#E5DEC9] bg-white p-4 shadow-2xs space-y-2 flex flex-col justify-between"
                    >
                      <div>
                        <span className="text-[10px] font-bold text-[#3B5B3D] uppercase">
                          {r.category}
                        </span>
                        <h4 className="text-sm font-bold text-[#2C1E18]">
                          {r.title}
                        </h4>
                        <p className="text-xs text-[#6E5C52] line-clamp-2">
                          {r.summary}
                        </p>
                      </div>
                      <Link
                        href="/ecosystem"
                        className="text-xs font-bold text-[#3B5B3D] hover:underline pt-2 block border-t border-[#F0EAE0]"
                      >
                        View Recipe in RecipeHub →
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: CORABLEND AI HISTORY */}
          {activeTab === 'aiHistory' && (
            <div className="mt-6 rounded-3xl border border-[#E5DEC9] bg-white p-6 sm:p-8 shadow-xs">
              <h3 className="font-serif text-xl font-bold text-[#2C1E18]">
                CoraBlend AI Recommendations History
              </h3>
              <p className="mt-1 text-xs text-[#6E5C52]">
                Browse culinary inspirations recently generated with your AI assistant.
              </p>

              <div className="mt-5 space-y-3">
                <div className="rounded-2xl bg-[#FAF8F5] p-4 border border-[#E5DEC9] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-[#4E9A34]">
                      AI Recipe Match
                    </span>
                    <h4 className="text-sm font-bold text-[#2C1E18]">
                      Smart CORA Upcycled Brownies (4 servings)
                    </h4>
                    <p className="text-xs text-[#6E5C52]">
                      Ingredients: Eggs, Banana, Dark Chocolate • Flavor: Naturally Sweet &amp; Moist
                    </p>
                  </div>
                  <Link
                    href="/ecosystem"
                    className="text-xs font-bold text-[#3B5B3D] hover:underline"
                  >
                    Open AI Generator →
                  </Link>
                </div>

                <div className="rounded-2xl bg-[#FAF8F5] p-4 border border-[#E5DEC9] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-[#4E9A34]">
                      AI Recipe Match
                    </span>
                    <h4 className="text-sm font-bold text-[#2C1E18]">
                      Fluffy Coconut Banana Pancakes (2 servings)
                    </h4>
                    <p className="text-xs text-[#6E5C52]">
                      Ingredients: Banana, Oat Milk, Eggs • Time: &lt;15 mins
                    </p>
                  </div>
                  <Link
                    href="/ecosystem"
                    className="text-xs font-bold text-[#3B5B3D] hover:underline"
                  >
                    Open AI Generator →
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
