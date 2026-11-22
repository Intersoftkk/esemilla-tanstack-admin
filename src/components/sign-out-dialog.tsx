import {useLocation, useNavigate} from '@tanstack/react-router'
import {ConfirmDialog} from '#/components/confirm-dialog'
import {useAuth} from "#/features/auth/context/auth.context";

interface LogoutConfirmDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function SignOutDialog({
                                  open,
                                  onOpenChange,
                              }: LogoutConfirmDialogProps) {
    const navigate = useNavigate()
    const location = useLocation()
    const {logout} = useAuth()

    const handleSignOut = async () => {
        try {
            // 1. Clear server-side session
            await logout()

            // 2. Capture current path correctly
            // Fix: Use location.href to get the full string (path + search)
            // OR use location.pathname if you only want the path.
            const currentPath = location.href

            // 3. Determine redirect path
            // If we are currently on root ('/') or 'sign-in', default to '/workspace'
            // Otherwise, save the current path to redirect back to later.
            const finalRedirect =
                currentPath && currentPath !== '/' && !currentPath.includes('/sign-in')
                    ? currentPath
                    : '/workspace'

            await navigate({
                to: '/sign-in',
                search: {redirect: finalRedirect},
                replace: true,
            })
        } catch (error) {
            console.error('Server logout failed:', error)

            // Fallback
            await navigate({
                to: '/sign-in',
                search: {redirect: '/workspace'},
                replace: true,
            })
        } finally {
            onOpenChange(false)
        }
    }

    return (
        <ConfirmDialog
            open={open}
            onOpenChange={onOpenChange}
            title="Sign out"
            desc="Are you sure you want to sign out? You will need to sign in again to access your account."
            confirmText="Sign out"
            destructive
            handleConfirm={handleSignOut}
            className="sm:max-w-sm"
        />
    )
}
