export const categories = [
  { id: "all", name: "All Skincare" },
  { id: "sunscreen", name: "Sunscreen" },
  { id: "moisturizer", name: "Moisturizer" }
];

export const products = [
  {
    id: 1,
    name: "Dionara Invisible Water-Glow Sunscreen SPF 50+ PA++++",
    slug: "invisible-water-glow-sunscreen-spf50",
    category: "sunscreen",
    categoryName: "Sunscreen",
    subtitle: "Ultra-Lightweight Daily Sunscreen with Zero White Cast & Niacinamide",
    volume: "50 ml / 1.7 fl. oz.",
    price: 599,
    oldPrice: 849,
    rating: 4.9,
    reviews: 148,
    badge: "SPF 50+ PA++++",
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&auto=format&fit=crop&q=80"
    ],
    description: "An ultra-lightweight, fast-absorbing fluid sunscreen designed for daily Indian weather. Formulated with cutting-edge UV filters, Niacinamide, and Hyaluronic Acid to provide broad-spectrum UVA & UVB protection without greasiness, clogging pores, or leaving any white cast.",
    keyBenefits: [
      "Broad Spectrum SPF 50+ PA++++ Maximum Protection",
      "Ultra-Light Watery Fluid Texture — Zero White Cast",
      "Infused with 2% Niacinamide to brighten and prevent sunspots",
      "Sweat & Water Resistant for up to 80 minutes",
      "Non-Comedogenic & Safe for Acne-Prone & Sensitive Skin"
    ],
    details: [
      "Key Actives: Hyaluronic Acid, 2% Niacinamide, Centella Asiatica, Vitamin E",
      "Finish: Natural Dewy, Weightless & Non-Sticky",
      "Skin Type: Suitable for All Skin Types (Dry, Oily, Sensitive & Combination)",
      "Safety: Dermatologically Tested, Paraben Free, Cruelty Free, Reef Safe",
      "Application: Apply liberally 15 minutes before sun exposure; reapply every 2-3 hours"
    ],
    inStock: true,
    stockCount: 45,
    featured: true
  },
  {
    id: 2,
    name: "Dionara Deep Ceramide Barrier Glow Moisturizer",
    slug: "deep-ceramide-barrier-glow-moisturizer",
    category: "moisturizer",
    categoryName: "Moisturizer",
    subtitle: "72-Hour Intensive Hydration Barrier Cream with 5 Essential Ceramides",
    volume: "100 g / 3.5 oz.",
    price: 649,
    oldPrice: 899,
    rating: 4.9,
    reviews: 126,
    badge: "72H HYDRATION",
    image: "https://images.unsplash.com/photo-1608248597359-598d1a129ef3?w=800&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1608248597359-598d1a129ef3?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1556228722-d0b5de73174e?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80"
    ],
    description: "A restorative barrier repair moisturizer crafted to lock in intense moisture and strengthen depleted skin. Packed with 5 skin-identical Ceramides, Colloidal Oat, and Peptides, it repairs the moisture barrier, calms redness, and delivers supple, glass-like radiance all day long.",
    keyBenefits: [
      "Restores & Strengthens Damaged Skin Barrier",
      "72-Hour Continuous Deep Moisture Lock",
      "Enriched with 5 Essential Ceramides (NP, AP, EOP, EOS, NS)",
      "Soothes Redness, Dry Patches & Flaking with Colloidal Oat",
      "Lightweight, Non-Greasy Soufflé Texture that absorbs instantly"
    ],
    details: [
      "Key Actives: 5x Ceramides, Multi-Peptides, Centella Asiatica, Shea Butter",
      "Texture: Rich yet Fast-Absorbing Soufflé Cream",
      "Skin Type: Dry, Normal, Sensitive, Barrier-Damaged or Retinol-Treated Skin",
      "Safety: Fragrance-Free, Alcohol-Free, Hypoallergenic, Dermatologist Approved",
      "Application: Gently massage onto cleansed face and neck morning and evening"
    ],
    inStock: true,
    stockCount: 38,
    featured: true
  }
];

export default products;