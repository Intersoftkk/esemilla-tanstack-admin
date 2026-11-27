// #/features/subscriptions/schema/features.schema.ts
import { z } from "zod";

const featureIdSchema = z.union([z.string(), z.number()]).transform(String);

/** Payload accepted by the attach-features and sync-features endpoints. */
export const subscriptionFeaturesSchema = z.object({
	feature_ids: z.array(featureIdSchema),
});

export type SubscriptionFeaturesInput = z.infer<
	typeof subscriptionFeaturesSchema
>;

/** Payload for creating or editing a feature in the catalog. */
export const featureSchema = z.object({
	name: z.string().min(1, "Feature name is required"),
	code: z.string().optional(),
	description: z.string().optional(),
});

export type FeatureFormData = z.infer<typeof featureSchema>;
