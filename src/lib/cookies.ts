import { createClientOnlyFn, createIsomorphicFn } from "@tanstack/react-start";
import { getCookie as getRequestCookie } from "@tanstack/react-start/server";

const DEFAULT_MAX_AGE = 60 * 60 * 24 * 7 // 7 days

/**
 * Get a cookie value by name
 */
export const getCookie = createIsomorphicFn()
  .server((name: string) => getRequestCookie(name))
  .client((name: string): string | undefined => {
    const value = `; ${document.cookie}`
    const parts = value.split(`; ${name}=`)
    if (parts.length === 2) {
        return parts.pop()?.split(';').shift()
    }
    return undefined
  })

/**
 * Set a cookie with name, value, and optional max age
 */
export const setCookie = createClientOnlyFn((
    name: string,
    value: string,
    maxAge: number = DEFAULT_MAX_AGE,
): void => {
    // biome-ignore lint/suspicious/noDocumentCookie: layout preferences need a plain cookie
    document.cookie = `${name}=${value}; path=/; max-age=${maxAge}`
})

/**
 * Remove a cookie by setting  max age to 0
 */
export const removeCookie = createClientOnlyFn((name: string): void => {
    // biome-ignore lint/suspicious/noDocumentCookie: layout preferences need a plain cookie
    document.cookie = `${name}=; path=/; max-age=0`
})
