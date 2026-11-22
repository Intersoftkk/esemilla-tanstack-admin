// src/integrations/tanstack-query/root-provider.tsx
import * as React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

export interface RouterContext {
  queryClient: QueryClient
}

export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60, // 1 minute stale time
        refetchOnWindowFocus: false,
      },
      dehydrate: {
        shouldDehydrateQuery: (query) => query.state.status === 'success',
        shouldDehydrateMutation: () => false,
      },
    },
  })
}

export function getContext(): RouterContext {
  return {
    queryClient: createQueryClient(),
  }
}

export default function TanstackQueryProvider({
                                                children,
                                                queryClient,
                                              }: {
  children?: React.ReactNode
  queryClient?: QueryClient
}) {
  const [client] = React.useState(() => queryClient ?? createQueryClient())

  return <QueryClientProvider client={client}>{children}</QueryClientProvider>
}
