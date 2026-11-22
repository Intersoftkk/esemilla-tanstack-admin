// src/features/auth/schema/profile.schema.ts

import { z } from 'zod'

export const profileSchema = z.object({
    firstName: z
        .string()
        .min(2, 'First name must be at least 2 characters')
        .max(50, 'First name must be less than 50 characters')
        .regex(/^[a-zA-Z\s'-]+$/, 'First name contains invalid characters'),
    lastName: z
        .string()
        .min(2, 'Last name must be at least 2 characters')
        .max(50, 'Last name must be less than 50 characters')
        .regex(/^[a-zA-Z\s'-]+$/, 'Last name contains invalid characters'),
    phone: z
        .string()
        .regex(/^\+?[\d\s-()]{10,15}$/, 'Please enter a valid phone number')
        .or(z.literal('')),
    bio: z
        .string()
        .max(500, 'Bio must be less than 500 characters'),
    avatar: z
        .string()
        .nullable(),
    dateOfBirth: z
        .string()
        .nullable(),
    address: z.object({
        street: z.string().max(200, 'Street must be less than 200 characters'),
        city: z.string().max(100, 'City must be less than 100 characters'),
        state: z.string().max(100, 'State must be less than 100 characters'),
        zipCode: z
            .string()
            .regex(/^[\d-]{0,10}$/, 'Please enter a valid zip code')
            .or(z.literal('')),
        country: z.string().max(100, 'Country must be less than 100 characters'),
    }),
})

export type ProfileFormValues = z.infer<typeof profileSchema>