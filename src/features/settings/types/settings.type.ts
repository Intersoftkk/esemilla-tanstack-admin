// #/features/settings/types/settings.type.ts

export type SettingValue = string | number | boolean;

export interface SettingField {
	key: string;
	label: string;
	/** `string` | `text` | `number` | `boolean` | `select` | `json` */
	type: string;
	value: SettingValue;
	description: string | null;
	options: Array<string>;
}

export interface SettingGroup {
	key: string;
	label: string;
	description: string | null;
	fields: Array<SettingField>;
}

export interface SettingChange {
	key: string;
	value: SettingValue;
}
