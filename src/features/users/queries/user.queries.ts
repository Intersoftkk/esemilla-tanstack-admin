// #/features/users/queries/user.queries.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { USER_KEYS } from "#/features/users/queries/user.keys.ts";
import type { UserFormData } from "#/features/users/schema/users-form.schema.ts";
import type { UsersListParams } from "#/features/users/schema/users-search.schema.ts";
import {
	createUser,
	deleteUser,
	deleteUsers,
	fetchCompanies,
	fetchPaginatedUsers,
	updateUser,
} from "#/features/users/service/users.service.ts";

interface UserMutationOptions {
	/** Called after the cache has been invalidated and the toast shown. */
	onSuccess?: () => void;
}

/** Returns an error message suitable for a toast. */
function getErrorMessage(error: unknown, fallback: string): string {
	return error instanceof Error && error.message ? error.message : fallback;
}

/** Paginated users list, keyed by the current table state. */
export function useUsersPaginateQuery(params: UsersListParams) {
	return useQuery({
		queryKey: USER_KEYS.lists(params),
		queryFn: () => fetchPaginatedUsers(params),
	});
}

/** Companies available for assignment when creating or editing a user. */
export function useCompaniesQuery() {
	return useQuery({
		queryKey: USER_KEYS.companies(),
		queryFn: fetchCompanies,
		staleTime: 1000 * 60 * 5,
	});
}

/** Creates a user. */
export function useCreateUserMutation(options?: UserMutationOptions) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (payload: UserFormData) => createUser(payload),
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: USER_KEYS.all });
			toast.success("User created successfully.");
			options?.onSuccess?.();
		},
		onError: (error) =>
			toast.error(getErrorMessage(error, "Could not create user.")),
	});
}

/** Updates an existing user. */
export function useUpdateUserMutation(options?: UserMutationOptions) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, payload }: { id: string; payload: UserFormData }) =>
			updateUser(id, payload),
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: USER_KEYS.all });
			toast.success("User updated successfully.");
			options?.onSuccess?.();
		},
		onError: (error) =>
			toast.error(getErrorMessage(error, "Could not update user.")),
	});
}

/** Deletes a single user. */
export function useDeleteUserMutation(options?: UserMutationOptions) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: string) => deleteUser(id),
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: USER_KEYS.all });
			toast.success("User deleted successfully.");
			options?.onSuccess?.();
		},
		onError: (error) =>
			toast.error(getErrorMessage(error, "Could not delete user.")),
	});
}

/** Deletes the selected users in one batch. */
export function useDeleteUsersMutation(options?: UserMutationOptions) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (ids: string[]) => deleteUsers(ids),
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: USER_KEYS.all });
			toast.success("Selected users deleted successfully.");
			options?.onSuccess?.();
		},
		onError: (error) =>
			toast.error(getErrorMessage(error, "Could not delete users.")),
	});
}
