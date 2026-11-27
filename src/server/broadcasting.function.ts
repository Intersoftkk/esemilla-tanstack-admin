// src/server/broadcasting.function.ts
import { createServerFn } from "@tanstack/react-start";
import { broadcastAuthSchema } from "#/features/auth/schema/broadcasting.schema.ts";
import { api } from "#/server/api.server.ts";

/**
 * Server Function: Authorizes Laravel Echo private/presence channels
 * Automatically forwards the Bearer token from the session
 */
export const broadcastAuthFn = createServerFn({ method: "POST" })
	.validator((data: unknown) => broadcastAuthSchema.parse(data))
	.handler(async ({ data }) => {
		const payload = data;

		const { data: authData } = await api.post("/broadcasting/auth", {
			socket_id: payload.socket_id,
			channel_name: payload.channel_name,
		});

		return authData;
	});
