// src/features/auth/components/forgot-password-form.tsx

import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { useForm, formOptions } from '@tanstack/react-form'
import { ArrowLeft, CheckCircle2, KeyRound, Loader2, Mail } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '#/components/ui/button'
import {
    type ForgotPasswordFormData,
    forgotPasswordSchema,
} from '#/features/auth/schema/forgot-password.schema'
import { useAuth } from '#/features/auth/context/auth.context'

const inputBase =
    'flex h-10 w-full rounded-md border bg-background px-3 py-2 pl-10 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'

export function ForgotPasswordForm() {
    const { forgotPassword } = useAuth()
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [submittedEmail, setSubmittedEmail] = useState('')
    const [serverError, setServerError] = useState<string | null>(null)

    const formOpts = formOptions({
        defaultValues: {
            email: '',
        } satisfies ForgotPasswordFormData,
        validators: {
            onSubmit: forgotPasswordSchema,
        },
    })

    const form = useForm({
        ...formOpts,
        onSubmit: async ({ value }) => {
            setServerError(null)
            try {
                await forgotPassword(value.email)
                setSubmittedEmail(value.email)
                toast.success('Reset link sent to your email!')
                setIsSubmitted(true)
            } catch (error: unknown) {
                const err = error as { message?: string; response?: { data?: { message?: string } } }
                setServerError(
                    err.response?.data?.message ?? err.message ?? 'Something went wrong. Please try again later.'
                )
            }
        },
    })

    // Success State View
    if (isSubmitted) {
        return (
            <div className="p-6 md:p-8 space-y-6 text-center">
                <div className="mx-auto w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                    <CheckCircle2 className="h-6 w-6" />
                </div>

                <div className="space-y-2">
                    <h2 className="text-2xl font-bold tracking-tight">Check your email</h2>
                    <p className="text-sm text-muted-foreground text-balance">
                        We sent a password reset link to{' '}
                        <span className="font-semibold text-foreground">{submittedEmail}</span>
                    </p>
                </div>

                <div className="pt-2">
                    <Link
                        to="/sign-in"
                        className="inline-flex items-center justify-center gap-2 text-sm font-medium text-primary hover:underline underline-offset-4"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to sign in
                    </Link>
                </div>
            </div>
        )
    }

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
                <div className="p-3 rounded-full bg-primary/10 text-primary">
                    <KeyRound className="h-6 w-6" />
                </div>
                <h1 className="text-2xl font-bold tracking-tight">Forgot password?</h1>
                <p className="text-sm text-muted-foreground text-balance">
                    No worries! Enter your registered email and we&apos;ll send you reset instructions.
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

            {/* Submit Button */}
            <form.Subscribe
                selector={(state) => [state.canSubmit, state.isSubmitting]}
                children={([canSubmit, isSubmitting]) => (
                    <Button type="submit" className="w-full" disabled={!canSubmit || isSubmitting}>
                        {isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Sending reset link...
                            </>
                        ) : (
                            'Send Reset Link'
                        )}
                    </Button>
                )}
            />

            {/* Back to Sign In Link */}
            <div className="flex items-center justify-center">
                <Link
                    to="/sign-in"
                    className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to sign in
                </Link>
            </div>
        </form>
    )
}