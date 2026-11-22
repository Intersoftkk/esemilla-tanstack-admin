import OtpPage from '#/features/auth/otp.tsx'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/otp')({
  component: OtpPage,
})