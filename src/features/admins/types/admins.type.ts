// #/features/admins/types/admins.type.ts

export interface AdminRecord {
	id: string;
	name: string | null;
	email: string | null;
	status: string;
	roles: Array<string>;
	lastLoginAt: string | null;
	createdAt: string | null;
}
