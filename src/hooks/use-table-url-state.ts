type SearchRecord = Record<string, unknown>;

export type NavigateFn = (opts: {
	search:
		| true
		| SearchRecord
		| ((prev: SearchRecord) => Partial<SearchRecord> | SearchRecord);
	replace?: boolean;
}) => void;
