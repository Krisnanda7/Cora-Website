'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  BookOpen,
  Calendar,
  Check,
  ChefHat,
  Clock,
  Flame,
  Leaf,
  Loader2,
  MapPin,
  Phone,
  Scale,
  ShoppingBag,
  Sparkles,
  Truck,
  User,
  X,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useCora } from '@/context/CoraContext';
import type { PickupRequestStatus } from '@/types/cora';

type DishType = 'Cookies' | 'Muffin' | 'Pancake' | 'Brownies';

interface GeneratedRecipe {
  title: string;
  dishType: DishType;
  tagline: string;
  prepTime: string;
  servings: string;
  caloriesPerServing: number;
  fiberGrams: number;
  wheatEquivalent: string;
  coconutFlourAmount: string;
  hydrationTip: string;
  ingredients: string[];
  steps: string[];
}

interface HubRecipe {
  id: string;
  title: string;
  category: DishType | 'Snack';
  prepTime: string;
  servings: string;
  calories: number;
  coconutFlourUsed: string;
  summary: string;
  ingredients: string[];
  steps: string[];
}

const HOME_INGREDIENTS = [
  'Telur',
  'Pisang',
  'Dark Chocolate',
  'Susu Oat',
  'Gula Aren',
  'Minyak Kelapa',
  'Madu',
  'Kayu Manis',
] as const;

const DISH_TYPES: { id: DishType; label: string; subtitle: string }[] = [
  { id: 'Cookies', label: 'Cookies', subtitle: 'Renyah di luar, chewy di dalam' },
  { id: 'Muffin', label: 'Muffin', subtitle: 'Lembut & tinggi serat' },
  { id: 'Pancake', label: 'Pancake', subtitle: 'Sarapan sehat cepat saji' },
  { id: 'Brownies', label: 'Brownies', subtitle: 'Fudgy & kaya rasa cokelat' },
];

const HUB_RECIPES: HubRecipe[] = [
  {
    id: 'rec-fudgy-brownies',
    title: 'Fudgy Coconut Dark Choco Brownies',
    category: 'Brownies',
    prepTime: '35 menit',
    servings: '9 potong',
    calories: 165,
    coconutFlourUsed: '65g CORA Coconut Flour',
    summary:
      'Brownies cokelat pekat tanpa tepung terigu dengan tekstur fudgy alami berkat serat halus tepung kelapa CORA.',
    ingredients: [
      '65g CORA Upcycled Coconut Flour',
      '120g Dark Chocolate 70%, lelehkan',
      '3 butir Telur ayam suhu ruang',
      '75g Gula Aren bubuk',
      '60ml Minyak kelapa atau butter cair',
      '1/2 sdt Ekstrak vanila & sejumput garam laut',
    ],
    steps: [
      'Panaskan oven di suhu 175°C dan alasi loyang 18x18 cm dengan baking paper.',
      'Kocok telur dan gula aren hingga berbusa ringan sekitar 2 menit.',
      'Masukkan dark chocolate leleh dan minyak kelapa, aduk rata.',
      'Ayak CORA Upcycled Coconut Flour beserta garam, lalu aduk lipat perlahan hingga adonan homogen.',
      'Panggang selama 22–25 menit hingga permukaan berkilau dan bagian tengah tetap lembap.',
    ],
  },
  {
    id: 'rec-banana-pancake',
    title: 'Fluffy Banana Oat Coconut Pancakes',
    category: 'Pancake',
    prepTime: '15 menit',
    servings: '6 pancake',
    calories: 140,
    coconutFlourUsed: '45g CORA Coconut Flour',
    summary:
      'Pancake sarapan tinggi serat berpadu manis alami pisang matang dan susu oat yang mengenyangkan lebih lama.',
    ingredients: [
      '45g CORA Upcycled Coconut Flour',
      '1 buah Pisang Cavendish matang, haluskan',
      '2 butir Telur',
      '100ml Susu Oat hangat',
      '1 sdt Baking powder',
      '1/2 sdt Kayu manis bubuk',
    ],
    steps: [
      'Haluskan pisang di mangkuk besar, lalu campurkan telur dan susu oat hingga rata.',
      'Masukkan CORA Upcycled Coconut Flour, baking powder, dan kayu manis. Diamkan 3 menit agar tepung menyerap cairan.',
      'Panaskan teflon anti lengket dengan api kecil-sedang.',
      'Tuang 1 sendok sayur adonan, masak 2 menit per sisi hingga keemasan. Sajikan dengan madu atau potongan buah.',
    ],
  },
  {
    id: 'rec-chocochip-cookies',
    title: 'Artisanal Palm Sugar Coconut Cookies',
    category: 'Cookies',
    prepTime: '25 menit',
    servings: '14 keping',
    calories: 120,
    coconutFlourUsed: '55g CORA Coconut Flour',
    summary:
      'Cookies rendah indeks glikemik dengan wangi karamel gula aren dan potongan dark chocolate yang lumer.',
    ingredients: [
      '55g CORA Upcycled Coconut Flour',
      '2 butir Telur',
      '65g Gula Aren halus',
      '60g Minyak kelapa / unsalted butter',
      '70g Dark Chocolate cincang',
      '1/2 sdt Baking soda & 1 sdt vanila',
    ],
    steps: [
      'Campurkan minyak kelapa, gula aren, telur, dan vanila hingga lembut.',
      'Masukkan CORA Upcycled Coconut Flour dan baking soda, aduk rata hingga adonan bisa dipulung.',
      'Tambahkan dark chocolate cincang, diamkan 5 menit.',
      'Bentuk bulat pipih di atas loyang, panggang 12–14 menit di suhu 170°C hingga pinggirannya renyah.',
    ],
  },
  {
    id: 'rec-oat-muffin',
    title: 'Double Choco Oat Coconut Muffins',
    category: 'Muffin',
    prepTime: '30 menit',
    servings: '8 muffin',
    calories: 155,
    coconutFlourUsed: '60g CORA Coconut Flour',
    summary:
      'Muffin lembut bebas terigu dengan perpaduan susu oat, dark chocolate, dan tepung kelapa kaya serat.',
    ingredients: [
      '60g CORA Upcycled Coconut Flour',
      '3 butir Telur',
      '120ml Susu Oat',
      '60g Gula Aren atau Madu',
      '25g Cokelat bubuk tanpa gula',
      '50g Dark Chocolate chips',
    ],
    steps: [
      'Panaskan oven pada 180°C dan siapkan 8 cup muffin.',
      'Kocok telur, susu oat, dan gula aren/madu hingga tercampur rata.',
      'Ayak CORA Coconut Flour dan cokelat bubuk, masukkan ke campuran basah lalu aduk rata.',
      'Taburi dark chocolate chips di atas adonan dan panggang selama 20 menit hingga matang merata.',
    ],
  },
];

