import {CheckCircle2, Download,} from 'lucide-react'
import {Button} from '#/components/ui/button'

const INVOICES = [
    {
        id: 'INV-1042',
        date: 'May 1, 2025',
        desc: 'Enterprise Plan — Monthly',
        amount: '$499.00',
        status: 'Paid',
        method: 'Visa •••• 4242'
    },
    {
        id: 'INV-1041',
        date: 'Apr 1, 2025',
        desc: 'Enterprise Plan — Monthly',
        amount: '$499.00',
        status: 'Paid',
        method: 'Visa •••• 4242'
    },
    {
        id: 'INV-1040',
        date: 'Mar 1, 2025',
        desc: 'Enterprise Plan — Monthly',
        amount: '$499.00',
        status: 'Paid',
        method: 'Visa •••• 4242'
    },
    {
        id: 'INV-1039',
        date: 'Feb 1, 2025',
        desc: 'Growth → Enterprise Upgrade (Prorated)',
        amount: '$250.00',
        status: 'Paid',
        method: 'Visa •••• 4242'
    },
    {
        id: 'INV-1038',
        date: 'Feb 1, 2025',
        desc: 'Growth Plan — Monthly',
        amount: '$249.00',
        status: 'Paid',
        method: 'Visa •••• 4242'
    },
    {
        id: 'INV-1037',
        date: 'Jan 1, 2025',
        desc: 'Growth Plan — Monthly',
        amount: '$249.00',
        status: 'Paid',
        method: 'Visa •••• 4242'
    },
]

export function InvoicesPage() {
    return (
        <div className="max-w-350 mx-auto space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">Invoices &
                        Receipts</h1>
                    <p className="text-sm text-muted-foreground mt-1">Download past invoices and view payment
                        history</p>
                </div>
                <Button variant="outline" size="sm" className="gap-1.5 rounded-xl font-semibold h-10">
                    <Download className="w-3.5 h-3.5"/> Download All
                </Button>
            </div>

            <div className="bg-white border border-zinc-200/80 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                        <thead className="bg-zinc-50 text-muted-foreground font-semibold border-b border-zinc-100">
                        <tr>
                            <th className="py-3.5 px-6">Invoice</th>
                            <th className="py-3.5 px-6">Date</th>
                            <th className="py-3.5 px-6">Description</th>
                            <th className="py-3.5 px-6">Amount</th>
                            <th className="py-3.5 px-6">Status</th>
                            <th className="py-3.5 px-6 text-right">Action</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100 text-foreground">
                        {INVOICES.map((inv, i) => (
                            <tr key={i} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20 transition-colors">
                                <td className="py-4 px-6 font-bold font-mono text-primary">{inv.id}</td>
                                <td className="py-4 px-6 text-muted-foreground">{inv.date}</td>
                                <td className="py-4 px-6 font-medium">{inv.desc}</td>
                                <td className="py-4 px-6 font-bold">{inv.amount}</td>
                                <td className="py-4 px-6">
                                        <span
                                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/10 text-emerald-600">
                                            <CheckCircle2 className="w-3 h-3"/> {inv.status}
                                        </span>
                                </td>
                                <td className="py-4 px-6 text-right">
                                    <Button variant="ghost" size="sm"
                                            className="h-8 gap-1 text-xs font-semibold rounded-lg">
                                        <Download className="w-3 h-3"/> PDF
                                    </Button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}