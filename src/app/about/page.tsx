'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  CheckCircle2,
  ChevronDown,
  Leaf,
  Mail,
  MapPin,
  Phone,
  Send,
  Sparkles,
  Target,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface TeamMember {
  name: string;
  role: string;
  responsibility: string;
  image: string;
}

const TEAM_MEMBERS: TeamMember[] = [
  {
    name: 'Member 1',
    role: 'Founder & Innovation Lead',
    responsibility: 'Spearheading circular strategy, product architecture, and CORA ecosystem technology vision.',
    image: '/images/hero/anggota1.jpg',
  },
  {
    name: 'Member 2',
    role: 'Food Tech & R&D Specialist',
    responsibility: 'Formulating hygienic coconut pulp flour, proximate nutrient testing, and gluten-free food engineering.',
    image: '/images/products/anggota2.jpg',
  },
  {
    name: 'Member 3',
    role: 'Supply Chain & Community Lead',
    responsibility: 'Managing coconut residue pickup logistics, micro-routes, and coconut vendor MSME partnerships.',
    image: '/images/products/anggota.jpg',
  },
  {
    name: 'Member 4',
    role: 'Sustainability & Impact Officer',
    responsibility: 'Monitoring waste reduction metrics, carbon footprint prevention, and corporate SDGs compliance standards.',
    image: '/images/products/anggota.jpg',
  },
];

interface FAQItem {
  category: 'product' | 'purchase' | 'shipping' | 'usage' | 'pickup';
  question: string;
  answer: string;
}

const FAQ_LIST: FAQItem[] = [
  {
    category: 'product',
    question: 'What are CORA circular food products?',
    answer:
      'CORA products are crafted from upcycled coconut pulp—a natural byproduct of fresh coconut milk extraction that is typically discarded. We hygienically dehydrate it under controlled temperatures and mill it into nutrient-dense coconut flour, fudgy brownies, and fiber-rich cookies.',
  },
  {
    category: 'product',
    question: 'Are CORA products gluten-free?',
    answer:
      'Yes! Pure coconut pulp flour and all CORA snacks are naturally 100% gluten-free, rich in prebiotic dietary fiber, and safe for celiac diets and healthy lifestyle choices.',
  },
  {
    category: 'purchase',
    question: 'How do I place an order on the CORA website?',
    answer:
      'Browse items under Our Products, select quantity and variants, then click Add to Cart. Open your cart and proceed to Checkout. Complete your delivery address and make a demo bank transfer verification.',
  },
  {
    category: 'purchase',
    question: 'Are current transactions live or simulated demo orders?',
    answer:
      'Currently, the CORA website operates as an Interactive Prototype / Demo. You can experience the complete shopping journey, upload demo transfer receipts, and track live order stages freely with no real monetary deduction.',
  },
  {
    category: 'shipping',
    question: 'What is the estimated delivery timeframe?',
    answer:
      'Orders are shipped via partner courier services with regular (2-3 business days) or express/next day (1 business day) delivery. You can monitor your shipment anytime via the Track Order page.',
  },
  {
    category: 'usage',
    question: 'How do I use CORA coconut flour in home baking?',
    answer:
      'Substitute 1/4 to 1/3 the amount of conventional wheat flour (e.g., replace 100g wheat flour with 30g CORA coconut flour). Add 1 extra egg and let batter rest for 3 minutes so the fibers can absorb moisture thoroughly.',
  },
  {
    category: 'pickup',
    question: 'Who is eligible to join the Coconut Pickup program?',
    answer:
      'Traditional market coconut vendors, fresh coconut milk stalls, food processing facilities, and caterers or restaurants producing at least 10 kg of clean coconut residue per scheduled collection.',
  },
  {
    category: 'pickup',
    question: 'Do supplier partners receive financial compensation?',
    answer:
      'Yes! Every kilogram of clean coconut residue meeting quality standards receives competitive monetary compensation and direct free collection by the CORA logistics team.',
  },
];

