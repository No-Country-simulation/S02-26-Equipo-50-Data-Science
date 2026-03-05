import { z } from 'zod';

const InventorySchema = z.object({
  id: z.string().optional(),
  productId: z.string(),
  quantity: z.number().int().min(0),
  minStock: z.number().int().optional().nullable(),
});

export default InventorySchema;