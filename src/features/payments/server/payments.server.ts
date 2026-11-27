// #/features/payments/server/payments.server.ts

import type { PaymentFormData } from "#/features/payments/schema/payments-form.schema.ts";
import type { PaymentsListParams } from "#/features/payments/schema/payments-search.schema.ts";
import type {
	CompanyOption,
	PaymentRecord,
	PaymentStatus,
} from "#/features/payments/types/payments.type.ts";
import { asRecord, readText, unwrapEntity, unwrapList } from "#/lib/payload.ts";
import { buildQueryParams } from "#/lib/query-builder.ts";
import { api } from "#/server/api.server.ts";
import type { PaginatedResponse } from "#/types";

// Laravel API resource for payments.
const RESOURCE = "/payments";

const PAYMENT_STATUSES: PaymentStatus[] = [
	"draft",
	"active",
	"completed",
	"archived",
];

/** Maps an API status value onto the payment status union. */
function normalizeStatus(value: unknown): PaymentStatus {
	const status = readText(value)?.toLowerCase();
	return PAYMENT_STATUSES.find((item) => item === status) ?? "draft";
}

/** Normalizes an API payload into a payment record. */
export function normalizePayment(value: unknown): PaymentRecord | null {
	const record = asRecord(value);
	const id = readText(record.id, record.uuid);
	if (!id) return null;

	const company = asRecord(record.company);

	return {
		id,
		company_id:
			readText(record.company_id, record.companyId) ??
			readText(company.id) ??
			"",
		company: Object.keys(company).length
			? {
					id: readText(company.id) ?? "",
					name: readText(company.name),
				}
			: null,
		name: readText(record.name) ?? "Untitled payment",
		description: readText(record.description),
		start_date: readText(record.start_date, record.startDate),
		end_date: readText(record.end_date, record.endDate),
		status: normalizeStatus(record.status),
	};
}

/** Normalizes an API payload into a company option. */
function normalizeCompany(value: unknown): CompanyOption | null {
	const record = asRecord(value);
	const id = readText(record.id, record.uuid);
	if (!id) return null;
	return { id, name: readText(record.name) };
}

/** Fetches a paginated list of payments from the backend. */
export async function fetchPayments(
	params: PaymentsListParams,
): Promise<PaginatedResponse<PaymentRecord>> {
	const queryString = buildQueryParams({
		sorting: params.sorting,
		filters: params.filters,
		pagination: params.pagination,
	});

	const { data } = await api.get<unknown>(
		`${RESOURCE}${queryString ? `?${queryString}` : ""}`,
	);

	const root = asRecord(data);
	const envelope = asRecord(root.data);
	const payload = Object.keys(envelope).length ? envelope : root;
	const records = unwrapList(payload)
		.map(normalizePayment)
		.filter((item): item is PaymentRecord => item !== null);

	const total = Number(payload.total ?? records.length);
	const perPage = Number(payload.per_page ?? params.pagination?.pageSize ?? 10);
	const currentPage = Number(payload.current_page ?? 1);

	return {
		current_page: currentPage,
		from: Number(payload.from ?? 0),
		last_page: Number(
			payload.last_page ?? Math.ceil(total / Math.max(perPage, 1)),
		),
		links: Array.isArray(payload.links) ? payload.links : [],
		path: readText(payload.path) ?? RESOURCE,
		per_page: perPage,
		to: Number(payload.to ?? 0),
		total,
		data: records,
	};
}

/** Fetches a single payment by ID. */
export async function fetchPayment(id: string): Promise<PaymentRecord> {
	const { data } = await api.get<unknown>(
		`${RESOURCE}/${encodeURIComponent(id)}`,
	);
	const payment = normalizePayment(unwrapEntity(data) ?? data);
	if (!payment) throw new Error("Payment record could not be parsed.");
	return payment;
}

/** Creates a payment in the backend. */
export async function createPaymentRequest(
	payload: PaymentFormData,
): Promise<PaymentRecord> {
	const { data } = await api.post<unknown>(RESOURCE, payload);
	const payment = normalizePayment(unwrapEntity(data) ?? data);
	if (!payment) throw new Error("Created payment could not be parsed.");
	return payment;
}

/** Updates an existing payment in the backend. */
export async function updatePaymentRequest(
	id: string,
	payload: PaymentFormData,
): Promise<PaymentRecord> {
	const { data } = await api.put<unknown>(
		`${RESOURCE}/${encodeURIComponent(id)}`,
		payload,
	);
	const payment = normalizePayment(unwrapEntity(data) ?? data);
	if (!payment) throw new Error("Updated payment could not be parsed.");
	return payment;
}

/** Deletes a payment from the backend. */
export async function deletePaymentRequest(id: string): Promise<void> {
	await api.delete(`${RESOURCE}/${encodeURIComponent(id)}`);
}

/** Fetches companies available for payment assignment. */
export async function fetchCompanies(): Promise<CompanyOption[]> {
	try {
		const { data } = await api.get<unknown>("/companies", {
			params: { per_page: 100 },
		});
		return unwrapList(data)
			.map(normalizeCompany)
			.filter((item): item is CompanyOption => item !== null);
	} catch (error) {
		console.error("Failed to load companies for payments:", error);
		return [];
	}
}
