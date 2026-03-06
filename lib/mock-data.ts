export interface Flashcard {
  id: number
  word: string
  meaning: string
  type: "verb" | "noun" | "adjective" | "adverb" | "preposition"
  example: string
}

export interface ReadingPassage {
  id: number
  title: string
  passage: string
  words: Record<string, string>
  questions: {
    id: number
    question: string
    options: string[]
    correctAnswer: number
  }[]
}

export interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
}

// ---------- FULL ACADEMIC WORD BANK (100+ words, YDS/YOKDiL level) ----------

const wordBank: Flashcard[] = [
  { id: 1, word: "Ubiquitous", meaning: "Her yerde bulunan, yaygın", type: "adjective", example: "Smartphones have become ubiquitous in modern society." },
  { id: 2, word: "Mitigate", meaning: "Hafifletmek, azaltmak", type: "verb", example: "The government took steps to mitigate the effects of the economic crisis." },
  { id: 3, word: "Paradigm", meaning: "Paradigma, model, ornek", type: "noun", example: "The discovery led to a paradigm shift in scientific thinking." },
  { id: 4, word: "Facilitate", meaning: "Kolaylastirmak, olanaklı kılmak", type: "verb", example: "Technology can facilitate communication between distant communities." },
  { id: 5, word: "Inherent", meaning: "Dogal, dogasında olan, asıl", type: "adjective", example: "There are inherent risks associated with any surgical procedure." },
  { id: 6, word: "Subsequent", meaning: "Sonraki, ardından gelen", type: "adjective", example: "The initial study and all subsequent research confirmed the hypothesis." },
  { id: 7, word: "Deteriorate", meaning: "Kotulesme, bozulmak", type: "verb", example: "Air quality continues to deteriorate in many urban areas." },
  { id: 8, word: "Notwithstanding", meaning: "Ragmen, -e karsın", type: "preposition", example: "Notwithstanding the challenges, the project was completed on time." },
  { id: 9, word: "Empirical", meaning: "Deneysel, gozleme dayalı", type: "adjective", example: "The theory must be supported by empirical evidence." },
  { id: 10, word: "Pervasive", meaning: "Yaygın, her yere yayılan", type: "adjective", example: "The pervasive influence of social media has transformed public discourse." },
  { id: 11, word: "Ambiguous", meaning: "Belirsiz, birden fazla anlama gelebilen", type: "adjective", example: "The contract contains several ambiguous clauses that need clarification." },
  { id: 12, word: "Benevolent", meaning: "Hayırsever, iyiliksever", type: "adjective", example: "The benevolent organization provided shelter for the homeless." },
  { id: 13, word: "Coalesce", meaning: "Birleşmek, kaynaşmak", type: "verb", example: "Various political groups coalesced to form a unified opposition." },
  { id: 14, word: "Delineate", meaning: "Tasvir etmek, sınırlarını belirlemek", type: "verb", example: "The report delineates the boundaries of the protected area." },
  { id: 15, word: "Ephemeral", meaning: "Kısa omurlu, gecici", type: "adjective", example: "The ephemeral beauty of cherry blossoms attracts millions of visitors." },
  { id: 16, word: "Exacerbate", meaning: "Kotulestirir, siddetlendirir", type: "verb", example: "The drought was exacerbated by poor water management policies." },
  { id: 17, word: "Gregarious", meaning: "Sosyal, toplu yasamayı seven", type: "adjective", example: "Dolphins are gregarious creatures that live in large groups." },
  { id: 18, word: "Hypothetical", meaning: "Varsayımsal, kuramsal", type: "adjective", example: "Let us consider a hypothetical scenario in which energy is unlimited." },
  { id: 19, word: "Impede", meaning: "Engellemek, aksatmak", type: "verb", example: "Bureaucratic regulations can impede economic growth." },
  { id: 20, word: "Juxtapose", meaning: "Yan yana koymak, kıyaslamak", type: "verb", example: "The exhibit juxtaposes ancient and modern art to highlight cultural evolution." },
  { id: 21, word: "Lucrative", meaning: "Kazancli, karli", type: "adjective", example: "The tech industry offers many lucrative career opportunities." },
  { id: 22, word: "Meticulous", meaning: "Titiz, ozenli", type: "adjective", example: "The researcher was meticulous in recording every observation." },
  { id: 23, word: "Negligible", meaning: "Onemsiz, ihmal edilebilir", type: "adjective", example: "The side effects of the medication are considered negligible." },
  { id: 24, word: "Ostensible", meaning: "Gorunurdeki, sozde", type: "adjective", example: "The ostensible reason for the meeting was to discuss budgets." },
  { id: 25, word: "Proliferate", meaning: "Cogalmak, hızla yayılmak", type: "verb", example: "Fake news tends to proliferate on social media platforms." },
  { id: 26, word: "Quintessential", meaning: "Ozunde olan, en tipik", type: "adjective", example: "She is the quintessential example of a dedicated scientist." },
  { id: 27, word: "Reconcile", meaning: "Uzlastirmak, bagdastirmak", type: "verb", example: "It is difficult to reconcile these two conflicting theories." },
  { id: 28, word: "Scrutinize", meaning: "Dikkatle incelemek", type: "verb", example: "The auditors will scrutinize every financial transaction." },
  { id: 29, word: "Tangible", meaning: "Somut, elle tutulur", type: "adjective", example: "The policy changes have produced tangible improvements in air quality." },
  { id: 30, word: "Undermine", meaning: "Baltalamak, zayflatmak", type: "verb", example: "Corruption can undermine public trust in institutions." },
  { id: 31, word: "Vindicate", meaning: "Hakli cikmak, aklamak", type: "verb", example: "The new evidence served to vindicate the defendant completely." },
  { id: 32, word: "Watershed", meaning: "Donun noktasi, milat", type: "noun", example: "The invention of the internet was a watershed moment in communication." },
  { id: 33, word: "Anomaly", meaning: "Anormallik, sapma", type: "noun", example: "Scientists detected an anomaly in the temperature data." },
  { id: 34, word: "Bolster", meaning: "Desteklemek, guclendirmek", type: "verb", example: "New investments will bolster the country's manufacturing sector." },
  { id: 35, word: "Cursory", meaning: "Yuzeysel, ustunikorulu", type: "adjective", example: "A cursory glance at the report revealed several errors." },
  { id: 36, word: "Disparity", meaning: "Esitsizlik, farklılık", type: "noun", example: "There is a growing disparity between urban and rural healthcare." },
  { id: 37, word: "Elucidate", meaning: "Acıklamak, aydınlatmak", type: "verb", example: "The professor tried to elucidate the complex theory for the students." },
  { id: 38, word: "Fortuitous", meaning: "Tesadufi, sansli", type: "adjective", example: "The fortuitous discovery of penicillin changed modern medicine." },
  { id: 39, word: "Gratuitous", meaning: "Gereksiz, karsilıksız", type: "adjective", example: "The film was criticized for its gratuitous violence." },
  { id: 40, word: "Harbinger", meaning: "Habercisi, mujdecisi", type: "noun", example: "The first flowers of spring are a harbinger of warmer weather." },
  { id: 41, word: "Immutable", meaning: "Degismez, sabit", type: "adjective", example: "The laws of physics are considered immutable across the universe." },
  { id: 42, word: "Jeopardize", meaning: "Tehlikeye atmak", type: "verb", example: "Reckless spending could jeopardize the company's financial stability." },
  { id: 43, word: "Kinetic", meaning: "Kinetik, hareketle ilgili", type: "adjective", example: "Kinetic energy increases proportionally with the mass of the object." },
  { id: 44, word: "Latent", meaning: "Gizli, saklı, belirgin olmayan", type: "adjective", example: "The disease may remain latent for years before symptoms appear." },
  { id: 45, word: "Malleable", meaning: "Sekil verilebilir, uysal", type: "adjective", example: "Gold is one of the most malleable metals known to mankind." },
  { id: 46, word: "Nuance", meaning: "Nüans, ince ayrıntı", type: "noun", example: "Understanding cultural nuances is essential for effective translation." },
  { id: 47, word: "Obscure", meaning: "Belirsiz, az bilinen", type: "adjective", example: "The reference was too obscure for most readers to understand." },
  { id: 48, word: "Pragmatic", meaning: "Pragmatik, uygulamaya dönük", type: "adjective", example: "The government adopted a pragmatic approach to economic reform." },
  { id: 49, word: "Redundant", meaning: "Gereksiz, fazla", type: "adjective", example: "Many factory workers became redundant after automation was introduced." },
  { id: 50, word: "Salient", meaning: "Gozde carpan, belirgin", type: "adjective", example: "The report highlights the salient features of the new policy." },
  { id: 51, word: "Tenuous", meaning: "Zayıf, dayanıksız", type: "adjective", example: "The connection between the two events is tenuous at best." },
  { id: 52, word: "Unprecedented", meaning: "Emsal gorulmemis, benzersiz", type: "adjective", example: "The pandemic caused an unprecedented disruption to global trade." },
  { id: 53, word: "Volatile", meaning: "Degisken, istikrarsız", type: "adjective", example: "Stock markets have been increasingly volatile in recent months." },
  { id: 54, word: "Wane", meaning: "Azalmak, zayıflamak", type: "verb", example: "Public interest in the project began to wane after the initial excitement." },
  { id: 55, word: "Allocate", meaning: "Tahsis etmek, dagıtmak", type: "verb", example: "The committee decided to allocate more funds to education." },
  { id: 56, word: "Burgeon", meaning: "Hızla buyumek, filizlenmek", type: "verb", example: "The startup scene in the city has begun to burgeon." },
  { id: 57, word: "Concomitant", meaning: "Eslık eden, birlikte olan", type: "adjective", example: "Economic growth brought concomitant improvements in living standards." },
  { id: 58, word: "Dichotomy", meaning: "Ikilem, ikiye bolunme", type: "noun", example: "There is a false dichotomy between economic growth and environmental protection." },
  { id: 59, word: "Efficacy", meaning: "Etkinlik, etkililik", type: "noun", example: "The efficacy of the vaccine was demonstrated in clinical trials." },
  { id: 60, word: "Fluctuate", meaning: "Dalgalanmak, inip cikmak", type: "verb", example: "Oil prices tend to fluctuate based on geopolitical events." },
  { id: 61, word: "Galvanize", meaning: "Harekete gecirmek, tesvik etmek", type: "verb", example: "The speech galvanized the community into taking collective action." },
  { id: 62, word: "Hegemony", meaning: "Hegemonya, ustunluk", type: "noun", example: "The empire maintained its hegemony over the region for centuries." },
  { id: 63, word: "Inundate", meaning: "Su basmak, dagıtmak (istekle)", type: "verb", example: "The company was inundated with applications after the job posting." },
  { id: 64, word: "Juxtaposition", meaning: "Yan yana koyma, karsılastırma", type: "noun", example: "The juxtaposition of old and new architecture created a striking effect." },
  { id: 65, word: "Kinship", meaning: "Akrabalık, yakınlık", type: "noun", example: "She felt a deep kinship with the indigenous communities she studied." },
  { id: 66, word: "Languish", meaning: "Erimek, zayıflamak, kuvvetten dusmek", type: "verb", example: "Many talented athletes languish in obscurity due to lack of funding." },
  { id: 67, word: "Magnanimous", meaning: "Alicenap, yuce gonullu", type: "adjective", example: "The magnanimous leader pardoned his political opponents." },
  { id: 68, word: "Nascent", meaning: "Yeni olusan, doğmakta olan", type: "adjective", example: "The nascent democracy faced many challenges in its first decade." },
  { id: 69, word: "Obfuscate", meaning: "Karıstırmak, anlasilmaz hale getirmek", type: "verb", example: "Complex legal language can obfuscate the true meaning of a contract." },
  { id: 70, word: "Pertinent", meaning: "Ilgili, konuyla alakali", type: "adjective", example: "The witness provided pertinent information about the incident." },
  { id: 71, word: "Recalcitrant", meaning: "Inatcı, dik basli", type: "adjective", example: "The recalcitrant student refused to follow the classroom rules." },
  { id: 72, word: "Supplant", meaning: "Yerini almak, yerine gecmek", type: "verb", example: "Digital media has supplanted traditional print journalism." },
  { id: 73, word: "Transient", meaning: "Gecici, kısa sureli", type: "adjective", example: "The effects of the medication are transient and wear off quickly." },
  { id: 74, word: "Utilitarian", meaning: "Faydaci, islevsel", type: "adjective", example: "The building's utilitarian design prioritized function over form." },
  { id: 75, word: "Venerate", meaning: "Saygı gostermek, yuceltmek", type: "verb", example: "Many cultures venerate their ancestors through special ceremonies." },
  { id: 76, word: "Warrant", meaning: "Haklı kılmak, gerektirmek", type: "verb", example: "The severity of the crisis warrants immediate government intervention." },
  { id: 77, word: "Advocate", meaning: "Savunmak, desteklemek", type: "verb", example: "Environmental groups advocate for stricter pollution controls." },
  { id: 78, word: "Benign", meaning: "Zararsız, iyi huylu", type: "adjective", example: "The tumor was determined to be benign after thorough testing." },
  { id: 79, word: "Circumscribe", meaning: "Sınırlamak, cevresini cizmek", type: "verb", example: "Cultural norms often circumscribe individual behavior in traditional societies." },
  { id: 80, word: "Debilitate", meaning: "Zayıflatmak, gucten dusurmek", type: "verb", example: "The prolonged illness debilitated the patient significantly." },
  { id: 81, word: "Enumerate", meaning: "Tek tek saymak, listelemek", type: "verb", example: "The report enumerates the key challenges facing the healthcare system." },
  { id: 82, word: "Feasible", meaning: "Uygulanabilir, mumkun", type: "adjective", example: "The committee concluded that the project was technically feasible." },
  { id: 83, word: "Germane", meaning: "Ilgili, konuya uygun", type: "adjective", example: "Please keep your comments germane to the topic at hand." },
  { id: 84, word: "Heterogeneous", meaning: "Heterojen, farklı unsurlardan olusan", type: "adjective", example: "The population of the city is culturally heterogeneous." },
  { id: 85, word: "Incessant", meaning: "Aralıksız, surekli", type: "adjective", example: "The incessant noise from the construction site disturbed the residents." },
  { id: 86, word: "Jurisprudence", meaning: "Hukuk bilimi", type: "noun", example: "The case is considered a landmark in constitutional jurisprudence." },
  { id: 87, word: "Kudos", meaning: "Ovgu, takdir", type: "noun", example: "The researcher received kudos from the scientific community for her work." },
  { id: 88, word: "Lethargic", meaning: "Uyusuk, halsiz", type: "adjective", example: "The patient became lethargic after taking the medication." },
  { id: 89, word: "Mundane", meaning: "Siradan, gunluk", type: "adjective", example: "She wanted to escape the mundane routine of her daily life." },
  { id: 90, word: "Negate", meaning: "Gecersiz kılmak, inkar etmek", type: "verb", example: "The new findings negate the conclusions of the previous study." },
  { id: 91, word: "Opaque", meaning: "Opak, anlasilmaz", type: "adjective", example: "The company's opaque financial practices raised concerns among investors." },
  { id: 92, word: "Preclude", meaning: "Onlemek, engellemek", type: "verb", example: "His injuries precluded him from participating in the competition." },
  { id: 93, word: "Reticent", meaning: "Ketum, az konusan", type: "adjective", example: "The witness was reticent about revealing details of the incident." },
  { id: 94, word: "Succinct", meaning: "Kısa ve oz, ozlu", type: "adjective", example: "The professor gave a succinct summary of the entire chapter." },
  { id: 95, word: "Truncate", meaning: "Kısaltmak, budamak", type: "verb", example: "The editor decided to truncate the article to fit the available space." },
  { id: 96, word: "Unilateral", meaning: "Tek tarafli", type: "adjective", example: "The country's unilateral withdrawal from the treaty surprised its allies." },
  { id: 97, word: "Vacillate", meaning: "Tereddut etmek, kararsız kalmak", type: "verb", example: "The committee continued to vacillate on the funding decision." },
  { id: 98, word: "Xenophobia", meaning: "Yabancı dusmanligı", type: "noun", example: "Xenophobia can lead to discrimination against immigrant communities." },
  { id: 99, word: "Yield", meaning: "Vermek, teslim olmak, ürün vermek", type: "verb", example: "The experiment is expected to yield significant results." },
  { id: 100, word: "Zealous", meaning: "Gayretli, hevesli", type: "adjective", example: "The zealous advocate fought tirelessly for human rights." },
]

