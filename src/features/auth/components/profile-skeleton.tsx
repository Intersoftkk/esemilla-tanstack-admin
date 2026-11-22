// src/features/profile/components/profile-skeleton.tsx

export function ProfileSkeleton() {
    return (
        <div className="animate-pulse space-y-12">
            {/* Profile Details Block */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="space-y-2">
                    <div className="h-5 w-40 rounded bg-muted" />
                    <div className="h-4 w-60 rounded bg-muted" />
                </div>
                <div className="lg:col-span-2 rounded-xl border border-border p-6 space-y-6">
                    <div className="flex items-center gap-4">
                        <div className="h-16 w-16 rounded-full bg-muted" />
                        <div className="space-y-2">
                            <div className="h-4 w-32 rounded bg-muted" />
                            <div className="h-3.5 w-48 rounded bg-muted" />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="space-y-2">
                                <div className="h-3 w-20 rounded bg-muted" />
                                <div className="h-10 w-full rounded-md bg-muted" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <hr className="border-border" />

            {/* Address Block */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="space-y-2">
                    <div className="h-5 w-40 rounded bg-muted" />
                    <div className="h-4 w-60 rounded bg-muted" />
                </div>
                <div className="lg:col-span-2 rounded-xl border border-border p-6 space-y-4">
                    <div className="space-y-2">
                        <div className="h-3 w-24 rounded bg-muted" />
                        <div className="h-10 w-full rounded-md bg-muted" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="space-y-2">
                                <div className="h-3 w-16 rounded bg-muted" />
                                <div className="h-10 w-full rounded-md bg-muted" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}