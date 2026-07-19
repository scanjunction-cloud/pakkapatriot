/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { WPPost, WCProduct } from "../types";

// High fidelity mock data matching the screenshot and real Pakka Patriot products
export const FALLBACK_POSTS: WPPost[] = [
  {
    id: 101,
    title: "The Library That Survived Centuries",
    excerpt: "A timeless treasure of knowledge hidden in plain sight. Deep in the heart of ancient temples, manuscript libraries preserved the soul of India's intellectual heritage.",
    content: "The story of India's ancient libraries is one of resilience. While grand universities like Nalanda and Vikramashila were lost to history, smaller temple libraries and village repositories quietly preserved thousands of manuscripts. These palm-leaf and birch-bark sheets cover subjects from mathematics, astronomy, and medicine to philosophy, linguistics, and literature. They represent an unbroken lineage of intellectual curiosity that spans over three millennia, surviving climate, neglect, and conflict to remind us of the power of written knowledge.",
    date: "2026-07-15",
    featuredImage: "https://images.unsplash.com/photo-1568667256549-094345857637?q=80&w=800&auto=format&fit=crop",
    category: "HERITAGE",
    slug: "the-library-that-survived-centuries",
    link: "https://pakkapatriot.com/the-library-that-survived-centuries",
    authorName: "Ananya Sharma",
    readTime: "4 min read"
  },
  {
    id: 102,
    title: "Ziro Valley: Where Nature Smiles",
    excerpt: "Explore the beauty, culture and warmth of Arunachal. Discover how the Apatani tribe lives in harmony with their misty hills, practicing unique sustainable farming.",
    content: "Nestled in the lower Subansiri district of Arunachal Pradesh, Ziro Valley is a UNESCO World Heritage site candidate that feels like a dream. Home to the Apatani tribe, the valley is famous for its pine-clad hills, bamboo houses, and incredibly efficient wet-rice cultivation systems that combine fish farming with agriculture. The Apatanis have a deep reverence for nature, reflected in their sacred groves and oral traditions. Every year, the valley echoes with indie music during the Ziro Festival, welcoming explorers from around the globe to experience its pristine breeze and friendly smiles.",
    date: "2026-07-10",
    featuredImage: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=800&auto=format&fit=crop",
    category: "PLACES",
    slug: "ziro-valley-where-nature-smiles",
    link: "https://pakkapatriot.com/ziro-valley-where-nature-smiles",
    authorName: "Rohan Das",
    readTime: "5 min read"
  },
  {
    id: 103,
    title: "Warli Art: Stories in Lines and Circles",
    excerpt: "The ancient art that speaks without words. Utilizing simple geometric shapes, Warli painters portray the daily rhythms of tribal life, community, and mother nature.",
    content: "Dating back to 2500 BCE, Warli art is one of India's oldest painting traditions, originating from the tribal communities of Maharashtra. Unlike courtly paintings, Warli art is a democratic, community-driven medium. Painted on mud walls using a paste of rice flour and water, the art uses only three basic shapes: the circle (representing the sun and moon), the triangle (derived from mountains and pointed trees), and the square (indicating a sacred enclosure). Through these simple lines, the artists weave complex narratives of harvests, marriages, dances, and a profound, balanced relationship with the forest.",
    date: "2026-07-08",
    featuredImage: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=800&auto=format&fit=crop",
    category: "TRADITIONS",
    slug: "warli-art-stories-in-lines-and-circles",
    link: "https://pakkapatriot.com/warli-art-stories-in-lines-and-circles",
    authorName: "Meera Nair",
    readTime: "3 min read"
  },
  {
    id: 104,
    title: "APJ Abdul Kalam: Dreamer of India",
    excerpt: "The man who inspired millions to dream big. Discover the humble origins, scientific breakthroughs, and the enduring youth legacy of the 'People's President'.",
    content: "Avul Pakir Jainulabdeen Abdul Kalam, born in the island town of Rameswaram, went on to become one of India's most beloved scientists and its 11th President. Known as the Missile Man of India for his role in developing indigenous aerospace capabilities, his true passion lay in teaching and interacting with young minds. He believed that the greatest resource of any nation is its youth, and spent his post-presidency years traveling to remote corners of the country, sparking curiosity and encouraging millions to 'dream, dream, dream, for dreams transform into thoughts and thoughts result in action.'",
    date: "2026-07-02",
    featuredImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop",
    category: "PEOPLE",
    slug: "apj-abdul-kalam-dreamer-of-india",
    link: "https://pakkapatriot.com/apj-abdul-kalam-dreamer-of-india",
    authorName: "Vikram Mehta",
    readTime: "6 min read"
  },
  {
    id: 105,
    title: "The Musical Pillars of Hampi",
    excerpt: "Marvel at the architectural genius of the Vittala Temple, where stone pillars produce ethereal musical notes when tapped gently.",
    content: "In the ruins of the Vijayanagara Empire in Hampi stands the majestic Vittala Temple, famous for its stone chariot and its 56 musical pillars. Carved out of single pieces of resonant granite, these slender pillars emit distinct musical notes—resembling Indian classical instruments like the mridangam, veena, and flute—when tapped gently. British researchers were so baffled that they cut two pillars to see if they were hollow or filled with metal, only to find solid stone, leaving the acoustic engineering secrets of 16th-century Indian artisans a mesmerizing mystery.",
    date: "2026-06-28",
    featuredImage: "https://images.unsplash.com/photo-1600100397628-9844ca18a361?q=80&w=800&auto=format&fit=crop",
    category: "HERITAGE",
    slug: "musical-pillars-of-hampi",
    link: "https://pakkapatriot.com/musical-pillars-of-hampi",
    authorName: "Arjun Verma",
    readTime: "4 min read"
  },
  {
    id: 106,
    title: "Kite Flying: India's Sky Festivals",
    excerpt: "The vibrant traditions of Makar Sankranti, where millions take to rooftops to paint the sky with colorful paper kites and friendly battles.",
    content: "Kite flying is more than a sport in India; it is a celebration of life, harvest, and wind. On Makar Sankranti, cities like Ahmedabad and Jaipur transform into massive rooftop arenas. Kites of every color, size, and material dance in the sky as flyers engage in high-stakes tactical duels. It is a beautiful display of community, where neighbors share food, music blast from terraces, and the sky becomes a canvas of collective joy, uniting generations in the simple thrill of soaring high.",
    date: "2026-06-15",
    featuredImage: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop",
    category: "FUN & ADVENTURE",
    slug: "kite-flying-sky-festivals",
    link: "https://pakkapatriot.com/kite-flying-sky-festivals",
    authorName: "Sanjay Joshi",
    readTime: "3 min read"
  }
];

