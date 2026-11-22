// src/hooks/use-echo.ts
import { useEffect, useRef, useState } from 'react'
import Echo from 'laravel-echo'
import Pusher from 'pusher-js'
import { broadcastAuthFn } from '#/server/broadcasting.function.ts'

declare global {
  interface Window {
    Pusher: typeof Pusher
    Echo: Echo<any>
  }
}

let echoInstance: Echo<any> | null = null

export function getEcho(): Echo<any> | null {
  if (typeof window === 'undefined') return null

  if (!echoInstance) {
    window.Pusher = Pusher

    echoInstance = new Echo({
      broadcaster: 'reverb',
      key: import.meta.env.VITE_REVERB_APP_KEY,
      wsHost: import.meta.env.VITE_REVERB_HOST || 'ws.esemilla.link',
      wsPort: Number(import.meta.env.VITE_REVERB_PORT ?? 80),
      wssPort: Number(import.meta.env.VITE_REVERB_PORT ?? 443),
      forceTLS: (import.meta.env.VITE_REVERB_SCHEME ?? 'https') === 'https',
      enabledTransports: ['ws', 'wss'],
      authorizer: (channel: { name: string }) => ({
        authorize: async (
          socketId: string,
          callback: (error: Error | null, authData: any) => void,
        ) => {
          try {
            const authData = await broadcastAuthFn({
              data: {
                socket_id: socketId,
                channel_name: channel.name,
              },
            })
            callback(null, authData)
          } catch (error) {
            callback(error as Error, null)
          }
        },
      }),
    })
  }

  return echoInstance
}

/**
 * Hook for subscribing to a private WebSocket channel
 */
export function usePrivateChannel<T = any>(
  channelName: string | null | undefined,
  event: string,
  callback: (data: T) => void,
) {
  const callbackRef = useRef(callback)
  callbackRef.current = callback

  useEffect(() => {
    if (!channelName) return

    const echo = getEcho()
    if (!echo) return

    const channel = echo.private(channelName)
    const handler = (data: T) => callbackRef.current(data)

    channel.listen(event, handler)

    return () => {
      channel.stopListening(event, handler)
      echo.leave(`private-${channelName}`)
    }
  }, [channelName, event])
}

/**
 * Hook for subscribing to a presence WebSocket channel
 */
export function usePresenceChannel<T = any>(
  channelName: string | null | undefined,
) {
  const [members, setMembers] = useState<T[]>([])

  useEffect(() => {
    if (!channelName) return

    const echo = getEcho()
    if (!echo) return

    const channel = echo.join(channelName)

    channel
      .here((users: T[]) => setMembers(users))
      .joining((user: T) => setMembers((prev) => [...prev, user]))
      .leaving((user: T & { id: string | number }) =>
        setMembers((prev: any[]) => prev.filter((m) => m.id !== user.id)),
      )

    return () => {
      echo.leave(`presence-${channelName}`)
    }
  }, [channelName])

  return members
}

/**
 * Disconnect Echo on logout
 */
export function disconnectEcho() {
  if (echoInstance) {
    echoInstance.disconnect()
    echoInstance = null
  }
}
