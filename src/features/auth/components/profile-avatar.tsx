// src/features/auth/components/profile-avatar.tsx

import { useRef, useState } from 'react'
import { Camera, Trash2, Loader2, User } from 'lucide-react'
import { toast } from 'sonner'
import {
    useUpdateProfileMutation,
    useDeleteAvatarMutation,
} from '#/features/auth/queries/auth.queries'
import type { AuthUser } from '#/features/auth/types/auth.types'

interface ProfileAvatarProps {
    profile: AuthUser
}

export function ProfileAvatar({ profile }: ProfileAvatarProps) {
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [preview, setPreview] = useState<string | null>(null)

    const updateProfileMutation = useUpdateProfileMutation()
    const deleteAvatarMutation = useDeleteAvatarMutation()

    const initials = `${profile.firstName?.charAt(0) ?? ''}${profile.lastName?.charAt(0) ?? ''}`.toUpperCase()
    const displayUrl = preview || profile.avatar
    const isLoading = updateProfileMutation.isPending || deleteAvatarMutation.isPending

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        if (!file.type.startsWith('image/')) {
            toast.error('Please select an image file')
            return
        }
        if (file.size > 5 * 1024 * 1024) {
            toast.error('Image must be less than 5MB')
            return
        }

        const reader = new FileReader()
        reader.onloadend = async () => {
            const base64 = reader.result as string
            setPreview(base64)

            try {
                // Matches the shape required by ProfileFormValues (Resolves TS2353/TS2322)
                await updateProfileMutation.mutateAsync({
                    firstName: profile.firstName ?? '',
                    lastName: profile.lastName ?? '',
                    phone: profile.phone ?? profile.mobile ?? '',
                    bio: profile.bio ?? '',
                    avatar: base64,
                    dateOfBirth: profile.dateOfBirth,
                    address: {
                        street: profile.address?.street ?? '',
                        city: profile.address?.city ?? '',
                        state: profile.address?.state ?? '',
                        zipCode: profile.address?.zipCode ?? '',
                        country: profile.address?.country ?? '',
                    },
                })
                toast.success('Profile picture updated successfully')
            } catch {
                setPreview(null)
                toast.error('Failed to update profile picture')
            }
        }
        reader.readAsDataURL(file)

        if (fileInputRef.current) fileInputRef.current.value = ''
    }

    const handleDelete = async () => {
        try {
            await deleteAvatarMutation.mutateAsync()
            setPreview(null)
            toast.success('Avatar removed')
        } catch {
            toast.error('Failed to remove avatar')
        }
    }

    return (
        <div className="flex flex-col sm:flex-row items-center gap-6 pb-6">
            <div className="relative group">
                <div className="h-24 w-24 overflow-hidden rounded-full border border-border bg-muted shadow-sm">
                    {displayUrl ? (
                        <img
                            src={displayUrl}
                            alt={`${profile.firstName} ${profile.lastName}`}
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center bg-secondary text-secondary-foreground text-2xl font-semibold">
                            {initials || <User className="h-8 w-8 text-muted-foreground" />}
                        </div>
                    )}
                    {isLoading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-background/75">
                            <Loader2 className="h-5 w-5 animate-spin text-primary" />
                        </div>
                    )}
                </div>

                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isLoading}
                    className="absolute bottom-0 right-0 rounded-full border border-border bg-background p-1.5 text-foreground shadow-sm hover:bg-muted disabled:opacity-50 transition-colors"
                    aria-label="Change avatar"
                >
                    <Camera className="h-3.5 w-3.5" />
                </button>

                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={handleFileChange}
                    className="hidden"
                />
            </div>

            <div className="text-center sm:text-left space-y-1.5">
                <h4 className="text-sm font-semibold leading-none text-foreground">Profile Picture</h4>
                <p className="text-xs text-muted-foreground">JPEG, PNG or WebP format. Up to 5MB.</p>
                {displayUrl && (
                    <button
                        type="button"
                        onClick={handleDelete}
                        disabled={isLoading}
                        className="inline-flex items-center gap-1.5 text-xs text-destructive hover:underline disabled:opacity-50 font-medium"
                    >
                        <Trash2 className="h-3.5 w-3.5" />
                        Remove photo
                    </button>
                )}
            </div>
        </div>
    )
}