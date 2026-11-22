import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authed/feedback/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_authed/notification/"!</div>
}
