// src/features/auth/components/change-password-form.tsx

import { useForm, formOptions } from '@tanstack/react-form'
import { useState } from 'react'
import { Loader2, Lock, Eye, EyeOff, ShieldCheck } from 'lucide-react'
import { toast } from 'sonner'
import { changePasswordSchema } from '#/features/auth/schema/change-password.schema'
import { useChangePasswordMutation } from '#/features/auth/queries/auth.queries'
import { getErrorMessage } from '#/features/auth/components/profile-form'

const inputBase =
    'flex h-10 w-full rounded-md border bg-background py-2 pl-10 pr-10 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'

export function ChangePasswordForm() {
    const mutation = useChangePasswordMutation()
    const [visible, setVisible] = useState({ current: false, new: false, confirm: false })

    const formOpts = formOptions({
        defaultValues: {
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
        },
        validators: {
            onChange: changePasswordSchema,
        },
    })

    const form = useForm({
        ...formOpts,
        onSubmit: async ({ value }) => {
            try {
                await mutation.mutateAsync(value)
                toast.success('Your account password has been updated.')
                form.reset()
            } catch (err: any) {
                toast.error(err?.response?.data?.message || 'Failed to update credentials')
            }
        },
    })

    const toggle = (key: keyof typeof visible) => setVisible((p) => ({ ...p, [key]: !p[key] }))

    const PasswordField = ({
                               name,
                               label,
                               placeholder,
                               visKey,
                               hint,
                           }: {
        name: 'currentPassword' | 'newPassword' | 'confirmPassword'
        label: string
        placeholder: string
        visKey: keyof typeof visible
        hint?: string
    }) => (
        <form.Field
            name={name}
            children={(field) => {
                const errorMsg = getErrorMessage(field.state.meta.errors)
                return (
                    <div className="space-y-2">
                        <label htmlFor={field.name} className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            {label} <span className="text-destructive">*</span>
                        </label>
                        <div className="relative">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <Lock className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <input
                                id={field.name}
                                type={visible[visKey] ? 'text' : 'password'}
                                value={field.state.value}
                                onBlur={field.handleBlur}
                                onChange={(e) => field.handleChange(e.target.value)}
                                placeholder={placeholder}
                                className={`${inputBase} ${field.state.meta.isTouched && errorMsg ? 'border-destructive focus-visible:ring-destructive' : 'border-input'}`}
                            />
                            <button
                                type="button"
                                onClick={() => toggle(visKey)}
                                className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground"
                                tabIndex={-1}
                            >
                                {visible[visKey] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                        {field.state.meta.isTouched && errorMsg && (
                            <p className="text-xs font-medium text-destructive">{errorMsg}</p>
                        )}
                        {hint && <p className="text-xs text-muted-foreground leading-relaxed">{hint}</p>}
                    </div>
                )
            }}
        />
    )

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault()
                e.stopPropagation()
                form.handleSubmit()
            }}
            className="space-y-6"
        >
            <PasswordField
                name="currentPassword"
                label="Current Password"
                placeholder="Enter current password"
                visKey="current"
            />
            <PasswordField
                name="newPassword"
                label="New Password"
                placeholder="Enter new password"
                visKey="new"
                hint="Minimum 8 characters with at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special symbol."
            />
            <PasswordField
                name="confirmPassword"
                label="Confirm New Password"
                placeholder="Confirm your new password"
                visKey="confirm"
            />

            <div className="flex justify-end pt-2">
                <form.Subscribe
                    selector={(state) => [state.canSubmit, state.isSubmitting]}
                    children={([canSubmit, isSubmitting]) => (
                        <button
                            type="submit"
                            disabled={!canSubmit || isSubmitting}
                            className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 shadow-sm"
                        >
                            {isSubmitting ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <ShieldCheck className="h-4 w-4" />
                            )}
                            {isSubmitting ? 'Updating...' : 'Update credentials'}
                        </button>
                    )}
                />
            </div>
        </form>
    )
}