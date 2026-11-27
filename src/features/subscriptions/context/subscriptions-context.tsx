// #/features/subscriptions/context/subscriptions-context.tsx
import React, { useState } from 'react'
import useDialogState from '#/hooks/use-dialog-state'
import type { SubscriptionRecord } from '#/features/subscriptions/types/subscriptions.ts'

type SubscriptionsDialogType =
    | 'add'
    | 'view'
    | 'edit'
    | 'delete'
    | 'features'
    | 'feature-manager'

interface SubscriptionsContextType {
    open: SubscriptionsDialogType | null
    setOpen: (type: SubscriptionsDialogType | null) => void
    currentRow: SubscriptionRecord | null
    setCurrentRow: React.Dispatch<React.SetStateAction<SubscriptionRecord | null>>
}

const SubscriptionsContext = React.createContext<SubscriptionsContextType | null>(null)

interface Props {
    children: React.ReactNode
}

/** Provides the dialog state shared by the subscriptions page components. */
export default function SubscriptionsProvider({ children }: Props) {
    const [open, setOpen] = useDialogState<SubscriptionsDialogType>(null)
    const [currentRow, setCurrentRow] = useState<SubscriptionRecord | null>(null)

    return (
        <SubscriptionsContext.Provider value={{ open, setOpen, currentRow, setCurrentRow }}>
            {children}
        </SubscriptionsContext.Provider>
    )
}

/** Accesses the subscriptions dialog context. */
export const useSubscriptions = () => {
    const context = React.useContext(SubscriptionsContext)
    if (!context) {
        throw new Error('useSubscriptions must be used within a SubscriptionsProvider')
    }
    return context
}