export const FALLBACK_PRODUCTS: WCProduct[] = [
  {
    id: 201,
    name: "Pakka Patriot Signature T-Shirt",
    description: "Ultra-soft 100% organic cotton graphic t-shirt featuring the iconic Pakka Patriot emblem. Breathe easy, live proudly.",
    shortDescription: "Premium organic cotton tee with hand-printed PP logo.",
    price: "799",
    regularPrice: "999",
    onSale: true,
    imageUrl: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=600&auto=format&fit=crop",
    category: "T-Shirts",
    link: "https://pakkapatriot.com/product/signature-t-shirt",
    inStock: true
  },
  {
    id: 202,
    name: "Cozy Patriot Hoodie",
    description: "Warm, heavy-blend hooded sweatshirt with front pouch pocket. Made with a thick cotton-poly blend for ultimate comfort.",
    shortDescription: "Stay warm and curious in our signature heavy fleece hoodie.",
    price: "1599",
    regularPrice: "1999",
    onSale: true,
    imageUrl: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=600&auto=format&fit=crop",
    category: "Hoodies",
    link: "https://pakkapatriot.com/product/cozy-patriot-hoodie",
    inStock: true
  },
  {
    id: 203,
    name: "Curious Minds Coffee Mug",
    description: "Start your mornings with a sip of inspiration. High-quality ceramic mug printed with 'Curious minds change the country!'.",
    shortDescription: "Dishwasher and microwave safe 11oz ceramic mug.",
    price: "349",
    regularPrice: "349",
    onSale: false,
    imageUrl: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=600&auto=format&fit=crop",
    category: "Mugs",
    link: "https://pakkapatriot.com/product/curious-minds-mug",
    inStock: true
  },
  {
    id: 204,
    name: "Indie Explorer Canvas Tote Bag",
    description: "Durable cotton canvas tote bag with spacious storage, perfect for carrying your favorite history books, notebooks, and travel essentials.",
    shortDescription: "Eco-friendly reusable canvas tote with long handles.",
    price: "449",
    regularPrice: "599",
    onSale: true,
    imageUrl: "https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=600&auto=format&fit=crop",
    category: "Tote Bags",
    link: "https://pakkapatriot.com/product/explorer-tote-bag",
    inStock: true
  },
  {
    id: 205,
    name: "Heritage Sketch Notebook",
    description: "Hardcover journal with unruled premium 120GSM pages. Ideal for sketching monuments, writing travel notes, or mapping ideas.",
    shortDescription: "Premium unruled notebook for sketches and notes.",
    price: "299",
    regularPrice: "399",
    onSale: true,
    imageUrl: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?q=80&w=600&auto=format&fit=crop",
    category: "Notebooks",
    link: "https://pakkapatriot.com/product/heritage-notebook",
    inStock: true
  },
  {
    id: 206,
    name: "Pakka Patriot Sticker Pack",
    description: "A pack of 10 high-quality vinyl, water-resistant stickers featuring traditional Indian arts, historical landmarks, and quirky slogans.",
    shortDescription: "Waterproof vinyl decals for laptops, bottles, and diaries.",
    price: "199",
    regularPrice: "199",
    onSale: false,
    imageUrl: "https://images.unsplash.com/photo-1572375995501-4b0894dbe0d1?q=80&w=600&auto=format&fit=crop",
    category: "Stickers",
    link: "https://pakkapatriot.com/product/sticker-pack",
    inStock: true
  },
  {
    id: 207,
    name: "Eternal India Poster (A3)",
    description: "Thick matte paper print showcasing the architectural beauty and cultural heritage of India in an elegant minimal vector art style.",
    shortDescription: "Premium quality A3 print for room and workspace decoration.",
    price: "399",
    regularPrice: "499",
    onSale: true,
    imageUrl: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=600&auto=format&fit=crop",
    category: "Posters",
    link: "https://pakkapatriot.com/product/eternal-india-poster",
    inStock: true
  },
  {
    id: 208,
    name: "Handcrafted Brass Bookmark",
    description: "Intricately detailed brass bookmark resembling the traditional peacock and mandala designs, hand-polished by local metal craftsmen.",
    shortDescription: "Artisanal metal bookmark for booklovers.",
    price: "249",
    regularPrice: "299",
    onSale: true,
    imageUrl: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=600&auto=format&fit=crop",
    category: "Accessories",
    link: "https://pakkapatriot.com/product/brass-bookmark",
    inStock: true
  }
];

