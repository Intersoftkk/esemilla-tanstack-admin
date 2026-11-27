// #/features/users/server/users.functions.ts
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { userSchema } from "#/features/users/schema/users-form.schema.ts";
import { usersListParamsSchema } from "#/features/users/schema/users-search.schema.ts";
import {
	createUserRequest,
	deleteUserRequest,
	fetchCompanies,
	fetchUser,
	fetchUsers,
	updateUserRequest,
} from "#/features/users/server/users.server.ts";

const userIdSchema = z.union([z.string(), z.number()]).transform(String);

const updateUserSchema = z.object({
	id: userIdSchema,
	payload: userSchema,
});

/** Server function: paginated users list. */
export const getUsersFn = createServerFn({ method: "GET" })
	.validator((data: unknown) => usersListParamsSchema.parse(data ?? {}))
	.handler(async ({ data }) => fetchUsers(data));

/** Server function: a single user by ID. */
export const getUserFn = createServerFn({ method: "GET" })
	.validator((data: unknown) => userIdSchema.parse(data))
	.handler(async ({ data: id }) => fetchUser(id));

/** Server function: companies available for user assignment. */
export const getCompaniesFn = createServerFn({ method: "GET" }).handler(
	async () => fetchCompanies(),
);

/** Server function: create a user. */
export const createUserFn = createServerFn({ method: "POST" })
	.validator((data: unknown) => userSchema.parse(data))
	.handler(async ({ data }) => createUserRequest(data));

/** Server function: update a user. */
export const updateUserFn = createServerFn({ method: "POST" })
	.validator((data: unknown) => updateUserSchema.parse(data))
	.handler(async ({ data }) => updateUserRequest(data.id, data.payload));

/** Server function: delete a user. */
export const deleteUserFn = createServerFn({ method: "POST" })
	.validator((data: unknown) => userIdSchema.parse(data))
	.handler(async ({ data: id }) => deleteUserRequest(id));

/** Server function: delete several users in one request. */
export const deleteUsersFn = createServerFn({ method: "POST" })
	.validator((data: unknown) => z.array(userIdSchema).min(1).parse(data))
	.handler(async ({ data: ids }) => {
		await Promise.all(ids.map((id) => deleteUserRequest(id)));
		return { deleted: ids.length };
	});
