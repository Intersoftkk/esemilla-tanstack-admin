// #/features/owners/types/owners.type.ts

export interface OwnerRecord {
	id: string;
	name: string | null;
	email: string | null;
	phone: string | null;
	status: string;
	/** Number of tenant businesses owned. */
	tenantsCount: number;
	createdAt: string | null;
}
