import { useState } from 'react'
import { Link, useNavigate, useRouter } from '@tanstack/react-router'
import { useForm } from '@tanstack/react-form'
import { useServerFn } from '@tanstack/react-start'
import { useQueryClient } from '@tanstack/react-query'
import {
  Eye,
  EyeOff,
  GraduationCap,
  Loader,
  Lock,
  Mail,
  User,
} from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '#/components/ui/button'
import { Field, FieldError, FieldLabel } from '#/components/ui/field'
import { Input } from '#/components/ui/input'
import { signUpFn } from '#/features/auth/server/auth.functions'
import { signUpSchema } from '#/features/auth/schema/sign-up.schema'
import { APP_CONFIG } from '#/config/app.config'
import { cn } from '#/lib/utils'

function errorMessage(error: unknown) {
  if (typeof error === 'string') return error
  if (error && typeof error === 'object' && 'message' in error)
    return String(error.message)
  return null
}

export function SignUpForm() {
  const navigate = useNavigate()
  const router = useRouter()
  const register = useServerFn(signUpFn)
  const queryClient = useQueryClient()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const form = useForm({
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
    validators: { onSubmit: signUpSchema },
    onSubmit: async ({ value }) => {
      try {
        await register({ data: value })
        toast.success('Account created successfully!')
        await queryClient.invalidateQueries({ queryKey: ['auth', 'session'] })
        await router.invalidate()
        await navigate({ to: '/' })
      } catch (error: unknown) {
        const err = error as {
          message?: string
          errors?: Record<string, string[]>
        }
        for (const field of [
          'name',
          'email',
          'password',
          'confirmPassword',
        ] as const) {
          const message = err.errors?.[field]?.[0]
          if (!message) continue
          form.setFieldMeta(field, (meta) => ({
            ...meta,
            errorMap: { ...meta.errorMap, onSubmit: message },
          }))
        }
        form.setErrorMap({
          onSubmit: {
            form: err.message || 'Registration failed. Please try again.',
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
          Create an account
        </h1>
        <p className="mt-1.5 text-[14px] text-muted-foreground">
          Fill in your details to get started
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

        <form.Field name="name">
          {(field) => {
            const message = field.state.meta.errors
              .map(errorMessage)
              .find(Boolean)
            return (
              <Field data-invalid={message ? 'true' : undefined}>
                <FieldLabel htmlFor={field.name}>
                  Full Name <span className="ml-1 text-destructive">*</span>
                </FieldLabel>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id={field.name}
                    name={field.name}
                    autoComplete="name"
                    placeholder="John Doe"
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
                    autoComplete="email"
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

        <form.Field name="confirmPassword">
          {(field) => {
            const message = field.state.meta.errors
              .map(errorMessage)
              .find(Boolean)
            return (
              <Field data-invalid={message ? 'true' : undefined}>
                <FieldLabel htmlFor={field.name}>
                  Confirm Password{' '}
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
                    aria-label={showConfirm ? 'Hide password' : 'Show password'}
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
                  Creating account...
                </>
              ) : (
                'Sign Up'
              )}
            </Button>
          )}
        </form.Subscribe>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link
            to="/sign-in"
            className="font-medium text-primary hover:underline"
          >
            Sign in
          </Link>
        </p>
      </form>
    </div>
  )
}