// ---------- STAGE-BASED AI WORD GENERATION ----------

const STAGE_SIZE = 10

let usedWordIds: Set<number> = new Set()
let totalAiGenerated = 0

/** Simulated AI: fetches 10 never-before-seen words from the bank.
 *  When the entire bank has been exhausted it resets and reshuffles. */
export function fetchNewStageWords(count: number = STAGE_SIZE): { words: Flashcard[]; isPoolReset: boolean } {
  const available = wordBank.filter((w) => !usedWordIds.has(w.id))

  let isPoolReset = false

  // If fewer than the requested count of words remain, reset the pool
  if (available.length < count) {
    usedWordIds = new Set()
    isPoolReset = true
    return fetchNewStageWords(count) // recurse once with a fresh pool
  }

  // Shuffle available words and pick the first STAGE_SIZE
  const shuffled = [...available]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }

  const selected = shuffled.slice(0, count)
  selected.forEach((w) => usedWordIds.add(w.id))
  totalAiGenerated += selected.length

  return { words: selected, isPoolReset }
}

/** Reset entire word pool (admin action). */
export function resetWordPool(): number {
  usedWordIds = new Set()
  totalAiGenerated = 0
  return wordBank.length
}

/** Get total AI-generated word count. */
export function getTotalAiGenerated(): number {
  return totalAiGenerated
}

