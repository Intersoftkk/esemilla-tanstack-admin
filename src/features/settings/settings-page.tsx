// #/features/settings/settings-page.tsx
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Save, Settings2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { PageHeader } from "#/components/page-header.tsx";
import { Badge } from "#/components/ui/badge.tsx";
import { Button } from "#/components/ui/button.tsx";
import { Input } from "#/components/ui/input.tsx";
import { Label } from "#/components/ui/label.tsx";
import {
	NativeSelect,
	NativeSelectOption,
} from "#/components/ui/native-select.tsx";
import { Skeleton } from "#/components/ui/skeleton.tsx";
import { Switch } from "#/components/ui/switch.tsx";
import { PLATFORM_PERMISSIONS } from "#/config/permissions.config.ts";
import { usePermission } from "#/features/auth/hooks/use-permission.ts";
import {
	getSettingGroupsFn,
	updateSettingsBulkFn,
} from "#/features/settings/server/settings.functions.ts";
import type {
	SettingChange,
	SettingField,
	SettingGroup,
	SettingValue,
} from "#/features/settings/types/settings.type.ts";

/** Stable keys for the loading skeleton cards. */
const SKELETON_CARD_KEYS = ["one", "two", "three", "four"] as const;

/** Platform settings, grouped by section, persisted through the admin API. */
export function SettingsPage() {
	const { hasPermission } = usePermission();
	const canEdit = hasPermission(PLATFORM_PERMISSIONS.PlatformSettingEdit);
	const queryClient = useQueryClient();

	const { data, isLoading, error } = useQuery({
		queryKey: ["settings", "groups"],
		queryFn: () => getSettingGroupsFn(),
	});

	const [draft, setDraft] = useState<Record<string, SettingValue>>({});

	useEffect(() => {
		if (!data) return;
		setDraft(
			Object.fromEntries(
				data.flatMap((group) =>
					group.fields.map((field) => [field.key, field.value]),
				),
			),
		);
	}, [data]);

	const changes = useMemo<Array<SettingChange>>(() => {
		if (!data) return [];
		return data
			.flatMap((group) => group.fields)
			.filter(
				(field) =>
					draft[field.key] !== undefined && draft[field.key] !== field.value,
			)
			.map((field) => ({ key: field.key, value: draft[field.key] }));
	}, [data, draft]);

	const saveMutation = useMutation({
		mutationFn: (payload: Array<SettingChange>) =>
			updateSettingsBulkFn({ data: { changes: payload } }),
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: ["settings", "groups"] });
			toast.success("Platform settings saved");
		},
		onError: (mutationError: unknown) => {
			toast.error(
				mutationError instanceof Error
					? mutationError.message
					: "Could not save the settings",
			);
		},
	});

	const updateField = (key: string, value: SettingValue) => {
		setDraft((current) => ({ ...current, [key]: value }));
	};

	return (
		<div className="space-y-6">
			<PageHeader
				title="Platform settings"
				description="Global configuration used across every tenant."
				icon={Settings2}
				badge={<Badge variant="secondary">Platform-wide</Badge>}
				actions={
					canEdit ? (
						<Button
							onClick={() => saveMutation.mutate(changes)}
							disabled={changes.length === 0 || saveMutation.isPending}
						>
							{saveMutation.isPending ? (
								<Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
							) : (
								<Save className="size-3.5" aria-hidden="true" />
							)}
							Save changes
							{changes.length > 0 && (
								<span className="rounded-full bg-primary-foreground/20 px-1.5 text-[10px] tabular-nums">
									{changes.length}
								</span>
							)}
						</Button>
					) : null
				}
			/>

			{isLoading && (
				<div className="grid gap-4 lg:grid-cols-2">
					{SKELETON_CARD_KEYS.map((key) => (
						<Skeleton key={`setting-skeleton-${key}`} className="h-40 w-full" />
					))}
				</div>
			)}

			{!isLoading && error && (
				<div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
					{error instanceof Error
						? error.message
						: "Could not load the settings."}
				</div>
			)}

			{!isLoading && !error && (data?.length ?? 0) === 0 && (
				<div className="rounded-xl border border-dashed border-border/70 p-8 text-center text-sm text-muted-foreground">
					No platform settings have been defined yet.
				</div>
			)}

			<div className="grid gap-4 lg:grid-cols-2">
				{data?.map((group) => (
					<SettingGroupCard
						key={group.key}
						group={group}
						draft={draft}
						disabled={!canEdit}
						onChange={updateField}
					/>
				))}
			</div>
		</div>
	);
}

interface SettingGroupCardProps {
	group: SettingGroup;
	draft: Record<string, SettingValue>;
	disabled: boolean;
	onChange: (key: string, value: SettingValue) => void;
}

/** One settings section with its fields. */
function SettingGroupCard({
	group,
	draft,
	disabled,
	onChange,
}: SettingGroupCardProps) {
	return (
		<section className="rounded-2xl border border-border/70 bg-card p-5">
			<header>
				<h2 className="text-sm font-semibold capitalize text-foreground">
					{group.label}
				</h2>
				{group.description && (
					<p className="mt-1 text-xs text-muted-foreground">
						{group.description}
					</p>
				)}
			</header>

			<div className="mt-4 space-y-4">
				{group.fields.length === 0 && (
					<p className="text-xs text-muted-foreground">
						This section is empty.
					</p>
				)}

				{group.fields.map((field) => (
					<SettingFieldControl
						key={field.key}
						field={field}
						value={draft[field.key] ?? field.value}
						disabled={disabled}
						onChange={(value) => onChange(field.key, value)}
					/>
				))}
			</div>
		</section>
	);
}

interface SettingFieldControlProps {
	field: SettingField;
	value: SettingValue;
	disabled: boolean;
	onChange: (value: SettingValue) => void;
}

/** Renders the right control for a setting's declared type. */
function SettingFieldControl({
	field,
	value,
	disabled,
	onChange,
}: SettingFieldControlProps) {
	const inputId = `setting-${field.key.replace(/[^a-zA-Z0-9]+/g, "-")}`;
	const description = field.description ? (
		<p className="mt-1 text-[11px] text-muted-foreground">
			{field.description}
		</p>
	) : null;

	if (field.type === "boolean") {
		return (
			<div className="flex items-start justify-between gap-4">
				<div className="min-w-0">
					<Label htmlFor={inputId} className="text-xs font-medium capitalize">
						{field.label}
					</Label>
					{description}
				</div>
				<Switch
					id={inputId}
					checked={Boolean(value)}
					disabled={disabled}
					onCheckedChange={(checked) => onChange(checked)}
				/>
			</div>
		);
	}

	if (field.type === "select" && field.options.length > 0) {
		return (
			<div>
				<Label htmlFor={inputId} className="text-xs font-medium capitalize">
					{field.label}
				</Label>
				<NativeSelect
					id={inputId}
					className="mt-1.5 w-full"
					value={String(value)}
					disabled={disabled}
					onChange={(event) => onChange(event.target.value)}
				>
					{field.options.map((option) => (
						<NativeSelectOption key={option} value={option}>
							{option}
						</NativeSelectOption>
					))}
				</NativeSelect>
				{description}
			</div>
		);
	}

	return (
		<div>
			<Label htmlFor={inputId} className="text-xs font-medium capitalize">
				{field.label}
			</Label>
			<Input
				id={inputId}
				className="mt-1.5"
				type={field.type === "number" ? "number" : "text"}
				value={String(value)}
				disabled={disabled}
				onChange={(event) =>
					onChange(
						field.type === "number"
							? Number(event.target.value)
							: event.target.value,
					)
				}
			/>
			{description}
		</div>
	);
}
