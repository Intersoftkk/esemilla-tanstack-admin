// #/features/users/context/users-context.tsx
import React, { useState } from 'react'
import useDialogState from '#/hooks/use-dialog-state'
import type { UserRecord } from '#/features/users/types/users.type.ts'

type UsersDialogType =
    | 'add'
    | 'view'
    | 'edit'
    | 'delete'

interface UsersContextType {
    open: UsersDialogType | null
    setOpen: (type: UsersDialogType | null) => void
    currentRow: UserRecord | null
    setCurrentRow: React.Dispatch<React.SetStateAction<UserRecord | null>>
}

const UsersContext = React.createContext<UsersContextType | null>(null)

interface Props {
    children: React.ReactNode
}

/** Provides the dialog state shared by the users page components. */
export default function UsersProvider({ children }: Props) {
    const [open, setOpen] = useDialogState<UsersDialogType>(null)
    const [currentRow, setCurrentRow] = useState<UserRecord | null>(null)

    return (
        <UsersContext.Provider value={{ open, setOpen, currentRow, setCurrentRow }}>
            {children}
        </UsersContext.Provider>
    )
}

/** Accesses the users dialog context. */
export const useUsers = () => {
    const context = React.useContext(UsersContext)
    if (!context) {
        throw new Error('useUsers must be used within a UsersProvider')
    }
    return context
}
