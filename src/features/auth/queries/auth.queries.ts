// src/features/auth/queries/auth.queries.ts

import {
    queryOptions,
    useMutation,
    useQuery,
    useQueryClient,
    type UseQueryOptions,
} from '@tanstack/react-query'
import { authService } from '#/features/auth/services/auth.service'
import { authKeys } from '#/features/auth/queries/auth.keys'
import type { AuthUser } from '#/features/auth/types/auth.types'
import type { SignUpFormData } from '#/features/auth/schema/sign-up.schema'
import type { SignInFormData } from '#/features/auth/schema/sign-in.schema'
import type { ProfileFormValues } from '#/features/auth/schema/profile.schema'
import type { ChangePasswordFormValues } from '#/features/auth/schema/change-password.schema'

type AuthUserKey = ReturnType<typeof authKeys.user>

/* -------------------------------------------------------------------------- */
/*  Query Options                                                             */
/* -------------------------------------------------------------------------- */

export const authQueryOptions = {
    user: <TData = AuthUser | null>(
        options?: Omit<
            UseQueryOptions<AuthUser | null, Error, TData, AuthUserKey>,
            'queryKey' | 'queryFn'
        >,
    ) =>
        queryOptions({
            queryKey: authKeys.user(),
            queryFn: () => authService.getCurrentUser(),
            staleTime: 1000 * 60 * 5, // 5 minutes
            gcTime: 1000 * 60 * 60, // 1 hour
            retry: false, // Never retry on 401/403
            ...options,
        }),
}

/* -------------------------------------------------------------------------- */
/*  Query Hooks                                                               */
/* -------------------------------------------------------------------------- */

export function useAuthUserQuery<TData = AuthUser | null>(
    options?: Omit<
        UseQueryOptions<AuthUser | null, Error, TData, AuthUserKey>,
        'queryKey' | 'queryFn'
    >,
) {
    return useQuery(authQueryOptions.user(options))
}

/* -------------------------------------------------------------------------- */
/*  Mutation Hooks                                                            */
/* -------------------------------------------------------------------------- */

export function useLoginMutation() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (credentials: SignInFormData) => authService.login(credentials),
        onSuccess: (user: AuthUser) => {
            queryClient.setQueryData(authKeys.user(), user)
        },
    })
}

export function useRegisterMutation() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (payload: SignUpFormData) => authService.register(payload),
        onSuccess: (user: AuthUser) => {
            queryClient.setQueryData(authKeys.user(), user)
        },
    })
}

export function useForgotPasswordMutation() {
    return useMutation({
        mutationFn: (email: string) => authService.forgotPassword(email),
    })
}

export function useLogoutMutation() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: () => authService.logout(),
        onSuccess: () => {
            queryClient.setQueryData(authKeys.user(), null)
            queryClient.clear()
        },
    })
}

export function useUpdateProfileMutation() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (payload: ProfileFormValues) => authService.updateProfile(payload),
        onSuccess: (updated) => {
            queryClient.setQueryData(authKeys.user(), updated)
        },
    })
}

export function useChangePasswordMutation() {
    return useMutation({
        mutationFn: (payload: ChangePasswordFormValues) => authService.changePassword(payload),
    })
}

export function useDeleteAvatarMutation() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: authService.deleteAvatar,
        onSuccess: () => {
            queryClient.setQueryData(authKeys.user(), (old: AuthUser | null | undefined) =>
                old ? { ...old, avatar: null } : old
            )
        },
    })
}

export function useDeleteAccountMutation() {
    return useMutation({
        mutationFn: (password: string) => authService.deleteAccount(password),
    })
}