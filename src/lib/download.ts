/** Triggers a client-side download for an already generated file. */
export function saveBlob(blob: Blob, filename: string): void {
	if (typeof window === "undefined") return;

	const url = URL.createObjectURL(blob);
	const anchor = document.createElement("a");
	anchor.href = url;
	anchor.download = filename;
	document.body.appendChild(anchor);
	anchor.click();
	document.body.removeChild(anchor);
	URL.revokeObjectURL(url);
}

/** Decodes a base64 payload returned by a server function and saves it. */
export function saveBase64File(
	base64: string,
	filename: string,
	contentType = "application/octet-stream",
): void {
	if (typeof window === "undefined") return;

	const binary = atob(base64);
	const bytes = new Uint8Array(binary.length);
	for (let index = 0; index < binary.length; index += 1) {
		bytes[index] = binary.charCodeAt(index);
	}
	saveBlob(new Blob([bytes], { type: contentType }), filename);
}