/** Get total unique words in the pool. */
export function getWordBankSize(): number {
  return wordBank.length
}

// For backward compat / initial load
export const flashcards: Flashcard[] = wordBank.slice(0, STAGE_SIZE)

export const readingPassages: ReadingPassage[] = [
  {
    id: 1,
    title: "The Impact of Urbanization on Biodiversity",
    passage:
      "Urbanization is one of the most significant drivers of environmental change in the contemporary world. As cities expand, natural habitats are increasingly fragmented, leading to a precipitous decline in biodiversity. The conversion of forests, wetlands, and grasslands into urban areas disrupts ecosystems and displaces countless species. Moreover, the proliferation of impervious surfaces such as roads and buildings alters hydrological patterns, exacerbating flood risks and diminishing water quality.\n\nResearchers have noted that urban environments create unique ecological niches that favor certain adaptable species while marginalizing others. Generalist species, such as pigeons and rats, thrive in urban settings, whereas specialist species that require specific habitats face severe threats. This phenomenon, known as biotic homogenization, results in reduced genetic diversity and weakened ecosystem resilience.\n\nNevertheless, recent studies have highlighted the potential for urban areas to contribute positively to biodiversity conservation. Green infrastructure initiatives, including urban parks, green roofs, and wildlife corridors, can provide critical refugia for native species. Furthermore, community-based conservation programs have demonstrated that active citizen participation can significantly enhance urban biodiversity outcomes.",
    words: {
      contemporary: "Cagdas, gunumuzde olan",
      fragmented: "Parcalara ayrilmis",
      precipitous: "Ani, sarp, dik",
      biodiversity: "Biyocesitlilik",
      proliferation: "Yayılma, cogalma",
      impervious: "Gecirmez, etkilenmeyen",
      hydrological: "Hidrolojik, su bilimsel",
      exacerbating: "Kotulestirir, siddetlendirir",
      ecological: "Ekolojik, cevrebilimsel",
      marginalized: "Marjinallestirilmis, dıslanmıs",
      homogenization: "Turdeslesme, homojenlesme",
      resilience: "Dayanıklılık, toparlanma gucu",
      refugia: "Sıgınak, barınak",
    },
    questions: [
      {
        id: 1,
        question:
          "According to the passage, what is the primary consequence of urbanization on natural habitats?",
        options: [
          "Habitats become more diverse and interconnected",
          "Natural habitats are increasingly fragmented",
          "Wildlife populations grow as cities expand",
          "Ecosystems become more resilient to change",
        ],
        correctAnswer: 1,
      },
      {
        id: 2,
        question: "What does the term 'biotic homogenization' refer to in the context of this passage?",
        options: [
          "The increase in species diversity in urban areas",
          "The process of creating uniform urban landscapes",
          "The dominance of generalist species and decline of specialists",
          "The restoration of natural habitats in cities",
        ],
        correctAnswer: 2,
      },
      {
        id: 3,
        question:
          "Which of the following is suggested as a potential solution to urban biodiversity loss?",
        options: [
          "Expanding cities to create more ecological niches",
          "Eliminating all impervious surfaces from urban areas",
          "Implementing green infrastructure initiatives",
          "Relocating all wildlife to rural areas",
        ],
        correctAnswer: 2,
      },
    ],
  },
  {
    id: 2,
    title: "Cognitive Biases in Decision Making",
    passage:
      "The field of behavioral economics has demonstrated that human decision-making is frequently influenced by cognitive biases that deviate from rational choice theory. These systematic errors in thinking affect how individuals perceive information, assess risks, and make judgments. One of the most well-documented biases is the anchoring effect, whereby initial exposure to a number or value disproportionately influences subsequent estimates.\n\nConfirmation bias represents another prevalent cognitive distortion that profoundly shapes human reasoning. Individuals tend to seek out, interpret, and remember information that confirms their pre-existing beliefs while disregarding contradictory evidence. This tendency is particularly consequential in academic research, where it can lead to flawed experimental designs and biased interpretation of results.\n\nThe availability heuristic further illustrates how cognitive shortcuts can lead to systematic errors in judgment. People tend to overestimate the probability of events that are easily recalled, often because they are vivid, recent, or emotionally charged. This bias has significant implications for public policy, as it can distort risk perception and lead to disproportionate allocation of resources to highly publicized but statistically rare threats.",
    words: {
      cognitive: "Bilissel, kavramsal",
      biases: "Onyargılar, egilimler",
      deviate: "Sapmak, ayrılmak",
      systematic: "Sistematik, duzeli",
      anchoring: "Demirleme, sabitlenme",
      disproportionately: "Orantısız bicimde",
      prevalent: "Yaygın, hakim",
      distortion: "Bozulma, carpıtma",
      disregarding: "Goz ardı etmek",
      consequential: "Onemli, sonucu olan",
      heuristic: "Sezgisel, deneyime dayalı",
      implications: "Sonuclar, etkileri",
      allocation: "Tahsis, dagıtım",
    },
    questions: [
      {
        id: 1,
        question: "What does the anchoring effect refer to?",
        options: [
          "The tendency to rely heavily on the first piece of information encountered",
          "The process of securing cognitive resources for complex tasks",
          "A bias toward remembering emotionally charged events",
          "The systematic avoidance of numerical data in judgments",
        ],
        correctAnswer: 0,
      },
      {
        id: 2,
        question: "How does confirmation bias affect academic research according to the passage?",
        options: [
          "It improves the accuracy of experimental results",
          "It encourages researchers to seek diverse perspectives",
          "It can lead to flawed designs and biased interpretation",
          "It has no significant impact on research outcomes",
        ],
        correctAnswer: 2,
      },
      {
        id: 3,
        question: "Why is the availability heuristic problematic for public policy?",
        options: [
          "It prevents policymakers from accessing relevant data",
          "It causes overestimation of easily recalled events, distorting risk perception",
          "It leads to excessive reliance on statistical analysis",
          "It encourages rational allocation of government resources",
        ],
        correctAnswer: 1,
      },
    ],
  },
]

