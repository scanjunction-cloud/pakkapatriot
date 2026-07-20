/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface WPPost {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  featuredImage: string;
  category: string;
  slug: string;
  link: string;
  authorName?: string;
  readTime?: string;
}

export interface WCProduct {
  id: number;
  name: string;
  description: string;
  shortDescription?: string;
  price: string;
  regularPrice: string;
  salePrice?: string;
  onSale: boolean;
  imageUrl: string;
  category: string;
  link: string;
  inStock: boolean;
}

export interface CategoryItem {
  id: string;
  label: string;
  iconName: string;
}

export interface MerchCategory {
  id: string;
  label: string;
  iconName: string;
}

/** ─── Cart & Checkout Types ───────────────────────────────────────────── */

/** A single item in the local cart (with quantity) */
export interface CartItem {
  product: WCProduct;
  quantity: number;
}

/** The shape returned by the WooCommerce Store API cart endpoint */
export interface WooCartItem {
  key: string;
  id: number;
  quantity: number;
  name: string;
  prices: {
    price: string;
    regular_price: string;
    sale_price: string;
    currency_code: string;
    currency_minor_unit: number;
  };
  images: Array<{ src: string }>;
  totals: {
    line_total: string;
    line_subtotal: string;
  };
}

export interface WooCart {
  items: WooCartItem[];
  totals: {
    total_price: string;
    total_items: string;
    currency_code: string;
    currency_minor_unit: number;
  };
  coupons: any[];
  shipping_address: any;
  billing_address: any;
}

/** Checkout form data */
export interface CheckoutFormData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address_1: string;
  address_2: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
  customer_note: string;
  // Shipping (defaults to same as billing)
  shipping_same: boolean;
  shipping_first_name?: string;
  shipping_last_name?: string;
  shipping_address_1?: string;
  shipping_address_2?: string;
  shipping_city?: string;
  shipping_state?: string;
  shipping_postcode?: string;
}

/** Result from a successful order placement */
export interface OrderResult {
  order_id: number;
  order_key: string;
  total: string;
  currency: string;
  status: string;
}
