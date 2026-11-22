import { createFileRoute, Link, Outlet, redirect } from '@tanstack/react-router'
import { GraduationCap } from 'lucide-react'

export const Route = createFileRoute('/_auth')({
  ssr: true,
  beforeLoad: ({ context }) => {
    // If the user is already logged in, redirect them to dashboard
    if (context.user) {
      throw redirect({ to: '/dashboard' })
    }
  },
  component: GuestLayout,
})

function GuestLayout() {

  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      {/* ─── Left Side: Form Container ─────────────────────────────── */}
      <div className="flex flex-col justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
        {/* Mobile Header Branding */}
        <div className="mb-8 flex items-center justify-center gap-2 lg:hidden">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
              <GraduationCap className="h-6 w-6" />
            </div>
            <span className="text-xl font-bold tracking-tight text-foreground">
              ABCD
            </span>
          </Link>
        </div>

        {/* Form Box */}
        <div className="mx-auto w-full max-w-sm rounded-xl border bg-card p-6 shadow-sm sm:p-8 lg:border-none lg:bg-transparent lg:p-0 lg:shadow-none">
          <Outlet />
        </div>
      </div>

      {/* ─── Right Side: Promotional Split Screen (LG+) ───────────── */}
      <div className="relative hidden bg-slate-900 lg:flex lg:flex-col lg:justify-between lg:p-12 text-slate-100">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-25"
          style={{ backgroundImage: "url('/images/auth-bg.jpg')" }}
        />

        {/* Floating Branding Header */}
        <div className="relative z-10">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
              <GraduationCap className="h-6 w-6" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              ABCD
            </span>
          </Link>
        </div>

        {/* Informative Testimonial Block */}
        <div className="relative z-10 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg italic text-slate-200">
              &ldquo;Welcome to your integrated school portal. Access class
              records, academic reports, timetables, and collaborate securely
              with staff and administrators.&rdquo;
            </p>
            <footer className="text-sm font-semibold text-slate-400">
              Academic Portal Gateway
            </footer>
          </blockquote>
        </div>
      </div>
    </div>
  )
}
