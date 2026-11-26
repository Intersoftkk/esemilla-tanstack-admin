import {Bell, Save, Shield, Trash2, User} from 'lucide-react'
import {Button} from '#/components/ui/button'
import {usePermission} from '#/features/auth/hooks/use-permission'

export function SettingsPage() {
    const {user} = usePermission()

    return (
        <div className="max-w-3xl mx-auto space-y-8">
            <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">Account Settings</h1>
                <p className="text-sm text-muted-foreground mt-1">Manage your owner profile, security, and notification
                    preferences</p>
            </div>

            {/* Profile Section */}
            <div
                className="bg-white border border-zinc-200/80 rounded-2xl p-6 space-y-6">
                <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                    <User className="w-4.5 h-4.5 text-primary"/> Profile Information
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                        <label className="text-xs font-semibold text-foreground mb-1.5 block">Full Name</label>
                        <input type="text" defaultValue={user?.name || 'James Mitchell'}
                               className="w-full h-10 px-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40"/>
                    </div>
                    <div>
                        <label className="text-xs font-semibold text-foreground mb-1.5 block">Email Address</label>
                        <input type="email" defaultValue={user?.email || 'james@oakridge.edu'}
                               className="w-full h-10 px-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40"/>
                    </div>
                    <div>
                        <label className="text-xs font-semibold text-foreground mb-1.5 block">Organization Name</label>
                        <input type="text" defaultValue="Oakridge Education Group"
                               className="w-full h-10 px-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40"/>
                    </div>
                    <div>
                        <label className="text-xs font-semibold text-foreground mb-1.5 block">Phone Number</label>
                        <input type="tel" defaultValue="+1 (555) 234-5678"
                               className="w-full h-10 px-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40"/>
                    </div>
                </div>
            </div>

            {/* Security Section */}
            <div
                className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl p-6 space-y-5">
                <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                    <Shield className="w-4.5 h-4.5 text-primary"/> Security
                </h3>
                <div className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
                    {[
                        {label: 'Change Password', desc: 'Last changed 45 days ago', action: 'Update'},
                        {label: 'Two-Factor Authentication', desc: 'Authenticator app enabled', action: 'Manage'},
                        {label: 'Active Sessions', desc: '3 devices currently logged in', action: 'Review'},
                    ].map((item, i) => (
                        <div key={i} className="py-4 flex items-center justify-between first:pt-0 last:pb-0">
                            <div>
                                <p className="text-sm font-semibold text-foreground">{item.label}</p>
                                <p className="text-[11px] text-muted-foreground mt-0.5">{item.desc}</p>
                            </div>
                            <Button variant="outline" size="sm" className="rounded-xl text-xs font-semibold h-8">
                                {item.action}
                            </Button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Notifications */}
            <div
                className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl p-6 space-y-5">
                <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                    <Bell className="w-4.5 h-4.5 text-primary"/> Notification Preferences
                </h3>
                <div className="space-y-4">
                    {[
                        {
                            label: 'Billing & Invoice Alerts',
                            desc: 'Payment confirmations and renewal reminders',
                            enabled: true
                        },
                        {
                            label: 'School Onboarding Updates',
                            desc: 'New school registration status changes',
                            enabled: true
                        },
                        {label: 'Security Alerts', desc: 'Login attempts and permission changes', enabled: true},
                        {
                            label: 'Platform Announcements',
                            desc: 'Feature updates and maintenance windows',
                            enabled: false
                        },
                    ].map((pref, i) => (
                        <div key={i} className="flex items-center justify-between py-2">
                            <div>
                                <p className="text-sm font-semibold text-foreground">{pref.label}</p>
                                <p className="text-[11px] text-muted-foreground mt-0.5">{pref.desc}</p>
                            </div>
                            <div
                                className={`w-11 h-6 rounded-full p-0.5 cursor-pointer transition-colors ${pref.enabled ? 'bg-primary' : 'bg-zinc-300 dark:bg-zinc-600'}`}>
                                <div
                                    className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${pref.enabled ? 'translate-x-5' : 'translate-x-0'}`}/>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Danger Zone */}
            <div
                className="bg-white dark:bg-zinc-900 border-2 border-rose-200 dark:border-rose-900/40 rounded-2xl p-6 space-y-4">
                <h3 className="text-base font-bold text-rose-600 flex items-center gap-2">
                    <Trash2 className="w-4.5 h-4.5"/> Danger Zone
                </h3>
                <p className="text-xs text-muted-foreground">Permanently delete your organization and all associated
                    school data. This action is irreversible.</p>
                <Button variant="outline" size="sm"
                        className="rounded-xl text-xs font-semibold h-9 text-rose-600 border-rose-300 dark:border-rose-800 hover:bg-rose-50 dark:hover:bg-rose-950/30">
                    Delete Organization
                </Button>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
                <Button
                    className="rounded-xl font-semibold h-10 px-8 bg-gradient-to-r from-primary to-indigo-600 shadow-lg shadow-primary/25 gap-2">
                    <Save className="w-4 h-4"/> Save All Changes
                </Button>
            </div>
        </div>
    )
}