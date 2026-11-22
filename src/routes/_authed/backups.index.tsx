import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authed/backups/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_authed/notification/"!</div>
}
