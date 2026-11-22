// src/features/auth/queries/auth.keys.ts

export const authKeys = {
    all: ['auth'],
    details: () => [...authKeys.all, 'detail'],
    user: () => [...authKeys.details(), 'user'],
    sessions: () => [...authKeys.details(), 'sessions'],
    profile: {
        all: ['profile'],
        detail: () => ['profile', 'detail'],
    },
}