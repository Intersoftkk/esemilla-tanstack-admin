import {useState} from 'react'
import {Bell} from 'lucide-react'
import {Link} from '@tanstack/react-router'
import {useMutation} from '@tanstack/react-query'
import type {NotificationRecord} from '#/types/notification'
import {Button} from '#/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '#/components/ui/dropdown-menu'
import {Badge} from '#/components/ui/badge'
import {markAllNotificationsAsRead} from '#/features/notification/services/notification.service'

export function NotificationDropdown() {
    // Local state instead of useQuery
    const [notifications, setNotifications] = useState<Array<NotificationRecord>>([])

    // Mutation: mark all as read
    const {mutate: handleMarkAllRead, isPending: isMarking} = useMutation({
        mutationFn: markAllNotificationsAsRead,
        onSuccess: () => {
            setNotifications([]) // clear locally
        },
    })

    return (
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Bell className="h-5 w-5"/>
                    {notifications.length > 0 && (
                        <Badge
                            variant="destructive"
                            className="absolute -top-1 -right-1 h-5 w-5 rounded-full flex items-center justify-center text-[10px] p-0"
                        >
                            {notifications.length}
                        </Badge>
                    )}
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-72" align="end" forceMount>
                {/* Header with Mark all */}
                <DropdownMenuLabel className="font-normal flex justify-between items-center">
                    <span>Notifications</span>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2 text-xs"
                        onClick={() => handleMarkAllRead()}
                        disabled={isMarking || notifications.length === 0}
                    >
                        Mark all as read
                    </Button>
                </DropdownMenuLabel>

                <DropdownMenuSeparator/>

                {/* Notifications list */}
                <DropdownMenuGroup>
                    {notifications.length > 0 ? (
                        notifications.map((n) => (
                            <DropdownMenuItem
                                key={n.id}
                                className="flex flex-col items-start"
                            >
                                <span className="text-sm font-medium">{n.data.subject}</span>
                                <span className="text-xs text-muted-foreground">
                  {n.data.description}
                </span>
                            </DropdownMenuItem>
                        ))
                    ) : (
                        <DropdownMenuItem disabled>No new notifications</DropdownMenuItem>
                    )}
                </DropdownMenuGroup>

                <DropdownMenuSeparator/>

                {/* Footer link */}
                <DropdownMenuItem asChild>
                    <Link to="/notification" className="w-full">
                        View all
                    </Link>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
