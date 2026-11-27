// src/server/api.server.ts
import { env } from "#/env.ts";
import { getAppSession } from "#/features/auth/utils/session.ts";

export const API_URL = env.BACKEND_API_URL;

/* -------------------------------------------------------------------------- */
/*                                    Types                                   */
/* -------------------------------------------------------------------------- */

export type Method =
	| "GET"
	| "POST"
	| "PUT"
	| "PATCH"
	| "DELETE"
	| "HEAD"
	| "OPTIONS";

export interface RequestConfig extends Omit<RequestInit, "body" | "method"> {
	url?: string;
	method?: Method | string;
	baseURL?: string;
	params?: Record<string, string | number | boolean | undefined | null>;
	data?: any;
	headers?: Record<string, string>;
}

export interface ApiResponse<T = any> {
	data: T;
	status: number;
	statusText: string;
	headers: Headers;
	config: RequestConfig;
}

/* -------------------------------------------------------------------------- */
/*                                Custom Error                                */
/* -------------------------------------------------------------------------- */

export class ApiError<T = any> extends Error {
	status: number;
	errors?: Record<string, string[]>; // Laravel 422 shortcut
	response?: {
		data: T;
		status: number;
		statusText: string;
		headers: Headers;
	};
	config: RequestConfig;

	constructor(
		message: string,
		status: number,
		config: RequestConfig,
		response?: any,
	) {
		super(message);
		this.name = "ApiError";
		this.status = status;
		this.config = config;
		this.response = response;
		this.errors = response?.data?.errors;
	}
}

/* -------------------------------------------------------------------------- */
/*                              Helper Utilities                              */
/* -------------------------------------------------------------------------- */

function buildUrl(
	baseURL: string,
	endpoint: string = "",
	params?: RequestConfig["params"],
): string {
	const base = baseURL.replace(/\/+$/, "");
	const path = endpoint.replace(/^\/+/, "");
	let fullUrl = path ? `${base}/${path}` : base;

	if (params) {
		const validEntries = Object.entries(params)
			.filter(([_, value]) => value !== undefined && value !== null)
			.map(([k, v]) => [k, String(v)]);

		if (validEntries.length > 0) {
			const qs = new URLSearchParams(validEntries).toString();
			fullUrl += `?${qs}`;
		}
	}

	return fullUrl;
}

/* -------------------------------------------------------------------------- */
/*                               Core Request                                 */
/* -------------------------------------------------------------------------- */

async function request<T = any>(
	config: RequestConfig,
): Promise<ApiResponse<T>> {
	const session = await getAppSession();
	const token = session.token;

	const headers: Record<string, string> = {
		Accept: "application/json",
		...config.headers,
	};

	// 1. Set JSON Content-Type only if not sending FormData
	const isFormData =
		typeof FormData !== "undefined" && config.data instanceof FormData;
	if (!isFormData && config.data !== undefined) {
		headers["Content-Type"] = "application/json";
	}

	// 2. Bearer Token
	if (token) {
		headers["Authorization"] = `Bearer ${token}`;
	}

	// 3. Build Final URL
	const url = buildUrl(config.baseURL || API_URL, config.url, config.params);

	// 4. Body resolution
	let body: BodyInit | null | undefined;
	if (isFormData) {
		body = config.data;
	} else if (config.data !== undefined) {
		body = JSON.stringify(config.data);
	}

	const {
		data: _data,
		params: _params,
		baseURL: _baseURL,
		url: _url,
		...fetchInit
	} = config;

	const response = await fetch(url, {
		...fetchInit,
		method: config.method || "GET",
		headers,
		body,
	});

	// Parse JSON response body if present
	let responseData: any = null;
	if (response.status !== 204) {
		responseData = await response.json().catch(() => null);
	}

	const apiResponse: ApiResponse<T> = {
		data: responseData as T,
		status: response.status,
		statusText: response.statusText,
		headers: response.headers,
		config,
	};

	// Handle Auth Failures
	if (response.status === 401) {
		// iron-session v8: destroy() clears data + expires the cookie in one call
		await session.destroy();
		throw new ApiError("UNAUTHORIZED", 401, config, apiResponse);
	}

	if (response.status === 403) {
		throw new ApiError("FORBIDDEN", 403, config, apiResponse);
	}

	// Handle Validation & other HTTP errors
	if (!response.ok) {
		const message =
			responseData?.message ||
			`Request failed with status code ${response.status}`;
		throw new ApiError(message, response.status, config, apiResponse);
	}

	return apiResponse;
}

/* -------------------------------------------------------------------------- */
/*                                API Client Object                           */
/* -------------------------------------------------------------------------- */

interface ApiInstance {
	<T = any>(config: RequestConfig): Promise<ApiResponse<T>>;
	<T = any>(url: string, config?: RequestConfig): Promise<ApiResponse<T>>;
	get: <T = any>(
		url: string,
		config?: RequestConfig,
	) => Promise<ApiResponse<T>>;
	delete: <T = any>(
		url: string,
		config?: RequestConfig,
	) => Promise<ApiResponse<T>>;
	head: <T = any>(
		url: string,
		config?: RequestConfig,
	) => Promise<ApiResponse<T>>;
	options: <T = any>(
		url: string,
		config?: RequestConfig,
	) => Promise<ApiResponse<T>>;
	post: <T = any>(
		url: string,
		data?: any,
		config?: RequestConfig,
	) => Promise<ApiResponse<T>>;
	put: <T = any>(
		url: string,
		data?: any,
		config?: RequestConfig,
	) => Promise<ApiResponse<T>>;
	patch: <T = any>(
		url: string,
		data?: any,
		config?: RequestConfig,
	) => Promise<ApiResponse<T>>;
}

function createApiInstance(): ApiInstance {
	const instance = ((
		urlOrConfig: string | RequestConfig,
		maybeConfig?: RequestConfig,
	) => {
		if (typeof urlOrConfig === "string") {
			return request({ ...maybeConfig, url: urlOrConfig });
		}
		return request(urlOrConfig);
	}) as ApiInstance;

	instance.get = <T = any>(url: string, config?: RequestConfig) =>
		request<T>({ ...config, method: "GET", url });

	instance.delete = <T = any>(url: string, config?: RequestConfig) =>
		request<T>({ ...config, method: "DELETE", url });

	instance.head = <T = any>(url: string, config?: RequestConfig) =>
		request<T>({ ...config, method: "HEAD", url });

	instance.options = <T = any>(url: string, config?: RequestConfig) =>
		request<T>({ ...config, method: "OPTIONS", url });

	instance.post = <T = any>(url: string, data?: any, config?: RequestConfig) =>
		request<T>({ ...config, method: "POST", url, data });

	instance.put = <T = any>(url: string, data?: any, config?: RequestConfig) =>
		request<T>({ ...config, method: "PUT", url, data });

	instance.patch = <T = any>(url: string, data?: any, config?: RequestConfig) =>
		request<T>({ ...config, method: "PATCH", url, data });

	return instance;
}

export const api = createApiInstance();
