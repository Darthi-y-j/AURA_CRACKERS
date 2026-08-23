export interface AuraCatalogCategory {
  name: string
  slug: string
  description: string
  sort_order: number
}

export interface AuraCatalogProduct {
  name: string
  slug: string
  category_slug: string
  description: string
  specifications: Record<string, string>
  price: number
  pieces: number
  stock_quantity: number
  stock_alert_limit: number
  brand: string
  tag: string | null
  is_featured: boolean
  sort_order: number
}

export const AURA_CATALOG_CATEGORIES: AuraCatalogCategory[] = [
  {
    "name": "Sound Party",
    "slug": "sound-party",
    "description": "Loud festive sound crackers",
    "sort_order": 1
  },
  {
    "name": "Cyclone Chakkars",
    "slug": "cyclone-chakkars",
    "description": "Ground spinning chakkars",
    "sort_order": 2
  },
  {
    "name": "Spin Win",
    "slug": "spin-win",
    "description": "Spinners and spinning chakkars",
    "sort_order": 3
  },
  {
    "name": "Drive Wheels",
    "slug": "drive-wheels",
    "description": "Rotating wheel fireworks",
    "sort_order": 4
  },
  {
    "name": "Flower Shower",
    "slug": "flower-shower",
    "description": "Flower pot fountain crackers",
    "sort_order": 5
  },
  {
    "name": "Colour Kotis",
    "slug": "colour-kotis",
    "description": "Colourful koti crackers",
    "sort_order": 6
  },
  {
    "name": "Triangle Fountain",
    "slug": "triangle-fountain",
    "description": "Tri-colour fountain displays",
    "sort_order": 7
  },
  {
    "name": "Twinkling Star",
    "slug": "twinkling-star",
    "description": "Twinkling star sparklers",
    "sort_order": 8
  },
  {
    "name": "Bitli Fizzly",
    "slug": "bitli-fizzly",
    "description": "Bijili packs for celebrations",
    "sort_order": 9
  },
  {
    "name": "Zoom Boom",
    "slug": "zoom-boom",
    "description": "Bomb-style sound crackers",
    "sort_order": 10
  },
  {
    "name": "Foil Bombs",
    "slug": "foil-bombs",
    "description": "Foil bomb crackers",
    "sort_order": 11
  },
  {
    "name": "Paper Blast",
    "slug": "paper-blast",
    "description": "Paper blast packs",
    "sort_order": 12
  },
  {
    "name": "Jet Rider",
    "slug": "jet-rider",
    "description": "Rockets with aerial effects",
    "sort_order": 13
  },
  {
    "name": "Crackling Torches",
    "slug": "crackling-torches",
    "description": "Handheld crackling torches",
    "sort_order": 14
  },
  {
    "name": "Rainbow Fountain",
    "slug": "rainbow-fountain",
    "description": "Multicolour fountain mixes",
    "sort_order": 15
  },
  {
    "name": "Shower Spark",
    "slug": "shower-spark",
    "description": "Shower and novelty spark effects",
    "sort_order": 16
  },
  {
    "name": "Kids Friendly",
    "slug": "kids-friendly",
    "description": "Family-friendly novelty crackers",
    "sort_order": 17
  },
  {
    "name": "Star Shooter",
    "slug": "star-shooter",
    "description": "Shooter-style festive novelties",
    "sort_order": 18
  },
  {
    "name": "Peacock Dance",
    "slug": "peacock-dance",
    "description": "Peacock-themed visual crackers",
    "sort_order": 19
  },
  {
    "name": "Fantastic Novelties",
    "slug": "fantastic-novelties",
    "description": "Fun novelty fireworks",
    "sort_order": 20
  },
  {
    "name": "Tun Tun Tun",
    "slug": "tun-tun-tun",
    "description": "Fountain crackers with sparkling effects",
    "sort_order": 21
  },
  {
    "name": "Midnight Magic Skyshots",
    "slug": "midnight-magic-skyshots",
    "description": "Premium aerial skyshots",
    "sort_order": 22
  },
  {
    "name": "Special Colour Skyshots",
    "slug": "special-colour-skyshots",
    "description": "Colour-themed aerial skyshots",
    "sort_order": 23
  },
  {
    "name": "Special Function Skyshots",
    "slug": "special-function-skyshots",
    "description": "Special-effect aerial skyshots",
    "sort_order": 24
  },
  {
    "name": "Premium Plus Brands",
    "slug": "premium-plus-brands",
    "description": "Premium plus aerial series",
    "sort_order": 25
  },
  {
    "name": "Aerial Multishots",
    "slug": "aerial-multishots",
    "description": "Multi-shot aerial cakes",
    "sort_order": 26
  },
  {
    "name": "Elite Setout & Fan Cake",
    "slug": "elite-setout-fan-cake",
    "description": "Elite setout and fan cake displays",
    "sort_order": 27
  },
  {
    "name": "Wonder Sparklers",
    "slug": "wonder-sparklers",
    "description": "Electric and colour sparklers",
    "sort_order": 28
  },
  {
    "name": "Colour Matches",
    "slug": "colour-matches",
    "description": "Colour match packs",
    "sort_order": 29
  },
  {
    "name": "Thunder",
    "slug": "thunder",
    "description": "Thunder string crackers",
    "sort_order": 30
  }
]

