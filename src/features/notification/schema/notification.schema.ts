import { z } from "zod";

export const notificationRecordSchema = z.object({
	id: z.string().min(1),
	type: z.string(),
	notifiable_type: z.string().optional(),
	notifiable_id: z.string().optional(),
	title: z.string().min(1),
	message: z.string(),
	data: z.record(z.string(), z.unknown()).default({}),
	read_at: z.string().nullable(),
	created_at: z.string(),
	updated_at: z.string(),
});

export type NotificationRecord = z.infer<typeof notificationRecordSchema>;

export const notificationIdSchema = z
	.string()
	.min(1, "Notification ID is required");

export const markNotificationReadSchema = z.object({
	id: notificationIdSchema,
});

export const deleteNotificationSchema = z.object({
	id: notificationIdSchema,
});

export const bulkNotificationActionSchema = z.object({
	ids: z
		.array(notificationIdSchema)
		.min(1, "At least one notification ID is required"),
});

export const createNotificationSchema = z.object({
	recipient_id: z.string().min(1, "Recipient ID is required"),
	title: z.string().min(1, "Title is required"),
	message: z.string().min(1, "Message is required"),
	type: z.string().default("info"),
	data: z.record(z.string(), z.unknown()).optional(),
});

export type MarkNotificationReadInput = z.infer<
	typeof markNotificationReadSchema
>;
export type DeleteNotificationInput = z.infer<typeof deleteNotificationSchema>;
export type BulkNotificationActionInput = z.infer<
	typeof bulkNotificationActionSchema
>;
export type CreateNotificationInput = z.infer<typeof createNotificationSchema>;
