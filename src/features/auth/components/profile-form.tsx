// src/features/auth/components/profile-form.tsx

import { useForm, formOptions } from '@tanstack/react-form'
import { Loader2, Save } from 'lucide-react'
import { toast } from 'sonner'
import { profileSchema, type ProfileFormValues } from '#/features/auth/schema/profile.schema'
import { useUpdateProfileMutation } from '#/features/auth/queries/auth.queries'
import type { AuthUser } from '#/features/auth/types/auth.types'

interface ProfileFormProps {
    profile: AuthUser
}

const inputBase =
    'flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
const inputError = 'border-destructive focus-visible:ring-destructive'
const inputNormal = 'border-input'

export function getErrorMessage(errors: unknown[]): string | null {
    if (!errors || errors.length === 0) return null
    const error = errors[0]
    if (typeof error === 'object' && error !== null && 'message' in error) {
        return String((error as { message: unknown }).message)
    }
    return String(error)
}

export function ProfileForm({ profile }: ProfileFormProps) {
    const updateMutation = useUpdateProfileMutation()

    const defaultValues: ProfileFormValues = {
        firstName: profile.firstName ?? '',
        lastName: profile.lastName ?? '',
        phone: profile.phone ?? profile.mobile ?? '',
        bio: profile.bio ?? '',
        avatar: profile.avatar ?? '',
        dateOfBirth: profile.dateOfBirth ?? '',
        address: {
            street: profile.address?.street ?? '',
            city: profile.address?.city ?? '',
            state: profile.address?.state ?? '',
            zipCode: profile.address?.zipCode ?? '',
            country: profile.address?.country ?? '',
        },
    }

    const formOpts = formOptions({
        defaultValues,
        validators: {
            onChange: profileSchema,
        },
    })

    const form = useForm({
        ...formOpts,
        onSubmit: async ({ value }) => {
            try {
                await updateMutation.mutateAsync({
                    ...value,
                    dateOfBirth: value.dateOfBirth || null,
                })
                toast.success('Your profile settings have been updated.')
            } catch {
                toast.error('Failed to update profile settings.')
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
            className="space-y-12"
        >
            {/* ── Section: Personal Details ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div>
                    <h3 className="text-base font-semibold leading-6 text-foreground">Personal Details</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Update your basic workspace identity and contact information.
                    </p>
                </div>

                <div className="lg:col-span-2 rounded-xl border border-border bg-card p-6 shadow-sm space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* First Name */}
                        <form.Field
                            name="firstName"
                            children={(field) => {
                                const errorMsg = getErrorMessage(field.state.meta.errors)
                                return (
                                    <div className="space-y-2">
                                        <label htmlFor={field.name} className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                            First Name <span className="text-destructive">*</span>
                                        </label>
                                        <input
                                            id={field.name}
                                            type="text"
                                            value={field.state.value}
                                            onBlur={field.handleBlur}
                                            onChange={(e) => field.handleChange(e.target.value)}
                                            className={`${inputBase} ${field.state.meta.isTouched && errorMsg ? inputError : inputNormal}`}
                                        />
                                        {field.state.meta.isTouched && errorMsg && (
                                            <p className="text-xs font-medium text-destructive">{errorMsg}</p>
                                        )}
                                    </div>
                                )
                            }}
                        />

                        {/* Last Name */}
                        <form.Field
                            name="lastName"
                            children={(field) => {
                                const errorMsg = getErrorMessage(field.state.meta.errors)
                                return (
                                    <div className="space-y-2">
                                        <label htmlFor={field.name} className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                            Last Name <span className="text-destructive">*</span>
                                        </label>
                                        <input
                                            id={field.name}
                                            type="text"
                                            value={field.state.value}
                                            onBlur={field.handleBlur}
                                            onChange={(e) => field.handleChange(e.target.value)}
                                            className={`${inputBase} ${field.state.meta.isTouched && errorMsg ? inputError : inputNormal}`}
                                        />
                                        {field.state.meta.isTouched && errorMsg && (
                                            <p className="text-xs font-medium text-destructive">{errorMsg}</p>
                                        )}
                                    </div>
                                )
                            }}
                        />

                        {/* Email (Read-Only) */}
                        <div className="space-y-2 sm:col-span-2">
                            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Email Address</label>
                            <input
                                type="email"
                                value={profile.email}
                                disabled
                                className="flex h-10 w-full rounded-md border border-input bg-muted/50 px-3 py-2 text-sm text-muted-foreground cursor-not-allowed"
                            />
                            <p className="text-xs text-muted-foreground">Primary account credentials cannot be changed.</p>
                        </div>

                        {/* Phone */}
                        <form.Field
                            name="phone"
                            children={(field) => {
                                const errorMsg = getErrorMessage(field.state.meta.errors)
                                return (
                                    <div className="space-y-2">
                                        <label htmlFor={field.name} className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Phone Number</label>
                                        <input
                                            id={field.name}
                                            type="tel"
                                            value={field.state.value}
                                            onBlur={field.handleBlur}
                                            onChange={(e) => field.handleChange(e.target.value)}
                                            placeholder="+1 (555) 000-0000"
                                            className={`${inputBase} ${field.state.meta.isTouched && errorMsg ? inputError : inputNormal}`}
                                        />
                                        {field.state.meta.isTouched && errorMsg && (
                                            <p className="text-xs font-medium text-destructive">{errorMsg}</p>
                                        )}
                                    </div>
                                )
                            }}
                        />

                        {/* DOB */}
                        <form.Field
                            name="dateOfBirth"
                            children={(field) => {
                                const errorMsg = getErrorMessage(field.state.meta.errors)
                                return (
                                    <div className="space-y-2">
                                        <label htmlFor={field.name} className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Date of Birth</label>
                                        <input
                                            id={field.name}
                                            type="date"
                                            value={field.state.value}
                                            onBlur={field.handleBlur}
                                            onChange={(e) => field.handleChange(e.target.value)}
                                            className={`${inputBase} ${field.state.meta.isTouched && errorMsg ? inputError : inputNormal}`}
                                        />
                                        {field.state.meta.isTouched && errorMsg && (
                                            <p className="text-xs font-medium text-destructive">{errorMsg}</p>
                                        )}
                                    </div>
                                )
                            }}
                        />
                    </div>

                    {/* Bio */}
                    <form.Field
                        name="bio"
                        children={(field) => (
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <label htmlFor={field.name} className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Short Bio</label>
                                    <span className="text-xs text-muted-foreground">{field.state.value.length}/500</span>
                                </div>
                                <textarea
                                    id={field.name}
                                    value={field.state.value}
                                    onBlur={field.handleBlur}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                    rows={3}
                                    className={`${inputBase} h-auto resize-none border-input`}
                                    placeholder="Tell us about yourself..."
                                />
                            </div>
                        )}
                    />
                </div>
            </div>

            {/* ── Section: Address ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div>
                    <h3 className="text-base font-semibold leading-6 text-foreground">Billing Address</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Configure default postal locations for account invoices and communications.
                    </p>
                </div>

                <div className="lg:col-span-2 rounded-xl border border-border bg-card p-6 shadow-sm space-y-4">
                    <form.Field
                        name="address.street"
                        children={(field) => (
                            <div className="space-y-2">
                                <label htmlFor={field.name} className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Street Address</label>
                                <input
                                    id={field.name}
                                    type="text"
                                    value={field.state.value}
                                    onBlur={field.handleBlur}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                    className={`${inputBase} ${inputNormal}`}
                                />
                            </div>
                        )}
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <form.Field
                            name="address.city"
                            children={(field) => (
                                <div className="space-y-2">
                                    <label htmlFor={field.name} className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">City</label>
                                    <input
                                        id={field.name}
                                        type="text"
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        className={`${inputBase} ${inputNormal}`}
                                    />
                                </div>
                            )}
                        />

                        <form.Field
                            name="address.state"
                            children={(field) => (
                                <div className="space-y-2">
                                    <label htmlFor={field.name} className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">State / Province</label>
                                    <input
                                        id={field.name}
                                        type="text"
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        className={`${inputBase} ${inputNormal}`}
                                    />
                                </div>
                            )}
                        />

                        <form.Field
                            name="address.zipCode"
                            children={(field) => (
                                <div className="space-y-2">
                                    <label htmlFor={field.name} className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Zip / Postal Code</label>
                                    <input
                                        id={field.name}
                                        type="text"
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        className={`${inputBase} ${inputNormal}`}
                                    />
                                </div>
                            )}
                        />

                        <form.Field
                            name="address.country"
                            children={(field) => (
                                <div className="space-y-2">
                                    <label htmlFor={field.name} className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Country</label>
                                    <input
                                        id={field.name}
                                        type="text"
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        className={`${inputBase} ${inputNormal}`}
                                    />
                                </div>
                            )}
                        />
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 border-t border-border pt-6">
                <button
                    type="button"
                    onClick={() => form.reset()}
                    className="rounded-lg border border-input bg-background px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                    Reset form
                </button>

                <form.Subscribe
                    selector={(state) => [state.canSubmit, state.isSubmitting]}
                    children={([canSubmit, isSubmitting]) => (
                        <button
                            type="submit"
                            disabled={!canSubmit || isSubmitting}
                            className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 shadow-sm"
                        >
                            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                            {isSubmitting ? 'Saving changes...' : 'Save settings'}
                        </button>
                    )}
                />
            </div>
        </form>
    )
}