function buildAiRecipe(
  dishType: DishType,
  selectedIngredients: string[]
): GeneratedRecipe {
  const has = (item: string) => selectedIngredients.includes(item);
  const activeExtras =
    selectedIngredients.length > 0
      ? selectedIngredients
      : ['Telur', 'Susu Oat', 'Gula Aren'];

  const sweetener = has('Gula Aren')
    ? '65g Gula Aren bubuk'
    : has('Madu')
    ? '60ml Madu murni'
    : '60g Gula kelapa / gula aren';

  const liquid = has('Susu Oat')
    ? '110ml Susu Oat'
    : '100ml Susu nabati / air hangat';

  const fat = has('Minyak Kelapa')
    ? '55ml Minyak kelapa murni'
    : '55g Butter leleh / minyak kelapa';

  const eggLine = has('Telur')
    ? '3 butir Telur (pengikat alami serat kelapa)'
    : '2 butir Telur atau 2 sdm chia egg (pengikat adonan)';

  const flavorNotes: string[] = [];
  if (has('Pisang')) flavorNotes.push('1 buah Pisang matang (haluskan)');
  if (has('Dark Chocolate'))
    flavorNotes.push('75g Dark Chocolate 70% (cincang / lelehkan)');
  if (has('Kayu Manis')) flavorNotes.push('1/2 sdt Kayu manis bubuk');

  if (dishType === 'Brownies') {
    return {
      title: has('Pisang')
        ? 'CORA Banana Dark Choco Fudge Brownies'
        : 'CORA Artisanal Coconut Fudge Brownies',
      dishType,
      tagline: `Racikan brownies fudgy rendah tepung terigu dengan ${activeExtras.slice(0, 3).join(', ')}.`,
      prepTime: '32 menit',
      servings: '9 potong',
      caloriesPerServing: has('Dark Chocolate') ? 172 : 148,
      fiberGrams: 5.4,
      wheatEquivalent: '180g Tepung Terigu',
      coconutFlourAmount: '60g CORA Upcycled Coconut Flour',
      hydrationTip:
        'Rasio substitusi 1 : 3. Gunakan 60g tepung kelapa CORA menggantikan 180g terigu dengan tambahan cairan & telur agar tekstur tetap fudgy.',
      ingredients: [
        '60g CORA Upcycled Coconut Flour',
        eggLine,
        sweetener,
        fat,
        '25g Cokelat bubuk murni',
        ...flavorNotes,
      ],
      steps: [
        'Panaskan oven 175°C dan siapkan loyang 18x18 cm berlapis kertas roti.',
        'Kocok telur bersama pemanis pilihan hingga sedikit mengembang, lalu tuang lemak dan bahan cair.',
        'Ayak CORA Upcycled Coconut Flour bersama cokelat bubuk, aduk lipat hingga menyatu.',
        'Tambahkan potongan dark chocolate atau pisang halus jika dipilih, panggang 22–25 menit.',
      ],
    };
  }

  if (dishType === 'Cookies') {
    return {
      title: has('Dark Chocolate')
        ? 'CORA Choco-Chunk Coconut Cookies'
        : 'CORA Crispy Golden Coconut Cookies',
      dishType,
      tagline: `Cookies renyah tinggi serat berbasis bahan dapur pilihan Anda (${activeExtras.slice(0, 3).join(', ')}).`,
      prepTime: '24 menit',
      servings: '12 keping',
      caloriesPerServing: has('Dark Chocolate') ? 128 : 112,
      fiberGrams: 4.2,
      wheatEquivalent: '150g Tepung Terigu',
      coconutFlourAmount: '50g CORA Upcycled Coconut Flour',
      hydrationTip:
        'Substitusi 50g CORA Coconut Flour untuk 150g terigu. Diamkan adonan 5 menit sebelum dipanggang agar kelembapan terserap sempurna.',
      ingredients: [
        '50g CORA Upcycled Coconut Flour',
        eggLine,
        sweetener,
        fat,
        '1/2 sdt Baking soda',
        ...flavorNotes,
      ],
      steps: [
        'Aduk bahan basah (telur, pemanis, minyak/butter) dalam mangkuk hingga rata.',
        'Masukkan CORA Upcycled Coconut Flour dan baking soda, diamkan 5 menit agar serat mengembang.',
        'Campurkan bahan tambahan pilihan seperti dark chocolate atau kayu manis.',
        'Cetak pipih di loyang dan panggang 12–14 menit pada suhu 170°C hingga tepinya kecokelatan.',
      ],
    };
  }

  if (dishType === 'Muffin') {
    return {
      title: has('Pisang')
        ? 'CORA Banana Oat Coconut Muffins'
        : 'CORA Light & Moist Coconut Muffins',
      dishType,
      tagline: `Muffin empuk kaya serat dengan takaran presisi CORA Upcycled Coconut Flour.`,
      prepTime: '28 menit',
      servings: '8 cup',
      caloriesPerServing: 152,
      fiberGrams: 4.9,
      wheatEquivalent: '165g Tepung Terigu',
      coconutFlourAmount: '55g CORA Upcycled Coconut Flour',
      hydrationTip:
        '55g tepung kelapa CORA menggantikan 165g tepung terigu. Kombinasi susu oat dan telur menjaga remah muffin tetap ringan dan lembut.',
      ingredients: [
        '55g CORA Upcycled Coconut Flour',
        eggLine,
        liquid,
        sweetener,
        '1 sdt Baking powder',
        ...flavorNotes,
      ],
      steps: [
        'Panaskan oven 180°C dan susun cup kertas pada loyang muffin.',
        'Campurkan telur, susu oat, pemanis, dan pisang halus (bila ada) hingga rata.',
        'Ayak CORA Upcycled Coconut Flour bersama baking powder, aduk rata dan diamkan 3 menit.',
        'Tuang ke cetakan 3/4 penuh, beri topping dark chocolate jika tersedia, panggang 18–20 menit.',
      ],
    };
  }

  // Pancake
  return {
    title: has('Pisang')
      ? 'CORA Fluffy Banana Oat Coconut Pancakes'
      : 'CORA Morning Fiber Coconut Pancakes',
    dishType,
    tagline: `Pancake sarapan lembut dalam 15 menit menggunakan bahan di rumah Anda.`,
    prepTime: '15 menit',
    servings: '6 porsi mini',
    caloriesPerServing: 136,
    fiberGrams: 4.6,
    wheatEquivalent: '135g Tepung Terigu',
    coconutFlourAmount: '45g CORA Upcycled Coconut Flour',
    hydrationTip:
      '45g CORA Coconut Flour setara 135g tepung terigu. Gunakan tambahan susu oat agar adonan mudah dituang di teflon.',
    ingredients: [
      '45g CORA Upcycled Coconut Flour',
      eggLine,
      liquid,
      sweetener,
      '1 sdt Baking powder',
      ...flavorNotes,
    ],
    steps: [
      'Kocok telur, susu oat, dan pemanis dalam mangkuk hingga tercampur rata.',
      'Tambahkan CORA Upcycled Coconut Flour dan baking powder, aduk halus tanpa gumpalan.',
      'Diamkan 3 menit sampai adonan sedikit mengental, lalu panaskan wajan anti lengket dengan api kecil.',
      'Tuang adonan, masak 2 menit tiap sisi hingga keemasan dan sajikan hangat.',
    ],
  };
}

