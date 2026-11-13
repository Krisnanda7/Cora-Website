'use client';

import React, { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  BookOpen,
  Bot,
  Check,
  ChefHat,
  Clock,
  Flame,
  Heart,
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
  { id: 'Cookies', label: 'Cookies', subtitle: 'Crisp edges & tender center' },
  { id: 'Brownies', label: 'Brownies', subtitle: 'Fudgy dark & gluten-free' },
  { id: 'Pancake', label: 'Pancake', subtitle: 'Nutritious high-fiber breakfast' },
  { id: 'Muffin', label: 'Muffin', subtitle: 'Moist & rich in dietary fiber' },
  { id: 'Banana Cake', label: 'Banana Cake', subtitle: 'Tender tropical banana loaf' },
];

const RECIPE_CATEGORIES: { label: string; value: 'ALL' | RecipeCategory }[] = [
  { label: 'All Recipes', value: 'ALL' },
  { label: 'Cookies & Biscuits', value: 'Cookies and Biscuits' },
  { label: 'Cakes & Brownies', value: 'Cakes and Brownies' },
  { label: 'Healthy Snacks', value: 'Healthy Snacks' },
  { label: 'Creative Recipes', value: 'Creative Recipes' },
];

const PRESET_CHAT_QUESTIONS = [
  'What is the conversion ratio of coconut flour compared to all-purpose flour?',
  'How many eggs and liquids are needed when baking with coconut flour?',
  'Is CORA coconut flour 100% gluten-free and diet-friendly?',
  'How can I prevent coconut flour baked goods from turning out too dry?',
];

const FAQ_KNOWLEDGE_BASE: Record<string, string> = {
  rasio:
    'The substitution ratio for CORA coconut flour is 1:3 to 1:4 of all-purpose wheat flour (e.g., 100g wheat flour can be replaced with only 25g - 35g of CORA coconut flour). This is because coconut flour contains exceptionally high dietary fiber that absorbs 3-4 times more moisture than wheat flour.',
  telur:
    'Because coconut flour is naturally gluten-free, eggs serve as the primary structural binder. A practical rule: for every 30g of CORA coconut flour, add 1 egg and let the batter rest for 3–5 minutes so the fiber fully hydrates.',
  gluten:
    'Yes, 100% Gluten-Free! CORA coconut flour is milled purely from fresh upcycled coconut residue without wheat, grain, or chemical additives—making it ideal for celiac disease, gluten intolerance, keto, and low-carb lifestyles.',
  kering:
    'To avoid dryness: (1) Do not over-measure coconut flour, (2) Incorporate healthy fats like coconut oil or butter, (3) Add natural moisturisers such as mashed banana, applesauce, or yogurt, and (4) Do not overbake (typically bakes 5 minutes faster than conventional flour).',
  produk:
    'CORA transforms coconut milk production residue into hygienic all-purpose flour, artisanal brownies, and crunchy cookies in airtight packaging. Every product directly rescues organic waste and empowers local coconut suppliers.',
};

