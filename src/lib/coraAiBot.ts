/**
 * CORA AI Culinary & Upcycle Assistant Knowledge Engine
 * 
 * Provides intelligent agent responses, intent detection, and guardrails
 * for the prototype chatbot on the CORA website.
 */

export interface ChatMessage {
  sender: 'user' | 'bot';
  text: string;
  time: string;
}

export const PRESET_CHAT_QUESTIONS: string[] = [
  '📏 What is the conversion ratio of coconut flour compared to wheat flour?',
  '🥚 Why are extra eggs and liquids needed when baking with coconut flour?',
  '💡 Practical tips to prevent coconut flour bakes from turning dry or crumbly',
  '🥥 What are the key nutritional & fiber benefits of CORA coconut flour?',
  '🥑 Are there vegan egg substitutes for coconut flour recipes?',
  '🚛 How does the coconut pickup workflow work for market vendors in Bali?',
  '📦 What is the shelf life and optimal storage method for coconut flour?',
  '🍗 Can coconut flour be used for crispy savory coatings in an air fryer?',
];

interface KnowledgeIntent {
  id: string;
  keywords: string[];
  replyId: string;
  replyEn: string;
}

const KNOWLEDGE_INTENTS: KnowledgeIntent[] = [
  // 1. GREETINGS
  {
    id: 'greeting',
    keywords: [
      'halo', 'hai', 'hi', 'hey', 'hello', 'pagi', 'siang', 'sore', 'malam',
      'assalamualaikum', "assalamu'alaikum", 'salam', 'selamat pagi',
      'selamat siang', 'selamat malam', 'halo min', 'permisi', 'test', 'tes'
    ],
    replyId: `Halo! 👋 Senang bertemu dengan Anda. Saya **CORA Culinary & Upcycle AI Assistant**, agen kecerdasan buatan yang dirancang khusus untuk memandu petualangan kuliner sehat dan sirkular Anda bersama produk tepung kelapa CORA 🥥.

Berikut beberapa hal yang bisa kita diskusikan bersama:
• 📏 **Rasio & Takaran**: Panduan substitusi tepung terigu dengan tepung kelapa CORA.
• 🥚 **Hidrasi & Pengikat**: Formulasi telur dan cairan agar tekstur kue lembut dan tidak rapuh.
• 📊 **Nutrisi & Serat**: Profil gizi ampas kelapa murni, serat pangan tinggi, dan indeks glikemik.
• 🧁 **Inspirasi Resep**: Pancake, waffle, banana bread, muffin, hingga kudapan gurih.
• 🚛 **Program Coconut Pickup**: Sistem penjemputan limbah organik pedagang santan di Bali.

Ada resep tertentu atau pertanyaan seputar produk yang ingin kita bahas sekarang?`,
    replyEn: `Hello! 👋 Great to meet you. I am the **CORA Culinary & Upcycle AI Assistant**, your dedicated companion for baking innovations and circular food solutions with CORA coconut flour 🥥.

Here are topics we can explore together:
• 📏 **Substitution Ratios**: Replacing wheat flour with upcycled coconut flour.
• 🥚 **Hydration & Binders**: Balancing eggs and liquids for moist, fluffy bakes.
• 📊 **Nutrition Profile**: High dietary fiber content, low glycemic index, and whole plant nutrition.
• 🧁 **Recipe Guidance**: Perfecting pancakes, waffles, banana loaves, and keto snacks.
• 🚛 **Coconut Pickup Ecosystem**: Logistics and partnership for coconut vendors in Bali.

How can I assist your baking or circular journey today?`
  },

  // 2. IDENTITY & CAPABILITIES
  {
    id: 'identity',
    keywords: [
      'siapa kamu', 'kamu siapa', 'who are you', 'what are you', 'kamu bot apa',
      'fungsi kamu', 'apa tugasmu', 'bisa bantu apa', 'kemampuan', 'fitur ai',
      'profil kamu', 'tentang kamu'
    ],
    replyId: `Saya adalah **CORA AI Assistant** 🥥, agen pintar foodtech berbasis pengetahuan khusus produk inovasi sirkular kelapa CORA.

Peran utama saya meliputi:
1. 🧪 **Konsultasi Baking & Food Science**: Memberikan perhitungan rasio hidrasi cairan, telur, dan tepung kelapa agar kue buatan Anda tidak bantat atau kering.
2. 📖 **Katalog Resep Cerdas**: Merekomendasikan resep sehat ramah serat yang dipersonalisasi sesuai preferensi Anda.
3. ♻️ **Edukasi Ekonomi Sirkular**: Menjelaskan bagaimana ampas kelapa segar diselamatkan dari TPA untuk diproses secara higienis menjadi pangan fungsional bernilai tinggi.
4. 🤝 **Panduan Kemitraan**: Menjawab alur penjemputan ampas kelapa bagi pedagang parutan kelapa & perasan santan di Bali.

Silakan ajukan pertanyaan apa pun seputar baking, nutrisi, atau produk CORA!`,
    replyEn: `I am the **CORA AI Assistant** 🥥, a specialized foodtech agent focused on circular coconut innovations and wholesome high-fiber baking science.

My core capabilities include:
1. 🧪 **Baking Science Consulting**: Calculating optimal liquid, egg, and flour balances so your coconut flour creations never turn out dry.
2. 📖 **Smart Recipe Formulations**: Recommending tailored recipes for wholesome pancakes, breads, and treats.
3. ♻️ **Circular Impact Education**: Explaining how coconut milk byproducts are diverted from landfills into clean functional foods.
4. 🤝 **Pickup Network Guidance**: Assisting local coconut milk vendors on partnering with our residue collection fleet in Bali.`
  },

  // 3. RATIO CONVERSION
  {
    id: 'ratio_conversion',
    keywords: [
      'rasio', 'ratio', 'takaran', 'substitusi', 'ganti terigu', 'konversi',
      'conversion', 'convert', 'replace flour', 'wheat', 'terigu', 'gandum',
      'banding', 'perbandingan', 'berapa takaran', 'cara ganti'
    ],
    replyId: `**Rasio Konversi Tepung Kelapa CORA vs Tepung Terigu:**

Gunakan rasio **1:3 hingga 1:4** terhadap tepung terigu serbaguna.
• **Contoh Praktis:** Jika resep biasa membutuhkan 100g terigu serbaguna, Anda hanya membutuhkan **25g – 30g** tepung kelapa CORA!

💡 **Mengapa takarannya jauh lebih sedikit?**
Tepung ampas kelapa murni memiliki konsentrasi **serat makanan (dietary fiber) yang luar biasa tinggi**, sehingga mampu menyerap cairan 3 hingga 4 kali lipat lebih banyak dibandingkan tepung gandum. 

⚠️ **Catatan Penting:** 
Jangan pernah mengganti tepung terigu dengan tepung kelapa dengan rasio 1:1, karena adonan akan menjadi sangat padat, keras, dan tidak dapat mengembang.`,
    replyEn: `**CORA Coconut Flour Conversion Ratio:**

Use a **1:3 to 1:4 substitution ratio** compared to regular all-purpose wheat flour.
• **Practical Example:** If a recipe calls for 100g of wheat flour, use only **25g – 30g** of CORA coconut flour!

💡 **Why is so little needed?**
CORA pure upcycled coconut flour has an exceptionally high concentration of **dietary fiber**, causing it to absorb 3 to 4 times more liquid than conventional grain flours.

⚠️ **Key Reminder:**
Never substitute coconut flour for all-purpose flour on a 1:1 basis, or your batter will become excessively dense and rock-hard.`
  },

  // 4. EGGS & HYDRATION
  {
    id: 'eggs_and_liquid',
    keywords: [
      'telur', 'egg', 'cairan', 'liquid', 'susu', 'air', 'basah', 'hidrasi',
      'hydration', 'kenapa banyak telur', 'butuh telur', 'kenapa telur',
      'jumlah telur', 'pengikat', 'binder', 'adonan lembab'
    ],
    replyId: `**Panduan Telur & Keseimbangan Cairan (Hydration):**

Karena tepung kelapa alami tidak memiliki gluten (yang biasanya berfungsi membentuk jaring elastis penahan gas), **protein telur berfungsi sebagai pengikat struktural utama** sekaligus pemberi kelembapan esensial.

🥚 **Golden Rule (Aturan Emas):**
• Untuk setiap **30g tepung kelapa CORA**, gunakan minimal **1 butir telur ukuran besar**.
• Tingkatkan takaran cairan (air, susu almond, santan, atau oat milk) sekitar 20%–30% lebih banyak dari resep standar.
• **Waktu Istirahat (Resting Time):** Diamkan adonan selama 3–5 menit setelah diaduk sebelum dipanggang. Hal ini memberi waktu bagi serat kelapa untuk menyerap cairan secara merata.`,
    replyEn: `**Eggs & Liquid Hydration Guide:**

Because coconut flour is naturally grain-free and lacks gluten to form an elastic network, **egg proteins serve as the primary structural binder** and crucial moisture reservoir.

🥚 **The Golden Rule:**
• For every **30g of CORA coconut flour**, add at least **1 large egg**.
• Increase liquid ingredients (almond milk, coconut milk, water, or oat milk) by roughly 20%–30% compared to typical recipes.
• **Resting Time:** Always let the batter rest for 3–5 minutes after mixing. This allows the dense coconut fibers to thoroughly hydrate before heat is applied.`
  },

  // 5. VEGAN / EGG REPLACER
  {
    id: 'vegan_egg_replacer',
    keywords: [
      'vegan', 'tanpa telur', 'eggless', 'alergi telur', 'flaxseed', 'chia',
      'psyllium', 'pengganti telur', 'substitusi telur', 'tidak makan telur'
    ],
    replyId: `**Baking Tepung Kelapa Tanpa Telur (Vegan / Egg-Free):**

Tepung kelapa membutuhkan pengikat yang kuat. Berikut 3 alternatif pengganti telur yang terbukti berhasil:

1. **Flax Egg / Chia Egg (Rekomendasi Terbaik):**
   • Campur 1 sdm bubuk flaxseed (biji rami) atau chia seed dengan 3 sdm air hangat.
   • Diamkan 5–10 menit hingga terbentuk gel kental (setara 1 butir telur).
2. **Puree Pisang Matang / Applesauce:**
   • Gunakan 1/4 cangkir (sekitar 60g) pisang lumat matang atau saus apel per telur. Memberikan kelembapan alami dan aroma manis lembut.
3. **Psyllium Husk:**
   • 1 sdt bubuk psyllium husk dilarutkan dalam 3 sdm air hangat. Sangat efektif memberikan kelenturan alami pada adonan roti atau flatbread.`,
    replyEn: `**Baking with Coconut Flour Without Eggs (Vegan Guide):**

Since coconut flour needs strong binding agents, here are the top 3 proven egg substitutes:

1. **Flax or Chia Egg (Best Choice):**
   • Whisk 1 tbsp finely ground flaxseed or chia seeds with 3 tbsp warm water.
   • Let sit for 5–10 minutes until a gelatinous texture forms (equals 1 egg).
2. **Mashed Banana or Applesauce:**
   • Use 1/4 cup (~60g) mashed ripe banana or unsweetened applesauce per egg to impart tenderness and natural moisture.
3. **Psyllium Husk Powder:**
   • Dissolve 1 tsp psyllium husk in 3 tbsp warm water. Ideal for providing chew and pliable elasticity in flatbreads and crusts.`
  },

  // 6. PREVENTING DRY & CRUMBLY TEXTURE
  {
    id: 'dry_crumbly_fix',
    keywords: [
      'kering', 'dry', 'keras', 'rapuh', 'hancur', 'crumbly', 'seret',
      'bantat', 'tekstur kasar', 'kenapa keras', 'kue kering', 'solusi kering',
      'tips adonan', 'mengapa rapuh'
    ],
    replyId: `**Solusi Mengatasi Kue Kering atau Mudah Rapuh:**

Jika hasil baking tepung kelapa Anda terasa kering atau pecah-pecah, berikut 4 langkah perbaikannya:

1. ⚖️ **Gunakan Timbangan Digital:** Jangan menakar tepung kelapa dengan menekan sendok ke dalam wadah (ini bisa membuat takaran berlebih hingga 40%). Timbang selalu dalam satuan gram.
2. 🥥 **Tambahkan Lemak Sehat:** Sertakan 2–3 sendok makan minyak kelapa murni (*virgin coconut oil*), mentega cair, atau puree alpukat untuk melembutkan jaringan serat.
3. 🍌 **Sertakan Agen Pelembab Alami:** Pisang matang lumat, labu kuning (*pumpkin puree*), atau greek yogurt sangat efektif mengunci kelembaban di dalam pori-pori kue.
4. ⏱️ **Koreksi Suhu & Waktu Panggang:** Tepung kelapa matang 5 menit lebih cepat dari terigu. Panggang pada suhu sedang (160°C – 175°C) dan jangan memanggang terlalu lama (*overbaking*).`,
    replyEn: `**How to Fix Dry or Crumbly Coconut Flour Bakes:**

If your baked goods turn out too dry or fragile, apply these 4 proven solutions:

1. ⚖️ **Always Weigh by Grams:** Never scoop directly from the bag with a cup (which compacts the flour by up to 40%). Use a digital kitchen scale.
2. 🥥 **Incorporate Healthy Fats:** Add 2–3 tbsp melted coconut oil, grass-fed butter, or avocado puree to soften the dense plant fibers.
3. 🍌 **Use Moisture Reservoirs:** Mashed bananas, pumpkin puree, or natural yogurt lock moisture inside the crumb structure.
4. ⏱️ **Lower Oven Temp & Baking Time:** Coconut flour bakes ~5 minutes faster than grain flours. Bake at 160°C–175°C (325°F–350°F) and avoid overbaking.`
  },

  // 7. NUTRITION & FIBER BENEFITS
  {
    id: 'nutrition_and_fiber',
    keywords: [
      'nutrisi', 'nutrition', 'gizi', 'serat', 'fiber', 'serat pangan',
      'kalori', 'calories', 'sehat', 'sehat mana', 'manfaat', 'keunggulan',
      'kandungan', 'protein', 'karbo', 'karbohidrat'
    ],
    replyId: `**Kandungan Nutrisi & Keunggulan Tepung Kelapa CORA (per 100g):**

• 🌿 **Serat Pangan Alami:** ~38g – 42g (sangat tinggi, mencukupi >100% kebutuhan serat harian orang dewasa).
• 🩸 **Indeks Glikemik Rendah (Low GI):** Tidak memicu lonjakan gula darah mendadak, sangat baik untuk kestabilan energi dan rasa kenyang lebih lama.
• 💪 **Protein Nabati:** ~15g – 18g protein murni per 100g.
• 🥥 **Asam Lemak Sehat (MCT):** Mengandung asam laurat dan trigliserida rantai menengah yang langsung dimetabolisme menjadi energi bersih.
• 🌾 **Bebas Gandum (Grain-Free):** Murni 100% dari ampas kelapa segar tanpa campuran biji-bijian, pengawet, atau pewarna buatan.`,
    replyEn: `**Nutritional Highlights of CORA Pure Coconut Flour (per 100g):**

• 🌿 **Dietary Fiber:** ~38g – 42g (exceptionally high, covering over 100% of recommended daily fiber intake).
• 🩸 **Low Glycemic Index:** Promotes steady sustained energy without sharp blood sugar spikes.
• 💪 **Plant Protein:** ~15g – 18g of clean plant-based protein per 100g.
• 🥥 **Healthy Fats & MCTs:** Rich in medium-chain triglycerides that fuel clean, efficient cellular metabolism.
• 🌾 **100% Grain-Free:** Made purely from fresh upcycled coconut residue with zero synthetic preservatives or grain additives.`
  },

  // 8. DIABETES & LOW GI
  {
    id: 'diabetes_low_gi',
    keywords: [
      'diabetes', 'gula darah', 'diabet', 'low gi', 'indeks glikemik',
      'aman untuk diabetes', 'penderita diabetes', 'gula', 'diet gula'
    ],
    replyId: `**Apakah Tepung Kelapa CORA Aman untuk Penderita Diabetes?**

Ya, sangat direkomendasikan! Tepung kelapa adalah salah satu pilihan tepung terbaik bagi penderita diabetes dan pelaku diet rendah karbohidrat:
• **Indeks Glikemik Rendah (~45-50):** Jauh lebih ramah dibanding tepung terigu putih yang memiliki indeks glikemik di atas 70.
• **Tinggi Serat Larut & Tidak Larut:** Serat memperlambat laju penyerapan glukosa ke dalam aliran darah, sehingga membantu mencegah lonjakan gula darah setelah makan (*postprandial glucose spike*).
• **Saran Olahan:** Kombinasikan dengan pemanis alami nol kalori seperti stevia, erythritol, atau pemanis monk fruit saat membuat kue.`,
    replyEn: `**Is CORA Coconut Flour Diabetic-Friendly?**

Yes, highly recommended! Upcycled coconut flour is one of the premier choices for glycemic management:
• **Low Glycemic Index (~45-50):** Significantly lower than conventional white wheat flour which spikes above 70.
• **High Insoluble & Soluble Fiber:** The dense fiber matrix slows down carbohydrate digestion and blunts post-meal glucose spikes.
• **Recommendation:** Pair with natural zero-calorie sweeteners like stevia, monk fruit, or erythritol for guilt-free diabetic baking.`
  },

  // 9. SHELF LIFE & STORAGE
  {
    id: 'shelf_life_storage',
    keywords: [
      'simpan', 'penyimpanan', 'storage', 'store', 'tahan berapa lama',
      'expired', 'kedaluwarsa', 'kadaluarsa', 'basi', 'awet', 'toples',
      'kulkas', 'tengik', 'masa simpan', 'shelf life', 'cara simpan'
    ],
    replyId: `**Masa Simpan & Cara Menyimpan Tepung Kelapa CORA:**

• 📅 **Masa Simpan Optimal:** **6 hingga 12 bulan** jika disimpan dalam kondisi yang tepat.
• 🫙 **Cara Penyimpanan Terbaik:**
  1. **Wadah Kedap Udara:** Simpan dalam toples kaca atau pouch bersegel rapat untuk mencegah masuknya uap air (karena sifat tepung kelapa sangat mudah menyerap kelembapan udara).
  2. **Tempat Sejuk & Kering:** Hindarkan dari sinar matahari langsung dan area dekat kompor panas.
  3. **Tips Penyimpanan Jangka Panjang (>6 Bulan):** Anda bisa menyimpannya di dalam kulkas (chiller) atau freezer untuk menjaga kesegaran minyak alami kelapa dan mencegah bau tengik.`,
    replyEn: `**Shelf Life & Storage Instructions for CORA Coconut Flour:**

• 📅 **Optimal Shelf Life:** **6 to 12 months** when stored properly.
• 🫙 **Best Storage Practices:**
  1. **Airtight Container:** Keep in a sealed glass jar or zip-lock container to protect against ambient humidity (as coconut flour avidly draws moisture from the air).
  2. **Cool & Dry Environment:** Store in a dark pantry away from heat sources and direct sunlight.
  3. **Extended Storage (>6 Months):** Placing the container in the refrigerator or freezer preserves the natural coconut lipids and prevents oxidation.`
  },

  // 10. PRODUCT DETAILS & PRICING
  {
    id: 'cora_product_details',
    keywords: [
      'produk cora', 'ukuran', 'berapa gram', 'harga', 'kemasan', 'beli produk',
      'pack', 'varian', 'berapa harganya', 'berat bersih', 'pure coconut flour',
      'detail produk'
    ],
    replyId: `**Detail Produk Resmi CORA:**

• **Nama Produk:** CORA Pure Coconut Flour
• **Berat Bersih:** **100g** per kemasan pouch
• **Harga Resmi:** **Rp 18.000**
• **Komposisi:** 100% Upcycled Coconut Pulp (Ampas Kelapa Segar Alami)
• **Karakteristik Fisik:** Butiran halus berwarna krem cerah dengan aroma kelapa lembut alami tanpa bau asam.
• **Nilai Dampak:** Setiap 1 pouch 100g secara langsung menyelamatkan **150g limbah ampas kelapa** dari tempat sampah dan menyalurkan pendapatan tambahan bagi mitra pedagang santan di Bali.

Anda bisa memesannya langsung di menu **Our Products** di navigasi atas!`,
    replyEn: `**Official CORA Flagship Product Details:**

• **Product Name:** CORA Pure Coconut Flour
• **Net Weight:** **100g** pouch
• **Official Price:** **IDR 18,000**
• **Ingredients:** 100% Upcycled Fresh Coconut Pulp Residue
• **Sensory Profile:** Soft, finely milled light-cream powder with a naturally delicate coconut aroma.
• **Impact Metric:** Each 100g pouch directly rescues **150g of coconut residue** from landfills while supporting traditional coconut vendor households in Bali.

Available now on our **Our Products** catalog!`
  },

  // 11. COCONUT PICKUP & SUPPLIER PARTNERSHIP
  {
    id: 'coconut_pickup_supplier',
    keywords: [
      'pickup', 'jemput', 'setor ampas', 'jual ampas', 'pedagang santan',
      'mitra', 'supplier', 'pasar', 'beli ampas', 'limbah kelapa',
      'kemitraan', 'pengepul', 'setor', 'jadwal jemput', 'residu kelapa'
    ],
    replyId: `**Program Kemitraan Penjemputan Ampas Kelapa (Coconut Pickup):**

CORA membangun kemitraan sirkular langsung bersama para pedagang parutan kelapa dan perasan santan di pasar tradisional Bali.

🚛 **Sistem & Ketentuan Kemitraan:**
1. **Standar Higienitas:** Ampas kelapa harus berasal dari kelapa segar bersih dan disetor maksimal 2-3 jam setelah proses pemerasan (tanpa tercampur sampah plastik atau bahan kimia).
2. **Wadah Higienis Gratis:** CORA meminjamkan wadah penyimpanan *food-grade storage bin* khusus berpenutup rapat.
3. **Penjemputan Armada Rutin:** Tim logistik CORA menjemput ke lokasi lapak Anda setiap pagi sesuai jadwal rute pasar.
4. **Insentif Tunai Pasti:** Setiap kilogram ampas kelapa yang memenuhi standar dibeli dengan harga kompensasi yang adil sebagai penghasilan ekstra harian Anda!

Ingin bergabung menjadi mitra pemasok? Buka halaman **Coconut Pickup** untuk registrasi cepat.`,
    replyEn: `**Coconut Residue Pickup Program & Supplier Partnership:**

CORA partners directly with traditional market vendors and coconut milk extractors across Bali.

🚛 **How the Circular Partnership Works:**
1. **Quality Criteria:** Residue must be fresh (collected within 2-3 hours of coconut milk pressing) and kept free from trash or external contaminants.
2. **Free Food-Grade Bins:** CORA provides dedicated covered food-grade bins to participating vendors.
3. **Scheduled Daily Routes:** Our dedicated logistics team picks up bins every morning directly at vendor market stalls.
4. **Fair Financial Compensation:** Every kilogram collected is compensated fairly, turning discarded waste into daily supplementary income!

Interested vendors can register via the **Coconut Pickup** page.`
  },

  // 12. PICKUP LOCATIONS (BALI)
  {
    id: 'pickup_locations',
    keywords: [
      'lokasi pickup', 'denpasar', 'badung', 'kuta', 'sanur', 'ubud',
      'bali', 'rute jemput', 'daerah mana', 'area jemput', 'pasar mana'
    ],
    replyId: `**Jangkauan Area Penjemputan Kelapa CORA di Bali:**

Saat ini rute logistik *Coconut Pickup* beroperasi aktif di sentra pasar tradisional:
• 📍 **Kota Denpasar:** Pasar Badung, Pasar Kumbasari, Pasar Kreneng, dan Pasar Sanglah.
• 📍 **Kabupaten Badung:** Pasar Mengwi, Dalung, Kerobokan, dan Kuta.
• 📍 **Ekspansi Rute Mendatang:** Gianyar (Ubud) dan Tabanan dalam tahap persiapan rute percontohan.

Jika lapak Anda berada di luar area di atas namun memiliki pasokan harian >20 kg, silakan hubungi tim operasional kami di halaman **Coconut Pickup** untuk penjadwalan titik temu khusus!`,
    replyEn: `**Active Pickup Coverage Areas in Bali:**

Our morning collection fleet currently covers key traditional market clusters:
• 📍 **Denpasar City:** Badung Market, Kumbasari, Kreneng, and Sanglah Market.
• 📍 **Badung Regency:** Mengwi Market, Dalung, Kerobokan, and Kuta.
• 📍 **Upcoming Expansions:** Ubud (Gianyar) and Tabanan pilot routes are currently in preparation.

Vendors with daily output exceeding 20 kg can request custom collection routes on the **Coconut Pickup** page.`
  },

  // 13. SUSTAINABILITY & IMPACT
  {
    id: 'sustainability_impact',
    keywords: [
      'dampak', 'lingkungan', 'sustainability', 'jejak karbon', 'emisi',
      'metana', 'sampah organik', 'penyelamatan ampas', 'sdg', 'tpa',
      'ramah lingkungan', 'circular economy', 'ekonomi sirkular'
    ],
    replyId: `**Dampak Lingkungan & Misi Ekonomi Sirkular CORA:**

Di Indonesia, ribuan ton ampas kelapa setiap harinya berakhir menumpuk di TPA, mengalami dekomposisi anaerobik yang menghasilkan **gas metana (CH₄)**—gas rumah kaca yang 28x lebih berbahaya dibanding CO₂.

🌱 **Dampak Terukur Tiap Kemasan CORA 100g:**
• ♻️ **150 Gram** ampas kelapa segar berhasil diselamatkan dari timbulan sampah organik TPA.
• 📉 **~0.42 kg CO₂e** jejak emisi karbon berhasil dicegah.
• 🤝 **Memberdayakan Ekonomi Lokal:** Meningkatkan taraf hidup pedagang kelapa pasar tradisional melalui model ekonomi sirkular inklusif (mendukung SDG 12: Konsumsi & Produksi Bertanggung Jawab).`,
    replyEn: `**Environmental Impact & Circular Economy Mission:**

Thousands of tons of coconut pulp are discarded daily into municipal landfills across Indonesia, emitting potent **methane gas (CH₄)**—a greenhouse gas 28x more destructive than CO₂.

🌱 **Measurable Impact per 100g Pouch of CORA:**
• ♻️ **150 Grams** of fresh coconut pulp residue diverted from landfills.
• 📉 **~0.42 kg CO₂e** in greenhouse emissions prevented.
• 🤝 **Inclusive Circular Livelihoods:** Generates supplementary revenue for traditional market families (advancing UN SDG 12: Responsible Consumption and Production).`
  },

  // 14. BAKING TEMPERATURE & TIME
  {
    id: 'baking_temperature',
    keywords: [
      'suhu', 'temperature', 'berapa derajat', 'panas oven', 'waktu panggang',
      'oven', 'api atas bawah', 'gosong', 'bake time', 'derajat celcius',
      'suhu manggang'
    ],
    replyId: `**Panduan Suhu & Waktu Panggang Optimal Tepung Kelapa:**

• 🔥 **Suhu Terbaik:** **165°C – 175°C (325°F – 350°F)**.
  *Perhatian:* Jangan menggunakan suhu terlalu tinggi (>180°C) karena kandungan gula alami pada kelapa sangat cepat mengalami karamelisasi dan mudah gosong di bagian tepi.
• ⏱️ **Estimasi Waktu:**
  - Cookies / Waffle / Pancake: 12 – 18 menit.
  - Muffin / Roti Kecil: 20 – 25 menit.
  - Loaf / Banana Bread: 35 – 45 menit.
• 💡 **Tips Pengujian:** Gunakan tusuk gigi di bagian tengah. Produk tepung kelapa terasa agak lunak saat baru keluar dari oven; biarkan dingin di atas rak kawat selama 15 menit agar strukturnya memadat sempurna.`,
    replyEn: `**Optimal Oven Temperatures & Baking Times for Coconut Flour:**

• 🔥 **Ideal Temperature:** **165°C – 175°C (325°F – 350°F)**.
  *Caution:* Avoid temperatures exceeding 180°C (356°F) because natural coconut sugars caramelize quickly, leading to browned or burnt edges.
• ⏱️ **Estimated Baking Times:**
  - Cookies / Waffles / Pancakes: 12 – 18 minutes.
  - Muffins & Small Buns: 20 – 25 minutes.
  - Loaves & Banana Breads: 35 – 45 minutes.
• 💡 **Cooling Tip:** Coconut flour bakes feel soft when first exiting the oven. Allow them to cool on a wire rack for 15 minutes to firm up properly.`
  },

  // 15. SAVORY DISHES & FRYING COATING
  {
    id: 'savory_and_frying',
    keywords: [
      'goreng', 'gorengan', 'baluran tepung', 'ayam crispy', 'breadcrumbs',
      'air fryer', 'savory', 'asin', 'tepung panir', 'baluran', 'coating',
      'nugget', 'ayam goreng'
    ],
    replyId: `**Penggunaan Tepung Kelapa untuk Gorengan & Baluran Crispy:**

Tentu bisa! Tepung kelapa CORA adalah alternatif istimewa untuk menggantikan tepung roti (*breadcrumbs*) atau tepung bumbu serbaguna:

🍗 **Tips Baluran Ayam / Ikan / Tahu Crispy:**
1. **Bumbui Tepung:** Campurkan tepung kelapa CORA dengan garam, bubuk bawang putih, lada hitam, dan paprika bubuk.
2. **Teknik Pelapisan:** Celupkan bahan ke dalam kocokan telur, lalu gulingkan ke tepung kelapa hingga merata.
3. **Metode Memasak Terbaik:** Gunakan **Air Fryer** pada suhu 175°C selama 12–15 menit, atau panggang di oven dengan sedikit semprotan minyak kelapa. Hasilnya luar biasa renyah keemasan tanpa menyerap minyak berlebih!`,
    replyEn: `**Using Coconut Flour for Crispy Coatings & Savory Dishes:**

Absolutely! CORA coconut flour makes an exceptional low-carb, grain-free alternative to traditional breadcrumbs:

🍗 **Crispy Chicken / Fish / Tofu Coating Technique:**
1. **Season the Flour:** Blend CORA coconut flour with garlic powder, paprika, sea salt, and black pepper.
2. **Dredging:** Dip protein cuts in beaten egg, then press firmly into the seasoned coconut flour.
3. **Cooking Method:** Cook in an **Air Fryer at 175°C (350°F)** for 12–15 minutes, or bake with a light misting of olive/coconut oil. It yields a gorgeous, crispy golden crust without excess grease!`
  },

  // 16. COCONUT VS ALMOND FLOUR
  {
    id: 'coconut_vs_almond',
    keywords: [
      'almond', 'tepung almond', 'beda almond', 'almond vs kelapa',
      'lebih bagus mana', 'perbandingan almond', 'substitusi almond'
    ],
    replyId: `**Perbandingan Tepung Kelapa CORA vs Tepung Almond:**

• 💧 **Daya Serap:** Tepung kelapa menyerap cairan 3–4x lebih banyak dibanding tepung almond. Keduanya tidak bisa disubstitusi 1:1.
• 🌿 **Kandungan Serat:** Tepung kelapa memiliki serat ~40g/100g, jauh mengungguli tepung almond yang hanya ~10g/100g.
• ⚡ **Kalori & Lemak:** Tepung almond sangat padat kalori dan lemak; tepung kelapa lebih hemat kalori dan lebih ramah bagi yang menjaga berat badan.
• 🏆 **Kombinasi Terbaik:** Mengombinasikan 1 bagian tepung kelapa CORA dengan 3 bagian tepung almond adalah rahasia para baker profesional untuk menghasilkan tekstur kue yang moist, empuk, dan kokoh!`,
    replyEn: `**CORA Coconut Flour vs Almond Flour Comparison:**

• 💧 **Moisture Absorption:** Coconut flour absorbs 3–4x more liquid than almond flour. They cannot be swapped 1:1.
• 🌿 **Fiber Density:** Coconut flour boasts ~40g fiber/100g, dramatically higher than almond flour's ~10g/100g.
• ⚡ **Calories & Lipids:** Almond flour is heavily calorie- and fat-dense; coconut flour provides lighter calories with superior satiety.
• 🏆 **Pro Tip:** Combining 1 part CORA coconut flour with 3 parts almond flour produces the ultimate tender, moist bakery texture!`
  },

  // 17. COCONUT FLOUR VS DESICCATED COCONUT
  {
    id: 'coconut_vs_desiccated',
    keywords: [
      'kelapa parut', 'desiccated coconut', 'ampas vs kelapa parut',
      'santan', 'serpihan kelapa', 'kelapa kering', 'parutan kelapa'
    ],
    replyId: `**Perbedaan Tepung Kelapa CORA vs Kelapa Parut Kering (Desiccated Coconut):**

1. **Kandungan Lemak:** Kelapa parut kering dibuat dari daging kelapa utuh dengan kadar minyak tinggi (~65% lemak). Sedangkan tepung kelapa CORA berasal dari ampas yang telah diekstraksi santannya, sehingga kadar lemaknya seimbang dan seratnya jauh lebih terkonsentrasi.
2. **Kehalusan Tekstur:** Kelapa parut bertekstur serpihan kasar yang tidak dapat menyatu dengan adonan. Tepung kelapa CORA digiling secara modern menjadi butiran bubuk halus (*superfine flour*) yang menyatu homogen dalam adonan kue.
3. **Fungsi Kuliner:** Kelapa parut hanya berfungsi sebagai taburan (*topping*), sedangkan tepung kelapa CORA berfungsi sebagai bahan dasar utama pengganti tepung.`,
    replyEn: `**CORA Coconut Flour vs Desiccated Coconut Shreds:**

1. **Fat Content:** Desiccated coconut is dried whole coconut meat with ~65% raw fat. CORA coconut flour is made from defatted coconut residue post-milk pressing, providing balanced lipids and vastly concentrated fiber.
2. **Particle Fineness:** Shredded coconut has coarse flakes that do not form batter structure. CORA coconut flour is milled into an ultra-fine powder that blends seamlessly into batters.
3. **Culinary Role:** Desiccated coconut is used as a garnish or topping, whereas CORA coconut flour serves as a true functional baking flour base.`
  },

  // 18. RECIPE IDEAS - PANCAKES
  {
    id: 'recipe_pancake',
    keywords: ['resep pancake', 'pancake kelapa', 'sarapan', 'cara buat pancake', 'pancake'],
    replyId: `🥞 **Resep Cepat: CORA Fluffy Coconut Pancakes (2 Porsi):**

**Bahan:**
• 35g CORA Pure Coconut Flour
• 2 butir telur ayam
• 60ml susu almond atau santan encer
• 1 sdm madu atau sirup maple
• 1/2 sdt baking powder & sejumput garam

**Cara Membuat:**
1. Kocok telur, susu, dan madu dalam mangkuk hingga berbusa halus.
2. Ayak tepung kelapa CORA dan baking powder ke dalam campuran basah. Aduk rata.
3. **Penting:** Diamkan adonan selama 3 menit agar serat kelapa mengembang.
4. Panaskan wajan anti-lengket dengan sedikit minyak kelapa pada api kecil.
5. Tuang 2 sdm adonan, masak hingga muncul gelembung kecil (2-3 menit), balik perlahan dan masak sisi sebaliknya 1-2 menit. Sajikan hangat!`,
    replyEn: `🥞 **Quick Recipe: CORA Fluffy Coconut Pancakes (2 Servings):**

**Ingredients:**
• 35g CORA Pure Coconut Flour
• 2 large eggs
• 60ml almond milk or light coconut milk
• 1 tbsp honey or pure maple syrup
• 1/2 tsp baking powder & pinch of sea salt

**Instructions:**
1. Whisk eggs, milk, and sweetener together until frothy.
2. Sift in CORA coconut flour and baking powder. Whisk until smooth.
3. **Crucial:** Let batter rest for 3 minutes to hydrate.
4. Heat a non-stick skillet over low heat with a drop of coconut oil.
5. Pour 2 tbsp batter per pancake. Cook 2-3 minutes until bubbles appear, flip gently, and cook 1-2 minutes until golden. Serve warm!`
  },

  // 19. RECIPE IDEAS - BANANA BREAD
  {
    id: 'recipe_banana_bread',
    keywords: ['banana bread', 'roti pisang', 'bolu pisang', 'kue pisang'],
    replyId: `🍌 **Resep Favorit: High-Fiber CORA Banana Loaf:**

**Bahan:**
• 60g CORA Pure Coconut Flour
• 3 buah pisang ambon sangat matang (lumatkan halus)
• 3 butir telur
• 3 sdm minyak kelapa (*coconut oil*)
• 1 sdt kayu manis bubuk & 1/2 sdt baking soda

**Langkah Singkat:**
1. Panaskan oven pada suhu 170°C dan alasi loyang dengan kertas roti.
2. Campur pisang lumat, telur, dan minyak kelapa hingga rata.
3. Masukkan tepung kelapa CORA, kayu manis, dan baking soda. Aduk hingga menyatu dan diamkan 5 menit.
4. Tuang ke loyang dan panggang selama 35–40 menit hingga tusuk gigi keluar bersih. Dinginkan sebelum dipotong!`,
    replyEn: `🍌 **Fan Favorite: High-Fiber CORA Banana Loaf:**

**Ingredients:**
• 60g CORA Pure Coconut Flour
• 3 ripe mashed bananas
• 3 large eggs
• 3 tbsp virgin coconut oil
• 1 tsp ground cinnamon & 1/2 tsp baking soda

**Quick Steps:**
1. Preheat oven to 170°C (340°F) and line a loaf pan with parchment.
2. Whisk mashed banana, eggs, and coconut oil thoroughly.
3. Fold in CORA coconut flour, cinnamon, and baking soda. Let rest 5 minutes.
4. Pour into pan and bake for 35–40 minutes until a tester comes out clean. Cool completely before slicing!`
  },

  // 20. HOW TO ORDER & SHIPPING
  {
    id: 'how_to_order_shipping',
    keywords: [
      'cara beli', 'order', 'pesan', 'checkout', 'ongkir', 'kirim',
      'shipping', 'bayar', 'payment', 'ekspedisi', 'kurir', 'beli'
    ],
    replyId: `🛒 **Panduan Membeli Produk CORA:**

1. Kunjungi halaman **Our Product** melalui menu navigasi atas.
2. Tentukan jumlah pack **CORA Pure Coconut Flour (100g)** yang diinginkan, lalu klik tombol **Add to Cart**.
3. Buka keranjang belanja di pojok kanan atas, lalu klik **Checkout**.
4. Isi data pengiriman Anda (nama, nomor WhatsApp, alamat lengkap).
5. Pada prototype ini, Anda dapat mencoba simulasi pembayaran instan via Transfer Virtual Bank (BCA, Mandiri, BRI) yang terverifikasi otomatis.
6. Lacak progres pengiriman pesanan Anda secara real-time di menu **Track Order**!`,
    replyEn: `🛒 **How to Place an Order on CORA:**

1. Navigate to the **Our Product** section.
2. Select your desired quantity of **CORA Pure Coconut Flour (100g)** and click **Add to Cart**.
3. Click the Cart icon at the top right, then proceed to **Checkout**.
4. Enter your shipping address and recipient details.
5. In this prototype, select instant bank transfer verification (BCA, Mandiri, BRI).
6. Track your package live anytime under the **Track Order** page!`
  },

  // 21. TEAM & FOUNDERS
  {
    id: 'team_and_origin',
    keywords: [
      'siapa pendiri', 'founder', 'tim cora', 'team', 'zilan', 'diandra',
      'asal mana', 'inovator', 'siapa yang buat', 'pencipta cora'
    ],
    replyId: `**Di Balik Inovasi CORA:**

CORA diinisiasi oleh tim inovator muda yang berdedikasi pada sains pangan sirkular:
• 🔬 **Zilan Dwi Cahya Rifai** (*Foodtech & R&D Specialist*): Memimpin riset formulasi higienis ampas kelapa, parameter pengeringan dehidrasi terkontrol, uji proksimat nutrisi, dan jaminan mutu pangan fungsional.
• 📈 **I Komang Diandra Jaya Kusuma** (*Financial Management & Business Development Specialist*): Memimpin permodelan ekonomi sirkular, kelayakan rantai pasok pedagang kelapa, dan strategi pertumbuhan bisnis berkelanjutan.

Kunjungi halaman **About Us** untuk membaca kisah perjalanan lengkap kami!`,
    replyEn: `**The Innovators Behind CORA:**

CORA is spearheaded by dedicated circular foodtech specialists:
• 🔬 **Zilan Dwi Cahya Rifai** (*Foodtech & R&D Specialist*): Directing hygienic drying parameters, proximate nutrition testing, and functional food formulation standards.
• 📈 **I Komang Diandra Jaya Kusuma** (*Financial Management & Business Development Specialist*): Orchestrating circular economic modeling, supplier partnership logistics, and sustainable venture growth.

Learn more on our **About Us** page!`
  },

  // 22. GRATITUDE & PRAISE
  {
    id: 'gratitude_praise',
    keywords: [
      'terima kasih', 'makasih', 'tq', 'thanks', 'thank you', 'mantap',
      'keren', 'hebat', 'bagus', 'pintar', 'membantu', 'top'
    ],
    replyId: `Sama-sama! Senang sekali bisa membantu Anda 🥥✨. 

Jika nanti Anda butuh ide resep baru, ingin mengecek takaran tepung kelapa CORA, atau ingin bertanya seputar penjemputan ampas kelapa, jangan ragu untuk menyapa saya lagi kapan saja. Selamat berkreasi sehat!`,
    replyEn: `You are very welcome! Delighted to assist your culinary journey 🥥✨.

Whenever you need fresh recipe inspiration, ratio checks, or circular pickup updates, feel free to drop by anytime. Happy wholesome baking!`
  },

  // 23. FAREWELL
  {
    id: 'farewell',
    keywords: ['dadah', 'bye', 'sampai jumpa', 'selamat tinggal', 'goodbye', 'see you'],
    replyId: `Sampai jumpa lagi! 👋 Terima kasih telah mendukung gerakan pangan sirkular bersama CORA. Semoga hari Anda menyenangkan dan penuh inspirasi kuliner sehat! 🥥`,
    replyEn: `Farewell for now! 👋 Thank you for championing circular food innovations with CORA. Wishing you wonderful days ahead filled with wholesome bakes! 🥥`
  }
];

