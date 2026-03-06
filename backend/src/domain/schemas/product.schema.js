import { z } from 'zod';
import ProductCategory from '../enums/ProductCategory.js';

const ProductSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1),
  sku: z.string().min(1),
  price: z.number().positive(),
  category: z.enum(Object.values(ProductCategory)),
  size: z.string().optional().nullable(),
  color: z.string().optional().nullable(),
  active: z.boolean().optional(),
});

export default ProductSchema;