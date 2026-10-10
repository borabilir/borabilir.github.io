import { Language } from "./content";

export const JOURNAL_PATH = "/hollowgalegames/journal";
type Translation = { en: string; tr: string };
type Section = { title: Translation; body: Translation; image: string; caption: Translation };
export type JournalPost = {
  slug: string; date: string; category: Translation; title: Translation; description: Translation;
  image: string; intro: Translation; quote: Translation; sections: Section[];
};
const t = (en: string, tr: string): Translation => ({ en, tr });

export const journalCopy = {
  en: {
    label: "HOLLOWGALE NOTES", title: "Development\njournal", lead: "Short glimpses, ideas and processes from the worlds we are building.",
    latest: "01 / THE LATEST NOTE", featured: "FEATURED STORY", recent: "Recent notes", read: "Read the story", continue: "Continue reading",
    minutes: "min read", back: "Back to the journal", next: "The next note", author: "Hollowgale team", authorRole: "Art & world design",
    closing: "There is more to discover.", closingLead: "Step inside the world behind these notes.", discover: "Explore Mansion of Fates",
    notFound: "This note hasn't been written yet.", notFoundLead: "Find the latest stories in our development journal.",
    palette: "Material palette", paletteNames: ["Moon blue", "Midnight slate", "Antique brass"],
    detailsTitle: "Details that shape the silhouette", detailsBody: "A house reveals its character in small details. A crescent at the top of a tower, a glass conservatory and a glowing central window give the facade its rhythm. Each is a landmark: something to recognise from a distance and wonder about up close.",
    details: ["The tower", "The conservatory", "The central window"], finalTitle: "The final decision",
    finalBody: "The mansion should feel like a character before anyone steps through its doors. Cool blue wood, a warm heart of light and a few red leaves make a world that feels inviting, strange and quietly alive. The rooms, garden and stories belong to the same place.",
  },
  tr: {
    label: "HOLLOWGALE NOTLARI", title: "Geliştirme\ngünlüğü", lead: "Oyunlarımızın dünyasından kısa bakışlar, fikirler ve süreçler.",
    latest: "01 / SON YAZI", featured: "ÖNE ÇIKAN YAZI", recent: "Son notlar", read: "Yazıyı oku", continue: "Devamını oku",
    minutes: "dk okuma", back: "Günlüğe dön", next: "Sıradaki not", author: "Hollowgale ekibi", authorRole: "Sanat ve dünya tasarımı",
    closing: "Keşfedilecek daha çok hikâye var.", closingLead: "Bu notların ardındaki dünyaya adım at.", discover: "Mansion of Fates'i keşfet",
    notFound: "Bu not henüz yazılmadı.", notFoundLead: "Son hikâyelerimizi geliştirme günlüğünde bulabilirsin.",
    palette: "Malzeme paleti", paletteNames: ["Ay mavisi", "Gece laciverti", "Eski pirinç"],
    detailsTitle: "Silueti anlatan ayrıntılar", detailsBody: "Konağın karakteri, küçük ama anlamlı ayrıntılarda gizli. Kulenin ucundaki hilal, cam kış bahçesi ve ışıldayan merkez pencere cepheye ritmini veriyor. Her biri, uzaktan tanınabilen ve yakından merak uyandıran bir işaret.",
    details: ["Kule", "Kış bahçesi", "Merkez pencere"], finalTitle: "Son karar",
    finalBody: "Konak, kapısından içeri adım atılmadan önce bir karakter gibi hissettirmeli. Soğuk mavi ahşap, sıcak bir ışık merkezi ve birkaç kırmızı yaprak; davetkâr, tuhaf ve usulca yaşayan bir dünya kuruyor. Odalar, bahçe ve hikâyeler aynı yere ait.",
  },
};

