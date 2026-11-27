import type { TimesheetRecord } from "#/types/timesheet";
import type { EmployeeLeaveRecord } from "#/features/employee-leaves/types/employee-leaves";

export interface NotificationRecord {
	id: string;
	type: string;
	notifiable_type: string;
	notifiable_id: number;
	data: Data;
	read_at: string;
	created_at: string;
	updated_at: string;
}

export interface Data {
	description: string;
	subject: string;
	notification_type: string;
	leave_data: EmployeeLeaveRecord;
	timesheet_data: TimesheetRecord;
	notified_from: NotifiedFrom;
}

export interface NotifiedFrom {
	id: number;
	full_name: string;
	email: string;
	phone_number: string;
}
