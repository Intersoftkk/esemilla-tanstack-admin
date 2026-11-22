import {createFileRoute} from '@tanstack/react-router'
import {SettingsPage} from "#/features/settings/settings-page.tsx";

export const Route = createFileRoute('/_authed/settings')({
  component: SettingsPage,
})
