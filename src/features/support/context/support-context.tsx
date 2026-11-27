// #/features/support/context/support-context.tsx
import React, { useState } from 'react'
import useDialogState from '#/hooks/use-dialog-state'
import type { SupportRecord } from '#/features/support/types/support.type.ts'

type SupportDialogType =
    | 'add'
    | 'view'
    | 'edit'
    | 'delete'

interface SupportContextType {
    open: SupportDialogType | null
    setOpen: (type: SupportDialogType | null) => void
    currentRow: SupportRecord | null
    setCurrentRow: React.Dispatch<React.SetStateAction<SupportRecord | null>>
}

const SupportContext = React.createContext<SupportContextType | null>(null)

interface Props {
    children: React.ReactNode
}

/** Provides the dialog state shared by the support page components. */
export default function SupportProvider({ children }: Props) {
    const [open, setOpen] = useDialogState<SupportDialogType>(null)
    const [currentRow, setCurrentRow] = useState<SupportRecord | null>(null)

    return (
        <SupportContext.Provider value={{ open, setOpen, currentRow, setCurrentRow }}>
            {children}
        </SupportContext.Provider>
    )
}

/** Accesses the support dialog context. */
export const useSupport = () => {
    const context = React.useContext(SupportContext)
    if (!context) {
        throw new Error('useSupport must be used within a SupportProvider')
    }
    return context
}
