'use client'

import {Link, useLocation} from '@tanstack/react-router'
import {ChevronRight} from 'lucide-react'

import {Collapsible, CollapsibleContent, CollapsibleTrigger,} from '#/components/ui/collapsible'

import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    useSidebar,
} from '#/components/ui/sidebar'

import type {NavCollapsible, NavGroup, NavItem, NavLink,} from '#/types/navigation'

/* ---------------------------------------------- */
/* TYPE GUARDS                                     */
/* ---------------------------------------------- */

const isLink = (item: NavItem): item is NavLink => 'href' in item
const isCollapsible = (item: NavItem): item is NavCollapsible =>
    'items' in item && Array.isArray(item.items) && item.items.length > 0

/* ---------------------------------------------- */

interface NavMainProps {
    readonly items: readonly NavGroup[]
}

const ComingSoonLabel = () => (
    <span className="ml-auto rounded-md bg-gray-200 px-2 py-1 text-xs dark:text-gray-800">
    Soon
  </span>
)

/* ---------------------------------------------- */
/* ACTIVE STATE CHECKER (TanStack Version)         */
/* ---------------------------------------------- */

const useActive = () => {
    const {pathname} = useLocation() // <-- TanStack replacement

    const isActive = (item: NavItem): boolean => {
        if (isCollapsible(item)) {
            return item.items.some((child) => isActive(child))
        }

        if (isLink(item) && item.url) {
            return pathname === item.url || pathname.startsWith(item.url)
        }

        return false
    }

    return {isActive}
}

/* ---------------------------------------------- */
/* EXPANDED ITEM                                   */
/* ---------------------------------------------- */

const NavItemExpanded = ({
                             item,
                             isActive,
                         }: {
    item: NavItem
    isActive: (item: NavItem) => boolean
}) => {
    const collapsible = isCollapsible(item)
    const active = isActive(item)

    return (
        <Collapsible
            asChild
            defaultOpen={collapsible && item.items.some((i) => isActive(i))}
            className="group/collapsible"
        >
            <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                    {collapsible ? (
                        <SidebarMenuButton
                            disabled={item.badge === 'soon'}
                            isActive={active}
                        >
                            {item.icon && <item.icon/>}
                            <span>{item.title}</span>
                            {item.badge === 'soon' && <ComingSoonLabel/>}
                            <ChevronRight
                                className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90"/>
                        </SidebarMenuButton>
                    ) : (
                        isLink(item) &&
                        item.url && (
                            <SidebarMenuButton asChild isActive={active}>
                                <Link to={item.url}>
                                    {item.icon && <item.icon/>}
                                    <span>{item.title}</span>
                                    {item.badge === 'soon' && <ComingSoonLabel/>}
                                </Link>
                            </SidebarMenuButton>
                        )
                    )}
                </CollapsibleTrigger>

                {collapsible && (
                    <CollapsibleContent>
                        <SidebarMenuSub>
                            {item.items.map((sub) => {
                                const activeSub = isActive(sub)

                                return (
                                    <SidebarMenuSubItem key={sub.title}>
                                        <SidebarMenuSubButton asChild isActive={activeSub}>
                                            <Link to={isLink(sub) && sub.url ? sub.url : '#'}>
                                                {sub.icon && <sub.icon/>}
                                                <span>{sub.title}</span>
                                                {sub.badge === 'soon' && <ComingSoonLabel/>}
                                            </Link>
                                        </SidebarMenuSubButton>
                                    </SidebarMenuSubItem>
                                )
                            })}
                        </SidebarMenuSub>
                    </CollapsibleContent>
                )}
            </SidebarMenuItem>
        </Collapsible>
    )
}

/* ---------------------------------------------- */
/* COLLAPSED MODE ITEM                             */
/* ---------------------------------------------- */

const NavItemCollapsed = ({
                              item,
                              isActive,
                          }: {
    item: NavItem
    isActive: (item: NavItem) => boolean
}) => {
    const collapsible = isCollapsible(item)
    const active = isActive(item)

    if (!collapsible && isLink(item) && item.url) {
        return (
            <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={active}>
                    <Link to={item.url}>{item.icon && <item.icon/>}</Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
        )
    }

    return (
        <SidebarMenuItem>
            <SidebarMenuButton isActive={active}>
                {item.icon && <item.icon/>}
                <ChevronRight/>
            </SidebarMenuButton>
        </SidebarMenuItem>
    )
}

/* ---------------------------------------------- */
/* MAIN COMPONENT                                  */

/* ---------------------------------------------- */

export function NavMain({items}: NavMainProps) {
    const {isActive} = useActive()
    const {state, isMobile} = useSidebar()

    return (
        <>
            {items.map((group) => (
                <SidebarGroup key={group.title}>
                    {group.title && <SidebarGroupLabel>{group.title}</SidebarGroupLabel>}

                    <SidebarGroupContent className="flex flex-col gap-2">
                        <SidebarMenu>
                            {group.items.map((item) =>
                                state === 'collapsed' && !isMobile ? (
                                    <NavItemCollapsed
                                        key={item.title}
                                        item={item}
                                        isActive={isActive}
                                    />
                                ) : (
                                    <NavItemExpanded
                                        key={item.title}
                                        item={item}
                                        isActive={isActive}
                                    />
                                ),
                            )}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            ))}
        </>
    )
}
