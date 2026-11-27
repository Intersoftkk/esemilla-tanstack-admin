// #/features/users/config/users.config.ts
import {
	columnVisibilityFeature,
	rowPaginationFeature,
	rowSelectionFeature,
	rowSortingFeature,
	tableFeatures,
} from "@tanstack/react-table";

/**
 * Sorting and pagination are performed by the API, so no client-side row
 * models are registered here. The features supply the state and APIs used by
 * the shared datatable components.
 */
export const usersTableFeatures = tableFeatures({
	rowSelectionFeature,
	rowSortingFeature,
	columnVisibilityFeature,
	rowPaginationFeature,
});
