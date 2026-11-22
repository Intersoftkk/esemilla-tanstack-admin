// src/routes/_authed.tsx
import {createFileRoute, Outlet, redirect} from "@tanstack/react-router"
import {getCookie} from "#/lib/cookies"
import {cn} from "#/lib/utils"

import {LayoutProvider} from "#/context/layout-context"
import {SidebarInset, SidebarProvider} from "#/components/ui/sidebar"
import {TooltipProvider} from "#/components/ui/tooltip"
import {AppSidebar} from "#/components/layout/app-sidebar"
import {Header} from "#/components/layout/header"
import {NotificationDropdown} from "#/components/layout/notification-dropdown"
import {ProfileDropdown} from "#/components/layout/profile-dropdown"
import {Main} from "#/components/layout/main"
import {ThemeSwitch} from "#/components/theme-switch.tsx";
import {ConfigDrawer} from "#/components/config-drawer.tsx";
import {authQueryOptions} from "#/features/auth/queries/auth.queries.ts";


export const Route = createFileRoute("/_authed")({
    beforeLoad: async ({ context, location }) => {
        // Run session check once for all child routes
        const user = await context.queryClient.ensureQueryData(
            authQueryOptions.user()
        )

        if (!user) {
            throw redirect({
                to: '/sign-in',
                search: {
                    redirect: location.href,
                },
            })
        }

        return { user }
    },
    component: AuthedLayout,
})

function AuthedLayout() {
    const defaultOpen = getCookie("sidebar_state") !== "false"

    return (
        <LayoutProvider>
            <TooltipProvider>
                <SidebarProvider defaultOpen={defaultOpen}>
                    <AppSidebar/>
                    <SidebarInset
                        className={cn(
                            "@container/content",
                            "has-data-[layout=fixed]:h-svh",
                            "peer-data-[variant=inset]:has-data-[layout=fixed]:h-[calc(100svh-(var(--spacing)*4))]",
                            "relative flex flex-col",
                        )}
                    >
                        <Header fixed>
                            <div className="ms-auto flex items-center space-x-2">
                                <NotificationDropdown/>
                                <ThemeSwitch/>
                                <ConfigDrawer/>
                                <ProfileDropdown/>
                            </div>
                        </Header>

                        <Main className="flex flex-1 flex-col gap-2 p-4 sm:gap-4">
                            <Outlet/>
                        </Main>
                    </SidebarInset>
                </SidebarProvider>
            </TooltipProvider>
        </LayoutProvider>
    )
}