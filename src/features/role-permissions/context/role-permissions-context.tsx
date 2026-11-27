// #/features/role-permissions/context/role-permissions-context.tsx
import React, { useState } from 'react'
import useDialogState from '#/hooks/use-dialog-state'
import type { RolePermissionRecord } from '#/features/role-permissions/types/role-permissions.type.ts'

type RolePermissionsDialogType =
    | 'add'
    | 'view'
    | 'edit'
    | 'delete'

interface RolePermissionsContextType {
    open: RolePermissionsDialogType | null
    setOpen: (type: RolePermissionsDialogType | null) => void
    currentRow: RolePermissionRecord | null
    setCurrentRow: React.Dispatch<React.SetStateAction<RolePermissionRecord | null>>
}

const RolePermissionsContext = React.createContext<RolePermissionsContextType | null>(null)

interface Props {
    children: React.ReactNode
}

/** Provides the dialog state shared by the rolePermissions page components. */
export default function RolePermissionsProvider({ children }: Props) {
    const [open, setOpen] = useDialogState<RolePermissionsDialogType>(null)
    const [currentRow, setCurrentRow] = useState<RolePermissionRecord | null>(null)

    return (
        <RolePermissionsContext.Provider value={{ open, setOpen, currentRow, setCurrentRow }}>
            {children}
        </RolePermissionsContext.Provider>
    )
}

/** Accesses the rolePermissions dialog context. */
export const useRolePermissions = () => {
    const context = React.useContext(RolePermissionsContext)
    if (!context) {
        throw new Error('useRolePermissions must be used within a RolePermissionsProvider')
    }
    return context
}
