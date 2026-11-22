// src/features/profile/change-password.tsx

import { Shield } from 'lucide-react'
import { ChangePasswordForm } from '#/features/auth/components/change-password-form.tsx'

export function ChangePasswordPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Account Settings</h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Manage your account information and preferences
                    </p>
                </div>

                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
                    <div className="space-y-6">
                        <div className="flex items-start gap-4">
                            <div className="rounded-lg bg-blue-50 p-2.5">
                                <Shield className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900">Change Password</h2>
                                <p className="mt-0.5 text-sm text-gray-500">
                                    Ensure your account is using a strong password for security
                                </p>
                            </div>
                        </div>

                        <hr className="border-gray-200" />

                        <div className="max-w-md">
                            <ChangePasswordForm />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}