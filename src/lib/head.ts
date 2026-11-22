const APP_NAME = "SchoolPortal";

/**
 * Page-level `<head>` used by routes: browser title plus an optional
 * description. Root-level defaults (charset, viewport, icons) live in
 * `routes/__root.tsx`.
 */
export function pageHead(title: string, description?: string) {
	return {
		meta: [
			{ title: `${title} · ${APP_NAME}` },
			...(description ? [{ name: "description", content: description }] : []),
		],
	};
}
