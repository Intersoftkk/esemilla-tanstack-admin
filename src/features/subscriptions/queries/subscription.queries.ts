// #/features/subscriptions/queries/subscription.queries.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { SUBSCRIPTION_KEYS } from "#/features/subscriptions/queries/subscription.keys.ts";
import type { FeatureFormData } from "#/features/subscriptions/schema/features.schema.ts";
import type { SubscriptionFormData } from "#/features/subscriptions/schema/subscriptions-form.schema.ts";
import type { SubscriptionsListParams } from "#/features/subscriptions/schema/subscriptions-search.schema.ts";
import {
	attachFeatures,
	createFeature,
	createSubscription,
	deleteFeature,
	deleteSubscription,
	deleteSubscriptions,
	fetchCompanies,
	fetchFeatures,
	fetchPaginatedSubscriptions,
	fetchSubscriptionFeatures,
	syncFeatures,
	updateFeature,
	updateSubscription,
} from "#/features/subscriptions/service/subscriptions.service.ts";

interface SubscriptionMutationOptions {
	/** Called after the cache has been invalidated and the toast shown. */
	onSuccess?: () => void;
}

/** Returns an error message suitable for a toast. */
function getErrorMessage(error: unknown, fallback: string): string {
	return error instanceof Error && error.message ? error.message : fallback;
}

/** Paginated subscriptions list, keyed by the current table state. */
export function useSubscriptionsPaginateQuery(params: SubscriptionsListParams) {
	return useQuery({
		queryKey: SUBSCRIPTION_KEYS.lists(params),
		queryFn: () => fetchPaginatedSubscriptions(params),
	});
}

/** Companies available for assignment when creating or editing a subscription. */
export function useCompaniesQuery() {
	return useQuery({
		queryKey: SUBSCRIPTION_KEYS.companies(),
		queryFn: fetchCompanies,
		staleTime: 1000 * 60 * 5,
	});
}

/** Creates a subscription. */
export function useCreateSubscriptionMutation(
	options?: SubscriptionMutationOptions,
) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (payload: SubscriptionFormData) => createSubscription(payload),
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: SUBSCRIPTION_KEYS.all });
			toast.success("Subscription created successfully.");
			options?.onSuccess?.();
		},
		onError: (error) =>
			toast.error(getErrorMessage(error, "Could not create subscription.")),
	});
}

/** Updates an existing subscription. */
export function useUpdateSubscriptionMutation(
	options?: SubscriptionMutationOptions,
) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			id,
			payload,
		}: {
			id: string;
			payload: SubscriptionFormData;
		}) => updateSubscription(id, payload),
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: SUBSCRIPTION_KEYS.all });
			toast.success("Subscription updated successfully.");
			options?.onSuccess?.();
		},
		onError: (error) =>
			toast.error(getErrorMessage(error, "Could not update subscription.")),
	});
}

/** Deletes a single subscription. */
export function useDeleteSubscriptionMutation(
	options?: SubscriptionMutationOptions,
) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: string) => deleteSubscription(id),
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: SUBSCRIPTION_KEYS.all });
			toast.success("Subscription deleted successfully.");
			options?.onSuccess?.();
		},
		onError: (error) =>
			toast.error(getErrorMessage(error, "Could not delete subscription.")),
	});
}

/** Deletes the selected subscriptions in one batch. */
export function useDeleteSubscriptionsMutation(
	options?: SubscriptionMutationOptions,
) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (ids: string[]) => deleteSubscriptions(ids),
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: SUBSCRIPTION_KEYS.all });
			toast.success("Selected subscriptions deleted successfully.");
			options?.onSuccess?.();
		},
		onError: (error) =>
			toast.error(getErrorMessage(error, "Could not delete subscriptions.")),
	});
}

/** Feature catalog available to subscriptions. */
export function useFeaturesQuery(enabled = true) {
	return useQuery({
		queryKey: SUBSCRIPTION_KEYS.features(),
		queryFn: fetchFeatures,
		enabled,
		staleTime: 1000 * 60 * 5,
	});
}

