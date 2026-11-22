import {createFileRoute} from '@tanstack/react-router'
import {BillingPage} from "#/features/billing/billing-page.tsx";

export const Route = createFileRoute('/_authed/billing')({
  component: BillingPage,
})