export const tutorResponses: Record<string, string> = {
  default:
    "Merhaba! I'm your AI English tutor for YDS/YOKDiL preparation. You can ask me about grammar, vocabulary, reading strategies, or any exam-related questions. How can I help you today?",
  grammar:
    "Great question about grammar! In YDS/YOKDiL, grammar questions typically focus on tense usage, conditionals, relative clauses, and passive constructions. For example, the distinction between 'would have done' (past unreal conditional) and 'should have done' (past obligation) is frequently tested. Would you like me to explain a specific grammar topic in detail?",
  vocabulary:
    "For YDS/YOKDiL vocabulary, focus on academic and formal register words. Key strategies include:\n\n1. Learn word families (e.g., 'mitigate' - 'mitigation' - 'mitigating')\n2. Study collocations (e.g., 'reach a consensus', 'draw a conclusion')\n3. Practice contextual guessing from passages\n4. Review Latin and Greek roots for scientific terms\n\nWould you like me to create a vocabulary exercise for you?",
  reading:
    "Reading comprehension is the core of YDS/YOKDiL. Here are key strategies:\n\n1. **Skimming first**: Read the passage quickly to get the main idea before looking at questions.\n2. **Key words**: Identify topic sentences in each paragraph.\n3. **Inference questions**: Look for implied meanings, not just stated facts.\n4. **Transition words**: Pay attention to 'however', 'nevertheless', 'moreover' - they signal argument structure.\n\nShall I walk you through a practice passage?",
  tips:
    "Here are my top YDS/YOKDiL exam tips:\n\n1. **Time management**: Allocate roughly 2-3 minutes per question.\n2. **Elimination**: Cross out obviously wrong answers first.\n3. **Don't overthink**: Your first instinct is often correct.\n4. **Academic vocabulary**: This makes up 60% of the exam difficulty.\n5. **Practice daily**: Even 20 minutes of focused study helps.\n\nWhich area would you like to focus on today?",
}

