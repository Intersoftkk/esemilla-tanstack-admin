import { useLocation, useNavigate, useRouter } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'
import { useQueryClient } from '@tanstack/react-query'
import { ConfirmDialog } from '#/components/confirm-dialog'
import { signOutFn } from '#/features/auth/server/auth.functions'

interface LogoutConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SignOutDialog({
  open,
  onOpenChange,
}: LogoutConfirmDialogProps) {
  const navigate = useNavigate()
  const router = useRouter()
  const location = useLocation()
  const signOut = useServerFn(signOutFn)
  const queryClient = useQueryClient()

  const handleSignOut = async () => {
    const currentPath = location.href
    const redirect =
      currentPath && currentPath !== '/' && !currentPath.includes('/sign-in')
        ? currentPath
        : '/dashboard'

    try {
      await signOut()
    } finally {
      queryClient.setQueryData(['auth', 'session'], null)
      onOpenChange(false)
      await router.invalidate()
      await navigate({ to: '/sign-in', search: { redirect }, replace: true })
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
