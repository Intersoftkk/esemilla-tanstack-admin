import {Link, useNavigate} from '@tanstack/react-router'
import {Avatar, AvatarFallback, AvatarImage} from '#/components/ui/avatar'
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
import {LogOut, Settings, User} from "lucide-react";
import {useAuth} from "#/features/auth/context/auth.context.tsx";

export function ProfileDropdown() {

    const {user, logout} = useAuth()

    const navigate = useNavigate()

    const handleLogout = async () => {
        await logout()
        const current = encodeURIComponent(window.location.href)
        await navigate({
            to: '/',
            search: {redirect: current},
        })
    }
    return (
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
                <Button variant='ghost' className='relative h-9 w-9 rounded-full'>
                    <Avatar className='h-8 w-8'>
                        <AvatarImage src={user?.avatar ?? undefined} alt={user?.name ?? 'User'} />
                        <AvatarFallback>{user?.name?.[0] ?? 'U'}</AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className='w-56' align='end' forceMount>
                <DropdownMenuLabel className='font-normal'>
                    <div className='flex flex-col space-y-1'>
                        <p className='text-sm leading-none font-medium'>{user?.name}</p>
                        <p className='text-muted-foreground text-xs leading-none'>{user?.email}</p>
                    </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator/>

                <DropdownMenuGroup>
                    <DropdownMenuItem asChild>
                        <Link to='/profile' className='flex items-center justify-between'>
                            <div className='flex items-center gap-2'>
                                <User size={16}/>
                                Profile
                            </div>
                        </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild>
                        <Link to='/settings' className='flex items-center justify-between'>
                            <div className='flex items-center gap-2'>
                                <Settings size={16}/>
                                Settings
                            </div>
                        </Link>
                    </DropdownMenuItem>
                </DropdownMenuGroup>

                <DropdownMenuSeparator/>

                <DropdownMenuItem onClick={handleLogout} className='flex items-center justify-between'>
                    <div className='flex items-center gap-2'>
                        <LogOut size={16}/>
                        Log out
                    </div>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
