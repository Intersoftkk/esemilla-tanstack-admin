'use client'

import { useLayout } from "#/context/layout-context"
import {
    Sidebar,
    SidebarContent,
    SidebarHeader,
    SidebarMenuButton,
    SidebarRail,
} from "#/components/ui/sidebar"
import Logo from '#/assets/logo.svg'
import { NavGroup } from "#/components/layout/nav-group"
import { APP_CONFIG } from "#/config/app.config.ts"
import {adminNavigation} from "#/config/menu.config.ts";

export function AppSidebar() {
    const { collapsible, variant } = useLayout()

    return (
        <Sidebar collapsible={collapsible} variant={variant}>
            <SidebarHeader>
                <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                    <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                        <img
                            src={Logo}
                            className="relative m-auto bg-background"
                            width={301}
                            height={60}
                            alt="Intersoft"
                        />
                    </div>
                    <div className="grid flex-1 text-left leading-tight">
                        <span className="truncate text-sm font-semibold tracking-tight">
                            {APP_CONFIG.name}
                        </span>

                        <div className="flex items-center gap-2">
                            <span className="inline-flex items-center rounded-md border bg-background/60 px-2 py-0.5 font-medium text-muted-foreground">
                                v{APP_CONFIG.version}
                            </span>
                        </div>
                    </div>
                </SidebarMenuButton>
            </SidebarHeader>

            <SidebarContent>
                {/* Main Navigation */}
                {adminNavigation?.map((group) => (
                    <NavGroup key={group.title} {...group} />
                ))}
            </SidebarContent>

            <SidebarRail />
        </Sidebar>
    )
}