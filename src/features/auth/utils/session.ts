// utils/session.ts — import only from server code

import { getCookie, setCookie } from "@tanstack/react-start/server";
import { getIronSession } from "iron-session";
import { env } from "#/env.ts";
import type { AuthSession } from "#/features/auth/types/auth.type";

export function getAppSession(ttl = 7 * 24 * 60 * 60) {
	const password = env.SESSION_SECRET;

	if (!password || password.length < 32) {
		throw new Error("SESSION_SECRET must be at least 32 characters");
	}

	return getIronSession<AuthSession>(
		{ read: getCookie, write: setCookie },
		{
			cookieName: "__Host-session",
			password,
			ttl,
			cookieOptions: {
				secure: true,
				sameSite: "lax",
				httpOnly: true,
				path: "/",
			},
		},
	);
}
