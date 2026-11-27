// #/features/audit-logs/types/audit-logs.type.ts

export interface AuditActor {
	id: string;
	name: string | null;
	email: string | null;
}

export interface AuditLogRecord {
	id: string;
	/** `created` | `updated` | `deleted` | `restored` … */
	event: string;
	description: string | null;
	actor: AuditActor | null;
	/** Short class name of the audited model, e.g. `Tenant`. */
	subjectType: string | null;
	subjectId: string | null;
	ipAddress: string | null;
	createdAt: string | null;
	/** Pretty-printed JSON diff of the changed fields. */
	changes: string | null;
}
