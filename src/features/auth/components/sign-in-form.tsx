import { useState } from 'react'
import type { ComponentProps } from 'react'
import { Link, useNavigate, useRouter } from '@tanstack/react-router'
import { useForm } from '@tanstack/react-form'
import { useServerFn } from '@tanstack/react-start'
import { useQueryClient } from '@tanstack/react-query'
import { Eye, EyeOff, GraduationCap, Loader, Lock, Mail } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '#/components/ui/button'
import { Field, FieldError, FieldLabel } from '#/components/ui/field'
import { Input } from '#/components/ui/input'
import { signInFn } from '#/features/auth/server/auth.functions'
import { signInSchema } from '#/features/auth/schema/sign-in.schema'
import { APP_CONFIG } from '#/config/app.config'
import { cn } from '#/lib/utils'

interface SignInFormProps extends ComponentProps<'div'> {
  search?: { redirect?: string }
}

function getSafeRedirectPath(redirect?: string) {
  if (!redirect || !redirect.startsWith('/') || redirect.startsWith('//'))
    return '/dashboard'
  return redirect
}

function errorMessage(error: unknown) {
  if (typeof error === 'string') return error
  if (error && typeof error === 'object' && 'message' in error)
    return String(error.message)
  return null
}

export function SignInForm({ search }: SignInFormProps) {
  const navigate = useNavigate()
  const router = useRouter()
  const login = useServerFn(signInFn)
  const queryClient = useQueryClient()
  const [showPassword, setShowPassword] = useState(false)

  const form = useForm({
    defaultValues: { email: '', password: '', remember: false },
    validators: { onSubmit: signInSchema },
    onSubmit: async ({ value }) => {
      try {
        await login({ data: value })
        toast.success('Welcome back!')
        await queryClient.invalidateQueries({ queryKey: ['auth', 'session'] })
        await router.invalidate()
        await navigate({ to: getSafeRedirectPath(search?.redirect) })
      } catch (error: unknown) {
        const err = error as {
          message?: string
          errors?: Record<string, string[]>
        }
        for (const field of ['email', 'password'] as const) {
          const message = err.errors?.[field]?.[0]
          if (!message) continue
          form.setFieldMeta(field, (meta) => ({
            ...meta,
            errorMap: { ...meta.errorMap, onSubmit: message },
          }))
        }
        form.setErrorMap({
          onSubmit: {
            form: err.message || 'Login failed. Please check your credentials.',
            fields: {},
          },
        })
      }
    },
  })

  return (
    <div className="flex flex-col justify-center px-8 pb-8">
      <div className="mb-6 flex items-center gap-2.5 lg:hidden">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
          <GraduationCap className="h-5 w-5" />
        </div>
        <span className="text-lg font-bold tracking-tight text-card-foreground">
          {APP_CONFIG.name}
        </span>
      </div>

      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-card-foreground">
          Welcome back
        </h1>
        <p className="mt-1.5 text-[14px] text-muted-foreground">
          Enter your credentials to access your dashboard
        </p>
      </div>

      <form
        className="space-y-6"
        onSubmit={(event) => {
          event.preventDefault()
          event.stopPropagation()
          void form.handleSubmit()
        }}
      >
        <form.Subscribe selector={(state) => state.errorMap.onSubmit}>
          {(error) =>
            error ? (
              <div className="rounded-md border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">
                {typeof error === 'string'
                  ? error
                  : 'Login failed. Please check your credentials.'}
              </div>
            ) : null
          }
        </form.Subscribe>

        <form.Field name="email">
          {(field) => {
            const message = field.state.meta.errors
              .map(errorMessage)
              .find(Boolean)
            return (
              <Field data-invalid={message ? 'true' : undefined}>
                <FieldLabel htmlFor={field.name}>
                  Email <span className="ml-1 text-destructive">*</span>
                </FieldLabel>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id={field.name}
                    name={field.name}
                    type="email"
                    autoComplete="username"
                    placeholder="you@intersoftkk.com"
                    className="pl-10"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(event.target.value)}
                    aria-invalid={!!message}
                  />
                </div>
                {message && <FieldError>{message}</FieldError>}
              </Field>
            )
          }}
        </form.Field>

        <form.Field name="password">
          {(field) => {
            const message = field.state.meta.errors
              .map(errorMessage)
              .find(Boolean)
            return (
              <Field data-invalid={message ? 'true' : undefined}>
                <FieldLabel htmlFor={field.name}>
                  Password <span className="ml-1 text-destructive">*</span>
                </FieldLabel>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id={field.name}
                    name={field.name}
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
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
                      'absolute right-0 top-0 flex h-full items-center px-3 text-muted-foreground',
                      'hover:text-foreground',
                    )}
                    aria-label={
                      showPassword ? 'Hide password' : 'Show password'
                    }
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

        <div className="flex items-center justify-between">
          <form.Field name="remember">
            {(field) => (
              <label className="flex cursor-pointer select-none items-center gap-2 text-sm text-muted-foreground">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-input accent-primary"
                  checked={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.checked)}
                />
                Remember me
              </label>
            )}
          </form.Field>
          <Link
            to="/forgot-password"
            className="text-sm font-medium text-primary underline-offset-2 hover:underline"
          >
            Forgot your password?
          </Link>
        </div>

        <form.Subscribe selector={(state) => state.isSubmitting}>
          {(isSubmitting) => (
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                  Logging in...
                </>
              ) : (
                'Login'
              )}
            </Button>
          )}
        </form.Subscribe>
      </form>
    </div>
  )
}
