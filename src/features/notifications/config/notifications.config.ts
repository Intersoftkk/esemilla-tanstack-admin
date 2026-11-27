// #/features/notifications/config/notifications.config.ts
import {
    columnVisibilityFeature,
    rowPaginationFeature,
    rowSelectionFeature,
    rowSortingFeature,
    tableFeatures,
} from '@tanstack/react-table'

/**
 * Sorting and pagination are performed by the API, so no client-side row
 * models are registered here. The features supply the state and APIs used by
 * the shared datatable components.
 */
export const notificationsTableFeatures = tableFeatures({
    rowSelectionFeature,
    rowSortingFeature,
    columnVisibilityFeature,
    rowPaginationFeature,
})
