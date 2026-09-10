// Keep this contract aligned with the submit-feedback Edge Function and its tests.
import { z } from "zod";

export const feedbackCategories = ["bug", "feature", "improvement", "general"] as const;

export const feedbackSchema = z.strictObject({
  category: z.enum(feedbackCategories, { error: "feedback.validation.category" }),
  message: z.string({ error: "feedback.validation.messageRequired" })
    .trim()
    .min(1, { error: "feedback.validation.messageRequired" })
    .min(10, { error: "feedback.validation.messageShort" })
    .max(2000, { error: "feedback.validation.messageLong" }),
  rating: z.number({ error: "feedback.validation.rating" })
    .int({ error: "feedback.validation.rating" })
    .min(1, { error: "feedback.validation.rating" })
    .max(5, { error: "feedback.validation.rating" })
    .nullish().transform((value) => value ?? null),
  email: z.string({ error: "feedback.validation.email" }).trim()
    .max(254, { error: "feedback.validation.email" })
    .refine((value) => value === "" || z.email().safeParse(value).success, {
      error: "feedback.validation.email",
    })
    .nullish().transform((value) => value || null),
  website: z.string().max(0).optional().default(""),
});

export type FeedbackInput = z.input<typeof feedbackSchema>;
export type FeedbackPayload = z.output<typeof feedbackSchema>;