export const AURA_CATALOG_PRODUCTS: AuraCatalogProduct[] = [
  {
    "name": "2¾\" Kuruvi",
    "slug": "2-3-4-inch-kuruvi",
    "category_slug": "sound-party",
    "description": "Compact sound cracker for festive celebrations",
    "specifications": {
      "Size": "2¾\"",
      "Type": "Sound"
    },
    "price": 80,
    "pieces": 10,
    "stock_quantity": 100,
    "stock_alert_limit": 20,
    "brand": "Aura Crackers",
    "tag": null,
    "is_featured": true,
    "sort_order": 1
  },
  {
    "name": "3½\" Lakshmi",
    "slug": "3-1-2-inch-lakshmi",
    "category_slug": "sound-party",
    "description": "Classic Lakshmi cracker with powerful sound",
    "specifications": {
      "Size": "3½\"",
      "Type": "Sound"
    },
    "price": 100,
    "pieces": 10,
    "stock_quantity": 100,
    "stock_alert_limit": 20,
    "brand": "Aura Crackers",
    "tag": null,
    "is_featured": false,
    "sort_order": 2
  },
  {
    "name": "4\" Lakshmi",
    "slug": "4-inch-lakshmi",
    "category_slug": "sound-party",
    "description": "Popular Lakshmi cracker for festive occasions",
    "specifications": {
      "Size": "4\"",
      "Type": "Sound"
    },
    "price": 130,
    "pieces": 10,
    "stock_quantity": 100,
    "stock_alert_limit": 20,
    "brand": "Aura Crackers",
    "tag": null,
    "is_featured": true,
    "sort_order": 3
  },
  {
    "name": "4\" Deluxe Lakshmi",
    "slug": "4-inch-deluxe-lakshmi",
    "category_slug": "sound-party",
    "description": "Deluxe Lakshmi cracker with enhanced performance",
    "specifications": {
      "Size": "4\"",
      "Type": "Sound"
    },
    "price": 160,
    "pieces": 10,
    "stock_quantity": 80,
    "stock_alert_limit": 15,
    "brand": "Aura Crackers",
    "tag": null,
    "is_featured": false,
    "sort_order": 4
  },
  {
    "name": "4\" Gold Lakshmi",
    "slug": "4-inch-gold-lakshmi",
    "category_slug": "sound-party",
    "description": "Premium Lakshmi cracker for special celebrations",
    "specifications": {
      "Size": "4\"",
      "Type": "Premium Sound"
    },
    "price": 180,
    "pieces": 10,
    "stock_quantity": 80,
    "stock_alert_limit": 15,
    "brand": "Aura Crackers",
    "tag": null,
    "is_featured": true,
    "sort_order": 5
  },
  {
    "name": "5\" Jallikattu",
    "slug": "5-inch-jallikattu",
    "category_slug": "sound-party",
    "description": "Powerful Jallikattu cracker for celebrations",
    "specifications": {
      "Size": "5\"",
      "Type": "Sound"
    },
    "price": 220,
    "pieces": 10,
    "stock_quantity": 70,
    "stock_alert_limit": 15,
    "brand": "Aura Crackers",
    "tag": null,
    "is_featured": true,
    "sort_order": 6
  },
  {
    "name": "6\" Lion King",
    "slug": "6-inch-lion-king",
    "category_slug": "sound-party",
    "description": "Large sound cracker delivering exciting celebrations",
    "specifications": {
      "Size": "6\"",
      "Type": "Sound"
    },
    "price": 280,
    "pieces": 10,
    "stock_quantity": 60,
    "stock_alert_limit": 10,
    "brand": "Aura Crackers",
    "tag": null,
    "is_featured": true,
    "sort_order": 7
  },
  {
    "name": "Ground Chakkar Big (10 pcs)",
    "slug": "ground-chakkar-big-10-pcs",
    "category_slug": "cyclone-chakkars",
    "description": "Big spinning chakkar with sparkling effects",
    "specifications": {
      "Type": "Ground Chakkar",
      "Pack": "10 pcs"
    },
    "price": 120,
    "pieces": 10,
    "stock_quantity": 100,
    "stock_alert_limit": 20,
    "brand": "Aura Crackers",
    "tag": null,
    "is_featured": true,
    "sort_order": 8
  },
  {
    "name": "Ground Chakkar Special",
    "slug": "ground-chakkar-special",
    "category_slug": "cyclone-chakkars",
    "description": "Special chakkar creating bright spinning sparks",
    "specifications": {
      "Type": "Ground Chakkar",
      "Effect": "Sparks"
    },
    "price": 100,
    "pieces": 10,
    "stock_quantity": 100,
    "stock_alert_limit": 20,
    "brand": "Aura Crackers",
    "tag": null,
    "is_featured": false,
    "sort_order": 9
  },
  {
    "name": "Ground Chakkar Deluxe",
    "slug": "ground-chakkar-deluxe",
    "category_slug": "cyclone-chakkars",
    "description": "Deluxe chakkar with vibrant spinning effects",
    "specifications": {
      "Type": "Ground Chakkar",
      "Variant": "Deluxe"
    },
    "price": 150,
    "pieces": 10,
    "stock_quantity": 80,
    "stock_alert_limit": 15,
    "brand": "Aura Crackers",
    "tag": null,
    "is_featured": true,
    "sort_order": 10
  },
  {
    "name": "Spinner Special",
    "slug": "spinner-special",
    "category_slug": "spin-win",
    "description": "Special spinner producing colorful sparkling effects",
    "specifications": {
      "Type": "Spinner",
      "Effect": "Spinning Sparks"
    },
    "price": 100,
    "pieces": 10,
    "stock_quantity": 100,
    "stock_alert_limit": 20,
    "brand": "Aura Crackers",
    "tag": null,
    "is_featured": false,
    "sort_order": 11
  },
  {
    "name": "Spinner Deluxe",
    "slug": "spinner-deluxe",
    "category_slug": "spin-win",
    "description": "Deluxe spinner with brighter festive effects",
    "specifications": {
      "Type": "Spinner",
      "Variant": "Deluxe"
    },
    "price": 140,
    "pieces": 10,
    "stock_quantity": 80,
    "stock_alert_limit": 15,
    "brand": "Aura Crackers",
    "tag": null,
    "is_featured": true,
    "sort_order": 12
  },
  {
    "name": "Wine Chakkar Special",
    "slug": "wine-chakkar-special",
    "category_slug": "spin-win",
    "description": "Special chakkar with energetic spinning performance",
    "specifications": {
      "Type": "Chakkar",
      "Variant": "Special"
    },
    "price": 120,
    "pieces": 10,
    "stock_quantity": 80,
    "stock_alert_limit": 15,
    "brand": "Aura Crackers",
    "tag": null,
    "is_featured": false,
    "sort_order": 13
  },
  {
    "name": "Lotus Wheel (4 × 4)",
    "slug": "lotus-wheel-4-x-4",
    "category_slug": "drive-wheels",
    "description": "Lotus wheel delivering colorful spinning effects",
    "specifications": {
      "Type": "Wheel",
      "Size": "4 × 4"
    },
    "price": 150,
    "pieces": 5,
    "stock_quantity": 80,
    "stock_alert_limit": 15,
    "brand": "Aura Crackers",
    "tag": null,
    "is_featured": true,
    "sort_order": 14
  },
  {
    "name": "Disco Wheel",
    "slug": "disco-wheel",
    "category_slug": "drive-wheels",
    "description": "Disco wheel creating bright rotating visual effects",
    "specifications": {
      "Type": "Wheel",
      "Effect": "Rotating Sparks"
    },
    "price": 130,
    "pieces": 5,
    "stock_quantity": 80,
    "stock_alert_limit": 15,
    "brand": "Aura Crackers",
    "tag": null,
    "is_featured": false,
    "sort_order": 15
  },
  {
    "name": "Whistling Wheel",
    "slug": "whistling-wheel",
    "category_slug": "drive-wheels",
    "description": "Whistling wheel combining sound and motion",
    "specifications": {
      "Type": "Wheel",
      "Effect": "Whistling"
    },
    "price": 150,
    "pieces": 5,
    "stock_quantity": 70,
    "stock_alert_limit": 15,
    "brand": "Aura Crackers",
    "tag": null,
    "is_featured": true,
    "sort_order": 16
  },
  {
    "name": "Flower Pot Big",
    "slug": "flower-pot-big",
    "category_slug": "flower-shower",
    "description": "Large flower pot with sparkling fountain effects",
    "specifications": {
      "Type": "Flower Pot",
      "Size": "Big"
    },
    "price": 180,
    "pieces": 5,
    "stock_quantity": 80,
    "stock_alert_limit": 15,
    "brand": "Aura Crackers",
    "tag": null,
    "is_featured": true,
    "sort_order": 17
  },
  {
    "name": "Flower Pot Ashoka",
    "slug": "flower-pot-ashoka",
    "category_slug": "flower-shower",
    "description": "Ashoka flower pot producing colorful fountain effects",
    "specifications": {
      "Type": "Flower Pot",
      "Variant": "Ashoka"
    },
    "price": 200,
    "pieces": 5,
    "stock_quantity": 70,
    "stock_alert_limit": 15,
    "brand": "Aura Crackers",
    "tag": null,
    "is_featured": true,
    "sort_order": 18
  },
  {
    "name": "Colour Koti",
    "slug": "colour-koti",
    "category_slug": "colour-kotis",
    "description": "Colorful Koti cracker for festive celebrations",
    "specifications": {
      "Type": "Koti",
      "Effect": "Colour"
    },
    "price": 100,
    "pieces": 10,
    "stock_quantity": 100,
    "stock_alert_limit": 20,
    "brand": "Aura Crackers",
    "tag": null,
    "is_featured": false,
    "sort_order": 19
  },
  {
    "name": "Colour Koti DLX",
    "slug": "colour-koti-dlx",
    "category_slug": "colour-kotis",
    "description": "Deluxe Koti with vibrant colorful effects",
    "specifications": {
      "Type": "Koti",
      "Variant": "Deluxe"
    },
    "price": 140,
    "pieces": 10,
    "stock_quantity": 80,
    "stock_alert_limit": 15,
    "brand": "Aura Crackers",
    "tag": null,
    "is_featured": true,
    "sort_order": 20
  },
  {
    "name": "Super Koti (Jumbo)",
    "slug": "super-koti-jumbo",
    "category_slug": "colour-kotis",
    "description": "Jumbo Koti delivering impressive colorful effects",
    "specifications": {
      "Type": "Koti",
      "Variant": "Jumbo"
    },
    "price": 180,
    "pieces": 10,
    "stock_quantity": 70,
    "stock_alert_limit": 15,
    "brand": "Aura Crackers",
    "tag": null,
    "is_featured": true,
    "sort_order": 21
  },
  {
    "name": "Tri Colour",
    "slug": "tri-colour",
    "category_slug": "triangle-fountain",
    "description": "Three-color fountain with beautiful sparkling display",
    "specifications": {
      "Type": "Fountain",
      "Effect": "Three Colour"
    },
    "price": 150,
    "pieces": 5,
    "stock_quantity": 80,
    "stock_alert_limit": 15,
    "brand": "Aura Crackers",
    "tag": null,
    "is_featured": false,
    "sort_order": 22
  },
  {
    "name": "Tri Colour Spl",
    "slug": "tri-colour-spl",
    "category_slug": "triangle-fountain",
    "description": "Special tricolor fountain with vibrant effects",
    "specifications": {
      "Type": "Fountain",
      "Variant": "Special"
    },
    "price": 180,
    "pieces": 5,
    "stock_quantity": 70,
    "stock_alert_limit": 15,
    "brand": "Aura Crackers",
    "tag": null,
    "is_featured": true,
    "sort_order": 23
  },
  {
    "name": "½\" Twinkling Star",
    "slug": "1-2-inch-twinkling-star",
    "category_slug": "twinkling-star",
    "description": "Small twinkling star with bright sparkling effect",
    "specifications": {
      "Size": "½\"",
      "Type": "Twinkling Star"
    },
    "price": 80,
    "pieces": 10,
    "stock_quantity": 100,
    "stock_alert_limit": 20,
    "brand": "Aura Crackers",
    "tag": null,
    "is_featured": false,
    "sort_order": 24
  },
  {
    "name": "4\" Twinkling Star",
    "slug": "4-inch-twinkling-star",
    "category_slug": "twinkling-star",
    "description": "Large twinkling star with brilliant sparkling effects",
    "specifications": {
      "Size": "4\"",
      "Type": "Twinkling Star"
    },
    "price": 150,
    "pieces": 10,
    "stock_quantity": 80,
    "stock_alert_limit": 15,
    "brand": "Aura Crackers",
    "tag": null,
    "is_featured": true,
    "sort_order": 25
  },
  {
    "name": "Golden Bijili Red (50 pcs)",
    "slug": "golden-bijili-red-50-pcs",
    "category_slug": "bitli-fizzly",
    "description": "Red Bijili pack for festive celebrations",
    "specifications": {
      "Pack": "50 pcs",
      "Type": "Bijili"
    },
    "price": 100,
    "pieces": 50,
    "stock_quantity": 100,
    "stock_alert_limit": 20,
    "brand": "Aura Crackers",
    "tag": null,
    "is_featured": true,
    "sort_order": 26
  },
  {
    "name": "Golden Bijili Red (100 pcs)",
    "slug": "golden-bijili-red-100-pcs",
    "category_slug": "bitli-fizzly",
    "description": "Large red Bijili pack for celebrations",
    "specifications": {
      "Pack": "100 pcs",
      "Type": "Bijili"
    },
    "price": 180,
    "pieces": 100,
    "stock_quantity": 100,
    "stock_alert_limit": 20,
    "brand": "Aura Crackers",
    "tag": null,
    "is_featured": true,
    "sort_order": 27
  },
  {
    "name": "Golden Bijili Striped (100 pcs)",
    "slug": "golden-bijili-striped-100-pcs",
    "category_slug": "bitli-fizzly",
    "description": "Striped Bijili pack with festive appeal",
    "specifications": {
      "Pack": "100 pcs",
      "Type": "Bijili"
    },
    "price": 200,
    "pieces": 100,
    "stock_quantity": 80,
    "stock_alert_limit": 15,
    "brand": "Aura Crackers",
    "tag": null,
    "is_featured": false,
    "sort_order": 28
  },
  {
    "name": "King of King Bomb",
    "slug": "king-of-king-bomb",
    "category_slug": "zoom-boom",
    "description": "Premium bomb designed for powerful celebrations",
    "specifications": {
      "Type": "Bomb",
      "Variant": "King"
    },
    "price": 180,
    "pieces": 10,
    "stock_quantity": 70,
    "stock_alert_limit": 15,
    "brand": "Aura Crackers",
    "tag": null,
    "is_featured": true,
    "sort_order": 29
  },
  {
    "name": "Classic Bomb",
    "slug": "classic-bomb",
    "category_slug": "zoom-boom",
    "description": "Classic bomb for traditional festive celebrations",
    "specifications": {
      "Type": "Bomb",
      "Variant": "Classic"
    },
    "price": 120,
    "pieces": 10,
    "stock_quantity": 80,
    "stock_alert_limit": 15,
    "brand": "Aura Crackers",
    "tag": null,
    "is_featured": false,
    "sort_order": 30
  },
  {
    "name": "Digital Bomb",
    "slug": "digital-bomb",
    "category_slug": "zoom-boom",
    "description": "Digital bomb offering exciting festive effects",
    "specifications": {
      "Type": "Bomb",
      "Variant": "Digital"
    },
    "price": 160,
    "pieces": 10,
    "stock_quantity": 70,
    "stock_alert_limit": 15,
    "brand": "Aura Crackers",
    "tag": null,
    "is_featured": true,
    "sort_order": 31
  },
  {
    "name": "Bullet Bomb",
    "slug": "bullet-bomb",
    "category_slug": "foil-bombs",
    "description": "Bullet-style cracker for festive celebrations",
    "specifications": {
      "Type": "Foil Bomb",
      "Variant": "Bullet"
    },
    "price": 120,
    "pieces": 10,
    "stock_quantity": 80,
    "stock_alert_limit": 15,
    "brand": "Aura Crackers",
    "tag": null,
    "is_featured": false,
    "sort_order": 32
  },
  {
    "name": "555 Bomb",
    "slug": "555-bomb",
    "category_slug": "foil-bombs",
    "description": "Popular 555 bomb for festive occasions",
    "specifications": {
      "Type": "Foil Bomb",
      "Model": "555"
    },
    "price": 150,
    "pieces": 10,
    "stock_quantity": 80,
    "stock_alert_limit": 15,
    "brand": "Aura Crackers",
    "tag": null,
    "is_featured": true,
    "sort_order": 33
  },
  {
    "name": "¼ kg Paper Blast",
    "slug": "1-4-kg-paper-blast",
    "category_slug": "paper-blast",
    "description": "Compact paper blast pack for celebrations",
    "specifications": {
      "Weight": "¼ kg",
      "Type": "Paper Blast"
    },
    "price": 150,
    "pieces": 1,
    "stock_quantity": 60,
    "stock_alert_limit": 10,
    "brand": "Aura Crackers",
    "tag": null,
    "is_featured": false,
    "sort_order": 34
  },
  {
    "name": "½ kg Paper Blast",
    "slug": "1-2-kg-paper-blast",
    "category_slug": "paper-blast",
    "description": "Medium paper blast pack for celebrations",
    "specifications": {
      "Weight": "½ kg",
      "Type": "Paper Blast"
    },
    "price": 280,
    "pieces": 1,
    "stock_quantity": 50,
    "stock_alert_limit": 10,
    "brand": "Aura Crackers",
    "tag": null,
    "is_featured": true,
    "sort_order": 35
  },
  {
    "name": "1 kg Paper Blast",
    "slug": "1-kg-paper-blast",
    "category_slug": "paper-blast",
    "description": "Large paper blast pack for celebrations",
    "specifications": {
      "Weight": "1 kg",
      "Type": "Paper Blast"
    },
    "price": 500,
    "pieces": 1,
    "stock_quantity": 40,
    "stock_alert_limit": 8,
    "brand": "Aura Crackers",
    "tag": null,
    "is_featured": true,
    "sort_order": 36
  },
  {
    "name": "Lunik Rocket",
    "slug": "lunik-rocket",
    "category_slug": "jet-rider",
    "description": "Classic rocket with exciting aerial performance",
    "specifications": {
      "Type": "Rocket",
      "Model": "Lunik"
    },
    "price": 120,
    "pieces": 10,
    "stock_quantity": 80,
    "stock_alert_limit": 15,
    "brand": "Aura Crackers",
    "tag": null,
    "is_featured": true,
    "sort_order": 37
  },
  {
    "name": "Whistling Rocket",
    "slug": "whistling-rocket",
    "category_slug": "jet-rider",
    "description": "Whistling rocket creating exciting aerial sounds",
    "specifications": {
      "Type": "Rocket",
      "Effect": "Whistling"
    },
    "price": 150,
    "pieces": 10,
    "stock_quantity": 80,
    "stock_alert_limit": 15,
    "brand": "Aura Crackers",
    "tag": null,
    "is_featured": true,
    "sort_order": 38
  },
  {
    "name": "Master Mix (3 in 1)",
    "slug": "master-mix-3-in-1",
    "category_slug": "crackling-torches",
    "description": "Three-in-one torch with colorful crackling effects",
    "specifications": {
      "Pack": "3 in 1",
      "Type": "Torch"
    },
    "price": 150,
    "pieces": 3,
    "stock_quantity": 70,
    "stock_alert_limit": 15,
    "brand": "Aura Crackers",
    "tag": null,
    "is_featured": false,
    "sort_order": 39
  },
  {
    "name": "Pop Corn Handle",
    "slug": "pop-corn-handle",
    "category_slug": "crackling-torches",
    "description": "Popcorn-style handle with sparkling crackling effects",
    "specifications": {
      "Type": "Handle",
      "Effect": "Crackling"
    },
    "price": 120,
    "pieces": 5,
    "stock_quantity": 80,
    "stock_alert_limit": 15,
    "brand": "Aura Crackers",
    "tag": null,
    "is_featured": false,
    "sort_order": 40
  },
  {
    "name": "Waterfall Handle",
    "slug": "waterfall-handle",
    "category_slug": "crackling-torches",
    "description": "Waterfall handle creating cascading sparkling effects",
    "specifications": {
      "Type": "Handle",
      "Effect": "Waterfall"
    },
    "price": 150,
    "pieces": 5,
    "stock_quantity": 70,
    "stock_alert_limit": 15,
    "brand": "Aura Crackers",
    "tag": null,
    "is_featured": true,
    "sort_order": 41
  },
  {
    "name": "Selfie Stick",
    "slug": "selfie-stick",
    "category_slug": "crackling-torches",
    "description": "Selfie-themed novelty with colorful festive effects",
    "specifications": {
      "Type": "Novelty",
      "Theme": "Selfie"
    },
    "price": 150,
    "pieces": 5,
    "stock_quantity": 60,
    "stock_alert_limit": 10,
    "brand": "Aura Crackers",
    "tag": null,
    "is_featured": true,
    "sort_order": 42
  },
  {
    "name": "Colour Smoke Handle",
    "slug": "colour-smoke-handle",
    "category_slug": "crackling-torches",
    "description": "Color smoke handle creating vibrant smoke effects",
    "specifications": {
      "Type": "Handle",
      "Effect": "Colour Smoke"
    },
    "price": 160,
    "pieces": 5,
    "stock_quantity": 70,
    "stock_alert_limit": 15,
    "brand": "Aura Crackers",
    "tag": null,
    "is_featured": true,
    "sort_order": 43
  },
  {
    "name": "Hili Mix (5 in 1) Multicolour",
    "slug": "hili-mix-5-in-1-multicolour",
    "category_slug": "rainbow-fountain",
    "description": "Five-in-one fountain with colorful visual effects",
    "specifications": {
      "Pack": "5 in 1",
      "Effect": "Multicolour"
    },
    "price": 220,
    "pieces": 5,
    "stock_quantity": 60,
    "stock_alert_limit": 10,
    "brand": "Aura Crackers",
    "tag": null,
    "is_featured": true,
    "sort_order": 44
  },
  {
    "name": "Nano Mix (5 in 1) Multicolour",
    "slug": "nano-mix-5-in-1-multicolour",
    "category_slug": "rainbow-fountain",
    "description": "Compact five-in-one multicolour fountain collection",
    "specifications": {
      "Pack": "5 in 1",
      "Effect": "Multicolour"
    },
    "price": 200,
    "pieces": 5,
    "stock_quantity": 60,
    "stock_alert_limit": 10,
    "brand": "Aura Crackers",
    "tag": null,
    "is_featured": false,
    "sort_order": 45
  },
  {
    "name": "4\" Rainbow Mix",
    "slug": "4-inch-rainbow-mix",
    "category_slug": "rainbow-fountain",
    "description": "Four-inch fountain with colorful rainbow effects",
    "specifications": {
      "Size": "4\"",
      "Effect": "Rainbow"
    },
    "price": 180,
    "pieces": 5,
    "stock_quantity": 70,
    "stock_alert_limit": 15,
    "brand": "Aura Crackers",
    "tag": null,
    "is_featured": true,
    "sort_order": 46
  },
  {
    "name": "Star Pots (5 in 1)",
    "slug": "star-pots-5-in-1",
    "category_slug": "rainbow-fountain",
    "description": "Five-in-one star pots with sparkling effects",
    "specifications": {
      "Pack": "5 in 1",
      "Type": "Star Pots"
    },
    "price": 250,
    "pieces": 5,
    "stock_quantity": 60,
    "stock_alert_limit": 10,
    "brand": "Aura Crackers",
    "tag": null,
    "is_featured": true,
    "sort_order": 47
  },
  {
    "name": "Peacock Feathers",
    "slug": "peacock-feathers",
    "category_slug": "shower-spark",
    "description": "Peacock-inspired shower with beautiful sparkling effects",
    "specifications": {
      "Type": "Shower Spark",
      "Effect": "Peacock"
    },
    "price": 180,
    "pieces": 5,
    "stock_quantity": 70,
    "stock_alert_limit": 15,
    "brand": "Aura Crackers",
    "tag": null,
    "is_featured": true,
    "sort_order": 48
  },
  {
    "name": "Golden Ring",
    "slug": "golden-ring",
    "category_slug": "shower-spark",
    "description": "Golden ring effect with bright sparkling display",
    "specifications": {
      "Type": "Shower Spark",
      "Effect": "Golden Ring"
    },
    "price": 160,
    "pieces": 5,
    "stock_quantity": 70,
    "stock_alert_limit": 15,
    "brand": "Aura Crackers",
    "tag": null,
    "is_featured": false,
    "sort_order": 49
  },
  {
    "name": "Colour Rain",
    "slug": "colour-rain",
    "category_slug": "shower-spark",
    "description": "Color rain effect with vibrant festive display",
    "specifications": {
      "Type": "Shower Spark",
      "Effect": "Colour Rain"
    },
    "price": 180,
    "pieces": 5,
    "stock_quantity": 70,
    "stock_alert_limit": 15,
    "brand": "Aura Crackers",
    "tag": null,
    "is_featured": true,
    "sort_order": 50
  },
  {
    "name": "Tweet / Pop Mix",
    "slug": "tweet-pop-mix",
    "category_slug": "shower-spark",
    "description": "Fun mix combining tweet and pop effects",
    "specifications": {
      "Type": "Mix",
      "Effects": "Tweet, Pop"
    },
    "price": 180,
    "pieces": 5,
    "stock_quantity": 60,
    "stock_alert_limit": 10,
    "brand": "Aura Crackers",
    "tag": null,
    "is_featured": false,
    "sort_order": 51
  },
  {
    "name": "Dexter",
    "slug": "dexter",
    "category_slug": "shower-spark",
    "description": "Dexter-themed novelty for colorful celebrations",
    "specifications": {
      "Type": "Novelty",
      "Theme": "Dexter"
    },
    "price": 150,
    "pieces": 5,
    "stock_quantity": 60,
    "stock_alert_limit": 10,
    "brand": "Aura Crackers",
    "tag": null,
    "is_featured": false,
    "sort_order": 52
  },
  {
    "name": "Scooby Doo",
    "slug": "scooby-doo",
    "category_slug": "shower-spark",
    "description": "Scooby-themed novelty for festive celebrations",
    "specifications": {
      "Type": "Novelty",
      "Theme": "Scooby Doo"
    },
    "price": 150,
    "pieces": 5,
    "stock_quantity": 60,
    "stock_alert_limit": 10,
    "brand": "Aura Crackers",
    "tag": null,
    "is_featured": true,
    "sort_order": 53
  },
  {
    "name": "Powerpuff Girls",
    "slug": "powerpuff-girls",
    "category_slug": "shower-spark",
    "description": "Powerpuff-themed novelty with colorful festive effects",
    "specifications": {
      "Type": "Novelty",
      "Theme": "Powerpuff Girls"
    },
    "price": 160,
    "pieces": 5,
    "stock_quantity": 60,
    "stock_alert_limit": 10,
    "brand": "Aura Crackers",
    "tag": null,
    "is_featured": true,
    "sort_order": 54
  },
  {
    "name": "Dragon Ball 2 (Cocktail) (3 in 1)",
    "slug": "dragon-ball-2-cocktail-3-in-1",
    "category_slug": "shower-spark",
    "description": "Three-in-one Dragon Ball cocktail novelty",
    "specifications": {
      "Pack": "3 in 1",
      "Type": "Cocktail"
    },
    "price": 220,
    "pieces": 3,
    "stock_quantity": 50,
    "stock_alert_limit": 10,
    "brand": "Aura Crackers",
    "tag": null,
    "is_featured": true,
    "sort_order": 55
  },
  {
    "name": "Assorted Cartoon",
    "slug": "assorted-cartoon",
    "category_slug": "kids-friendly",
    "description": "Assorted cartoon novelties for family celebrations",
    "specifications": {
      "Type": "Novelty",
      "Theme": "Cartoon"
    },
    "price": 180,
    "pieces": 5,
    "stock_quantity": 70,
    "stock_alert_limit": 15,
    "brand": "Aura Crackers",
    "tag": null,
    "is_featured": true,
    "sort_order": 56
  },
  {
    "name": "Shake Egg",
    "slug": "shake-egg",
    "category_slug": "kids-friendly",
    "description": "Fun egg-shaped novelty for festive enjoyment",
    "specifications": {
      "Type": "Novelty",
      "Shape": "Egg"
    },
    "price": 120,
    "pieces": 5,
    "stock_quantity": 70,
    "stock_alert_limit": 15,
    "brand": "Aura Crackers",
    "tag": null,
    "is_featured": false,
    "sort_order": 57
  },
  {
    "name": "Magic Pops",
    "slug": "magic-pops",
    "category_slug": "kids-friendly",
    "description": "Colorful magic pops for festive enjoyment",
    "specifications": {
      "Type": "Novelty",
      "Effect": "Colour"
    },
    "price": 100,
    "pieces": 10,
    "stock_quantity": 100,
    "stock_alert_limit": 20,
    "brand": "Aura Crackers",
    "tag": null,
    "is_featured": true,
    "sort_order": 58
  },
  {
    "name": "Chittu Puttu",
    "slug": "chittu-puttu",
    "category_slug": "kids-friendly",
    "description": "Fun novelty item for festive celebrations",
    "specifications": {
      "Type": "Novelty",
      "Category": "Kids"
    },
    "price": 100,
    "pieces": 10,
    "stock_quantity": 80,
    "stock_alert_limit": 15,
    "brand": "Aura Crackers",
    "tag": null,
    "is_featured": false,
    "sort_order": 59
  },
  {
    "name": "Gun",
    "slug": "gun",
    "category_slug": "kids-friendly",
    "description": "Novelty gun-themed product for festive enjoyment",
    "specifications": {
      "Type": "Novelty",
      "Theme": "Gun"
    },
    "price": 120,
    "pieces": 5,
    "stock_quantity": 70,
    "stock_alert_limit": 15,
    "brand": "Aura Crackers",
    "tag": null,
    "is_featured": false,
    "sort_order": 60
  },
  {
    "name": "Roll Cap",
    "slug": "roll-cap",
    "category_slug": "kids-friendly",
    "description": "Roll cap novelty for traditional festive fun",
    "specifications": {
      "Type": "Cap",
      "Format": "Roll"
    },
    "price": 80,
    "pieces": 10,
    "stock_quantity": 100,
    "stock_alert_limit": 20,
    "brand": "Aura Crackers",
    "tag": null,
    "is_featured": false,
    "sort_order": 61
  },
  {
    "name": "Ring Cap",
    "slug": "ring-cap",
    "category_slug": "kids-friendly",
    "description": "Ring cap novelty for traditional festive fun",
    "specifications": {
      "Type": "Cap",
      "Format": "Ring"
    },
    "price": 80,
    "pieces": 10,
    "stock_quantity": 100,
    "stock_alert_limit": 20,
    "brand": "Aura Crackers",
    "tag": null,
    "is_featured": false,
    "sort_order": 62
  },
  {
    "name": "Top Gun (5 in 1)",
    "slug": "top-gun-5-in-1",
    "category_slug": "star-shooter",
    "description": "Five-in-one shooter with exciting festive effects",
    "specifications": {
      "Pack": "5 in 1",
      "Type": "Shooter"
    },
    "price": 220,
    "pieces": 5,
    "stock_quantity": 60,
    "stock_alert_limit": 10,
    "brand": "Aura Crackers",
    "tag": null,
    "is_featured": true,
    "sort_order": 63
  },
  {
    "name": "AK-47",
    "slug": "ak-47",
    "category_slug": "star-shooter",
    "description": "AK-47 themed novelty for festive celebrations",
    "specifications": {
      "Type": "Novelty Shooter",
      "Theme": "AK-47"
    },
    "price": 180,
    "pieces": 5,
    "stock_quantity": 60,
    "stock_alert_limit": 10,
    "brand": "Aura Crackers",
    "tag": null,
    "is_featured": false,
    "sort_order": 64
  },
  {
    "name": "Phoenix Peacock",
    "slug": "phoenix-peacock",
    "category_slug": "peacock-dance",
    "description": "Peacock-themed product with colorful visual effects",
    "specifications": {
      "Type": "Peacock",
      "Effect": "Colour"
    },
    "price": 220,
    "pieces": 5,
    "stock_quantity": 60,
    "stock_alert_limit": 10,
    "brand": "Aura Crackers",
    "tag": null,
    "is_featured": true,
    "sort_order": 65
  },
  {
    "name": "Bada Peacock",
    "slug": "bada-peacock",
    "category_slug": "peacock-dance",
    "description": "Large peacock effect for festive celebrations",
    "specifications": {
      "Type": "Peacock",
      "Variant": "Big"
    },
    "price": 250,
    "pieces": 5,
    "stock_quantity": 60,
    "stock_alert_limit": 10,
    "brand": "Aura Crackers",
    "tag": null,
    "is_featured": true,
    "sort_order": 66
  },
  {
    "name": "Purple Peacock",
    "slug": "purple-peacock",
    "category_slug": "peacock-dance",
    "description": "Purple peacock effect with vibrant display",
    "specifications": {
      "Type": "Peacock",
      "Colour": "Purple"
    },
    "price": 250,
    "pieces": 5,
    "stock_quantity": 60,
    "stock_alert_limit": 10,
    "brand": "Aura Crackers",
    "tag": null,
    "is_featured": true,
    "sort_order": 67
  },
  {
    "name": "Blue Butterfly",
    "slug": "blue-butterfly",
    "category_slug": "fantastic-novelties",
    "description": "Butterfly novelty with colorful festive effects",
    "specifications": {
      "Type": "Novelty",
      "Theme": "Butterfly"
    },
    "price": 120,
    "pieces": 5,
    "stock_quantity": 70,
    "stock_alert_limit": 15,
    "brand": "Aura Crackers",
    "tag": null,
    "is_featured": false,
    "sort_order": 68
  },
  {
    "name": "I Cone",
    "slug": "i-cone",
    "category_slug": "fantastic-novelties",
    "description": "Cone novelty designed for festive enjoyment",
    "specifications": {
      "Type": "Novelty",
      "Format": "Cone"
    },
    "price": 120,
    "pieces": 5,
    "stock_quantity": 70,
    "stock_alert_limit": 15,
    "brand": "Aura Crackers",
    "tag": null,
    "is_featured": false,
    "sort_order": 69
  },
  {
    "name": "Spy Drone",
    "slug": "spy-drone",
    "category_slug": "fantastic-novelties",
    "description": "Drone-themed novelty for exciting celebrations",
    "specifications": {
      "Type": "Novelty",
      "Theme": "Drone"
    },
    "price": 180,
    "pieces": 5,
    "stock_quantity": 60,
    "stock_alert_limit": 10,
    "brand": "Aura Crackers",
    "tag": null,
    "is_featured": true,
    "sort_order": 70
  },
  {
    "name": "Lolly Pop",
    "slug": "lolly-pop",
    "category_slug": "fantastic-novelties",
    "description": "Lolly-themed novelty for festive enjoyment",
    "specifications": {
      "Type": "Novelty",
      "Theme": "Lolly Pop"
    },
    "price": 100,
    "pieces": 5,
    "stock_quantity": 80,
    "stock_alert_limit": 15,
    "brand": "Aura Crackers",
    "tag": null,
    "is_featured": false,
    "sort_order": 71
  },
  {
    "name": "Helicopter",
    "slug": "helicopter",
    "category_slug": "fantastic-novelties",
    "description": "Helicopter-themed novelty for festive celebrations",
    "specifications": {
      "Type": "Novelty",
      "Theme": "Helicopter"
    },
    "price": 150,
    "pieces": 5,
    "stock_quantity": 70,
    "stock_alert_limit": 15,
    "brand": "Aura Crackers",
    "tag": null,
    "is_featured": true,
    "sort_order": 72
  },
  {
    "name": "Mega Siren",
    "slug": "mega-siren",
    "category_slug": "fantastic-novelties",
    "description": "Siren-themed novelty with exciting festive effects",
    "specifications": {
      "Type": "Novelty",
      "Theme": "Siren"
    },
    "price": 160,
    "pieces": 5,
    "stock_quantity": 60,
    "stock_alert_limit": 10,
    "brand": "Aura Crackers",
    "tag": null,
    "is_featured": false,
    "sort_order": 73
  },
  {
    "name": "Magic Pots (Ganga Jamuna)",
    "slug": "magic-pots-ganga-jamuna",
    "category_slug": "fantastic-novelties",
    "description": "Magic pots producing colorful festive effects",
    "specifications": {
      "Type": "Magic Pots",
      "Variant": "Ganga Jamuna"
    },
    "price": 200,
    "pieces": 5,
    "stock_quantity": 60,
    "stock_alert_limit": 10,
    "brand": "Aura Crackers",
    "tag": null,
    "is_featured": true,
    "sort_order": 74
  },
  {
    "name": "Top Spinner (Bambolay)",
    "slug": "top-spinner-bambolay",
    "category_slug": "fantastic-novelties",
    "description": "Top spinner with energetic rotating effects",
    "specifications": {
      "Type": "Spinner",
      "Variant": "Bambolay"
    },
    "price": 150,
    "pieces": 5,
    "stock_quantity": 70,
    "stock_alert_limit": 15,
    "brand": "Aura Crackers",
    "tag": null,
    "is_featured": true,
    "sort_order": 75
  },
  {
    "name": "Money Bank",
    "slug": "money-bank",
    "category_slug": "fantastic-novelties",
    "description": "Money bank novelty for festive celebrations",
    "specifications": {
      "Type": "Novelty",
      "Theme": "Money Bank"
    },
    "price": 150,
    "pieces": 5,
    "stock_quantity": 60,
    "stock_alert_limit": 10,
    "brand": "Aura Crackers",
    "tag": null,
    "is_featured": false,
    "sort_order": 76
  },
  {
    "name": "Thor Car",
    "slug": "thor-car",
    "category_slug": "fantastic-novelties",
    "description": "Thor-themed car novelty for festive fun",
    "specifications": {
      "Type": "Novelty",
      "Theme": "Thor Car"
    },
    "price": 180,
    "pieces": 5,
    "stock_quantity": 60,
    "stock_alert_limit": 10,
    "brand": "Aura Crackers",
    "tag": null,
    "is_featured": true,
    "sort_order": 77
  },
  {
    "name": "Kuli Stick",
    "slug": "kuli-stick",
    "category_slug": "fantastic-novelties",
    "description": "Kuli stick novelty for festive celebrations",
    "specifications": {
      "Type": "Novelty",
      "Format": "Stick"
    },
    "price": 120,
    "pieces": 5,
    "stock_quantity": 70,
    "stock_alert_limit": 15,
    "brand": "Aura Crackers",
    "tag": null,
    "is_featured": false,
    "sort_order": 78
  },
  {
    "name": "Lemon Tree",
    "slug": "lemon-tree",
    "category_slug": "fantastic-novelties",
    "description": "Lemon-themed novelty with colorful festive effects",
    "specifications": {
      "Type": "Novelty",
      "Theme": "Lemon Tree"
    },
    "price": 150,
    "pieces": 5,
    "stock_quantity": 60,
    "stock_alert_limit": 10,
    "brand": "Aura Crackers",
    "tag": null,
    "is_featured": false,
    "sort_order": 79
  },
  {
    "name": "Colour Smoke Cylinder",
    "slug": "colour-smoke-cylinder",
    "category_slug": "fantastic-novelties",
    "description": "Color smoke cylinder producing vibrant smoke",
    "specifications": {
      "Type": "Smoke",
      "Effect": "Colour"
    },
    "price": 180,
    "pieces": 5,
    "stock_quantity": 70,
    "stock_alert_limit": 15,
    "brand": "Aura Crackers",
    "tag": null,
    "is_featured": true,
    "sort_order": 80
  },
  {
    "name": "4\" Tila Fountain",
    "slug": "4-inch-tila-fountain",
    "category_slug": "tun-tun-tun",
    "description": "Four-inch fountain with bright sparkling effects",
    "specifications": {
      "Size": "4\"",
      "Type": "Fountain"
    },
    "price": 150,
    "pieces": 5,
    "stock_quantity": 70,
    "stock_alert_limit": 15,
    "brand": "Aura Crackers",
    "tag": null,
    "is_featured": false,
    "sort_order": 81
  },
  {
    "name": "5\" Water Queen",
    "slug": "5-inch-water-queen",
    "category_slug": "tun-tun-tun",
    "description": "Five-inch fountain creating elegant visual effects",
    "specifications": {
      "Size": "5\"",
      "Type": "Fountain"
    },
    "price": 200,
    "pieces": 5,
    "stock_quantity": 60,
    "stock_alert_limit": 10,
    "brand": "Aura Crackers",
    "tag": null,
    "is_featured": true,
    "sort_order": 82
  },
  {
    "name": "6\" Red Fountain",
    "slug": "6-inch-red-fountain",
    "category_slug": "tun-tun-tun",
    "description": "Six-inch red fountain with vibrant effects",
    "specifications": {
      "Size": "6\"",
      "Colour": "Red"
    },
    "price": 250,
    "pieces": 5,
    "stock_quantity": 60,
    "stock_alert_limit": 10,
    "brand": "Aura Crackers",
    "tag": null,
    "is_featured": true,
    "sort_order": 83
  },
  {
    "name": "7 Shots",
    "slug": "7-shots",
    "category_slug": "midnight-magic-skyshots",
    "description": "Seven-shot aerial display for festive celebrations",
    "specifications": {
      "Shots": "7",
      "Type": "Skyshot"
    },
    "price": 350,
    "pieces": 1,
    "stock_quantity": 50,
    "stock_alert_limit": 10,
    "brand": "Aura Crackers",
    "tag": "Premium",
    "is_featured": true,
    "sort_order": 84
  },
  {
    "name": "1\" Prota Shots (3 in 1)",
    "slug": "1-inch-prota-shots-3-in-1",
    "category_slug": "midnight-magic-skyshots",
    "description": "Three-in-one skyshot with aerial effects",
    "specifications": {
      "Size": "1\"",
      "Pack": "3 in 1"
    },
    "price": 300,
    "pieces": 3,
    "stock_quantity": 50,
    "stock_alert_limit": 10,
    "brand": "Aura Crackers",
    "tag": "Premium",
    "is_featured": false,
    "sort_order": 85
  },
  {
    "name": "1¼\" Chotta Sky Shot",
    "slug": "1-1-4-inch-chotta-sky-shot",
    "category_slug": "midnight-magic-skyshots",
    "description": "Compact skyshot with colorful aerial effects",
    "specifications": {
      "Size": "1¼\"",
      "Type": "Skyshot"
    },
    "price": 280,
    "pieces": 1,
    "stock_quantity": 50,
    "stock_alert_limit": 10,
    "brand": "Aura Crackers",
    "tag": "Premium",
    "is_featured": false,
    "sort_order": 86
  },
  {
    "name": "2\" Rose Sky Shot",
    "slug": "2-inch-rose-sky-shot",
    "category_slug": "midnight-magic-skyshots",
    "description": "Rose-themed skyshot with colorful aerial effects",
    "specifications": {
      "Size": "2\"",
      "Effect": "Rose"
    },
    "price": 400,
    "pieces": 1,
    "stock_quantity": 40,
    "stock_alert_limit": 8,
    "brand": "Aura Crackers",
    "tag": "Premium",
    "is_featured": true,
    "sort_order": 87
  },
  {
    "name": "2\" (3 in 1) Aerial Sky Shot",
    "slug": "2-inch-3-in-1-aerial-sky-shot",
    "category_slug": "midnight-magic-skyshots",
    "description": "Three-in-one aerial skyshot for celebrations",
    "specifications": {
      "Size": "2\"",
      "Pack": "3 in 1"
    },
    "price": 450,
    "pieces": 3,
    "stock_quantity": 40,
    "stock_alert_limit": 8,
    "brand": "Aura Crackers",
    "tag": "Premium",
    "is_featured": true,
    "sort_order": 88
  },
  {
    "name": "3½\" GOT Series Sky Shots",
    "slug": "3-1-2-inch-got-series-sky-shots",
    "category_slug": "midnight-magic-skyshots",
    "description": "Premium GOT skyshot with aerial effects",
    "specifications": {
      "Size": "3½\"",
      "Series": "GOT"
    },
    "price": 600,
    "pieces": 1,
    "stock_quantity": 40,
    "stock_alert_limit": 8,
    "brand": "Aura Crackers",
    "tag": "Premium",
    "is_featured": true,
    "sort_order": 89
  },
  {
    "name": "4\" Tin Sky Shots",
    "slug": "4-inch-tin-sky-shots",
    "category_slug": "midnight-magic-skyshots",
    "description": "Four-inch tin skyshot with colorful effects",
    "specifications": {
      "Size": "4\"",
      "Type": "Tin Skyshot"
    },
    "price": 650,
    "pieces": 1,
    "stock_quantity": 35,
    "stock_alert_limit": 7,
    "brand": "Aura Crackers",
    "tag": "Premium",
    "is_featured": false,
    "sort_order": 90
  },
  {
    "name": "4\" Sky Shot (2 in 1)",
    "slug": "4-inch-sky-shot-2-in-1",
    "category_slug": "midnight-magic-skyshots",
    "description": "Two-in-one skyshot with vibrant aerial effects",
    "specifications": {
      "Size": "4\"",
      "Pack": "2 in 1"
    },
    "price": 700,
    "pieces": 2,
    "stock_quantity": 35,
    "stock_alert_limit": 7,
    "brand": "Aura Crackers",
    "tag": "Premium",
    "is_featured": true,
    "sort_order": 91
  },
  {
    "name": "5\" Sky Shot (2 in 1)",
    "slug": "5-inch-sky-shot-2-in-1",
    "category_slug": "midnight-magic-skyshots",
    "description": "Large two-in-one skyshot for celebrations",
    "specifications": {
      "Size": "5\"",
      "Pack": "2 in 1"
    },
    "price": 850,
    "pieces": 2,
    "stock_quantity": 30,
    "stock_alert_limit": 6,
    "brand": "Aura Crackers",
    "tag": "Premium",
    "is_featured": true,
    "sort_order": 92
  },
  {
    "name": "3½\" Blue Moon Sky Shot",
    "slug": "3-1-2-inch-blue-moon-sky-shot",
    "category_slug": "special-colour-skyshots",
    "description": "Blue moon skyshot with colorful aerial effects",
    "specifications": {
      "Size": "3½\"",
      "Colour": "Blue"
    },
    "price": 550,
    "pieces": 1,
    "stock_quantity": 40,
    "stock_alert_limit": 8,
    "brand": "Aura Crackers",
    "tag": "Special Colors Skyshot",
    "is_featured": true,
    "sort_order": 93
  },
  {
    "name": "3½\" Pink Out Sky Shot",
    "slug": "3-1-2-inch-pink-out-sky-shot",
    "category_slug": "special-colour-skyshots",
    "description": "Pink skyshot creating bright aerial effects",
    "specifications": {
      "Size": "3½\"",
      "Colour": "Pink"
    },
    "price": 550,
    "pieces": 1,
    "stock_quantity": 40,
    "stock_alert_limit": 8,
    "brand": "Aura Crackers",
    "tag": "Special Colors Skyshot",
    "is_featured": true,
    "sort_order": 94
  },
  {
    "name": "3½\" Purple Rain Sky Shot",
    "slug": "3-1-2-inch-purple-rain-sky-shot",
    "category_slug": "special-colour-skyshots",
    "description": "Purple rain skyshot with vibrant effects",
    "specifications": {
      "Size": "3½\"",
      "Colour": "Purple"
    },
    "price": 550,
    "pieces": 1,
    "stock_quantity": 40,
    "stock_alert_limit": 8,
    "brand": "Aura Crackers",
    "tag": "Special Colors Skyshot",
    "is_featured": true,
    "sort_order": 95
  },
  {
    "name": "4\" Tiger Nagasala Falls",
    "slug": "4-inch-tiger-nagasala-falls",
    "category_slug": "special-function-skyshots",
    "description": "Tiger-themed skyshot with waterfall-style effects",
    "specifications": {
      "Size": "4\"",
      "Effect": "Falls"
    },
    "price": 700,
    "pieces": 1,
    "stock_quantity": 35,
    "stock_alert_limit": 7,
    "brand": "Aura Crackers",
    "tag": "Special Function Skyshots",
    "is_featured": true,
    "sort_order": 96
  },
  {
    "name": "4\" Digital Crackling",
    "slug": "4-inch-digital-crackling",
    "category_slug": "special-function-skyshots",
    "description": "Digital crackling skyshot with bright effects",
    "specifications": {
      "Size": "4\"",
      "Effect": "Crackling"
    },
    "price": 700,
    "pieces": 1,
    "stock_quantity": 35,
    "stock_alert_limit": 7,
    "brand": "Aura Crackers",
    "tag": "Special Function Skyshots",
    "is_featured": true,
    "sort_order": 97
  },
  {
    "name": "4\" 12 Step Sky Shot",
    "slug": "4-inch-12-step-sky-shot",
    "category_slug": "special-function-skyshots",
    "description": "Twelve-step skyshot with sequential aerial effects",
    "specifications": {
      "Size": "4\"",
      "Shots": "12"
    },
    "price": 750,
    "pieces": 1,
    "stock_quantity": 35,
    "stock_alert_limit": 7,
    "brand": "Aura Crackers",
    "tag": "Special Function Skyshots",
    "is_featured": true,
    "sort_order": 98
  },
  {
    "name": "4\" Double Ball Sky Shot",
    "slug": "4-inch-double-ball-sky-shot",
    "category_slug": "special-function-skyshots",
    "description": "Double-ball skyshot with colorful aerial effects",
    "specifications": {
      "Size": "4\"",
      "Effect": "Double Ball"
    },
    "price": 750,
    "pieces": 1,
    "stock_quantity": 35,
    "stock_alert_limit": 7,
    "brand": "Aura Crackers",
    "tag": "Special Function Skyshots",
    "is_featured": true,
    "sort_order": 99
  },
  {
    "name": "3½\" Satellite Series (2 in 1)",
    "slug": "3-1-2-inch-satellite-series-2-in-1",
    "category_slug": "premium-plus-brands",
    "description": "Two-in-one satellite skyshot with premium effects",
    "specifications": {
      "Size": "3½\"",
      "Pack": "2 in 1"
    },
    "price": 700,
    "pieces": 2,
    "stock_quantity": 35,
    "stock_alert_limit": 7,
    "brand": "Aura Crackers",
    "tag": "Premium Plus",
    "is_featured": true,
    "sort_order": 100
  },
  {
    "name": "4½\" HD Series (2 in 1)",
    "slug": "4-1-2-inch-hd-series-2-in-1",
    "category_slug": "premium-plus-brands",
    "description": "HD two-in-one skyshot with premium effects",
    "specifications": {
      "Size": "4½\"",
      "Pack": "2 in 1"
    },
    "price": 800,
    "pieces": 2,
    "stock_quantity": 30,
    "stock_alert_limit": 6,
    "brand": "Aura Crackers",
    "tag": "Premium Plus",
    "is_featured": true,
    "sort_order": 101
  },
  {
    "name": "5\" Train Series (2 in 1)",
    "slug": "5-inch-train-series-2-in-1",
    "category_slug": "premium-plus-brands",
    "description": "Train series skyshot with premium effects",
    "specifications": {
      "Size": "5\"",
      "Pack": "2 in 1"
    },
    "price": 900,
    "pieces": 2,
    "stock_quantity": 30,
    "stock_alert_limit": 6,
    "brand": "Aura Crackers",
    "tag": "Premium Plus",
    "is_featured": true,
    "sort_order": 102
  },
  {
    "name": "6\" Plane Series (2 in 1)",
    "slug": "6-inch-plane-series-2-in-1",
    "category_slug": "premium-plus-brands",
    "description": "Plane series skyshot with premium effects",
    "specifications": {
      "Size": "6\"",
      "Pack": "2 in 1"
    },
    "price": 1000,
    "pieces": 2,
    "stock_quantity": 25,
    "stock_alert_limit": 5,
    "brand": "Aura Crackers",
    "tag": "Premium Plus",
    "is_featured": true,
    "sort_order": 103
  },
  {
    "name": "6\" Pink Out",
    "slug": "6-inch-pink-out",
    "category_slug": "special-colour-skyshots",
    "description": "Six-inch pink skyshot with vibrant effects",
    "specifications": {
      "Size": "6\"",
      "Colour": "Pink"
    },
    "price": 850,
    "pieces": 1,
    "stock_quantity": 30,
    "stock_alert_limit": 6,
    "brand": "Aura Crackers",
    "tag": "Special Colors Skyshot",
    "is_featured": true,
    "sort_order": 104
  },
  {
    "name": "6\" Blue Out",
    "slug": "6-inch-blue-out",
    "category_slug": "special-colour-skyshots",
    "description": "Six-inch blue skyshot with vibrant effects",
    "specifications": {
      "Size": "6\"",
      "Colour": "Blue"
    },
    "price": 850,
    "pieces": 1,
    "stock_quantity": 30,
    "stock_alert_limit": 6,
    "brand": "Aura Crackers",
    "tag": "Special Colors Skyshot",
    "is_featured": true,
    "sort_order": 105
  },
  {
    "name": "6\" Purple Out",
    "slug": "6-inch-purple-out",
    "category_slug": "special-colour-skyshots",
    "description": "Six-inch purple skyshot with vibrant effects",
    "specifications": {
      "Size": "6\"",
      "Colour": "Purple"
    },
    "price": 850,
    "pieces": 1,
    "stock_quantity": 30,
    "stock_alert_limit": 6,
    "brand": "Aura Crackers",
    "tag": "Special Colors Skyshot",
    "is_featured": true,
    "sort_order": 106
  },
  {
    "name": "12 Shot – Tricolour Crackling Rider",
    "slug": "12-shot-tricolour-crackling-rider",
    "category_slug": "aerial-multishots",
    "description": "Twelve-shot rider with tricolour crackling effects",
    "specifications": {
      "Shots": "12",
      "Effect": "Tricolour Crackling"
    },
    "price": 600,
    "pieces": 1,
    "stock_quantity": 40,
    "stock_alert_limit": 8,
    "brand": "Aura Crackers",
    "tag": null,
    "is_featured": true,
    "sort_order": 107
  },
  {
    "name": "15 Shot – Smoke Shot",
    "slug": "15-shot-smoke-shot",
    "category_slug": "aerial-multishots",
    "description": "Fifteen-shot display with colorful smoke effects",
    "specifications": {
      "Shots": "15",
      "Effect": "Smoke"
    },
    "price": 650,
    "pieces": 1,
    "stock_quantity": 40,
    "stock_alert_limit": 8,
    "brand": "Aura Crackers",
    "tag": null,
    "is_featured": false,
    "sort_order": 108
  },
  {
    "name": "30 Shot (Multicolour & Crackling)",
    "slug": "30-shot-multicolour-crackling",
    "category_slug": "aerial-multishots",
    "description": "Thirty-shot display with multicolour crackling effects",
    "specifications": {
      "Shots": "30",
      "Effect": "Crackling"
    },
    "price": 900,
    "pieces": 1,
    "stock_quantity": 30,
    "stock_alert_limit": 6,
    "brand": "Aura Crackers",
    "tag": null,
    "is_featured": true,
    "sort_order": 109
  },
  {
    "name": "60 Shot (Multicolour & Crackling)",
    "slug": "60-shot-multicolour-crackling",
    "category_slug": "aerial-multishots",
    "description": "Sixty-shot display with multicolour crackling effects",
    "specifications": {
      "Shots": "60",
      "Effect": "Crackling"
    },
    "price": 1500,
    "pieces": 1,
    "stock_quantity": 25,
    "stock_alert_limit": 5,
    "brand": "Aura Crackers",
    "tag": null,
    "is_featured": true,
    "sort_order": 110
  },
  {
    "name": "120 Shot (Multicolour & Crackling)",
    "slug": "120-shot-multicolour-crackling",
    "category_slug": "aerial-multishots",
    "description": "Hundred-twenty-shot display with colorful effects",
    "specifications": {
      "Shots": "120",
      "Effect": "Crackling"
    },
    "price": 2800,
    "pieces": 1,
    "stock_quantity": 20,
    "stock_alert_limit": 4,
    "brand": "Aura Crackers",
    "tag": null,
    "is_featured": true,
    "sort_order": 111
  },
  {
    "name": "240 Shot (Multicolour & Crackling)",
    "slug": "240-shot-multicolour-crackling",
    "category_slug": "aerial-multishots",
    "description": "Large 240-shot display with colorful effects",
    "specifications": {
      "Shots": "240",
      "Effect": "Crackling"
    },
    "price": 5000,
    "pieces": 1,
    "stock_quantity": 15,
    "stock_alert_limit": 3,
    "brand": "Aura Crackers",
    "tag": null,
    "is_featured": true,
    "sort_order": 112
  },
  {
    "name": "30 Shot Peacock Dance",
    "slug": "30-shot-peacock-dance",
    "category_slug": "elite-setout-fan-cake",
    "description": "Peacock dance display with multiple sparkling effects",
    "specifications": {
      "Shots": "30",
      "Effect": "Peacock"
    },
    "price": 1200,
    "pieces": 1,
    "stock_quantity": 30,
    "stock_alert_limit": 6,
    "brand": "Aura Crackers",
    "tag": "Elite Setout",
    "is_featured": true,
    "sort_order": 113
  },
  {
    "name": "2¼\" – 30 pcs Setout",
    "slug": "2-1-4-inch-30-pcs-setout",
    "category_slug": "elite-setout-fan-cake",
    "description": "Thirty-piece setout with colorful festive effects",
    "specifications": {
      "Size": "2¼\"",
      "Pack": "30 pcs"
    },
    "price": 1500,
    "pieces": 30,
    "stock_quantity": 25,
    "stock_alert_limit": 5,
    "brand": "Aura Crackers",
    "tag": "Elite Setout",
    "is_featured": true,
    "sort_order": 114
  },
  {
    "name": "3½\" – 20 pcs Setout",
    "slug": "3-1-2-inch-20-pcs-setout",
    "category_slug": "elite-setout-fan-cake",
    "description": "Twenty-piece setout with premium visual effects",
    "specifications": {
      "Size": "3½\"",
      "Pack": "20 pcs"
    },
    "price": 1800,
    "pieces": 20,
    "stock_quantity": 20,
    "stock_alert_limit": 4,
    "brand": "Aura Crackers",
    "tag": "Elite Setout",
    "is_featured": true,
    "sort_order": 115
  },
  {
    "name": "10 × 10 (100 Shots)",
    "slug": "10-x-10-100-shots",
    "category_slug": "elite-setout-fan-cake",
    "description": "Hundred-shot setout for large celebrations",
    "specifications": {
      "Format": "10 × 10",
      "Shots": "100"
    },
    "price": 2500,
    "pieces": 100,
    "stock_quantity": 20,
    "stock_alert_limit": 4,
    "brand": "Aura Crackers",
    "tag": "Elite Setout",
    "is_featured": true,
    "sort_order": 116
  },
  {
    "name": "7 cm Electric Sparklers",
    "slug": "7-cm-electric-sparklers",
    "category_slug": "wonder-sparklers",
    "description": "Seven-centimeter sparklers with bright electric effects",
    "specifications": {
      "Size": "7 cm",
      "Type": "Electric"
    },
    "price": 80,
    "pieces": 10,
    "stock_quantity": 150,
    "stock_alert_limit": 30,
    "brand": "Aura Crackers",
    "tag": null,
    "is_featured": false,
    "sort_order": 117
  },
  {
    "name": "7 cm Colour Sparklers",
    "slug": "7-cm-colour-sparklers",
    "category_slug": "wonder-sparklers",
    "description": "Seven-centimeter sparklers producing colorful sparks",
    "specifications": {
      "Size": "7 cm",
      "Type": "Colour"
    },
    "price": 90,
    "pieces": 10,
    "stock_quantity": 150,
    "stock_alert_limit": 30,
    "brand": "Aura Crackers",
    "tag": null,
    "is_featured": false,
    "sort_order": 118
  },
  {
    "name": "7 cm Red Sparklers",
    "slug": "7-cm-red-sparklers",
    "category_slug": "wonder-sparklers",
    "description": "Seven-centimeter sparklers with red sparks",
    "specifications": {
      "Size": "7 cm",
      "Colour": "Red"
    },
    "price": 90,
    "pieces": 10,
    "stock_quantity": 150,
    "stock_alert_limit": 30,
    "brand": "Aura Crackers",
    "tag": null,
    "is_featured": false,
    "sort_order": 119
  },
  {
    "name": "7 cm Green Sparklers",
    "slug": "7-cm-green-sparklers",
    "category_slug": "wonder-sparklers",
    "description": "Seven-centimeter sparklers with green sparks",
    "specifications": {
      "Size": "7 cm",
      "Colour": "Green"
    },
    "price": 90,
    "pieces": 10,
    "stock_quantity": 150,
    "stock_alert_limit": 30,
    "brand": "Aura Crackers",
    "tag": null,
    "is_featured": false,
    "sort_order": 120
  },
  {
    "name": "10 cm Electric Sparklers",
    "slug": "10-cm-electric-sparklers",
    "category_slug": "wonder-sparklers",
    "description": "Ten-centimeter sparklers with bright electric effects",
    "specifications": {
      "Size": "10 cm",
      "Type": "Electric"
    },
    "price": 100,
    "pieces": 10,
    "stock_quantity": 150,
    "stock_alert_limit": 30,
    "brand": "Aura Crackers",
    "tag": null,
    "is_featured": false,
    "sort_order": 121
  },
  {
    "name": "10 cm Colour Sparklers",
    "slug": "10-cm-colour-sparklers",
    "category_slug": "wonder-sparklers",
    "description": "Ten-centimeter sparklers producing colorful sparks",
    "specifications": {
      "Size": "10 cm",
      "Type": "Colour"
    },
    "price": 110,
    "pieces": 10,
    "stock_quantity": 150,
    "stock_alert_limit": 30,
    "brand": "Aura Crackers",
    "tag": null,
    "is_featured": false,
    "sort_order": 122
  },
  {
    "name": "10 cm Red Sparklers",
    "slug": "10-cm-red-sparklers",
    "category_slug": "wonder-sparklers",
    "description": "Ten-centimeter sparklers with bright red sparks",
    "specifications": {
      "Size": "10 cm",
      "Colour": "Red"
    },
    "price": 110,
    "pieces": 10,
    "stock_quantity": 150,
    "stock_alert_limit": 30,
    "brand": "Aura Crackers",
    "tag": null,
    "is_featured": false,
    "sort_order": 123
  },
  {
    "name": "10 cm Green Sparklers",
    "slug": "10-cm-green-sparklers",
    "category_slug": "wonder-sparklers",
    "description": "Ten-centimeter sparklers with bright green sparks",
    "specifications": {
      "Size": "10 cm",
      "Colour": "Green"
    },
    "price": 110,
    "pieces": 10,
    "stock_quantity": 150,
    "stock_alert_limit": 30,
    "brand": "Aura Crackers",
    "tag": null,
    "is_featured": false,
    "sort_order": 124
  },
  {
    "name": "12 cm Electric Sparklers",
    "slug": "12-cm-electric-sparklers",
    "category_slug": "wonder-sparklers",
    "description": "Twelve-centimeter sparklers with electric sparkling effects",
    "specifications": {
      "Size": "12 cm",
      "Type": "Electric"
    },
    "price": 120,
    "pieces": 10,
    "stock_quantity": 120,
    "stock_alert_limit": 25,
    "brand": "Aura Crackers",
    "tag": null,
    "is_featured": false,
    "sort_order": 125
  },
  {
    "name": "12 cm Colour Sparklers",
    "slug": "12-cm-colour-sparklers",
    "category_slug": "wonder-sparklers",
    "description": "Twelve-centimeter sparklers with colorful sparkling effects",
    "specifications": {
      "Size": "12 cm",
      "Type": "Colour"
    },
    "price": 130,
    "pieces": 10,
    "stock_quantity": 120,
    "stock_alert_limit": 25,
    "brand": "Aura Crackers",
    "tag": null,
    "is_featured": false,
    "sort_order": 126
  },
  {
    "name": "12 cm Red Sparklers",
    "slug": "12-cm-red-sparklers",
    "category_slug": "wonder-sparklers",
    "description": "Twelve-centimeter sparklers producing red sparks",
    "specifications": {
      "Size": "12 cm",
      "Colour": "Red"
    },
    "price": 130,
    "pieces": 10,
    "stock_quantity": 120,
    "stock_alert_limit": 25,
    "brand": "Aura Crackers",
    "tag": null,
    "is_featured": false,
    "sort_order": 127
  },
  {
    "name": "12 cm Green Sparklers",
    "slug": "12-cm-green-sparklers",
    "category_slug": "wonder-sparklers",
    "description": "Twelve-centimeter sparklers producing green sparks",
    "specifications": {
      "Size": "12 cm",
      "Colour": "Green"
    },
    "price": 130,
    "pieces": 10,
    "stock_quantity": 120,
    "stock_alert_limit": 25,
    "brand": "Aura Crackers",
    "tag": null,
    "is_featured": false,
    "sort_order": 128
  },
  {
    "name": "15 cm Electric Sparklers",
    "slug": "15-cm-electric-sparklers",
    "category_slug": "wonder-sparklers",
    "description": "Fifteen-centimeter sparklers with electric effects",
    "specifications": {
      "Size": "15 cm",
      "Type": "Electric"
    },
    "price": 150,
    "pieces": 10,
    "stock_quantity": 100,
    "stock_alert_limit": 20,
    "brand": "Aura Crackers",
    "tag": null,
    "is_featured": false,
    "sort_order": 129
  },
  {
    "name": "15 cm Colour Sparklers",
    "slug": "15-cm-colour-sparklers",
    "category_slug": "wonder-sparklers",
    "description": "Fifteen-centimeter sparklers with colorful effects",
    "specifications": {
      "Size": "15 cm",
      "Type": "Colour"
    },
    "price": 160,
    "pieces": 10,
    "stock_quantity": 100,
    "stock_alert_limit": 20,
    "brand": "Aura Crackers",
    "tag": null,
    "is_featured": false,
    "sort_order": 130
  },
  {
    "name": "15 cm Red Sparklers",
    "slug": "15-cm-red-sparklers",
    "category_slug": "wonder-sparklers",
    "description": "Fifteen-centimeter sparklers producing red sparks",
    "specifications": {
      "Size": "15 cm",
      "Colour": "Red"
    },
    "price": 160,
    "pieces": 10,
    "stock_quantity": 100,
    "stock_alert_limit": 20,
    "brand": "Aura Crackers",
    "tag": null,
    "is_featured": false,
    "sort_order": 131
  },
  {
    "name": "15 cm Green Sparklers",
    "slug": "15-cm-green-sparklers",
    "category_slug": "wonder-sparklers",
    "description": "Fifteen-centimeter sparklers producing green sparks",
    "specifications": {
      "Size": "15 cm",
      "Colour": "Green"
    },
    "price": 160,
    "pieces": 10,
    "stock_quantity": 100,
    "stock_alert_limit": 20,
    "brand": "Aura Crackers",
    "tag": null,
    "is_featured": false,
    "sort_order": 132
  },
  {
    "name": "30 cm Electric Sparklers",
    "slug": "30-cm-electric-sparklers",
    "category_slug": "wonder-sparklers",
    "description": "Thirty-centimeter sparklers with electric sparkling effects",
    "specifications": {
      "Size": "30 cm",
      "Type": "Electric"
    },
    "price": 220,
    "pieces": 10,
    "stock_quantity": 80,
    "stock_alert_limit": 15,
    "brand": "Aura Crackers",
    "tag": null,
    "is_featured": true,
    "sort_order": 133
  },
  {
    "name": "30 cm Colour Sparklers",
    "slug": "30-cm-colour-sparklers",
    "category_slug": "wonder-sparklers",
    "description": "Thirty-centimeter sparklers with colorful effects",
    "specifications": {
      "Size": "30 cm",
      "Type": "Colour"
    },
    "price": 230,
    "pieces": 10,
    "stock_quantity": 80,
    "stock_alert_limit": 15,
    "brand": "Aura Crackers",
    "tag": null,
    "is_featured": true,
    "sort_order": 134
  },
  {
    "name": "30 cm Red Sparklers",
    "slug": "30-cm-red-sparklers",
    "category_slug": "wonder-sparklers",
    "description": "Thirty-centimeter sparklers producing red sparks",
    "specifications": {
      "Size": "30 cm",
      "Colour": "Red"
    },
    "price": 230,
    "pieces": 10,
    "stock_quantity": 80,
    "stock_alert_limit": 15,
    "brand": "Aura Crackers",
    "tag": null,
    "is_featured": false,
    "sort_order": 135
  },
  {
    "name": "30 cm Green Sparklers",
    "slug": "30-cm-green-sparklers",
    "category_slug": "wonder-sparklers",
    "description": "Thirty-centimeter sparklers producing green sparks",
    "specifications": {
      "Size": "30 cm",
      "Colour": "Green"
    },
    "price": 230,
    "pieces": 10,
    "stock_quantity": 80,
    "stock_alert_limit": 15,
    "brand": "Aura Crackers",
    "tag": null,
    "is_featured": false,
    "sort_order": 136
  },
  {
    "name": "50 cm Electric Sparklers",
    "slug": "50-cm-electric-sparklers",
    "category_slug": "wonder-sparklers",
    "description": "Long sparklers with bright electric effects",
    "specifications": {
      "Size": "50 cm",
      "Type": "Electric"
    },
    "price": 300,
    "pieces": 10,
    "stock_quantity": 60,
    "stock_alert_limit": 10,
    "brand": "Aura Crackers",
    "tag": null,
    "is_featured": true,
    "sort_order": 137
  },
  {
    "name": "50 cm Colour Sparklers",
    "slug": "50-cm-colour-sparklers",
    "category_slug": "wonder-sparklers",
    "description": "Long sparklers producing colorful sparkling effects",
    "specifications": {
      "Size": "50 cm",
      "Type": "Colour"
    },
    "price": 320,
    "pieces": 10,
    "stock_quantity": 60,
    "stock_alert_limit": 10,
    "brand": "Aura Crackers",
    "tag": null,
    "is_featured": true,
    "sort_order": 138
  },
  {
    "name": "Jio 50 (10 in 1)",
    "slug": "jio-50-10-in-1",
    "category_slug": "colour-matches",
    "description": "Ten-in-one colour match pack for celebrations",
    "specifications": {
      "Pack": "10 in 1",
      "Type": "Colour Match"
    },
    "price": 100,
    "pieces": 10,
    "stock_quantity": 100,
    "stock_alert_limit": 20,
    "brand": "Aura Crackers",
    "tag": null,
    "is_featured": false,
    "sort_order": 139
  },
  {
    "name": "Dot (10 in 1)",
    "slug": "dot-10-in-1",
    "category_slug": "colour-matches",
    "description": "Ten-in-one dot match pack for celebrations",
    "specifications": {
      "Pack": "10 in 1",
      "Type": "Match"
    },
    "price": 100,
    "pieces": 10,
    "stock_quantity": 100,
    "stock_alert_limit": 20,
    "brand": "Aura Crackers",
    "tag": null,
    "is_featured": false,
    "sort_order": 140
  },
  {
    "name": "28 Chorsa",
    "slug": "28-chorsa",
    "category_slug": "thunder",
    "description": "Chorsa thunder product for festive celebrations",
    "specifications": {
      "Type": "Thunder",
      "Variant": "28"
    },
    "price": 180,
    "pieces": 10,
    "stock_quantity": 80,
    "stock_alert_limit": 15,
    "brand": "Aura Crackers",
    "tag": null,
    "is_featured": false,
    "sort_order": 141
  },
  {
    "name": "56 Giant",
    "slug": "56-giant",
    "category_slug": "thunder",
    "description": "Giant thunder product for festive celebrations",
    "specifications": {
      "Type": "Thunder",
      "Variant": "56"
    },
    "price": 280,
    "pieces": 10,
    "stock_quantity": 70,
    "stock_alert_limit": 15,
    "brand": "Aura Crackers",
    "tag": null,
    "is_featured": true,
    "sort_order": 142
  },
  {
    "name": "100 Thunder",
    "slug": "100-thunder",
    "category_slug": "thunder",
    "description": "Hundred-count thunder pack for festive celebrations",
    "specifications": {
      "Count": "100",
      "Type": "Thunder"
    },
    "price": 450,
    "pieces": 100,
    "stock_quantity": 60,
    "stock_alert_limit": 10,
    "brand": "Aura Crackers",
    "tag": null,
    "is_featured": true,
    "sort_order": 143
  },
  {
    "name": "1K Thunder",
    "slug": "1k-thunder",
    "category_slug": "thunder",
    "description": "Thousand-count thunder pack for celebrations",
    "specifications": {
      "Count": "1K",
      "Type": "Thunder"
    },
    "price": 800,
    "pieces": 1000,
    "stock_quantity": 40,
    "stock_alert_limit": 8,
    "brand": "Aura Crackers",
    "tag": null,
    "is_featured": true,
    "sort_order": 144
  },
  {
    "name": "2K Thunder",
    "slug": "2k-thunder",
    "category_slug": "thunder",
    "description": "Two-thousand-count thunder pack for celebrations",
    "specifications": {
      "Count": "2K",
      "Type": "Thunder"
    },
    "price": 1500,
    "pieces": 2000,
    "stock_quantity": 30,
    "stock_alert_limit": 6,
    "brand": "Aura Crackers",
    "tag": null,
    "is_featured": true,
    "sort_order": 145
  },
  {
    "name": "5K Thunder",
    "slug": "5k-thunder",
    "category_slug": "thunder",
    "description": "Five-thousand-count thunder pack for celebrations",
    "specifications": {
      "Count": "5K",
      "Type": "Thunder"
    },
    "price": 3200,
    "pieces": 5000,
    "stock_quantity": 20,
    "stock_alert_limit": 4,
    "brand": "Aura Crackers",
    "tag": null,
    "is_featured": true,
    "sort_order": 146
  },
  {
    "name": "10K Thunder",
    "slug": "10k-thunder",
    "category_slug": "thunder",
    "description": "Ten-thousand-count thunder pack for celebrations",
    "specifications": {
      "Count": "10K",
      "Type": "Thunder"
    },
    "price": 6000,
    "pieces": 10000,
    "stock_quantity": 15,
    "stock_alert_limit": 3,
    "brand": "Aura Crackers",
    "tag": null,
    "is_featured": true,
    "sort_order": 147
  }
]