export function getAIResponse(message: string): string {
  const lowerMessage = message.toLowerCase()

  if (lowerMessage.includes("grammar") || lowerMessage.includes("tense") || lowerMessage.includes("conditional")) {
    return tutorResponses.grammar
  }
  if (lowerMessage.includes("vocabulary") || lowerMessage.includes("word") || lowerMessage.includes("kelime")) {
    return tutorResponses.vocabulary
  }
  if (lowerMessage.includes("reading") || lowerMessage.includes("passage") || lowerMessage.includes("comprehension")) {
    return tutorResponses.reading
  }
  if (lowerMessage.includes("tip") || lowerMessage.includes("strategy") || lowerMessage.includes("advice") || lowerMessage.includes("ipucu")) {
    return tutorResponses.tips
  }

  return "That's a great question! In the context of YDS/YOKDiL preparation, understanding academic English is essential. The exam tests your ability to comprehend complex passages and use formal vocabulary accurately. Could you tell me more specifically what you'd like to work on? I can help with grammar rules, vocabulary building, reading strategies, or exam tips."
}

// ---------- USER TRACKING SYSTEM ----------

export interface AppUser {
  id: string
  name: string
  email: string
  role: "admin" | "user"
  joinedAt: string
  lastActiveAt: string
  stats: {
    wordsLearned: number
    wordsStudied: number
    stagesCompleted: number
    readingPassagesRead: number
    questionsAnswered: number
    questionsCorrect: number
    tutorMessages: number
    totalStudyMinutes: number
    streak: number
    accuracy: number
  }
  isActive: boolean
  isBanned: boolean
}

