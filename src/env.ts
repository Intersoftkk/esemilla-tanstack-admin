import { createEnv } from '@t3-oss/env-core'
import { z } from 'zod'

export const env = createEnv({
	server: {
		BACKEND_API_URL: z.url(),
		SESSION_SECRET: z.string().min(32),
	},

	/**
	 * The prefix that client-side variables must have. This is enforced both at
	 * a type-level and at runtime.
	 */
	clientPrefix: 'VITE_',

	client: {
		VITE_ENV: z.string().optional(),
		VITE_ROOT_DOMAIN: z.string().min(1).default('localhost'),
		VITE_APP_URL: z.url('VITE_APP_URL must be a valid URL'),
		VITE_API_BROADCASTING_URL: z.url().optional(),

		// Laravel Reverb / Echo Variables
		VITE_REVERB_APP_KEY: z.string().min(1).optional(),
		VITE_REVERB_HOST: z.string().min(1).optional(),
		VITE_REVERB_PORT: z.coerce.number().optional().default(8080),
		VITE_REVERB_SCHEME: z.enum(['http', 'https']).optional().default('http'),
	},

	/**
	 * What object holds the environment variables at runtime. This is usually
	 * `process.env` or `import.meta.env`.
	 */
	// runtimeEnv: import.meta.env,
	runtimeEnv: {
		...import.meta.env,
		...process.env,
	},

	/**
	 * By default, this library will feed the environment variables directly to
	 * the Zod validator.
	 *
	 * This means that if you have an empty string for a value that is supposed
	 * to be a number (e.g. `PORT=` in a ".env" file), Zod will incorrectly flag
	 * it as a type mismatch violation. Additionally, if you have an empty string
	 * for a value that is supposed to be a string with a default value (e.g.
	 * `DOMAIN=` in an ".env" file), the default value will never be applied.
	 *
	 * In order to solve these issues, we recommend that all new projects
	 * explicitly specify this option as true.
	 */
	emptyStringAsUndefined: true,
});
