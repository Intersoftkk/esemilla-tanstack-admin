// #/features/plans/schema/features.schema.ts
import { z } from 'zod'

const featureIdSchema = z.union([z.string(), z.number()]).transform(String)

/** Payload accepted by the attach-features and sync-features endpoints. */
export const planFeaturesSchema = z.object({
    feature_ids: z.array(featureIdSchema),
})

export type PlanFeaturesInput = z.infer<typeof planFeaturesSchema>