// Simulated user database
const usersDB: Map<string, AppUser> = new Map()

// Seed with some demo users
const seedUsers: AppUser[] = [
  {
    id: "u1",
    name: "Ayse Yilmaz",
    email: "ayse.yilmaz@gmail.com",
    role: "user",
    joinedAt: "2025-12-15T10:00:00Z",
    lastActiveAt: "2026-03-04T09:15:00Z",
    stats: { wordsLearned: 87, wordsStudied: 240, stagesCompleted: 24, readingPassagesRead: 12, questionsAnswered: 48, questionsCorrect: 36, tutorMessages: 31, totalStudyMinutes: 680, streak: 14, accuracy: 75 },
    isActive: true,
    isBanned: false,
  },
  {
    id: "u2",
    name: "Emre Kaya",
    email: "emre.kaya@outlook.com",
    role: "user",
    joinedAt: "2026-01-08T14:30:00Z",
    lastActiveAt: "2026-03-03T22:45:00Z",
    stats: { wordsLearned: 52, wordsStudied: 150, stagesCompleted: 15, readingPassagesRead: 8, questionsAnswered: 32, questionsCorrect: 22, tutorMessages: 18, totalStudyMinutes: 420, streak: 5, accuracy: 69 },
    isActive: true,
    isBanned: false,
  },
  {
    id: "u3",
    name: "Zeynep Demir",
    email: "zeynep.d@gmail.com",
    role: "user",
    joinedAt: "2026-01-20T08:00:00Z",
    lastActiveAt: "2026-03-04T11:20:00Z",
    stats: { wordsLearned: 120, wordsStudied: 380, stagesCompleted: 38, readingPassagesRead: 20, questionsAnswered: 80, questionsCorrect: 68, tutorMessages: 45, totalStudyMinutes: 1100, streak: 21, accuracy: 85 },
    isActive: true,
    isBanned: false,
  },
  {
    id: "u4",
    name: "Burak Celik",
    email: "burak.celik@hotmail.com",
    role: "user",
    joinedAt: "2026-02-01T16:45:00Z",
    lastActiveAt: "2026-02-28T19:30:00Z",
    stats: { wordsLearned: 30, wordsStudied: 90, stagesCompleted: 9, readingPassagesRead: 4, questionsAnswered: 16, questionsCorrect: 10, tutorMessages: 8, totalStudyMinutes: 210, streak: 0, accuracy: 63 },
    isActive: false,
    isBanned: false,
  },
  {
    id: "u5",
    name: "Selin Ozturk",
    email: "selin.ozturk@yahoo.com",
    role: "user",
    joinedAt: "2026-02-10T11:15:00Z",
    lastActiveAt: "2026-03-04T08:00:00Z",
    stats: { wordsLearned: 65, wordsStudied: 200, stagesCompleted: 20, readingPassagesRead: 10, questionsAnswered: 40, questionsCorrect: 30, tutorMessages: 22, totalStudyMinutes: 550, streak: 9, accuracy: 75 },
    isActive: true,
    isBanned: false,
  },
  {
    id: "u6",
    name: "Can Yildiz",
    email: "can.yildiz@gmail.com",
    role: "user",
    joinedAt: "2026-02-18T09:00:00Z",
    lastActiveAt: "2026-03-02T14:10:00Z",
    stats: { wordsLearned: 42, wordsStudied: 130, stagesCompleted: 13, readingPassagesRead: 6, questionsAnswered: 24, questionsCorrect: 15, tutorMessages: 12, totalStudyMinutes: 310, streak: 3, accuracy: 63 },
    isActive: true,
    isBanned: false,
  },
  {
    id: "u7",
    name: "Elif Arslan",
    email: "elif.arslan@icloud.com",
    role: "user",
    joinedAt: "2026-01-05T07:30:00Z",
    lastActiveAt: "2026-03-04T10:45:00Z",
    stats: { wordsLearned: 95, wordsStudied: 310, stagesCompleted: 31, readingPassagesRead: 15, questionsAnswered: 60, questionsCorrect: 51, tutorMessages: 38, totalStudyMinutes: 900, streak: 18, accuracy: 85 },
    isActive: true,
    isBanned: false,
  },
]

