// #/features/payments/context/payments-context.tsx
import React, { useState } from 'react'
import useDialogState from '#/hooks/use-dialog-state'
import type { PaymentRecord } from '#/features/payments/types/payments.type.ts'

type PaymentsDialogType =
    | 'add'
    | 'view'
    | 'edit'
    | 'delete'

interface PaymentsContextType {
    open: PaymentsDialogType | null
    setOpen: (type: PaymentsDialogType | null) => void
    currentRow: PaymentRecord | null
    setCurrentRow: React.Dispatch<React.SetStateAction<PaymentRecord | null>>
}

const PaymentsContext = React.createContext<PaymentsContextType | null>(null)

interface Props {
    children: React.ReactNode
}

/** Provides the dialog state shared by the payments page components. */
export default function PaymentsProvider({ children }: Props) {
    const [open, setOpen] = useDialogState<PaymentsDialogType>(null)
    const [currentRow, setCurrentRow] = useState<PaymentRecord | null>(null)

    return (
        <PaymentsContext.Provider value={{ open, setOpen, currentRow, setCurrentRow }}>
            {children}
        </PaymentsContext.Provider>
    )
}

/** Accesses the payments dialog context. */
export const usePayments = () => {
    const context = React.useContext(PaymentsContext)
    if (!context) {
        throw new Error('usePayments must be used within a PaymentsProvider')
    }
    return context
}
