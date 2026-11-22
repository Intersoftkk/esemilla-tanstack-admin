// src/features/auth/components/sign-in-form.tsx

import { useState } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { useForm, formOptions } from '@tanstack/react-form'
import { Building2, Loader2, Lock, Mail, Eye, EyeOff } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '#/components/ui/button'
import { type SignInFormData, signInSchema } from '#/features/auth/schema/sign-in.schema'
import { useAuth } from '#/features/auth/context/auth.context'

interface SignInPageProps {
    search?: {
        redirect?: string
    }
}

function resolveSafeRedirect(redirect?: string): string {
    if (!redirect) return '/dashboard'

    try {
        const decoded = decodeURIComponent(redirect)
        const url = new URL(decoded, window.location.origin)
        if (url.origin !== window.location.origin) {
            console.warn('Blocked external redirect:', decoded)
            return '/dashboard'
        }
        return url.pathname + url.search + url.hash
    } catch {
        return '/dashboard'
    }
}

export function SignInForm({ search }: SignInPageProps) {
    const navigate = useNavigate()
    const { login } = useAuth()
    const [serverError, setServerError] = useState<string | null>(null)
    const [showPassword, setShowPassword] = useState(false)

    const formOpts = formOptions({
        defaultValues: {
            email: '',
            password: '',
        } satisfies SignInFormData,
        validators: {
            onSubmit: signInSchema,
        },
    })

    const form = useForm({
        ...formOpts,
        onSubmit: async ({ value }) => {
            setServerError(null)
            try {
                await login(value)
                toast.success('Welcome back!')
                await navigate({ to: resolveSafeRedirect(search?.redirect) })
            } catch (error: unknown) {
                const err = error as { message?: string; response?: { data?: { message?: string } } }
                setServerError(err.response?.data?.message ?? err.message ?? 'An error occurred during login')
            }
        },
    })

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault()
                e.stopPropagation()
                form.handleSubmit()
            }}
            className="p-6 md:p-8 space-y-6"
        >
            {/* Header */}
            <div className="flex flex-col items-center text-center gap-2">
                <Building2 className="h-10 w-10 text-primary" />
                <h1 className="text-2xl font-bold tracking-tight">Welcome to Intersoftkk</h1>
                <p className="text-muted-foreground text-balance text-sm">
                    Login to your Workspace Portal
                </p>
            </div>

            {/* Root / Server Error */}
            {serverError && (
                <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md border border-destructive/20 font-medium">
                    {serverError}
                </div>
            )}

            {/* Email Field */}
            <form.Field
                name="email"
                children={(field) => {
                    const hasError = field.state.meta.isTouched && field.state.meta.errors.length > 0

                    return (
                        <div className="space-y-2">
                            <label htmlFor={field.name} className="block text-sm font-medium leading-none">
                                Email Address <span className="text-destructive">*</span>
                            </label>
                            <div className="relative">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                    <Mail className="h-4 w-4 text-muted-foreground" />
                                </div>
                                <input
                                    id={field.name}
                                    name={field.name}
                                    type="email"
                                    value={field.state.value}
                                    onBlur={field.handleBlur}
                                    onChange={(e) => {
                                        if (serverError) setServerError(null)
                                        field.handleChange(e.target.value)
                                    }}
                                    placeholder="you@intersoftkk.com"
                                    className={`flex h-10 w-full rounded-md border bg-background px-3 py-2 pl-10 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50
                    ${hasError ? 'border-destructive focus-visible:ring-destructive' : 'border-input'}
                  `}
                                />
                            </div>
                            {hasError && (
                                <p className="text-xs font-medium text-destructive">
                                    {field.state.meta.errors[0]?.message ?? String(field.state.meta.errors[0])}
                                </p>
                            )}
                        </div>
                    )
                }}
            />

            {/* Password Field */}
            <form.Field
                name="password"
                children={(field) => {
                    const hasError = field.state.meta.isTouched && field.state.meta.errors.length > 0

                    return (
                        <div className="space-y-2">
                            <label htmlFor={field.name} className="block text-sm font-medium leading-none">
                                Password <span className="text-destructive">*</span>
                            </label>
                            <div className="relative">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                    <Lock className="h-4 w-4 text-muted-foreground" />
                                </div>
                                <input
                                    id={field.name}
                                    name={field.name}
                                    type={showPassword ? 'text' : 'password'}
                                    value={field.state.value}
                                    onBlur={field.handleBlur}
                                    onChange={(e) => {
                                        if (serverError) setServerError(null)
                                        field.handleChange(e.target.value)
                                    }}
                                    placeholder="********"
                                    className={`flex h-10 w-full rounded-md border bg-background px-3 py-2 pl-10 pr-10 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50
                    ${hasError ? 'border-destructive focus-visible:ring-destructive' : 'border-input'}
                  `}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground"
                                    tabIndex={-1}
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                            {hasError && (
                                <p className="text-xs font-medium text-destructive">
                                    {field.state.meta.errors[0]?.message ?? String(field.state.meta.errors[0])}
                                </p>
                            )}
                        </div>
                    )
                }}
            />

            {/* Links */}
            <div className="flex items-center justify-between">
                <Link
                    to="/forgot-password"
                    className="text-sm font-medium text-muted-foreground hover:text-foreground underline-offset-4 hover:underline"
                >
                    Forgot your password?
                </Link>
            </div>

            {/* Submit Button */}
            <form.Subscribe
                selector={(state) => [state.canSubmit, state.isSubmitting]}
                children={([canSubmit, isSubmitting]) => (
                    <Button type="submit" className="w-full" disabled={!canSubmit || isSubmitting}>
                        {isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Logging in...
                            </>
                        ) : (
                            'Login'
                        )}
                    </Button>
                )}
            />
        </form>
    )
}