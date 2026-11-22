import { createClientOnlyFn } from '@tanstack/react-start'
import { configureEcho, echo, echoIsConfigured } from '@laravel/echo-react'
import type { ChannelAuthorizationCallback } from 'pusher-js'
import Pusher from 'pusher-js'
import { env } from '#/env'

function createAuthorizer(channel: { name: string }) {
    return {
        authorize(socketId: string, callback: ChannelAuthorizationCallback) {
            fetch('/api/broadcasting/auth', {
                method: 'POST',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                body: JSON.stringify({
                    socket_id: socketId,
                    channel_name: channel.name,
                }),
            })
                .then(async (res) => {
                    if (!res.ok) {
                        const err = await res.json().catch(() => null)
                        throw new Error(
                            err?.message ?? `Broadcasting auth failed (${res.status})`,
                        )
                    }
                    return res.json()
                })
                .then((data) => callback(null, data))
                .catch((err) =>
                    callback(
                        err instanceof Error ? err : new Error('Authorization failed'),
                        null,
                    ),
                )
        },
    }
}

export const setupEcho = createClientOnlyFn(() => {
    ;(window as unknown as { Pusher: typeof Pusher }).Pusher = Pusher
    if (echoIsConfigured()) return

    const port = Number(env.VITE_REVERB_PORT ?? 8080)
    const scheme = env.VITE_REVERB_SCHEME ?? 'https'
    configureEcho({
        broadcaster: 'reverb',
        key: env.VITE_REVERB_APP_KEY ?? '',
        wsHost: env.VITE_REVERB_HOST ?? window.location.hostname,
        wsPort: port,
        wssPort: port,
        forceTLS: scheme === 'https',
        enabledTransports: ['ws', 'wss'],
        authorizer: createAuthorizer,
    })
})

export const connectEcho = createClientOnlyFn(() => {
    setupEcho()
    try {
        echo().connect()
    } catch {
        /* already connected */
    }
})

export const disconnectEcho = createClientOnlyFn(() => {
    if (!echoIsConfigured()) return
    try {
        echo().disconnect()
    } catch {
        /* already disconnected */
    }
})

export const getEcho = createClientOnlyFn(() =>
    echoIsConfigured() ? echo() : null,
)
