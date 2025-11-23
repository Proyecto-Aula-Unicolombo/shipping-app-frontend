import { useQuery, useQueryClient } from "@tanstack/react-query";
import { incidentsRepository, type IncidentListParams } from "../repository/incidentsRepository";

const INCIDENTS_QUERY_KEY = ["incidents"] as const;
const INCIDENT_DETAIL_QUERY_KEY = (id: number) => ["incidents", id] as const;

interface UseIncidentsQueryOptions {
    listParams?: IncidentListParams;
    incidentId?: number | null;
}

const fetchIncidents = async (params?: IncidentListParams) => {
    return await incidentsRepository.list(params);
};

const fetchIncidentById = async (id: number) => {
    return await incidentsRepository.get(id);
};

export function useIncidentsQuery(options?: UseIncidentsQueryOptions) {
    const { listParams, incidentId } = options || {};
    const queryClient = useQueryClient();

    // Query for fetching incidents list
    const incidentsQuery = useQuery({
        queryKey: [...INCIDENTS_QUERY_KEY, listParams],
        queryFn: () => fetchIncidents(listParams),
        staleTime: 30 * 1000, // 30 seconds
        refetchInterval: 60 * 1000, // Refetch every 60 seconds
    });

    // Query for fetching single incident
    const incidentDetailQuery = useQuery({
        queryKey: INCIDENT_DETAIL_QUERY_KEY(incidentId!),
        queryFn: () => fetchIncidentById(incidentId!),
        enabled: incidentId !== null && incidentId !== undefined && incidentId > 0,
        staleTime: 30 * 1000,
    });

    return {
        // Incidents list data
        incidents: incidentsQuery.data?.data || [],
        totalIncidents: incidentsQuery.data?.count || 0,
        isLoading: incidentsQuery.isLoading,
        isError: incidentsQuery.isError,
        error: incidentsQuery.error,

        // Incident detail data
        incident: incidentDetailQuery.data,
        isLoadingDetail: incidentDetailQuery.isLoading,
        isErrorDetail: incidentDetailQuery.isError,
        errorDetail: incidentDetailQuery.error,

        // Utility functions
        refetch: incidentsQuery.refetch,
        refetchDetail: incidentDetailQuery.refetch,
        invalidateIncidents: () => queryClient.invalidateQueries({ queryKey: INCIDENTS_QUERY_KEY }),
    };
}
