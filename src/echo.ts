// src/echo.ts
import Echo from 'laravel-echo'
import Pusher from 'pusher-js'
import api from '#/lib/axios'
import { env } from '#/env'

declare global {
    interface Window {
        Pusher: typeof Pusher
        Echo: Echo<any>
    }
}

function createEchoInstance(): Echo<any> | null {
    // Return null on the server (SSR)
    if (typeof window === 'undefined') {
        return null
    }

    // Attach Pusher to window in the browser
    window.Pusher = Pusher

    const wsHost =
        env.VITE_REVERB_HOST ||
        (typeof window !== 'undefined' ? window.location.hostname : 'localhost')

    const instance = new Echo({
        broadcaster: 'reverb', // or 'pusher'
        key: env.VITE_REVERB_APP_KEY ?? env.VITE_PUSHER_APP_KEY ?? '',
        wsHost: wsHost,
        wsPort: Number(env.VITE_REVERB_PORT ?? 8080),
        wssPort: Number(env.VITE_REVERB_PORT ?? 443),
        forceTLS: (env.VITE_REVERB_SCHEME ?? 'https') === 'https',
        enabledTransports: ['ws', 'wss'],

        /**
         * Custom authorizer using Axios with cookies (Sanctum)
         */
        authorizer: (channel: { name: string }) => {
            return {
                authorize: (
                    socketId: string,
                    callback: (error: Error | null, authData: any) => void,
                ) => {
                    api.post('broadcasting/auth', {
                        socket_id: socketId,
                        channel_name: channel.name,
                    })
                        .then((response) => {
                            callback(null, response.data)
                        })
                        .catch((error) => {
                            const err =
                                error instanceof Error ? error : new Error(String(error))
                            callback(err, null)
                        })
                },
            }
        },
    })

    window.Echo = instance
    return instance
}

export const echo = createEchoInstance()

export default echo