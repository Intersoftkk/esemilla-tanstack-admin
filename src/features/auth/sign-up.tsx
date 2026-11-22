import {SignUpForm} from "#/features/auth/components/sign-up-form.tsx";
import {CheckCircle2, GraduationCap, ShieldCheck, Sparkles} from "lucide-react";

interface SignUpPageProps {
    search?: {
        redirect?: string;
    };
}

export function SignUpPage({search}: SignUpPageProps) {
    return (
        <div className="min-h-screen w-full grid lg:grid-cols-2 bg-background font-sans antialiased">
            {/* Left Column: Visual & Branding Showcase (Desktop only) */}
            <div
                className="relative hidden lg:flex flex-col justify-between p-12 bg-zinc-950 text-white overflow-hidden">
                {/* Ambient Glow Gradients */}
                <div
                    className="absolute -top-24 -left-24 w-96 h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none"/>
                <div
                    className="absolute -bottom-24 -right-24 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"/>

                {/* Subtle Background Pattern */}
                <div
                    className="absolute inset-0 opacity-[0.03] pointer-events-none"
                    style={{
                        backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
                        backgroundSize: "24px 24px",
                    }}
                />

                {/* Brand Header */}
                <div className="relative z-10 flex items-center gap-3">
                    <div
                        className="h-11 w-11 rounded-xl bg-linear-to-tr from-primary to-indigo-500 flex items-center justify-center shadow-lg shadow-primary/30 ring-1 ring-white/20">
                        <GraduationCap className="h-6 w-6 text-white"/>
                    </div>
                    <span
                        className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-linear-to-r from-white to-zinc-400">
                        SchoolPortal<span className="text-primary">.</span>
                    </span>
                </div>

                {/* Center Content / Highlights */}
                <div className="relative z-10 space-y-6 max-w-md my-auto">
                    <div
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-medium text-zinc-200">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400"/>
                        <span>Get Started In Minutes</span>
                    </div>

                    <h1 className="text-4xl xl:text-5xl font-extrabold tracking-tight leading-[1.15]">
                        Transforming school management together.
                    </h1>

                    <p className="text-zinc-400 text-base leading-relaxed">
                        Create your account to unlock robust teacher tools, centralized student tracking, and
                        interactive multi-campus coordination.
                    </p>

                    <div className="pt-2 space-y-3">
                        {[
                            "Easy onboarding for staff and students",
                            "FERPA & GDPR compliant records security",
                            "Fully customizable reporting tools",
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

            {/* Right Column: Sign Up Form Container */}
            <div className="flex flex-col justify-center items-center p-6 sm:p-10 lg:p-16 bg-zinc-50/50">
                <div className="w-full max-w-md mx-auto space-y-8">
                    {/* Mobile-Only Header */}
                    <div className="flex lg:hidden flex-col items-center gap-2 text-center">
                        <div
                            className="h-11 w-11 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-md">
                            <GraduationCap className="h-6 w-6"/>
                        </div>
                        <span className="text-xl font-bold tracking-tight">
                            SchoolPortal<span className="text-primary">.</span>
                        </span>
                    </div>

                    {/* Form Header */}
                    <div className="text-center space-y-2">
                        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                            Create your account
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            Already have an account?{" "}
                            <a href="/sign-in"
                               className="font-semibold text-primary hover:underline underline-offset-4 transition-all">
                                Sign in
                            </a>
                        </p>
                    </div>

                    {/* Card Container for SignUpForm */}
                    <div
                        className="bg-card text-card-foreground border border-border/80 shadow-xl shadow-zinc-950/5 rounded-2xl p-6 sm:p-8 backdrop-blur-sm">
                        <SignUpForm redirect={search?.redirect}/>
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