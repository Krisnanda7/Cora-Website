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
    name: 'Bagus Krisna',
    role: 'Founder & Innovation Lead',
    responsibility: 'Mengembangkan strategi sirkular, arsitektur produk, dan visi teknologi ekosistem CORA.',
    image: '/images/hero/hero.jpg',
  },
  {
    name: 'Nadia Laksmi',
    role: 'Food Tech & R&D Specialist',
    responsibility: 'Formulasi higienis tepung ampas kelapa, uji proksimat nutrisi, dan rekayasa pangan bebas gluten.',
    image: '/images/products/brownies.jpg',
  },
  {
    name: 'Putu Arya',
    role: 'Supply Chain & Community Lead',
    responsibility: 'Mengelola jaringan logistik penjemputan residu kelapa dan kemitraan UMKM pedagang santan.',
    image: '/images/products/cookies.jpg',
  },
  {
    name: 'Siti Rahma',
    role: 'Sustainability & Impact Officer',
    responsibility: 'Memantau metrik pengurangan sampah, jejak karbon, dan kepatuhan standar SDGs perusahaan.',
    image: '/images/products/coconut.jpg',
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
    question: 'Apa itu produk pangan sirkular CORA?',
    answer:
      'Produk CORA diolah dari ampas kelapa hasil sampingan produksi santan segar yang biasanya dibuang. Kami mengeringkannya secara higienis dengan suhu terkontrol dan menggilingnya menjadi tepung kelapa bernutrisi tinggi, brownies fudgy, dan cookies kaya serat.',
  },
  {
    category: 'product',
    question: 'Apakah produk CORA bebas gluten (gluten-free)?',
    answer:
      'Ya! Tepung ampas kelapa murni dan semua olahan camilan CORA secara alami 100% bebas gluten (gluten-free), tinggi serat pangan, dan aman untuk penderita celiac maupun pelaku pola makan sehat.',
  },
  {
    category: 'purchase',
    question: 'Bagaimana cara melakukan pembelian di website CORA?',
    answer:
      'Pilih produk di menu Our Product, tentukan jumlah dan varian, lalu klik Tambah ke Keranjang. Buka keranjang belanja dan lanjutkan ke Checkout. Anda dapat mengisi data pengiriman dan melakukan simulasi pembayaran transfer bank.',
  },
  {
    category: 'purchase',
    question: 'Apakah transaksi saat ini adalah transaksi riil?',
    answer:
      'Saat ini website CORA berjalan sebagai Interactive Prototype / Demo. Anda dapat mencoba seluruh alur belanja, upload bukti transfer demo, dan pelacakan pesanan secara gratis tanpa pemotongan saldo nyata.',
  },
  {
    category: 'shipping',
    question: 'Berapa lama estimasi pengiriman pesanan?',
    answer:
      'Pengiriman pesanan menggunakan kurir rekanan reguler (2-3 hari kerja) atau express/next day (1 hari kerja). Anda dapat melacak posisi pesanan secara berkala melalui menu Lacak Pesanan.',
  },
  {
    category: 'usage',
    question: 'Bagaimana cara menggunakan tepung kelapa CORA untuk baking?',
    answer:
      'Gunakan takaran 1/4 hingga 1/3 dari resep tepung terigu biasa (misal: 100g terigu diganti 30g tepung kelapa CORA). Tambahkan 1 butir telur ekstra dan diamkan adonan selama 3 menit agar serat menyerap cairan secara sempurna.',
  },
  {
    category: 'pickup',
    question: 'Siapa saja yang dapat bergabung dalam program Coconut Pickup?',
    answer:
      'Pedagang kelapa parut pasar tradisional, kios santan murni, pabrik pengolahan kelapa, hingga katering/rumah makan yang menghasilkan limbah ampas kelapa minimal 10 kg per penjemputan.',
  },
  {
    category: 'pickup',
    question: 'Apakah mitra pemasok kelapa mendapatkan imbalan biaya?',
    answer:
      'Ya! Setiap kilogram ampas kelapa bersih yang memenuhi standar mutu akan dihargai dengan kompensasi ekonomi kompetitif dan dijemput langsung oleh armada logistik CORA tanpa biaya penjemputan.',
  },
];

