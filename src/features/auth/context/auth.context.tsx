// src/features/auth/context/auth.context.tsx
import {
    createContext,
    type ReactNode,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from 'react'
import type {
    AuthContextValue,
    AuthUser,
} from '#/features/auth/types/auth.types'
import type { SignUpFormData } from '#/features/auth/schema/sign-up.schema'
import {
    useAuthUserQuery,
    useForgotPasswordMutation,
    useLoginMutation,
    useLogoutMutation,
    useRegisterMutation,
} from '#/features/auth/queries/auth.queries'
import type {SignInFormData} from "#/features/auth/schema/sign-in.schema.ts";

export const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null)

    const { data, isLoading } = useAuthUserQuery()

    const loginMutation = useLoginMutation()
    const registerMutation = useRegisterMutation()
    const forgotPasswordMutation = useForgotPasswordMutation()
    const logoutMutation = useLogoutMutation()

    // Sync React Query cache data to context state
    useEffect(() => {
        if (data) {
            setUser(data)
        } else if (!isLoading) {
            setUser(null)
        }
    }, [data, isLoading])

    const login = useCallback(
        async (credentials: SignInFormData): Promise<AuthUser> => {
            const loggedInUser = await loginMutation.mutateAsync(credentials)
            setUser(loggedInUser)
            return loggedInUser
        },
        [loginMutation],
    )

    const register = useCallback(
        async (payload: SignUpFormData): Promise<AuthUser> => {
            const registeredUser = await registerMutation.mutateAsync(payload)
            setUser(registeredUser)
            return registeredUser
        },
        [registerMutation],
    )

    const forgotPassword = useCallback(
        async (email: string): Promise<void> => {
            await forgotPasswordMutation.mutateAsync(email)
        },
        [forgotPasswordMutation],
    )

    const logout = useCallback(async (): Promise<void> => {
        await logoutMutation.mutateAsync()
        setUser(null)
    }, [logoutMutation])

    const hasPermission = useCallback(
        (permission: string) => {
            return user?.permissions?.includes(permission) ?? false
        },
        [user?.permissions],
    )

    const hasAnyPermission = useCallback(
        (permissions: string[]) => {
            return permissions.some((permission) => user?.permissions?.includes(permission))
        },
        [user?.permissions],
    )

    const hasRole = useCallback(
        (role: string) => {
            return user?.roles?.includes(role) ?? false
        },
        [user?.roles],
    )

    const hasAnyRole = useCallback(
        (roles: string[]) => {
            return roles.some((role) => user?.roles?.includes(role))
        },
        [user?.roles],
    )

    const value = useMemo<AuthContextValue>(
        () => ({
            user,
            isAuthenticated: !!user,
            isLoading,
            login,
            register,
            forgotPassword,
            logout,
            hasPermission,
            hasAnyPermission,
            hasRole,
            hasAnyRole,
        }),
        [
            user,
            isLoading,
            login,
            register,
            forgotPassword,
            logout,
            hasPermission,
            hasAnyPermission,
            hasRole,
            hasAnyRole,
        ],
    )

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an <AuthProvider>')
    }
    return context
}