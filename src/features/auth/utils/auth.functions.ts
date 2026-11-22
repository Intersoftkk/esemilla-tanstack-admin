import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'
import { apiBaseUrl } from '#/lib/axios'
import type { AuthUser, UserResponse } from '#/features/auth/types/auth.types'

function getCookieValue(cookieHeader: string, name: string): string | null {
    const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`))
    return match ? decodeURIComponent(match[1]) : null
}

export const fetchCurrentUserServerFn = createServerFn({ method: 'GET' }).handler(
    async (): Promise<AuthUser | null> => {
        try {
            const req = getRequest()
            if (!req) return null

            const cookie = req.headers.get('cookie') ?? ''
            if (!cookie) return null

            // Prefer explicit frontend origin (must match SANCTUM_STATEFUL_DOMAINS)
            const host = req.headers.get('host') ?? 'localhost:3000'
            const proto = req.headers.get('x-forwarded-proto') ?? 'http'
            const frontendOrigin =
                req.headers.get('origin') ??
                (req.headers.get('referer') ? new URL(req.headers.get('referer')!).origin : null) ??
                `${proto}://${host}`

            const xsrfToken = getCookieValue(cookie, 'XSRF-TOKEN')

            const headers: Record<string, string> = {
                Cookie: cookie,
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                Origin: frontendOrigin,
                Referer: frontendOrigin,
            }

            if (xsrfToken) {
                headers['X-XSRF-TOKEN'] = xsrfToken
            }

            const res = await fetch(`${apiBaseUrl}/user/me`, {
                method: 'GET',
                headers,
                // credentials has no effect in Node fetch for auth; Cookie header is what matters
            })

            if (!res.ok) {
                console.error('SSR /user/me failed:', res.status, await res.text().catch(() => ''))
                return null
            }

            const json: UserResponse = await res.json()
            return json.data ?? null
        } catch (error) {
            console.error('SSR Session Fetch Failed:', error)
            return null
        }
    },
)