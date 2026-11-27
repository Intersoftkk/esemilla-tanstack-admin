// #/features/payments/server/payments.functions.ts
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { paymentSchema } from "#/features/payments/schema/payments-form.schema.ts";
import { paymentsListParamsSchema } from "#/features/payments/schema/payments-search.schema.ts";
import {
	createPaymentRequest,
	deletePaymentRequest,
	fetchCompanies,
	fetchPayment,
	fetchPayments,
	updatePaymentRequest,
} from "#/features/payments/server/payments.server.ts";

const paymentIdSchema = z.union([z.string(), z.number()]).transform(String);

const updatePaymentSchema = z.object({
	id: paymentIdSchema,
	payload: paymentSchema,
});

/** Server function: paginated payments list. */
export const getPaymentsFn = createServerFn({ method: "GET" })
	.validator((data: unknown) => paymentsListParamsSchema.parse(data ?? {}))
	.handler(async ({ data }) => fetchPayments(data));

/** Server function: a single payment by ID. */
export const getPaymentFn = createServerFn({ method: "GET" })
	.validator((data: unknown) => paymentIdSchema.parse(data))
	.handler(async ({ data: id }) => fetchPayment(id));

/** Server function: companies available for payment assignment. */
export const getCompaniesFn = createServerFn({ method: "GET" }).handler(
	async () => fetchCompanies(),
);

/** Server function: create a payment. */
export const createPaymentFn = createServerFn({ method: "POST" })
	.validator((data: unknown) => paymentSchema.parse(data))
	.handler(async ({ data }) => createPaymentRequest(data));

/** Server function: update a payment. */
export const updatePaymentFn = createServerFn({ method: "POST" })
	.validator((data: unknown) => updatePaymentSchema.parse(data))
	.handler(async ({ data }) => updatePaymentRequest(data.id, data.payload));

/** Server function: delete a payment. */
export const deletePaymentFn = createServerFn({ method: "POST" })
	.validator((data: unknown) => paymentIdSchema.parse(data))
	.handler(async ({ data: id }) => deletePaymentRequest(id));

/** Server function: delete several payments in one request. */
export const deletePaymentsFn = createServerFn({ method: "POST" })
	.validator((data: unknown) => z.array(paymentIdSchema).min(1).parse(data))
	.handler(async ({ data: ids }) => {
		await Promise.all(ids.map((id) => deletePaymentRequest(id)));
		return { deleted: ids.length };
	});
