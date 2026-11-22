// src/hooks/use-echo.ts
import { useEffect } from 'react'
import { echo } from '#/echo'

export function useEcho() {
    return echo
}

interface UseEchoPrivateChannelProps<T = any> {
    channel: string | null | undefined
    event: string
    callback: (data: T) => void
}

/**
 * Hook to automatically subscribe to a private channel and clean up on unmount
 */
export function useEchoPrivateChannel<T = any>({
                                                   channel,
                                                   event,
                                                   callback,
                                               }: UseEchoPrivateChannelProps<T>) {
    useEffect(() => {
        if (!echo || !channel) return

        const echoInstance = echo
        const privateChannel = echoInstance.private(channel)

        if (event === 'notification') {
            privateChannel.notification(callback)
        } else {
            privateChannel.listen(event, callback)
        }

        return () => {
            echoInstance.leave(channel)
        }
    }, [channel, event, callback])
}