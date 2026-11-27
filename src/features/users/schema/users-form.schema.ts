// #/features/users/schema/users-form.schema.ts
import { z } from "zod";

export const userSchema = z
	.object({
		company_id: z.string().min(1, "Company is required"),
		name: z.string().min(1, "User name is required"),
		description: z.string().optional(),
		start_date: z.string().min(1, "Start date is required"),
		end_date: z.string().min(1, "End date is required"),
		status: z.enum(["draft", "active", "completed", "archived"]),
	})
	.superRefine((data, ctx) => {
		if (data.end_date < data.start_date) {
			ctx.addIssue({
				code: "custom",
				path: ["end_date"],
				message: "End date must be on or after the start date",
			});
		}
	});

export type UserFormData = z.infer<typeof userSchema>;
