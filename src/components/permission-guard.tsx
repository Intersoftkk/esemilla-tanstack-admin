import {usePermissions} from "#/hooks/use-permissions";

interface PermissionGuardProps {
    children: React.ReactNode
    roles?: string[]
    permissions?: string[]
    requireAll?: boolean
    fallback?: React.ReactNode
}

export function PermissionGuard({
                                    children,
                                    permissions = [],
                                    requireAll = false,
                                    fallback = null,
                                }: PermissionGuardProps) {
    const {hasAnyPermission, hasPermission} = usePermissions()

    const hasRequiredPermissions =
        permissions.length === 0 ||
        (requireAll
            ? permissions.every((permission) => hasPermission(permission))
            : hasAnyPermission(permissions))

    if (hasRequiredPermissions) {
        return <>{children}</>
    }

    return <>{fallback}</>
}