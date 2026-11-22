import { createFileRoute } from '@tanstack/react-router'
import SignInPage from '#/features/auth/sign-in.tsx'

type SignInSearch = {
  redirect?: string
  reason?: 'session_expired'
}

export const Route = createFileRoute('/_auth/sign-in')({
  ssr: 'data-only',
  validateSearch: (search: Record<string, unknown>): SignInSearch => ({
    redirect: typeof search.redirect === 'string' ? search.redirect : undefined,
    reason: search.reason === 'session_expired' ? 'session_expired' : undefined,
  }),
  component: SignInRoute,
})

function SignInRoute() {
  const search = Route.useSearch()
  return <SignInPage search={search} />
}
