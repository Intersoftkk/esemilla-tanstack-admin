import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";

import { SCHOOL_KEYS } from "#/features/schools/queries/school.keys.ts";
import {
	checkSlugAvailabilityFn,
	createSchoolFn,
	deleteSchoolFn,
	getSchoolByIdFn,
	getSchoolPlansFn,
	getSchoolsFn,
	updateSchoolFn,
	updateSchoolStatusFn,
} from "#/features/schools/server/school.functions.ts";
import type {
	OnboardSchoolPayload,
	SchoolListFilters,
	SchoolStatus,
	UpdateSchoolPayload,
} from "#/features/schools/types/schools.type.ts";
import { getApiErrorMessage } from "#/features/schools/utils/school.utils.ts";

export function useSchoolsQuery(filters?: SchoolListFilters) {
	const getSchools = useServerFn(getSchoolsFn);

	return useQuery({
		queryKey: SCHOOL_KEYS.lists(filters),
		queryFn: () => getSchools({ data: filters ?? {} }),
		staleTime: 1000 * 60 * 2,
	});
}

export function useSchoolQuery(id: string) {
	const getSchool = useServerFn(getSchoolByIdFn);

	return useQuery({
		queryKey: SCHOOL_KEYS.detail(id),
		queryFn: () => getSchool({ data: id }),
		enabled: Boolean(id),
		staleTime: 1000 * 60 * 2,
	});
}

export function useSchoolPlansQuery() {
	const getPlans = useServerFn(getSchoolPlansFn);

	return useQuery({
		queryKey: SCHOOL_KEYS.plans(),
		queryFn: () => getPlans(),
		staleTime: 1000 * 60 * 15,
	});
}

export function useSlugAvailabilityQuery(slug: string, enabled = true) {
	const checkSlug = useServerFn(checkSlugAvailabilityFn);
	const clean = slug.trim();
	const validFormat =
		clean.length >= 3 &&
		clean.length <= 40 &&
		/^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/.test(clean);

	return useQuery({
		queryKey: SCHOOL_KEYS.slug(clean),
		queryFn: () => checkSlug({ data: { slug: clean } }),
		enabled: enabled && validFormat,
		staleTime: 1000 * 30,
		retry: false,
	});
}

export function useCreateSchoolMutation() {
	const queryClient = useQueryClient();
	const createSchool = useServerFn(createSchoolFn);

	return useMutation({
		mutationFn: (payload: OnboardSchoolPayload) =>
			createSchool({ data: payload }),
		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: SCHOOL_KEYS.all });
			void queryClient.invalidateQueries({ queryKey: ["dashboard"] });
			toast.success("School onboarded successfully.");
		},
		onError: (err) => {
			toast.error(
				getApiErrorMessage(err, "Could not create school workspace."),
			);
		},
	});
}

export function useUpdateSchoolMutation() {
	const queryClient = useQueryClient();
	const updateSchool = useServerFn(updateSchoolFn);

	return useMutation({
		mutationFn: (vars: { id: string; payload: UpdateSchoolPayload }) =>
			updateSchool({ data: vars }),
		onSuccess: (_res, vars) => {
			void queryClient.invalidateQueries({ queryKey: SCHOOL_KEYS.all });
			void queryClient.invalidateQueries({
				queryKey: SCHOOL_KEYS.detail(vars.id),
			});
			void queryClient.invalidateQueries({ queryKey: ["dashboard"] });
			toast.success("School details updated.");
		},
		onError: (err) => {
			toast.error(getApiErrorMessage(err, "Could not update school details."));
		},
	});
}

export function useUpdateSchoolStatusMutation() {
	const queryClient = useQueryClient();
	const updateStatus = useServerFn(updateSchoolStatusFn);

	return useMutation({
		mutationFn: (vars: { id: string; status: SchoolStatus }) =>
			updateStatus({ data: vars }),
		onSuccess: (_res, vars) => {
			void queryClient.invalidateQueries({ queryKey: SCHOOL_KEYS.all });
			void queryClient.invalidateQueries({
				queryKey: SCHOOL_KEYS.detail(vars.id),
			});
			void queryClient.invalidateQueries({ queryKey: ["dashboard"] });
			toast.success(`School status set to ${vars.status}.`);
		},
		onError: (err) => {
			toast.error(getApiErrorMessage(err, "Could not update school status."));
		},
	});
}

export function useDeleteSchoolMutation() {
	const queryClient = useQueryClient();
	const deleteSchool = useServerFn(deleteSchoolFn);

	return useMutation({
		mutationFn: (id: string) => deleteSchool({ data: id }),
		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: SCHOOL_KEYS.all });
			void queryClient.invalidateQueries({ queryKey: ["dashboard"] });
			toast.success("School workspace removed.");
		},
		onError: (err) => {
			toast.error(
				getApiErrorMessage(err, "Could not remove school workspace."),
			);
		},
	});
}
