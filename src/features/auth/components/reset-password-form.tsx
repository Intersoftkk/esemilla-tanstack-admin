import { useState } from 'react'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { useForm } from '@tanstack/react-form'
import { useServerFn } from '@tanstack/react-start'
import { Eye, EyeOff, Loader, Lock } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '#/components/ui/button'
import { Field, FieldError, FieldLabel } from '#/components/ui/field'
import { Input } from '#/components/ui/input'
import { resetPasswordFn } from '#/features/auth/server/auth.functions'
import { resetPasswordSchema } from '#/features/auth/schema/reset-password.schema'
import { cn } from '#/lib/utils'

function errorMessage(error: unknown) {
  if (typeof error === 'string') return error
  if (error && typeof error === 'object' && 'message' in error)
    return String(error.message)
  return null
}

export function ResetPasswordForm() {
  const navigate = useNavigate()
  const resetPassword = useServerFn(resetPasswordFn)
  const search = useSearch({ strict: false }) as {
    token?: string
    email?: string
  }
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const form = useForm({
    defaultValues: {
      token: search.token ?? '',
      email: search.email ?? '',
      password: '',
      confirmPassword: '',
    },
    validators: { onSubmit: resetPasswordSchema },
    onSubmit: async ({ value }) => {
      try {
        await resetPassword({ data: value })
        toast.success('Password reset successfully!')
        await navigate({ to: '/sign-in' })
      } catch (error: unknown) {
        const err = error as {
          message?: string
          errors?: Record<string, string[]>
        }
        for (const field of ['password', 'confirmPassword'] as const) {
          const message = err.errors?.[field]?.[0]
          if (!message) continue
          form.setFieldMeta(field, (meta) => ({
            ...meta,
            errorMap: { ...meta.errorMap, onSubmit: message },
          }))
        }
        form.setErrorMap({
          onSubmit: {
            form:
              err.message ||
              'Password reset failed. The link may have expired.',
            fields: {},
          },
        })
      }
    },
  })

  return (
    <div className="flex flex-col justify-center px-8 pb-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-card-foreground">
          Set new password
        </h1>
        <p className="mt-1.5 text-[14px] text-muted-foreground">
          Your new password must be different from previous passwords.
        </p>
      </div>

      <form
        className="space-y-5"
        onSubmit={(event) => {
          event.preventDefault()
          event.stopPropagation()
          void form.handleSubmit()
        }}
      >
        <form.Subscribe selector={(state) => state.errorMap.onSubmit}>
          {(error) => {
            const message =
              error &&
              typeof error === 'object' &&
              'form' in error &&
              typeof error.form === 'string'
                ? error.form
                : null
            return message ? (
              <div className="rounded-md border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">
                {message}
              </div>
            ) : null
          }}
        </form.Subscribe>

        <form.Field name="password">
          {(field) => {
            const message = field.state.meta.errors
              .map(errorMessage)
              .find(Boolean)
            return (
              <Field data-invalid={message ? 'true' : undefined}>
                <FieldLabel htmlFor={field.name}>
                  New Password <span className="ml-1 text-destructive">*</span>
                </FieldLabel>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id={field.name}
                    name={field.name}
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    placeholder="********"
                    className="pl-10 pr-10"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(event.target.value)}
                    aria-invalid={!!message}
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    className={cn(
                      'absolute right-0 top-0 flex h-full items-center px-3 text-muted-foreground hover:text-foreground',
                    )}
                    onClick={() => setShowPassword((value) => !value)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {message && <FieldError>{message}</FieldError>}
              </Field>
            )
          }}
        </form.Field>

        <form.Field name="confirmPassword">
          {(field) => {
            const message = field.state.meta.errors
              .map(errorMessage)
              .find(Boolean)
            return (
              <Field data-invalid={message ? 'true' : undefined}>
                <FieldLabel htmlFor={field.name}>
                  Confirm New Password{' '}
                  <span className="ml-1 text-destructive">*</span>
                </FieldLabel>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id={field.name}
                    name={field.name}
                    type={showConfirm ? 'text' : 'password'}
                    autoComplete="new-password"
                    placeholder="********"
                    className="pl-10 pr-10"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(event.target.value)}
                    aria-invalid={!!message}
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    className={cn(
                      'absolute right-0 top-0 flex h-full items-center px-3 text-muted-foreground hover:text-foreground',
                    )}
                    onClick={() => setShowConfirm((value) => !value)}
                  >
                    {showConfirm ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {message && <FieldError>{message}</FieldError>}
              </Field>
            )
          }}
        </form.Field>

        <form.Subscribe selector={(state) => state.isSubmitting}>
          {(isSubmitting) => (
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                  Resetting...
                </>
              ) : (
                'Reset Password'
              )}
            </Button>
          )}
        </form.Subscribe>
      </form>
    </div>
  )
}