/**
 * Checks if query is likely Indonesian
 */
function isIndonesianQuery(query: string): boolean {
  const idMarkers = [
    'apa', 'bagaimana', 'kenapa', 'mengapa', 'berapa', 'apakah', 'bisa', 'tolong',
    'halo', 'hai', 'selamat', 'pagi', 'siang', 'malam', 'saya', 'kamu', 'anda',
    'resep', 'tepung', 'kelapa', 'telur', 'kue', 'roti', 'takaran', 'rasio', 'terima', 'kasih'
  ];
  const words = query.toLowerCase().split(/\s+/);
  const matchCount = words.filter((w) => idMarkers.includes(w)).length;
  return matchCount >= 2;
}

/**
 * Clean & tokenize text for scoring
 */
function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 1);
}

/**
 * Generates an OpenAI-agent grade response based on user input
 */
export function generateCoraAiResponse(userQuery: string): string {
  const trimmed = userQuery.trim();
  if (!trimmed) {
    return 'Hello! How may I assist your baking or circular journey with CORA coconut flour today? 🥥';
  }

  const isIndo = isIndonesianQuery(trimmed);
  const queryTokens = tokenize(trimmed);
  const lowerQuery = trimmed.toLowerCase();

  // Match scoring
  let bestIntent: KnowledgeIntent | null = null;
  let maxScore = 0;

  for (const intent of KNOWLEDGE_INTENTS) {
    let score = 0;

    for (const kw of intent.keywords) {
      const kwLower = kw.toLowerCase();
      // Exact substring match
      if (lowerQuery.includes(kwLower)) {
        score += kwLower.split(' ').length * 3;
      } else {
        // Token overlap
        const kwTokens = kwLower.split(' ');
        const matches = kwTokens.filter((kt) => queryTokens.includes(kt)).length;
        if (matches === kwTokens.length) {
          score += matches * 2;
        } else if (matches > 0) {
          score += matches;
        }
      }
    }

    if (score > maxScore) {
      maxScore = score;
      bestIntent = intent;
    }
  }

  // Threshold check: If score is sufficient, return intent reply
  if (bestIntent && maxScore >= 2) {
    return isIndo ? bestIntent.replyId : bestIntent.replyEn;
  }

  // Guardrail fallback for random / unrecognized queries
  if (isIndo) {
    return `Pertanyaan yang menarik! Namun sebagai **CORA Culinary & Upcycle AI Assistant**, pengetahuan saya difokuskan khusus pada ekosistem pangan sirkular kelapa, panduan baking tepung kelapa CORA, tips rasio hidrasi resep, serta program penjemputan ampas kelapa di Bali 🥥.

Untuk menguji kemampuan prototype ini, silakan coba tanyakan topik-topik berikut:
1. 📏 *"Berapa rasio takaran tepung ampas kelapa dibanding tepung terigu?"*
2. 🥚 *"Mengapa harus pakai banyak telur dan cairan saat memanggang tepung kelapa?"*
3. 💡 *"Bagaimana tips agar kue tidak kering atau rapuh saat menggunakan tepung kelapa?"*
4. 🌿 *"Apa saja kandungan nutrisi, serat pangan, dan manfaat kesehatan CORA?"*
5. 🚛 *"Bagaimana alur penjemputan ampas kelapa bagi pedagang santan di Bali?"*
6. 📦 *"Berapa lama masa simpan (shelf life) dan bagaimana cara menyimpannya?"*
7. 🍗 *"Bisakah tepung kelapa dipakai untuk baluran gorengan crispy?"*

Ketik salah satu pertanyaan di atas atau klik salah satu tombol pertanyaan cepat di bawah untuk mencobanya!`;
  }

  return `Thank you for your question! As the **CORA Culinary & Upcycle AI Assistant**, my knowledge is specialized in circular coconut innovations, high-fiber baking with CORA coconut flour, hydration techniques, and our residue collection network in Bali 🥥.

To explore this prototype, here are some sample topics you can ask me:
1. 📏 *"What is the substitution ratio of coconut flour compared to wheat flour?"*
2. 🥚 *"Why do recipes require extra eggs and liquids when using coconut flour?"*
3. 💡 *"How can I prevent my coconut flour bakes from turning out dry or crumbly?"*
4. 🌿 *"What are the nutritional and fiber benefits of CORA upcycled flour?"*
5. 🚛 *"How can local coconut milk vendors partner with the Bali pickup program?"*
6. 📦 *"What is the shelf life and proper storage method for coconut flour?"*

Feel free to type any of the questions above or click the quick prompt buttons!`;
}
