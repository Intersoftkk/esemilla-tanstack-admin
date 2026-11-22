import {QueryClient} from '@tanstack/react-query'

export function getContext() {

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // 5 minutes
        retry: false, // Turn off aggressive retries for auth/401 checks
      },
    },
  })

  return {
    queryClient,
    auth: undefined!
  }
}
export default function TanstackQueryProvider() {}
