import {createFileRoute} from '@tanstack/react-router'
import {SignUpPage} from "#/features/auth/sign-up.tsx";

export const Route = createFileRoute('/(auth)/sign-up')({
  component: SignUpPage,
})
