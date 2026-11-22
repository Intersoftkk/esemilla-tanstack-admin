import { useEffect, useState } from 'react'
import {
  createFileRoute,
  Outlet,
  redirect,
} from '@tanstack/react-router'
import {
  getSessionFn,
} from '#/features/auth/server/auth.functions.ts'
import { LayoutProvider } from '#/context/layout.context.tsx'
import { TooltipProvider } from '#/components/ui/tooltip.tsx'
import { SidebarInset, SidebarProvider } from '#/components/ui/sidebar.tsx'
import { AppSidebar } from '#/components/layout/app-sidebar.tsx'
import { Header } from '#/components/layout/header.tsx'
import { Main } from '#/components/layout/main.tsx'
import { ThemeSwitch } from '#/components/theme-switch.tsx'
import { NotificationDropdown } from '#/components/notification-dropdown.tsx'
import { ConfigDrawer } from '#/components/config-drawer.tsx'
import { ProfileDropdown } from '#/components/profile-dropdown.tsx'
import { cn } from '#/lib/utils.ts'
import { getCookie } from '#/lib/cookies.ts'

export const Route = createFileRoute('/_authed')({
  ssr: true,

  beforeLoad: async ({ context, location }) => {
    // 1. Use user from root context if available, otherwise fetch (cached) session
    const user =
      context.user ??
      (await context.queryClient.ensureQueryData({
        queryKey: ['auth', 'session'],
        queryFn: () => getSessionFn(),
        staleTime: 1000 * 60 * 5,
      }))

    // 2. Redirect unauthenticated users with redirect back-parameter
    if (!user) {
      throw redirect({
        to: '/sign-in',
        search: { redirect: location.href },
      })
    }

    return { user }
  },

  component: AuthedLayout,
})

function AuthedLayout() {
  // Use the same initial sidebar state for SSR and hydration, then restore the
  // saved browser preference once the client has mounted.
  const [sidebarOpen, setSidebarOpen] = useState(true)

  useEffect(() => {
    const savedState = getCookie('sidebar_state')
    if (savedState === 'true' || savedState === 'false') {
      setSidebarOpen(savedState === 'true')
    }
  }, [])

  return (
    <LayoutProvider>
      <TooltipProvider>
        <SidebarProvider open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <AppSidebar />
          <SidebarInset
            className={cn(
              '@container/content',
              'has-data-[layout=fixed]:h-svh',
              'peer-data-[variant=inset]:has-data-[layout=fixed]:h-[calc(100svh-(var(--spacing)*4))]',
              'relative flex flex-col',
            )}
          >
            <Header fixed>
              <div className="ms-auto flex items-center space-x-2">
                <NotificationDropdown />
                <ThemeSwitch />
                <ConfigDrawer />
                <ProfileDropdown />
              </div>
            </Header>

            <Main className="flex flex-1 flex-col gap-2 p-4 sm:gap-4">
              <Outlet />
            </Main>
          </SidebarInset>
        </SidebarProvider>
      </TooltipProvider>
    </LayoutProvider>
  )
}
