import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { vehicleApi } from "@/api/vehicle.api";
import { extractErrorMessage } from "@/api/client";
import { VehicleCard } from "../VehicleCard";
import { VehicleFilters } from "../VehicleFilters";
import { LoadingState, ErrorState, EmptyState } from "@/components/QueryState";
import { Pagination } from "@/components/Pagination";
import type { VehicleSearchParams } from "@/types/vehicle";

const PAGE_SIZE = 9;

export function BrowseVehicles() {
  const [filters, setFilters] = useState<VehicleSearchParams>({});
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["vehicles", filters],
    queryFn: () => vehicleApi.search(filters),
  });

  // Backend search has no page/pageSize params yet — paginating client-side
  // for now. If the vehicle count grows large, move this to real
  // server-side pagination instead (fetching every vehicle up front won't scale).
  useEffect(() => {
    setPage(1);
  }, [filters]);

  const totalPages = data ? Math.max(1, Math.ceil(data.length / PAGE_SIZE)) : 1;
  const pageItems = useMemo(() => {
    if (!data) return [];
    const start = (page - 1) * PAGE_SIZE;
    return data.slice(start, start + PAGE_SIZE);
  }, [data, page]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-display">Browse Vehicles</h1>
      <VehicleFilters value={filters} onChange={setFilters} />

      {isLoading && <LoadingState label="Finding vehicles..." />}
      {isError && (
        <ErrorState message={extractErrorMessage(error)} onRetry={() => refetch()} />
      )}
      {data && data.length === 0 && (
        <EmptyState
          title="No vehicles found."
          subtitle="Try adjusting your search filters."
        />
      )}

      {data && data.length > 0 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {pageItems.map((v) => (
              <VehicleCard key={v.id} vehicle={v} />
            ))}
          </div>
          <Pagination page={page} totalPages={totalPages} onChange={setPage} />
        </>
      )}
    </div>
  );
}