function getPickupBadge(status: PickupRequestStatus) {
  switch (status) {
    case 'PENDING':
      return {
        label: 'Menunggu Jadwal',
        className: 'bg-amber-50 text-amber-800 ring-1 ring-amber-200',
      };
    case 'SCHEDULED':
      return {
        label: 'Terjadwal Jemput',
        className: 'bg-sky-50 text-sky-800 ring-1 ring-sky-200',
      };
    case 'COMPLETED':
      return {
        label: 'Selesai Dijemput',
        className: 'bg-[#3B5B3D]/12 text-[#3B5B3D] ring-1 ring-[#3B5B3D]/25',
      };
  }
}

export default function EcosystemPage() {
  const { products, pickupRequests, addToCart, submitPickupRequest } =
    useCora();

  // 1. CORABlend AI State
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([
    'Telur',
    'Pisang',
    'Dark Chocolate',
  ]);
  const [selectedDish, setSelectedDish] = useState<DishType>('Brownies');
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiRecipe, setAiRecipe] = useState<GeneratedRecipe | null>(null);
  const [addedFlourFeedback, setAddedFlourFeedback] = useState(false);

  // 2. Recipe Hub Modal State
  const [activeHubRecipe, setActiveHubRecipe] = useState<HubRecipe | null>(
    null
  );

  // 3. Coconut Pickup Form State
  const [supplierName, setSupplierName] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [estimatedKg, setEstimatedKg] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [pickupSubmittedMsg, setPickupSubmittedMsg] = useState<string | null>(
    null
  );

  const coconutFlourProduct = useMemo(
    () =>
      products.find((p) => p.category === 'Flour') ??
      products.find((p) => p.id === 'prod-flour-500') ??
      products[0],
    [products]
  );

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
      const recipe = buildAiRecipe(selectedDish, selectedIngredients);
      setAiRecipe(recipe);
      setIsGenerating(false);
    }, 1500);
  };

  const handleBuyFlourDirect = () => {
    if (!coconutFlourProduct || coconutFlourProduct.stock <= 0) return;
    addToCart(coconutFlourProduct, 1);
    setAddedFlourFeedback(true);
    window.setTimeout(() => setAddedFlourFeedback(false), 1800);
  };

  const handlePickupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const weightNum = Number(estimatedKg);
    if (
      !supplierName.trim() ||
      !phone.trim() ||
      !location.trim() ||
      !preferredDate ||
      !Number.isFinite(weightNum) ||
      weightNum <= 0
    ) {
      return;
    }

    const created = submitPickupRequest({
      supplierName: supplierName.trim(),
      phone: phone.trim(),
      location: location.trim(),
      estimatedKg: weightNum,
      preferredDate,
    });

    setPickupSubmittedMsg(
      `Permintaan penjemputan dari ${created.supplierName} (${created.estimatedKg} kg) berhasil dijadwalkan dan langsung diteruskan ke Admin Dashboard.`
    );
    setSupplierName('');
    setPhone('');
    setLocation('');
    setEstimatedKg('');
    setPreferredDate('');
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#FAF8F5] text-[#2C1E18]">
      <Navbar />

      <main className="flex-1">
        {/* Top Hero Banner */}
        <section className="border-b border-[#E5DEC9] bg-[#E6E3D8]">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
            <div className="max-w-3xl space-y-3">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#3B5B3D]/12 px-3.5 py-1 text-xs font-semibold text-[#3B5B3D]">
                <Sparkles className="h-3.5 w-3.5" />
                CORA Digital Ecosystem
              </span>
              <h1 className="font-serif text-3xl font-bold tracking-tight text-[#2C1E18] sm:text-4xl lg:text-5xl">
                Recipe Hub, CORABlend AI &amp; Coconut Pickup
              </h1>
              <p className="text-sm leading-relaxed text-[#5C4B42] sm:text-base">
                Eksplorasi cara kreatif menggunakan tepung kelapa upcycled di
                dapur Anda atau jadwalkan penjemputan limbah ampas kelapa dari
                mitra UMKM santan lokal.
              </p>
            </div>
          </div>
        </section>

        {/* 1. CORABLEND AI - SMART COCONUT FLOUR RECIPE ASSISTANT */}
        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-[#E5DEC9] bg-white p-6 shadow-sm sm:p-10">
            <div className="flex flex-col justify-between gap-4 border-b border-[#F0EAE0] pb-6 md:flex-row md:items-end">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#3B5B3D]/10 px-3 py-1 text-xs font-semibold text-[#3B5B3D]">
                  <Sparkles className="h-3.5 w-3.5" />
                  Smart Coconut Flour Recipe Assistant
                </span>
                <h2 className="mt-2.5 font-serif text-2xl font-bold text-[#2C1E18] sm:text-3xl">
                  CORABlend AI
                </h2>
                <p className="mt-1 max-w-2xl text-sm text-[#6E5C52]">
                  Pilih bahan yang tersedia di dapur dan jenis sajian favorit
                  Anda. AI kami akan meracik takaran substitusi tepung terigu ke
                  CORA Upcycled Coconut Flour secara presisi.
                </p>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
              {/* Left Controls */}
              <div className="space-y-7 lg:col-span-6">
                {/* Ingredient Picker */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#3B5B3D]">
                    1. Pilih Bahan yang Anda Miliki di Rumah
                  </label>
                  <div className="mt-3 flex flex-wrap gap-2.5">
                    {HOME_INGREDIENTS.map((ingredient) => {
                      const active = selectedIngredients.includes(ingredient);
                      return (
                        <button
                          key={ingredient}
                          type="button"
                          onClick={() => toggleIngredient(ingredient)}
                          className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold transition sm:text-sm ${
                            active
                              ? 'bg-[#3B5B3D] text-white shadow-xs'
                              : 'bg-[#FAF8F5] text-[#2C1E18] ring-1 ring-[#E5DEC9] hover:bg-[#E6E3D8]/70'
                          }`}
                        >
                          {active && <Check className="h-3.5 w-3.5" />}
                          {ingredient}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Dish Type Picker */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#3B5B3D]">
                    2. Pilih Jenis Sajian
                  </label>
                  <div className="mt-3 grid grid-cols-2 gap-3">
                    {DISH_TYPES.map((dish) => {
                      const active = selectedDish === dish.id;
                      return (
                        <button
                          key={dish.id}
                          type="button"
                          onClick={() => setSelectedDish(dish.id)}
                          className={`rounded-2xl p-4 text-left transition ${
                            active
                              ? 'bg-[#3B5B3D]/10 ring-2 ring-[#3B5B3D]'
                              : 'bg-[#FAF8F5] ring-1 ring-[#E5DEC9] hover:bg-[#F2EDE4]'
                          }`}
                        >
                          <p className="text-sm font-bold text-[#2C1E18]">
                            {dish.label}
                          </p>
                          <p className="mt-0.5 text-xs text-[#6E5C52]">
                            {dish.subtitle}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <button
                  type="button"
                  disabled={isGenerating}
                  onClick={handleGenerateRecipe}
                  className="inline-flex w-full items-center justify-center gap-2.5 rounded-full bg-[#3B5B3D] px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#2F4A31] disabled:cursor-wait disabled:opacity-80"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Meracik Resep Cerdas...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      Generate AI Recipe
                    </>
                  )}
                </button>
              </div>

              {/* Right Result Panel */}
              <div className="lg:col-span-6">
                {isGenerating ? (
                  <div className="flex h-full min-h-[340px] flex-col items-center justify-center rounded-3xl border border-[#E5DEC9] bg-[#FAF8F5] p-8 text-center">
                    <div className="relative flex h-20 w-20 items-center justify-center">
                      <span className="absolute inset-0 animate-ping rounded-full bg-[#4E9A34]/20" />
                      <span className="relative flex h-16 w-16 items-center justify-center rounded-full bg-[#3B5B3D] text-white shadow-md">
                        <ChefHat className="h-8 w-8 animate-bounce" />
                      </span>
                    </div>
                    <h3 className="mt-5 font-serif text-xl font-bold text-[#2C1E18]">
                      CORABlend AI sedang meracik...
                    </h3>
                    <p className="mt-2 max-w-sm text-xs leading-relaxed text-[#6E5C52]">
                      Menghitung rasio hidrasi, substitusi tepung terigu ke{' '}
                      <strong>CORA Upcycled Coconut Flour</strong>, dan estimasi
                      kalori untuk {selectedDish} Anda.
                    </p>
                  </div>
                ) : aiRecipe ? (
                  <div className="flex h-full flex-col justify-between rounded-3xl border border-[#3B5B3D]/25 bg-[#FAF8F5] p-6 sm:p-7">
                    <div>
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#4E9A34] px-3 py-1 text-[11px] font-bold text-white">
                          <Sparkles className="h-3 w-3" />
                          Rekomendasi AI • {aiRecipe.dishType}
                        </span>
                        <div className="flex items-center gap-3 text-xs font-semibold text-[#5C4B42]">
                          <span className="inline-flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5 text-[#3B5B3D]" />
                            {aiRecipe.prepTime}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <Flame className="h-3.5 w-3.5 text-[#4E9A34]" />
                            {aiRecipe.caloriesPerServing} kkal / porsi
                          </span>
                        </div>
                      </div>

                      <h3 className="mt-3 font-serif text-2xl font-bold text-[#2C1E18]">
                        {aiRecipe.title}
                      </h3>
                      <p className="mt-1 text-xs text-[#6E5C52]">
                        {aiRecipe.tagline}
                      </p>

                      {/* Flour Substitution Highlight Box */}
                      <div className="mt-4 rounded-2xl border border-[#3B5B3D]/20 bg-white p-4">
                        <div className="flex items-center gap-2 text-xs font-bold text-[#3B5B3D]">
                          <Scale className="h-4 w-4" />
                          Takaran Substitusi Tepung Terigu
                        </div>
                        <div className="mt-2 flex flex-wrap items-center gap-2 text-sm font-bold text-[#2C1E18]">
                          <span className="rounded-lg bg-[#FAF8F5] px-2.5 py-1 text-xs line-through text-[#8A776C]">
                            {aiRecipe.wheatEquivalent}
                          </span>
                          <ArrowRight className="h-4 w-4 text-[#4E9A34]" />
                          <span className="rounded-lg bg-[#3B5B3D]/10 px-3 py-1 text-xs font-extrabold text-[#3B5B3D]">
                            {aiRecipe.coconutFlourAmount}
                          </span>
                        </div>
                        <p className="mt-2 text-xs leading-relaxed text-[#6E5C52]">
                          {aiRecipe.hydrationTip}
                        </p>
                      </div>

                      {/* Ingredients & Steps */}
                      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                          <p className="text-xs font-bold uppercase tracking-wider text-[#2C1E18]">
                            Bahan Racikan
                          </p>
                          <ul className="mt-2 space-y-1.5 text-xs text-[#5C4B42]">
                            {aiRecipe.ingredients.map((ing) => (
                              <li key={ing} className="flex items-start gap-2">
                                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#4E9A34]" />
                                <span>{ing}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <p className="text-xs font-bold uppercase tracking-wider text-[#2C1E18]">
                            Cara Membuat
                          </p>
                          <ol className="mt-2 space-y-1.5 text-xs text-[#5C4B42]">
                            {aiRecipe.steps.map((step, idx) => (
                              <li key={step} className="flex items-start gap-2">
                                <span className="font-bold text-[#4E9A34]">
                                  {idx + 1}.
                                </span>
                                <span>{step}</span>
                              </li>
                            ))}
                          </ol>
                        </div>
                      </div>
                    </div>

                    {/* Direct Buy Coconut Flour CTA */}
                    {coconutFlourProduct && (
                      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-[#E5DEC9] pt-4">
                        <div>
                          <p className="text-xs font-bold text-[#2C1E18]">
                            {coconutFlourProduct.name}
                          </p>
                          <p className="text-[11px] text-[#6E5C52]">
                            Rp{' '}
                            {coconutFlourProduct.price.toLocaleString('id-ID')}{' '}
                            • Hemat {coconutFlourProduct.residueSavedGram}g
                            residu
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={handleBuyFlourDirect}
                            disabled={coconutFlourProduct.stock <= 0}
                            className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2.5 text-xs font-semibold transition ${
                              addedFlourFeedback
                                ? 'bg-[#4E9A34] text-white'
                                : 'bg-[#3B5B3D] text-white hover:bg-[#2F4A31]'
                            }`}
                          >
                            {addedFlourFeedback ? (
                              <>
                                <Check className="h-3.5 w-3.5" />
                                Masuk Keranjang!
                              </>
                            ) : (
                              <>
                                <ShoppingBag className="h-3.5 w-3.5" />
                                Beli Tepung Kelapa CORA
                              </>
                            )}
                          </button>
                          {addedFlourFeedback && (
                            <Link
                              href="/checkout"
                              className="rounded-full border border-[#3B5B3D]/30 bg-white px-3.5 py-2.5 text-xs font-semibold text-[#3B5B3D] hover:bg-[#E6E3D8]"
                            >
                              Checkout
                            </Link>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex h-full min-h-[340px] flex-col items-center justify-center rounded-3xl border border-dashed border-[#D6CCBA] bg-[#FAF8F5] p-8 text-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#3B5B3D]/10 text-[#3B5B3D]">
                      <ChefHat className="h-7 w-7" />
                    </div>
                    <h3 className="mt-4 font-serif text-xl font-bold text-[#2C1E18]">
                      Siap Meracik Resep Sehat?
                    </h3>
                    <p className="mt-2 max-w-sm text-xs leading-relaxed text-[#6E5C52]">
                      Pilih minimal satu bahan di sisi kiri, tentukan jenis
                      sajian, lalu tekan <strong>Generate AI Recipe</strong>{' '}
                      untuk mendapatkan panduan substitusi tepung kelapa CORA.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* 2. RECIPE HUB */}
        <section className="border-t border-[#E5DEC9] bg-[#EFECE3]/50 py-14 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#3B5B3D]">
                  <BookOpen className="h-3.5 w-3.5" />
                  Recipe Hub
                </span>
                <h2 className="mt-2 font-serif text-3xl font-bold text-[#2C1E18] sm:text-4xl">
                  Inspirasi Resep Tepung Kelapa CORA
                </h2>
                <p className="mt-1.5 max-w-2xl text-sm text-[#6E5C52]">
                  Klik kartu resep di bawah untuk melihat takaran bahan lengkap
                  dan langkah pembuatannya di rumah.
                </p>
              </div>
            </div>

            <div className="mt-9 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {HUB_RECIPES.map((recipe) => (
                <button
                  key={recipe.id}
                  type="button"
                  onClick={() => setActiveHubRecipe(recipe)}
                  className="group flex flex-col justify-between rounded-3xl border border-[#E5DEC9] bg-white p-6 text-left shadow-xs transition hover:-translate-y-1 hover:shadow-md"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="rounded-full bg-[#3B5B3D]/10 px-3 py-1 text-[11px] font-bold text-[#3B5B3D]">
                        {recipe.category}
                      </span>
                      <span className="text-xs font-medium text-[#6E5C52]">
                        {recipe.calories} kkal
                      </span>
                    </div>

                    <h3 className="mt-4 text-lg font-bold leading-snug text-[#2C1E18] group-hover:text-[#3B5B3D] transition-colors">
                      {recipe.title}
                    </h3>
                    <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-[#6E5C52]">
                      {recipe.summary}
                    </p>
                  </div>

                  <div className="mt-5 border-t border-[#F0EAE0] pt-4">
                    <div className="flex items-center justify-between text-xs text-[#6E5C52]">
                      <span className="inline-flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5 text-[#3B5B3D]" />
                        {recipe.prepTime}
                      </span>
                      <span className="font-semibold text-[#3B5B3D]">
                        Baca Resep →
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* 3. COCONUT PICKUP SYSTEM (#pickup) */}
        <section
          id="pickup"
          className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8"
        >
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
            {/* Left Info & Live Queue */}
            <div className="space-y-6 lg:col-span-5">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#3B5B3D]/10 px-3.5 py-1 text-xs font-semibold text-[#3B5B3D]">
                  <Truck className="h-3.5 w-3.5" />
                  Coconut Pickup System
                </span>
                <h2 className="mt-3 font-serif text-3xl font-bold leading-tight text-[#2C1E18] sm:text-4xl">
                  Jadwalkan Penjemputan Ampas Kelapa
                </h2>
                <p className="mt-2.5 text-sm leading-relaxed text-[#5C4B42]">
                  Mitra UMKM santan dan petani kelapa lokal dapat menjadwalkan
                  penjemputan residu ampas kelapa secara langsung. Tim logistik
                  CORA akan mengolahnya menjadi tepung kelapa bernilai tambah.
                </p>
              </div>

              {/* Recent Pickups Live Feed */}
              <div className="rounded-3xl border border-[#E5DEC9] bg-white p-5 shadow-xs">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-[#2C1E18]">
                    Antrean Penjemputan Mitra Terbaru
                  </h3>
                  <span className="rounded-full bg-[#3B5B3D]/10 px-2.5 py-0.5 text-[11px] font-semibold text-[#3B5B3D]">
                    {pickupRequests.length} permintaan
                  </span>
                </div>

                <div className="mt-4 space-y-3">
                  {pickupRequests.slice(0, 4).map((req) => {
                    const badge = getPickupBadge(req.status);
                    return (
                      <div
                        key={req.id}
                        className="rounded-2xl bg-[#FAF8F5] p-3.5 ring-1 ring-[#E5DEC9]/70"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="text-xs font-bold text-[#2C1E18]">
                              {req.supplierName}
                            </p>
                            <p className="mt-0.5 text-[11px] text-[#6E5C52]">
                              {req.location}
                            </p>
                          </div>
                          <span
                            className={`shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${badge.className}`}
                          >
                            {badge.label}
                          </span>
                        </div>
                        <div className="mt-2 flex items-center gap-3 text-[11px] font-medium text-[#5C4B42]">
                          <span>Estimasi: {req.estimatedKg} kg</span>
                          <span>•</span>
                          <span>Tanggal: {req.preferredDate}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Pickup Form */}
            <div className="lg:col-span-7">
              <form
                onSubmit={handlePickupSubmit}
                className="rounded-3xl border border-[#E5DEC9] bg-white p-6 shadow-sm sm:p-8"
              >
                <h3 className="font-serif text-xl font-bold text-[#2C1E18]">
                  Formulir Mitra Penjemputan Limbah Ampas Kelapa
                </h3>
                <p className="mt-1 text-xs text-[#6E5C52]">
                  Data yang dikirim langsung tersinkronisasi ke Admin Dashboard
                  CORA untuk penjadwalan armada jemput.
                </p>

                {pickupSubmittedMsg && (
                  <div
                    role="status"
                    className="mt-5 flex items-start gap-2.5 rounded-2xl bg-[#3B5B3D] px-4 py-3.5 text-xs font-medium text-white"
                  >
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#B8E3A6]" />
                    <span>{pickupSubmittedMsg}</span>
                  </div>
                )}

                <div className="mt-6 space-y-5">
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="supplierName"
                        className="flex items-center gap-1.5 text-xs font-semibold text-[#2C1E18]"
                      >
                        <User className="h-3.5 w-3.5 text-[#3B5B3D]" />
                        Nama Mitra / Usaha <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="supplierName"
                        type="text"
                        required
                        value={supplierName}
                        onChange={(e) => setSupplierName(e.target.value)}
                        placeholder="Contoh: Santan Segar Pak Budi"
                        className="mt-1.5 w-full rounded-xl bg-[#FAF8F5] px-4 py-2.5 text-sm text-[#2C1E18] placeholder-[#9B897E] ring-1 ring-[#E5DEC9] focus:bg-white focus:ring-2 focus:ring-[#3B5B3D] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="pickupPhone"
                        className="flex items-center gap-1.5 text-xs font-semibold text-[#2C1E18]"
                      >
                        <Phone className="h-3.5 w-3.5 text-[#3B5B3D]" />
                        No. WhatsApp <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="pickupPhone"
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Contoh: 081299887766"
                        className="mt-1.5 w-full rounded-xl bg-[#FAF8F5] px-4 py-2.5 text-sm text-[#2C1E18] placeholder-[#9B897E] ring-1 ring-[#E5DEC9] focus:bg-white focus:ring-2 focus:ring-[#3B5B3D] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="pickupLocation"
                      className="flex items-center gap-1.5 text-xs font-semibold text-[#2C1E18]"
                    >
                      <MapPin className="h-3.5 w-3.5 text-[#3B5B3D]" />
                      Alamat Lokasi Penjemputan{' '}
                      <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="pickupLocation"
                      required
                      rows={3}
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="Pasar, lapak, atau alamat lengkap titik jemput ampas kelapa"
                      className="mt-1.5 w-full rounded-xl bg-[#FAF8F5] px-4 py-2.5 text-sm text-[#2C1E18] placeholder-[#9B897E] ring-1 ring-[#E5DEC9] focus:bg-white focus:ring-2 focus:ring-[#3B5B3D] focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="estimatedKg"
                        className="flex items-center gap-1.5 text-xs font-semibold text-[#2C1E18]"
                      >
                        <Scale className="h-3.5 w-3.5 text-[#3B5B3D]" />
                        Estimasi Berat Ampas (Kg){' '}
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="estimatedKg"
                        type="number"
                        min={1}
                        step={1}
                        required
                        value={estimatedKg}
                        onChange={(e) => setEstimatedKg(e.target.value)}
                        placeholder="Contoh: 50"
                        className="mt-1.5 w-full rounded-xl bg-[#FAF8F5] px-4 py-2.5 text-sm text-[#2C1E18] placeholder-[#9B897E] ring-1 ring-[#E5DEC9] focus:bg-white focus:ring-2 focus:ring-[#3B5B3D] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="preferredDate"
                        className="flex items-center gap-1.5 text-xs font-semibold text-[#2C1E18]"
                      >
                        <Calendar className="h-3.5 w-3.5 text-[#3B5B3D]" />
                        Tanggal Penjemputan{' '}
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="preferredDate"
                        type="date"
                        required
                        value={preferredDate}
                        onChange={(e) => setPreferredDate(e.target.value)}
                        className="mt-1.5 w-full rounded-xl bg-[#FAF8F5] px-4 py-2.5 text-sm text-[#2C1E18] ring-1 ring-[#E5DEC9] focus:bg-white focus:ring-2 focus:ring-[#3B5B3D] focus:outline-none"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="flex w-full items-center justify-center gap-2 rounded-full bg-[#3B5B3D] px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#2F4A31]"
                  >
                    <Leaf className="h-4 w-4" />
                    Ajukan Jadwal Penjemputan Ampas Kelapa
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>
      </main>

      {/* Recipe Hub Detail Modal */}
      {activeHubRecipe && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#2C1E18]/55 p-4 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
          aria-label={`Resep ${activeHubRecipe.title}`}
        >
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
            <div className="sticky top-0 flex items-start justify-between gap-4 border-b border-[#F0EAE0] bg-white px-6 py-5">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-[#3B5B3D] px-3 py-0.5 text-[11px] font-bold text-white">
                    {activeHubRecipe.category}
                  </span>
                  <span className="text-xs font-medium text-[#6E5C52]">
                    {activeHubRecipe.prepTime} • {activeHubRecipe.servings} •{' '}
                    {activeHubRecipe.calories} kkal/porsi
                  </span>
                </div>
                <h3 className="mt-2 font-serif text-2xl font-bold text-[#2C1E18]">
                  {activeHubRecipe.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveHubRecipe(null)}
                aria-label="Tutup resep"
                className="rounded-full p-2 text-[#6E5C52] hover:bg-[#E6E3D8]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-6 p-6">
              <p className="text-sm leading-relaxed text-[#5C4B42]">
                {activeHubRecipe.summary}
              </p>

              <div className="rounded-2xl bg-[#3B5B3D]/8 px-4 py-3 text-xs font-semibold text-[#3B5B3D]">
                Menggunakan: {activeHubRecipe.coconutFlourUsed}
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#2C1E18]">
                    Bahan-Bahan
                  </h4>
                  <ul className="mt-3 space-y-2 text-sm text-[#5C4B42]">
                    {activeHubRecipe.ingredients.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#4E9A34]" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#2C1E18]">
                    Cara Membuat
                  </h4>
                  <ol className="mt-3 space-y-2.5 text-sm text-[#5C4B42]">
                    {activeHubRecipe.steps.map((step, i) => (
                      <li key={step} className="flex items-start gap-2.5">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#4E9A34]/15 text-xs font-bold text-[#4E9A34]">
                          {i + 1}
                        </span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>

              {coconutFlourProduct && (
                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#F0EAE0] pt-5">
                  <span className="text-xs text-[#6E5C52]">
                    Butuh tepung kelapa CORA untuk resep ini?
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      handleBuyFlourDirect();
                      setActiveHubRecipe(null);
                      window.dispatchEvent(new CustomEvent('cora:open-cart'));
                    }}
                    className="inline-flex items-center gap-2 rounded-full bg-[#3B5B3D] px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-[#2F4A31]"
                  >
                    <ShoppingBag className="h-4 w-4" />
                    Tambah Tepung Kelapa ke Keranjang
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

