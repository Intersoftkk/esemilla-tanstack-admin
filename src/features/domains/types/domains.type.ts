// #/features/domains/types/domains.type.ts

export interface DomainTenantRef {
	id: string;
	name: string | null;
}

export interface DomainRecord {
	id: string;
	/** Host name, e.g. `oakridge.esemilla.com`. */
	domain: string;
	tenant: DomainTenantRef | null;
	status: string;
	verified: boolean;
	isPrimary: boolean;
	createdAt: string | null;
}
