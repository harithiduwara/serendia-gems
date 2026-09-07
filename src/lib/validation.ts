import { z } from 'zod';

/**
 * Enquiry schema. Shared by the client form (for hints) and the API route (for
 * enforcement). The API is the only authority — client validation is a
 * convenience and is never trusted.
 */
export const enquirySchema = z.object({
  name: z.string().trim().min(2, 'Please enter your name.').max(120),
  email: z.string().trim().email('Please enter a valid email address.').max(200),
  phone: z.string().trim().max(40).optional().or(z.literal('')),
  country: z.string().trim().max(80).optional().or(z.literal('')),
  /** Lot codes this enquiry concerns. Empty for a general enquiry. */
  gemCodes: z.array(z.string().trim().max(12)).max(30).default([]),
  message: z
    .string()
    .trim()
    .min(10, 'Please tell us a little about what you are looking for.')
    .max(4000),
  /**
   * Honeypot. Real users never see this field, so a non-empty value is a bot.
   * Named plausibly so naive form-fillers take the bait.
   *
   * Deliberately permissive: the schema ACCEPTS a filled honeypot so the route
   * can respond 200 and teach the bot nothing. Rejecting it here with a 400
   * would tell an attacker exactly which field is the trap.
   */
  company: z.string().max(200).optional(),
});

export type EnquiryInput = z.infer<typeof enquirySchema>;

export interface EnquiryResponse {
  ok: boolean;
  message: string;
  /** Field-level errors, keyed by field name. */
  errors?: Record<string, string>;
}
