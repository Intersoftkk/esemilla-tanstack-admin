// src/config/layout.config
import type {
    ContentLayout,
    ContentWidth,
    NavbarStyle,
    SidebarCollapsible,
    SidebarVariant,
    ThemeColor,
    ThemeRadius,
    ThemeScale,
} from '#/types/layout'

export const CONTENT_WIDTH_VALUES: Array<ContentWidth> = ['centered', 'full-width']
export const NAVBAR_STYLE_VALUES: Array<NavbarStyle> = ['sticky', 'scroll']
export const SIDEBAR_VARIANT_VALUES: Array<SidebarVariant> = [
    'inset',
    'sidebar',
    'floating',
]
export const SIDEBAR_COLLAPSIBLE_VALUES: Array<SidebarCollapsible> = [
    'icon',
    'offcanvas',
    'none',
]
export const THEME_RADIUS_VALUES: Array<ThemeRadius> = [
    'none',
    'sm',
    'md',
    'lg',
    'full',
]
export const THEME_SCALE_VALUES: Array<ThemeScale> = ['sm', 'md', 'lg']
export const CONTENT_LAYOUT_VALUES: Array<ContentLayout> = ['vertical', 'horizontal']
export const THEME_COLOR_VALUES: Array<ThemeColor> = [
    'default',
    'blue',
    'green',
    'orange',
    'red',
    'purple',
]

export const DEFAULT_PREFERENCES = {
    theme: 'light',
    theme_color: 'default',
    content_layout: 'vertical',
    content_width: 'centered',
    navbar_style: 'scroll',
    sidebar_variant: 'inset',
    sidebar_collapsible: 'icon',
    radius: 'md',
    scale: 'md',
} as const