// Initialize seed users
seedUsers.forEach((u) => usersDB.set(u.email, u))

/** Register or return existing user. */
export function registerUser(name: string, email: string): AppUser {
  const existing = usersDB.get(email.toLowerCase())
  if (existing) {
    existing.lastActiveAt = new Date().toISOString()
    existing.isActive = true
    return existing
  }

  const newUser: AppUser = {
    id: `u${Date.now()}`,
    name,
    email: email.toLowerCase(),
    role: "user",
    joinedAt: new Date().toISOString(),
    lastActiveAt: new Date().toISOString(),
    stats: {
      wordsLearned: 0,
      wordsStudied: 0,
      stagesCompleted: 0,
      readingPassagesRead: 0,
      questionsAnswered: 0,
      questionsCorrect: 0,
      tutorMessages: 0,
      totalStudyMinutes: 0,
      streak: 0,
      accuracy: 0,
    },
    isActive: true,
    isBanned: false,
  }
  usersDB.set(email.toLowerCase(), newUser)
  return newUser
}

/** Get all users (admin). */
export function getAllUsers(): AppUser[] {
  return Array.from(usersDB.values()).sort(
    (a, b) => new Date(b.lastActiveAt).getTime() - new Date(a.lastActiveAt).getTime()
  )
}

/** Get a single user by email. */
export function getUserByEmail(email: string): AppUser | undefined {
  return usersDB.get(email.toLowerCase())
}