export default function AboutPage() {
  const [activeFaqCat, setActiveFaqCat] = useState<string>('all');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Contact Form State
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactSubject, setContactSubject] = useState('Pertanyaan Umum');
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
                Menghidupkan kembali ampas kelapa menjadi bahan pangan bernutrisi tinggi, memberdayakan UMKM kelapa lokal, dan mewujudkan masa depan pangan bebas sampah.
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
                  Dari Limbah Terabaikan Menjadi Peluang Baru
                </h2>
              </div>

              <div className="space-y-4 text-xs sm:text-sm text-[#5C4B42] leading-relaxed">
                <p>
                  <strong className="text-[#2C1E18]">Latar Belakang:</strong> Indonesia merupakan salah satu negara produsen kelapa terbesar di dunia. Setiap hari, ribuan pasar tradisional dan industri santan memproses jutaan butir kelapa untuk diambil santan dan minyaknya.
                </p>
                <p>
                  <strong className="text-[#2C1E18]">Permasalahan Limbah:</strong> Namun, proses pemerasan santan tersebut meninggalkan gunungan ampas kelapa basah yang kerap dianggap sebagai limbah tak bernilai. Diperkirakan ribuan ton ampas kelapa berakhir membusuk di TPA setiap bulan, melepaskan gas metana berbahaya dan mencemari lingkungan.
                </p>
                <p>
                  <strong className="text-[#2C1E18]">Ide Inovasi CORA:</strong> Di sinilah CORA hadir. Kami memandang ampas kelapa bukan sebagai sampah, melainkan komoditas pangan bernutrisi tinggi yang belum teroptimalkan. Melalui proses pengeringan higienis berstandar pangan dan penggilingan ultra-halus, kami mengubah ampas tersebut menjadi <em>Tepung Ampas Kelapa</em> tinggi serat pangan, artisanal brownies cokelat, serta cookies renyah bergizi.
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
                  alt="Perjalanan Inovasi CORA"
                  fill
                  className="object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <p className="text-xs font-semibold tracking-wide uppercase text-[#86C975]">
                    Circular Food Revolution
                  </p>
                  <p className="font-serif text-xl font-bold">
                    Mengubah Residu Menjadi Sumber Pangan Berkelanjutan
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
                        Visi Kami
                      </p>
                      <h3 className="text-xl font-bold text-[#2C1E18]">
                        Pelopor Pangan Sirkular Terdepan
                      </h3>
                    </div>
                  </div>
                  <p className="text-sm leading-relaxed text-[#5C4B42]">
                    Menjadi pionir inovasi pangan sirkular di Asia Tenggara yang mentransformasikan hasil samping pertanian kelapa menjadi sumber pangan bernilai nutrisi tinggi, ramah iklim, dan berdaya saing global demi tercapainya sistem pangan tanpa limbah (zero food waste).
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
                        Misi Kami
                      </p>
                      <h3 className="text-xl font-bold text-[#2C1E18]">
                        Tiga Langkah Nyata Berkelanjutan
                      </h3>
                    </div>
                  </div>
                  <ul className="space-y-3 text-xs sm:text-sm text-[#5C4B42]">
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-[#3B5B3D] mt-0.5" />
                      <span><strong>Higiene &amp; Nilai Tambah:</strong> Menyelamatkan ampas kelapa dengan teknologi pengeringan higienis menjadi tepung fungsional bermutu tinggi.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-[#3B5B3D] mt-0.5" />
                      <span><strong>Diversifikasi Sehat:</strong> Menyediakan alternatif bahan pangan bebas gluten yang kaya serat dan lezat bagi masyarakat.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-[#3B5B3D] mt-0.5" />
                      <span><strong>Kemitraan UMKM:</strong> Memberdayakan pedagang kelapa parut dan petani lokal lewat kemitraan sirkular dan pendapatan tambahan pasti.</span>
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
              Para inovator muda yang berdedikasi menciptakan dampak positif bagi ekosistem pangan dan lingkungan.
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
                Jawaban atas pertanyaan umum mengenai produk, cara pembelian, pengiriman, penggunaan tepung, dan penjemputan kelapa.
              </p>
            </div>

            {/* Filter Buttons */}
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {[
                { id: 'all', label: 'Semua Pertanyaan' },
                { id: 'product', label: 'Produk & Nutrisi' },
                { id: 'purchase', label: 'Pembelian & Demo' },
                { id: 'shipping', label: 'Pengiriman' },
                { id: 'usage', label: 'Cara Pakai Tepung' },
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
                    Hubungi &amp; Bermitra dengan CORA
                  </h2>
                  <p className="mt-2 text-xs sm:text-sm text-[#6E5C52] leading-relaxed">
                    Kami sangat terbuka untuk kemitraan pengadaan bahan baku, riset pangan sirkular, pemesanan katering/B2B, maupun kolaborasi keberlanjutan.
                  </p>
                </div>

                <div className="space-y-4 text-xs sm:text-sm text-[#5C4B42]">
                  <div className="flex items-start gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#3B5B3D]/10 text-[#3B5B3D] shrink-0">
                      <MapPin className="h-4 w-4" />
                    </span>
                    <div>
                      <strong className="block text-[#2C1E18]">Alamat Operasional:</strong>
                      <span>Jl. Tukad Balian No. 88, Renon, Denpasar, Bali 80226</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#3B5B3D]/10 text-[#3B5B3D] shrink-0">
                      <Mail className="h-4 w-4" />
                    </span>
                    <div>
                      <strong className="block text-[#2C1E18]">Email Resmi:</strong>
                      <span>cora@gmail.com</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#3B5B3D]/10 text-[#3B5B3D] shrink-0">
                      <Phone className="h-4 w-4" />
                    </span>
                    <div>
                      <strong className="block text-[#2C1E18]">Nomor WhatsApp:</strong>
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
                    Formulir Pertanyaan &amp; Kerja Sama
                  </h3>
                  <p className="mt-1 text-xs text-[#6E5C52]">
                    Kirimkan pesan atau proposal kolaborasi Anda. Tim kami akan merespons dalam waktu 1x24 jam.
                  </p>

                  {contactSuccess && (
                    <div className="mt-4 rounded-2xl bg-[#4E9A34]/15 border border-[#4E9A34]/30 p-4 text-xs font-medium text-[#2F611F] flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 shrink-0" />
                      <span>Terima kasih! Pesan dan formulir kerja sama Anda berhasil dikirim ke tim CORA.</span>
                    </div>
                  )}

                  <form onSubmit={handleContactSubmit} className="mt-5 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-[#2C1E18]">
                          Nama Lengkap
                        </label>
                        <input
                          type="text"
                          required
                          value={contactName}
                          onChange={(e) => setContactName(e.target.value)}
                          placeholder="Nama Anda / Perusahaan"
                          className="mt-1 w-full rounded-xl border border-[#D6CCBA] bg-white p-3 text-xs text-[#2C1E18] focus:border-[#3B5B3D] focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#2C1E18]">
                          Email atau No. WhatsApp
                        </label>
                        <input
                          type="text"
                          required
                          value={contactEmail}
                          onChange={(e) => setContactEmail(e.target.value)}
                          placeholder="email@contoh.com / 0812..."
                          className="mt-1 w-full rounded-xl border border-[#D6CCBA] bg-white p-3 text-xs text-[#2C1E18] focus:border-[#3B5B3D] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#2C1E18]">
                        Subjek / Topik Kemitraan
                      </label>
                      <select
                        value={contactSubject}
                        onChange={(e) => setContactSubject(e.target.value)}
                        className="mt-1 w-full rounded-xl border border-[#D6CCBA] bg-white p-3 text-xs text-[#2C1E18] focus:border-[#3B5B3D] focus:outline-none"
                      >
                        <option>Pertanyaan Umum &amp; Konsultasi Produk</option>
                        <option>Kemitraan Pemasok Ampas Kelapa</option>
                        <option>Pemesanan Grosir / B2B Katering</option>
                        <option>Kolaborasi Riset &amp; Publikasi</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#2C1E18]">
                        Pesan Anda
                      </label>
                      <textarea
                        rows={4}
                        required
                        value={contactMessage}
                        onChange={(e) => setContactMessage(e.target.value)}
                        placeholder="Tuliskan detail pertanyaan atau rencana kerja sama Anda..."
                        className="mt-1 w-full rounded-xl border border-[#D6CCBA] bg-white p-3 text-xs text-[#2C1E18] focus:border-[#3B5B3D] focus:outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-[#3B5B3D] px-6 py-3 text-xs font-bold text-white shadow-xs hover:bg-[#2F4A31] transition"
                    >
                      <Send className="h-3.5 w-3.5" />
                      <span>Kirim Pesan</span>
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
