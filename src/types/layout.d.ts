/**
 * Core theme modes supported by the application.
 */
export type ThemeMode = 'light' | 'dark'

/**
 * Visual variants for the application sidebar.
 */
export type SidebarVariant = 'inset' | 'sidebar' | 'floating'

/**
 * Behavior of the sidebar when collapsed.
 */
export type SidebarCollapsible = 'icon' | 'offcanvas' | 'none'

/**
 * Maximum width constraints for the main content area.
 */
export type ContentWidth = 'centered' | 'full-width'

/**
 * Scrolling behavior of the top navigation bar.
 */
export type NavbarStyle = 'sticky' | 'scroll'

/**
 * Primary architectural layout direction.
 */
export type ContentLayout = 'vertical' | 'horizontal'

/**
 * Border radius presets for UI components.
 */
export type ThemeRadius = 'none' | 'sm' | 'md' | 'lg' | 'full'

/**
 * Global UI scaling (spacing and font-size adjustments).
 */
export type ThemeScale = 'sm' | 'md' | 'lg'

export type ThemeColor =
    | 'default'
    | 'blue'
    | 'green'
    | 'orange'
    | 'red'
    | 'purple'

/**
 * Unified interface representing all user-configurable appearance settings.
 * This should match the structure returned by your Root Route loader.
 */
export interface LayoutPreferences {
    theme: ThemeMode
    theme_color: ThemeColor
    content_layout: ContentLayout
    content_width: ContentWidth
    navbar_style: NavbarStyle
    sidebar_variant: SidebarVariant
    sidebar_collapsible: SidebarCollapsible
    radius: ThemeRadius
    scale: ThemeScale
}
