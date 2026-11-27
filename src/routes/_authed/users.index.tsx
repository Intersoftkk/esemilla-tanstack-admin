// #/routes/_authed/users.index.tsx
import { createFileRoute } from '@tanstack/react-router'

import UsersPage from '#/features/users/users-page.tsx'
import { userSearchSchema } from '#/features/users/schema/users-search.schema.ts'
import type { NavigateFn } from '#/hooks/use-table-url-state'
import { pageHead } from '#/lib/head'

export const Route = createFileRoute('/_authed/users/')({
    head: () => pageHead('Users'),
    validateSearch: userSearchSchema,
    component: UsersRoute,
})

/** Route component for the users page. */
function UsersRoute() {
    const search = Route.useSearch()
    const navigate = Route.useNavigate() as unknown as NavigateFn

    return <UsersPage search={search} navigate={navigate} />
}