export default function EcosystemPage() {
  const {
    products,
    recipes,
    userProfile,
    addToCart,
    toggleFavoriteRecipe,
  } = useCora();

  // CoraBlendAI State
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([
    'Eggs',
    'Banana',
    'Dark Chocolate',
  ]);
  const [selectedDish, setSelectedDish] = useState<DishType>('Brownies');
  const [portionSize, setPortionSize] = useState<string>('4 Servings');
  const [tastePreference, setTastePreference] =
    useState<string>('Naturally Sweet & Moist');
  const [difficultyLevel, setDifficultyLevel] = useState<string>('Medium');
  const [cookingTimePref, setCookingTimePref] = useState<string>('20-30 mins');

  const [isGenerating, setIsGenerating] = useState(false);
  const [aiRecipe, setAiRecipe] = useState<GeneratedRecipe | null>(null);
  const [addedFlourFeedback, setAddedFlourFeedback] = useState(false);

  // Chatbot State
  const [chatMessages, setChatMessages] = useState<
    { sender: 'user' | 'bot'; text: string; time: string }[]
  >([
    {
      sender: 'bot',
      text: 'Hello! I am your CORA Baking Assistant 🥥. Feel free to ask about coconut flour baking, wheat conversion ratios, or healthy gluten-free tips!',
      time: 'Just now',
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
          ? '180g All-Purpose Flour'
          : selectedDish === 'Brownies'
          ? '200g All-Purpose Flour'
          : selectedDish === 'Pancake'
          ? '150g All-Purpose Flour'
          : selectedDish === 'Muffin'
          ? '160g All-Purpose Flour'
          : '220g All-Purpose Flour';

      setAiRecipe({
        title: `Smart CORA Upcycled ${selectedDish}`,
        dishType: selectedDish,
        tagline: `Optimized recipe for ${portionSize} with ${tastePreference} flavor profile at ${difficultyLevel} difficulty.`,
        prepTime: '15 mins',
        cookTime: cookingTimePref,
        servings: portionSize,
        tastePreference,
        difficulty: difficultyLevel,
        caloriesPerServing: 145,
        wheatEquivalent: wheatEquiv,
        coconutFlourAmount: `${flourGrams} CORA Coconut Flour`,
        hydrationTip:
          'Coconut flour fiber absorbs 3x more liquid. Whisk eggs thoroughly and let the batter rest for 3 minutes before baking.',
        ingredients: [
          `${flourGrams} CORA Upcycled Coconut Flour`,
          ...selectedIngredients.map((i) => `Pantry ingredient: ${i}`),
          '2 large Organic eggs',
          '3 tbsp Coconut oil or melted butter',
          '1/2 tsp Baking powder & pinch of sea salt',
        ],
        steps: [
          'Whisk wet ingredients (eggs, sweetener, oil) in a bowl until smooth.',
          `Sift ${flourGrams} CORA Coconut Flour and baking powder into the wet mixture.`,
          'Stir gently and let rest for 3 minutes to allow coconut fiber to fully hydrate.',
          `Shape or pour into baking pan tailored for ${portionSize}.`,
          `Bake at 175°C (350°F) for ${cookingTimePref} until golden and aromatic.`,
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
        'CORA coconut flour is exceptionally high in natural fiber and 100% gluten-free! Use 1/4 to 1/3 the amount of regular wheat flour and add 1 extra egg for optimal tenderness.';

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
              sizes="100vw"
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
                CORA Culinary &amp; AI Innovation
              </span>
              <h1 className="font-serif text-3xl font-semibold tracking-tight text-[#FAF8F5] sm:text-4xl lg:text-5xl drop-shadow-sm">
                RecipeHub &amp; CoraBlendAI™
              </h1>
              <p className="text-sm leading-relaxed text-[#E2DACF] sm:text-base">
                A curated collection of gluten-free upcycled coconut flour recipes and an interactive AI assistant to calibrate your kitchen ratios seamlessly.
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
                Select ingredients available in your pantry, adjust portion size, flavor, time, and skill level. AI calculates precise wheat-to-coconut flour conversion ratios.
              </p>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
              {/* Left Form Controls */}
              <div className="space-y-6 lg:col-span-6">
                {/* 1. Bahan Tersedia di Rumah */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#3B5B3D]">
                    1. Available Pantry Ingredients
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

                {/* 2. Dish Type */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#3B5B3D]">
                    2. Dish Type
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
                    <span>3. Recipe Customization</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="text-[11px] font-semibold text-[#6E5C52]">
                        Portion Size
                      </label>
                      <select
                        value={portionSize}
                        onChange={(e) => setPortionSize(e.target.value)}
                        className="mt-1 w-full rounded-xl border border-[#D6CCBA] bg-white p-2 text-xs font-medium text-[#2C1E18]"
                      >
                        <option>2 Servings (Personal)</option>
                        <option>4 Servings (Family)</option>
                        <option>6 Servings (Party)</option>
                        <option>8 Servings (Large Batch)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-[#6E5C52]">
                        Flavor Preference
                      </label>
                      <select
                        value={tastePreference}
                        onChange={(e) => setTastePreference(e.target.value)}
                        className="mt-1 w-full rounded-xl border border-[#D6CCBA] bg-white p-2 text-xs font-medium text-[#2C1E18]"
                      >
                        <option>Naturally Sweet &amp; Moist</option>
                        <option>Intense Dark Chocolate</option>
                        <option>Low Sugar &amp; Clean</option>
                        <option>Toasted Coconut Savory</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-[#6E5C52]">
                        Skill Level
                      </label>
                      <select
                        value={difficultyLevel}
                        onChange={(e) => setDifficultyLevel(e.target.value)}
                        className="mt-1 w-full rounded-xl border border-[#D6CCBA] bg-white p-2 text-xs font-medium text-[#2C1E18]"
                      >
                        <option>Easy (No Mixer)</option>
                        <option>Medium</option>
                        <option>Artisanal (Creative)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-[#6E5C52]">
                        Baking Time
                      </label>
                      <select
                        value={cookingTimePref}
                        onChange={(e) => setCookingTimePref(e.target.value)}
                        className="mt-1 w-full rounded-xl border border-[#D6CCBA] bg-white p-2 text-xs font-medium text-[#2C1E18]"
                      >
                        <option>Quick (&lt;15 mins)</option>
                        <option>20-30 mins</option>
                        <option>&gt;30 mins</option>
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
                      Calculating Coconut Flour Ratio...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      Generate AI Recipe Now
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
                      CoraBlendAI is crafting your recipe...
                    </h3>
                    <p className="mt-1.5 max-w-sm text-xs text-[#6E5C52]">
                      Balancing wheat substitution, hydration levels, and {portionSize} servings.
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
                          Wheat to Coconut Flour Substitution
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
                            Ingredients:
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
                            Step-by-Step Instructions:
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
                        {addedFlourFeedback ? 'Added to Cart!' : 'Buy Coconut Flour'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex h-full min-h-[380px] flex-col items-center justify-center rounded-2xl border border-dashed border-[#D6CCBA] bg-[#FAF8F5] p-8 text-center">
                    <ChefHat className="h-10 w-10 text-[#3B5B3D]/60" />
                    <h3 className="mt-4 font-serif text-lg font-bold text-[#2C1E18]">
                      Ready to Craft Your Custom Recipe?
                    </h3>
                    <p className="mt-1.5 max-w-sm text-xs text-[#6E5C52]">
                      Choose pantry ingredients on the left, tailor portion size and flavor preferences, then click Generate AI Recipe.
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
                  Ask anything about coconut flour baking, hydration balances, or wheat flour comparisons.
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
                  placeholder="Ask a question about coconut flour baking..."
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
                  RecipeHub: Upcycled Coconut Flour Creations
                </h2>
                <p className="mt-1.5 max-w-2xl text-xs sm:text-sm text-[#6E5C52]">
                  A curated collection of cookies, brownies, cakes, pancakes, and wholesome snacks crafted with 100% upcycled coconut flour. Save favorites to your profile!
                </p>
              </div>

              {/* Favorites Count Badge */}
              <div className="flex items-center gap-2 text-xs font-semibold bg-white border border-[#E5DEC9] px-3.5 py-1.5 rounded-full shadow-2xs">
                <Heart className="h-3.5 w-3.5 fill-[#C2410C] text-[#C2410C]" />
                <span>{userProfile.favoriteRecipeIds.length} Saved Recipes</span>
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
                  placeholder="Search recipe name or ingredient..."
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
                            aria-label="Save to favorites"
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
                          View Recipe Details →
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
            SECTION 3: COCONUT PICKUP CALLOUT
           ========================================================================= */}
        <section id="pickup" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl border border-[#E5DEC9] bg-[#121B13] p-8 sm:p-12 text-[#FAF8F5] shadow-md">
            <div className="pointer-events-none absolute -right-16 -top-16 h-72 w-72 rounded-full bg-[#3B5B3D]/30 blur-3xl" />
            <div className="relative z-10 max-w-2xl space-y-4">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#86C975]/20 px-3.5 py-1 text-xs font-semibold text-[#86C975]">
                <Truck className="h-3.5 w-3.5" />
                Coconut Residue Collection Service
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold">
                Coconut Pickup &amp; Supplier Ecosystem is Now on a Dedicated Page
              </h2>
              <p className="text-xs sm:text-sm text-[#E2DACF] leading-relaxed">
                Dedicated for coconut milk producers and local food makers: schedule free hygienic pickups, track logistics routes in real-time, or register as an official CORA Supplier Partner to earn valuable economic incentives.
              </p>
              <div className="pt-2 flex flex-wrap gap-3">
                <Link
                  href="/pickup"
                  className="inline-flex items-center gap-2 rounded-full bg-[#3B5B3D] px-6 py-3 text-xs font-bold text-white transition hover:bg-[#2F4A31]"
                >
                  <span>Explore Coconut Pickup</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/pickup#tracking"
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-3 text-xs font-bold text-white transition hover:bg-white/20"
                >
                  <span>Track Pickup Status</span>
                </Link>
              </div>
            </div>
          </div>
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
              aria-label="Close recipe details"
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
                <span>⏱️ Prep Time: {activeRecipeModal.prepTime}</span>
                <span>🔥 Cook Time: {activeRecipeModal.cookTime}</span>
                <span>🍽️ Servings: {activeRecipeModal.servings}</span>
                <span>⚡ Calories: {activeRecipeModal.calories} kcal</span>
              </div>

              {/* Flour highlight */}
              <div className="rounded-xl bg-white p-3 border border-[#3B5B3D]/30 flex items-center gap-2 text-xs font-bold text-[#3B5B3D]">
                <Sparkles className="h-4 w-4" />
                <span>Usage: {activeRecipeModal.coconutFlourUsed}</span>
              </div>

              {/* Ingredients & Steps */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs pt-2">
                <div>
                  <h3 className="font-bold text-[#2C1E18] uppercase tracking-wider text-xs">
                    Ingredients &amp; Measurements:
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
                    Step-by-Step Instructions:
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
                      ? 'Saved in Favorites'
                      : 'Save to Favorite Recipes'}
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
                  Buy This Coconut Flour
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