/** Toggle user ban status (admin). */
export function toggleUserBan(email: string): boolean {
  const user = usersDB.get(email.toLowerCase())
  if (user) {
    user.isBanned = !user.isBanned
    return user.isBanned
  }
  return false
}

/** Reset a user's stats (admin). */
export function resetUserStats(email: string): void {
  const user = usersDB.get(email.toLowerCase())
  if (user) {
    user.stats = {
      wordsLearned: 0,
      wordsStudied: 0,
      stagesCompleted: 0,
      readingPassagesRead: 0,
      questionsAnswered: 0,
      questionsCorrect: 0,
      tutorMessages: 0,
      totalStudyMinutes: 0,
      streak: 0,
      accuracy: 0,
    }
  }
}

/** Get aggregate stats across all users. */
export function getAggregateStats() {
  const users = getAllUsers()
  const activeUsers = users.filter((u) => u.isActive && !u.isBanned)
  const totalWords = users.reduce((sum, u) => sum + u.stats.wordsLearned, 0)
  const totalStudyMin = users.reduce((sum, u) => sum + u.stats.totalStudyMinutes, 0)
  const avgAccuracy = users.length > 0
    ? Math.round(users.reduce((sum, u) => sum + u.stats.accuracy, 0) / users.length)
    : 0

  return {
    totalUsers: users.length,
    activeUsers: activeUsers.length,
    bannedUsers: users.filter((u) => u.isBanned).length,
    totalWordsLearned: totalWords,
    totalStudyMinutes: totalStudyMin,
    avgAccuracy,
  }
}
