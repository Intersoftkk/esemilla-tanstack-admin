// #/features/auth/types/user.type.ts

import type {
	PermissionRecord,
	Role,
} from "#/features/auth/types/role-permission.type.ts";

export interface User {
	id: string;
	name: string;
	email: string;
	mobile: string | null;
	avatar: string | null;
	twoFactorEnabled?: boolean;
	emailVerifiedAt: string | null;
	mobileVerifiedAt: string | null;

	/** Assigned roles to the user */
	roles?: Role[];

	/** Direct or aggregated permissions assigned to the user */
	permissions?: PermissionRecord[];
}

export interface AuthSession {
	token: string;
	user: User;
	userId: string;
	domain?: string;
}
