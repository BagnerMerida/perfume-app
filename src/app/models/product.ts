export interface Product {
  id: number;
  brandId: number;
  brandName: string;
  categoryId: number;
  categoryName: string;
  name: string;
  slug: string;
  description: string;
  fragranceType: string;
  gender: 'MEN' | 'WOMEN' | 'UNISEX';
  concentration: string;
  price: number;
  stock: number;
  status: string;
  featured: boolean;
  isNew: boolean;
  bestSeller: boolean;
  mainImageUrl?: string;
  createdAt: string;
  updatedAt?: string;
}