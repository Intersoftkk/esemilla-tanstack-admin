// src/routes/__root.tsx

import React from 'react'
import {
    createRootRouteWithContext,
    HeadContent,
    Scripts,
    Link,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { FileQuestion, ArrowLeft } from 'lucide-react'
import type { QueryClient } from '@tanstack/react-query'

import TanStackQueryDevtools from '#/integrations/tanstack-query/devtools'
import { getLocale } from '#/paraglide/runtime'
import appCss from '#/styles.css?url'
import { AuthProvider } from '#/features/auth/context/auth.context'
import type { AuthUser } from '#/features/auth/types/auth.types'
import { authQueryOptions } from '#/features/auth/queries/auth.queries'
import { NavigationProgress } from '#/components/navigation-progress'
import { Button } from '#/components/ui/button'

export interface MyRouterContext {
    queryClient: QueryClient
    user?: AuthUser | null
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
    beforeLoad: async ({ context }) => {
        if (typeof document !== 'undefined') {
            document.documentElement.setAttribute('lang', getLocale())
        }

        const user = await context.queryClient.ensureQueryData(
            authQueryOptions.user()
        )

        return { user }
    },
    head: () => ({
        meta: [
            { charSet: 'utf-8' },
            { name: 'viewport', content: 'width=device-width, initial-scale=1' },
            { title: 'SchoolPortal' },
        ],
        links: [{ rel: 'stylesheet', href: appCss }],
    }),
    notFoundComponent: NotFoundPage,
    shellComponent: RootDocument,
})

function NotFoundPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-background">
            <div className="rounded-full bg-muted p-4 mb-4 text-muted-foreground">
                <FileQuestion className="h-10 w-10" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Page Not Found
            </h1>
            <p className="mt-2 text-sm text-muted-foreground max-w-sm text-balance">
                Sorry, we couldn&apos;t find the page you are looking for. It might have been moved or deleted.
            </p>
            <div className="mt-6 flex items-center gap-3">
                <Button asChild variant="default">
                    <Link to="/dashboard">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Dashboard
                    </Link>
                </Button>
            </div>
        </div>
    )
}

function RootDocument({ children }: { children: React.ReactNode }) {
    return (
        <html lang={getLocale()}>
        <head>
            <HeadContent />
        </head>
        <body>
        <NavigationProgress />
        <AuthProvider>{children}</AuthProvider>
        <TanStackDevtools
            config={{ position: 'bottom-right' }}
            plugins={[
                { name: 'Tanstack Router', render: <TanStackRouterDevtoolsPanel /> },
                TanStackQueryDevtools,
            ]}
        />
        <Scripts />
        </body>
        </html>
    )
}