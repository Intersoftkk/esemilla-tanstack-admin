// #/features/auth/schema/otp.schema.ts
import { z } from "zod";

export const otpSchema = z.object({
	email: z.string().email(),
	otp: z
		.string()
		.min(1, "Code is required")
		.regex(/^\d{6}$/, "Enter the 6-digit code"),
});

export type OtpFormData = z.infer<typeof otpSchema>;
