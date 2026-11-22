import React, { createContext, useContext, useEffect, useState } from 'react'
import { getCookie, setCookie } from '#/lib/cookies'

export type Collapsible = 'offcanvas' | 'icon' | 'none'
export type Variant = 'inset' | 'sidebar' | 'floating'

const LAYOUT_COLLAPSIBLE_COOKIE_NAME = 'layout_collapsible'
const LAYOUT_VARIANT_COOKIE_NAME = 'layout_variant'
const LAYOUT_COOKIE_MAX_AGE = 60 * 60 * 24 * 7 // 7 days

const DEFAULT_VARIANT: Variant = 'inset'
const DEFAULT_COLLAPSIBLE: Collapsible = 'icon'



function isCollapsible(value: string | undefined): value is Collapsible {
  return value === 'offcanvas' || value === 'icon' || value === 'none'
}

function isVariant(value: string | undefined): value is Variant {
  return value === 'inset' || value === 'sidebar' || value === 'floating'
}

type LayoutContextType = {
  resetLayout: () => void
  defaultCollapsible: Collapsible
  collapsible: Collapsible
  setCollapsible: (collapsible: Collapsible) => void
  defaultVariant: Variant
  variant: Variant
  setVariant: (variant: Variant) => void
}

const LayoutContext = createContext<LayoutContextType | null>(null)

type LayoutProviderProps = {
  children: React.ReactNode
}

export function LayoutProvider({ children }: LayoutProviderProps) {
  // Start from the same defaults on the server and client; browser-only
  // preferences are restored after hydration to avoid mismatched markup.
  const [collapsible, _setCollapsible] =
    useState<Collapsible>(DEFAULT_COLLAPSIBLE)
  const [variant, _setVariant] = useState<Variant>(DEFAULT_VARIANT)

  useEffect(() => {
    const savedCollapsible = getCookie(LAYOUT_COLLAPSIBLE_COOKIE_NAME)
    if (isCollapsible(savedCollapsible)) {
      _setCollapsible(savedCollapsible)
    }

    const savedVariant = getCookie(LAYOUT_VARIANT_COOKIE_NAME)
    if (isVariant(savedVariant)) {
      _setVariant(savedVariant)
    }
  }, [])

  const setCollapsible = (newCollapsible: Collapsible) => {
    _setCollapsible(newCollapsible)
    setCookie(
      LAYOUT_COLLAPSIBLE_COOKIE_NAME,
      newCollapsible,
      LAYOUT_COOKIE_MAX_AGE,
    )
  }

  const setVariant = (newVariant: Variant) => {
    _setVariant(newVariant)
    setCookie(LAYOUT_VARIANT_COOKIE_NAME, newVariant, LAYOUT_COOKIE_MAX_AGE)
  }

  const resetLayout = () => {
    setCollapsible(DEFAULT_COLLAPSIBLE)
    setVariant(DEFAULT_VARIANT)
  }

  const contextValue: LayoutContextType = {
    resetLayout,
    defaultCollapsible: DEFAULT_COLLAPSIBLE,
    collapsible,
    setCollapsible,
    defaultVariant: DEFAULT_VARIANT,
    variant,
    setVariant,
  }

  return <LayoutContext value={contextValue}>{children}</LayoutContext>
}

export function useLayout() {
  const context = useContext(LayoutContext)
  if (!context) {
    throw new Error('useLayout must be used within a LayoutProvider')
  }
  return context
}
