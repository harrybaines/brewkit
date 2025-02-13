import { z } from "zod";

export const paymentSchema = z.object({
  id: z.string(),
  amount: z.number(),
  status: z.enum(["pending", "processing", "success", "failed"]),
  email: z.string().email(),
});

export type Payment = z.infer<typeof paymentSchema>;

export type PaymentStatus = z.infer<typeof paymentSchema>["status"];
