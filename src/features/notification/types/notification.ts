export interface NotifiedFrom {
	id: number;
	full_name: string;
	email: string;
	phone_number: string;
}

export interface Data {
	description: string;
	subject: string;
	notification_type: string;
	notified_from?: NotifiedFrom | null;
}

export interface NotificationRecord {
	id: string;
	type: string;
	notifiable_type: string;
	notifiable_id: number;
	data: Data;
	read_at: string | null;
	created_at: string;
	updated_at: string;
}

export interface NotificationsResponse {
	data: NotificationRecord[];
	unread_count: number;
	total?: number;
	current_page?: number;
	last_page?: number;
}