// Editorial copy follows the supplied page references; dates match those examples.
export const journalPosts: JournalPost[] = [
  {
    slug: "mansion-exterior", date: "2026-10-04", category: t("Art direction", "Sanat tasarımı"),
    title: t("How did the mansion find its face?", "Konağın dış cephesi nasıl şekillendi?"),
    description: t("A visual journey through moon-blue wood, glowing windows and crimson leaves.", "Mansion of Fates'in mavi ahşap cephesinden kırmızı yapraklarına uzanan görsel yolculuk."),
    image: "journal-exterior-v1.png",
    intro: t("A beautiful Gothic house is only a beginning. To carry the atmosphere of Mansion of Fates, its architecture needs a character of its own. The silhouette, materials and light should suggest a story before the player opens the first door.", "Güzel bir gotik yapı yalnızca bir başlangıç. Mansion of Fates'in atmosferini taşıyabilmesi için mimarinin de kendine ait bir karakteri olmalı. Siluet, malzemeler ve ışık, oyuncu ilk kapıyı açmadan bir hikâye hissettirmeli."),
    quote: t("Before the mansion feels frightening, it should feel as though it has a story of its own.", "Konak korkutucu görünmekten önce, kendine ait bir hikâyesi varmış gibi hissettirmeli."),
    sections: [
      {
        title: t("A beautiful house needs a personality", "Güzel bir yapının ötesinde"),
        body: t("Pointed roofs, tall windows and stone steps establish a familiar Gothic language. Familiarity helps us read a place, but it can also make one mansion blend into another. The important question is what makes this particular house feel inhabited. Uneven roof heights, a rounded conservatory and a bright window at the centre break up the facade into smaller, recognisable parts. The building can feel grand without becoming a perfectly symmetrical monument.", "Sivri çatılar, uzun pencereler ve taş basamaklar, tanıdık bir gotik dil kuruyor. Bu tanıdıklık mekânı okumayı kolaylaştırıyor; ama bir konağı diğerlerinden ayırmayı da zorlaştırabiliyor. Asıl soru, bu eve yaşanmışlık hissini neyin verdiği. Farklı çatı yükseklikleri, yuvarlak kış bahçesi ve merkezdeki aydınlık pencere cepheyi daha küçük, tanınabilir parçalara ayırıyor. Böylece yapı, kusursuz simetrili bir anıta dönüşmeden görkemli durabiliyor."),
        image: "mansion-hero.png", caption: t("The facade, framed by the garden and night sky.", "Bahçe ve gece göğüyle çevrelenen konak cephesi."),
      },
      {
        title: t("From stone to moon-blue wood", "Taştan ay mavisi ahşaba"),
        body: t("Stone gives a house weight. Blue wooden cladding brings it closer to a storybook: warmer in character, even beneath cold moonlight. Narrow horizontal boards let the eye follow the shape of the walls. Slate roofs keep the upper silhouette dark, while old brass and amber light pick out the edges of doors and windows. The materials do different jobs, but they share the same restrained palette. Brush marks and slightly irregular contours keep the architecture handmade rather than mechanically perfect.", "Taş, yapıya ağırlık veriyor. Mavi ahşap kaplama ise konağı bir masal kitabına yaklaştırıyor: soğuk ay ışığının altında bile karakteri daha sıcak. İnce yatay paneller gözün duvarların biçimini takip etmesini sağlıyor. Arduvaz çatılar üst silueti koyu tutarken eski pirinç ve amber ışık, kapıların ve pencerelerin kenarlarını belirginleştiriyor. Malzemelerin görevleri farklı, ama hepsi aynı ölçülü paleti paylaşıyor. Fırça izleri ve hafif düzensiz kontürler, mimariyi mekanik bir kusursuzluk yerine el yapımı bir hisle buluşturuyor."),
        image: "studio-blueprint.png", caption: t("An architectural study: the whole house before its smaller details.", "Mimari çalışma: küçük ayrıntılardan önce yapının bütünü."),
      },
      {
        title: t("Why red returned", "Kırmızı neden geri döndü?"),
        body: t("Crimson leaves connect the mansion to the wind running through the Hollowgale world. They work best as a small interruption in the blue-green night, not as a blanket over every surface. A few leaves near a lantern or against a quiet wall guide the eye without competing with the windows. Warm light invites us towards the entrance; the red reminds us that this place has a life outside its walls. Leaving darker, quieter areas around those accents gives them room to matter.", "Kırmızı yapraklar konağı, Hollowgale dünyasının içinden geçen rüzgâra bağlıyor. Mavi ve yeşil gecenin içindeki küçük bir vurgu olarak daha iyi çalışıyorlar; her yüzeyi kaplayan bir örtü olarak değil. Bir fenerin yanında ya da sakin bir duvarın önündeki birkaç yaprak, pencerelerle yarışmadan bakışı yönlendiriyor. Sıcak ışık bizi girişe davet ediyor; kırmızı ise bu yerin duvarlarının dışında da yaşadığını hatırlatıyor. Bu vurguların çevresinde daha koyu ve sakin alanlar bırakmak, onlara anlam kazanacak boşluğu veriyor."),
        image: "journal-garden-v1.png", caption: t("Crimson accents and warm lanterns in the moonlit garden.", "Ay ışığındaki bahçede kırmızı vurgular ve sıcak fenerler."),
      },
    ],
  },
  {
    slug: "a-new-face-for-the-cards", date: "2026-09-28", category: t("Visual design", "Görsel tasarım"),
    title: t("A new face for the cards", "Kartların yeni yüzü"),
    description: t("Character illustrations, small symbols and the stories a card can hold.", "Karakter kartlarının illüstrasyon süreci, semboller ve anlattıkları roller."), image: "journal-cards-v1.png",
    intro: t("A card is a small stage. Its portrait, frame and symbols must feel like parts of the same world, while leaving enough space for a character to be recognised at a glance.", "Bir kart, küçük bir sahne. Portresi, çerçevesi ve sembolleri aynı dünyanın parçaları gibi hissettirmeli; aynı zamanda karakterin tek bakışta tanınabileceği kadar boşluk bırakmalı."),
    quote: t("A small image can carry the weight of a whole story.", "Küçük bir görsel, koca bir hikâyenin ağırlığını taşıyabilir."),
    sections: [
      { title: t("Start with the silhouette", "Siluetle başlamak"), body: t("Before tiny ornaments, there is a face and a pose. Keeping the portrait clear lets the frame stay expressive without swallowing the character. Strong light and a quiet background help separate the two, especially when a card appears at a smaller size.", "Küçük süslemelerden önce bir yüz ve bir duruş var. Portreyi net tutmak, çerçevenin karakteri yutmadan etkileyici olmasını sağlıyor. Güçlü bir ışık ve sakin bir arka plan, özellikle kart küçük gösterildiğinde ikisini birbirinden ayırıyor."), image: "journal-cards-v1.png", caption: t("Portraits held together by a shared ivory and midnight palette.", "Ortak fildişi ve gece paletiyle bir araya gelen portreler.") },
      { title: t("A frame with a human hand", "El izini taşıyan bir çerçeve"), body: t("Antique gold should feel drawn, not stamped from a perfect template. Slight changes in line weight bring the border closer to the mansion's illustrated architecture. The ornament gives the card a history; the darker space around the portrait gives the eye somewhere to rest.", "Eski altın, kusursuz bir şablondan basılmış değil, çizilmiş gibi hissettirmeli. Çizgi kalınlığındaki küçük değişimler çerçeveyi konağın illüstratif mimarisine yaklaştırıyor. Süsleme karta bir geçmiş kazandırırken portrenin çevresindeki koyu boşluk göze dinlenecek bir yer veriyor."), image: "studio-blueprint.png", caption: t("Brass, paper and ink: materials that belong to the same world.", "Pirinç, kâğıt ve mürekkep: aynı dünyaya ait malzemeler.") },
      { title: t("Symbols with room for discovery", "Keşfe alan bırakan semboller"), body: t("A symbol is most interesting when it invites a second look. Stars, leaves and small architectural shapes can connect a portrait to the wider world without explaining everything. Repeating a motif carefully creates recognition; leaving a little unanswered creates curiosity.", "Bir sembol, ikinci bir bakışa davet ettiğinde ilginçleşiyor. Yıldızlar, yapraklar ve küçük mimari şekiller her şeyi açıklamadan portreyi daha geniş dünyaya bağlayabiliyor. Bir motifi ölçülü biçimde tekrarlamak tanıdıklık; bir kısmını cevapsız bırakmak ise merak yaratıyor."), image: "journal-cards-v1.png", caption: t("Small details are an invitation to look closer.", "Küçük ayrıntılar daha yakından bakmaya davet ediyor.") },
    ],
  },
  {
    slug: "night-in-the-garden", date: "2026-09-21", category: t("World building", "Dünya"), title: t("Night in the garden", "Bahçede gece"),
    description: t("Moonlight, plant silhouettes and warm paths around the mansion.", "Mansion of Fates'in bahçesinde atmosfer, bitki örtüsü ve ışık tasarımı."), image: "journal-garden-v1.png",
    intro: t("The garden is the first room of the mansion, even though it has no ceiling. Paths, shadows and little pools of light shape the approach to the front door.", "Bahçe, tavanı olmasa da konağın ilk odası. Yollar, gölgeler ve küçük ışık adaları, giriş kapısına yaklaşırken hissedilen atmosferi şekillendiriyor."), quote: t("A path can tell a story before a door is opened.", "Bir yol, kapı açılmadan da bir hikâye anlatabilir."),
    sections: [
      { title: t("Give the night a silhouette", "Geceye bir siluet vermek"), body: t("Tall firs create a dark frame, while roses and lower plants break the edge of the path. Their shapes need to stay distinct. A few clean gaps between layers make the garden readable without taking away its sense of being overgrown.", "Uzun çamlar koyu bir çerçeve kurarken güller ve alçak bitkiler yolun kenarını hareketlendiriyor. Biçimlerinin birbirinden ayrılması gerekiyor. Katmanlar arasındaki birkaç temiz boşluk, bahçenin kendi hâline büyümüş hissini kaybetmeden okunmasını sağlıyor."), image: "journal-garden-v1.png", caption: t("A quiet clearing between roses, stone and fir trees.", "Güller, taş ve çamların arasında sakin bir açıklık.") },
      { title: t("Lanterns as landmarks", "İşaret olarak fenerler"), body: t("The moon sets the overall colour of the garden. Lanterns do a more local job: they mark a turn, reveal a step and give a resting point beside the fountain. Warm light stays sparse, so every lit place has a reason to draw attention.", "Ay, bahçenin genel rengini belirliyor. Fenerlerin görevi daha yerel: bir dönemeçi işaretlemek, basamağı göstermek ve çeşmenin yanında bir dinlenme noktası kurmak. Sıcak ışık seyrek tutulduğunda aydınlanan her yerin dikkat çekmek için bir nedeni oluyor."), image: "mansion-hero.png", caption: t("Warm light follows the approach to the mansion.", "Sıcak ışık, konağa yaklaşan yolu takip ediyor.") },
      { title: t("Let some corners stay quiet", "Bazı köşeleri sakin bırakmak"), body: t("A garden does not need a clue in every corner. The sound imagined around a fountain, the shape of a statue and a bench half hidden by leaves can give a place character on their own. Space between these moments makes each one easier to notice.", "Bahçenin her köşesinde bir ipucu olması gerekmiyor. Çeşmenin çevresinde hayal edilen ses, bir heykelin biçimi ve yaprakların ardında kalan bir bank kendi başlarına mekâna karakter katabiliyor. Bu anların arasındaki boşluk, her birini fark etmeyi kolaylaştırıyor."), image: "journal-garden-v1.png", caption: t("Details gain meaning when they have room around them.", "Ayrıntılar, çevrelerinde boşluk olduğunda anlam kazanıyor.") },
    ],
  },
  {
    slug: "the-story-of-a-room", date: "2026-09-12", category: t("Environment art", "Mekân"), title: t("The story of a room", "Bir odanın hikâyesi"),
    description: t("The dining room, its materials and the details that suggest who was here.", "Konağın yemek salonunun tasarımında ilham kaynakları ve detaylar."), image: "dining.png",
    intro: t("A room can suggest people without showing them. A chair pulled away from the table, a portrait on the wall and a pool of candlelight make a space feel as though a conversation has only just ended.", "Bir oda, insanları göstermeden de onları hissettirebilir. Masadan uzaklaşmış bir sandalye, duvardaki portre ve bir mumun ışığı, konuşmanın biraz önce bittiği bir mekân hissi yaratır."), quote: t("The room should feel inhabited, even when it is empty.", "Oda boşken bile yaşanmış hissettirmeli."),
    sections: [
      { title: t("Begin with the centre", "Merkezden başlamak"), body: t("The long table gives the dining room its structure. Chairs, a rug and a chandelier repeat that direction, helping the player read the space. Before adding objects, a clear arrangement makes the room work at the scale at which it will actually be seen.", "Uzun masa yemek salonunun yapısını belirliyor. Sandalyeler, halı ve avize bu yönü tekrarlayarak oyuncunun mekânı okumasını kolaylaştırıyor. Nesneler eklenmeden önce net bir yerleşim, odanın gerçekten görüleceği ölçekte çalışmasını sağlıyor."), image: "dining.png", caption: t("The table anchors the room's composition.", "Masa, odanın kompozisyonunu bir arada tutuyor.") },
      { title: t("Materials hold the mood", "Atmosferi taşıyan malzemeler"), body: t("Dark wood, deep red fabric and aged brass share the same warm light. Their textures should be different enough to recognise, but quiet enough to belong together. Hand-drawn contours keep the furniture related to the mansion outside.", "Koyu ahşap, derin kırmızı kumaş ve eskimiş pirinç aynı sıcak ışığı paylaşıyor. Dokuları tanınacak kadar farklı, birlikte duracak kadar sakin olmalı. El çizimi kontürler, mobilyaları dışarıdaki konağın diliyle birleştiriyor."), image: "salon.png", caption: t("A shared language of wood, fabric and brass.", "Ahşap, kumaş ve pirincin ortak dili.") },
      { title: t("Objects that imply a story", "Hikâye hissettiren nesneler"), body: t("A place setting is more than decoration: it gives a seat a purpose. Portraits and candleholders add a sense of memory. Leaving some surfaces bare prevents those details from disappearing into clutter, and gives the player space to wonder about them.", "Bir servis düzeni süsten fazlası: sandalyeye bir amaç veriyor. Portreler ve şamdanlar mekâna hafıza hissi ekliyor. Bazı yüzeyleri boş bırakmak, ayrıntıların kalabalık içinde kaybolmasını önlüyor ve oyuncuya onlar hakkında düşünme alanı veriyor."), image: "dining.png", caption: t("Small arrangements suggest a life beyond the room.", "Küçük düzenlemeler odanın ötesindeki bir hayatı hissettiriyor.") },
    ],
  },
  {
    slug: "light-shadow-and-readability", date: "2026-09-05", category: t("Game development", "Oyun geliştirme"), title: t("Light, shadow and readability", "Işık, gölge ve okunabilirlik"),
    description: t("Finding a balance between atmosphere and the places the eye needs to follow.", "Oynanışta ışığın rehber rolü ve atmosferle denge kurma sürecimiz."), image: "library.png",
    intro: t("Darkness builds atmosphere, but a player still needs to understand a room. Light can hold both jobs: keeping the mansion mysterious while making its shapes and paths readable.", "Karanlık atmosfer kurar; ama oyuncunun odayı anlaması da gerekir. Işık iki görevi birlikte taşıyabilir: konağı gizemli tutarken biçimlerini ve yollarını okunabilir kılmak."), quote: t("The eye should find its way without the mystery disappearing.", "Gizem kaybolmadan, göz kendi yolunu bulabilmeli."),
    sections: [
      { title: t("Start with the larger shapes", "Büyük biçimlerle başlamak"), body: t("Before individual lamps, the walls, floor and furniture need different values. A clear desk against a quieter rug remains visible even where the light is low. Colour is useful, but the room should also hold together through its larger light and dark areas.", "Tek tek lambalardan önce duvarlar, zemin ve mobilyaların tonları birbirinden ayrılmalı. Daha sakin bir halının üzerindeki belirgin masa, ışığın düşük olduğu yerde de görünür kalıyor. Renk yardımcı oluyor; ancak oda büyük açık ve koyu alanlarıyla da bir arada durabilmeli."), image: "library.png", caption: t("Larger shapes keep the study legible beneath the details.", "Büyük biçimler, ayrıntıların altında çalışma odasını okunabilir tutuyor.") },
      { title: t("A warm point to return to", "Dönülecek sıcak bir nokta"), body: t("A desk lamp or fireplace can give the eye a centre. The brightest spot does not have to light the whole room; it can simply establish where attention begins. Smaller lights then reveal the edges of doors, books and objects without making every corner equally bright.", "Bir masa lambası ya da şömine, bakışa bir merkez verebiliyor. En parlak noktanın tüm odayı aydınlatması gerekmiyor; dikkatin nereden başlayacağını belirlemesi yeterli. Daha küçük ışıklar, her köşeyi eşit derecede parlatmadan kapıların, kitapların ve nesnelerin kenarlarını gösteriyor."), image: "salon.png", caption: t("Warm light establishes a calm focal point.", "Sıcak ışık sakin bir odak noktası kuruyor.") },
      { title: t("At the corridor's end", "Koridorun sonunda"), body: t("Repeated doors and pools of light create rhythm in a corridor. Contrast around the far end gives the passage a direction. The shadows between those lights preserve depth, while a restrained amount of ornament stops the architecture from becoming visual noise.", "Tekrarlanan kapılar ve ışık adaları koridorda bir ritim kuruyor. Uzak uçtaki kontrast, geçide bir yön veriyor. Işıkların arasındaki gölgeler derinliği korurken ölçülü süsleme, mimarinin görsel bir gürültüye dönüşmesini önlüyor."), image: "corridor.png", caption: t("A rhythm of doors, portraits and light.", "Kapıların, portrelerin ve ışığın ritmi.") },
    ],
  },
];

export const postUrl = (post: Pick<JournalPost, "slug">) => `${JOURNAL_PATH}/${post.slug}`;
export const formatPostDate = (date: string, language: Language) => new Intl.DateTimeFormat(language === "tr" ? "tr-TR" : "en-GB", { day: "2-digit", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${date}T12:00:00Z`));
export const readingMinutes = (post: JournalPost, language: Language) => {
  const text = [post.intro[language], post.quote[language], ...post.sections.map(section => `${section.title[language]} ${section.body[language]}`), ...(post.slug === "mansion-exterior" ? [journalCopy[language].detailsBody, journalCopy[language].finalBody] : [])].join(" ");
  return Math.max(1, Math.ceil(text.trim().split(/\s+/).length / 200));
};
