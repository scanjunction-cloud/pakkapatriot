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
