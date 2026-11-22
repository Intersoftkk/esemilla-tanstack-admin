import { APP_CONFIG } from "@/config/app.config"
import { Button } from "@/components/ui/button"
import { Link, useNavigate } from "@tanstack/react-router"

export default function HomePage() {
    const { user, logout } = useAuth()
    const navigate = useNavigate()

    const handleLogout = async () => {
        await logout()
        await navigate({ to: "/" })
    }

    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-linear-to-br from-violet-50 via-white to-indigo-50 p-4">
            {/* Background Orbs */}
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute -left-40 -top-40 size-80 animate-pulse rounded-full bg-linear-to-br from-indigo-400/20 to-purple-400/20 blur-3xl" />
                <div className="absolute -bottom-40 -right-40 size-96 animate-pulse rounded-full bg-linear-to-tl from-pink-400/20 to-violet-400/20 blur-3xl" />
            </div>

            {/* Main Card */}
            <div className="relative z-10 w-full max-w-4xl rounded-lg border-0 bg-white/90 backdrop-blur-xl ring-1 ring-black/5">
                <div className="flex flex-col items-center gap-8 p-6 text-center sm:p-10 lg:p-16">
                    {/* Header */}
                    <header className="space-y-4">
                        <h1 className="text-3xl font-black tracking-tighter sm:text-5xl lg:text-7xl">
                            {APP_CONFIG.name}
                        </h1>
                        <p className="text-lg font-medium text-muted-foreground sm:text-xl">
                            {APP_CONFIG.tagline}
                        </p>
                        <p className="mx-auto max-w-2xl text-sm text-muted-foreground sm:text-base">
                            {APP_CONFIG.subheadline}
                        </p>
                    </header>

                    {/* Auth Actions */}
                    {user ? (
                        <div className="space-y-6">
                            <div>
                                <p className="text-lg text-muted-foreground">Welcome back</p>
                                <p className="text-2xl font-bold sm:text-3xl">
                                    {user.name || user.email}
                                </p>
                            </div>
                            <div className="flex flex-col gap-3 sm:flex-row">
                                <Button asChild size="lg">
                                    <Link to="/dashboard">Open Dashboard</Link>
                                </Button>
                                <Button variant="outline" size="lg" onClick={handleLogout}>
                                    Log out
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-3 sm:flex-row">
                            <Button asChild size="lg">
                                <Link to="/sign-in">{APP_CONFIG.cta.login}</Link>
                            </Button>
                            <Button asChild variant="outline" size="lg">
                                <a
                                    href={APP_CONFIG.links.docs}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    View Docs
                                </a>
                            </Button>
                        </div>
                    )}

                    {/* Features Grid */}
                    <div className="grid w-full max-w-3xl grid-cols-2 gap-3 md:grid-cols-4">
                        {APP_CONFIG.features.map((feature) => (
                            <div
                                key={feature}
                                className="rounded-lg bg-muted/50 px-4 py-3 text-xs font-medium text-muted-foreground sm:text-sm"
                            >
                                {feature}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}