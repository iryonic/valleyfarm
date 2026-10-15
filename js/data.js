/**
 * Valley Farm - Central Data Store
 * Single source of truth for categories, products, reels, testimonials, and farm facts.
 */

window.VALLEY_DATA = {
  config: {
    brandName: "Valley Farm",
    tagline: "Fresh From Our Farm to Your Home",
    currency: "₹",
    freeDeliveryThreshold: 499,
    standardDeliveryFee: 40,
    supportPhone: "+91 98765 43210",
    supportEmail: "hello@valleyfarmfresh.in",
    operatingHours: "6:00 AM - 9:00 PM Daily",
    announcements: [
      "🌿 Farm-Fresh Harvest: Same-Day Delivery on Orders Before 11 AM",
      "🥚 Fresh Eggs Laid This Morning • 100% Naturally Sourced & Traceable",
      "🍯 Raw Wildflower Honey In Stock • Cold-Extracted & Unfiltered",
      "🚚 Free Farm Express Delivery on All Orders Above ₹499"
    ]
  },

  categories: [
    {
      id: "eggs",
      name: "Fresh Eggs",
      slug: "eggs",
      image: "assets/images/categories/cat-eggs.jpg",
      itemCount: 4,
      desc: "Naturally laid by free-roaming hens, packed within 12 hours of harvest."
    },
    {
      id: "chicken",
      name: "Fresh Chicken",
      slug: "chicken",
      image: "assets/images/categories/cat-chicken.jpg",
      itemCount: 4,
      desc: "Tender, hygienically dressed poultry cuts chilled to perfection."
    },
    {
      id: "chicks",
      name: "Day-Old Chicks",
      slug: "chicks",
      image: "assets/images/categories/cat-chicks.jpg",
      itemCount: 2,
      desc: "Robust, vaccinated poultry hatchlings with superior flock genetics."
    },
    {
      id: "honey",
      name: "Pure Honey",
      slug: "honey",
      image: "assets/images/categories/cat-honey.jpg",
      itemCount: 3,
      desc: "Unprocessed, single-origin raw honey directly harvested from farm hives."
    },
    {
      id: "trays",
      name: "Egg Trays",
      slug: "trays",
      image: "assets/images/categories/cat-trays.jpg",
      itemCount: 2,
      desc: "Bulk wholesale pulp trays with custom shock-absorbing compartments."
    },
    {
      id: "combos",
      name: "Farm Combos",
      slug: "combos",
      image: "assets/images/categories/cat-combos.jpg",
      itemCount: 3,
      desc: "Curated farm-fresh pantry bundles offering great value and freshness."
    }
  ],

  products: [
    {
      id: "vf-prod-01",
      name: "Farm Fresh Eggs — 12 Pack",
      category: "eggs",
      categoryName: "Fresh Eggs",
      badge: "Harvested Today",
      shortDesc: "Nutritious brown table eggs laid in natural sunlight with rich golden yolks.",
      fullDesc: "Our flagship farm eggs are collected every morning at dawn from well-fed hens roaming in humane, open-air coops. High in bioavailable protein, lutein, and omega-3 fatty acids, each egg features a thick, sturdy shell and a deep amber yolk that elevates your breakfasts, scrambles, and bakes.",
      image: "assets/images/products/eggs-12.jpg",
      basePrice: 139,
      originalPrice: 165,
      rating: 4.9,
      reviewsCount: 342,
      unit: "12 pieces (600g approx)",
      variants: [
        { id: "vf-01-v1", name: "12 Pack", price: 139, originalPrice: 165, unit: "12 Eggs" },
        { id: "vf-01-v2", name: "24 Pack (2x12)", price: 265, originalPrice: 320, unit: "24 Eggs" }
      ],
      highlights: [
        "Collected within 12 hours of delivery",
        "Deep golden natural yolk color",
        "High in bioavailable Protein (6.3g/egg)",
        "Zero chemical washes or coatings"
      ],
      storageTip: "Refrigerate at 4°C with pointed end down to maintain maximum yolk freshness."
    },
    {
      id: "vf-prod-02",
      name: "Farm Fresh Eggs — 30 Pack Tray",
      category: "trays",
      categoryName: "Egg Trays",
      badge: "Best Value",
      shortDesc: "Complete monthly pantry tray of 30 graded brown eggs in eco-friendly molded pulp.",
      fullDesc: "Designed for active families, bakers, and fitness enthusiasts. 30 uniformly graded brown farm eggs held safely in shock-dampening recyclable pulp trays. Never stored in cold storage warehouse limbo—shipped fresh straight from the valley nesting house.",
      image: "assets/images/products/eggs-tray-30.jpg",
      basePrice: 319,
      originalPrice: 375,
      rating: 4.9,
      reviewsCount: 512,
      unit: "30 pieces (1.5kg approx)",
      variants: [
        { id: "vf-02-v1", name: "30 Pack Tray", price: 319, originalPrice: 375, unit: "30 Eggs" },
        { id: "vf-02-v2", name: "60 Pack (2 Trays)", price: 615, originalPrice: 750, unit: "60 Eggs" }
      ],
      highlights: [
        "Pulp molded tray prevents any micro-cracks",
        "Guaranteed clean, washed shells",
        "Average egg weight: 52g - 58g",
        "Ideal for fitness meal preparation"
      ],
      storageTip: "Keep in the pantry or refrigerator in the original breathable pulp tray."
    },
    {
      id: "vf-prod-03",
      name: "Country Free-Range Eggs — 12 Pack",
      category: "eggs",
      categoryName: "Fresh Eggs",
      badge: "Free Range",
      shortDesc: "Pasture-raised desi country eggs with distinctive rustic shells and concentrated flavor.",
      fullDesc: "Laid by native breed country hens foraging freely on outdoor green pasture, seeds, and farm insects. These country eggs deliver a richer taste profile, thicker egg whites, and naturally robust nutrients prized in traditional culinary cooking.",
      image: "assets/images/products/country-eggs-12.jpg",
      basePrice: 189,
      originalPrice: 220,
      rating: 4.8,
      reviewsCount: 198,
      unit: "12 pieces (Pasture Laid)",
      variants: [
        { id: "vf-03-v1", name: "12 Pack", price: 189, originalPrice: 220, unit: "12 Eggs" },
        { id: "vf-03-v2", name: "24 Pack", price: 359, originalPrice: 420, unit: "24 Eggs" }
      ],
      highlights: [
        "Desi native breed hen harvest",
        "Foraged on herbal vegetation & seeds",
        "Rich, nutty, aromatic flavor",
        "Natural shell color variations"
      ],
      storageTip: "Store in a cool dry pantry or chill below 8°C."
    },
    {
      id: "vf-prod-04",
      name: "Fresh Chicken Curry Cut — 500g",
      category: "chicken",
      categoryName: "Fresh Chicken",
      badge: "Farm Cleaned",
      shortDesc: "Tender skinless bone-in chicken cuts balanced with breast, thighs, and drumsticks.",
      fullDesc: "Pre-cut, trimmed, and washed with purified RO water. Each pack contains 12-14 neat bite-sized pieces with an even distribution of juicy bone-in meat, succulent thigh chunks, and lean breast pieces. Maintained between 0°C to 4°C to retain natural moisture and tenderness.",
      image: "assets/images/products/chicken-curry-cut.jpg",
      basePrice: 179,
      originalPrice: 215,
      rating: 4.9,
      reviewsCount: 426,
      unit: "500g net weight (Bone-in)",
      variants: [
        { id: "vf-04-v1", name: "500g Pack", price: 179, originalPrice: 215, unit: "500g (12-14 pcs)" },
        { id: "vf-04-v2", name: "1kg Value Pack", price: 339, originalPrice: 410, unit: "1kg (24-28 pcs)" }
      ],
      highlights: [
        "Hygienically hand-trimmed & cleaned",
        "Chilled, never frozen to retain juices",
        "Naturally raised poultry feed",
        "Balanced blend of dark & white meat"
      ],
      storageTip: "Cook immediately or keep frozen at -18°C for up to 3 days."
    },
    {
      id: "vf-prod-05",
      name: "Fresh Boneless Chicken Breast — 500g",
      category: "chicken",
      categoryName: "Fresh Chicken",
      badge: "High Protein",
      shortDesc: "Ultra-lean, tender chicken breast fillets hand-trimmed with zero gristle or excess fat.",
      fullDesc: "Top-tier lean poultry cuts ideal for grilling, stir-fries, slow-poaching, and meal prep. Supplying over 26g of pure protein per 100g, our chicken breasts are tenderized naturally through humane handling and strict cold-chain management.",
      image: "assets/images/products/chicken-breast.jpg",
      basePrice: 229,
      originalPrice: 270,
      rating: 4.9,
      reviewsCount: 310,
      unit: "500g net weight (Boneless)",
      variants: [
        { id: "vf-05-v1", name: "500g (2-3 fillets)", price: 229, originalPrice: 270, unit: "500g" },
        { id: "vf-05-v2", name: "1kg (4-6 fillets)", price: 435, originalPrice: 520, unit: "1kg" }
      ],
      highlights: [
        "99% fat-trimmed boneless fillets",
        "26g+ Protein per 100g serving",
        "Juicy texture that holds marinades",
        "Vacuum sealed for freshness"
      ],
      storageTip: "Keep refrigerated at 0-4°C and consume within 48 hours of delivery."
    },
    {
      id: "vf-prod-06",
      name: "Day-Old Chicks — Pack of 10",
      category: "chicks",
      categoryName: "Day-Old Chicks",
      badge: "Vaccinated & Active",
      shortDesc: "Healthy, vigorous day-old chicks bred from heritage dual-purpose poultry lines.",
      fullDesc: "Sourced from our climate-controlled farm hatchery under veterinary supervision. Each batch of day-old chicks is vaccinated against Marek's disease and Newcastle disease, temperature-stabilized in ventilated safety brooder travel boxes, and ready for rearing.",
      image: "assets/images/products/day-old-chicks.jpg",
      basePrice: 480,
      originalPrice: 550,
      rating: 4.8,
      reviewsCount: 88,
      unit: "Pack of 10 healthy chicks",
      variants: [
        { id: "vf-06-v1", name: "Pack of 10", price: 480, originalPrice: 550, unit: "10 Chicks" },
        { id: "vf-06-v2", name: "Pack of 25 (Flock Starter)", price: 1120, originalPrice: 1300, unit: "25 Chicks" }
      ],
      highlights: [
        "Primary Marek's & ND vaccinations done",
        "High survival rate & robust flock vitality",
        "Dual-purpose egg & meat genetic lines",
        "Care guide included with every carton"
      ],
      storageTip: "Prepare a warm brooder with 32°C heat lamp, clean water and chick starter mash upon arrival."
    },
    {
      id: "vf-prod-07",
      name: "Pure Farm Wildflower Honey — 500g",
      category: "honey",
      categoryName: "Pure Honey",
      badge: "100% Raw & Pure",
      shortDesc: "Golden, unpasteurized honey harvested from our seasonal valley clover and mustard apiary.",
      fullDesc: "Cold-extracted through centrifugal force without thermal treatment, preserving natural pollen grains, beneficial live enzymes, and rich aromatic notes. It has a smooth amber consistency, subtle floral aftertaste, and zero adulterants, sugar syrups, or artificial coloring.",
      image: "assets/images/products/pure-farm-honey.jpg",
      basePrice: 389,
      originalPrice: 450,
      rating: 5.0,
      reviewsCount: 274,
      unit: "500g glass jar",
      variants: [
        { id: "vf-07-v1", name: "250g Jar", price: 219, originalPrice: 260, unit: "250g" },
        { id: "vf-07-v2", name: "500g Jar", price: 389, originalPrice: 450, unit: "500g" },
        { id: "vf-07-v3", name: "1kg Family Jar", price: 720, originalPrice: 850, unit: "1kg" }
      ],
      highlights: [
        "Single-source valley farm apiary",
        "Never heated above hive temperature (35°C)",
        "Retains bioactive propolis & bee pollen",
        "Naturally crystallized over time as proof of purity"
      ],
      storageTip: "Store at ambient room temperature in dry conditions. Do not refrigerate."
    },
    {
      id: "vf-prod-08",
      name: "Eggs & Honey Morning Combo",
      category: "combos",
      categoryName: "Farm Combos",
      badge: "Breakfast Saver",
      shortDesc: "Complete wholesome breakfast bundle: 12 Farm Fresh Eggs + 250g Pure Raw Honey Jar.",
      fullDesc: "Start your morning with pure farm energy. Pair two fluffy scrambled eggs with a drizzle of raw golden honey on warm toast or herbal tea. Bundled at an exclusive promotional price for a wholesome kitchen staple.",
      image: "assets/images/products/farm-combo.jpg",
      basePrice: 329,
      originalPrice: 410,
      rating: 4.9,
      reviewsCount: 165,
      unit: "12 Eggs + 250g Honey",
      variants: [
        { id: "vf-08-v1", name: "Morning Essentials", price: 329, originalPrice: 410, unit: "12 Eggs + 250g Honey" },
        { id: "vf-08-v2", name: "Family Breakfast Pack", price: 549, originalPrice: 680, unit: "30 Eggs + 500g Honey" }
      ],
      highlights: [
        "Save 20% compared to buying individually",
        "Includes wooden honey dipper keepsake",
        "100% natural, farm-to-table breakfast fuel",
        "Delivered together in a protected craft carton"
      ],
      storageTip: "Store honey at room temperature and eggs in the refrigerator."
    }
  ],

  reels: [
    {
      id: "reel-01",
      title: "Morning Dawn Egg Harvest",
      caption: "Collecting fresh eggs in the morning dew at 6 AM.",
      duration: "0:28",
      poster: "assets/images/reels/reel-1.jpg",
      productId: "vf-prod-01",
      views: "14.2k",
      likes: "1.8k"
    },
    {
      id: "reel-02",
      title: "Nursery Brooder Feeding",
      caption: "Watch our day-old chicks chirp and feed in warm straw.",
      duration: "0:34",
      poster: "assets/images/reels/reel-2.jpg",
      productId: "vf-prod-06",
      views: "22.6k",
      likes: "3.4k"
    },
    {
      id: "reel-03",
      title: "Liquid Gold Cold Extract",
      caption: "Drizzling raw wildflower honey from our farm apiary.",
      duration: "0:19",
      poster: "assets/images/reels/reel-3.jpg",
      productId: "vf-prod-07",
      views: "18.9k",
      likes: "2.1k"
    },
    {
      id: "reel-04",
      title: "Chef's Farm Kitchen Skillet",
      caption: "Sizzling fresh rosemary chicken curry cut on cast iron.",
      duration: "0:42",
      poster: "assets/images/reels/reel-4.jpg",
      productId: "vf-prod-04",
      views: "31.1k",
      likes: "4.7k"
    }
  ],

  farmFacts: [
    {
      id: "fact-01",
      title: "Good Food Starts at the Farm",
      statement: "Every egg is laid in natural daylight, nested on soft pine bedding, and packed within 12 hours so your table tastes morning freshness.",
      illustration: "assets/images/illustrations/egg-basket.svg",
      tag: "Nest to Table"
    },
    {
      id: "fact-02",
      title: "Little Chicks, Big Beginnings",
      statement: "Our hatchlings thrive under nurturing climate brooders, fed certified non-GMO mash with spacious bedding and zero industrial crowding.",
      illustration: "assets/images/illustrations/hen-chick.svg",
      tag: "Flock Health"
    },
    {
      id: "fact-03",
      title: "A Sweeter Side of the Farm",
      statement: "Our apiary bees forage over seasonal valley blooms. We harvest raw, unfiltered honey in micro-batches to preserve every speck of pollen.",
      illustration: "assets/images/illustrations/honey-bees.svg",
      tag: "Raw & Pure"
    },
    {
      id: "fact-04",
      title: "Clean Pastures & Sunlit Living",
      statement: "Fresh well water, mountain breeze, and transparent husbandry standards. Know exactly where your food comes from, every single day.",
      illustration: "assets/images/illustrations/green-fields.svg",
      tag: "Open Pastures"
    }
  ],

  trustIndicators: [
    {
      id: "trust-01",
      title: "Farm-Fresh Harvest",
      desc: "Packed within 12 hours of harvest for peak culinary flavor & nutrition.",
      icon: "assets/icons/trust-fresh.svg"
    },
    {
      id: "trust-02",
      title: "Carefully Packed",
      desc: "Custom shock-absorbing pulp cartons & insulated temperature packaging.",
      icon: "assets/icons/trust-pack.svg"
    },
    {
      id: "trust-03",
      title: "Quality Handling",
      desc: "Strict hygiene protocols from our nesting houses straight to your door.",
      icon: "assets/icons/trust-quality.svg"
    },
    {
      id: "trust-04",
      title: "Clear Information",
      desc: "Transparent origin, batch harvest date, and zero hidden additives.",
      icon: "assets/icons/trust-transparent.svg"
    },
    {
      id: "trust-05",
      title: "Convenient Shopping",
      desc: "Morning doorstep delivery with reliable tracking and live support.",
      icon: "assets/icons/trust-delivery.svg"
    }
  ],

  testimonials: [
    {
      id: "test-01",
      name: "Radhika Sharma",
      location: "Bangalore",
      avatarInitial: "RS",
      rating: 5,
      productTag: "Farm Fresh Eggs — 30 Pack",
      quote: "The deep golden yolks and thick shells are unlike anything in the supermarket. Poached eggs hold their shape effortlessly. We order the 30-egg tray every two weeks!"
    },
    {
      id: "test-02",
      name: "Chef Amitav Roy",
      location: "Pune",
      avatarInitial: "AR",
      rating: 5,
      productTag: "Fresh Chicken Curry Cut",
      quote: "As a culinary enthusiast, clean meat is non-negotiable. Valley Farm's chicken curry cut is cleanly trimmed, zero odor, remarkably tender and cooks to perfection."
    },
    {
      id: "test-03",
      name: "Pooja & Karthik",
      location: "Hyderabad",
      avatarInitial: "PK",
      rating: 5,
      productTag: "Pure Wildflower Honey",
      quote: "The honey has that genuine floral aroma and subtle crystallization that proves it is truly raw and unadulterated. My kids love it on warm toast every morning."
    },
    {
      id: "test-04",
      name: "Col. Sanjeev Varma",
      location: "Dehradun",
      avatarInitial: "SV",
      rating: 5,
      productTag: "Day-Old Chicks (10 Pack)",
      quote: "Received the chicks in exceptional health and vigor. They were active, chirping, and adapted to our brooder instantly. Exceptional breeding standards!"
    }
  ],

  // Helper lookups
  getProductById: function(id) {
    return this.products.find(function(p) { return p.id === id; });
  },

  getProductsByCategory: function(categorySlug) {
    if (!categorySlug || categorySlug === "all") {
      return this.products;
    }
    return this.products.filter(function(p) { return p.category === categorySlug; });
  }
};