/** Features already assigned to a subscription. */
export function useSubscriptionFeaturesQuery(
	subscriptionId?: string,
	enabled = true,
) {
	return useQuery({
		queryKey: SUBSCRIPTION_KEYS.subscriptionFeatures(subscriptionId ?? ""),
		queryFn: () => fetchSubscriptionFeatures(subscriptionId as string),
		enabled: enabled && Boolean(subscriptionId),
	});
}

/** Attaches selected features to a subscription without removing existing ones. */
export function useAttachSubscriptionFeaturesMutation(
	options?: SubscriptionMutationOptions,
) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, featureIds }: { id: string; featureIds: string[] }) =>
			attachFeatures(id, featureIds),
		onSuccess: async (_result, variables) => {
			await Promise.all([
				queryClient.invalidateQueries({ queryKey: SUBSCRIPTION_KEYS.all }),
				queryClient.invalidateQueries({
					queryKey: SUBSCRIPTION_KEYS.subscriptionFeatures(variables.id),
				}),
			]);
			toast.success("Features attached to the subscription.");
			options?.onSuccess?.();
		},
		onError: (error) =>
			toast.error(getErrorMessage(error, "Could not attach features.")),
	});
}

/** Replaces a subscription's features with the selected list. */
export function useSyncSubscriptionFeaturesMutation(
	options?: SubscriptionMutationOptions,
) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, featureIds }: { id: string; featureIds: string[] }) =>
			syncFeatures(id, featureIds),
		onSuccess: async (_result, variables) => {
			await Promise.all([
				queryClient.invalidateQueries({ queryKey: SUBSCRIPTION_KEYS.all }),
				queryClient.invalidateQueries({
					queryKey: SUBSCRIPTION_KEYS.subscriptionFeatures(variables.id),
				}),
			]);
			toast.success("Subscription features synchronized.");
			options?.onSuccess?.();
		},
		onError: (error) =>
			toast.error(getErrorMessage(error, "Could not sync features.")),
	});
}

/** Creates a feature in the catalog. */
export function useCreateFeatureMutation(
	options?: SubscriptionMutationOptions,
) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (payload: FeatureFormData) => createFeature(payload),
		onSuccess: async () => {
			await Promise.all([
				queryClient.invalidateQueries({
					queryKey: SUBSCRIPTION_KEYS.features(),
				}),
				queryClient.invalidateQueries({ queryKey: SUBSCRIPTION_KEYS.all }),
			]);
			toast.success("Feature created.");
			options?.onSuccess?.();
		},
		onError: (error) =>
			toast.error(getErrorMessage(error, "Could not create feature.")),
	});
}

/** Updates a feature in the catalog. */
export function useUpdateFeatureMutation(
	options?: SubscriptionMutationOptions,
) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, payload }: { id: string; payload: FeatureFormData }) =>
			updateFeature(id, payload),
		onSuccess: async () => {
			await Promise.all([
				queryClient.invalidateQueries({
					queryKey: SUBSCRIPTION_KEYS.features(),
				}),
				queryClient.invalidateQueries({ queryKey: SUBSCRIPTION_KEYS.all }),
			]);
			toast.success("Feature updated.");
			options?.onSuccess?.();
		},
		onError: (error) =>
			toast.error(getErrorMessage(error, "Could not update feature.")),
	});
}

/** Deletes a feature from the catalog. */
export function useDeleteFeatureMutation(
	options?: SubscriptionMutationOptions,
) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: string) => deleteFeature(id),
		onSuccess: async () => {
			await Promise.all([
				queryClient.invalidateQueries({
					queryKey: SUBSCRIPTION_KEYS.features(),
				}),
				queryClient.invalidateQueries({ queryKey: SUBSCRIPTION_KEYS.all }),
			]);
			toast.success("Feature deleted.");
			options?.onSuccess?.();
		},
		onError: (error) =>
			toast.error(getErrorMessage(error, "Could not delete feature.")),
	});
}
