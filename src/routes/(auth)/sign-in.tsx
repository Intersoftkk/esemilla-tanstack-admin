import {createFileRoute, redirect} from '@tanstack/react-router'
import {SignInPage} from "#/features/auth/sign-in.tsx";

export const Route = createFileRoute('/(auth)/sign-in')({
  beforeLoad: ({ context }) => {
    if (context.user) {
      throw redirect({ to: '/dashboard' })
    }
  },
  component: SignInPage,
})
