import { createFileRoute } from '@tanstack/react-router'
import {ChangePasswordPage} from "#/features/auth/change-password.tsx";

export const Route = createFileRoute('/_authed/profile/change-password')({
  component: ChangePasswordPage,
})