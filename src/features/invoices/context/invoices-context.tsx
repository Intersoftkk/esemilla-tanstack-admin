// #/features/invoices/context/invoices-context.tsx
import React, { useState } from 'react'
import useDialogState from '#/hooks/use-dialog-state'
import type { InvoiceRecord } from '#/features/invoices/types/invoices.ts'

type InvoicesDialogType =
    | 'add'
    | 'view'
    | 'edit'
    | 'delete'
    | 'features'
    | 'feature-manager'

interface InvoicesContextType {
    open: InvoicesDialogType | null
    setOpen: (type: InvoicesDialogType | null) => void
    currentRow: InvoiceRecord | null
    setCurrentRow: React.Dispatch<React.SetStateAction<InvoiceRecord | null>>
}

const InvoicesContext = React.createContext<InvoicesContextType | null>(null)

interface Props {
    children: React.ReactNode
}

/** Provides the dialog state shared by the invoices page components. */
export default function InvoicesProvider({ children }: Props) {
    const [open, setOpen] = useDialogState<InvoicesDialogType>(null)
    const [currentRow, setCurrentRow] = useState<InvoiceRecord | null>(null)

    return (
        <InvoicesContext.Provider value={{ open, setOpen, currentRow, setCurrentRow }}>
            {children}
        </InvoicesContext.Provider>
    )
}

/** Accesses the invoices dialog context. */
export const useInvoices = () => {
    const context = React.useContext(InvoicesContext)
    if (!context) {
        throw new Error('useInvoices must be used within a InvoicesProvider')
    }
    return context
}
