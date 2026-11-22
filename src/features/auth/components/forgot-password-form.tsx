import { Link } from '@tanstack/react-router'
import { useForm } from '@tanstack/react-form'
import { useServerFn } from '@tanstack/react-start'
import { ArrowLeft, Loader, Mail } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '#/components/ui/button'
import { Field, FieldError, FieldLabel } from '#/components/ui/field'
import { Input } from '#/components/ui/input'
import { forgotPasswordFn } from '#/features/auth/server/auth.functions'
import { forgotPasswordSchema } from '#/features/auth/schema/forgot-password.schema'

function errorMessage(error: unknown) {
  if (typeof error === 'string') return error
  if (error && typeof error === 'object' && 'message' in error)
    return String(error.message)
  return null
}

export function ForgotPasswordForm() {
  const forgotPassword = useServerFn(forgotPasswordFn)

  const form = useForm({
    defaultValues: { email: '' },
    validators: { onSubmit: forgotPasswordSchema },
    onSubmit: async ({ value }) => {
      try {
        await forgotPassword({ data: value })
        toast.success('Password reset link sent to your email.')
      } catch (error: unknown) {
        const err = error as {
          message?: string
          errors?: Record<string, string[]>
        }
        const message = err.errors?.email?.[0]
        if (message) {
          form.setFieldMeta('email', (meta) => ({
            ...meta,
            errorMap: { ...meta.errorMap, onSubmit: message },
          }))
        }
        form.setErrorMap({
          onSubmit: {
            form: err.message || 'Failed to send reset link.',
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
          Forgot password?
        </h1>
        <p className="mt-1.5 text-[14px] text-muted-foreground">
          No worries, we&apos;ll send you reset instructions.
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

        <form.Subscribe selector={(state) => state.isSubmitting}>
          {(isSubmitting) => (
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                'Reset Password'
              )}
            </Button>
          )}
        </form.Subscribe>

        <div className="flex justify-center">
          <Link
            to="/sign-in"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to login
          </Link>
        </div>
      </form>
    </div>
  )
}
