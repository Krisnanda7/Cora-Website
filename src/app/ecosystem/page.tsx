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
import Reveal from '@/components/Reveal';
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
  'Eggs',
  'Banana',
  'Dark Chocolate',
  'Oat Milk',
  'Palm Sugar',
  'Coconut Oil',
  'Honey',
  'Cinnamon',
] as const;

const DISH_TYPES: { id: DishType; label: string; subtitle: string }[] = [
  { id: 'Cookies', label: 'Cookies', subtitle: 'Crisp edges, chewy center' },
  { id: 'Muffin', label: 'Muffin', subtitle: 'Tender & high dietary fiber' },
  { id: 'Pancake', label: 'Pancake', subtitle: 'Quick wholesome breakfast' },
  { id: 'Brownies', label: 'Brownies', subtitle: 'Rich, fudgy & decadent' },
];

const HUB_RECIPES: HubRecipe[] = [
  {
    id: 'rec-fudgy-brownies',
    title: 'Fudgy Coconut Dark Choco Brownies',
    category: 'Brownies',
    prepTime: '35 mins',
    servings: '9 squares',
    calories: 165,
    coconutFlourUsed: '65g CORA Coconut Flour',
    summary:
      'Rich wheat-free dark chocolate brownies with a naturally fudgy crumb powered by fine CORA coconut flour.',
    ingredients: [
      '65g CORA Upcycled Coconut Flour',
      '120g 70% Dark Chocolate, melted',
      '3 Eggs at room temperature',
      '75g Palm Sugar',
      '60ml Coconut oil or melted butter',
      '1/2 tsp Vanilla extract & a pinch of sea salt',
    ],
    steps: [
      'Preheat your oven to 175°C and line an 18×18 cm baking pan with parchment paper.',
      'Whisk eggs and palm sugar together for 2 minutes until lightly frothy.',
      'Fold in melted dark chocolate and coconut oil until smooth.',
      'Sift in CORA Upcycled Coconut Flour and sea salt, gently folding until combined.',
      'Bake for 22–25 minutes until the top is glossy and the center remains moist.',
    ],
  },
  {
    id: 'rec-banana-pancake',
    title: 'Fluffy Banana Oat Coconut Pancakes',
    category: 'Pancake',
    prepTime: '15 mins',
    servings: '6 pancakes',
    calories: 140,
    coconutFlourUsed: '45g CORA Coconut Flour',
    summary:
      'Fiber-rich breakfast pancakes combining naturally sweet ripe banana and creamy oat milk to keep you energized longer.',
    ingredients: [
      '45g CORA Upcycled Coconut Flour',
      '1 ripe Cavendish Banana, mashed',
      '2 Eggs',
      '100ml warm Oat Milk',
      '1 tsp Baking powder',
      '1/2 tsp Ground cinnamon',
    ],
    steps: [
      'Mash the banana in a bowl, then whisk in eggs and oat milk until smooth.',
      'Stir in CORA Upcycled Coconut Flour, baking powder, and cinnamon. Rest 3 minutes so the flour absorbs liquid.',
      'Heat a non-stick skillet over low-medium heat.',
      'Pour 1 ladle of batter per pancake, cook 2 minutes per side until golden brown, and serve with honey or fresh fruit.',
    ],
  },
  {
    id: 'rec-chocochip-cookies',
    title: 'Artisanal Palm Sugar Coconut Cookies',
    category: 'Cookies',
    prepTime: '25 mins',
    servings: '14 cookies',
    calories: 120,
    coconutFlourUsed: '55g CORA Coconut Flour',
    summary:
      'Low-glycemic cookies featuring warm caramelized palm sugar notes and melting dark chocolate chunks.',
    ingredients: [
      '55g CORA Upcycled Coconut Flour',
      '2 Eggs',
      '65g Fine Palm Sugar',
      '60g Coconut oil or unsalted butter',
      '70g Dark Chocolate chunks',
      '1/2 tsp Baking soda & 1 tsp vanilla extract',
    ],
    steps: [
      'Whisk coconut oil, palm sugar, eggs, and vanilla until creamy.',
      'Mix in CORA Upcycled Coconut Flour and baking soda until a soft dough forms.',
      'Fold in dark chocolate chunks and let the dough rest for 5 minutes.',
      'Scoop and flatten onto a lined tray, then bake 12–14 minutes at 170°C until edges turn crisp golden.',
    ],
  },
  {
    id: 'rec-oat-muffin',
    title: 'Double Choco Oat Coconut Muffins',
    category: 'Muffin',
    prepTime: '30 mins',
    servings: '8 muffins',
    calories: 155,
    coconutFlourUsed: '60g CORA Coconut Flour',
    summary:
      'Tender wheat-free muffins crafted with oat milk, dark chocolate, and high-fiber upcycled coconut flour.',
    ingredients: [
      '60g CORA Upcycled Coconut Flour',
      '3 Eggs',
      '120ml Oat Milk',
      '60g Palm Sugar or Honey',
      '25g Unsweetened cocoa powder',
      '50g Dark Chocolate chips',
    ],
    steps: [
      'Preheat oven to 180°C and line an 8-cup muffin tin.',
      'Whisk eggs, oat milk, and palm sugar or honey until well blended.',
      'Sift in CORA Coconut Flour and cocoa powder, stirring gently until smooth.',
      'Fill muffin cups 3/4 full, top with dark chocolate chips, and bake for 20 minutes.',
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
      : ['Eggs', 'Oat Milk', 'Palm Sugar'];

  const sweetener = has('Palm Sugar')
    ? '65g Palm Sugar'
    : has('Honey')
    ? '60ml Pure Honey'
    : '60g Coconut or Palm Sugar';

  const liquid = has('Oat Milk')
    ? '110ml Oat Milk'
    : '100ml Plant-based milk or warm water';

  const fat = has('Coconut Oil')
    ? '55ml Virgin Coconut Oil'
    : '55g Melted butter or coconut oil';

  const eggLine = has('Eggs')
    ? '3 Eggs (natural binder for coconut fiber)'
    : '2 Eggs or 2 tbsp chia eggs (batter binder)';

  const flavorNotes: string[] = [];
  if (has('Banana')) flavorNotes.push('1 ripe Banana (mashed)');
  if (has('Dark Chocolate'))
    flavorNotes.push('75g 70% Dark Chocolate (chopped or melted)');
  if (has('Cinnamon')) flavorNotes.push('1/2 tsp Ground cinnamon');

  if (dishType === 'Brownies') {
    return {
      title: has('Banana')
        ? 'CORA Banana Dark Choco Fudge Brownies'
        : 'CORA Artisanal Coconut Fudge Brownies',
      dishType,
      tagline: `Low-wheat fudgy brownies tailored with ${activeExtras.slice(0, 3).join(', ')}.`,
      prepTime: '32 mins',
      servings: '9 squares',
      caloriesPerServing: has('Dark Chocolate') ? 172 : 148,
      fiberGrams: 5.4,
      wheatEquivalent: '180g Wheat Flour',
      coconutFlourAmount: '60g CORA Upcycled Coconut Flour',
      hydrationTip:
        '1 : 3 substitution ratio. Use 60g CORA coconut flour in place of 180g wheat flour with added eggs & moisture for a rich fudgy texture.',
      ingredients: [
        '60g CORA Upcycled Coconut Flour',
        eggLine,
        sweetener,
        fat,
        '25g Unsweetened cocoa powder',
        ...flavorNotes,
      ],
      steps: [
        'Preheat oven to 175°C and line an 18×18 cm baking pan with parchment paper.',
        'Whisk eggs with your chosen sweetener until slightly airy, then stir in melted fat and liquid.',
        'Sift in CORA Upcycled Coconut Flour and cocoa powder, folding gently until smooth.',
        'Add chopped dark chocolate or mashed banana if selected, then bake for 22–25 minutes.',
      ],
    };
  }

  if (dishType === 'Cookies') {
    return {
      title: has('Dark Chocolate')
        ? 'CORA Choco-Chunk Coconut Cookies'
        : 'CORA Crispy Golden Coconut Cookies',
      dishType,
      tagline: `High-fiber crisp cookies customized with your pantry picks (${activeExtras.slice(0, 3).join(', ')}).`,
      prepTime: '24 mins',
      servings: '12 cookies',
      caloriesPerServing: has('Dark Chocolate') ? 128 : 112,
      fiberGrams: 4.2,
      wheatEquivalent: '150g Wheat Flour',
      coconutFlourAmount: '50g CORA Upcycled Coconut Flour',
      hydrationTip:
        'Substitute 50g CORA Coconut Flour for 150g wheat flour. Rest dough for 5 minutes before baking so the fiber hydrates evenly.',
      ingredients: [
        '50g CORA Upcycled Coconut Flour',
        eggLine,
        sweetener,
        fat,
        '1/2 tsp Baking soda',
        ...flavorNotes,
      ],
      steps: [
        'Whisk wet ingredients (eggs, sweetener, oil/butter) in a bowl until creamy.',
        'Fold in CORA Upcycled Coconut Flour and baking soda, then rest 5 minutes.',
        'Stir in optional mix-ins such as dark chocolate chunks or cinnamon.',
        'Shape onto a baking sheet and bake for 12–14 minutes at 170°C until golden around the edges.',
      ],
    };
  }

  if (dishType === 'Muffin') {
    return {
      title: has('Banana')
        ? 'CORA Banana Oat Coconut Muffins'
        : 'CORA Light & Moist Coconut Muffins',
      dishType,
      tagline: `Fluffy, fiber-rich muffins formulated with exact CORA Upcycled Coconut Flour hydration.`,
      prepTime: '28 mins',
      servings: '8 muffins',
      caloriesPerServing: 152,
      fiberGrams: 4.9,
      wheatEquivalent: '165g Wheat Flour',
      coconutFlourAmount: '55g CORA Upcycled Coconut Flour',
      hydrationTip:
        '55g CORA coconut flour replaces 165g wheat flour. Pairing oat milk and eggs keeps the muffin crumb light and tender.',
      ingredients: [
        '55g CORA Upcycled Coconut Flour',
        eggLine,
        liquid,
        sweetener,
        '1 tsp Baking powder',
        ...flavorNotes,
      ],
      steps: [
        'Preheat oven to 180°C and prepare an 8-cup muffin tray with paper liners.',
        'Whisk eggs, oat milk, sweetener, and mashed banana (if selected) until smooth.',
        'Sift in CORA Upcycled Coconut Flour and baking powder, stir well, and rest 3 minutes.',
        'Divide into muffin cups (3/4 full), top with dark chocolate if using, and bake for 18–20 minutes.',
      ],
    };
  }

  return {
    title: has('Banana')
      ? 'CORA Fluffy Banana Oat Coconut Pancakes'
      : 'CORA Morning Fiber Coconut Pancakes',
    dishType,
    tagline: `Wholesome 15-minute breakfast pancakes crafted from ingredients in your kitchen.`,
    prepTime: '15 mins',
    servings: '6 mini pancakes',
    caloriesPerServing: 136,
    fiberGrams: 4.6,
    wheatEquivalent: '135g Wheat Flour',
    coconutFlourAmount: '45g CORA Upcycled Coconut Flour',
    hydrationTip:
      '45g CORA Coconut Flour equals 135g wheat flour. Adding oat milk ensures a smooth, pourable batter on the skillet.',
    ingredients: [
      '45g CORA Upcycled Coconut Flour',
      eggLine,
      liquid,
      sweetener,
      '1 tsp Baking powder',
      ...flavorNotes,
    ],
    steps: [
      'Whisk eggs, oat milk, and sweetener in a mixing bowl until smooth.',
      'Stir in CORA Upcycled Coconut Flour and baking powder until no lumps remain.',
      'Let batter thicken for 3 minutes while heating a non-stick skillet over low heat.',
      'Pour batter and cook 2 minutes per side until golden brown. Serve warm.',
    ],
  };
}

function getPickupBadge(status: PickupRequestStatus) {
  switch (status) {
    case 'PENDING':
      return {
        label: 'Awaiting Schedule',
        className: 'bg-amber-50 text-amber-800 ring-1 ring-amber-200',
      };
    case 'SCHEDULED':
      return {
        label: 'Scheduled',
        className: 'bg-sky-50 text-sky-800 ring-1 ring-sky-200',
      };
    case 'COMPLETED':
      return {
        label: 'Completed',
        className: 'bg-[#3B5B3D]/12 text-[#3B5B3D] ring-1 ring-[#3B5B3D]/25',
      };
  }
}

export default function EcosystemPage() {
  const { products, pickupRequests, addToCart, submitPickupRequest } =
    useCora();

  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([
    'Eggs',
    'Banana',
    'Dark Chocolate',
  ]);
  const [selectedDish, setSelectedDish] = useState<DishType>('Brownies');
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiRecipe, setAiRecipe] = useState<GeneratedRecipe | null>(null);
  const [addedFlourFeedback, setAddedFlourFeedback] = useState(false);

  const [activeHubRecipe, setActiveHubRecipe] = useState<HubRecipe | null>(
    null
  );

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
      `Pickup request from ${created.supplierName} (${created.estimatedKg} kg) has been submitted and synced to the Admin Dashboard.`
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
            <div className="animate-cora-fade-up max-w-3xl space-y-3">
              <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-[#3B5B3D]">
                <Sparkles className="h-3.5 w-3.5" />
                CORA Digital Ecosystem
              </span>
              <h1 className="font-serif text-3xl font-semibold tracking-tight text-[#2C1E18] sm:text-4xl lg:text-5xl">
                Recipe Hub, CORABlend AI &amp; Coconut Pickup
              </h1>
              <p className="text-sm leading-relaxed text-[#5C4B42] sm:text-base">
                Explore creative ways to bake with upcycled coconut flour at
                home or schedule coconut residue pickups for local MSMEs and
                coconut suppliers.
              </p>
            </div>
          </div>
        </section>

        {/* 1. CORABLEND AI */}
        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="animate-cora-fade-up rounded-2xl border border-[#E5DEC9] bg-white p-6 shadow-2xs sm:p-10">
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
                  Select the ingredients you have at home and your desired dish.
                  Our assistant calculates the exact substitution ratio from
                  wheat flour to CORA Upcycled Coconut Flour.
                </p>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
              {/* Left Controls */}
              <div className="space-y-7 lg:col-span-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#3B5B3D]">
                    1. Choose Ingredients You Have at Home
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

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#3B5B3D]">
                    2. Choose Dish Type
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
                      Crafting Smart Recipe...
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
                  <div className="flex h-full min-h-[340px] flex-col items-center justify-center rounded-2xl border border-[#E5DEC9] bg-[#FAF8F5] p-8 text-center">
                    <div className="relative flex h-20 w-20 items-center justify-center">
                      <span className="absolute inset-0 animate-ping rounded-full bg-[#4E9A34]/20" />
                      <span className="relative flex h-16 w-16 items-center justify-center rounded-full bg-[#3B5B3D] text-white shadow-md">
                        <ChefHat className="h-8 w-8 animate-bounce" />
                      </span>
                    </div>
                    <h3 className="mt-5 font-serif text-xl font-bold text-[#2C1E18]">
                      CORABlend AI is crafting your recipe...
                    </h3>
                    <p className="mt-2 max-w-sm text-xs leading-relaxed text-[#6E5C52]">
                      Calculating hydration ratios, wheat-to-
                      <strong>CORA Upcycled Coconut Flour</strong> substitution,
                      and nutrition per serving for your {selectedDish}.
                    </p>
                  </div>
                ) : aiRecipe ? (
                  <div className="animate-cora-fade-up flex h-full flex-col justify-between rounded-2xl border border-[#3B5B3D]/25 bg-[#FAF8F5] p-6 sm:p-7">
                    <div>
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#4E9A34] px-3 py-1 text-[11px] font-bold text-white">
                          <Sparkles className="h-3 w-3" />
                          AI Match • {aiRecipe.dishType}
                        </span>
                        <div className="flex items-center gap-3 text-xs font-semibold tabular-nums text-[#5C4B42]">
                          <span className="inline-flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5 text-[#3B5B3D]" />
                            {aiRecipe.prepTime}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <Flame className="h-3.5 w-3.5 text-[#4E9A34]" />
                            {aiRecipe.caloriesPerServing} kcal / serving
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
                          Wheat Flour Substitution Ratio
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
                            Ingredients
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
                            Instructions
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
                          <p className="text-[11px] tabular-nums text-[#6E5C52]">
                            Rp{' '}
                            {coconutFlourProduct.price.toLocaleString('id-ID')}{' '}
                            • Saves {coconutFlourProduct.residueSavedGram}g
                            residue
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
                                Added to Cart!
                              </>
                            ) : (
                              <>
                                <ShoppingBag className="h-3.5 w-3.5" />
                                Buy CORA Coconut Flour
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
                  <div className="flex h-full min-h-[340px] flex-col items-center justify-center rounded-2xl border border-dashed border-[#D6CCBA] bg-[#FAF8F5] p-8 text-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#3B5B3D]/10 text-[#3B5B3D]">
                      <ChefHat className="h-7 w-7" />
                    </div>
                    <h3 className="mt-4 font-serif text-xl font-bold text-[#2C1E18]">
                      Ready to Blend a Healthy Recipe?
                    </h3>
                    <p className="mt-2 max-w-sm text-xs leading-relaxed text-[#6E5C52]">
                      Pick your pantry ingredients on the left, choose a dish
                      type, and click <strong>Generate AI Recipe</strong> for a
                      tailored CORA Coconut Flour guide.
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
                  CORA Coconut Flour Recipe Collection
                </h2>
                <p className="mt-1.5 max-w-2xl text-sm text-[#6E5C52]">
                  Click any recipe card below to read the full ingredient list
                  and step-by-step instructions.
                </p>
              </div>
            </div>

            <div className="mt-9 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {HUB_RECIPES.map((recipe, idx) => (
                <Reveal key={recipe.id} delayMs={idx * 65}>
                  <button
                    type="button"
                    onClick={() => setActiveHubRecipe(recipe)}
                    className="group flex h-full w-full flex-col justify-between rounded-2xl border border-[#E5DEC9] bg-white p-6 text-left transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:border-[#CFC5B1] hover:shadow-md"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="rounded-full bg-[#3B5B3D]/10 px-3 py-1 text-[11px] font-bold text-[#3B5B3D]">
                          {recipe.category}
                        </span>
                        <span className="text-xs font-medium tabular-nums text-[#6E5C52]">
                          {recipe.calories} kcal
                        </span>
                      </div>

                      <h3 className="mt-4 text-lg font-bold leading-snug text-[#2C1E18] transition-colors group-hover:text-[#3B5B3D]">
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
                          Read Recipe →
                        </span>
                      </div>
                    </div>
                  </button>
                </Reveal>
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
                  Schedule Coconut Residue Pickup
                </h2>
                <p className="mt-2.5 text-sm leading-relaxed text-[#5C4B42]">
                  Local coconut milk producers and coconut farmers can schedule
                  direct pickup for leftover coconut residue. CORA&apos;s
                  logistics team collects and upcycles it into high-value
                  coconut flour.
                </p>
              </div>

              {/* Recent Pickups Live Feed */}
              <div className="rounded-2xl border border-[#E5DEC9] bg-white p-5 shadow-2xs">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-[#2C1E18]">
                    Recent Partner Pickup Queue
                  </h3>
                  <span className="rounded-full bg-[#3B5B3D]/10 px-2.5 py-0.5 text-[11px] font-semibold tabular-nums text-[#3B5B3D]">
                    {pickupRequests.length} requests
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
                        <div className="mt-2 flex items-center gap-3 text-[11px] font-medium tabular-nums text-[#5C4B42]">
                          <span>Est. {req.estimatedKg} kg</span>
                          <span>•</span>
                          <span>Date: {req.preferredDate}</span>
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
                className="rounded-2xl border border-[#E5DEC9] bg-white p-6 shadow-2xs sm:p-8"
              >
                <h3 className="font-serif text-xl font-bold text-[#2C1E18]">
                  Partner Coconut Residue Pickup Form
                </h3>
                <p className="mt-1 text-xs text-[#6E5C52]">
                  Submitted requests sync directly with the CORA Admin Dashboard
                  for fleet dispatch scheduling.
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
                        Partner / Business Name{' '}
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="supplierName"
                        type="text"
                        required
                        value={supplierName}
                        onChange={(e) => setSupplierName(e.target.value)}
                        placeholder="e.g. Pak Budi Coconut Stall"
                        className="mt-1.5 w-full rounded-xl bg-[#FAF8F5] px-4 py-2.5 text-sm text-[#2C1E18] placeholder-[#9B897E] ring-1 ring-[#E5DEC9] focus:bg-white focus:ring-2 focus:ring-[#3B5B3D] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="pickupPhone"
                        className="flex items-center gap-1.5 text-xs font-semibold text-[#2C1E18]"
                      >
                        <Phone className="h-3.5 w-3.5 text-[#3B5B3D]" />
                        WhatsApp Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="pickupPhone"
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="e.g. 081299887766"
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
                      Pickup Location Address{' '}
                      <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="pickupLocation"
                      required
                      rows={3}
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="Market stall, warehouse, or full street address for residue pickup"
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
                        Estimated Residue Weight (Kg){' '}
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
                        placeholder="e.g. 50"
                        className="mt-1.5 w-full rounded-xl bg-[#FAF8F5] px-4 py-2.5 text-sm text-[#2C1E18] placeholder-[#9B897E] ring-1 ring-[#E5DEC9] focus:bg-white focus:ring-2 focus:ring-[#3B5B3D] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="preferredDate"
                        className="flex items-center gap-1.5 text-xs font-semibold text-[#2C1E18]"
                      >
                        <Calendar className="h-3.5 w-3.5 text-[#3B5B3D]" />
                        Preferred Pickup Date{' '}
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
                    Schedule Coconut Residue Pickup
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
          className="animate-cora-fade-in fixed inset-0 z-50 flex items-center justify-center bg-[#2C1E18]/55 p-4 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
          aria-label={`Recipe ${activeHubRecipe.title}`}
        >
          <div className="animate-cora-modal max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-[#E5DEC9] bg-white shadow-2xl">
            <div className="sticky top-0 flex items-start justify-between gap-4 border-b border-[#F0EAE0] bg-white px-6 py-5">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-[#3B5B3D] px-3 py-0.5 text-[11px] font-bold text-white">
                    {activeHubRecipe.category}
                  </span>
                  <span className="text-xs font-medium text-[#6E5C52]">
                    {activeHubRecipe.prepTime} • {activeHubRecipe.servings} •{' '}
                    {activeHubRecipe.calories} kcal/serving
                  </span>
                </div>
                <h3 className="mt-2 font-serif text-2xl font-bold text-[#2C1E18]">
                  {activeHubRecipe.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveHubRecipe(null)}
                aria-label="Close recipe"
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
                Featured Ingredient: {activeHubRecipe.coconutFlourUsed}
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#2C1E18]">
                    Ingredients
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
                    Instructions
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
                    Need CORA Coconut Flour for this recipe?
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
                    Add Coconut Flour to Cart
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
