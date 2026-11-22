import {ArrowRight, Check, CreditCard, Crown, Star} from 'lucide-react'
import {Button} from '#/components/ui/button'

const PLANS = [
    {
        name: 'Starter',
        price: 99,
        period: '/mo',
        schools: 2,
        students: 500,
        storage: '10 GB',
        features: ['Basic analytics', 'Email support', '1 Custom domain'],
        current: false,
        popular: false,
        color: 'border-zinc-200 dark:border-zinc-700'
    },
    {
        name: 'Growth',
        price: 249,
        period: '/mo',
        schools: 5,
        students: 2000,
        storage: '50 GB',
        features: ['Advanced analytics', 'Priority support', '3 Custom domains', 'API access'],
        current: false,
        popular: true,
        color: 'border-primary/40'
    },
    {
        name: 'Enterprise',
        price: 499,
        period: '/mo',
        schools: 10,
        students: 5000,
        storage: '100 GB',
        features: ['Full analytics suite', '24/7 Dedicated support', 'Unlimited domains', 'Full API + Webhooks', 'White-label branding', 'SSO & SAML'],
        current: true,
        popular: false,
        color: 'border-amber-400/40'
    },
]

export function BillingPage() {
    return (
        <div className="max-w-350 mx-auto space-y-8">
            <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">Plan & Billing</h1>
                <p className="text-sm text-muted-foreground mt-1">Manage your subscription, compare plans, and update
                    payment methods</p>
            </div>

            {/* Current Plan Banner */}
            <div
                className="relative overflow-hidden bg-linear-to-r from-zinc-900 via-zinc-800 to-zinc-900 rounded-2xl p-6 sm:p-8 text-white">
                <div className="absolute -right-16 -top-16 w-48 h-48 bg-primary/20 rounded-full blur-3xl"/>
                <div className="absolute -left-8 -bottom-8 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl"/>
                <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <div
                            className="h-14 w-14 rounded-2xl bg-linear-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-xl">
                            <Crown className="w-7 h-7 text-white"/>
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h2 className="text-xl font-extrabold">Enterprise Plan</h2>
                                <span
                                    className="text-[9px] font-bold px-2 py-0.5 rounded-md bg-emerald-400/20 text-emerald-300 border border-emerald-400/20">ACTIVE</span>
                            </div>
                            <p className="text-sm text-zinc-400 mt-0.5">$499/month • Renews June 1, 2025</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="outline" size="sm"
                                className="rounded-xl font-semibold bg-white/10 text-white border-white/20 hover:bg-white/20 h-10">
                            <CreditCard className="w-4 h-4 mr-1.5"/> Update Payment
                        </Button>
                        <Button size="sm"
                                className="rounded-xl font-semibold h-10 bg-linear-to-r from-primary to-indigo-600 shadow-lg">
                            Upgrade Plan <ArrowRight className="w-4 h-4 ml-1"/>
                        </Button>
                    </div>
                </div>
            </div>

            {/* Plan Comparison */}
            <div>
                <h2 className="text-lg font-bold text-foreground mb-4">Compare Plans</h2>
                <div className="grid md:grid-cols-3 gap-5">
                    {PLANS.map((plan, i) => (
                        <div key={i}
                             className={`relative bg-white border-2 ${plan.color} rounded-2xl p-6 space-y-5 ${plan.popular ? 'shadow-xl shadow-primary/10' : 'shadow-sm'}`}>
                            {plan.popular && (
                                <div
                                    className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-linear-to-r from-primary to-indigo-600 text-white text-[10px] font-bold rounded-full flex items-center gap-1">
                                    <Star className="w-3 h-3"/> Most Popular
                                </div>
                            )}
                            {plan.current && (
                                <div
                                    className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-linear-to-r from-amber-400 to-orange-500 text-white text-[10px] font-bold rounded-full flex items-center gap-1">
                                    <Crown className="w-3 h-3"/> Current Plan
                                </div>
                            )}
                            <div>
                                <h3 className="text-lg font-bold text-foreground">{plan.name}</h3>
                                <div className="flex items-baseline gap-1 mt-2">
                                    <span className="text-3xl font-extrabold text-foreground">${plan.price}</span>
                                    <span className="text-sm text-muted-foreground">{plan.period}</span>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                                <div className="p-2 rounded-lg bg-zinc-50 text-center">
                                    <p className="font-bold text-foreground">{plan.schools}</p>
                                    <p className="text-[9px] text-muted-foreground">Schools</p>
                                </div>
                                <div className="p-2 rounded-lg bg-zinc-50 text-center">
                                    <p className="font-bold text-foreground">{plan.students.toLocaleString()}</p>
                                    <p className="text-[9px] text-muted-foreground">Students</p>
                                </div>
                            </div>
                            <ul className="space-y-2.5">
                                {plan.features.map((f, j) => (
                                    <li key={j} className="flex items-center gap-2 text-xs text-foreground">
                                        <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0"/>
                                        {f}
                                    </li>
                                ))}
                            </ul>
                            <Button
                                className={`w-full rounded-xl font-semibold h-10 ${
                                    plan.current
                                        ? 'bg-zinc-100 text-zinc-500 cursor-default'
                                        : 'bg-linear-to-r from-primary to-indigo-600 text-white shadow-md'
                                }`}
                                disabled={plan.current}
                            >
                                {plan.current ? 'Current Plan' : 'Select Plan'}
                            </Button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}