// Base URLs
const WORDPRESS_BASE_URL = "https://pakkapatriot.com/wp-json";

/**
 * Fetch latest stories/posts from pakkapatriot.com
 */
export async function fetchWordPressPosts(): Promise<WPPost[]> {
  try {
    const response = await fetch(`${WORDPRESS_BASE_URL}/wp/v2/posts?_embed=1&per_page=6`, {
      method: "GET",
      headers: {
        "Accept": "application/json"
      }
    });

    if (!response.ok) {
      throw new Error(`WordPress API returned status ${response.status}`);
    }

    const data = await response.json();

    if (!Array.isArray(data) || data.length === 0) {
      return FALLBACK_POSTS;
    }

    // Map WP REST API fields to our clean WPPost interface
    return data.map((post: any) => {
      // Extract featured image from embedded block
      let featuredImage = "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=800&auto=format&fit=crop";
      try {
        if (post._embedded && post._embedded["wp:featuredmedia"] && post._embedded["wp:featuredmedia"][0]) {
          const media = post._embedded["wp:featuredmedia"][0];
          featuredImage = media.source_url || media.media_details?.sizes?.large?.source_url || featuredImage;
        }
      } catch (err) {
        console.warn("Could not parse featured media for post", post.id, err);
      }

      // Try to extract category
      let category = "STORIES";
      try {
        if (post._embedded && post._embedded["wp:term"] && post._embedded["wp:term"][0]) {
          const categoriesList = post._embedded["wp:term"][0];
          if (categoriesList.length > 0) {
            category = categoriesList[0].name.toUpperCase();
          }
        }
      } catch (err) {
        // Fallback matching title categories
        const titleLower = post.title.rendered.toLowerCase();
        if (titleLower.includes("art") || titleLower.includes("tradition")) category = "TRADITIONS";
        else if (titleLower.includes("valley") || titleLower.includes("place") || titleLower.includes("temple")) category = "PLACES";
        else if (titleLower.includes("library") || titleLower.includes("history") || titleLower.includes("heritage")) category = "HERITAGE";
        else if (titleLower.includes("kalam") || titleLower.includes("people") || titleLower.includes("dreamer")) category = "PEOPLE";
      }

      // Author name
      let authorName = "Pakka Patriot";
      try {
        if (post._embedded && post._embedded["author"] && post._embedded["author"][0]) {
          authorName = post._embedded["author"][0].name || authorName;
        }
      } catch (_) {}

      // Calculate simple read time based on word count
      const wordCount = post.content?.rendered ? post.content.rendered.split(/\s+/).length : 500;
      const readTime = `${Math.max(1, Math.ceil(wordCount / 200))} min read`;

      return {
        id: post.id,
        title: post.title?.rendered ? decodeHtmlEntities(post.title.rendered) : "Untitled Post",
        excerpt: post.excerpt?.rendered ? stripHtml(post.excerpt.rendered) : "Explore the stories of India.",
        content: post.content?.rendered || "",
        date: post.date ? post.date.split("T")[0] : new Date().toISOString().split("T")[0],
        featuredImage,
        category,
        slug: post.slug || `post-${post.id}`,
        link: post.link || `https://pakkapatriot.com/${post.slug}`,
        authorName,
        readTime
      };
    });
  } catch (error) {
    console.warn("WordPress fetch failed (likely CORS or Network), using beautiful fallback data:", error);
    return FALLBACK_POSTS;
  }
}

