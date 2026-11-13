'use client';

import React, { useMemo, useState } from 'react';
import Image from 'next/image';
import {
  ArrowRight,
  BookOpen,
  Bot,
  Check,
  CheckCircle2,
  ChefHat,
  Clock,
  Flame,
  Heart,
  Info,
  Loader2,
  MessageSquare,
  Scale,
  Search,
  Send,
  Sliders,
  Sparkles,
  Truck,
  X,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Reveal from '@/components/Reveal';
import { useCora } from '@/context/CoraContext';
import type {
  PickupRequestStatus,
  Recipe,
  RecipeCategory,
} from '@/types/cora';

type DishType = 'Cookies' | 'Muffin' | 'Pancake' | 'Brownies' | 'Banana Cake';

interface GeneratedRecipe {
  title: string;
  dishType: DishType;
  tagline: string;
  prepTime: string;
  cookTime: string;
  servings: string;
  tastePreference: string;
  difficulty: string;
  caloriesPerServing: number;
  wheatEquivalent: string;
  coconutFlourAmount: string;
  hydrationTip: string;
  ingredients: string[];
  steps: string[];
}

const HOME_INGREDIENTS = [
  'Eggs',
  'Banana',
  'Dark Chocolate',
  'Oat Milk',
  'Palm Sugar',
  'Coconut Oil',
  'Honey',
  'Cinnamon',
  'Almond Milk',
  'Vanilla Extract',
] as const;

const DISH_TYPES: { id: DishType; label: string; subtitle: string }[] = [
  { id: 'Cookies', label: 'Cookies', subtitle: 'Renyah pinggir, lembut tengah' },
  { id: 'Brownies', label: 'Brownies', subtitle: 'Fudgy pekat & bebas gluten' },
  { id: 'Pancake', label: 'Pancake', subtitle: 'Sarapan sehat tinggi serat' },
  { id: 'Muffin', label: 'Muffin', subtitle: 'Empuk wangi & kaya serat pangan' },
  { id: 'Banana Cake', label: 'Banana Cake', subtitle: 'Bolu pisang tropis lembut' },
];

const RECIPE_CATEGORIES: { label: string; value: 'ALL' | RecipeCategory }[] = [
  { label: 'Semua Resep', value: 'ALL' },
  { label: 'Cookies & Biscuits', value: 'Cookies and Biscuits' },
  { label: 'Cakes & Brownies', value: 'Cakes and Brownies' },
  { label: 'Healthy Snacks', value: 'Healthy Snacks' },
  { label: 'Creative Recipes', value: 'Creative Recipes' },
];

const PRESET_CHAT_QUESTIONS = [
  'Bagaimana perbandingan takaran coconut flour dengan tepung terigu biasa?',
  'Berapa rasio telur & cairan saat memanggang dengan coconut flour?',
  'Apakah tepung kelapa CORA bebas gluten & aman untuk diet?',
  'Tips agar hasil kue berbahan coconut flour tidak terlalu kering?',
];

const FAQ_KNOWLEDGE_BASE: Record<string, string> = {
  rasio:
    'Rasio substitusi tepung kelapa CORA adalah 1:3 hingga 1:4 dari takaran tepung terigu (contoh: 100g terigu cukup diganti 25g - 35g tepung kelapa CORA). Hal ini karena tepung kelapa memiliki kandungan serat sangat tinggi yang menyerap 3-4x lebih banyak cairan dibanding terigu.',
  telur:
    'Karena tepung kelapa tidak mengandung gluten, telur berfungsi sebagai pengikat struktural utama. Rumus praktisnya: untuk setiap 30g tepung kelapa CORA, tambahkan 1 butir telur dan pastikan adonan didiamkan 3–5 menit agar serat kelapa terhidrasi sempurna.',
  gluten:
    'Ya, 100% Bebas Gluten (Gluten-Free)! Tepung kelapa CORA diproduksi dari ampas kelapa murni tanpa campuran gandum atau aditif kimia apa pun, sehingga sangat aman bagi penderita celiac, intoleransi gluten, serta pelaku diet keto/rendah karbohidrat.',
  kering:
    'Agar kue tidak kering: (1) Jangan menambahkan terlalu banyak tepung kelapa, (2) Gunakan lemak sehat seperti minyak kelapa atau butter, (3) Tambahkan pelembab alami seperti pisang lumat, saus apel, atau yogurt, dan (4) Jangan memanggang terlalu lama (biasanya 5 menit lebih cepat dibanding terigu biasa).',
  produk:
    'CORA mengolah ampas kelapa hasil sampingan produksi santan segar menjadi tepung serbaguna higienis, artisanal brownies, dan cookies renyah dengan kemasan kedap udara. Setiap produk secara langsung menyelamatkan limbah organik dan memberdayakan pedagang kelapa lokal.',
};

export function getPickupBadge(status: PickupRequestStatus): {
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
        label: 'On the Way',
        className: 'bg-purple-50 text-purple-800 ring-1 ring-purple-200',
      };
    case 'PICKED_UP':
      return {
        label: 'Picked Up',
        className: 'bg-teal-50 text-teal-800 ring-1 ring-teal-200',
      };
    case 'COMPLETED':
    default:
      return {
        label: 'Completed',
        className: 'bg-[#3B5B3D]/12 text-[#3B5B3D] ring-1 ring-[#3B5B3D]/25',
      };
  }
}

