// src/hooks/use-permissions.ts
import { useAuth } from '#/features/auth/context/auth.context'

export function usePermissions() {
    const auth = useAuth()

    return {
        user: auth.user,
        isAuthenticated: auth.isAuthenticated,
        hasPermission: auth.hasPermission,
        hasAnyPermission: auth.hasAnyPermission,
        hasRole: auth.hasRole,
        hasAnyRole: auth.hasAnyRole,
    }
}