export default function AboutPage() {
  const [activeFaqCat, setActiveFaqCat] = useState<string>('all');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Contact Form State
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactSubject, setContactSubject] = useState('General Inquiry & Product Consultation');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSuccess, setContactSuccess] = useState(false);

  const filteredFaqs = FAQ_LIST.filter(
    (faq) => activeFaqCat === 'all' || faq.category === activeFaqCat
  );

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName.trim() || !contactMessage.trim()) return;
    setContactSuccess(true);
    setContactName('');
    setContactEmail('');
    setContactMessage('');
    window.setTimeout(() => setContactSuccess(false), 3000);
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

          <div className="relative z-20 mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
            <div className="animate-cora-fade-up max-w-3xl space-y-3">
              <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-[#86C975]">
                <Leaf className="h-3.5 w-3.5" />
                About Us &amp; Our Journey
              </span>
              <h1 className="font-serif text-3xl font-semibold tracking-tight text-[#FAF8F5] sm:text-4xl lg:text-5xl drop-shadow-sm">
                About CORA (Circular Food Innovation)
              </h1>
              <p className="text-sm leading-relaxed text-[#E2DACF] sm:text-base">
                Revitalizing coconut pulp into nutrient-dense food ingredients, empowering local coconut MSMEs, and pioneering a zero-waste food future.
              </p>
            </div>
          </div>
        </section>

        {/* 1. OUR STORY: LATAR BELAKANG, PERMASALAHAN, & IDE INOVASI */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#3B5B3D]">
                  Our Story
                </span>
                <h2 className="mt-2 font-serif text-3xl font-bold text-[#2C1E18] sm:text-4xl">
                  From Overlooked Residue to Sustainable Opportunity
                </h2>
              </div>

              <div className="space-y-4 text-xs sm:text-sm text-[#5C4B42] leading-relaxed">
                <p>
                  <strong className="text-[#2C1E18]">Background:</strong> Indonesia is one of the world&apos;s largest coconut producers. Every day, thousands of traditional markets and coconut milk producers press millions of coconuts for culinary milk and oil extraction.
                </p>
                <p>
                  <strong className="text-[#2C1E18]">The Waste Crisis:</strong> However, fresh pressing leaves behind mountains of wet coconut pulp often discarded as valueless waste. Thousands of tons rot in landfills every month, releasing harmful methane gas and polluting local ecosystems.
                </p>
                <p>
                  <strong className="text-[#2C1E18]">The CORA Innovation:</strong> This is where CORA steps in. We view coconut pulp not as waste, but as an undervalued superfood ingredient. Through food-grade hygienic dehydration and ultra-fine milling, we transform residue into fiber-packed <em>Upcycled Coconut Flour</em>, artisanal chocolate brownies, and crunchy nutrient-dense cookies.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-2">
                <div className="rounded-2xl border border-[#E5DEC9] bg-white p-4 text-center">
                  <p className="font-serif text-2xl font-bold text-[#3B5B3D]">100%</p>
                  <p className="text-[11px] text-[#6E5C52]">Upcycled Residue</p>
                </div>
                <div className="rounded-2xl border border-[#E5DEC9] bg-white p-4 text-center">
                  <p className="font-serif text-2xl font-bold text-[#3B5B3D]">0%</p>
                  <p className="text-[11px] text-[#6E5C52]">Gluten Content</p>
                </div>
                <div className="rounded-2xl border border-[#E5DEC9] bg-white p-4 text-center">
                  <p className="font-serif text-2xl font-bold text-[#3B5B3D]">High</p>
                  <p className="text-[11px] text-[#6E5C52]">Dietary Fiber</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="relative aspect-[4/3] rounded-3xl overflow-hidden border border-[#E5DEC9] shadow-lg">
                <Image
                  src="/images/hero/hero.jpg"
                  alt="CORA Innovation Journey"
                  fill
                  className="object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <p className="text-xs font-semibold tracking-wide uppercase text-[#86C975]">
                    Circular Food Revolution
                  </p>
                  <p className="font-serif text-xl font-bold">
                    Transforming Residue into Sustainable Nutrition
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. VISION AND MISSION */}
        <section className="border-t border-[#E5DEC9] bg-[#EFECE3]/50 py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#3B5B3D]">
                Our Compass
              </span>
              <h2 className="font-serif text-3xl font-bold text-[#2C1E18] sm:text-4xl">
                Vision &amp; Mission
              </h2>
            </div>

            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Vision Card */}
              <div className="rounded-3xl border border-[#E5DEC9] bg-white p-8 shadow-xs flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#3B5B3D]/10 text-[#3B5B3D]">
                      <Target className="h-6 w-6" />
                    </span>
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wider text-[#3B5B3D]">
                        Our Vision
                      </p>
                      <h3 className="text-xl font-bold text-[#2C1E18]">
                        Leading Circular Food Pioneer
                      </h3>
                    </div>
                  </div>
                  <p className="text-sm leading-relaxed text-[#5C4B42]">
                    To be the premier pioneer of circular food innovation across Southeast Asia, transforming agricultural coconut byproducts into high-nutrition, climate-positive, and globally competitive food systems for a zero food waste future.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-[#F0EAE0] text-xs font-semibold text-[#3B5B3D]">
                  Zero Waste • High Nutrition • Local Pride
                </div>
              </div>

              {/* Mission Card */}
              <div className="rounded-3xl border border-[#E5DEC9] bg-white p-8 shadow-xs flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#4E9A34]/15 text-[#4E9A34]">
                      <Sparkles className="h-6 w-6" />
                    </span>
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wider text-[#4E9A34]">
                        Our Mission
                      </p>
                      <h3 className="text-xl font-bold text-[#2C1E18]">
                        Three Meaningful Sustainable Pillars
                      </h3>
                    </div>
                  </div>
                  <ul className="space-y-3 text-xs sm:text-sm text-[#5C4B42]">
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-[#3B5B3D] mt-0.5" />
                      <span><strong>Hygiene &amp; Value Addition:</strong> Rescuing coconut pulp with food-grade controlled dehydration into premium functional flour.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-[#3B5B3D] mt-0.5" />
                      <span><strong>Nutritional Diversity:</strong> Providing delicious, fiber-rich, gluten-free food alternatives that empower healthy lifestyles.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-[#3B5B3D] mt-0.5" />
                      <span><strong>MSME Empowerment:</strong> Uplifting local coconut vendors and smallholders through circular partnerships and reliable supplementary income.</span>
                    </li>
                  </ul>
                </div>
                <div className="mt-6 pt-4 border-t border-[#F0EAE0] text-xs font-semibold text-[#4E9A34]">
                  Impact-Driven • Community-Centered
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. OUR TEAM */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#3B5B3D]">
              The People Behind CORA
            </span>
            <h2 className="font-serif text-3xl font-bold text-[#2C1E18] sm:text-4xl">
              Meet Our Team
            </h2>
            <p className="text-xs sm:text-sm text-[#6E5C52]">
              Passionate innovators committed to driving positive impact for food systems and our environment.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TEAM_MEMBERS.map((member) => (
              <div
                key={member.name}
                className="group rounded-3xl border border-[#E5DEC9] bg-white overflow-hidden p-5 shadow-xs transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-[#FAF8F5] border border-[#E5DEC9]">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover object-center transition duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="mt-4">
                  <h3 className="font-bold text-[#2C1E18] text-base">
                    {member.name}
                  </h3>
                  <p className="text-xs font-semibold text-[#3B5B3D]">
                    {member.role}
                  </p>
                  <p className="mt-2 text-[11px] text-[#6E5C52] leading-relaxed">
                    {member.responsibility}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 4. FAQ (FREQUENTLY ASKED QUESTIONS) */}
        <section id="faq" className="border-t border-[#E5DEC9] bg-[#FAF8F5] py-16">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#3B5B3D]">
                Got Questions?
              </span>
              <h2 className="font-serif text-3xl font-bold text-[#2C1E18] sm:text-4xl">
                Frequently Asked Questions (FAQ)
              </h2>
              <p className="text-xs sm:text-sm text-[#6E5C52]">
                Answers to common inquiries regarding our products, purchasing, shipping, baking tips, and coconut pickup logistics.
              </p>
            </div>

            {/* Filter Buttons */}
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {[
                { id: 'all', label: 'All Questions' },
                { id: 'product', label: 'Products & Nutrition' },
                { id: 'purchase', label: 'Purchasing & Demo' },
                { id: 'shipping', label: 'Shipping & Delivery' },
                { id: 'usage', label: 'Baking & Usage' },
                { id: 'pickup', label: 'Coconut Pickup' },
              ].map((btn) => (
                <button
                  key={btn.id}
                  type="button"
                  onClick={() => setActiveFaqCat(btn.id)}
                  className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                    activeFaqCat === btn.id
                      ? 'bg-[#3B5B3D] text-white shadow-xs'
                      : 'bg-white border border-[#D6CCBA] text-[#5C4B42] hover:bg-[#FAF8F5]'
                  }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>

            {/* Accordion */}
            <div className="mt-8 space-y-3">
              {filteredFaqs.map((faq, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div
                    key={faq.question}
                    className="rounded-2xl border border-[#E5DEC9] bg-white overflow-hidden transition"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                      className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-bold text-xs sm:text-sm text-[#2C1E18] hover:text-[#3B5B3D]"
                    >
                      <span>{faq.question}</span>
                      <ChevronDown
                        className={`h-4 w-4 shrink-0 transition-transform ${
                          isOpen ? 'rotate-180 text-[#3B5B3D]' : 'text-[#8C7A6B]'
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-4 pb-5 sm:px-5 text-xs text-[#5C4B42] leading-relaxed border-t border-[#F0EAE0] pt-3">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 5. CONTACT US & COLLABORATION FORM */}
        <section id="contact" className="border-t border-[#E5DEC9] bg-white py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              {/* Contact Info */}
              <div className="lg:col-span-5 space-y-6">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#3B5B3D]">
                    Get in Touch
                  </span>
                  <h2 className="mt-2 font-serif text-3xl font-bold text-[#2C1E18]">
                    Contact &amp; Partner with CORA
                  </h2>
                  <p className="mt-2 text-xs sm:text-sm text-[#6E5C52] leading-relaxed">
                    We welcome partnerships in raw material sourcing, circular food research, wholesale/B2B catering orders, and sustainability initiatives.
                  </p>
                </div>

                <div className="space-y-4 text-xs sm:text-sm text-[#5C4B42]">
                  <div className="flex items-start gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#3B5B3D]/10 text-[#3B5B3D] shrink-0">
                      <MapPin className="h-4 w-4" />
                    </span>
                    <div>
                      <strong className="block text-[#2C1E18]">Operational Address:</strong>
                      <span>Jl. Tukad Balian No. 88, Renon, Denpasar, Bali 80226</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#3B5B3D]/10 text-[#3B5B3D] shrink-0">
                      <Mail className="h-4 w-4" />
                    </span>
                    <div>
                      <strong className="block text-[#2C1E18]">Official Email:</strong>
                      <span>cora@gmail.com</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#3B5B3D]/10 text-[#3B5B3D] shrink-0">
                      <Phone className="h-4 w-4" />
                    </span>
                    <div>
                      <strong className="block text-[#2C1E18]">WhatsApp:</strong>
                      <span>+62 858-5868-7329</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#3B5B3D]/10 text-[#3B5B3D] shrink-0">
                      <svg className="h-4 w-4 fill-none stroke-currentColor stroke-2" viewBox="0 0 24 24">
                        <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                      </svg>
                    </span>
                    <div>
                      <strong className="block text-[#2C1E18]">Instagram:</strong>
                      <span>@cora.circularfood</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form */}
              <div className="lg:col-span-7">
                <div className="rounded-3xl border border-[#E5DEC9] bg-[#FAF8F5] p-6 sm:p-8 shadow-xs">
                  <h3 className="font-serif text-xl font-bold text-[#2C1E18]">
                    Inquiry &amp; Collaboration Form
                  </h3>
                  <p className="mt-1 text-xs text-[#6E5C52]">
                    Send your message or collaboration proposal. Our team will respond within 24 hours.
                  </p>

                  {contactSuccess && (
                    <div className="mt-4 rounded-2xl bg-[#4E9A34]/15 border border-[#4E9A34]/30 p-4 text-xs font-medium text-[#2F611F] flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 shrink-0" />
                      <span>Thank you! Your message and collaboration inquiry have been successfully sent to the CORA team.</span>
                    </div>
                  )}

                  <form onSubmit={handleContactSubmit} className="mt-5 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-[#2C1E18]">
                          Full Name
                        </label>
                        <input
                          type="text"
                          required
                          value={contactName}
                          onChange={(e) => setContactName(e.target.value)}
                          placeholder="Your Name / Organization"
                          className="mt-1 w-full rounded-xl border border-[#D6CCBA] bg-white p-3 text-xs text-[#2C1E18] focus:border-[#3B5B3D] focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#2C1E18]">
                          Email or WhatsApp No.
                        </label>
                        <input
                          type="text"
                          required
                          value={contactEmail}
                          onChange={(e) => setContactEmail(e.target.value)}
                          placeholder="name@example.com / +62..."
                          className="mt-1 w-full rounded-xl border border-[#D6CCBA] bg-white p-3 text-xs text-[#2C1E18] focus:border-[#3B5B3D] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#2C1E18]">
                        Subject / Partnership Topic
                      </label>
                      <select
                        value={contactSubject}
                        onChange={(e) => setContactSubject(e.target.value)}
                        className="mt-1 w-full rounded-xl border border-[#D6CCBA] bg-white p-3 text-xs text-[#2C1E18] focus:border-[#3B5B3D] focus:outline-none"
                      >
                        <option>General Inquiry &amp; Product Consultation</option>
                        <option>Coconut Pulp Supplier Partnership</option>
                        <option>Wholesale / B2B Catering Orders</option>
                        <option>Research &amp; Sustainability Collaboration</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#2C1E18]">
                        Your Message
                      </label>
                      <textarea
                        rows={4}
                        required
                        value={contactMessage}
                        onChange={(e) => setContactMessage(e.target.value)}
                        placeholder="Describe your inquiry, project, or collaboration ideas..."
                        className="mt-1 w-full rounded-xl border border-[#D6CCBA] bg-white p-3 text-xs text-[#2C1E18] focus:border-[#3B5B3D] focus:outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-[#3B5B3D] px-6 py-3 text-xs font-bold text-white shadow-xs hover:bg-[#2F4A31] transition"
                    >
                      <Send className="h-3.5 w-3.5" />
                      <span>Send Message</span>
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
