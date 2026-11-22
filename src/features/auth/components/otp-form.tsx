import { useNavigate, useSearch } from '@tanstack/react-router'
import { useForm } from '@tanstack/react-form'
import { useServerFn } from '@tanstack/react-start'
import { Loader, ShieldCheck } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '#/components/ui/button'
import { Field, FieldError, FieldLabel } from '#/components/ui/field'
import { Input } from '#/components/ui/input'
import { sendOtpFn, verifyOtpFn } from '#/features/auth/server/auth.functions'
import { otpSchema } from '#/features/auth/schema/otp.schema'

function errorMessage(error: unknown) {
  if (typeof error === 'string') return error
  if (error && typeof error === 'object' && 'message' in error)
    return String(error.message)
  return null
}

export function OtpForm() {
  const navigate = useNavigate()
  const { email = '' } = useSearch({ strict: false }) as { email?: string }
  const verifyOtp = useServerFn(verifyOtpFn)
  const sendOtp = useServerFn(sendOtpFn)

  const form = useForm({
    defaultValues: { email, otp: '' },
    validators: { onSubmit: otpSchema },
    onSubmit: async ({ value }) => {
      try {
        await verifyOtp({ data: value })
        toast.success('Email verified successfully!')
        await navigate({ to: '/sign-in' })
      } catch (error: unknown) {
        const err = error as {
          message?: string
          errors?: Record<string, string[]>
        }
        const message =
          err.errors?.otp?.[0] ??
          (err.message?.toLowerCase().includes('otp') ? err.message : undefined)
        if (message) {
          form.setFieldMeta('otp', (meta) => ({
            ...meta,
            errorMap: { ...meta.errorMap, onSubmit: message },
          }))
        }
        form.setErrorMap({
          onSubmit: { form: err.message || 'Verification failed.', fields: {} },
        })
      }
    },
  })

  const handleResend = async () => {
    try {
      await sendOtp({ data: { email } })
      toast.success('New OTP sent to your email.')
    } catch {
      toast.error('Failed to resend OTP.')
    }
  }

  return (
    <div className="flex flex-col justify-center px-8 pb-8">
      <div className="mb-8">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <ShieldCheck className="h-6 w-6 text-primary" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-card-foreground">
          Verify your email
        </h1>
        <p className="mt-1.5 text-[14px] text-muted-foreground">
          Enter the 6-digit code sent to{' '}
          <span className="font-medium text-foreground">{email}</span>
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

        <form.Field name="otp">
          {(field) => {
            const message = field.state.meta.errors
              .map(errorMessage)
              .find(Boolean)
            return (
              <Field data-invalid={message ? 'true' : undefined}>
                <FieldLabel htmlFor={field.name}>
                  OTP Code <span className="ml-1 text-destructive">*</span>
                </FieldLabel>
                <div className="relative">
                  <ShieldCheck className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id={field.name}
                    name={field.name}
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    placeholder="123456"
                    maxLength={6}
                    className="pl-10 tracking-[0.3em]"
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
                  Verifying...
                </>
              ) : (
                'Verify OTP'
              )}
            </Button>
          )}
        </form.Subscribe>

        <p className="text-center text-sm text-muted-foreground">
          Didn&apos;t receive the code?{' '}
          <button
            type="button"
            onClick={() => void handleResend()}
            className="font-medium text-primary hover:underline"
          >
            Resend
          </button>
        </p>
      </form>
    </div>
  )
}
