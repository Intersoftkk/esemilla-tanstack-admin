// #/features/role-permissions/queries/role-permission.queries.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { ROLE_PERMISSION_KEYS } from "#/features/role-permissions/queries/role-permission.keys.ts";
import type { RolePermissionFormData } from "#/features/role-permissions/schema/role-permissions-form.schema.ts";
import type { RolePermissionsListParams } from "#/features/role-permissions/schema/role-permissions-search.schema.ts";
import {
	createRolePermission,
	deleteRolePermission,
	deleteRolePermissions,
	fetchCompanies,
	fetchPaginatedRolePermissions,
	updateRolePermission,
} from "#/features/role-permissions/service/role-permissions.service.ts";

interface RolePermissionMutationOptions {
	/** Called after the cache has been invalidated and the toast shown. */
	onSuccess?: () => void;
}

/** Returns an error message suitable for a toast. */
function getErrorMessage(error: unknown, fallback: string): string {
	return error instanceof Error && error.message ? error.message : fallback;
}

/** Paginated rolePermissions list, keyed by the current table state. */
export function useRolePermissionsPaginateQuery(
	params: RolePermissionsListParams,
) {
	return useQuery({
		queryKey: ROLE_PERMISSION_KEYS.lists(params),
		queryFn: () => fetchPaginatedRolePermissions(params),
	});
}

/** Companies available for assignment when creating or editing a role permission. */
export function useCompaniesQuery() {
	return useQuery({
		queryKey: ROLE_PERMISSION_KEYS.companies(),
		queryFn: fetchCompanies,
		staleTime: 1000 * 60 * 5,
	});
}

/** Creates a role permission. */
export function useCreateRolePermissionMutation(
	options?: RolePermissionMutationOptions,
) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (payload: RolePermissionFormData) =>
			createRolePermission(payload),
		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: ROLE_PERMISSION_KEYS.all,
			});
			toast.success("RolePermission created successfully.");
			options?.onSuccess?.();
		},
		onError: (error) =>
			toast.error(getErrorMessage(error, "Could not create rolePermission.")),
	});
}

/** Updates an existing rolePermission. */
export function useUpdateRolePermissionMutation(
	options?: RolePermissionMutationOptions,
) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			id,
			payload,
		}: {
			id: string;
			payload: RolePermissionFormData;
		}) => updateRolePermission(id, payload),
		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: ROLE_PERMISSION_KEYS.all,
			});
			toast.success("RolePermission updated successfully.");
			options?.onSuccess?.();
		},
		onError: (error) =>
			toast.error(getErrorMessage(error, "Could not update rolePermission.")),
	});
}

/** Deletes a single rolePermission. */
export function useDeleteRolePermissionMutation(
	options?: RolePermissionMutationOptions,
) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: string) => deleteRolePermission(id),
		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: ROLE_PERMISSION_KEYS.all,
			});
			toast.success("RolePermission deleted successfully.");
			options?.onSuccess?.();
		},
		onError: (error) =>
			toast.error(getErrorMessage(error, "Could not delete rolePermission.")),
	});
}

/** Deletes the selected rolePermissions in one batch. */
export function useDeleteRolePermissionsMutation(
	options?: RolePermissionMutationOptions,
) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (ids: string[]) => deleteRolePermissions(ids),
		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: ROLE_PERMISSION_KEYS.all,
			});
			toast.success("Selected rolePermissions deleted successfully.");
			options?.onSuccess?.();
		},
		onError: (error) =>
			toast.error(getErrorMessage(error, "Could not delete rolePermissions.")),
	});
}