/**
 * Fetch latest products from pakkapatriot.com WooCommerce Store API
 */
export async function fetchWooCommerceProducts(): Promise<WCProduct[]> {
  try {
    const response = await fetch(`${WORDPRESS_BASE_URL}/wc/store/v1/products?per_page=12`, {
      method: "GET",
      headers: {
        "Accept": "application/json"
      }
    });

    if (!response.ok) {
      throw new Error(`WooCommerce Store API returned status ${response.status}`);
    }

    const data = await response.json();

    if (!Array.isArray(data) || data.length === 0) {
      return FALLBACK_PRODUCTS;
    }

    return data.map((product: any) => {
      // Handle price formatting (WooCommerce Store API returns prices as integer strings/objects, e.g., "79900" for 799.00)
      let price = "0";
      let regularPrice = "0";
      try {
        if (product.prices) {
          const rawPrice = product.prices.price;
          const rawRegular = product.prices.regular_price;
          price = (parseFloat(rawPrice) / Math.pow(10, product.prices.currency_minor_unit || 2)).toFixed(0);
          regularPrice = (parseFloat(rawRegular) / Math.pow(10, product.prices.currency_minor_unit || 2)).toFixed(0);
        } else {
          price = product.price || "0";
          regularPrice = product.regular_price || price;
        }
      } catch (err) {
        price = "499";
        regularPrice = "499";
      }

      return {
        id: product.id,
        name: product.name ? decodeHtmlEntities(product.name) : "Patriot Merch",
        description: product.description ? stripHtml(product.description) : "",
        shortDescription: product.short_description ? stripHtml(product.short_description) : "",
        price,
        regularPrice,
        onSale: product.on_sale || false,
        imageUrl: product.images && product.images[0]?.src ? product.images[0].src : "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=600&auto=format&fit=crop",
        category: product.categories && product.categories[0]?.name ? product.categories[0].name : "Accessories",
        link: product.permalink || `https://pakkapatriot.com/product/${product.slug || product.id}`,
        inStock: product.is_in_stock ?? true
      };
    });
  } catch (error) {
    console.warn("WooCommerce fetch failed (likely CORS or Network), using beautiful fallback data:", error);
    return FALLBACK_PRODUCTS;
  }
}

// Helper: Strip HTML tags
function stripHtml(html: string): string {
  if (!html) return "";
  const clean = html.replace(/<\/?[^>]+(>|$)/g, "");
  // Trim and limit length to ~120 characters for clean excerpts
  const trimmed = clean.trim().replace(/\s+/g, " ");
  if (trimmed.length > 140) {
    return trimmed.slice(0, 137) + "...";
  }
  return trimmed;
}

// Helper: Decode basic HTML entities
function decodeHtmlEntities(str: string): string {
  if (!str) return "";
  return str
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&#8217;/g, "'")
    .replace(/&#8216;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&rsquo;/g, "'")
    .replace(/&lsquo;/g, "'")
    .replace(/&ldquo;/g, '"')
    .replace(/&rdquo;/g, '"');
}
