// src/features/auth/services/auth.service.ts

import api, { getCsrfCookie } from '#/lib/axios'
import { fetchCurrentUserServerFn } from '#/features/auth/utils/auth.functions'
import type {
    AuthUser,
    LoginResponse,
    UserResponse,
} from '#/features/auth/types/auth.types'
import type { SignUpFormData } from '#/features/auth/schema/sign-up.schema'
import type { SignInFormData } from '#/features/auth/schema/sign-in.schema'
import type { ProfileFormValues } from '#/features/auth/schema/profile.schema'
import type { ChangePasswordFormValues } from '#/features/auth/schema/change-password.schema'

export const authService = {
    async login(credentials: SignInFormData): Promise<AuthUser> {
        await getCsrfCookie()
        const { data } = await api.post<LoginResponse>('user/login', {
            ...credentials,
            type: 'stateful',
        })
        return data.data.user
    },

    async register(payload: SignUpFormData): Promise<AuthUser> {
        await getCsrfCookie()
        const { data } = await api.post<LoginResponse>('user/register', {
            ...payload,
            type: 'stateful',
        })
        return data.data.user
    },

    async forgotPassword(email: string): Promise<void> {
        await getCsrfCookie()
        await api.post('user/forgot-password', { email })
    },

    async logout(): Promise<void> {
        await api.post('user/logout')
    },

    async getCurrentUser(): Promise<AuthUser | null> {
        if (typeof window === 'undefined') {
            return await fetchCurrentUserServerFn()
        }

        try {
            const { data } = await api.get<UserResponse>('user/me')
            return data.data
        } catch {
            return null
        }
    },

    async updateProfile(payload: ProfileFormValues): Promise<AuthUser> {
        const response = await api.put<UserResponse>('/api/v1/profile', payload)
        return response.data.data
    },

    async changePassword(payload: ChangePasswordFormValues): Promise<{ message: string }> {
        const response = await api.put<{ message: string }>(
            '/api/v1/profile/change-password',
            payload,
        )
        return response.data
    },

    async deleteAvatar(): Promise<void> {
        await api.delete('/api/v1/profile/avatar')
    },

    async deleteAccount(password: string): Promise<void> {
        await api.delete('/api/v1/profile', { data: { password } })
    },
}