export default function EcosystemPage() {
  const {
    products,
    recipes,
    suppliers,
    pickupRequests,
    userProfile,
    addToCart,
    submitPickupRequest,
    registerSupplier,
    toggleFavoriteRecipe,
  } = useCora();

  // CoraBlendAI State
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([
    'Eggs',
    'Banana',
    'Dark Chocolate',
  ]);
  const [selectedDish, setSelectedDish] = useState<DishType>('Brownies');
  const [portionSize, setPortionSize] = useState<string>('4 porsi');
  const [tastePreference, setTastePreference] =
    useState<string>('Manis Alami & Moist');
  const [difficultyLevel, setDifficultyLevel] = useState<string>('Sedang');
  const [cookingTimePref, setCookingTimePref] = useState<string>('20-30 menit');

  const [isGenerating, setIsGenerating] = useState(false);
  const [aiRecipe, setAiRecipe] = useState<GeneratedRecipe | null>(null);
  const [addedFlourFeedback, setAddedFlourFeedback] = useState(false);

  // Chatbot State
  const [chatMessages, setChatMessages] = useState<
    { sender: 'user' | 'bot'; text: string; time: string }[]
  >([
    {
      sender: 'bot',
      text: 'Halo! Saya CORA Baking Assistant 🥥. Ada yang ingin Anda tanyakan seputar cara penggunaan tepung kelapa, rasio konversi terigu, atau tips baking sehat?',
      time: 'Baru saja',
    },
  ]);
  const [inputChat, setInputChat] = useState('');

  // RecipeHub State
  const [recipeCategory, setRecipeCategory] = useState<'ALL' | RecipeCategory>(
    'ALL'
  );
  const [recipeSearch, setRecipeSearch] = useState('');
  const [activeRecipeModal, setActiveRecipeModal] = useState<Recipe | null>(
    null
  );

  // Coconut Pickup State
  const [activePickupTab, setActivePickupTab] = useState<
    'request' | 'register' | 'tracking' | 'guidelines'
  >('request');

  // Request Form
  const [pickupLocation, setPickupLocation] = useState('');
  const [pickupKg, setPickupKg] = useState('');
  const [pickupDate, setPickupDate] = useState('');
  const [pickupTime, setPickupTime] = useState('08:00 - 10:00 WITA (Pagi)');
  const [pickupNotes, setPickupNotes] = useState('');
  const [pickupSupplierName, setPickupSupplierName] = useState(
    userProfile.name || ''
  );
  const [pickupPhone, setPickupPhone] = useState(userProfile.phone || '');
  const [pickupSuccessMsg, setPickupSuccessMsg] = useState<string | null>(null);

  // Register Supplier Form
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regLocation, setRegLocation] = useState('');
  const [regBusinessType, setRegBusinessType] =
    useState('Kios Santan Tradisional');
  const [regEstimatedKg, setRegEstimatedKg] = useState('');
  const [regFrequency, setRegFrequency] = useState('Setiap Hari');
  const [regSuccessMsg, setRegSuccessMsg] = useState<string | null>(null);

  const coconutFlourProduct = useMemo(
    () =>
      products.find((p) => p.category === 'Flour') ??
      products.find((p) => p.id === 'prod-flour-500') ??
      products[0],
    [products]
  );

  // Filtered Recipes for RecipeHub
  const filteredRecipes = useMemo(() => {
    const q = recipeSearch.trim().toLowerCase();
    return recipes.filter((r) => {
      const matchCat =
        recipeCategory === 'ALL' || r.category === recipeCategory;
      if (!matchCat) return false;
      if (!q) return true;
      return (
        r.title.toLowerCase().includes(q) ||
        r.summary.toLowerCase().includes(q) ||
        r.ingredients.some((ing) => ing.toLowerCase().includes(q))
      );
    });
  }, [recipes, recipeCategory, recipeSearch]);

  const toggleIngredient = (ingredient: string) => {
    setSelectedIngredients((prev) =>
      prev.includes(ingredient)
        ? prev.filter((item) => item !== ingredient)
        : [...prev, ingredient]
    );
  };

  const handleGenerateRecipe = () => {
    if (isGenerating) return;
    setIsGenerating(true);
    setAiRecipe(null);

    window.setTimeout(() => {
      const flourGrams =
        selectedDish === 'Cookies'
          ? '55g'
          : selectedDish === 'Brownies'
          ? '65g'
          : selectedDish === 'Pancake'
          ? '45g'
          : selectedDish === 'Muffin'
          ? '50g'
          : '70g';

      const wheatEquiv =
        selectedDish === 'Cookies'
          ? '180g Tepung Terigu'
          : selectedDish === 'Brownies'
          ? '200g Tepung Terigu'
          : selectedDish === 'Pancake'
          ? '150g Tepung Terigu'
          : selectedDish === 'Muffin'
          ? '160g Tepung Terigu'
          : '220g Tepung Terigu';

      setAiRecipe({
        title: `Smart CORA Upcycled ${selectedDish}`,
        dishType: selectedDish,
        tagline: `Resep teroptimasi ${portionSize} dengan rasa ${tastePreference} dan tingkat kesulitan ${difficultyLevel}.`,
        prepTime: '15 menit',
        cookTime: cookingTimePref,
        servings: portionSize,
        tastePreference,
        difficulty: difficultyLevel,
        caloriesPerServing: 145,
        wheatEquivalent: wheatEquiv,
        coconutFlourAmount: `${flourGrams} Tepung Ampas Kelapa CORA`,
        hydrationTip:
          'Kandungan serat ampas kelapa menyerap 3x cairan lebih tinggi. Kocok telur dengan baik dan diamkan adonan selama 3 menit sebelum dipanggang.',
        ingredients: [
          `${flourGrams} Tepung Ampas Kelapa CORA`,
          ...selectedIngredients.map((i) => `Bahan dapur: ${i}`),
          '2 butir Telur ayam organik',
          '3 sdm Minyak kelapa / mentega cair',
          '1/2 sdt Baking powder & sejumput garam',
        ],
        steps: [
          'Campurkan bahan basah (telur, pemanis, minyak) dalam mangkuk dan kocok rata.',
          `Ayak ${flourGrams} Tepung Ampas Kelapa CORA dan baking powder ke dalam adonan basah.`,
          'Aduk merata dan diamkan 3 menit agar tepung kelapa terhidrasi sempurna.',
          `Bentuk atau tuang ke loyang sesuai porsi (${portionSize}).`,
          `Panggang pada suhu 175°C selama ${cookingTimePref} hingga harum keemasan.`,
        ],
      });
      setIsGenerating(false);
    }, 1200);
  };

  const handleSendChat = (textToSend?: string) => {
    const query = (textToSend || inputChat).trim();
    if (!query) return;

    const userMsg = {
      sender: 'user' as const,
      text: query,
      time: new Date().toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };
    setChatMessages((prev) => [...prev, userMsg]);
    setInputChat('');

    window.setTimeout(() => {
      const lower = query.toLowerCase();
      let reply =
        'Tepung kelapa CORA sangat kaya serat alami dan bebas gluten! Cukup gunakan 1/4 hingga 1/3 takaran tepung terigu biasa dan tambahkan 1 butir telur ekstra untuk kelembutan optimal.';

      if (lower.includes('rasio') || lower.includes('banding') || lower.includes('takaran')) {
        reply = FAQ_KNOWLEDGE_BASE.rasio;
      } else if (lower.includes('telur') || lower.includes('cairan') || lower.includes('air')) {
        reply = FAQ_KNOWLEDGE_BASE.telur;
      } else if (lower.includes('gluten') || lower.includes('sehat') || lower.includes('diet') || lower.includes('alergi')) {
        reply = FAQ_KNOWLEDGE_BASE.gluten;
      } else if (lower.includes('kering') || lower.includes('keras') || lower.includes('tips')) {
        reply = FAQ_KNOWLEDGE_BASE.kering;
      } else if (lower.includes('cora') || lower.includes('produk') || lower.includes('ampas')) {
        reply = FAQ_KNOWLEDGE_BASE.produk;
      }

      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'bot' as const,
          text: reply,
          time: new Date().toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit',
          }),
        },
      ]);
    }, 600);
  };

  const handlePickupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const weightNum = Number(pickupKg);
    if (
      !pickupSupplierName.trim() ||
      !pickupPhone.trim() ||
      !pickupLocation.trim() ||
      !pickupDate ||
      !Number.isFinite(weightNum) ||
      weightNum <= 0
    ) {
      return;
    }

    const created = submitPickupRequest({
      supplierName: pickupSupplierName.trim(),
      phone: pickupPhone.trim(),
      location: pickupLocation.trim(),
      estimatedKg: weightNum,
      preferredDate: pickupDate,
      preferredTime: pickupTime,
      notes: pickupNotes.trim() || undefined,
    });

    setPickupSuccessMsg(
      `Permintaan penjemputan dari ${created.supplierName} (${created.estimatedKg} kg) berhasil diajukan dengan status Request Submitted!`
    );
    setPickupKg('');
    setPickupNotes('');
  };

  const handleRegisterSupplierSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const kg = Number(regEstimatedKg);
    if (!regName.trim() || !regPhone.trim() || !regLocation.trim() || kg <= 0) {
      return;
    }

    registerSupplier({
      name: regName.trim(),
      phone: regPhone.trim(),
      businessLocation: regLocation.trim(),
      businessType: regBusinessType,
      estimatedKg: kg,
      productionFrequency: regFrequency,
    });

    setRegSuccessMsg(
      `Selamat datang, Mitra ${regName}! Pendaftaran Anda berhasil disimpan di sistem CORA.`
    );
    setRegName('');
    setRegPhone('');
    setRegLocation('');
    setRegEstimatedKg('');
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#FAF8F5] text-[#2C1E18]">
      <Navbar />

      <main className="flex-1">
        {/* Top Hero Banner */}
        <section className="relative overflow-hidden bg-[#121B13] text-[#FAF8F5]">
          <div className="pointer-events-none absolute inset-0 z-0 select-none">
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
            <div className="animate-cora-fade-up max-w-3xl space-y-3">
              <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-[#86C975]">
                <Sparkles className="h-3.5 w-3.5" />
                CORA Digital Circular Ecosystem
              </span>
              <h1 className="font-serif text-3xl font-semibold tracking-tight text-[#FAF8F5] sm:text-4xl lg:text-5xl drop-shadow-sm">
                RecipeHub, CoraBlendAI &amp; Coconut Pickup
              </h1>
              <p className="text-sm leading-relaxed text-[#E2DACF] sm:text-base">
                Koleksi inspirasi resep olahan tepung ampas kelapa, asisten AI interaktif untuk menyesuaikan resep dapur Anda, serta sistem penjemputan ampas kelapa terintegrasi bagi mitra UMKM.
              </p>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 1: CORABLEND AI (AI Generator + Customization + Assistant Chatbot)
           ========================================================================= */}
        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 space-y-12">
          {/* A. CORABLEND AI GENERATOR & CUSTOMIZATION */}
          <div className="rounded-3xl border border-[#E5DEC9] bg-white p-6 sm:p-10 shadow-xs">
            <div className="border-b border-[#F0EAE0] pb-6">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#3B5B3D]/10 px-3 py-1 text-xs font-semibold text-[#3B5B3D]">
                <Bot className="h-3.5 w-3.5" />
                Smart Coconut Flour Engine
              </span>
              <h2 className="mt-2.5 font-serif text-2xl font-bold text-[#2C1E18] sm:text-3xl">
                CoraBlendAI: Recipe Generator &amp; Customization
              </h2>
              <p className="mt-1 max-w-2xl text-xs sm:text-sm text-[#6E5C52]">
                Pilih bahan yang tersedia di rumah dan atur preferensi porsi, rasa, waktu, serta kesulitan. AI menghitung rasio konversi terigu ke Tepung Kelapa CORA secara presisi.
              </p>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
              {/* Left Form Controls */}
              <div className="space-y-6 lg:col-span-6">
                {/* 1. Bahan Tersedia di Rumah */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#3B5B3D]">
                    1. Bahan yang Tersedia di Rumah
                  </label>
                  <div className="mt-2.5 flex flex-wrap gap-2">
                    {HOME_INGREDIENTS.map((ing) => {
                      const active = selectedIngredients.includes(ing);
                      return (
                        <button
                          key={ing}
                          type="button"
                          onClick={() => toggleIngredient(ing)}
                          className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                            active
                              ? 'bg-[#3B5B3D] text-white shadow-xs'
                              : 'bg-[#FAF8F5] text-[#2C1E18] border border-[#E5DEC9] hover:bg-[#EAE4D6]'
                          }`}
                        >
                          {active && <Check className="h-3 w-3" />}
                          {ing}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Jenis Hidangan */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#3B5B3D]">
                    2. Jenis Hidangan
                  </label>
                  <div className="mt-2.5 grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {DISH_TYPES.map((dish) => {
                      const active = selectedDish === dish.id;
                      return (
                        <button
                          key={dish.id}
                          type="button"
                          onClick={() => setSelectedDish(dish.id)}
                          className={`rounded-2xl p-3 text-left transition ${
                            active
                              ? 'bg-[#3B5B3D]/10 border-2 border-[#3B5B3D]'
                              : 'bg-[#FAF8F5] border border-[#E5DEC9] hover:bg-[#F2EDE4]'
                          }`}
                        >
                          <p className="text-xs font-bold text-[#2C1E18]">
                            {dish.label}
                          </p>
                          <p className="mt-0.5 text-[10px] text-[#6E5C52]">
                            {dish.subtitle}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Recipe Customization (Porsi, Rasa, Kesulitan, Waktu) */}
                <div className="rounded-2xl bg-[#FAF8F5] p-4 border border-[#E5DEC9] space-y-3.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#2C1E18]">
                    <Sliders className="h-4 w-4 text-[#3B5B3D]" />
                    <span>3. Recipe Customization (Kustomisasi Resep)</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="text-[11px] font-semibold text-[#6E5C52]">
                        Jumlah Porsi
                      </label>
                      <select
                        value={portionSize}
                        onChange={(e) => setPortionSize(e.target.value)}
                        className="mt-1 w-full rounded-xl border border-[#D6CCBA] bg-white p-2 text-xs font-medium text-[#2C1E18]"
                      >
                        <option>2 porsi (Personal)</option>
                        <option>4 porsi (Keluarga)</option>
                        <option>6 porsi (Party)</option>
                        <option>8 porsi (Batch Besar)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-[#6E5C52]">
                        Preferensi Rasa
                      </label>
                      <select
                        value={tastePreference}
                        onChange={(e) => setTastePreference(e.target.value)}
                        className="mt-1 w-full rounded-xl border border-[#D6CCBA] bg-white p-2 text-xs font-medium text-[#2C1E18]"
                      >
                        <option>Manis Alami &amp; Moist</option>
                        <option>Cokelat Pekat (Intense)</option>
                        <option>Rendah Gula (Low Sugar)</option>
                        <option>Gurih Kelapa Sangrai</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-[#6E5C52]">
                        Tingkat Kesulitan
                      </label>
                      <select
                        value={difficultyLevel}
                        onChange={(e) => setDifficultyLevel(e.target.value)}
                        className="mt-1 w-full rounded-xl border border-[#D6CCBA] bg-white p-2 text-xs font-medium text-[#2C1E18]"
                      >
                        <option>Mudah (Tanpa Mixer)</option>
                        <option>Sedang</option>
                        <option>Kreatif (Artisanal)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-[#6E5C52]">
                        Waktu Memasak
                      </label>
                      <select
                        value={cookingTimePref}
                        onChange={(e) => setCookingTimePref(e.target.value)}
                        className="mt-1 w-full rounded-xl border border-[#D6CCBA] bg-white p-2 text-xs font-medium text-[#2C1E18]"
                      >
                        <option>Cepat (&lt;15 menit)</option>
                        <option>20-30 menit</option>
                        <option>&gt;30 menit</option>
                      </select>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  disabled={isGenerating}
                  onClick={handleGenerateRecipe}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#3B5B3D] px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#2F4A31] disabled:opacity-75"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Mengkalkulasi Rasio Tepung Kelapa...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      Generate AI Recipe Sekarang
                    </>
                  )}
                </button>
              </div>

              {/* Right Output Panel */}
              <div className="lg:col-span-6">
                {isGenerating ? (
                  <div className="flex h-full min-h-[380px] flex-col items-center justify-center rounded-2xl border border-[#E5DEC9] bg-[#FAF8F5] p-8 text-center">
                    <ChefHat className="h-10 w-10 text-[#3B5B3D] animate-bounce" />
                    <h3 className="mt-4 font-serif text-lg font-bold text-[#2C1E18]">
                      CoraBlendAI sedang meramu resep Anda...
                    </h3>
                    <p className="mt-1.5 max-w-sm text-xs text-[#6E5C52]">
                      Menyesuaikan substitusi terigu, kebutuhan hidrasi, serta porsi {portionSize}.
                    </p>
                  </div>
                ) : aiRecipe ? (
                  <div className="flex h-full flex-col justify-between rounded-2xl border border-[#3B5B3D]/30 bg-[#FAF8F5] p-6 sm:p-7">
                    <div>
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="rounded-full bg-[#4E9A34] px-3 py-1 text-[11px] font-bold text-white">
                          AI Matched • {aiRecipe.dishType}
                        </span>
                        <div className="flex items-center gap-3 text-xs font-semibold text-[#5C4B42]">
                          <span>{aiRecipe.servings}</span>
                          <span>•</span>
                          <span>{aiRecipe.cookTime}</span>
                        </div>
                      </div>

                      <h3 className="mt-3 font-serif text-2xl font-bold text-[#2C1E18]">
                        {aiRecipe.title}
                      </h3>
                      <p className="mt-1 text-xs text-[#6E5C52]">
                        {aiRecipe.tagline}
                      </p>

                      {/* Substitution Callout */}
                      <div className="mt-4 rounded-xl bg-white p-3.5 border border-[#3B5B3D]/20">
                        <div className="flex items-center gap-2 text-xs font-bold text-[#3B5B3D]">
                          <Scale className="h-4 w-4" />
                          Substitusi Terigu ke Tepung Kelapa
                        </div>
                        <div className="mt-2 flex items-center gap-2 text-xs font-bold">
                          <span className="line-through text-[#8C7A6B]">
                            {aiRecipe.wheatEquivalent}
                          </span>
                          <ArrowRight className="h-3.5 w-3.5 text-[#3B5B3D]" />
                          <span className="text-[#3B5B3D] bg-[#3B5B3D]/10 px-2 py-0.5 rounded-md">
                            {aiRecipe.coconutFlourAmount}
                          </span>
                        </div>
                        <p className="mt-2 text-[11px] text-[#6E5C52]">
                          {aiRecipe.hydrationTip}
                        </p>
                      </div>

                      {/* Ingredients & Steps */}
                      <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                        <div>
                          <p className="font-bold text-[#2C1E18] uppercase tracking-wider text-[11px]">
                            Bahan-Bahan:
                          </p>
                          <ul className="mt-2 space-y-1 text-[#5C4B42]">
                            {aiRecipe.ingredients.map((ing) => (
                              <li key={ing} className="flex items-start gap-1.5">
                                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#3B5B3D] shrink-0" />
                                <span>{ing}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <p className="font-bold text-[#2C1E18] uppercase tracking-wider text-[11px]">
                            Langkah Pembuatan:
                          </p>
                          <ol className="mt-2 space-y-1 text-[#5C4B42]">
                            {aiRecipe.steps.map((st, i) => (
                              <li key={st} className="flex items-start gap-1.5">
                                <span className="font-bold text-[#3B5B3D] shrink-0">
                                  {i + 1}.
                                </span>
                                <span>{st}</span>
                              </li>
                            ))}
                          </ol>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-[#E5DEC9] flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold text-[#2C1E18]">
                          {coconutFlourProduct.name}
                        </p>
                        <p className="text-[11px] text-[#6E5C52]">
                          Rp {coconutFlourProduct.price.toLocaleString('id-ID')}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          addToCart(coconutFlourProduct, 1);
                          setAddedFlourFeedback(true);
                          window.setTimeout(() => setAddedFlourFeedback(false), 1500);
                        }}
                        className="rounded-full bg-[#3B5B3D] px-4 py-2 text-xs font-semibold text-white hover:bg-[#2F4A31]"
                      >
                        {addedFlourFeedback ? 'Ditambahkan!' : 'Beli Tepung Kelapa'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex h-full min-h-[380px] flex-col items-center justify-center rounded-2xl border border-dashed border-[#D6CCBA] bg-[#FAF8F5] p-8 text-center">
                    <ChefHat className="h-10 w-10 text-[#3B5B3D]/60" />
                    <h3 className="mt-4 font-serif text-lg font-bold text-[#2C1E18]">
                      Siap Berkreasi dengan Resep Anda?
                    </h3>
                    <p className="mt-1.5 max-w-sm text-xs text-[#6E5C52]">
                      Pilih bahan dapur yang Anda punya di sebelah kiri, sesuaikan porsi dan preferensi rasa, lalu klik Generate AI Recipe.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* B. COCONUT FLOUR ASSISTANT CHATBOT */}
          <div className="rounded-3xl border border-[#E5DEC9] bg-white p-6 sm:p-10 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F0EAE0] pb-5">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#3B5B3D]/10 px-3 py-1 text-xs font-semibold text-[#3B5B3D]">
                  <MessageSquare className="h-3.5 w-3.5" />
                  24/7 Baking AI Chatbot
                </span>
                <h3 className="mt-2 font-serif text-2xl font-bold text-[#2C1E18]">
                  Coconut Flour Assistant
                </h3>
                <p className="text-xs text-[#6E5C52]">
                  Tanyakan hal apa pun seputar penggunaan tepung kelapa, tips hidrasi, atau komparasi tepung gandum.
                </p>
              </div>
            </div>

            {/* Quick Question Chips */}
            <div className="mt-4 flex flex-wrap gap-2">
              {PRESET_CHAT_QUESTIONS.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => handleSendChat(q)}
                  className="rounded-full bg-[#FAF8F5] border border-[#E5DEC9] px-3 py-1.5 text-xs text-[#5C4B42] hover:bg-[#EAE4D6] transition"
                >
                  💬 {q}
                </button>
              ))}
            </div>

            {/* Chat Box */}
            <div className="mt-4 rounded-2xl border border-[#E5DEC9] bg-[#FAF8F5] p-4 flex flex-col h-[320px]">
              <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                {chatMessages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${
                      msg.sender === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs ${
                        msg.sender === 'user'
                          ? 'bg-[#3B5B3D] text-white rounded-tr-none'
                          : 'bg-white text-[#2C1E18] border border-[#E5DEC9] rounded-tl-none shadow-2xs'
                      }`}
                    >
                      <p className="leading-relaxed">{msg.text}</p>
                      <span
                        className={`block text-[9px] mt-1 text-right ${
                          msg.sender === 'user'
                            ? 'text-white/70'
                            : 'text-[#8C7A6B]'
                        }`}
                      >
                        {msg.time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-3 pt-3 border-t border-[#E5DEC9] flex items-center gap-2">
                <input
                  type="text"
                  value={inputChat}
                  onChange={(e) => setInputChat(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                  placeholder="Ketik pertanyaan seputar baking coconut flour..."
                  className="flex-1 rounded-full border border-[#D6CCBA] bg-white px-4 py-2 text-xs text-[#2C1E18] focus:border-[#3B5B3D] focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => handleSendChat()}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-[#3B5B3D] text-white hover:bg-[#2F4A31]"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 2: RECIPEHUB (Collection, Categories, Search, Favorites)
           ========================================================================= */}
        <section className="border-t border-[#E5DEC9] bg-[#EFECE3]/50 py-14 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#3B5B3D]">
                  <BookOpen className="h-3.5 w-3.5" />
                  Recipe Collection
                </span>
                <h2 className="mt-2 font-serif text-3xl font-bold text-[#2C1E18] sm:text-4xl">
                  RecipeHub: Kreasi Olahan Tepung Kelapa
                </h2>
                <p className="mt-1.5 max-w-2xl text-xs sm:text-sm text-[#6E5C52]">
                  Koleksi resep kue kering, bolu, pancake, hingga camilan sehat berbasis 100% tepung ampas kelapa upcycled. Simpan resep favorit ke akun Anda!
                </p>
              </div>

              {/* Favorites Count Badge */}
              <div className="flex items-center gap-2 text-xs font-semibold bg-white border border-[#E5DEC9] px-3.5 py-1.5 rounded-full shadow-2xs">
                <Heart className="h-3.5 w-3.5 fill-[#C2410C] text-[#C2410C]" />
                <span>{userProfile.favoriteRecipeIds.length} Resep Favorit</span>
              </div>
            </div>

            {/* Category Tabs & Search */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="flex flex-wrap gap-2">
                {RECIPE_CATEGORIES.map((cat) => (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => setRecipeCategory(cat.value)}
                    className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                      recipeCategory === cat.value
                        ? 'bg-[#3B5B3D] text-white shadow-xs'
                        : 'bg-white border border-[#D6CCBA] text-[#5C4B42] hover:bg-[#FAF8F5]'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              <div className="relative w-full sm:max-w-xs">
                <Search className="pointer-events-none absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-[#8C7A6B]" />
                <input
                  type="text"
                  value={recipeSearch}
                  onChange={(e) => setRecipeSearch(e.target.value)}
                  placeholder="Cari nama resep atau bahan..."
                  className="w-full rounded-full border border-[#D6CCBA] bg-white py-2 pr-4 pl-9 text-xs text-[#2C1E18] focus:border-[#3B5B3D] focus:outline-none"
                />
              </div>
            </div>

            {/* Recipe Cards Grid */}
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredRecipes.map((recipe, idx) => {
                const isFavorite = userProfile.favoriteRecipeIds.includes(
                  recipe.id
                );

                return (
                  <Reveal key={recipe.id} delayMs={idx * 60}>
                    <article className="group flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-[#E5DEC9] bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[#CFC5B1] hover:shadow-md">
                      <div>
                        {/* Top Meta & Heart */}
                        <div className="flex items-center justify-between gap-2">
                          <span className="rounded-full bg-[#3B5B3D]/10 px-3 py-1 text-[11px] font-bold text-[#3B5B3D]">
                            {recipe.category}
                          </span>
                          <button
                            type="button"
                            onClick={() => toggleFavoriteRecipe(recipe.id)}
                            aria-label="Simpan favorit"
                            className="p-1 rounded-full text-[#8C7A6B] hover:text-[#C2410C] transition"
                          >
                            <Heart
                              className={`h-4 w-4 ${
                                isFavorite
                                  ? 'fill-[#C2410C] text-[#C2410C]'
                                  : ''
                              }`}
                            />
                          </button>
                        </div>

                        <h3 className="mt-3.5 text-lg font-bold text-[#2C1E18] group-hover:text-[#3B5B3D] transition-colors">
                          {recipe.title}
                        </h3>
                        <p className="mt-1 text-xs text-[#6E5C52] line-clamp-2 leading-relaxed">
                          {recipe.summary}
                        </p>

                        <div className="mt-4 flex items-center gap-3 text-[11px] font-semibold text-[#8C7A6B]">
                          <span className="inline-flex items-center gap-1">
                            <Clock className="h-3 w-3 text-[#3B5B3D]" />
                            {recipe.prepTime}
                          </span>
                          <span>•</span>
                          <span className="inline-flex items-center gap-1">
                            <Flame className="h-3 w-3 text-[#4E9A34]" />
                            {recipe.calories} kcal
                          </span>
                          <span>•</span>
                          <span className="rounded-md bg-[#FAF8F5] px-2 py-0.5 border border-[#E5DEC9] text-[#3B5B3D]">
                            {recipe.difficulty}
                          </span>
                        </div>
                      </div>

                      <div className="mt-5 pt-4 border-t border-[#F0EAE0] flex items-center justify-between">
                        <span className="text-[11px] font-medium text-[#6E5C52]">
                          {recipe.coconutFlourUsed}
                        </span>
                        <button
                          type="button"
                          onClick={() => setActiveRecipeModal(recipe)}
                          className="text-xs font-bold text-[#3B5B3D] hover:underline"
                        >
                          Lihat Resep Detail →
                        </button>
                      </div>
                    </article>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 3: COCONUT PICKUP (About, Guidelines, Request, Supplier Register, Tracking)
           ========================================================================= */}
        <section id="pickup" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#3B5B3D]/10 px-3.5 py-1 text-xs font-semibold text-[#3B5B3D]">
              <Truck className="h-3.5 w-3.5" />
              Sistem Penjemputan Ampas Kelapa
            </span>
            <h2 className="font-serif text-3xl font-bold text-[#2C1E18] sm:text-4xl">
              Coconut Pickup &amp; Supplier Ecosystem
            </h2>
            <p className="text-xs sm:text-sm text-[#6E5C52]">
              Solusi logistik sirkular terpadu untuk produsen santan dan pedagang kelapa parut lokal dalam mendistribusikan residu kelapa secara higienis dan bernilai ekonomis.
            </p>
          </div>

          {/* Pickup Navigation Tabs */}
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {[
              { id: 'request', label: 'Ajukan Penjemputan' },
              { id: 'register', label: 'Daftar Mitra Pemasok' },
              { id: 'tracking', label: 'Status & Dashboard Pemasok' },
              { id: 'guidelines', label: 'Panduan & Standar Mutu' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() =>
                  setActivePickupTab(
                    tab.id as 'request' | 'register' | 'tracking' | 'guidelines'
                  )
                }
                className={`rounded-full px-5 py-2.5 text-xs font-bold transition ${
                  activePickupTab === tab.id
                    ? 'bg-[#3B5B3D] text-white shadow-xs'
                    : 'bg-white border border-[#D6CCBA] text-[#5C4B42] hover:bg-[#FAF8F5]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* TAB 1: PICKUP REQUEST FORM */}
          {activePickupTab === 'request' && (
            <div className="mt-8 rounded-3xl border border-[#E5DEC9] bg-white p-6 sm:p-10 shadow-xs max-w-2xl mx-auto">
              <h3 className="font-serif text-2xl font-bold text-[#2C1E18]">
                Formulir Permintaan Penjemputan (Pickup Request)
              </h3>
              <p className="mt-1 text-xs text-[#6E5C52]">
                Ajukan permintaan jadwal penjemputan ampas kelapa. Tim logistik CORA akan melakukan konfirmasi dan tiba di lokasi Anda.
              </p>

              {pickupSuccessMsg && (
                <div className="mt-4 rounded-2xl bg-[#4E9A34]/10 border border-[#4E9A34]/30 p-4 text-xs font-medium text-[#2F611F] flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  <span>{pickupSuccessMsg}</span>
                </div>
              )}

              <form onSubmit={handlePickupSubmit} className="mt-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#2C1E18]">
                    Nama Pemasok / Usaha
                  </label>
                  <input
                    type="text"
                    required
                    value={pickupSupplierName}
                    onChange={(e) => setPickupSupplierName(e.target.value)}
                    placeholder="misal: Kelapa Segar Barokah"
                    className="mt-1 w-full rounded-xl border border-[#D6CCBA] bg-[#FAF8F5] p-3 text-xs text-[#2C1E18] focus:border-[#3B5B3D] focus:bg-white focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#2C1E18]">
                      Nomor WhatsApp
                    </label>
                    <input
                      type="tel"
                      required
                      value={pickupPhone}
                      onChange={(e) => setPickupPhone(e.target.value)}
                      placeholder="misal: 08123456789"
                      className="mt-1 w-full rounded-xl border border-[#D6CCBA] bg-[#FAF8F5] p-3 text-xs text-[#2C1E18] focus:border-[#3B5B3D] focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#2C1E18]">
                      Jumlah Ampas Kelapa (kg)
                    </label>
                    <input
                      type="number"
                      required
                      min={10}
                      value={pickupKg}
                      onChange={(e) => setPickupKg(e.target.value)}
                      placeholder="Minimal 10 kg"
                      className="mt-1 w-full rounded-xl border border-[#D6CCBA] bg-[#FAF8F5] p-3 text-xs text-[#2C1E18] focus:border-[#3B5B3D] focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#2C1E18]">
                    Lokasi / Alamat Penjemputan
                  </label>
                  <input
                    type="text"
                    required
                    value={pickupLocation}
                    onChange={(e) => setPickupLocation(e.target.value)}
                    placeholder="Alamat lengkap kios/pabrik santan Anda"
                    className="mt-1 w-full rounded-xl border border-[#D6CCBA] bg-[#FAF8F5] p-3 text-xs text-[#2C1E18] focus:border-[#3B5B3D] focus:bg-white focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#2C1E18]">
                      Tanggal Penjemputan
                    </label>
                    <input
                      type="date"
                      required
                      value={pickupDate}
                      onChange={(e) => setPickupDate(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-[#D6CCBA] bg-[#FAF8F5] p-3 text-xs text-[#2C1E18] focus:border-[#3B5B3D] focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#2C1E18]">
                      Waktu Penjemputan
                    </label>
                    <select
                      value={pickupTime}
                      onChange={(e) => setPickupTime(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-[#D6CCBA] bg-[#FAF8F5] p-3 text-xs text-[#2C1E18] focus:border-[#3B5B3D] focus:bg-white focus:outline-none"
                    >
                      <option>08:00 - 10:00 WITA (Pagi)</option>
                      <option>11:00 - 13:00 WITA (Siang)</option>
                      <option>15:00 - 17:00 WITA (Sore)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#2C1E18]">
                    Catatan Tambahan (Opsional)
                  </label>
                  <textarea
                    rows={2}
                    value={pickupNotes}
                    onChange={(e) => setPickupNotes(e.target.value)}
                    placeholder="misal: Ampas disimpan di tong bersih biru samping kios"
                    className="mt-1 w-full rounded-xl border border-[#D6CCBA] bg-[#FAF8F5] p-3 text-xs text-[#2C1E18] focus:border-[#3B5B3D] focus:bg-white focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-full bg-[#3B5B3D] py-3.5 text-xs font-bold text-white shadow-sm hover:bg-[#2F4A31] transition"
                >
                  Kirim Permintaan Penjemputan
                </button>
              </form>
            </div>
          )}

          {/* TAB 2: BECOME OUR SUPPLIER FORM */}
          {activePickupTab === 'register' && (
            <div className="mt-8 rounded-3xl border border-[#E5DEC9] bg-white p-6 sm:p-10 shadow-xs max-w-2xl mx-auto">
              <h3 className="font-serif text-2xl font-bold text-[#2C1E18]">
                Daftar Menjadi Mitra Pemasok (Become Our Supplier)
              </h3>
              <p className="mt-1 text-xs text-[#6E5C52]">
                Bergabunglah sebagai pemasok ampas kelapa resmi CORA untuk mendapatkan pendapatan tambahan, jadwal pickup rutin, dan sertifikat mitra sirkular.
              </p>

              {regSuccessMsg && (
                <div className="mt-4 rounded-2xl bg-[#4E9A34]/10 border border-[#4E9A34]/30 p-4 text-xs font-medium text-[#2F611F] flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  <span>{regSuccessMsg}</span>
                </div>
              )}

              <form onSubmit={handleRegisterSupplierSubmit} className="mt-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#2C1E18]">
                      Nama Pemasok / Pemilik
                    </label>
                    <input
                      type="text"
                      required
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="misal: Pak Wayan / Santan Jaya"
                      className="mt-1 w-full rounded-xl border border-[#D6CCBA] bg-[#FAF8F5] p-3 text-xs text-[#2C1E18] focus:border-[#3B5B3D] focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#2C1E18]">
                      Nomor WhatsApp
                    </label>
                    <input
                      type="tel"
                      required
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      placeholder="misal: 08123456789"
                      className="mt-1 w-full rounded-xl border border-[#D6CCBA] bg-[#FAF8F5] p-3 text-xs text-[#2C1E18] focus:border-[#3B5B3D] focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#2C1E18]">
                    Alamat atau Lokasi Usaha
                  </label>
                  <input
                    type="text"
                    required
                    value={regLocation}
                    onChange={(e) => setRegLocation(e.target.value)}
                    placeholder="misal: Pasar Kumbasari Kios No. 12, Denpasar"
                    className="mt-1 w-full rounded-xl border border-[#D6CCBA] bg-[#FAF8F5] p-3 text-xs text-[#2C1E18] focus:border-[#3B5B3D] focus:bg-white focus:outline-none"
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
                      className="mt-1 w-full rounded-xl border border-[#D6CCBA] bg-[#FAF8F5] p-3 text-xs text-[#2C1E18] focus:border-[#3B5B3D] focus:bg-white focus:outline-none"
                    >
                      <option>Kios Santan Pasar</option>
                      <option>Pengolahan Kelapa Parut</option>
                      <option>Industri Kue &amp; Santan</option>
                      <option>Rumah Makan / Katering</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#2C1E18]">
                      Estimasi Ampas (kg/minggu)
                    </label>
                    <input
                      type="number"
                      required
                      min={10}
                      value={regEstimatedKg}
                      onChange={(e) => setRegEstimatedKg(e.target.value)}
                      placeholder="misal: 80"
                      className="mt-1 w-full rounded-xl border border-[#D6CCBA] bg-[#FAF8F5] p-3 text-xs text-[#2C1E18] focus:border-[#3B5B3D] focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#2C1E18]">
                      Frekuensi Produksi
                    </label>
                    <select
                      value={regFrequency}
                      onChange={(e) => setRegFrequency(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-[#D6CCBA] bg-[#FAF8F5] p-3 text-xs text-[#2C1E18] focus:border-[#3B5B3D] focus:bg-white focus:outline-none"
                    >
                      <option>Setiap Hari</option>
                      <option>3x Seminggu</option>
                      <option>Mingguan</option>
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
          {activePickupTab === 'tracking' && (
            <div className="mt-8 space-y-6 max-w-4xl mx-auto">
              {/* Dashboard Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="rounded-2xl bg-white p-5 border border-[#E5DEC9] shadow-2xs">
                  <span className="text-[11px] font-bold text-[#3B5B3D] uppercase">
                    Mitra Terdaftar
                  </span>
                  <p className="mt-2 font-serif text-3xl font-bold text-[#2C1E18]">
                    {suppliers.length} <span className="text-xs font-normal text-[#6E5C52]">kios/usaha</span>
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
                    {pickupRequests
                      .filter((r) => r.status === 'COMPLETED')
                      .reduce((sum, r) => sum + r.estimatedKg, 0)}{' '}
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
                    ~{(
                      pickupRequests
                        .filter((r) => r.status === 'COMPLETED')
                        .reduce((sum, r) => sum + r.estimatedKg, 0) * 1.8
                    ).toFixed(0)}{' '}
                    <span className="text-xs font-normal text-[#6E5C52]">kg CO₂e</span>
                  </p>
                  <p className="mt-1 text-[11px] text-[#8C7A6B]">
                    Akumulasi kontribusi lingkungan
                  </p>
                </div>
              </div>

              {/* Status List */}
              <div className="rounded-3xl border border-[#E5DEC9] bg-white p-6 sm:p-8 shadow-xs">
                <h4 className="font-serif text-xl font-bold text-[#2C1E18]">
                  Riwayat &amp; Pelacakan Status Penjemputan (Pickup Tracking)
                </h4>
                <p className="mt-1 text-xs text-[#6E5C52]">
                  Status tahapan: <strong>Request Submitted → Request Confirmed → On the Way → Picked Up → Completed</strong>.
                </p>

                <div className="mt-6 divide-y divide-[#F0EAE0]">
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
                            Jadwal: {req.preferredDate} ({req.preferredTime || 'Pagi'}) • Estimasi: <strong>{req.estimatedKg} kg</strong>
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

          {/* TAB 4: GUIDELINES & STANDAR MUTU */}
          {activePickupTab === 'guidelines' && (
            <div className="mt-8 rounded-3xl border border-[#E5DEC9] bg-white p-6 sm:p-10 shadow-xs max-w-3xl mx-auto space-y-6">
              <div>
                <h3 className="font-serif text-2xl font-bold text-[#2C1E18]">
                  Supplier Guidelines &amp; Standar Mutu Ampas Kelapa
                </h3>
                <p className="mt-1 text-xs text-[#6E5C52]">
                  Untuk menjaga kualitas tepung pangan higienis CORA, pastikan ampas kelapa yang diserahkan memenuhi kriteria berikut:
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="rounded-2xl bg-[#FAF8F5] p-5 border border-[#E5DEC9]">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#3B5B3D]/10 text-[#3B5B3D] font-bold">
                    1
                  </span>
                  <h4 className="mt-3 font-bold text-[#2C1E18]">Kebersihan Bahan</h4>
                  <p className="mt-1 text-[#6E5C52] leading-relaxed">
                    Ampas kelapa harus bersih dari serabut kasar, tempurung kelapa hitam, atau benda asing lainnya.
                  </p>
                </div>

                <div className="rounded-2xl bg-[#FAF8F5] p-5 border border-[#E5DEC9]">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#3B5B3D]/10 text-[#3B5B3D] font-bold">
                    2
                  </span>
                  <h4 className="mt-3 font-bold text-[#2C1E18]">Kondisi Bahan Segar</h4>
                  <p className="mt-1 text-[#6E5C52] leading-relaxed">
                    Hasil parutan santan hari yang sama (&lt;12 jam), tidak berlendir, tidak berbau asam/tengik, dan tidak berjamur.
                  </p>
                </div>

                <div className="rounded-2xl bg-[#FAF8F5] p-5 border border-[#E5DEC9]">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#3B5B3D]/10 text-[#3B5B3D] font-bold">
                    3
                  </span>
                  <h4 className="mt-3 font-bold text-[#2C1E18]">Ketentuan Penyimpanan</h4>
                  <p className="mt-1 text-[#6E5C52] leading-relaxed">
                    Disimpan dalam wadah plastik atau tong bersih tertutup, di tempat teduh dan sejuk sebelum dijemput armada CORA.
                  </p>
                </div>
              </div>

              <div className="rounded-2xl bg-[#4E9A34]/10 p-4 border border-[#4E9A34]/20 text-xs text-[#2F611F] flex items-start gap-3">
                <Info className="h-5 w-5 shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-bold">Mengapa standar ini penting?</strong>
                  Ampas kelapa yang Anda serahkan akan langsung diolah menjadi tepung pangan bernilai tinggi (konsumsi manusia). Menjaga higienitas adalah kunci kesuksesan bersama.
                </div>
              </div>
            </div>
          )}
        </section>
      </main>

      {/* RECIPE DETAILS MODAL */}
      {activeRecipeModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-cora-fade-in"
        >
          <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-[#FAF8F5] p-6 sm:p-8 shadow-2xl border border-[#E5DEC9]">
            <button
              type="button"
              onClick={() => setActiveRecipeModal(null)}
              aria-label="Tutup detail resep"
              className="absolute top-5 right-5 flex h-9 w-9 items-center justify-center rounded-full bg-white border border-[#E5DEC9] text-[#2C1E18] hover:bg-[#EAE4D6] transition"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-[#3B5B3D] px-3 py-1 text-[11px] font-bold text-white">
                  {activeRecipeModal.category}
                </span>
                <span className="rounded-full bg-white border border-[#D6CCBA] px-3 py-1 text-[11px] font-bold text-[#3B5B3D]">
                  {activeRecipeModal.difficulty}
                </span>
              </div>

              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#2C1E18]">
                {activeRecipeModal.title}
              </h2>

              <p className="text-xs sm:text-sm text-[#5C4B42] leading-relaxed">
                {activeRecipeModal.summary}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-[#6E5C52] py-2 border-y border-[#E5DEC9]">
                <span>⏱️ Waktu Persiapan: {activeRecipeModal.prepTime}</span>
                <span>🔥 Waktu Masak: {activeRecipeModal.cookTime}</span>
                <span>🍽️ Porsi: {activeRecipeModal.servings}</span>
                <span>⚡ Kalori: {activeRecipeModal.calories} kcal</span>
              </div>

              {/* Flour highlight */}
              <div className="rounded-xl bg-white p-3 border border-[#3B5B3D]/30 flex items-center gap-2 text-xs font-bold text-[#3B5B3D]">
                <Sparkles className="h-4 w-4" />
                <span>Penggunaan: {activeRecipeModal.coconutFlourUsed}</span>
              </div>

              {/* Ingredients & Steps */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs pt-2">
                <div>
                  <h3 className="font-bold text-[#2C1E18] uppercase tracking-wider text-xs">
                    Daftar Bahan &amp; Takaran:
                  </h3>
                  <ul className="mt-2.5 space-y-1.5 text-[#5C4B42]">
                    {activeRecipeModal.ingredients.map((ing) => (
                      <li key={ing} className="flex items-start gap-1.5">
                        <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#3B5B3D] shrink-0" />
                        <span>{ing}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-bold text-[#2C1E18] uppercase tracking-wider text-xs">
                    Langkah-Langkah Pembuatan:
                  </h3>
                  <ol className="mt-2.5 space-y-2 text-[#5C4B42]">
                    {activeRecipeModal.steps.map((st, i) => (
                      <li key={st} className="flex items-start gap-2">
                        <span className="font-bold text-[#3B5B3D] shrink-0">
                          {i + 1}.
                        </span>
                        <span className="leading-relaxed">{st}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>

              <div className="pt-4 border-t border-[#E5DEC9] flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    toggleFavoriteRecipe(activeRecipeModal.id);
                  }}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#C2410C] hover:underline"
                >
                  <Heart
                    className={`h-4 w-4 ${
                      userProfile.favoriteRecipeIds.includes(activeRecipeModal.id)
                        ? 'fill-[#C2410C]'
                        : ''
                    }`}
                  />
                  <span>
                    {userProfile.favoriteRecipeIds.includes(activeRecipeModal.id)
                      ? 'Tersimpan di Favorit'
                      : 'Simpan ke Resep Favorit'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    addToCart(coconutFlourProduct, 1);
                    setActiveRecipeModal(null);
                  }}
                  className="rounded-full bg-[#3B5B3D] px-5 py-2 text-xs font-bold text-white hover:bg-[#2F4A31]"
                >
                  Beli Tepung Kelapa Ini
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
