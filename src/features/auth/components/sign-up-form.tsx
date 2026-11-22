// src/features/auth/components/sign-up-form.tsx

import { useState } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { useForm, formOptions } from '@tanstack/react-form'
import { GraduationCap, Loader2, Lock, Mail, User, Eye, EyeOff } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '#/components/ui/button'
import { type SignUpFormData, signUpSchema } from '#/features/auth/schema/sign-up.schema'
import { useAuth } from '#/features/auth/context/auth.context'

interface SignUpFormProps {
    redirect?: string
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

const inputBase =
    'flex h-10 w-full rounded-md border bg-background px-3 py-2 pl-10 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'

export function SignUpForm({ redirect }: SignUpFormProps) {
    const navigate = useNavigate()
    const { register: registerUser } = useAuth()
    const [serverError, setServerError] = useState<string | null>(null)
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const formOpts = formOptions({
        defaultValues: {
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
        } satisfies SignUpFormData,
        validators: {
            onSubmit: signUpSchema,
        },
    })

    const form = useForm({
        ...formOpts,
        onSubmit: async ({ value }) => {
            setServerError(null)
            try {
                await registerUser(value)
                toast.success('Account created successfully!')
                await navigate({ to: resolveSafeRedirect(redirect) })
            } catch (error: unknown) {
                const err = error as { message?: string; response?: { data?: { message?: string } } }
                setServerError(
                    err.response?.data?.message ?? err.message ?? 'Failed to create account. Please try again.'
                )
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
            className="p-6 md:p-8 space-y-5"
        >
            {/* Header */}
            <div className="flex flex-col items-center text-center gap-2">
                <GraduationCap className="h-10 w-10 text-primary" />
                <h1 className="text-2xl font-bold tracking-tight">Create an Account</h1>
                <p className="text-muted-foreground text-sm text-balance">
                    Join SchoolPortal to manage your school workspace
                </p>
            </div>

            {/* Root / Server Error */}
            {serverError && (
                <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md border border-destructive/20 font-medium">
                    {serverError}
                </div>
            )}

            {/* Full Name Field */}
            <form.Field
                name="name"
                children={(field) => {
                    const hasError = field.state.meta.isTouched && field.state.meta.errors.length > 0

                    return (
                        <div className="space-y-2">
                            <label htmlFor={field.name} className="block text-sm font-medium leading-none">
                                Full Name <span className="text-destructive">*</span>
                            </label>
                            <div className="relative">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                    <User className="h-4 w-4 text-muted-foreground" />
                                </div>
                                <input
                                    id={field.name}
                                    name={field.name}
                                    type="text"
                                    value={field.state.value}
                                    onBlur={field.handleBlur}
                                    onChange={(e) => {
                                        if (serverError) setServerError(null)
                                        field.handleChange(e.target.value)
                                    }}
                                    placeholder="John Doe"
                                    className={`${inputBase} ${hasError ? 'border-destructive focus-visible:ring-destructive' : 'border-input'}`}
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
                                    placeholder="you@schoolportal.com"
                                    className={`${inputBase} ${hasError ? 'border-destructive focus-visible:ring-destructive' : 'border-input'}`}
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
                                    placeholder="Create a password"
                                    className={`${inputBase} pr-10 ${hasError ? 'border-destructive focus-visible:ring-destructive' : 'border-input'}`}
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

            {/* Confirm Password Field */}
            <form.Field
                name="confirmPassword"
                children={(field) => {
                    const hasError = field.state.meta.isTouched && field.state.meta.errors.length > 0

                    return (
                        <div className="space-y-2">
                            <label htmlFor={field.name} className="block text-sm font-medium leading-none">
                                Confirm Password <span className="text-destructive">*</span>
                            </label>
                            <div className="relative">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                    <Lock className="h-4 w-4 text-muted-foreground" />
                                </div>
                                <input
                                    id={field.name}
                                    name={field.name}
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    value={field.state.value}
                                    onBlur={field.handleBlur}
                                    onChange={(e) => {
                                        if (serverError) setServerError(null)
                                        field.handleChange(e.target.value)
                                    }}
                                    placeholder="Confirm your password"
                                    className={`${inputBase} pr-10 ${hasError ? 'border-destructive focus-visible:ring-destructive' : 'border-input'}`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground"
                                    tabIndex={-1}
                                >
                                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
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

            {/* Submit Button */}
            <form.Subscribe
                selector={(state) => [state.canSubmit, state.isSubmitting]}
                children={([canSubmit, isSubmitting]) => (
                    <Button type="submit" className="w-full" disabled={!canSubmit || isSubmitting}>
                        {isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Creating account...
                            </>
                        ) : (
                            'Get Started'
                        )}
                    </Button>
                )}
            />

            {/* Switch to Sign In */}
            <div className="text-center text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link
                    to="/sign-in"
                    className="font-medium text-primary hover:underline underline-offset-4"
                >
                    Sign in
                </Link>
            </div>
        </form>
    )
}