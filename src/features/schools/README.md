# Schools feature

Everything a signed-in user needs to onboard **their own business (school)** and
manage it afterwards: a guided onboarding wizard with plan selection, a schools
dashboard, and a per-school workspace with plan, usage and settings.

## Routes

| Path | File | Purpose |
| --- | --- | --- |
| `/schools` | `src/routes/_authed/schools.tsx` | List, search, filter, export, suspend/delete |
| `/schools/new` | `src/routes/_authed/schools_.new.tsx` | Five-step onboarding wizard |
| `/schools/$schoolId` | `src/routes/_authed/schools_.$schoolId.tsx` | Overview, plan & usage, settings, danger zone |

All three sit under the `_authed` layout, so only signed-in users can onboard.

## Onboarding flow

1. **Business** — type, name, official email/phone, website, description.
2. **Location** — address, country (ISO-2), timezone, billing currency.
3. **Plan** — expected students/campuses, monthly vs yearly billing, plan cards
   with a "best fit" recommendation (`recommendPlan`).
4. **Workspace** — subdomain (live availability check) + optional custom domain,
   owner name/email/phone.
5. **Review** — full summary with edit shortcuts, terms acceptance, then create.

Each step is validated with zod (`schema/school.schema.ts`) before the user can
move on, and server-side 422 errors are mapped back onto the matching fields
(`utils/onboarding.utils.ts` → `mapOnboardingErrorField`).

## API contract

`services/school.service.ts` calls these endpoints (the axios instance already
prefixes `/api/v1`):

```
GET    /schools                     list (?include=plan&per_page=100&sort=-created_at
                                    &filter[search]=&filter[status]=)
GET    /schools/{id}                single school
POST   /schools                     create (onboarding payload below)
PUT    /schools/{id}                update profile, address or plan
PATCH  /schools/{id}/status         { "status": "active" | "suspended" | ... }
DELETE /schools/{id}                remove
GET    /schools/slug-availability   { "available": true, "suggestions": ["..."] }
GET    /plans                       subscription catalogue
```

Create payload:

```json
{
  "name": "Oakridge International Academy",
  "type": "school",
  "email": "office@oakridge.edu",
  "phone": "+91 98300 12345",
  "website": "https://oakridge.edu",
  "description": "K-12 school with two campuses",
  "slug": "oakridge",
  "customDomain": null,
  "currency": "USD",
  "planId": "growth",
  "billingCycle": "monthly",
  "expectedStudents": 750,
  "expectedBranches": 1,
  "address": {
    "line1": "12 Park Street",
    "line2": null,
    "city": "Kolkata",
    "state": "West Bengal",
    "postalCode": "700016",
    "country": "IN",
    "timezone": "Asia/Kolkata"
  },
  "admin": {
    "firstName": "Ada",
    "lastName": "Lovelace",
    "email": "ada@oakridge.edu",
    "phone": null
  },
  "acceptTerms": true
}
```

### Response tolerance

`utils/school.mapper.ts` normalises responses, so the UI accepts plain arrays,
`{ data: [...] }` or `{ data: { data: [...] } }` wrappers and either
`snake_case` or `camelCase` keys (`plan_id` / `planId`, `students_count` /
`usage.students`, …). Create/update may return the school resource or an empty
body — when there is no body the wizard falls back to `/schools`.

### Plans

`GET /plans` is the source of truth. Until the billing endpoints are live (or if
the request fails) `config/plans.config.ts` provides a static catalogue with
Starter / Growth / Enterprise pricing, limits and features, so onboarding is
never blocked. Update the catalogue in one place to change marketing pricing.

## Files

```
src/features/schools/
├── config/
│   ├── plans.config.ts        plan catalogue + price/recommendation helpers
│   └── school.config.ts       status/type metadata, timezones, currencies
├── schema/school.schema.ts    onboarding, settings and address validation
├── services/                  school + plan HTTP services
├── queries/                   query keys, hooks and mutations
├── types/school.types.ts      domain models
├── utils/                     formatting, mapper, CSV, onboarding payloads
├── components/                cards, toolbar, stats, wizard, detail tabs
├── schools-page.tsx
├── school-onboarding-page.tsx
└── school-detail-page.tsx
```

## Notes

- Imports stay on the `#/features/schools/...` alias — no relative `../` paths.
- Portal URLs are derived from `VITE_ROOT_DOMAIN` (fallback
  `schoolportal.app`); a verified custom domain wins.
- List filtering/sorting runs client-side over the fetched page so the UI works
  even before server-side filters are implemented; `schoolService.list(filters)`
  already forwards `filter[search]` / `filter[status]` when you want to move it
  server-side.
- CSV export uses the currently filtered list.
