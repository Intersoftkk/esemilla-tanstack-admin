import { createFileRoute } from '@tanstack/react-router'
import {ProfilePage} from "#/features/auth/profile-page.tsx";

export const Route = createFileRoute('/_authed/profile/')({
  component: ProfilePage,
})