import { z } from "zod";

export const broadcastAuthSchema = z.object({
	socket_id: z.string(),
	channel_name: z.string(),
});

export type BroadcastFormData = z.infer<typeof broadcastAuthSchema>;
