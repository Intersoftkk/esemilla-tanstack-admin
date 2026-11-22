import {createFileRoute} from '@tanstack/react-router'
import {SchoolsPage} from "#/features/schools/schools-page.tsx";

export const Route = createFileRoute('/_authed/schools')({
  component: SchoolsPage,
})