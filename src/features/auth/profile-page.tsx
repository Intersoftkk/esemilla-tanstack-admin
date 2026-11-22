// src/features/auth/profile-page.tsx

import { AlertCircle, RefreshCw, KeyRound } from 'lucide-react'
import { useAuthUserQuery } from '#/features/auth/queries/auth.queries'
import { ProfileAvatar } from '#/features/auth/components/profile-avatar'
import { ProfileForm } from '#/features/auth/components/profile-form'
import { ChangePasswordForm } from '#/features/auth/components/change-password-form'
import { ProfileSkeleton } from '#/features/auth/components/profile-skeleton'

export function ProfilePage() {
    const { data: profile, isLoading, isError, error, refetch } = useAuthUserQuery()

    return (
        <div className="min-h-screen bg-background">
            <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8 space-y-10">

                {/* Dashboard Title Header */}
                <div className="border-b border-border pb-6">
                    <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                        Account Settings
                    </h1>
                    <p className="mt-1.5 text-sm text-muted-foreground">
                        Manage your personal profile, secure workspace settings, and address records.
                    </p>
                </div>

                {/* Loading Shell */}
                {isLoading && <ProfileSkeleton />}

                {/* Error Handling View */}
                {isError && (
                    <div className="flex flex-col items-center justify-center py-20 text-center border border-border rounded-xl bg-card">
                        <div className="rounded-full bg-destructive/10 p-3 text-destructive">
                            <AlertCircle className="h-8 w-8" />
                        </div>
                        <h3 className="mt-4 text-base font-semibold text-foreground">
                            Failed to load profile settings
                        </h3>
                        <p className="mt-1 text-sm text-muted-foreground max-w-sm text-balance">
                            {error?.message || 'An unexpected database error occurred. Please try again.'}
                        </p>
                        <button
                            onClick={() => refetch()}
                            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/95 transition-all"
                        >
                            <RefreshCw className="h-4 w-4" />
                            Reload Workspace Settings
                        </button>
                    </div>
                )}

                {profile && (
                    <div className="space-y-12">

                        {/* ── Section: Picture & Details ── */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div>
                                <h3 className="text-base font-semibold leading-6 text-foreground">Workspace Profile</h3>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    Your workspace profile picture is visible to other team members and system directories.
                                </p>
                            </div>
                            <div className="lg:col-span-2 rounded-xl border border-border bg-card p-6 shadow-sm">
                                <ProfileAvatar profile={profile} />
                            </div>
                        </div>

                        <hr className="border-border" />

                        {/* ── Section: Main Settings Form (Details & Address) ── */}
                        <ProfileForm profile={profile} />

                        <hr className="border-border" />

                        {/* ── Section: Security & Credentials ── */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="space-y-1">
                                <h3 className="text-base font-semibold leading-6 text-foreground flex items-center gap-2">
                                    <KeyRound className="h-4 w-4 text-muted-foreground" />
                                    Workspace Credentials
                                </h3>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    Ensure your account security requirements are updated using modern passwords.
                                </p>
                            </div>

                            <div className="lg:col-span-2 rounded-xl border border-border bg-card p-6 shadow-sm">
                                <ChangePasswordForm />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}