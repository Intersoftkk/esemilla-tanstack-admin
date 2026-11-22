import {Link} from "@tanstack/react-router";
import {SignInForm} from "#/features/auth/components/sign-in-form";
import {ArrowLeft, CheckCircle2, GraduationCap, ShieldCheck, Sparkles} from "lucide-react";

interface SignInPageProps {
    search?: {
        redirect?: string;
    };
}

export function SignInPage({search}: SignInPageProps) {
    return (
        <div
            className="min-h-screen w-full grid lg:grid-cols-2 bg-background font-sans antialiased selection:bg-primary/20">
            {/* Left Column: Visual & Branding Showcase (Desktop only) */}
            <div
                className="relative hidden lg:flex flex-col justify-between p-12 bg-zinc-950 text-white overflow-hidden">
                {/* Ambient Glow Gradients */}
                <div
                    className="absolute -top-28 -left-28 w-96 h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none"/>
                <div
                    className="absolute -bottom-28 -right-28 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"/>

                {/* Subtle Background Pattern */}
                <div
                    className="absolute inset-0 opacity-[0.03] pointer-events-none"
                    style={{
                        backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
                        backgroundSize: "24px 24px",
                    }}
                />

                {/* Brand Header & Back Link */}
                <div className="relative z-10 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-3 group">
                        <div
                            className="h-11 w-11 rounded-xl bg-linear-to-tr from-primary to-indigo-500 flex items-center justify-center shadow-lg shadow-primary/30 ring-1 ring-white/20 group-hover:scale-105 transition-transform">
                            <GraduationCap className="h-6 w-6 text-white"/>
                        </div>
                        <span
                            className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-linear-to-r from-white to-zinc-400">
                            SchoolPortal<span className="text-primary">.</span>
                        </span>
                    </Link>

                    <Link
                        to="/"
                        className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors py-1.5 px-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10"
                    >
                        <ArrowLeft className="w-3.5 h-3.5"/>
                        Back to Home
                    </Link>
                </div>

                {/* Center Content / Highlights */}
                <div className="relative z-10 space-y-6 max-w-md my-auto">
                    <div
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-medium text-zinc-200">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400"/>
                        <span>Next-Gen School Management</span>
                    </div>

                    <h1 className="text-4xl xl:text-5xl font-extrabold tracking-tight leading-[1.15]">
                        Empowering schools, teachers & students.
                    </h1>

                    <p className="text-zinc-400 text-base leading-relaxed">
                        Access your administrative dashboard, student grades, attendance, and analytics all in one
                        unified workspace.
                    </p>

                    <div className="pt-2 space-y-3">
                        {[
                            "End-to-end encrypted student records",
                            "Real-time attendance & grade tracking",
                            "Multi-campus administration support",
                        ].map((feature, idx) => (
                            <div key={idx} className="flex items-center gap-2.5 text-sm text-zinc-300">
                                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0"/>
                                <span>{feature}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom Trust Badge */}
                <div
                    className="relative z-10 pt-8 border-t border-white/10 flex items-center justify-between text-xs text-zinc-400">
                    <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-emerald-400"/>
                        <span>Enterprise-Grade Security & Privacy</span>
                    </div>
                    <span>© {new Date().getFullYear()} SchoolPortal</span>
                </div>
            </div>

            {/* Right Column: Sign In Form Container */}
            <div className="flex flex-col justify-center items-center p-6 sm:p-10 lg:p-16 dark:bg-zinc-900/30">
                <div className="w-full max-w-md mx-auto space-y-6">
                    {/* Mobile-Only Header */}
                    <div className="flex lg:hidden flex-col items-center gap-2 text-center pb-2">
                        <Link to="/" className="flex flex-col items-center gap-2">
                            <div
                                className="h-11 w-11 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-md shadow-primary/20">
                                <GraduationCap className="h-6 w-6"/>
                            </div>
                            <span className="text-xl font-bold tracking-tight">
                                SchoolPortal<span className="text-primary">.</span>
                            </span>
                        </Link>
                    </div>

                    {/* Card Container for SignInForm */}
                    <div
                        className="bg-card text-card-foreground border border-border/80 shadow-xl shadow-zinc-950/5 rounded-2xl backdrop-blur-sm overflow-hidden">
                        <SignInForm search={search}/>
                    </div>

                    {/* Legal / Policy Footer */}
                    <p className="text-center text-xs text-muted-foreground px-6">
                        By logging in, you agree to our{" "}
                        <a href="#" className="underline underline-offset-4 hover:text-foreground transition-colors">
                            Terms of Service
                        </a>{" "}
                        and{" "}
                        <a href="#" className="underline underline-offset-4 hover:text-foreground transition-colors">
                            Privacy Policy
                        </a>
                        .
                    </p>
                </div>
            </div>
        </div>
    );
}